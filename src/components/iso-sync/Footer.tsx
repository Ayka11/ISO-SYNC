import React, { useState } from 'react';
import { Activity, Mail, ArrowRight, Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    Product: ['Sessions', 'Frequencies', 'Biofeedback', 'Spatial Audio', 'Community', 'Pricing'],
    Science: ['Sonomechanobiology', 'Research Papers', 'Solfeggio Scale', 'Brainwave Entrainment', 'Mechanotransduction', 'Clinical Trials'],
    Company: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Partners', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA Compliance', 'Data Security'],
  };

  return (
    <footer className="bg-[#080818] border-t border-white/5">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-500/10 to-teal-500/10 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Stay in <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Resonance</span>
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Get weekly insights on frequency science, new session releases, and exclusive access to research updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-xl text-white text-sm font-medium hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-sm mt-3 animate-fade-in">
                Welcome to the resonance field. Check your inbox for confirmation.
              </p>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">ISO-SYNC</span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              Your Vibrational Operating System. Harnessing sonomechanobiology for optimal wellness.
            </p>
            <div className="flex items-center gap-2">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-medium mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link}>
                    <button className="text-gray-500 text-xs hover:text-white transition-all">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            &copy; 2026 ISO-SYNC. All rights reserved. Vibrational Operating System v2.0
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
            <span>432 Hz Master Tuning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
