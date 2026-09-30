import { KeyConfig } from '@/types/keyboard';

/** 单个键位在 KeyGrid（键位空间，原点在左上角）内的中心坐标 */
export function keyCenter(k: Pick<KeyConfig, 'x' | 'y' | 'width' | 'height'>) {
  return [k.x + k.width / 2, 0, k.y + k.height / 2] as const;
}
