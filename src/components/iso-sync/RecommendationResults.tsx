import React from 'react';
import { Sparkles, Play, X, Waves } from 'lucide-react';
import { sessions, solfeggioFrequencies } from '@/data/sessions';

interface RecommendationResultsProps {
  profile: {
    primaryGoal: string;
    stressLevel: number;
    sleepQuality: number;
    meditationExperience: string;
    preferredDuration: string;
    recommendedFrequencies: number[];
  };
  onClose: () => void;
  onStartSession: (sessionId: string) => void;
}

const goalLabels: Record<string, string> = {
  stress: 'Stress Relief',
  focus: 'Focus Enhancement',
  sleep: 'Sleep Optimization',
  energy: 'Energy Boost',
  healing: 'Physical Healing',
  creativity: 'Creative Expansion',
};

const RecommendationResults: React.FC<RecommendationResultsProps> = ({ profile, onClose, onStartSession }) => {
  const recommendedSessions = sessions
    .filter(s => profile.recommendedFrequencies.includes(s.frequency))
    .slice(0, 4);

  const recommendedFreqs = solfeggioFrequencies.filter(f => profile.recommendedFrequencies.includes(f.hz));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#12122a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-white font-medium">Your Frequency Profile</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Goal */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Primary Goal</p>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
              {goalLabels[profile.primaryGoal] || 'Wellness'}
            </h3>
          </div>

          {/* Recommended Frequencies */}
          <div className="mb-6">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Your Frequency Prescription</p>
            <div className="flex items-center gap-3">
              {recommendedFreqs.map(freq => (
                <div key={freq.hz} className="flex-1 p-3 rounded-xl text-center" style={{ backgroundColor: `${freq.color}10`, border: `1px solid ${freq.color}30` }}>
                  <Waves className="w-4 h-4 mx-auto mb-1" style={{ color: freq.color }} />
                  <p className="text-white text-lg font-bold">{freq.hz}</p>
                  <p className="text-xs" style={{ color: freq.color }}>{freq.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase">Stress Level</p>
              <p className="text-white font-medium">{profile.stressLevel}/10</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase">Sleep Quality</p>
              <p className="text-white font-medium">{profile.sleepQuality}/10</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase">Experience</p>
              <p className="text-white font-medium capitalize">{profile.meditationExperience || 'Beginner'}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <p className="text-gray-500 text-[10px] uppercase">Session Length</p>
              <p className="text-white font-medium">{profile.preferredDuration || '15-20'} min</p>
            </div>
          </div>

          {/* Recommended Sessions */}
          <div className="mb-6">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Recommended Sessions</p>
            <div className="space-y-2">
              {recommendedSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => onStartSession(session.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <img src={session.image} alt={session.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">{session.title}</p>
                    <p className="text-gray-500 text-xs">{session.frequency} Hz · {session.duration} min</p>
                  </div>
                  <Play className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium text-sm hover:scale-[1.02] transition-all"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults;
