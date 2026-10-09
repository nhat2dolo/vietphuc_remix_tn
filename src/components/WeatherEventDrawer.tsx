import React, { useState } from 'react';
import { EVENT_PRESETS, WEATHER_PRESETS, EventOption, WeatherOption } from '../data/weatherEventData';
import { OUTFITS, TRADITIONAL_COLORS } from '../data/vietphucData';
import { OutfitId, PatternId } from '../types/vietphuc';
import { X, Calendar, CloudSun, Check, ArrowRight, Shirt, Sparkles, Filter } from 'lucide-react';

interface WeatherEventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (config: {
    outfit: OutfitId;
    colorId: string;
    accessories: string[];
    pattern: PatternId;
  }) => void;
}

type QuickFilterCategory = 'all' | 'summer' | 'autumn' | 'rain' | 'grad' | 'cafe' | 'tet';

export const WeatherEventDrawer: React.FC<WeatherEventDrawerProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  const [activeFilter, setActiveFilter] = useState<QuickFilterCategory>('all');
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
    onClose();
  };

  // Quick Pills configuration as requested:
  // "Mùa hè / Mát mẻ", "Mùa thu - se lạnh", "Trời mưa", "Sự kiện: Kỷ yếu", "Dạo phố", "Lễ hội truyền thống"
  const QUICK_PILLS: Array<{
    id: QuickFilterCategory;
    label: string;
    onSelect: () => void;
  }> = [
    {
      id: 'all',
      label: 'Tất cả gợi ý',
      onSelect: () => {},
    },
    {
      id: 'summer',
      label: '☀️ Mùa hè / Mát mẻ',
      onSelect: () => {
        const w = WEATHER_PRESETS.find((item) => item.id === 'summer') || WEATHER_PRESETS[1];
        setSelectedWeather(w);
      },
    },
    {
      id: 'autumn',
      label: '🍂 Mùa thu - Se lạnh',
      onSelect: () => {
        const w = WEATHER_PRESETS.find((item) => item.id === 'autumn') || WEATHER_PRESETS[2];
        setSelectedWeather(w);
      },
    },
    {
      id: 'rain',
      label: '🌧️ Trời mưa xứ Huế',
      onSelect: () => {
        const w = WEATHER_PRESETS.find((item) => item.id === 'rain') || WEATHER_PRESETS[4];
        setSelectedWeather(w);
      },
    },
    {
      id: 'grad',
      label: '🎓 Sự kiện: Kỷ yếu',
      onSelect: () => {
        const e = EVENT_PRESETS.find((item) => item.id === 'grad') || EVENT_PRESETS[1];
        setSelectedEvent(e);
      },
    },
    {
      id: 'cafe',
      label: '☕ Dạo phố cà phê',
      onSelect: () => {
        const e = EVENT_PRESETS.find((item) => item.id === 'cafe') || EVENT_PRESETS[4];
        setSelectedEvent(e);
      },
    },
    {
      id: 'tet',
      label: '🌸 Lễ hội truyền thống / Tết',
      onSelect: () => {
        const e = EVENT_PRESETS.find((item) => item.id === 'tet') || EVENT_PRESETS[0];
        setSelectedEvent(e);
      },
    },
  ];

  return (
    <>
      {/* Backdrop: click outside to close */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer from Right edge */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[460px] sm:max-w-[500px] z-50 bg-[#FAF7F2] border-l border-stone-200/90 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-weather-title"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-white border-b border-stone-200/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1F4F89] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#1F4F89]" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#1F4F89]">
                Gợi Ý Bối Cảnh Thực Tế
              </div>
              <h2 id="drawer-weather-title" className="text-base sm:text-lg font-display font-bold text-stone-900 leading-tight">
                Thời Tiết & Dịp Lễ
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng (×)"
            aria-label="Đóng thanh trượt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Pills Bar */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-200/80 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-2">
            <Filter className="w-3.5 h-3.5 text-[#8D1815]" />
            <span>Thẻ Lọc Nhanh (Quick Pills):</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {QUICK_PILLS.map((pill) => {
              const active = activeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => {
                    setActiveFilter(pill.id);
                    pill.onSelect();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'bg-[#8D1815] text-white shadow-xs font-semibold'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Body - Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Section 1: Chọn Sự Kiện */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C82A27]" />
                1. Dịp / Hoàn Cảnh
              </span>
              <span className="text-[11px] text-stone-500 lowercase font-normal">{EVENT_PRESETS.length} gợi ý</span>
            </div>

            <div className="space-y-2">
              {EVENT_PRESETS.map((evt) => {
                const isSelected = evt.id === selectedEvent.id;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl pt-0.5">{evt.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-bold flex items-center justify-between">
                          <span className={isSelected ? 'text-[#8D1815]' : 'text-stone-900'}>{evt.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#C82A27] shrink-0 ml-1" />}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">{evt.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Chọn Thời Tiết */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-800">
              <span className="flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-[#1F4F89]" />
                2. Thời Tiết & Khí Hậu
              </span>
              <span className="text-[11px] text-stone-500 lowercase font-normal">{WEATHER_PRESETS.length} thời tiết</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {WEATHER_PRESETS.map((w) => {
                const isSelected = w.id === selectedWeather.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeather(w)}
                    className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1F4F89] bg-blue-50/70 text-[#12335A] font-semibold ring-1 ring-[#1F4F89]/20'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-base">
                      <span>{w.icon}</span>
                      <span className="text-[10px] font-mono text-stone-500">{w.temp}</span>
                    </div>
                    <div className="text-xs font-bold mt-1 truncate">{w.name}</div>
                    <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{w.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Synthesis Card */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 border-b border-stone-100 pb-2">
              <span className="flex items-center gap-1 text-[#8D1815]">
                <Sparkles className="w-3.5 h-3.5 text-[#C82A27]" />
                Đề Xuất Phối Đồ Tối Ưu
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Khớp 100%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                style={{ backgroundColor: targetColor.hex }}
              >
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-base text-stone-900 truncate">
                  {targetOutfit.name}
                </div>
                <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: targetColor.hex }}
                  />
                  <span>Sắc {targetColor.name}</span>
                  <span>· Hành {targetColor.element}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
              <div>
                <span className="font-semibold text-stone-800">Chất liệu: </span>
                <span>{selectedWeather.fabricRecommendation}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-800">Gợi ý phong cách: </span>
                <span className="font-serif italic">{selectedEvent.vibeTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Action */}
        <div className="p-4 bg-white border-t border-stone-200/90 shrink-0">
          <button
            onClick={handleApply}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#C82A27] hover:bg-[#A8221F] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Áp Dụng Bản Phối Này Vào Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
