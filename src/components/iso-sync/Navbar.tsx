import React, { useState } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Activity, Menu, X, User, Settings, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, soundEnabled, onToggleSound }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { open: openAuthModal } = useAuthModal();

  const { t } = useTranslation();
  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'sessions', label: t('nav.sessions') },
    { id: 'soundlab', label: t('nav.soundLab') },
    { id: 'dashboard', label: t('nav.dashboard') },
    { id: 'frequencies', label: t('nav.frequencies') },
    { id: 'community', label: t('nav.community') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 animate-ping opacity-20" />
            </div>
            <span className="text-white font-bold text-lg tracking-wider">ISO-SYNC</span>
            <span className="hidden sm:inline text-[10px] text-teal-400 font-mono uppercase tracking-widest border border-teal-400/30 px-2 py-0.5 rounded-full">VOS 2.0</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  currentView === item.id
                    ? 'text-white bg-white/10 shadow-lg shadow-indigo-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              title={soundEnabled ? 'Mute UI sounds' : 'Enable UI sounds'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <div className="block flex-shrink-0">
                <LanguageSwitcher />
              </div>
            
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <User className="w-5 h-5" />
            </button>

            {profileOpen && (
              <div className="absolute top-14 right-4 w-64 bg-[#12122a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user ? user.name || user.email : 'Guest User'}</p>
                      <p className="text-gray-500 text-xs">{user ? 'Member' : 'Free Tier'}</p>
                  </div>
                </div>
                {!user ? (
                  <>
                    <button onClick={() => openAuthModal('signin')} className="w-full text-left px-3 py-2 rounded-lg text-gray-300 text-sm hover:bg-white/5 transition-all flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Sign In / Register
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-teal-400 text-sm hover:bg-white/5 transition-all mt-1">
                      Upgrade to Pro
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => logout()} className="w-full text-left px-3 py-2 rounded-lg text-gray-300 text-sm hover:bg-white/5 transition-all flex items-center gap-2">
                      Sign Out
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-teal-400 text-sm hover:bg-white/5 transition-all mt-1">
                      Manage Subscription
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.id
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-white/5">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
