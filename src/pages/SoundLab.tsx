import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine, BinauralLayer } from '@/hooks/useAudioEngine';
import { useEffect } from 'react';
import { solfeggioFrequencies } from '@/data/sessions';
import { useAuth } from '@/contexts/AuthContext';
import {
  Preset as PresetType,
  getLocalPresets,
  saveLocalPresets,
  exportPresets as presetExport,
  importPresets as presetImport,
  getRemotePresets,
  saveRemotePreset,
  deleteRemotePreset,
  subscribeRemotePresets,
  syncLocalToRemote,
} from '@/lib/PresetService';

const defaultLayer = () => ({
  leftFreq: 174,
  rightFreq: 176,
  volume: 0.3,
  pan: 0,
});

const SoundLab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const audio = useAudioEngine();
  useEffect(() => {
    try { console.debug('[SoundLab] audio API:', Object.keys(audio)); } catch {}
  }, [audio]);
  const [presetName, setPresetName] = useState('');
  const [presets, setPresets] = useState<PresetType[]>([]);
  const { user } = useAuth();

  // initialize presets from localStorage for signed-out users, or subscribe to remote when signed-in
  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (user) {
      (async () => {
        try {
          const merged = await syncLocalToRemote(user.uid);
          setPresets(merged);
          // subscribe for realtime updates
          unsub = subscribeRemotePresets(user.uid, (items) => setPresets(items));
        } catch (err) {
          console.warn('Preset sync failed', err);
          setPresets(getLocalPresets());
        }
      })();
    } else {
      setPresets(getLocalPresets());
    }

    return () => { if (unsub) unsub(); };
  }, [user]);

  // Preset management
  const savePreset = async () => {
    if (!presetName) return;
    const p = { name: presetName, layers: audio.layers } as PresetType;
    if (user) {
      try {
        await saveRemotePreset(user.uid, p);
        // remote subscription will update state
      } catch (err) {
        console.warn('Failed to save remote preset', err);
      }
    } else {
      const newPresets = [...presets, p];
      setPresets(newPresets);
      saveLocalPresets(newPresets);
    }
    setPresetName('');
  };
  const loadPreset = (layers: BinauralLayer[]) => {
    audio.stopAll();
    layers.forEach(layer => audio.addLayer(layer));
  };
  const deletePreset = async (identifier: string) => {
    // identifier may be id or name for legacy local presets
    if (user) {
      try {
        // if identifier looks like an id present in presets, delete by id
        const target = presets.find(p => p.id === identifier) || presets.find(p => p.name === identifier);
        if (target && target.id) await deleteRemotePreset(user.uid, target.id);
      } catch (err) {
        console.warn('Failed to delete remote preset', err);
      }
    } else {
      const newPresets = presets.filter(p => p.name !== identifier);
      setPresets(newPresets);
      saveLocalPresets(newPresets);
    }
  };
  const exportPresets = () => {
    const data = JSON.stringify(presets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soundlab_presets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPresets = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as PresetType[];
        if (user) {
          // push each imported preset to remote
          for (const p of imported) {
            await saveRemotePreset(user.uid, { name: p.name, layers: p.layers });
          }
        } else {
          setPresets(imported);
          saveLocalPresets(imported);
        }
      } catch (err) {
        console.warn('Failed to import presets', err);
      }
    };
    reader.readAsText(file);
  };

  // Add Solfeggio quick layer
  const addSolfeggio = (hz: number) => {
    audio.addLayer({ leftFreq: hz, rightFreq: hz + 2, volume: 0.3, pan: 0 });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4" lang={i18n.language} dir={i18n.dir()}>
      <h1 className="text-3xl font-bold mb-4">{t('soundLab.title')}</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {solfeggioFrequencies.map(f => (
          <button key={f.hz} className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200" onClick={() => addSolfeggio(f.hz)}>
            {t(`soundLab.solfeggioButtons.${f.hz}Hz`, f.name)} ({f.hz} Hz)
          </button>
        ))}
        <button className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200" onClick={() => audio.addLayer(defaultLayer())}>{t('soundLab.solfeggioButtons.custom')}</button>
      </div>
      <div className="space-y-4 mb-8">
        {audio.layers.map(layer => (
          <div key={layer.id} className="flex flex-col md:flex-row md:items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">L</label>
              <input
                type="number"
                inputMode="numeric"
                step="0.1"
                className="w-28 px-2 py-1 rounded bg-white/10"
                value={layer.leftFreq}
                min={20}
                max={2000}
                onChange={e => audio.setLayerFrequencies(layer.id, Number(e.target.value || 0), layer.rightFreq)}
                aria-label={t('soundLab.layer.leftHz') as string}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">R</label>
              <input
                type="number"
                inputMode="numeric"
                step="0.1"
                className="w-28 px-2 py-1 rounded bg-white/10"
                value={layer.rightFreq}
                min={20}
                max={2000}
                onChange={e => audio.setLayerFrequencies(layer.id, layer.leftFreq, Number(e.target.value || 0))}
                aria-label={t('soundLab.layer.rightHz') as string}
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="range" min={0} max={1} step={0.01} value={layer.volume} onChange={e => audio.setLayerVolume(layer.id, Number(e.target.value))} />
              <span className="text-gray-400 text-sm">{t('soundLab.layer.volume')}</span>
            </div>

            <div className="flex items-center gap-2">
              <input type="range" min={-1} max={1} step={0.01} value={layer.pan} onChange={e => audio.setLayerPan(layer.id, Number(e.target.value))} />
              <span className="text-gray-400 text-sm">{t('soundLab.layer.pan')}</span>
            </div>

            <div className="flex items-center gap-2 md:ml-auto">
              <button className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded" onClick={() => audio.setLayerMute(layer.id, !layer.isMuted)}>{layer.isMuted ? t('soundLab.layer.unmute') : t('soundLab.layer.mute')}</button>
              <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded" onClick={() => audio.removeLayer(layer.id)}>{t('soundLab.layer.remove')}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mb-8">
        <button
          className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold"
          onClick={() => {
            if (audio.isPlaying) {
              if (audio.stopAll) audio.stopAll();
              else if (audio.stopFrequency) audio.stopFrequency();
              else console.warn('No stop handler available on audio engine', audio);
            } else {
              if (audio.playAll) audio.playAll();
              else if (audio.playFrequency) audio.playFrequency(528);
              else console.warn('No play handler available on audio engine', audio);
            }
          }}
        >
          {audio.isPlaying ? t('soundLab.controls.stopAll') : t('soundLab.controls.playAll')}
        </button>
      </div>
      <div className="mb-6 p-3 bg-white/5 rounded flex items-center gap-3">
        <div className="text-sm text-gray-300">
          {t('soundLab.debug.current')}: {audio.currentFrequency ? `${audio.currentFrequency} Hz` : t('soundLab.debug.idle')}
        </div>
        <button className="px-3 py-1 rounded bg-green-600 text-white text-sm" onClick={() => audio.playFrequency?.(528)}>{t('soundLab.debug.testTone')}</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white text-sm" onClick={() => audio.stopFrequency?.()}>{t('soundLab.debug.stopTone')}</button>
      </div>
      <div className="mb-8">
        <input className="px-2 py-1 rounded border mr-2" placeholder={t('soundLab.presets.presetNamePlaceholder')} value={presetName} onChange={e => setPresetName(e.target.value)} />
        <button className="px-3 py-1 rounded bg-blue-100 text-blue-700 mr-2" onClick={savePreset}>{t('soundLab.presets.save')}</button>
        <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 mr-2" onClick={exportPresets}>{t('soundLab.presets.export')}</button>
        <input type="file" accept="application/json" className="hidden" id="importPresets" onChange={importPresets} />
        <label htmlFor="importPresets" className="px-3 py-1 rounded bg-gray-100 text-gray-700 cursor-pointer">{t('soundLab.presets.import')}</label>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold mb-2">{t('soundLab.presets.presetsTitle')}</h2>
        <ul>
          {presets.map(p => (
            <li key={p.id || p.name} className="flex items-center gap-2 mb-1">
              <span>{p.name}</span>
              <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded" onClick={() => loadPreset(p.layers)}>{t('soundLab.presets.load')}</button>
              <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded" onClick={() => deletePreset(p.id || p.name)}>{t('soundLab.presets.delete')}</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Spectrum Analyzer placeholder - to be implemented */}
      <div className="bg-black rounded-xl h-40 flex items-center justify-center text-gray-400">{t('soundLab.analyzer.comingSoon')}</div>
    </div>
  );
};

export default SoundLab;
