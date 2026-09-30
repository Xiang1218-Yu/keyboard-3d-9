import { memo, useMemo } from 'react';
import { useLayout, useSelectedLayer } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyConfig } from '@/types/keyboard';
import { LayerGroup } from '../LayerGroup';
import { KeyGrid } from '../KeyGrid';
import { keyCenter } from '../geometry';

interface PadProps {
  k: KeyConfig;
}

/** 单个轴位的焊盘 + 热插拔轴座，位置严格对齐键位中心 */
function SwitchPad({ k }: PadProps) {
  const [x, , z] = keyCenter(k);
  return (
    <group position={[x, 0, z]}>
      {/* 热插拔轴座 */}
      <mesh position={[0, 0.075, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.05, 0.42]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* 两个金属触点焊盘 */}
      <mesh position={[-0.09, 0.105, 0.06]}>
        <boxGeometry args={[0.08, 0.02, 0.14]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0.09, 0.105, 0.06]}>
        <boxGeometry args={[0.08, 0.02, 0.14]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* 中心定位孔（深色圆片） */}
      <mesh position={[0, 0.105, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshStandardMaterial color="#052e16" roughness={0.8} />
      </mesh>
    </group>
  );
}

/** 第 2 层：PCB 电路板 */
function PcbLayerImpl() {
  const layout = useLayout();
  const selectedLayer = useSelectedLayer();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const selected = selectedLayer === 'pcb';

  const pads = useMemo(
    () => layoutConfig.keys.map((k) => <SwitchPad key={k.id} k={k} />),
    [layoutConfig],
  );

  const boardW = layoutConfig.width + 0.5;
  const boardD = layoutConfig.height + 0.5;

  return (
    <LayerGroup layer="pcb">
      {/* 阻焊层基板 */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[boardW, 0.12, boardD]} />
        <meshStandardMaterial
          color="#15803d"
          roughness={0.55}
          metalness={0.15}
          emissive={selected ? '#22c55e' : '#000000'}
          emissiveIntensity={selected ? 0.35 : 0}
        />
      </mesh>

      <KeyGrid layoutConfig={layoutConfig}>
        {pads}

        {/* 主控 MCU */}
        <mesh position={[1.1, 0.14, layoutConfig.height - 0.7]} castShadow>
          <boxGeometry args={[1.1, 0.16, 1.1]} />
          <meshStandardMaterial color="#0b0f17" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* 晶振 */}
        <mesh position={[2.4, 0.13, layoutConfig.height - 0.7]} castShadow>
          <boxGeometry args={[0.5, 0.12, 0.28]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* USB-C 接口 */}
        <mesh position={[boardW / 2 + 0.05, 0.12, layoutConfig.height / 2 - 1]} castShadow>
          <boxGeometry args={[0.35, 0.16, 0.7]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.25} metalness={0.9} />
        </mesh>
        {/* 小型贴片电容组 */}
        {[-0.15, 0, 0.15].map((dz, i) => (
          <mesh key={i} position={[2.9 + i * 0.22, 0.11, layoutConfig.height - 1.25 + dz * 2]}>
            <boxGeometry args={[0.12, 0.08, 0.2]} />
            <meshStandardMaterial color="#e5e7eb" roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
      </KeyGrid>
    </LayerGroup>
  );
}

export const PcbLayer = memo(PcbLayerImpl);
