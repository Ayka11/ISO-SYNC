import React, { useState, useEffect } from 'react';
import { Heart, Brain, Wind, Activity, TrendingUp, Zap, Timer, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

const BiofeedbackDashboard: React.FC = () => {
  const [hrvData, setHrvData] = useState<Array<{ time: string; value: number }>>([]);
  const [breathData, setBreathData] = useState<Array<{ time: string; value: number }>>([]);
  const [currentHRV, setCurrentHRV] = useState(68);
  const [currentBreath, setCurrentBreath] = useState(12);
  const [coherence, setCoherence] = useState(74);
  const [activeTab, setActiveTab] = useState<'realtime' | 'history'>('realtime');

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newHRV = Math.max(40, Math.min(120, currentHRV + (Math.random() - 0.45) * 8));
      const newBreath = Math.max(6, Math.min(20, currentBreath + (Math.random() - 0.5) * 2));
      
      setCurrentHRV(newHRV);
      setCurrentBreath(newBreath);
      setCoherence(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.4) * 4)));
      
      setHrvData(prev => [...prev.slice(-30), { time: now, value: Math.round(newHRV) }]);
      setBreathData(prev => [...prev.slice(-30), { time: now, value: Math.round(newBreath * 10) / 10 }]);
    }, 1500);

    return () => clearInterval(interval);
  }, [currentHRV, currentBreath]);

  const weeklyData = [
    { day: 'Mon', sessions: 2, minutes: 35, coherence: 72 },
    { day: 'Tue', sessions: 1, minutes: 20, coherence: 68 },
    { day: 'Wed', sessions: 3, minutes: 55, coherence: 78 },
    { day: 'Thu', sessions: 2, minutes: 40, coherence: 75 },
    { day: 'Fri', sessions: 1, minutes: 15, coherence: 65 },
    { day: 'Sat', sessions: 4, minutes: 80, coherence: 85 },
    { day: 'Sun', sessions: 2, minutes: 45, coherence: 80 },
  ];

  const metrics = [
    { icon: Heart, label: 'HRV', value: `${Math.round(currentHRV)} ms`, color: 'text-rose-400', bg: 'bg-rose-400/10', trend: '+12%' },
    { icon: Wind, label: 'Breath Rate', value: `${Math.round(currentBreath)}/min`, color: 'text-teal-400', bg: 'bg-teal-400/10', trend: '-8%' },
    { icon: Brain, label: 'Coherence', value: `${Math.round(coherence)}%`, color: 'text-indigo-400', bg: 'bg-indigo-400/10', trend: '+15%' },
    { icon: Zap, label: 'Energy Level', value: '82%', color: 'text-amber-400', bg: 'bg-amber-400/10', trend: '+5%' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Biofeedback <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Dashboard</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real-time monitoring of your autonomic nervous system response to frequency exposure. 
          Track HRV, breath coherence, and brainwave entrainment patterns.
        </p>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('realtime')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'realtime' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:text-white'
          }`}
        >
          Real-time
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'history' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:text-white'
          }`}
        >
          Weekly History
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {metric.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
            <p className="text-gray-500 text-xs">{metric.label}</p>
          </div>
        ))}
      </div>

      {activeTab === 'realtime' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HRV Chart */}
          <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="text-white font-medium text-sm">Heart Rate Variability</h3>
              </div>
              <span className="text-rose-400 text-lg font-bold font-mono">{Math.round(currentHRV)} ms</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hrvData}>
                  <defs>
                    <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[40, 120]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#f43f5e" fill="url(#hrvGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breath Chart */}
          <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <h3 className="text-white font-medium text-sm">Breath Pattern</h3>
              </div>
              <span className="text-teal-400 text-lg font-bold font-mono">{Math.round(currentBreath)}/min</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={breathData}>
                  <defs>
                    <linearGradient id="breathGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2dd4bf" fill="url(#breathGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Coherence Meter */}
          <div className="lg:col-span-2 bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="w-4 h-4 text-indigo-400" />
              <h3 className="text-white font-medium text-sm">Neural Coherence Score</h3>
            </div>
            <div className="flex items-center gap-8">
              {/* Circular progress */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#coherenceGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${coherence * 2.64} 264`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="coherenceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{Math.round(coherence)}</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Alpha Entrainment', value: '78%', icon: Activity },
                  { label: 'Vagal Tone', value: 'Optimal', icon: Heart },
                  { label: 'Brainwave Sync', value: '85%', icon: Brain },
                  { label: 'Session Time', value: '12:34', icon: Timer },
                  { label: 'Frequency Lock', value: 'Active', icon: Target },
                  { label: 'Bio-Response', value: 'Strong', icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-white/5">
                    <item.icon className="w-4 h-4 text-gray-500 mx-auto mb-1" />
                    <p className="text-white text-sm font-medium">{item.value}</p>
                    <p className="text-gray-500 text-[10px]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Weekly History */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-medium text-sm mb-4">Weekly Session Minutes</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="minutes" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-medium text-sm mb-4">Coherence Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="cohGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis hide domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="coherence" stroke="#2dd4bf" fill="url(#cohGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="lg:col-span-2 bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-medium text-sm mb-4">Weekly Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Sessions', value: '15', sub: '+3 from last week' },
                { label: 'Total Minutes', value: '290', sub: '+45 from last week' },
                { label: 'Avg Coherence', value: '74.7%', sub: '+5.2% improvement' },
                { label: 'Streak', value: '7 days', sub: 'Personal best!' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 text-center">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.label}</p>
                  <p className="text-emerald-400 text-[10px] mt-2">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BiofeedbackDashboard;
