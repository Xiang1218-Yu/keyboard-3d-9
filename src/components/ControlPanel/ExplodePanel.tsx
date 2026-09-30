import { Layers, ChevronDown, RotateCcw, Box } from 'lucide-react';
import { useState } from 'react';
import { LayerId } from '@/types/keyboard';
import { LAYER_LIST, LAYER_CONFIGS } from '@/data/layers';
import { useKeyboardStore, useExplosion, useSelectedLayer } from '@/store/useKeyboardStore';

/**
 * 拆解控制面板（覆盖在 3D 视图上）：
 * - 爆炸程度滑块 0~100%
 * - 收起（整机装配）
 * - 五层选择，选中层在 3D 中高亮
 * - 选中层的说明面板
 */
export function ExplodePanel() {
  const explosion = useExplosion();
  const selectedLayer = useSelectedLayer();
  const setExplosion = useKeyboardStore((s) => s.setExplosion);
  const setSelectedLayer = useKeyboardStore((s) => s.setSelectedLayer);
  const [collapsed, setCollapsed] = useState(false);

  const isAssembled = explosion === 0;
  const activeLayer: LayerId | null = selectedLayer;

  const handleLayerClick = (id: LayerId) => {
    setSelectedLayer(activeLayer === id ? null : id);
  };

  return (
    <div className="absolute top-6 left-6 z-20 w-80 space-y-3">
      {/* 标题 / 折叠 */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-700/30">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">⌨</span>
        </div>
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">Keyboard Studio</div>
          <div className="text-gray-400 text-xs">五层结构拆解</div>
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          title={collapsed ? '展开面板' : '收起面板'}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
          {/* 爆炸控制 */}
          <div className="px-4 py-3 bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-gray-200">爆炸程度</span>
              </div>
              <span className="text-xs font-mono text-indigo-300">{Math.round(explosion * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(explosion * 100)}
              onChange={(e) => setExplosion(Number(e.target.value) / 100)}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-500">整机装配</span>
              <button
                onClick={() => setExplosion(0)}
                disabled={isAssembled}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all ${
                  isAssembled
                    ? 'text-gray-600 border-gray-800 cursor-default'
                    : 'text-indigo-300 border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                收起
              </button>
              <span className="text-[11px] text-gray-500">完全分层</span>
            </div>
          </div>

          {/* 层选择 */}
          <div className="px-4 py-3 bg-gray-900/70 backdrop-blur-md rounded-xl border border-gray-700/30">
            <div className="flex items-center gap-2 mb-2.5">
              <Box className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-200">结构层</span>
              <span className="text-[11px] text-gray-500 ml-auto">点击 3D 中任意层亦可选中</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {LAYER_LIST.map((layer) => {
                const active = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => handleLayerClick(layer.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all ${
                      active
                        ? 'border-indigo-500/60 bg-indigo-500/15'
                        : 'border-gray-700/40 bg-gray-800/40 hover:bg-gray-700/40'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0 border border-white/20"
                      style={{
                        backgroundColor: layer.color,
                        boxShadow: active ? `0 0 10px ${layer.color}aa` : 'none',
                      }}
                    />
                    <span className={`text-xs font-medium ${active ? 'text-indigo-200' : 'text-gray-300'}`}>
                      {layer.name}
                    </span>
                    <span className="ml-auto text-[10px] text-gray-500">L{layer.order + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 说明面板 */}
          {activeLayer && (
            <div className="px-4 py-3 bg-gray-900/70 backdrop-blur-md rounded-xl border border-indigo-500/30 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-white">
                  {LAYER_CONFIGS[activeLayer].name}
                </span>
                <button
                  onClick={() => setSelectedLayer(null)}
                  className="text-[11px] text-gray-500 hover:text-gray-300"
                >
                  取消高亮
                </button>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                {LAYER_CONFIGS[activeLayer].description}
              </p>
              <ul className="space-y-1">
                {LAYER_CONFIGS[activeLayer].details.map((d, i) => (
                  <li key={i} className="text-[11px] text-gray-500 flex gap-1.5 leading-relaxed">
                    <span className="text-indigo-400 mt-0.5">▸</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
