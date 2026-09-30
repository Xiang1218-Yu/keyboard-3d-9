import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useCaseMaterial, useLayout, useSelectedLayer } from '@/store/useKeyboardStore';
import { MATERIAL_CONFIGS } from '@/data/materials';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { LayerGroup } from '../LayerGroup';

/** 第 1 层（最底）：外壳 —— 由底壳 + 四周围框构成的托盘，内部容纳 PCB */
export function CaseLayer() {
  const materialId = useCaseMaterial();
  const layout = useLayout();
  const selectedLayer = useSelectedLayer();
  const materialConfig = MATERIAL_CONFIGS[materialId];
  const layoutConfig = LAYOUT_CONFIGS[layout];

  const outerW = layoutConfig.width + 1.2;
  const outerD = layoutConfig.height + 1.2;
  const innerW = layoutConfig.width + 0.4;
  const innerD = layoutConfig.height + 0.4;
  const wallT = (outerW - innerW) / 2;
  const selected = selectedLayer === 'case';

  const emissive = selected ? '#6366f1' : '#000000';
  const emissiveIntensity = selected ? 0.25 : 0;

  // 四角位置随当前布局尺寸计算，布局切换整组 remount 后不会残留旧螺丝
  const corners = useMemo(
    () => [
      [innerW / 2 - 0.2, innerD / 2 - 0.2],
      [-innerW / 2 + 0.2, innerD / 2 - 0.2],
      [innerW / 2 - 0.2, -innerD / 2 + 0.2],
      [-innerW / 2 + 0.2, -innerD / 2 + 0.2],
    ],
    [innerW, innerD],
  );

  const shellMat = (
    <meshStandardMaterial
      color={materialConfig.color}
      roughness={materialConfig.roughness}
      metalness={materialConfig.metalness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );

  return (
    <LayerGroup layer="case">
      {/* 底壳 */}
      <RoundedBox args={[outerW, 0.28, outerD]} radius={0.12} smoothness={5} castShadow receiveShadow position={[0, 0.14, 0]}>
        {shellMat}
      </RoundedBox>

      {/* 四面围框（前/后） */}
      <RoundedBox args={[outerW, 0.62, wallT]} radius={0.06} smoothness={4} castShadow position={[0, 0.5, innerD / 2 + wallT / 2]}>
        {shellMat}
      </RoundedBox>
      <RoundedBox args={[outerW, 0.62, wallT]} radius={0.06} smoothness={4} castShadow position={[0, 0.5, -innerD / 2 - wallT / 2]}>
        {shellMat}
      </RoundedBox>
      {/* 四面围框（左/右） */}
      <RoundedBox args={[wallT, 0.62, innerD]} radius={0.06} smoothness={4} castShadow position={[innerW / 2 + wallT / 2, 0.5, 0]}>
        {shellMat}
      </RoundedBox>
      <RoundedBox args={[wallT, 0.62, innerD]} radius={0.06} smoothness={4} castShadow position={[-innerW / 2 - wallT / 2, 0.5, 0]}>
        {shellMat}
      </RoundedBox>

      {/* 内胆底面（深色空腔） */}
      <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[innerW, innerD]} />
        <meshStandardMaterial color="#111827" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* 四颗铜质支撑柱 + 顶部螺丝 */}
      {corners.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.38, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.22, 16]} />
            <meshStandardMaterial color="#b08d3e" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
            <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.9} />
          </mesh>
        </group>
      ))}
    </LayerGroup>
  );
}
