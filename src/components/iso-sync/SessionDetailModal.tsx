import React from 'react';
import { X, Play, Clock, Zap, Brain, Target, Waves, BookOpen } from 'lucide-react';
import { Session } from '@/data/sessions';

interface SessionDetailModalProps {
  session: Session | null;
  onClose: () => void;
  onStartSession: (session: Session) => void;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose, onStartSession }) => {
  if (!session) return null;

  const difficultyColors = {
    beginner: 'text-teal-400 bg-teal-400/10',
    intermediate: 'text-amber-400 bg-amber-400/10',
    advanced: 'text-rose-400 bg-rose-400/10',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-[#12122a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56">
          <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12122a] via-[#12122a]/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Frequency badge */}
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 text-indigo-300 text-sm font-mono flex items-center gap-2">
              <Waves className="w-4 h-4" />
              {session.frequency} Hz
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${difficultyColors[session.difficulty]}`}>
              {session.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{session.title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{session.description}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <Clock className="w-4 h-4 text-gray-500 mx-auto mb-1" />
              <p className="text-white text-sm font-medium">{session.duration} min</p>
              <p className="text-gray-600 text-[10px]">Duration</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <Brain className="w-4 h-4 text-gray-500 mx-auto mb-1" />
              <p className="text-white text-sm font-medium">{session.brainwaveTarget.split(' ')[0]}</p>
              <p className="text-gray-600 text-[10px]">Brainwave</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <Target className="w-4 h-4 text-gray-500 mx-auto mb-1" />
              <p className="text-white text-sm font-medium">{session.frequencyName.split(' ')[0]}</p>
              <p className="text-gray-600 text-[10px]">Solfeggio</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Therapeutic Benefits
            </h3>
            <div className="flex flex-wrap gap-2">
              {session.benefits.map((benefit, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs">
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Protocol Details */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-white text-sm font-medium mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              Session Protocol
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>1. Find a comfortable position and put on headphones</p>
              <p>2. Close your eyes and take 3 deep breaths</p>
              <p>3. The {session.frequency} Hz frequency will begin with a gentle fade-in</p>
              <p>4. Allow the vibrations to guide your awareness inward</p>
              <p>5. Biofeedback will adjust intensity based on your response</p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => onStartSession(session)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-2xl shadow-indigo-500/20"
          >
            <Play className="w-6 h-6 fill-white" />
            Begin Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
