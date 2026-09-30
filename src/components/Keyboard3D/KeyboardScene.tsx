import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Lights } from './Lights';
import { CaseLayer } from './layers/CaseLayer';
import { PcbLayer } from './layers/PcbLayer';
import { PlateLayer } from './layers/PlateLayer';
import { SwitchLayer } from './layers/SwitchLayer';
import { KeycapLayer } from './layers/KeycapLayer';
import { useLayout, useCaseMaterial, useExplosion, useKeyboardStore } from '@/store/useKeyboardStore';
import { KeyZone } from '@/types/keyboard';

interface KeyboardContentProps {
  selectedZone: KeyZone | null;
}

/**
 * 整机装配。
 * key 绑定 layout：切换布局时整棵子树卸载重建，旧布局的所有几何体 /
 * 材质随之释放，绝不会遗留上一套对象（材质变化由各层响应式更新材质参数）。
 */
function KeyboardAssembly({ selectedZone }: KeyboardContentProps) {
  const layout = useLayout();
  const caseMaterial = useCaseMaterial();

  return (
    <group key={`${layout}-${caseMaterial}`}>
      <CaseLayer />
      <PcbLayer />
      <PlateLayer />
      <SwitchLayer />
      <KeycapLayer selectedZone={selectedZone} />
    </group>
  );
}

/** 爆炸程度越高，观察目标越向上移动，保证分层后整机仍居中可见 */
function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const explosion = useExplosion();
  const targetY = useRef(0);
  targetY.current = explosion * 5.2;

  useFrame((_, delta) => {
    const c = controlsRef.current;
    if (!c) return;
    c.target.y = THREE.MathUtils.lerp(c.target.y, targetY.current, Math.min(1, delta * 6));
    c.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={12}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={Math.PI / 10}
      enablePan
      target={[0, 0, 0]}
    />
  );
}

function Ground() {
  return (
    <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#0a0a0f" roughness={1} metalness={0} />
    </mesh>
  );
}

interface KeyboardSceneProps {
  selectedZone: KeyZone | null;
}

export function KeyboardScene({ selectedZone }: KeyboardSceneProps) {
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 19, 25], fov: 42 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      // 点击未命中任何层（空白处）时取消层选中
      onPointerMissed={() => setSelectedLayer(null)}
    >
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 30, 62]} />

      <Lights />
      <KeyboardAssembly selectedZone={selectedZone} />
      <Ground />
      <CameraRig />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.35}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.45}
        />
      </EffectComposer>
    </Canvas>
  );
}
