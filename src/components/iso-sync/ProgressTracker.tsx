import React, { useState } from 'react';
import { Flame, Trophy, Clock, Target, ChevronRight, Calendar, Star, Zap, Award } from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const streakDays = [
    { day: 'M', completed: true },
    { day: 'T', completed: true },
    { day: 'W', completed: true },
    { day: 'T', completed: true },
    { day: 'F', completed: true },
    { day: 'S', completed: true },
    { day: 'S', completed: false, today: true },
  ];

  const milestones = [
    { title: 'First Session', description: 'Complete your first meditation', achieved: true, icon: Star, xp: 50 },
    { title: '7-Day Streak', description: 'Meditate 7 days in a row', achieved: true, icon: Flame, xp: 200 },
    { title: 'Frequency Explorer', description: 'Try all 9 Solfeggio frequencies', achieved: true, icon: Zap, xp: 300 },
    { title: 'Hour of Silence', description: 'Accumulate 60 minutes of meditation', achieved: true, icon: Clock, xp: 150 },
    { title: 'Coherence Master', description: 'Achieve 90%+ coherence score', achieved: false, icon: Target, xp: 500, progress: 74 },
    { title: '30-Day Journey', description: 'Complete a 30-day streak', achieved: false, icon: Calendar, xp: 1000, progress: 23 },
    { title: 'Sound Architect', description: 'Create 5 custom frequency profiles', achieved: false, icon: Award, xp: 400, progress: 40 },
    { title: 'Deep Diver', description: 'Complete a 45-minute session', achieved: false, icon: Trophy, xp: 250, progress: 89 },
  ];

  const frequencyLog = [
    { freq: 528, name: 'MI', sessions: 12, totalMin: 240, lastUsed: '2h ago', color: '#00B4D8' },
    { freq: 396, name: 'UT', sessions: 8, totalMin: 160, lastUsed: '1d ago', color: '#FFB300' },
    { freq: 741, name: 'SOL', sessions: 6, totalMin: 150, lastUsed: '3h ago', color: '#9B59B6' },
    { freq: 174, name: 'Foundation', sessions: 10, totalMin: 350, lastUsed: '12h ago', color: '#FF6B6B' },
    { freq: 432, name: 'Universal', sessions: 5, totalMin: 60, lastUsed: '2d ago', color: '#4ECB71' },
    { freq: 852, name: 'LA', sessions: 3, totalMin: 30, lastUsed: '5d ago', color: '#E91E90' },
  ];

  const totalXP = milestones.filter(m => m.achieved).reduce((sum, m) => sum + m.xp, 0);
  const level = Math.floor(totalXP / 200) + 1;
  const xpToNext = 200 - (totalXP % 200);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Your <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Progress</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Track your vibrational wellness journey. Every session builds your neural resilience 
          and deepens your frequency sensitivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level & Streak */}
        <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Resonance Level</p>
              <p className="text-3xl font-bold text-white mt-1">Level {level}</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>{totalXP} XP</span>
              <span>{xpToNext} XP to Level {level + 1}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all"
                style={{ width: `${((totalXP % 200) / 200) * 100}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-white text-sm font-medium">6-Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              {streakDays.map((day, i) => (
                <div key={i} className="flex-1 text-center">
                  <div
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                      day.completed
                        ? 'bg-gradient-to-br from-indigo-500 to-teal-500 text-white'
                        : day.today
                        ? 'bg-white/10 text-white border-2 border-dashed border-indigo-500/50'
                        : 'bg-white/5 text-gray-600'
                    }`}
                  >
                    {day.completed ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </div>
                  <p className="text-gray-600 text-[10px] mt-1">{day.day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-xl font-bold text-white">42</p>
              <p className="text-gray-500 text-[10px]">Total Sessions</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center">
              <p className="text-xl font-bold text-white">14.5h</p>
              <p className="text-gray-500 text-[10px]">Total Time</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Milestones</h3>
            <span className="text-gray-500 text-xs">{milestones.filter(m => m.achieved).length}/{milestones.length} achieved</span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {milestones.map((milestone, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border transition-all ${
                  milestone.achieved
                    ? 'bg-indigo-500/5 border-indigo-500/20'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${milestone.achieved ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                    <milestone.icon className={`w-4 h-4 ${milestone.achieved ? 'text-indigo-400' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${milestone.achieved ? 'text-white' : 'text-gray-400'}`}>
                        {milestone.title}
                      </p>
                      <span className="text-amber-400 text-[10px] font-mono">+{milestone.xp} XP</span>
                    </div>
                    <p className="text-gray-600 text-xs">{milestone.description}</p>
                    {!milestone.achieved && milestone.progress !== undefined && (
                      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {milestone.achieved && (
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Exposure Log */}
        <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Frequency Exposure</h3>
            <div className="flex gap-1">
              {(['week', 'month', 'all'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all capitalize ${
                    selectedPeriod === p ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {frequencyLog.map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${log.color}15` }}>
                    <span className="text-xs font-bold font-mono" style={{ color: log.color }}>{log.freq}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white text-sm font-medium">{log.name}</p>
                      <span className="text-gray-600 text-xs">{log.lastUsed}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-500 text-xs">{log.sessions} sessions</span>
                      <span className="text-gray-600">·</span>
                      <span className="text-gray-500 text-xs">{log.totalMin} min</span>
                    </div>
                    {/* Usage bar */}
                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(log.totalMin / 350) * 100}%`, backgroundColor: log.color }}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressTracker;
