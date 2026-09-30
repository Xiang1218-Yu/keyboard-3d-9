import { useRef, useState, useMemo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { KeyConfig } from '@/types/keyboard';
import {
  useKeyboardStore,
  useIsKeyPressed,
  useZoneColors,
  useSelectedLayer,
} from '@/store/useKeyboardStore';

interface KeyCapProps {
  keyConfig: KeyConfig;
  selectedZone?: string | null;
}

export function KeyCap({ keyConfig, selectedZone }: KeyCapProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isPressed = useIsKeyPressed(keyConfig.id);
  const zoneColors = useZoneColors();
  const selectedLayer = useSelectedLayer();
  const pressKey = useKeyboardStore((state) => state.pressKey);
  const releaseKey = useKeyboardStore((state) => state.releaseKey);

  const color = zoneColors[keyConfig.zone];
  const isSelected = selectedZone === keyConfig.zone;
  const layerHighlighted = selectedLayer === 'keycap';

  // 键帽相对本层原点的基准高度（十字轴心顶端插入键帽底部）
  const REST_Y = 0.42;
  const pressDepth = useMemo(() => (isPressed ? -0.15 : 0), [isPressed]);
  const targetScale = useMemo(() => (isPressed ? 0.98 : 1), [isPressed]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        REST_Y + pressDepth,
        delta * 15
      );
      const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 12);
      meshRef.current.scale.set(s, s, s);
    }
  });

  // 关键：键帽自身的事件全部 stopPropagation ——
  // 按下/抬起永远作用在键帽上，不会冒泡触发层选择；
  // 而普通点击（click）仍会冒泡到 LayerGroup，用于选中键帽层。
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    pressKey(keyConfig.id);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    releaseKey(keyConfig.id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    if (isPressed) {
      releaseKey(keyConfig.id);
    }
    document.body.style.cursor = 'auto';
  };

  const emissiveIntensity = hovered || isSelected ? 0.3 : isPressed ? 0.5 : layerHighlighted ? 0.22 : 0.1;
  const emissiveColor = isPressed
    ? '#ffffff'
    : hovered
      ? '#6366f1'
      : isSelected
        ? '#8b5cf6'
        : layerHighlighted
          ? '#818cf8'
          : '#000000';

  const fontSize = keyConfig.width > 1.5 ? 0.28 : keyConfig.width > 1 ? 0.32 : 0.38;

  return (
    <group position={[keyConfig.x + keyConfig.width / 2, 0, keyConfig.y + keyConfig.height / 2]}>
      <RoundedBox
        ref={meshRef}
        args={[keyConfig.width * 0.92, 0.4, keyConfig.height * 0.92]}
        radius={0.08}
        smoothness={4}
        position={[0, REST_Y, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </RoundedBox>

      <Text
        position={[0, REST_Y + 0.21, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={fontSize}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
        fontWeight={600}
        // 字符只负责显示，不参与射线拾取，避免吞掉键帽交互
        raycast={() => null}
      >
        {keyConfig.label}
      </Text>
    </group>
  );
}
