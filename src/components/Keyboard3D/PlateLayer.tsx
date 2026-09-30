import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { KeyConfig } from '@/types/keyboard';
import { useKeyboardStore } from '@/store/useKeyboardStore';

interface PlateLayerProps {
  keys: KeyConfig[];
  width: number;
  height: number;
  highlighted: boolean;
}

/**
 * 定位板：按当前布局开出轴孔的金属板。
 * 几何体由布局数据派生，布局切换时旧几何体主动 dispose，不遗留上一套对象。
 */
export function PlateLayer({ keys, width, height, highlighted }: PlateLayerProps) {
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);

  const geometry = useMemo(() => {
    const w = width + 0.4;
    const h = height + 0.4;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(w / 2, h / 2);
    shape.lineTo(-w / 2, h / 2);
    shape.closePath();

    // 每个键位开一个轴孔；网格绕 X 轴旋转 -90° 后 shape 的 y 轴对应世界 -z，故孔位取 -cz
    keys.forEach((k) => {
      const cx = k.x + k.width / 2 - width / 2;
      const cz = k.y + k.height / 2 - height / 2;
      const s = 0.36; // 轴孔半径（半边长）
      const hole = new THREE.Path();
      hole.moveTo(cx - s, -cz - s);
      hole.lineTo(cx + s, -cz - s);
      hole.lineTo(cx + s, -cz + s);
      hole.lineTo(cx - s, -cz + s);
      hole.closePath();
      shape.holes.push(hole);
    });

    return new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false });
  }, [keys, width, height]);

  // 布局切换 / 组件卸载时释放旧几何体，避免显存残留
  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return; // 拖拽旋转视角时不触发选中
    e.stopPropagation();
    setSelectedLayer('plate');
  };

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.06, 0]}
      castShadow
      receiveShadow
      onClick={handleClick}
    >
      <meshStandardMaterial
        color="#94a3b8"
        roughness={0.35}
        metalness={0.75}
        side={THREE.DoubleSide}
        emissive={highlighted ? '#6366f1' : '#000000'}
        emissiveIntensity={highlighted ? 0.35 : 0}
      />
    </mesh>
  );
}
