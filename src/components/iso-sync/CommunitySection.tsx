import React, { useState } from 'react';
import { Users, Star, Calendar, Clock, Globe, ArrowRight, Radio, MessageCircle } from 'lucide-react';
import { practitioners } from '@/data/sessions';

const CommunitySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'practitioners' | 'events' | 'groups'>('practitioners');
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());

  const liveEvents = [
    { id: 'e1', title: 'Morning Frequency Bath', practitioner: 'Dr. Elena Vasquez', time: '7:00 AM EST', date: 'Tomorrow', attendees: 234, frequency: '432 Hz', live: false },
    { id: 'e2', title: 'Deep Theta Meditation', practitioner: 'Prof. Kenji Tanaka', time: '12:00 PM EST', date: 'Today', attendees: 567, frequency: '528 Hz', live: true },
    { id: 'e3', title: 'Evening Wind-Down', practitioner: 'Dr. Amara Osei', time: '9:00 PM EST', date: 'Today', attendees: 189, frequency: '174 Hz', live: false },
    { id: 'e4', title: 'Weekend Resonance Circle', practitioner: 'Dr. Marcus Chen', time: '10:00 AM EST', date: 'Saturday', attendees: 412, frequency: '639 Hz', live: false },
  ];

  const groupSessions = [
    { id: 'g1', name: 'Stress Warriors', members: 1243, focus: 'Stress Relief', active: true },
    { id: 'g2', name: 'Deep Sleepers', members: 892, focus: 'Sleep Optimization', active: true },
    { id: 'g3', name: 'Flow State Seekers', members: 2105, focus: 'Focus & Productivity', active: false },
    { id: 'g4', name: 'Cellular Healers', members: 567, focus: 'Healing & Recovery', active: true },
    { id: 'g5', name: 'Creative Resonators', members: 734, focus: 'Creativity & Intuition', active: false },
    { id: 'g6', name: 'Energy Amplifiers', members: 1456, focus: 'Energy & Vitality', active: true },
  ];

  const toggleEventJoin = (eventId: string) => {
    setJoinedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Resonance <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Community</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Connect with practitioners, join live group sessions, and share your vibrational wellness journey 
          with a global community of frequency explorers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[
          { id: 'practitioners', label: 'Practitioners', icon: Users },
          { id: 'events', label: 'Live Events', icon: Radio },
          { id: 'groups', label: 'Groups', icon: MessageCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Practitioners */}
      {activeTab === 'practitioners' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {practitioners.map(p => (
            <div key={p.id} className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6 text-center hover:border-white/10 transition-all group">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img src={p.image} alt={p.name} className="w-full h-full rounded-full object-cover border-2 border-white/10 group-hover:border-indigo-500/50 transition-all" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#12122a] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{p.name}</h4>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">{p.specialty}</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {p.rating}
                </span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-500 text-xs">{p.sessions} sessions</span>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-white/5 text-gray-300 text-sm font-medium hover:bg-indigo-500/20 hover:text-indigo-400 transition-all">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Live Events */}
      {activeTab === 'events' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {liveEvents.map(event => (
            <div key={event.id} className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {event.live && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-semibold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        Live Now
                      </span>
                    )}
                    <h4 className="text-white font-medium text-sm">{event.title}</h4>
                  </div>
                  <p className="text-gray-500 text-xs mb-2">Led by {event.practitioner}</p>
                  <div className="flex items-center gap-3 text-gray-600 text-xs">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {event.attendees}</span>
                    <span className="text-indigo-400 font-mono">{event.frequency}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleEventJoin(event.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    joinedEvents.has(event.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : event.live
                      ? 'bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:scale-105'
                      : 'bg-white/5 text-gray-300 hover:bg-indigo-500/20 hover:text-indigo-400'
                  }`}
                >
                  {joinedEvents.has(event.id) ? 'Joined' : event.live ? 'Join Now' : 'Register'}
                  {!joinedEvents.has(event.id) && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Groups */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupSessions.map(group => (
            <div key={group.id} className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 border border-indigo-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{group.name}</h4>
                  <p className="text-gray-500 text-xs">{group.focus}</p>
                </div>
                {group.active && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {group.members.toLocaleString()} members
                </span>
                <button className="px-4 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs font-medium hover:bg-indigo-500/20 hover:text-indigo-400 transition-all">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommunitySection;
