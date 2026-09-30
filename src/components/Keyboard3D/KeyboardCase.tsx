import { RoundedBox } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { useCaseMaterial, useLayout, useKeyboardStore } from '@/store/useKeyboardStore';
import { MATERIAL_CONFIGS } from '@/data/materials';
import { LAYOUT_CONFIGS } from '@/data/layouts';

interface KeyboardCaseProps {
  highlighted: boolean;
}

export function KeyboardCase({ highlighted }: KeyboardCaseProps) {
  const materialId = useCaseMaterial();
  const layout = useLayout();
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);
  const materialConfig = MATERIAL_CONFIGS[materialId];
  const layoutConfig = LAYOUT_CONFIGS[layout];

  const caseWidth = layoutConfig.width + 0.8;
  const caseDepth = layoutConfig.height + 0.8;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return; // 拖拽旋转视角时不触发选中
    e.stopPropagation();
    setSelectedLayer('case');
  };

  return (
    <group onClick={handleClick}>
      <RoundedBox
        args={[caseWidth, 0.6, caseDepth]}
        radius={0.15}
        smoothness={8}
        castShadow
        receiveShadow
        position={[0, -0.1, 0]}
      >
        <meshStandardMaterial
          color={materialConfig.color}
          roughness={materialConfig.roughness}
          metalness={materialConfig.metalness}
          emissive={highlighted ? '#6366f1' : '#000000'}
          emissiveIntensity={highlighted ? 0.35 : 0}
        />
      </RoundedBox>

      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[caseWidth - 0.5, caseDepth - 0.5]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.9}
          metalness={0.1}
          emissive={highlighted ? '#6366f1' : '#000000'}
          emissiveIntensity={highlighted ? 0.2 : 0}
        />
      </mesh>
    </group>
  );
}
