import { db } from '@/lib/firebase';
import type { BinauralLayer } from '@/hooks/useAudioEngine';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

export type Preset = {
  id?: string;
  name: string;
  layers: BinauralLayer[];
  createdAt?: any;
  updatedAt?: any;
};

const LOCAL_KEY = 'soundlab_presets_local_v1';

export const getLocalPresets = (): Preset[] => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveLocalPresets = (presets: Preset[]) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(presets));
};

const userPresetsCol = (uid: string) => collection(db, 'users', uid, 'presets');

export const getRemotePresets = async (uid: string): Promise<Preset[]> => {
  const q = query(userPresetsCol(uid), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Preset[];
};

export const saveRemotePreset = async (uid: string, preset: Preset): Promise<Preset> => {
  if (preset.id) {
    const ref = doc(userPresetsCol(uid), preset.id);
    await setDoc(ref, { ...preset, updatedAt: serverTimestamp() }, { merge: true });
    const fresh = await getDoc(ref);
    return { id: fresh.id, ...(fresh.data() as any) } as Preset;
  } else {
    const ref = await addDoc(userPresetsCol(uid), { ...preset, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    const fresh = await getDoc(ref);
    return { id: fresh.id, ...(fresh.data() as any) } as Preset;
  }
};

export const deleteRemotePreset = async (uid: string, id: string) => {
  await deleteDoc(doc(userPresetsCol(uid), id));
};

export const subscribeRemotePresets = (uid: string, onChange: (presets: Preset[]) => void) => {
  const q = query(userPresetsCol(uid), orderBy('updatedAt', 'desc'));
  const unsub = onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Preset[];
    onChange(items);
  });
  return unsub;
};

export const syncLocalToRemote = async (uid: string) => {
  const local = getLocalPresets();
  const remote = await getRemotePresets(uid);
  const remoteNames = new Set(remote.map(r => r.name));

  for (const lp of local) {
    if (!remoteNames.has(lp.name)) {
      await saveRemotePreset(uid, { name: lp.name, layers: lp.layers });
    }
  }

  const merged = await getRemotePresets(uid);
  // Optionally clear local after successful sync:
  // saveLocalPresets([]);
  return merged;
};
