import React from 'react';
import { PRESET_LOOKS, OUTFITS } from '../data/vietphucData';
import { PresetLook } from '../types/vietphuc';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PresetLookbookProps {
  onSelectPreset: (preset: PresetLook) => void;
  activePresetId?: string;
}

export const PresetLookbook: React.FC<PresetLookbookProps> = ({ onSelectPreset, activePresetId }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
            Cảm Hứng Phối Đồ Sẵn Có
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-serif italic mt-0.5">
            Các công thức phối tiêu biểu được giới trẻ chuộng nhất trong các mùa lễ hội & photowalk
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_LOOKS.map((preset) => {
          const outfit = OUTFITS[preset.outfit];
          const isCurrent = activePresetId === preset.id;

          return (
            <div
              key={preset.id}
              className={`group p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 bg-white hover:-translate-y-1.5 hover:shadow-lg ${
                isCurrent
                  ? 'border-[#C82A27] ring-2 ring-[#C82A27]/20 shadow-md'
                  : 'border-stone-200/80 hover:border-[#C82A27]/40'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sans font-semibold tracking-wider text-[#8D1815] uppercase">
                    {outfit.name}
                  </span>
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-inner transition-transform duration-200 group-hover:scale-125"
                    style={{ backgroundColor: preset.colorHex }}
                    title={`Màu chính: ${preset.colorHex}`}
                  />
                </div>

                <h4 className="text-lg font-display font-bold text-stone-900 group-hover:text-[#C82A27] transition-colors">
                  {preset.name}
                </h4>
                <p className="text-xs text-stone-600 font-serif italic leading-relaxed">
                  "{preset.tagline}"
                </p>

                <div className="text-[11px] text-stone-500 pt-1">
                  <span className="font-medium text-stone-700">Vibe:</span> {preset.vibe}
                </div>
              </div>

              <button
                onClick={() => onSelectPreset(preset)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${
                  isCurrent
                    ? 'bg-[#C82A27] text-white'
                    : 'bg-stone-100 hover:bg-[#C82A27] hover:text-white text-stone-800'
                }`}
              >
                <span>{isCurrent ? 'Đang kích hoạt' : 'Áp dụng phong cách này'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
