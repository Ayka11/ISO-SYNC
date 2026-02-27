import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Grid3X3, List, Heart, Moon, Sun, Zap, Activity, Sparkles, LayoutGrid, Play, Pause } from 'lucide-react';

import { sessions, categories, Session } from '@/data/sessions';
import SessionCard from './SessionCard';

interface SessionLibraryProps {
  onPlaySession: (session: Session) => void;
  onSelectSession: (session: Session) => void;
  playingSessionId: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'grid': <LayoutGrid className="w-4 h-4" />,
  'heart': <Heart className="w-4 h-4" />,
  'zap': <Zap className="w-4 h-4" />,
  'moon': <Moon className="w-4 h-4" />,
  'sun': <Sun className="w-4 h-4" />,
  'activity': <Activity className="w-4 h-4" />,
  'sparkles': <Sparkles className="w-4 h-4" />,
};

const SessionLibrary: React.FC<SessionLibraryProps> = ({ onPlaySession, onSelectSession, playingSessionId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'duration' | 'frequency'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredSessions = useMemo(() => {
    let result = [...sessions];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.frequencyName.toLowerCase().includes(q) ||
        s.benefits.some(b => b.toLowerCase().includes(q))
      );
    }

    // Category
    if (activeCategory !== 'all') {
      result = result.filter(s => s.category === activeCategory);
    }

    // Difficulty
    if (difficultyFilter !== 'all') {
      result = result.filter(s => s.difficulty === difficultyFilter);
    }

    // Sort
    switch (sortBy) {
      case 'popularity':
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'duration':
        result.sort((a, b) => a.duration - b.duration);
        break;
      case 'frequency':
        result.sort((a, b) => a.frequency - b.frequency);
        break;
    }

    return result;
  }, [searchQuery, activeCategory, sortBy, difficultyFilter]);

  return (
    <section id="sessions-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Session <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Library</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Each session is a precisely calibrated acoustic protocol designed to stimulate specific 
          cellular mechanotransduction pathways for targeted biological responses.
        </p>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions, frequencies, benefits..."
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
              showFilters ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
          >
            <option value="popularity">Popular</option>
            <option value="duration">Duration</option>
            <option value="frequency">Frequency</option>
          </select>

          <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-400 text-sm">Difficulty:</span>
            {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                  difficultyFilter === d
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-white/5 text-gray-500 border border-transparent hover:text-white'
                }`}
              >
                {d === 'all' ? 'All Levels' : d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-indigo-500/20 to-teal-500/20 text-white border border-indigo-500/30'
                : 'bg-white/5 text-gray-500 border border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            {categoryIcons[cat.icon]}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-6">
        {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
      </p>

      {/* Session Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onPlay={onPlaySession}
              onSelect={onSelectSession}
              isPlaying={playingSessionId === session.id}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map(session => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="flex items-center gap-4 p-4 bg-[#12122a]/80 border border-white/5 rounded-xl hover:border-white/10 transition-all cursor-pointer group"
            >
              <img src={session.image} alt={session.title} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate group-hover:text-indigo-300 transition-colors">{session.title}</h4>
                <p className="text-gray-500 text-xs mt-0.5">{session.frequencyName} · {session.frequency} Hz</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-gray-500 text-xs">
                <span>{session.duration}m</span>
                <span className="capitalize">{session.difficulty}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onPlaySession(session); }}
                className="p-2.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-all"
              >
                {playingSessionId === session.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredSessions.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No sessions match your criteria</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); setDifficultyFilter('all'); }}
            className="mt-4 px-6 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 text-sm hover:bg-indigo-500/30 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default SessionLibrary;
