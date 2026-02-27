import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Session, sessions } from '@/data/sessions';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import Navbar from './iso-sync/Navbar';
import HeroSection from './iso-sync/HeroSection';
import FeaturesSection from './iso-sync/FeaturesSection';
import SessionLibrary from './iso-sync/SessionLibrary';
import SessionPlayer from './iso-sync/SessionPlayer';
import SessionDetailModal from './iso-sync/SessionDetailModal';
import BiofeedbackDashboard from './iso-sync/BiofeedbackDashboard';
import ProgressTracker from './iso-sync/ProgressTracker';
import FrequencyProfile from './iso-sync/FrequencyProfile';
import SpatialAudioPanel from './iso-sync/SpatialAudioPanel';
import CommunitySection from './iso-sync/CommunitySection';
import OnboardingQuiz from './iso-sync/OnboardingQuiz';
import RecommendationResults from './iso-sync/RecommendationResults';
import Footer from './iso-sync/Footer';
import SoundLab from '@/pages/SoundLab';

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isSessionPlaying, setIsSessionPlaying] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [frequencyProfile, setFrequencyProfile] = useState<any>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const audioEngine = useAudioEngine();
  const sessionsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view);
    if (soundEnabled) {
      audioEngine.playUISound('navigate');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [soundEnabled, audioEngine]);

  const handleStartSession = useCallback(() => {
    setCurrentView('sessions');
    setTimeout(() => {
      sessionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const handleExplore = useCallback(() => {
    setCurrentView('frequencies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePlaySession = useCallback((session: Session) => {
    if (activeSession?.id === session.id && isSessionPlaying) {
      // Pause
      setIsSessionPlaying(false);
      audioEngine.stopFrequency();
    } else {
      // Play new session
      setActiveSession(session);
      setIsSessionPlaying(true);
      audioEngine.playFrequency(session.frequency, 0.3);
      if (soundEnabled) {
        audioEngine.playUISound('success');
      }
    }
  }, [activeSession, isSessionPlaying, audioEngine, soundEnabled]);

  const handleTogglePlay = useCallback(() => {
    if (isSessionPlaying) {
      setIsSessionPlaying(false);
      audioEngine.stopFrequency();
    } else if (activeSession) {
      setIsSessionPlaying(true);
      audioEngine.playFrequency(activeSession.frequency, 0.3);
    }
  }, [isSessionPlaying, activeSession, audioEngine]);

  const handleClosePlayer = useCallback(() => {
    setActiveSession(null);
    setIsSessionPlaying(false);
    audioEngine.stopFrequency();
  }, [audioEngine]);

  const handleSelectSession = useCallback((session: Session) => {
    setSelectedSession(session);
    if (soundEnabled) {
      audioEngine.playUISound('tap');
    }
  }, [soundEnabled, audioEngine]);

  const handleStartFromDetail = useCallback((session: Session) => {
    setSelectedSession(null);
    handlePlaySession(session);
  }, [handlePlaySession]);

  const handleQuizComplete = useCallback((profile: any) => {
    setShowQuiz(false);
    setFrequencyProfile(profile);
    setShowRecommendations(true);
    if (soundEnabled) {
      audioEngine.playUISound('success');
    }
  }, [soundEnabled, audioEngine]);

  const handleRecommendationStart = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setShowRecommendations(false);
      handlePlaySession(session);
    }
  }, [handlePlaySession]);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            {/* Personalized greeting */}
            {user && (
              <div className="pt-20 px-4 max-w-7xl mx-auto">
                <div className="bg-white/3 p-4 rounded-2xl mb-6">
                  <h2 className="text-xl font-semibold">{`Hello, ${user.name || user.email}`}</h2>
                </div>
              </div>
            )}
            <HeroSection onStartSession={handleStartSession} onExplore={handleExplore} />
            <FeaturesSection />
            <div ref={sessionsRef}>
              <SessionLibrary
                onPlaySession={handlePlaySession}
                onSelectSession={handleSelectSession}
                playingSessionId={activeSession?.id && isSessionPlaying ? activeSession.id : null}
              />
            </div>
            {/* Personalization CTA */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 border border-white/10 rounded-3xl p-8 sm:p-12">
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      Discover Your Frequency Profile
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xl">
                      Take a 2-minute assessment to receive personalized Solfeggio frequency recommendations 
                      based on your wellness goals, stress levels, and meditation experience.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl text-white font-semibold hover:scale-105 transition-all shadow-2xl shadow-indigo-500/20 whitespace-nowrap"
                  >
                    Take Assessment
                  </button>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl" />
              </div>
            </section>
          </>
        );

      case 'sessions':
        return (
          <div className="pt-20" ref={sessionsRef}>
            <SessionLibrary
              onPlaySession={handlePlaySession}
              onSelectSession={handleSelectSession}
              playingSessionId={activeSession?.id && isSessionPlaying ? activeSession.id : null}
            />
          </div>
        );

      case 'dashboard':
        return (
          <div className="pt-20">
            <BiofeedbackDashboard />
            <ProgressTracker />
          </div>
        );

      case 'frequencies':
        return (
          <div className="pt-20">
            <FrequencyProfile audioEngine={audioEngine} />
            <SpatialAudioPanel />
          </div>
        );

      case 'soundlab':
        return (
          <div className="pt-20">
            <SoundLab />
          </div>
        );

      case 'community':
        return (
          <div className="pt-20">
            <CommunitySection />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {renderContent()}

      <Footer />

      {/* Session Detail Modal */}
      <SessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onStartSession={handleStartFromDetail}
      />

      {/* Session Player */}
      {activeSession && (
        <SessionPlayer
          session={activeSession}
          isPlaying={isSessionPlaying}
          onTogglePlay={handleTogglePlay}
          onClose={handleClosePlayer}
          audioEngine={audioEngine}
        />
      )}

      {/* Onboarding Quiz */}
      <OnboardingQuiz
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />

      {/* Recommendation Results */}
      {showRecommendations && frequencyProfile && (
        <RecommendationResults
          profile={frequencyProfile}
          onClose={() => setShowRecommendations(false)}
          onStartSession={handleRecommendationStart}
        />
      )}
    </div>
  );
};

export default AppLayout;
