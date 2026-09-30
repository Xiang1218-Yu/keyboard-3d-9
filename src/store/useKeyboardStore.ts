import { create } from 'zustand';
import { KeyboardState, KeyboardActions, LayoutType, CaseMaterial, KeyZone, LayerId } from '@/types/keyboard';
import { DEFAULT_ZONE_COLORS } from '@/data/zones';

interface KeyboardStore extends KeyboardState, KeyboardActions {}

export const useKeyboardStore = create<KeyboardStore>((set) => ({
  layout: '65%',
  caseMaterial: 'aluminum',
  zoneColors: { ...DEFAULT_ZONE_COLORS },
  pressedKeys: new Set<string>(),
  explosion: 0,
  selectedLayer: null,

  setLayout: (layout: LayoutType) => {
    // 切换布局后旧布局的按键 id 全部失效，连同按压状态一起清空，避免遗留状态
    set({ layout, pressedKeys: new Set<string>() });
  },

  setCaseMaterial: (caseMaterial: CaseMaterial) => {
    set({ caseMaterial });
  },

  setZoneColor: (zone: KeyZone, color: string) => {
    set((state) => ({
      zoneColors: {
        ...state.zoneColors,
        [zone]: color,
      },
    }));
  },

  pressKey: (keyId: string) => {
    set((state) => {
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.add(keyId);
      return { pressedKeys: newPressedKeys };
    });
  },

  releaseKey: (keyId: string) => {
    set((state) => {
      const newPressedKeys = new Set(state.pressedKeys);
      newPressedKeys.delete(keyId);
      return { pressedKeys: newPressedKeys };
    });
  },

  resetColors: () => {
    set({ zoneColors: { ...DEFAULT_ZONE_COLORS } });
  },

  setExplosion: (value: number) => {
    set({ explosion: clamp01(value) });
  },

  setSelectedLayer: (layer: LayerId | null) => {
    set({ selectedLayer: layer });
  },
}));

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export const useLayout = () => useKeyboardStore((state) => state.layout);
export const useCaseMaterial = () => useKeyboardStore((state) => state.caseMaterial);
export const useZoneColors = () => useKeyboardStore((state) => state.zoneColors);
export const usePressedKeys = () => useKeyboardStore((state) => state.pressedKeys);
export const useExplosion = () => useKeyboardStore((state) => state.explosion);
export const useSelectedLayer = () => useKeyboardStore((state) => state.selectedLayer);
export const useIsKeyPressed = (keyId: string) =>
  useKeyboardStore((state) => state.pressedKeys.has(keyId));
