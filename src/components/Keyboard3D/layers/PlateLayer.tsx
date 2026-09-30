import { memo, useMemo } from 'react';
import { useLayout, useSelectedLayer } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyConfig } from '@/types/keyboard';
import { LayerGroup } from '../LayerGroup';
import { KeyGrid } from '../KeyGrid';
import { keyCenter } from '../geometry';

interface CutoutProps {
  k: KeyConfig;
}

/** 轴孔：深色凹面 + 略亮的金属孔沿，表达定位板在每个轴位的开口 */
function SwitchCutout({ k }: CutoutProps) {
  const [x, , z] = keyCenter(k);
  const w = k.width * 0.78;
  const d = k.height * 0.78;
  return (
    <group position={[x, 0, z]}>
      {/* 孔（深色，与下方 PCB 呼应） */}
      <mesh position={[0, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* 孔沿四条边 */}
      <mesh position={[0, 0.065, d / 2]}>
        <boxGeometry args={[w, 0.02, 0.04]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.065, -d / 2]}>
        <boxGeometry args={[w, 0.02, 0.04]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[w / 2, 0.065, 0]}>
        <boxGeometry args={[0.04, 0.02, d]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh position={[-w / 2, 0.065, 0]}>
        <boxGeometry args={[0.04, 0.02, d]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.9} />
      </mesh>
    </group>
  );
}

/** 第 3 层：定位板 */
function PlateLayerImpl() {
  const layout = useLayout();
  const selectedLayer = useSelectedLayer();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const selected = selectedLayer === 'plate';

  const cutouts = useMemo(
    () => layoutConfig.keys.map((k) => <SwitchCutout key={k.id} k={k} />),
    [layoutConfig],
  );

  const plateW = layoutConfig.width + 0.3;
  const plateD = layoutConfig.height + 0.3;

  const screws = useMemo(
    () => [
      [plateW / 2 - 0.35, plateD / 2 - 0.35],
      [-plateW / 2 + 0.35, plateD / 2 - 0.35],
      [plateW / 2 - 0.35, -plateD / 2 + 0.35],
      [-plateW / 2 + 0.35, -plateD / 2 + 0.35],
    ],
    [plateW, plateD],
  );

  return (
    <LayerGroup layer="plate">
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[plateW, 0.1, plateD]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.22}
          metalness={0.85}
          emissive={selected ? '#a5b4fc' : '#000000'}
          emissiveIntensity={selected ? 0.45 : 0}
        />
      </mesh>

      <KeyGrid layoutConfig={layoutConfig}>{cutouts}</KeyGrid>

      {/* 四角固定螺丝柱 */}
      {screws.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.09, z]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 20]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </LayerGroup>
  );
}

export const PlateLayer = memo(PlateLayerImpl);
