import { ReactNode, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { LayerId } from '@/types/keyboard';
import { LAYER_CONFIGS, EXPLODE_SPACING } from '@/data/layers';
import { useKeyboardStore, useExplosion, useSelectedLayer } from '@/store/useKeyboardStore';
interface LayerGroupProps {
  layer: LayerId;
  children: ReactNode;
}

/**
 * 每一层结构的容器：
 * - 按 explosion 值沿 Y 轴抬升（抬升量 = order * 间距 * explosion），
 *   X/Z 从不偏移，保证层与层始终中心对齐；
 * - 点击层本体可选中该层并高亮（键帽层的点击会在 KeyCap 内 stopPropagation，
 *   不会被这里吞掉按压交互）。
 */
export function LayerGroup({ layer, children }: LayerGroupProps) {
  const groupRef = useRef<THREE.Group>(null);
  const explosion = useExplosion();
  const selectedLayer = useSelectedLayer();
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);

  const config = LAYER_CONFIGS[layer];
  const selected = selectedLayer === layer;

  // 初始化即定位到目标高度，避免首帧从 0 飞入
  const targetY = useRef(config.baseY);
  targetY.current = config.baseY + config.order * EXPLODE_SPACING * explosion;

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetY.current, Math.min(1, delta * 10));
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // 键帽自身的按下/抬起已 stopPropagation，能到达这里的都是该层结构本体
    e.stopPropagation();
    setSelectedLayer(selected ? null : layer);
  };

  return (
    <group
      ref={groupRef}
      position={[0, targetY.current, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
      userData={{ layer, selected }}
    >
      {children}
    </group>
  );
}
