import React, { useState, useEffect, useRef } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { Headphones, Volume2, Waves, CloudRain, TreePine, Stars, Wind, Droplets, Feather } from 'lucide-react';


const SpatialAudioPanel: React.FC = () => {
  const [layers, setLayers] = useState([
    { id: 'rain', name: 'Gentle Rain', icon: CloudRain, volume: 40, active: true, color: '#60A5FA' },
    { id: 'forest', name: 'Forest Ambience', icon: TreePine, volume: 25, active: false, color: '#4ECB71' },
    { id: 'cosmic', name: 'Cosmic Tones', icon: Stars, volume: 60, active: true, color: '#A78BFA' },
    { id: 'wind', name: 'Soft Wind', icon: Wind, volume: 30, active: false, color: '#94A3B8' },
    { id: 'water', name: 'Flowing Water', icon: Droplets, volume: 35, active: true, color: '#22D3EE' },
    { id: 'birds', name: 'Bird Song', icon: Feather, volume: 15, active: false, color: '#FBBF24' },

  ]);

  const [spatialMode, setSpatialMode] = useState<'stereo' | 'spatial' | 'binaural'>('spatial');
  const [masterVolume, setMasterVolume] = useState(70);
  const audio = useAudioEngine();
  const engineMap = useRef<Record<string, string>>({});

  const toggleLayer = (id: string) => {
    setLayers(prev => {
      const next = prev.map(l => l.id === id ? { ...l, active: !l.active } : l);
      const updated = next.find(l => l.id === id);
      // start/stop engine layer
      if (updated) {
        if (updated.active) {
          // turned on -> create an engine layer
          // map simple ambient frequency by id index
          const baseHz = 220 + Math.floor(Math.random() * 220);
          const engineId = audio.addLayer({ leftFreq: baseHz, rightFreq: baseHz + 2, volume: (updated.volume / 100) * 0.4, pan: 0 });
          // start playback (ensure context resumed)
          setTimeout(() => {
            try { audio.playAll(); } catch {}
          }, 50);
          engineMap.current[id] = engineId;
        } else {
          // turned off -> remove engine layer
          const engineId = engineMap.current[id];
          if (engineId) {
            try { audio.removeLayer(engineId); } catch {}
            delete engineMap.current[id];
          }
        }
      }
      return next;
    });
  };

  const updateLayerVolume = (id: string, volume: number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, volume } : l));
    const engineId = engineMap.current[id];
    if (engineId) {
      try { audio.setLayerVolume(engineId, (volume / 100) * 0.6); } catch {}
    }
  };

  // keep master volume effect on session tone if used
  useEffect(() => {
    try { audio.setVolume(masterVolume / 100 * 0.8); } catch {}
  }, [masterVolume]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Spatial <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">Soundscape</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Customize your immersive 3D audio environment. Layer natural soundscapes with therapeutic frequencies 
          for a personalized sonic healing space. Best experienced with headphones.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Headphone Notice */}
        <div className="flex items-center gap-3 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-8">
          <Headphones className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <p className="text-indigo-300 text-sm">
            For the full spatial audio experience, connect headphones. Binaural frequencies require stereo separation for optimal effect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audio Mode */}
          <div className="bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-medium text-sm mb-4">Audio Mode</h3>
            <div className="space-y-2">
              {[
                { id: 'stereo', label: 'Stereo', desc: 'Standard two-channel audio' },
                { id: 'spatial', label: 'Spatial 3D', desc: 'Immersive surround sound' },
                { id: 'binaural', label: 'Binaural', desc: 'Frequency-split for entrainment' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSpatialMode(mode.id as any)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    spatialMode === mode.id
                      ? 'bg-indigo-500/20 border border-indigo-500/30'
                      : 'bg-white/5 border border-transparent hover:bg-white/10'
                  }`}
                >
                  <p className={`text-sm font-medium ${spatialMode === mode.id ? 'text-indigo-400' : 'text-gray-300'}`}>
                    {mode.label}
                  </p>
                  <p className="text-gray-600 text-xs">{mode.desc}</p>
                </button>
              ))}
            </div>

            {/* Master Volume */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-xs">Master Volume</span>
                <span className="text-white text-xs font-mono">{masterVolume}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Sound Layers */}
          <div className="lg:col-span-2 bg-[#12122a]/80 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium text-sm">Environment Layers</h3>
              <span className="text-gray-500 text-xs">{layers.filter(l => l.active).length} active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {layers.map(layer => (
                <div
                  key={layer.id}
                  className={`p-4 rounded-xl border transition-all ${
                    layer.active
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/[0.02] border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={`p-2 rounded-lg transition-all ${
                        layer.active ? 'bg-white/10' : 'bg-white/5'
                      }`}
                      style={{ color: layer.active ? layer.color : '#6b7280' }}
                    >
                      <layer.icon className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${layer.active ? 'text-white' : 'text-gray-500'}`}>
                        {layer.name}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={`w-10 h-5 rounded-full transition-all relative ${
                        layer.active ? 'bg-indigo-500' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        layer.active ? 'left-5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>

                  {layer.active && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={layer.volume}
                          onChange={(e) => updateLayerVolume(layer.id, parseInt(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                      </div>
                      <span className="text-gray-500 text-[10px] font-mono w-8">{layer.volume}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Spatial Visualization */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Waves className="w-4 h-4 text-indigo-400" />
                <span className="text-gray-400 text-xs">Spatial Field Preview</span>
              </div>
              <div className="relative h-32 flex items-center justify-center">
                {/* Center listener */}
                <div className="relative w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center z-10">
                  <Headphones className="w-4 h-4 text-indigo-400" />
                </div>
                
                {/* Sound rings */}
                {layers.filter(l => l.active).map((layer, i) => {
                  const radius = 40 + i * 20;
                  return (
                    <div
                      key={layer.id}
                      className="absolute rounded-full border animate-pulse"
                      style={{
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`,
                        borderColor: `${layer.color}30`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '3s',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpatialAudioPanel;
