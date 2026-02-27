import React, { useState } from 'react';
import { Play, Pause, Waves, Volume2 } from 'lucide-react';

import { solfeggioFrequencies } from '@/data/sessions';

interface FrequencyProfileProps {
  audioEngine: {
    playFrequency: (freq: number, vol?: number) => void;
    stopFrequency: () => void;
    isPlaying: boolean;
    currentFrequency: number;
    volume: number;
    setVolume: (vol: number) => void;
  };
}

const FrequencyProfile: React.FC<FrequencyProfileProps> = ({ audioEngine }) => {
  const [selectedFreq, setSelectedFreq] = useState<typeof solfeggioFrequencies[0] | null>(null);
  const [intensity, setIntensity] = useState(50);
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const handleFreqClick = (freq: typeof solfeggioFrequencies[0]) => {
    setSelectedFreq(freq);
    if (audioEngine.isPlaying && audioEngine.currentFrequency === freq.hz) {
      audioEngine.stopFrequency();
    } else {
      audioEngine.playFrequency(freq.hz, intensity / 100 * 0.5);
    }
  };

  const handleIntensityChange = (value: number) => {
    setIntensity(value);
    if (audioEngine.isPlaying && selectedFreq) {
      audioEngine.setVolume(value / 100 * 0.5);
    }
  };

  const biologicalEffects: Record<number, string[]> = {
    174: ['Reduces pain perception', 'Promotes sense of security', 'Influences organ function'],
    285: ['Promotes tissue regeneration', 'Restructures damaged organs', 'Influences energy fields'],
    396: ['Liberates guilt and fear', 'Reduces cortisol', 'Grounds the root chakra'],
    417: ['Facilitates change', 'Undoes negative situations', 'Cleanses traumatic experiences'],
    528: ['Repairs DNA', 'Reduces stress hormones', 'Promotes cellular transformation'],
    639: ['Enhances communication', 'Promotes understanding', 'Strengthens relationships'],
    741: ['Awakens intuition', 'Promotes self-expression', 'Solves problems'],
    852: ['Returns to spiritual order', 'Awakens inner strength', 'Raises cell energy'],
    963: ['Activates pineal gland', 'Connects to higher self', 'Promotes divine consciousness'],
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Solfeggio <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Frequency Map</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore the ancient Solfeggio scale adapted for modern sonomechanobiology. 
          Each frequency targets specific cellular mechanotransduction pathways. Click to preview.
        </p>
      </div>

      {/* Frequency Spectrum Visualization */}
      <div className="relative mb-12">
        <div className="flex items-end justify-center gap-2 sm:gap-4 h-64 px-4">
          {solfeggioFrequencies.map((freq, i) => {
            const isActive = audioEngine.isPlaying && audioEngine.currentFrequency === freq.hz;
            const isSelected = selectedFreq?.hz === freq.hz;
            const height = 30 + (i / solfeggioFrequencies.length) * 60;

            return (
              <div key={freq.hz} className="flex-1 max-w-24 flex flex-col items-center gap-2">
                {/* Bar */}
                <button
                  onClick={() => handleFreqClick(freq)}
                  className="relative w-full group"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className={`w-full h-full rounded-t-xl transition-all duration-500 ${
                      isActive ? 'animate-pulse' : ''
                    }`}
                    style={{
                      backgroundColor: isActive ? freq.color : `${freq.color}30`,
                      boxShadow: isActive ? `0 0 30px ${freq.color}40` : 'none',
                    }}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-t-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Play indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isActive ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </div>
                </button>

                {/* Label */}
                <div className="text-center">
                  <p className="text-white text-xs font-bold font-mono" style={{ color: isSelected ? freq.color : undefined }}>
                    {freq.hz}
                  </p>
                  <p className="text-gray-600 text-[10px] hidden sm:block">{freq.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Frequency line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-2" />
      </div>

      {/* Selected Frequency Detail */}
      {selectedFreq && (
        <div className="max-w-3xl mx-auto bg-[#12122a]/80 border border-white/10 rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Frequency Circle */}
            <div className="relative w-32 h-32 flex-shrink-0 mx-auto sm:mx-0">
              <div
                className={`w-full h-full rounded-full border-4 flex items-center justify-center ${
                  audioEngine.isPlaying && audioEngine.currentFrequency === selectedFreq.hz ? 'animate-pulse' : ''
                }`}
                style={{ borderColor: selectedFreq.color, backgroundColor: `${selectedFreq.color}10` }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{selectedFreq.hz}</p>
                  <p className="text-xs" style={{ color: selectedFreq.color }}>Hz</p>
                </div>
              </div>
              {audioEngine.isPlaying && audioEngine.currentFrequency === selectedFreq.hz && (
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ borderColor: selectedFreq.color, border: `2px solid ${selectedFreq.color}` }} />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{selectedFreq.name} - {selectedFreq.hz} Hz</h3>
                <Waves className="w-5 h-5" style={{ color: selectedFreq.color }} />
              </div>
              <p className="text-gray-400 text-sm mb-4">{selectedFreq.description}</p>

              {/* Biological Effects */}
              <div className="mb-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Biological Effects</p>
                <div className="flex flex-wrap gap-2">
                  {biologicalEffects[selectedFreq.hz]?.map((effect, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: `${selectedFreq.color}15`, color: selectedFreq.color }}>
                      {effect}
                    </span>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="flex items-center gap-4">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:shadow-lg"
                  />
                </div>
                <span className="text-gray-500 text-xs font-mono w-8">{intensity}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sound Architecture Table */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-white font-medium text-lg mb-4 text-center">ISO-SYNC Sound Architecture</h3>
        <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-4 py-3">Action</th>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-4 py-3">Frequency</th>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Waveform</th>
                  <th className="text-left text-gray-500 text-xs uppercase tracking-wider px-4 py-3 hidden md:table-cell">Biological Rationale</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { action: 'Tap / Select', freq: '528 Hz (MI)', wave: 'Pure Sine', rationale: 'Activates Ca²⁺ signaling for cellular response' },
                  { action: 'Swipe / Navigate', freq: '396→528 Hz Glissando', wave: 'Ascending Sine', rationale: 'Stimulates mechanotransduction pathways' },
                  { action: 'Success / Complete', freq: '528→639→741 Hz Chord', wave: 'Harmonic Stack', rationale: 'Triggers dopamine-associated neural patterns' },
                  { action: 'Error / Alert', freq: '174 Hz Pulse', wave: 'Modulated Sine', rationale: 'Grounding frequency for pain/stress reduction' },
                  { action: 'Background Ambient', freq: '432 Hz Drone', wave: 'Layered Sine', rationale: 'Universal harmony for ANS balance' },
                  { action: 'Session Start', freq: '285→528 Hz Sweep', wave: 'Frequency Sweep', rationale: 'Progressive cellular activation sequence' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all">
                    <td className="px-4 py-3 text-white text-sm">{row.action}</td>
                    <td className="px-4 py-3 text-indigo-400 text-sm font-mono">{row.freq}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm hidden sm:table-cell">{row.wave}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{row.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrequencyProfile;
