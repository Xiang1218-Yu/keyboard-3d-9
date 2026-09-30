import { LayerConfig, LayerId } from '@/types/keyboard';

/**
 * 完全爆炸时相邻两层之间的垂直间距。
 * 层 i 的抬升量 = order * EXPLODE_SPACING * explosion，
 * 所有层以同一公式沿 Y 轴平移，因此层间始终保持中心对齐。
 */
export const EXPLODE_SPACING = 2.2;

/** 自下而上的层顺序 */
export const LAYER_ORDER: LayerId[] = ['case', 'pcb', 'plate', 'switch', 'keycap'];

export const LAYER_CONFIGS: Record<LayerId, LayerConfig> = {
  case: {
    id: 'case',
    name: '外壳',
    shortName: '外壳',
    description: '键盘的底座与上盖，承载全部内部结构，提供配重与刚性。',
    details: [
      '一体成型底座，包裹并保护 PCB 与定位板',
      '内置坡形脚撑与配重，决定整机手感基调',
      '表面处理随材质切换：阳极铝、ABS、实木或碳纤维',
    ],
    baseY: -0.1,
    order: 0,
    color: '#94a3b8',
  },
  pcb: {
    id: 'pcb',
    name: 'PCB 电路板',
    shortName: 'PCB',
    description: '主控电路板，每个轴位都有焊接 / 热插拔焊盘与走线。',
    details: [
      '绿色阻焊层基板，扫描矩阵通过走线连接每个轴位',
      '每个轴位一对金属焊盘，热插拔轴座以小方块表示',
      '主控芯片、晶振与 USB-C 接口集中布置在边缘',
    ],
    baseY: 0.32,
    order: 1,
    color: '#15803d',
  },
  plate: {
    id: 'plate',
    name: '定位板',
    shortName: '定位板',
    description: '金属或玻纤薄板，通过轴孔固定每颗轴体的位置。',
    details: [
      '每个轴位一个十字轴孔，限制轴体水平位移',
      '将敲击力分散到整块板面，影响声音与刚性',
      '四角螺丝柱将定位板与底壳锁紧',
    ],
    baseY: 0.68,
    order: 2,
    color: '#cbd5e1',
  },
  switch: {
    id: 'switch',
    name: '轴体',
    shortName: '轴体',
    description: '每个轴位一颗机械轴：透明外壳内是弹簧与十字轴心。',
    details: [
      '透明上盖 + 深色底座，内部红色十字轴心为按动部件',
      '轴心随爆炸上升，可直观看到它与定位板轴孔的对位',
      '按下键帽时轴心同步下压，模拟真实触发行程',
    ],
    baseY: 0.94,
    order: 3,
    color: '#fca5a5',
  },
  keycap: {
    id: 'keycap',
    name: '键帽',
    shortName: '键帽',
    description: '最外层接触手指的部分，按功能区分区着色。',
    details: [
      'OEM 高度带弧度的圆角键帽，二色注塑字符',
      '可点击按压，也支持物理键盘实时联动',
      '分区颜色可在右侧面板自定义',
    ],
    baseY: 1.34,
    order: 4,
    color: '#f8fafc',
  },
};

export const LAYER_LIST: LayerConfig[] = LAYER_ORDER.map((id) => LAYER_CONFIGS[id]);
