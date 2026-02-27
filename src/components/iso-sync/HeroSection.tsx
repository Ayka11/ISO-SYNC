import React, { useEffect, useRef, useState } from 'react';
import { Play, ChevronDown, Waves } from 'lucide-react';

interface HeroSectionProps {
  onStartSession: () => void;
  onExplore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartSession, onExplore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  // Particle animation for neural pathways
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#818cf8' : '#2dd4bf',
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a]" />
      
      {/* Hero Image Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(https://d64gsuwffb70l.cloudfront.net/6992e35bd701132a51070072_1771234246710_36ce6f00.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full transition-all duration-[4000ms] ease-in-out ${
          breathPhase === 'inhale' ? 'scale-110 opacity-30' : 'scale-90 opacity-15'
        }`}
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(45,212,191,0.1) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Frequency indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <Waves className="w-4 h-4 text-teal-400" />
          <span className="text-teal-400 text-sm font-mono">432 Hz Master Tuning Active</span>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            ISO-SYNC
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-300 mb-3 font-light">
          Your Vibrational Operating System
        </p>
        
        <p className="text-sm sm:text-base text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Harness sonomechanobiological principles to optimize your biology. 
          Every interaction delivers targeted frequencies that influence your physiology in real-time 
          through functional harmonics and cellular mechanotransduction.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onStartSession}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-2xl text-white font-semibold text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Play className="w-5 h-5 fill-white" />
            </div>
            Begin Session
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
          </button>

          <button
            onClick={onExplore}
            className="px-8 py-4 rounded-2xl text-gray-300 font-medium text-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:text-white"
          >
            Explore Frequencies
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '9', label: 'Solfeggio Frequencies' },
            { value: '16+', label: 'Guided Sessions' },
            { value: '432Hz', label: 'Master Tuning' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onExplore}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 hover:text-white transition-all animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
};

export default HeroSection;
