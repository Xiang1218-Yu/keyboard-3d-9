import { useRef, useMemo, useLayoutEffect, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Lights } from './Lights';
import { KeyboardCase } from './KeyboardCase';
import { KeyCap } from './KeyCap';
import { SwitchLayer } from './SwitchLayer';
import { PlateLayer } from './PlateLayer';
import { PCBLayer } from './PCBLayer';
import { useKeyboardStore, useLayout, useExplodeAmount, useSelectedLayer } from '@/store/useKeyboardStore';
import { LAYOUT_CONFIGS } from '@/data/layouts';
import { LAYER_CONFIGS } from '@/data/layers';
import { KeyZone } from '@/types/keyboard';
import * as THREE from 'three';

interface ExplodeLayerProps {
  baseY: number;
  offset: number;
  explode: number;
  children: ReactNode;
}

/**
 * 单层容器：装配位置 baseY + 爆炸位移 offset * explode。
 * 位移仅沿 Y 轴，各层共享同一 XZ 中心，保证爆炸时层间中心对齐。
 */
function ExplodeLayer({ baseY, offset, explode, children }: ExplodeLayerProps) {
  const ref = useRef<THREE.Group>(null);

  // 挂载（含布局切换重建）时直接落到当前目标位置，避免从旧位置补间
  useLayoutEffect(() => {
    ref.current?.position.set(0, baseY + offset * explode, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseY, offset]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.y = THREE.MathUtils.damp(
        ref.current.position.y,
        baseY + offset * explode,
        6,
        delta
      );
    }
  });

  return <group ref={ref}>{children}</group>;
}

/** 爆炸时缓慢抬升观察目标点，让五层结构始终处于画面中心附近 */
function CameraRig({ explode }: { explode: number }) {
  const controls = useThree((state) => state.controls) as unknown as {
    target: THREE.Vector3;
    update: () => void;
  } | null;

  useFrame((_, delta) => {
    if (controls) {
      controls.target.y = THREE.MathUtils.damp(controls.target.y, 0.4 + explode * 1.1, 4, delta);
      controls.update();
    }
  });

  return null;
}

interface KeyboardContentProps {
  selectedZone: KeyZone | null;
}

function KeyboardContent({ selectedZone }: KeyboardContentProps) {
  const layout = useLayout();
  const layoutConfig = LAYOUT_CONFIGS[layout];
  const explode = useExplodeAmount();
  const selectedLayer = useSelectedLayer();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const keys = useMemo(() => {
    return layoutConfig.keys.map((keyConfig) => (
      <KeyCap
        key={keyConfig.id}
        keyConfig={keyConfig}
        selectedZone={selectedZone}
        layerSelected={selectedLayer === 'keycaps'}
      />
    ));
  }, [layoutConfig.keys, selectedZone, selectedLayer]);

  // 键位网格的居中偏移：与 PCB 焊盘共用同一坐标系，各层中心对齐
  const gridOffset: [number, number, number] = [
    -layoutConfig.width / 2,
    0,
    -layoutConfig.height / 2,
  ];

  return (
    <group ref={groupRef}>
      {/* key={layout}：布局切换时整棵子树卸载重建，杜绝上一套布局的对象残留 */}
      <group key={layout}>
        <ExplodeLayer baseY={0} offset={LAYER_CONFIGS.case.explodeOffset} explode={explode}>
          <KeyboardCase highlighted={selectedLayer === 'case'} />
        </ExplodeLayer>

        <ExplodeLayer baseY={0.3} offset={LAYER_CONFIGS.pcb.explodeOffset} explode={explode}>
          <PCBLayer
            keys={layoutConfig.keys}
            width={layoutConfig.width}
            height={layoutConfig.height}
            highlighted={selectedLayer === 'pcb'}
          />
        </ExplodeLayer>

        <ExplodeLayer baseY={0.42} offset={LAYER_CONFIGS.plate.explodeOffset} explode={explode}>
          <PlateLayer
            keys={layoutConfig.keys}
            width={layoutConfig.width}
            height={layoutConfig.height}
            highlighted={selectedLayer === 'plate'}
          />
        </ExplodeLayer>

        <ExplodeLayer baseY={0.5} offset={LAYER_CONFIGS.switches.explodeOffset} explode={explode}>
          <group position={gridOffset}>
            <SwitchLayer keys={layoutConfig.keys} highlighted={selectedLayer === 'switches'} />
          </group>
        </ExplodeLayer>

        <ExplodeLayer baseY={0.85} offset={LAYER_CONFIGS.keycaps.explodeOffset} explode={explode}>
          <group position={gridOffset}>{keys}</group>
        </ExplodeLayer>
      </group>
    </group>
  );
}

interface KeyboardSceneProps {
  selectedZone: KeyZone | null;
}

export function KeyboardScene({ selectedZone }: KeyboardSceneProps) {
  const explode = useExplodeAmount();
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);
  const pointerDownPos = useRef<[number, number]>([0, 0]);

  return (
    <div
      className="absolute inset-0"
      onPointerDown={(e) => {
        pointerDownPos.current = [e.clientX, e.clientY];
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 18, 22], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onPointerMissed={(e) => {
          // 仅当点击空白处（非拖拽旋转）时取消层选中
          const dx = e.clientX - pointerDownPos.current[0];
          const dy = e.clientY - pointerDownPos.current[1];
          if (dx * dx + dy * dy < 25) {
            setSelectedLayer(null);
          }
        }}
      >
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 15, 35]} />

        <Lights />
        <KeyboardContent selectedZone={selectedZone} />

        {/* 地面固定在场景根部，不随爆炸位移 */}
        <mesh position={[0, -2.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#0a0a0f" roughness={1} metalness={0} />
        </mesh>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={12}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 8}
          enablePan={true}
          target={[0, 0.4, 0]}
        />
        <CameraRig explode={explode} />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            height={300}
            intensity={0.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
