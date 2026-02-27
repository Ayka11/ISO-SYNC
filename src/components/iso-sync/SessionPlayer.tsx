import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, SkipForward, Volume2, Maximize2, Minimize2, Timer, Brain, Heart, Wind } from 'lucide-react';
import { Session } from '@/data/sessions';

interface SessionPlayerProps {
  session: Session;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  audioEngine: {
    playFrequency: (freq: number, vol?: number) => void;
    stopFrequency: () => void;
    setVolume: (vol: number) => void;
    volume: number;
  };
}

const SessionPlayer: React.FC<SessionPlayerProps> = ({ session, isPlaying, onTogglePlay, onClose, audioEngine }) => {
  const [elapsed, setElapsed] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolumeState] = useState(audioEngine.volume);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [simulatedHRV, setSimulatedHRV] = useState(65);
  const [breathRate, setBreathRate] = useState(12);
  const [coherenceScore, setCoherenceScore] = useState(72);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= session.duration * 60) {
          onTogglePlay();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, session.duration, onTogglePlay]);

  // Simulated biofeedback
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimulatedHRV(prev => Math.max(40, Math.min(120, prev + (Math.random() - 0.45) * 5)));
      setBreathRate(prev => Math.max(6, Math.min(20, prev + (Math.random() - 0.5) * 1)));
      setCoherenceScore(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.4) * 3)));
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Waveform visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    let phase = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      if (isPlaying) {
        // Main frequency wave
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
        ctx.lineWidth = 2;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * 8 + phase) * (h * 0.3) * Math.sin((x / w) * Math.PI);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Harmonic wave
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * 12 + phase * 1.5) * (h * 0.15) * Math.sin((x / w) * Math.PI);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Sub-harmonic
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * 4 + phase * 0.7) * (h * 0.2) * Math.sin((x / w) * Math.PI);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        phase += 0.03;
      } else {
        // Flat line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (elapsed / (session.duration * 60)) * 100;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolumeState(v);
    audioEngine.setVolume(v);
  };

  if (!expanded) {
    // Mini player bar
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a1a]/95 backdrop-blur-xl border-t border-white/10">
        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <img src={session.image} alt={session.title} className="w-12 h-12 rounded-lg object-cover" />
          
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-sm font-medium truncate">{session.title}</h4>
            <p className="text-gray-500 text-xs">{session.frequency} Hz · {session.frequencyName}</p>
          </div>

          <canvas ref={canvasRef} className="hidden sm:block w-40 h-10" />

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs font-mono hidden sm:inline">{formatTime(elapsed)}</span>
            
            <button
              onClick={onTogglePlay}
              className="p-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:scale-105 transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => setExpanded(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-white transition-all"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full expanded player
  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a1a] overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${session.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(60px)' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setExpanded(false)} className="p-2 rounded-lg text-gray-400 hover:text-white transition-all">
            <Minimize2 className="w-5 h-5" />
          </button>
          <span className="text-gray-500 text-sm font-mono">Session Active</span>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Session Info */}
        <div className="text-center mb-8">
          <img src={session.image} alt={session.title} className="w-48 h-48 rounded-3xl object-cover mx-auto mb-6 shadow-2xl shadow-indigo-500/20" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{session.title}</h2>
          <p className="text-gray-400 text-sm mb-4">{session.frequencyName} · {session.frequency} Hz</p>
          <div className="flex items-center justify-center gap-4">
            {session.benefits.map((b, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs">{b}</span>
            ))}
          </div>
        </div>

        {/* Waveform */}
        <canvas ref={canvasRef} className="w-full h-24 mb-8" />

        {/* Progress */}
        <div className="mb-8">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-mono">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(session.duration * 60)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-2 w-32">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400"
            />
          </div>

          <button
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white flex items-center justify-center hover:scale-105 transition-all shadow-2xl shadow-indigo-500/30"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
          </button>

          <button className="p-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Biofeedback Panel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <Heart className="w-5 h-5 text-rose-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{Math.round(simulatedHRV)}</p>
            <p className="text-gray-500 text-xs mt-1">HRV (ms)</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <Wind className="w-5 h-5 text-teal-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{Math.round(breathRate)}</p>
            <p className="text-gray-500 text-xs mt-1">Breaths/min</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <Brain className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{session.brainwaveTarget.split(' ')[0]}</p>
            <p className="text-gray-500 text-xs mt-1">Brainwave Target</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <Timer className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{Math.round(coherenceScore)}%</p>
            <p className="text-gray-500 text-xs mt-1">Coherence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPlayer;
