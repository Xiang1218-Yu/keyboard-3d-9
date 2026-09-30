import { Layers, Maximize2, Minimize2 } from 'lucide-react';
import { useKeyboardStore, useExplodeAmount, useSelectedLayer } from '@/store/useKeyboardStore';
import { LAYER_CONFIGS, LAYER_LIST } from '@/data/layers';

export function LayerExplorer() {
  const explodeAmount = useExplodeAmount();
  const selectedLayer = useSelectedLayer();
  const setExplodeAmount = useKeyboardStore((state) => state.setExplodeAmount);
  const setSelectedLayer = useKeyboardStore((state) => state.setSelectedLayer);
  const collapseLayers = useKeyboardStore((state) => state.collapseLayers);

  const percent = Math.round(explodeAmount * 100);
  const selectedConfig = selectedLayer ? LAYER_CONFIGS[selectedLayer] : null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-medium text-gray-200">结构拆解</h3>
      </div>

      {/* 爆炸程度滑块 */}
      <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">爆炸程度</span>
          <span className="text-xs font-mono text-indigo-300">{percent}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={percent}
          onChange={(e) => setExplodeAmount(Number(e.target.value) / 100)}
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-700 accent-indigo-500"
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setExplodeAmount(1)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            全部展开
          </button>
          <button
            onClick={collapseLayers}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs rounded-lg bg-gray-700/40 text-gray-300 border border-gray-600/40 hover:bg-gray-700/60 transition-all"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            收起
          </button>
        </div>
      </div>

      {/* 层选择（自上而下：键帽 → 轴体 → 定位板 → PCB → 外壳） */}
      <div className="space-y-1.5 mb-3">
        {LAYER_LIST.map((layerId, index) => {
          const config = LAYER_CONFIGS[layerId];
          const isSelected = selectedLayer === layerId;
          return (
            <button
              key={layerId}
              onClick={() => setSelectedLayer(isSelected ? null : layerId)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500/50'
                  : 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-700/60 hover:border-gray-600/50'
              }`}
            >
              <span className="text-[10px] font-mono text-gray-500 w-4">{index + 1}</span>
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: config.accent,
                  boxShadow: isSelected ? `0 0 8px ${config.accent}` : 'none',
                }}
              />
              <span className={`text-sm ${isSelected ? 'text-indigo-200' : 'text-gray-200'}`}>
                {config.name}
              </span>
              <span className="text-[10px] text-gray-500 ml-auto">{config.enName}</span>
            </button>
          );
        })}
      </div>

      {/* 说明面板 */}
      {selectedConfig ? (
        <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedConfig.accent }}
            />
            <span className="text-sm font-medium text-white">{selectedConfig.name}</span>
            <span className="text-[10px] text-gray-500">{selectedConfig.enName}</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            {selectedConfig.description}
          </p>
          <ul className="space-y-1">
            {selectedConfig.details.map((detail) => (
              <li key={detail} className="flex items-start gap-1.5 text-xs text-gray-500">
                <span className="text-indigo-400 mt-0.5">•</span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 text-center">
          <div className="text-gray-500 text-xs">
            点击场景中的结构层或上方列表，查看每层的组成说明
          </div>
        </div>
      )}
    </div>
  );
}
