import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Brain, Heart, Moon, Zap, Activity } from 'lucide-react';

interface OnboardingQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: FrequencyProfile) => void;
}

interface FrequencyProfile {
  primaryGoal: string;
  stressLevel: number;
  sleepQuality: number;
  meditationExperience: string;
  preferredDuration: string;
  recommendedFrequencies: number[];
}

const questions = [
  {
    id: 'goal',
    question: 'What is your primary wellness goal?',
    options: [
      { value: 'stress', label: 'Reduce Stress & Anxiety', icon: Heart, color: 'text-rose-400' },
      { value: 'focus', label: 'Improve Focus & Clarity', icon: Brain, color: 'text-blue-400' },
      { value: 'sleep', label: 'Better Sleep Quality', icon: Moon, color: 'text-indigo-400' },
      { value: 'energy', label: 'Boost Energy & Vitality', icon: Zap, color: 'text-amber-400' },
      { value: 'healing', label: 'Physical Healing & Recovery', icon: Activity, color: 'text-emerald-400' },
      { value: 'creativity', label: 'Enhance Creativity', icon: Sparkles, color: 'text-violet-400' },
    ],
  },
  {
    id: 'stress',
    question: 'How would you rate your current stress level?',
    type: 'slider',
    min: 1,
    max: 10,
    labels: ['Very Low', 'Moderate', 'Very High'],
  },
  {
    id: 'sleep',
    question: 'How would you rate your sleep quality?',
    type: 'slider',
    min: 1,
    max: 10,
    labels: ['Poor', 'Average', 'Excellent'],
  },
  {
    id: 'experience',
    question: 'What is your meditation experience level?',
    options: [
      { value: 'none', label: 'Complete Beginner', desc: 'Never meditated before' },
      { value: 'some', label: 'Some Experience', desc: 'Occasional practice' },
      { value: 'regular', label: 'Regular Practitioner', desc: '3+ times per week' },
      { value: 'advanced', label: 'Advanced', desc: 'Daily practice for 1+ years' },
    ],
  },
  {
    id: 'duration',
    question: 'How much time can you dedicate per session?',
    options: [
      { value: '5-10', label: '5-10 minutes', desc: 'Quick reset' },
      { value: '15-20', label: '15-20 minutes', desc: 'Standard session' },
      { value: '25-35', label: '25-35 minutes', desc: 'Deep practice' },
      { value: '40+', label: '40+ minutes', desc: 'Extended journey' },
    ],
  },
];

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    goal: '',
    stress: 5,
    sleep: 5,
    experience: '',
    duration: '',
  });

  if (!isOpen) return null;

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Generate recommendations
      const freqMap: Record<string, number[]> = {
        stress: [396, 528, 174],
        focus: [741, 417, 852],
        sleep: [174, 528, 639],
        energy: [852, 432, 741],
        healing: [528, 285, 639],
        creativity: [741, 963, 852],
      };

      onComplete({
        primaryGoal: answers.goal,
        stressLevel: answers.stress,
        sleepQuality: answers.sleep,
        meditationExperience: answers.experience,
        preferredDuration: answers.duration,
        recommendedFrequencies: freqMap[answers.goal] || [528, 432, 396],
      });
    }
  };

  const canProceed = () => {
    const q = currentQuestion;
    if (q.type === 'slider') return true;
    return !!answers[q.id];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#12122a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-white font-medium text-sm">Frequency Profile</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-gray-600 text-xs mt-2">Step {step + 1} of {questions.length}</p>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-white text-lg font-semibold mb-6">{currentQuestion.question}</h3>

          {currentQuestion.type === 'slider' ? (
            <div className="py-4">
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                value={answers[currentQuestion.id]}
                onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-500 [&::-webkit-slider-thumb]:to-teal-400 [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="flex justify-between mt-3">
                {currentQuestion.labels?.map((label, i) => (
                  <span key={i} className="text-gray-500 text-xs">{label}</span>
                ))}
              </div>
              <p className="text-center text-3xl font-bold text-white mt-4">{answers[currentQuestion.id]}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {currentQuestion.options?.map(option => (
                <button
                  key={option.value}
                  onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option.value })}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                    answers[currentQuestion.id] === option.value
                      ? 'bg-indigo-500/20 border border-indigo-500/30'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  {'icon' in option && option.icon && (
                    <option.icon className={`w-5 h-5 ${'color' in option ? option.color : 'text-gray-400'}`} />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${answers[currentQuestion.id] === option.value ? 'text-white' : 'text-gray-300'}`}>
                      {option.label}
                    </p>
                    {'desc' in option && option.desc && (
                      <p className="text-gray-500 text-xs mt-0.5">{option.desc}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm transition-all ${
              step > 0 ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'invisible'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:scale-105'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            {step === questions.length - 1 ? 'Get Recommendations' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;
