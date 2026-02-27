import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Play, Pause, Clock, Zap, Heart, Bookmark } from 'lucide-react';
import { Session } from '@/data/sessions';

interface SessionCardProps {
  session: Session;
  onPlay: (session: Session) => void;
  onSelect: (session: Session) => void;
  isPlaying: boolean;
}

const difficultyColors = {
  beginner: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  advanced: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

const categoryColors: Record<string, string> = {
  'stress-relief': 'from-rose-500/20 to-orange-500/20',
  'focus': 'from-blue-500/20 to-cyan-500/20',
  'sleep': 'from-indigo-500/20 to-purple-500/20',
  'energy': 'from-amber-500/20 to-yellow-500/20',
  'healing': 'from-emerald-500/20 to-teal-500/20',
  'creativity': 'from-violet-500/20 to-pink-500/20',
};

const SessionCard: React.FC<SessionCardProps> = ({ session, onPlay, onSelect, isPlaying }) => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  return (
    <div
      className="group relative bg-[#12122a]/80 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer"
      onClick={() => onSelect(session)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={session.image}
          alt={session.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${categoryColors[session.category] || 'from-indigo-500/20 to-transparent'} to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12122a] via-transparent to-transparent" />
        
        {/* Play button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (session.premium && !user) {
              openAuthModal('signin');
              return;
            }
            onPlay(session);
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white fill-white" />
          ) : (
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          )}
        </button>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${difficultyColors[session.difficulty]}`}>
            {session.difficulty}
          </span>
          {session.premium && (
            <span className="ml-2 px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-yellow-600 text-black">Premium</span>
          )}
        </div>

        {/* Frequency badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-mono border border-white/10">
          {session.frequency} Hz
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-indigo-300 transition-colors line-clamp-1">
            {session.title}
          </h3>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {session.description}
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {session.benefits.slice(0, 3).map((benefit, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px]">
              {benefit}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {session.duration}m
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {session.brainwaveTarget.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className={`p-1.5 rounded-lg transition-all ${liked ? 'text-rose-400 bg-rose-400/10' : 'text-gray-500 hover:text-rose-400 hover:bg-white/5'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
              className={`p-1.5 rounded-lg transition-all ${saved ? 'text-amber-400 bg-amber-400/10' : 'text-gray-500 hover:text-amber-400 hover:bg-white/5'}`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
