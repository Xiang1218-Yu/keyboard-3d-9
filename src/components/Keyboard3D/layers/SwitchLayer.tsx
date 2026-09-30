import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLayout, useIsKeyPressed, useSelectedLayer } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { KeyConfig } from '@/types/keyboard';
import { LayerGroup } from '../LayerGroup';
import { KeyGrid } from '../KeyGrid';
import { keyCenter } from '../geometry';

interface SwitchProps {
  k: KeyConfig;
  layerSelected: boolean;
}

/**
 * 单颗轴体：
 * - 深色底座（穿过定位板轴孔落在 PCB 上）
 * - 透明上盖，可看到内部
 * - 红色十字轴心（几何体），按下时向下滑动
 */
function Switch({ k, layerSelected }: SwitchProps) {
  const stemRef = useRef<THREE.Group>(null);
  const isPressed = useIsKeyPressed(k.id);
  const [x, , z] = keyCenter(k);

  useFrame((_, delta) => {
    const s = stemRef.current;
    if (!s) return;
    // 轴心触发行程 0.12，与键帽下按 0.15 接近，视觉上保持联动
    s.position.y = THREE.MathUtils.lerp(s.position.y, isPressed ? -0.02 : 0.1, delta * 15);
  });

  return (
    <group position={[x, 0, z]}>
      {/* 底座 */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.5, 0.16, 0.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* 透明上盖 */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[0.46, 0.26, 0.46]} />
        <meshStandardMaterial
          color={layerSelected ? '#c7d2fe' : '#e2e8f0'}
          roughness={0.15}
          metalness={0.0}
          transparent
          opacity={layerSelected ? 0.55 : 0.38}
          emissive={layerSelected ? '#818cf8' : '#000000'}
          emissiveIntensity={layerSelected ? 0.5 : 0}
        />
      </mesh>

      {/* 十字轴心（plus-shaped stem） */}
      <group ref={stemRef} position={[0, 0.1, 0]}>
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[0.1, 0.34, 0.3]} />
          <meshStandardMaterial color="#dc2626" roughness={0.45} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[0.3, 0.34, 0.1]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.45} metalness={0.05} />
        </mesh>
      </group>

      {/* 两颗金属引脚，指向 PCB 焊盘 */}
      <mesh position={[-0.09, -0.04, 0.12]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.09, -0.04, 0.12]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** 第 4 层：轴体（每键一颗） */
export function SwitchLayer() {
  const layout = useLayout();
  const selectedLayer = useSelectedLayer();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const layerSelected = selectedLayer === 'switch';

  const switches = useMemo(
    () =>
      layoutConfig.keys.map((k) => (
        <Switch key={k.id} k={k} layerSelected={layerSelected} />
      )),
    [layoutConfig, layerSelected],
  );

  return (
    <LayerGroup layer="switch">
      <KeyGrid layoutConfig={layoutConfig}>{switches}</KeyGrid>
    </LayerGroup>
  );
}
