export type LayoutType = '60%' | '65%' | '75%' | 'TKL' | 'Full';

export type KeyZone = 
  | 'alphanumeric'
  | 'function'
  | 'navigation'
  | 'numpad'
  | 'modifiers'
  | 'spacebar';

export type CaseMaterial = 'aluminum' | 'plastic' | 'wood' | 'carbon';

/** 爆炸拆解五层，顺序自下而上 */
export type LayerId = 'case' | 'pcb' | 'plate' | 'switch' | 'keycap';

export interface LayerConfig {
  id: LayerId;
  name: string;
  shortName: string;
  description: string;
  details: string[];
  /** 该层在整机中的基准高度（Y 坐标） */
  baseY: number;
  /** 爆炸时相对基准高度额外抬升的层间距倍数基数 */
  order: number;
  color: string;
}

export interface KeyConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  col: number;
  zone: KeyZone;
  keyCode?: string;
}

export interface LayoutConfig {
  type: LayoutType;
  name: string;
  description: string;
  keys: KeyConfig[];
  width: number;
  height: number;
}

export interface MaterialConfig {
  id: CaseMaterial;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
}

export interface ZoneConfig {
  id: KeyZone;
  name: string;
  description: string;
  defaultColor: string;
}

export interface KeyboardState {
  layout: LayoutType;
  caseMaterial: CaseMaterial;
  zoneColors: Record<KeyZone, string>;
  pressedKeys: Set<string>;
  /** 爆炸程度 0~1（0 = 整机装配，1 = 完全分层） */
  explosion: number;
  /** 当前高亮选中的结构层，null = 未选中 */
  selectedLayer: LayerId | null;
}

export interface KeyboardActions {
  setLayout: (layout: LayoutType) => void;
  setCaseMaterial: (material: CaseMaterial) => void;
  setZoneColor: (zone: KeyZone, color: string) => void;
  pressKey: (keyId: string) => void;
  releaseKey: (keyId: string) => void;
  resetColors: () => void;
  setExplosion: (value: number) => void;
  setSelectedLayer: (layer: LayerId | null) => void;
}
