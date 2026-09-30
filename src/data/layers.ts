import { LayerId } from '@/types/keyboard';

export interface LayerConfig {
  id: LayerId;
  name: string;
  enName: string;
  description: string;
  details: string[];
  /** 爆炸程度为 100% 时该层沿 Y 轴的位移量（纯垂直位移，保证各层中心对齐） */
  explodeOffset: number;
  /** UI 中标识该层的强调色 */
  accent: string;
}

export const LAYER_CONFIGS: Record<LayerId, LayerConfig> = {
  keycaps: {
    id: 'keycaps',
    name: '键帽层',
    enName: 'Keycaps',
    description: '手指直接触碰的部件，决定键盘的外观风格与触感第一印象。',
    details: [
      '常见材质：ABS 顺滑 / PBT 耐磨',
      '字符工艺：二色成型、热升华',
      '可自由拔插更换，定制配色与高度',
    ],
    explodeOffset: 3.4,
    accent: '#a78bfa',
  },
  switches: {
    id: 'switches',
    name: '轴体层',
    enName: 'Switches',
    description: '每颗按键下方都有一颗独立的机械轴体，是决定手感与声音的核心。',
    details: [
      '每键一颗轴体，位置与键帽一一对应',
      '线性 / 段落 / 有声三种手感类型',
      '顶部十字轴心用于固定键帽',
    ],
    explodeOffset: 2.0,
    accent: '#f87171',
  },
  plate: {
    id: 'plate',
    name: '定位板',
    enName: 'Plate',
    description: '开有轴孔的金属板，夹住轴体并提供侧向支撑，影响敲击稳定性与声音。',
    details: [
      '开孔位置与每颗轴体一一对应',
      '铝合金 / PC / FR4 等材质可选',
      '轴体上壳穿过轴孔卡入定位板',
    ],
    explodeOffset: 1.0,
    accent: '#38bdf8',
  },
  pcb: {
    id: 'pcb',
    name: 'PCB 电路板',
    enName: 'PCB',
    description: '键盘的电路核心，每个轴位对应一组焊盘，主控芯片负责扫描按键矩阵。',
    details: [
      '金色焊盘与轴体位置一一对齐',
      '主控芯片完成按键矩阵扫描',
      '部分型号支持热插拔轴座',
    ],
    explodeOffset: -0.7,
    accent: '#34d399',
  },
  case: {
    id: 'case',
    name: '外壳',
    enName: 'Case',
    description: '整机的结构基础，承载内部所有组件，影响整机重量、共振与质感。',
    details: [
      '铝合金 / ABS / 实木 / 碳纤维可选',
      '内腔容纳 PCB、定位板与电池',
      '决定整机的配重与声学表现',
    ],
    explodeOffset: -1.8,
    accent: '#fbbf24',
  },
};

/** 自上而下：键帽 → 轴体 → 定位板 → PCB → 外壳 */
export const LAYER_LIST: LayerId[] = ['keycaps', 'switches', 'plate', 'pcb', 'case'];
