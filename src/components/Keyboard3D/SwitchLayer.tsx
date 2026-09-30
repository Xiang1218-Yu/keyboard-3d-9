import { Instances, Instance } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { KeyConfig } from '@/types/keyboard';
import { useKeyboardStore } from '@/store/useKeyboardStore';

interface SwitchLayerProps {
  keys: KeyConfig[];
  highlighted: boolean;
}

/**
 * 轴体层：每颗键帽正下方一颗轴体（下壳 + 上壳 + 十字轴心），
 * 用实例化网格表达每个轴位，与键帽、定位板孔位、PCB 焊盘一一对齐。
 */
export function SwitchLayer({ keys, highlighted }: SwitchLayerProps) {
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return; // 拖拽旋转视角时不触发选中
    e.stopPropagation();
    setSelectedLayer('switches');
  };

  const housingEmissive = highlighted ? '#6366f1' : '#000000';
  const housingEmissiveIntensity = highlighted ? 0.4 : 0;

  return (
    <group onClick={handleClick}>
      {/* 轴体下壳（较宽，位于定位板下方） */}
      <Instances limit={keys.length} castShadow receiveShadow>
        <boxGeometry args={[0.86, 0.22, 0.86]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.5}
          metalness={0.05}
          emissive={housingEmissive}
          emissiveIntensity={housingEmissiveIntensity}
        />
        {keys.map((k) => (
          <Instance
            key={k.id}
            position={[k.x + k.width / 2, -0.11, k.y + k.height / 2]}
          />
        ))}
      </Instances>

      {/* 轴体上壳（较窄，穿过定位板轴孔） */}
      <Instances limit={keys.length} castShadow>
        <boxGeometry args={[0.62, 0.26, 0.62]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.45}
          metalness={0.05}
          emissive={housingEmissive}
          emissiveIntensity={housingEmissiveIntensity}
        />
        {keys.map((k) => (
          <Instance
            key={k.id}
            position={[k.x + k.width / 2, 0.1, k.y + k.height / 2]}
          />
        ))}
      </Instances>

      {/* 十字轴心（横向） */}
      <Instances limit={keys.length} castShadow>
        <boxGeometry args={[0.42, 0.14, 0.13]} />
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.35}
          metalness={0.1}
          emissive={highlighted ? '#f87171' : '#000000'}
          emissiveIntensity={highlighted ? 0.5 : 0}
        />
        {keys.map((k) => (
          <Instance
            key={k.id}
            position={[k.x + k.width / 2, 0.3, k.y + k.height / 2]}
          />
        ))}
      </Instances>

      {/* 十字轴心（纵向） */}
      <Instances limit={keys.length} castShadow>
        <boxGeometry args={[0.13, 0.14, 0.42]} />
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.35}
          metalness={0.1}
          emissive={highlighted ? '#f87171' : '#000000'}
          emissiveIntensity={highlighted ? 0.5 : 0}
        />
        {keys.map((k) => (
          <Instance
            key={k.id}
            position={[k.x + k.width / 2, 0.3, k.y + k.height / 2]}
          />
        ))}
      </Instances>
    </group>
  );
}
