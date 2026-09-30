import { ReactNode, useMemo } from 'react';
import { LayoutConfig } from '@/types/keyboard';

interface KeyGridProps {
  layoutConfig: LayoutConfig;
  children: ReactNode;
}

/**
 * 键位空间 -> 居中世界坐标的统一换算。
 * 所有内部层（PCB / 定位板 / 轴体 / 键帽）都用同一个偏移组，
 * 因此无论爆炸程度如何，各层的 X/Z 投影完全重合，只沿 Y 轴分离。
 */
export function KeyGrid({ layoutConfig, children }: KeyGridProps) {
  const offset = useMemo(
    () => [-layoutConfig.width / 2, -layoutConfig.height / 2] as const,
    [layoutConfig.width, layoutConfig.height],
  );
  return <group position={[offset[0], 0, offset[1]]}>{children}</group>;
}
