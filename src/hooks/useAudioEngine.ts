
import { useRef, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface BinauralLayer {
  id: string;
  leftFreq: number;
  rightFreq: number;
  volume: number;
  pan: number; // -1 (left) to 1 (right)
  isMuted?: boolean;
}

export function useAudioEngine() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [layers, setLayers] = useState<BinauralLayer[]>([]);
  const nodesRef = useRef<Record<string, {
    leftOsc: OscillatorNode;
    rightOsc: OscillatorNode;
    leftGain: GainNode;
    rightGain: GainNode;
    leftPanner: StereoPannerNode;
    rightPanner: StereoPannerNode;
  }>>({});
  const [isPlaying, setIsPlaying] = useState(false);

  // Session (single-tone) controls
  const sessionRef = useRef<{ osc?: OscillatorNode; gain?: GainNode } | null>(null);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [volume, setVolumeState] = useState<number>(0.3);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      try { console.debug('[AudioEngine] created AudioContext', audioContextRef.current.state); } catch {}
    }
    try { console.debug('[AudioEngine] getContext state', audioContextRef.current?.state); } catch {}
    return audioContextRef.current;
  }, []);

  // Add a new binaural layer
  const addLayer = useCallback((layer: Partial<BinauralLayer>) => {
    const id = uuidv4();
    setLayers(layers => [
      ...layers,
      {
        id,
        leftFreq: layer.leftFreq ?? 440,
        rightFreq: layer.rightFreq ?? 444,
        volume: layer.volume ?? 0.3,
        pan: layer.pan ?? 0,
        isMuted: false,
      },
    ]);
    return id;
  }, []);

  // Remove a layer by id
  const removeLayer = useCallback((id: string) => {
    setLayers(layers => layers.filter(l => l.id !== id));
    // Stop and disconnect nodes
    if (nodesRef.current[id]) {
      Object.values(nodesRef.current[id]).forEach(node => {
        try { node.disconnect(); } catch {}
        try { (node as any).stop?.(); } catch {}
      });
      delete nodesRef.current[id];
    }
  }, []);

  // Update a layer
  const updateLayer = useCallback((id: string, update: Partial<BinauralLayer>) => {
    setLayers(layers => layers.map(l => l.id === id ? { ...l, ...update } : l));
  }, []);

  // Play all layers
  const playAll = useCallback(async () => {
    const ctx = getContext();
    try { console.debug('[AudioEngine] playAll - AudioContext state before resume:', ctx.state); } catch {}
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    setIsPlaying(true);
    layers.forEach(layer => {
      if (nodesRef.current[layer.id]) {
        // Already playing
        return;
      }
      // Left channel
      const leftOsc = ctx.createOscillator();
      const leftGain = ctx.createGain();
      const leftPanner = ctx.createStereoPanner();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(layer.leftFreq, ctx.currentTime);
      leftGain.gain.setValueAtTime(layer.isMuted ? 0 : layer.volume, ctx.currentTime);
      leftPanner.pan.value = Math.max(-1, Math.min(0, layer.pan));
      leftOsc.connect(leftGain).connect(leftPanner).connect(ctx.destination);
      leftOsc.start();

      // Right channel
      const rightOsc = ctx.createOscillator();
      const rightGain = ctx.createGain();
      const rightPanner = ctx.createStereoPanner();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(layer.rightFreq, ctx.currentTime);
      rightGain.gain.setValueAtTime(layer.isMuted ? 0 : layer.volume, ctx.currentTime);
      rightPanner.pan.value = Math.min(1, Math.max(0, layer.pan));
      rightOsc.connect(rightGain).connect(rightPanner).connect(ctx.destination);
      rightOsc.start();

      nodesRef.current[layer.id] = {
        leftOsc, rightOsc, leftGain, rightGain, leftPanner, rightPanner
      };
    });
  }, [layers, getContext]);

  // Stop all layers
  const stopAll = useCallback(() => {
    setIsPlaying(false);
    Object.keys(nodesRef.current).forEach(id => {
      const nodes = nodesRef.current[id];
      if (nodes) {
        try { nodes.leftOsc.stop(); nodes.leftOsc.disconnect(); } catch {}
        try { nodes.rightOsc.stop(); nodes.rightOsc.disconnect(); } catch {}
        try { nodes.leftGain.disconnect(); } catch {}
        try { nodes.rightGain.disconnect(); } catch {}
        try { nodes.leftPanner.disconnect(); } catch {}
        try { nodes.rightPanner.disconnect(); } catch {}
      }
      delete nodesRef.current[id];
    });
  }, []);

  // Mute/unmute a layer
  const setLayerMute = useCallback((id: string, mute: boolean) => {
    setLayers(layers => layers.map(l => l.id === id ? { ...l, isMuted: mute } : l));
    if (nodesRef.current[id]) {
      nodesRef.current[id].leftGain.gain.value = mute ? 0 : layers.find(l => l.id === id)?.volume ?? 0.3;
      nodesRef.current[id].rightGain.gain.value = mute ? 0 : layers.find(l => l.id === id)?.volume ?? 0.3;
    }
  }, [layers]);

  // Set volume for a layer
  const setLayerVolume = useCallback((id: string, volume: number) => {
    setLayers(layers => layers.map(l => l.id === id ? { ...l, volume } : l));
    if (nodesRef.current[id]) {
      nodesRef.current[id].leftGain.gain.value = volume;
      nodesRef.current[id].rightGain.gain.value = volume;
    }
  }, []);

  // Set frequency for a layer
  const setLayerFrequencies = useCallback((id: string, leftFreq: number, rightFreq: number) => {
    setLayers(layers => layers.map(l => l.id === id ? { ...l, leftFreq, rightFreq } : l));
    if (nodesRef.current[id]) {
      nodesRef.current[id].leftOsc.frequency.value = leftFreq;
      nodesRef.current[id].rightOsc.frequency.value = rightFreq;
    }
  }, []);

  // Set pan for a layer
  const setLayerPan = useCallback((id: string, pan: number) => {
    setLayers(layers => layers.map(l => l.id === id ? { ...l, pan } : l));
    if (nodesRef.current[id]) {
      nodesRef.current[id].leftPanner.pan.value = Math.max(-1, Math.min(0, pan));
      nodesRef.current[id].rightPanner.pan.value = Math.min(1, Math.max(0, pan));
    }
  }, []);

  // UI sound (unchanged)
  const playUISound = useCallback((type: 'tap' | 'swipe' | 'success' | 'navigate') => {
    const ctx = getContext();
    try { console.debug('[AudioEngine] playUISound - AudioContext state:', ctx.state, 'type=', type); } catch {}
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    gain.gain.setValueAtTime(0, ctx.currentTime);
    const tuningRatio = 432 / 440;
    switch (type) {
      case 'tap':
        osc.frequency.setValueAtTime(528 * tuningRatio, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        break;
      case 'swipe':
        osc.frequency.setValueAtTime(396 * tuningRatio, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(528 * tuningRatio, ctx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
        break;
      case 'success':
        osc.frequency.setValueAtTime(528 * tuningRatio, ctx.currentTime);
        osc.frequency.setValueAtTime(639 * tuningRatio, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(741 * tuningRatio, ctx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        break;
      case 'navigate':
        osc.frequency.setValueAtTime(432 * tuningRatio, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(528 * tuningRatio, ctx.currentTime + 0.15);
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        break;
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }, [getContext]);

  // Play a single continuous frequency (used by session player)
  const playFrequency = useCallback(async (freq: number, vol = 0.3) => {
    const ctx = getContext();
    try { console.debug('[AudioEngine] playFrequency - AudioContext state before resume:', ctx.state, 'freq=', freq); } catch {}
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (err) { console.warn('[AudioEngine] resume failed', err); }
    }

    // If already playing, update frequency
    if (sessionRef.current?.osc) {
      try { sessionRef.current.osc!.frequency.setValueAtTime(freq, ctx.currentTime); } catch {}
      setCurrentFrequency(freq);
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    osc.connect(gain).connect(ctx.destination);
    try { osc.start(); } catch (err) { console.warn('[AudioEngine] osc.start failed', err); }

    sessionRef.current = { osc, gain };
    setCurrentFrequency(freq);
    setIsPlaying(true);
    setVolumeState(vol);
  }, [getContext]);

  const stopFrequency = useCallback(() => {
    try { console.debug('[AudioEngine] stopFrequency - AudioContext state', (audioContextRef.current || { state: 'unknown' }).state); } catch {}
    if (sessionRef.current?.osc) {
      try { sessionRef.current.osc.stop(); } catch {}
      try { sessionRef.current.osc.disconnect(); } catch {}
      sessionRef.current.osc = undefined;
    }
    if (sessionRef.current?.gain) {
      try { sessionRef.current.gain.disconnect(); } catch {}
      sessionRef.current.gain = undefined;
    }
    sessionRef.current = null;
    setCurrentFrequency(null);
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    if (sessionRef.current?.gain) {
      try { sessionRef.current.gain.gain.setValueAtTime(clamped, (audioContextRef.current || getContext()).currentTime); } catch {}
    }
  }, [getContext]);

  return {
    layers,
    isPlaying,
    currentFrequency,
    volume,
    addLayer,
    removeLayer,
    updateLayer,
    playAll,
    stopAll,
    playFrequency,
    stopFrequency,
    setVolume,
    setLayerMute,
    setLayerVolume,
    setLayerFrequencies,
    setLayerPan,
    playUISound,
  };
}
