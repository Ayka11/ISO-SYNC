import React from 'react';
import { Waves, Brain, Heart, Headphones, Activity, Shield, Sparkles, Cpu } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Waves,
      title: 'Solfeggio Frequencies',
      description: 'Nine precisely calibrated frequencies from the ancient Solfeggio scale, adapted for modern cellular therapy through sonomechanobiological principles.',
      color: 'from-indigo-500 to-blue-500',
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-400',
    },
    {
      icon: Brain,
      title: 'Brainwave Entrainment',
      description: 'Real-time neural frequency matching that guides your brainwaves into targeted states—alpha for flow, theta for deep meditation, delta for restorative sleep.',
      color: 'from-purple-500 to-violet-500',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      icon: Heart,
      title: 'HRV Biofeedback',
      description: 'Continuous heart rate variability monitoring that adapts session frequencies in real-time to optimize your autonomic nervous system response.',
      color: 'from-rose-500 to-pink-500',
      iconBg: 'bg-rose-500/10',
      iconColor: 'text-rose-400',
    },
    {
      icon: Headphones,
      title: 'Spatial Audio 3D',
      description: 'Immersive three-dimensional soundscapes that surround you in therapeutic frequencies, creating a cocoon of vibrational healing.',
      color: 'from-teal-500 to-cyan-500',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-400',
    },
    {
      icon: Activity,
      title: 'Mechanotransduction',
      description: 'Sound waves engineered to induce mechanical forces at the cellular level, stimulating calcium signaling and stem cell differentiation pathways.',
      color: 'from-emerald-500 to-green-500',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Shield,
      title: 'Zero-Attack Transients',
      description: 'All sounds use instant onset without harsh buildup, promoting fluid organic bio-feedback that never startles or disrupts your meditative state.',
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      icon: Sparkles,
      title: 'Functional Harmonics',
      description: 'Every UI interaction delivers targeted therapeutic frequencies—taps, swipes, and navigation all become micro-doses of vibrational medicine.',
      color: 'from-violet-500 to-fuchsia-500',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
    },
    {
      icon: Cpu,
      title: '432 Hz Master Tuning',
      description: 'All frequencies are generated in real-time using pure sine waves tuned to 432 Hz master tuning for a warm, supportive, and biologically resonant experience.',
      color: 'from-sky-500 to-blue-500',
      iconBg: 'bg-sky-500/10',
      iconColor: 'text-sky-400',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-wider mb-4">
          Core Technology
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          The Science of <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Vibrational Wellness</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          ISO-SYNC bridges ancient tonal wisdom with cutting-edge sonomechanobiology, 
          creating a sonic interface where every interaction is biologically active.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group relative bg-[#12122a]/80 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Gradient glow on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
            </div>
            
            <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-indigo-300 transition-colors">
              {feature.title}
            </h3>
            
            <p className="text-gray-500 text-xs leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-teal-500/5 border border-white/5">
          <div className="text-left">
            <p className="text-white font-medium text-sm">Ready to optimize your biology?</p>
            <p className="text-gray-500 text-xs">Start with a personalized frequency assessment</p>
          </div>
          <div className="flex items-center gap-3">
            {[174, 285, 396, 417, 528, 639, 741, 852, 963].map((freq, i) => (
              <div
                key={freq}
                className="w-1 rounded-full bg-gradient-to-t from-indigo-500 to-teal-400 transition-all"
                style={{ height: `${12 + i * 4}px`, opacity: 0.3 + i * 0.08 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
