export type OutfitId = 'aodai' | 'nguthan' | 'nhatbinh' | 'tuthan' | 'baba' | 'giaolinh';

export type GenderMode = 'female' | 'male';

export type AccessoryId = 
  | 'nonla'
  | 'man'
  | 'khanran'
  | 'sneaker'
  | 'quat'
  | 'kinhram'
  | 'headphone'
  | 'tuicoi'
  | 'chuoingoc';

export type PatternId = 'plain' | 'lotus' | 'clouds' | 'waves' | 'tho';

export interface OutfitData {
  id: OutfitId;
  name: string;
  tagline: string;
  era: string; // e.g. "Thời Nguyễn (1802 - 1945)", "Thập niên 1930 - Nay"
  desc: string;
  philosophy: string;
  recommendedAccessories: AccessoryId[];
  suitableOccasions: string[];
  referenceCitation: string;
  defaultSecondaryColor: string;
}

export interface TraditionalColor {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  element: string; // Ngũ Hành: Kim, Mộc, Thủy, Hỏa, Thổ
  meaning: string;
}

export interface AccessoryData {
  id: AccessoryId;
  name: string;
  emoji: string;
  category: 'traditional' | 'streetwear';
  desc: string;
  tips: string;
}

export interface PresetLook {
  id: string;
  name: string;
  tagline: string;
  outfit: OutfitId;
  gender: GenderMode;
  colorHex: string;
  secondaryColorHex: string;
  pattern: PatternId;
  accessories: AccessoryId[];
  vibe: string;
}

export interface CulturalWarning {
  severity: 'note' | 'tip' | 'praise';
  title: string;
  message: string;
  historyContext: string;
}
