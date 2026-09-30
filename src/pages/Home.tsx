import { useState } from 'react';
import { KeyboardScene } from '@/components/Keyboard3D/KeyboardScene';
import { ControlPanel } from '@/components/ControlPanel/ControlPanel';
import { ExplodePanel } from '@/components/ControlPanel/ExplodePanel';
import { useKeyboardPress } from '@/hooks/useKeyboardPress';
import { KeyZone } from '@/types/keyboard';

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<KeyZone | null>(null);
  
  useKeyboardPress();

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#0a0a0f]">
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 pointer-events-none z-10" />
          <div className="absolute inset-0 opacity-30 pointer-events-none z-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
              }}
            />
          </div>
          <KeyboardScene selectedZone={selectedZone} />
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="px-6 py-3 bg-gray-900/60 backdrop-blur-xl rounded-full border border-gray-700/30">
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              拖动滑块拆解五层 · 点击层查看说明 · 点击键帽或按物理键试轴
            </p>
          </div>
        </div>

        <ExplodePanel />
      </div>
      
      <div className="w-96 flex-shrink-0">
        <ControlPanel
          selectedZone={selectedZone}
          onZoneChange={setSelectedZone}
        />
      </div>
    </div>
  );
}
