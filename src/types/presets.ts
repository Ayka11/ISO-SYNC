import type { BinauralLayer } from '@/hooks/useAudioEngine';

export type Preset = {
  id?: string;
  name: string;
  layers: BinauralLayer[];
  createdAt?: any;
  updatedAt?: any;
};
