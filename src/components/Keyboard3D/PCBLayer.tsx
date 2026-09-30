import { Instances, Instance } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { KeyConfig } from '@/types/keyboard';
import { useKeyboardStore } from '@/store/useKeyboardStore';

interface PCBLayerProps {
  keys: KeyConfig[];
  width: number;
  height: number;
  highlighted: boolean;
}

/**
 * PCB 层：电路板本体 + 每个轴位对应的金色焊盘，
 * 焊盘坐标与轴体/键帽使用同一布局坐标系，保证层间中心对齐。
 */
export function PCBLayer({ keys, width, height, highlighted }: PCBLayerProps) {
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return; // 拖拽旋转视角时不触发选中
    e.stopPropagation();
    setSelectedLayer('pcb');
  };

  const boardW = width + 0.2;
  const boardH = height + 0.2;

  return (
    <group onClick={handleClick}>
      {/* 电路板本体 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[boardW, 0.08, boardH]} />
        <meshStandardMaterial
          color="#064e3b"
          roughness={0.55}
          metalness={0.25}
          emissive={highlighted ? '#6366f1' : '#000000'}
          emissiveIntensity={highlighted ? 0.35 : 0}
        />
      </mesh>

      {/* 每个轴位对应的焊盘（与轴体一一对齐） */}
      <Instances limit={keys.length}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.3}
          metalness={0.9}
          emissive={highlighted ? '#fbbf24' : '#000000'}
          emissiveIntensity={highlighted ? 0.4 : 0}
        />
        {keys.map((k) => (
          <Instance
            key={k.id}
            position={[
              k.x + k.width / 2 - width / 2,
              0.055,
              k.y + k.height / 2 - height / 2,
            ]}
          />
        ))}
      </Instances>

      {/* 主控芯片 */}
      <mesh position={[boardW / 2 - 1.2, 0.07, -boardH / 2 + 0.6]} castShadow>
        <boxGeometry args={[0.7, 0.06, 0.7]} />
        <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[boardW / 2 - 2.2, 0.06, -boardH / 2 + 0.55]} castShadow>
        <boxGeometry args={[0.45, 0.05, 0.3]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* USB-C 接口 */}
      <mesh position={[0, 0.05, -boardH / 2 + 0.15]} castShadow>
        <boxGeometry args={[0.9, 0.1, 0.3]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
