import { useMemo } from 'react';
import { useLayout } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyZone } from '@/types/keyboard';
import { LayerGroup } from '../LayerGroup';
import { KeyGrid } from '../KeyGrid';
import { KeyCap } from '../KeyCap';

/** 第 5 层（最顶）：键帽 */
export function KeycapLayer({ selectedZone }: { selectedZone: KeyZone | null }) {
  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];

  const keys = useMemo(
    () =>
      layoutConfig.keys.map((keyConfig) => (
        <KeyCap key={keyConfig.id} keyConfig={keyConfig} selectedZone={selectedZone} />
      )),
    [layoutConfig, selectedZone],
  );

  return (
    <LayerGroup layer="keycap">
      <KeyGrid layoutConfig={layoutConfig}>
        {keys}
        {/* 键帽间隙下的透明命中板：点间隙也能选中键帽层，而不会穿透到轴体层。
            opacity 0 + depthWrite false 使其视觉不可见但仍可被射线拾取；
            不响应 pointerdown，因此不会干扰 OrbitControls 拖拽。 */}
        <mesh position={[layoutConfig.width / 2, 0.28, layoutConfig.height / 2]}>
          <boxGeometry args={[layoutConfig.width, 0.02, layoutConfig.height]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </KeyGrid>
    </LayerGroup>
  );
}
