import React, { useState } from 'react';
import { EVENT_PRESETS, WEATHER_PRESETS, EventOption, WeatherOption } from '../data/weatherEventData';
import { OUTFITS, TRADITIONAL_COLORS } from '../data/vietphucData';
import { OutfitId, PatternId } from '../types/vietphuc';
import { Sparkles, Calendar, CloudSun, Check, ArrowRight, Shirt } from 'lucide-react';

interface WeatherEventRecommenderProps {
  onApplyPreset: (config: {
    outfit: OutfitId;
    colorId: string;
    accessories: string[];
    pattern: PatternId;
  }) => void;
}

export const WeatherEventRecommender: React.FC<WeatherEventRecommenderProps> = ({
  onApplyPreset,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventOption>(EVENT_PRESETS[0]);
  const [selectedWeather, setSelectedWeather] = useState<WeatherOption>(WEATHER_PRESETS[0]);

  const targetOutfit = OUTFITS[selectedEvent.recommendedOutfit];
  const targetColor =
    TRADITIONAL_COLORS.find((c) => c.id === selectedEvent.recommendedColorId) ||
    TRADITIONAL_COLORS[0];

  const handleApply = () => {
    onApplyPreset({
      outfit: selectedEvent.recommendedOutfit,
      colorId: selectedEvent.recommendedColorId,
      accessories: selectedEvent.recommendedAccessories,
      pattern: selectedWeather.recommendedPattern,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8D1815]">
            <Sparkles className="w-4 h-4 text-[#C82A27]" />
            <span>Gợi Ý Thông Minh Theo Hoàn Cảnh Thực Tế</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 mt-1">
            Phối Đồ Theo Thời Tiết & Sự Kiện
          </h3>
        </div>
        <span className="text-xs text-stone-500 font-serif italic">
          Khảo cứu phục trang chuẩn mực theo bối cảnh
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step 1 & 2 Selectors */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Chọn sự kiện */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
              <Calendar className="w-4 h-4 text-[#C82A27]" />
              <span>1. Chọn Dịp / Sự Kiện Tham Gia</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EVENT_PRESETS.map((evt) => {
                const isSelected = evt.id === selectedEvent.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`group p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                        : 'border-stone-200 hover:border-[#C82A27]/40 hover:bg-stone-50 bg-white text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl transition-transform duration-200 group-hover:scale-125">{evt.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold truncate group-hover:text-[#C82A27] transition-colors">{evt.name}</div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">{evt.desc}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#C82A27] shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chọn thời tiết */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
              <CloudSun className="w-4 h-4 text-[#1F4F89]" />
              <span>2. Chọn Thời Tiết & Nhiệt Độ</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WEATHER_PRESETS.map((w) => {
                const isSelected = w.id === selectedWeather.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeather(w)}
                    className={`group p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#1F4F89] bg-blue-50/60 text-[#12335A] font-semibold ring-1 ring-[#1F4F89]/20'
                        : 'border-stone-200 hover:border-[#1F4F89]/40 hover:bg-stone-50 bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-base">
                      <span className="transition-transform duration-200 group-hover:scale-125">{w.icon}</span>
                      <span className="text-[11px] font-mono text-stone-500 font-normal">{w.temp}</span>
                    </div>
                    <div className="text-xs font-semibold mt-1 group-hover:text-[#12335A] transition-colors">{w.name}</div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">{w.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Synthesis Card & Apply Button */}
        <div className="lg:col-span-5 bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-stone-200 space-y-4">
          <div className="text-xs uppercase tracking-wider text-[#8D1815] font-bold font-sans">
            Đề Xuất Phối Đồ Tối Ưu
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase">Trang phục khuyên mặc</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Khớp 100% bối cảnh
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                style={{ backgroundColor: targetColor.hex }}
              >
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="font-display font-bold text-base sm:text-lg text-stone-900 truncate">
                  {targetOutfit.name}
                </h4>
                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: targetColor.hex }}
                  />
                  <span>Sắc {targetColor.name}</span>
                  <span>· Hành {targetColor.element}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div>
                <span className="font-semibold text-stone-800">Chất liệu tối ưu: </span>
                <span>{selectedWeather.fabricRecommendation}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-800">Mẹo tạo phong cách: </span>
                <span className="font-serif italic">{selectedEvent.vibeTip}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-800">Gợi ý màu sắc: </span>
                <span>{selectedWeather.colorToneAdvice}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full py-3.5 px-4 rounded-xl bg-[#C82A27] hover:bg-[#A8221F] hover:-translate-y-1 hover:shadow-lg text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:translate-y-0 active:scale-95"
          >
            <span>Áp Dụng Bản Phối Này Vào Studio</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
