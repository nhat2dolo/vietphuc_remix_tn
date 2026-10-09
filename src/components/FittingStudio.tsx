import React, { useState, useMemo } from 'react';
import { OutfitId, GenderMode, AccessoryId, PatternId } from '../types/vietphuc';
import { OUTFITS, TRADITIONAL_COLORS, ACCESSORIES, analyzeCulturalContext } from '../data/vietphucData';
import { MannequinViewer } from './MannequinViewer';
import { CulturalGuide } from './CulturalGuide';
import { LookbookCardModal } from './LookbookCardModal';
import { GeminiAiStylistModal } from './GeminiAiStylistModal';
import { ColorHarmonyValidator } from './ColorHarmonyValidator';
import { SavedOutfitSlot } from './OutfitComparator';
import { SavedLookbooksModal, saveLookToStorage } from './SavedLookbooksModal';
import { GarmentKnowledgeModal } from './GarmentKnowledgeModal';
import { CompareModal } from './CompareModal';
import { WeatherEventDrawer } from './WeatherEventDrawer';
import {
  Sparkles,
  Moon,
  Sun,
  RotateCcw,
  Share2,
  Info,
  Check,
  Bot,
  Calendar,
  ArrowLeftRight,
  Bookmark,
} from 'lucide-react';

interface FittingStudioProps {
  initialOutfit?: OutfitId;
}

export const FittingStudio: React.FC<FittingStudioProps> = ({ initialOutfit = 'nguthan' }) => {
  const [outfit, setOutfit] = useState<OutfitId>(initialOutfit);
  const [gender, setGender] = useState<GenderMode>('male');
  const [selectedColorId, setSelectedColorId] = useState<string>('vang-nghe');
  const [secondaryColorHex, setSecondaryColorHex] = useState<string>('#EDE7DC');
  const [pattern, setPattern] = useState<PatternId>('lotus');
  const [accessories, setAccessories] = useState<AccessoryId[]>([]);
  const [isNightStudio, setIsNightStudio] = useState<boolean>(false);

  const handleSetGender = (newGender: GenderMode) => {
    setGender(newGender);
    if (newGender === 'male') {
      setAccessories((prev) => prev.filter((id) => id !== 'chuoingoc'));
    }
  };

  // Modals & Drawers state
  const [showLookbookModal, setShowLookbookModal] = useState<boolean>(false);
  const [showGeminiModal, setShowGeminiModal] = useState<boolean>(false);
  const [showSavedLooksModal, setShowSavedLooksModal] = useState<boolean>(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState<boolean>(false);
  const [showWeatherDrawer, setShowWeatherDrawer] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [customLookName, setCustomLookName] = useState<string>('');

  const activeOutfitData = OUTFITS[outfit];
  const activeColorData = useMemo(() => {
    return TRADITIONAL_COLORS.find((c) => c.id === selectedColorId) || TRADITIONAL_COLORS[0];
  }, [selectedColorId]);

  // Selected accessories data
  const selectedAccessoriesData = useMemo(() => {
    return ACCESSORIES.filter((a) => accessories.includes(a.id));
  }, [accessories]);

  // Cultural Warnings and Context
  const culturalInsights = useMemo(() => {
    return analyzeCulturalContext(outfit, accessories);
  }, [outfit, accessories]);

  // Headwear items are mutually exclusive to prevent multiple overlapping hats
  const HEADWEAR_IDS: AccessoryId[] = ['man', 'nonla'];

  // Handlers
  const toggleAccessory = (accId: AccessoryId) => {
    setAccessories((prev) => {
      if (prev.includes(accId)) {
        return prev.filter((id) => id !== accId);
      }
      if (HEADWEAR_IDS.includes(accId)) {
        const filtered = prev.filter((id) => !HEADWEAR_IDS.includes(id));
        return [...filtered, accId];
      }
      return [...prev, accId];
    });
  };

  const handleResetOutfit = () => {
    setAccessories([]);
    setPattern('plain');
    setSelectedColorId('do-son');
    setSecondaryColorHex('#FAF7F2');
  };

  const handleSaveLook = () => {
    const name = customLookName || `${activeOutfitData.name} ${activeColorData.name} Remix`;
    saveLookToStorage({
      name,
      outfit,
      gender,
      colorId: selectedColorId,
      secondaryColorHex,
      pattern,
      accessories,
    });
    setSaveSuccessNotice(`Đã lưu "${name}" vào Bộ sưu tập Lookbook!`);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  const handleApplyWeatherPreset = (config: {
    outfit: OutfitId;
    colorId: string;
    accessories: string[];
    pattern: PatternId;
  }) => {
    setOutfit(config.outfit);
    setSelectedColorId(config.colorId);
    setAccessories(config.accessories as AccessoryId[]);
    setPattern(config.pattern);
  };

  const handleApplyComparatorSlot = (slot: SavedOutfitSlot) => {
    setOutfit(slot.outfit);
    setGender(slot.gender);
    setSelectedColorId(slot.colorId);
    setSecondaryColorHex(slot.secondaryColorHex);
    setPattern(slot.pattern);
    setAccessories(slot.accessories);
  };

  const handleApplySavedLook = (look: any) => {
    setOutfit(look.outfit);
    setGender(look.gender);
    setSelectedColorId(look.colorId);
    setSecondaryColorHex(look.secondaryColorHex);
    setPattern(look.pattern);
    setAccessories(look.accessories);
    setCustomLookName(look.name);
  };

  // Object representing current look for comparator
  const currentSlotForComparator: SavedOutfitSlot = useMemo(() => ({
    outfit,
    gender,
    colorId: selectedColorId,
    secondaryColorHex,
    pattern,
    accessories,
    label: customLookName || `${activeOutfitData.name} (${activeColorData.name})`,
  }), [outfit, gender, selectedColorId, secondaryColorHex, pattern, accessories, customLookName, activeOutfitData, activeColorData]);

  return (
    <div className="space-y-6">
      {/* 1. TOP STUDIO ACTION TOOLBAR */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Weather & Event Slide Drawer Trigger */}
          <button
            onClick={() => setShowWeatherDrawer(true)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#1F4F89] hover:bg-blue-50/60 text-stone-700 hover:text-[#12335A] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            title="Mở thanh trượt gợi ý thời tiết và dịp lễ từ cạnh phải"
          >
            <Calendar className="w-4 h-4 text-[#1F4F89]" />
            <span>Gợi Ý Thời Tiết & Dịp Lễ</span>
          </button>

          {/* Comparator Modal Trigger */}
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#3D7D73] hover:bg-[#EBF4F2] text-stone-700 hover:text-[#25544D] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            title="Mở bảng so sánh 2 phương án phối đồ (Modal Popup)"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#3D7D73]" />
            <span>So Sánh Phương Án</span>
          </button>
        </div>

        {/* Right Action: Save to Lookbook & View Saved Collection */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveLook}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Lưu bản phối này vào danh sách cá nhân"
          >
            <Bookmark className="w-4 h-4 text-[#8D1815]" />
            <span>Lưu Lookbook</span>
          </button>

          <button
            onClick={() => setShowSavedLooksModal(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <span>Bộ Sưu Tập Của Tôi</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessNotice}</span>
          </div>
          <button
            onClick={() => setShowSavedLooksModal(true)}
            className="underline font-semibold hover:text-emerald-950 cursor-pointer"
          >
            Mở xem ngay →
          </button>
        </div>
      )}

      {/* 2. TWO-COLUMN LAYOUT: PREVIEW LEFT & CONTROLS RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT PREVIEW BÊN TRÁI: STICKY DESKTOP */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm space-y-3">
            {/* Top Toolbar above Mannequin: Day/Night Lighting and Reset */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800 tracking-wider uppercase font-sans">
                  Góc Trưng Bày Phục Trang
                </span>
                <span className="text-[11px] text-stone-400 font-serif italic hidden xl:inline">
                  (Dáng đứng toàn thân 2D)
                </span>
              </div>

              {/* Day/Night Lighting and Reset */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsNightStudio(!isNightStudio)}
                  className="p-1.5 px-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:shadow-xs active:scale-95 transition-all border border-stone-200/80 cursor-pointer flex items-center gap-1 text-xs font-medium"
                  title="Chuyển ánh sáng ngày / đêm"
                  aria-label="Chuyển ánh sáng ngày / đêm"
                >
                  {isNightStudio ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
                  <span className="text-[11px] hidden sm:inline">{isNightStudio ? 'Ngày' : 'Đêm'}</span>
                </button>
                <button
                  onClick={handleResetOutfit}
                  className="p-1.5 rounded-xl text-stone-600 hover:bg-stone-100 hover:shadow-xs active:scale-95 transition-all border border-stone-200/80 cursor-pointer"
                  title="Đặt lại nguyên bản"
                  aria-label="Đặt lại nguyên bản"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mannequin Viewer Canvas: Auto-scaled and centered head-to-toe */}
            <div className="relative overflow-hidden flex items-center justify-center">
              <MannequinViewer
                outfit={outfit}
                gender={gender}
                colorHex={activeColorData.hex}
                secondaryColorHex={secondaryColorHex}
                pattern={pattern}
                accessories={accessories}
                isNightStudio={isNightStudio}
                onSelectGender={handleSetGender}
              />
            </div>

            {/* Quick Summary Pill Bar under Mannequin */}
            <div className="pt-2.5 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-semibold text-stone-800">{activeOutfitData.name}</span>
                <span aria-hidden="true">·</span>
                <span style={{ color: activeColorData.hex }} className="font-medium">
                  {activeColorData.name}
                </span>
                <span aria-hidden="true">·</span>
                <span>{accessories.length} phụ kiện</span>
              </div>

              <button
                onClick={() => setShowLookbookModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C82A27] hover:bg-[#A8221F] active:scale-95 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Xuất thẻ Lookbook</span>
              </button>
            </div>
          </div>
        </div>

        {/* CỘT ĐIỀU KHIỂN BÊN PHẢI */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm space-y-6">
            {/* Step 1: Chọn Trang Phục (Outfits) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C82A27] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Chọn Dáng Cổ Phục</span>
                </label>
                <span className="text-xs text-stone-500 font-serif italic">6 kiểu dáng di sản</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.values(OUTFITS).map((item) => {
                  const isSelected = item.id === outfit;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setOutfit(item.id)}
                      className={`group p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] shadow-xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-[#C82A27]/40 text-stone-800'
                      }`}
                    >
                      <div className="font-semibold text-xs sm:text-sm flex items-center justify-between">
                        <span className="group-hover:text-[#C82A27] transition-colors">{item.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#C82A27] transition-transform group-hover:scale-110" />}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{item.era}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Chọn Màu Chủ Đạo (Traditional Colors) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E4A025] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Chọn Sắc Màu Cổ Truyền</span>
                </label>
                <span className="text-xs text-stone-600 font-medium">
                  {activeColorData.name} · Hành {activeColorData.element}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {TRADITIONAL_COLORS.map((col) => {
                  const isSelected = col.id === selectedColorId;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColorId(col.id)}
                      className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                        isSelected
                          ? 'border-stone-900 bg-stone-100 ring-2 ring-stone-900/10'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full shadow-inner border border-black/10 shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-xs font-medium text-stone-800">{col.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-stone-500 font-serif italic pt-0.5">
                "{activeColorData.meaning}"
              </p>
            </div>

            {/* Step 3: Chọn Hoa Văn Vải (Fabric Texture / Brocade) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F4F89] text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Chất Liệu & Hoa Văn Gấm</span>
                </label>
                <span className="text-xs text-stone-500 font-serif italic">Họa tiết dệt truyền thống</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'plain', label: 'Lụa Tơ Trơn', desc: 'Thanh lịch, tối giản' },
                  { id: 'lotus', label: 'Gấm Hoa Sen', desc: 'Thanh cao, thoát tục' },
                  { id: 'clouds', label: 'Vân Mây Cung Đình', desc: 'Bay bổng, trường cửu' },
                  { id: 'tho', label: 'Chữ Thọ Cách Điệu', desc: 'Trường thọ, an khang' },
                  { id: 'waves', label: 'Thủy Ba Sóng Nước', desc: 'Uyển chuyển, linh hoạt' },
                ].map((pat) => {
                  const isSelected = pattern === pat.id;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => setPattern(pat.id as PatternId)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:shadow-xs active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#1F4F89] bg-blue-50/50 text-[#12335A] font-semibold'
                          : 'border-stone-200 bg-stone-50/40 text-stone-700 hover:bg-stone-50 hover:border-[#1F4F89]/40'
                      }`}
                    >
                      <div className="text-xs font-semibold">{pat.label}</div>
                      <div className="text-[10px] text-stone-500 font-normal">{pat.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Thêm Phụ Kiện (Remix Elements) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#3D7D73] text-white text-xs flex items-center justify-center font-bold">4</span>
                  <span>Phụ Kiện Remix (Mix & Match)</span>
                </label>
                <span className="text-xs text-stone-500">Bấm để thêm hoặc gỡ bỏ</span>
              </div>

              {/* Categorized Accessories */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Cổ Phong Truyền Thống
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ACCESSORIES.filter((a) => a.category === 'traditional').map((acc) => {
                    const active = accessories.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-2 cursor-pointer hover:shadow-xs active:scale-95 ${
                          active
                            ? 'border-[#3D7D73] bg-[#EBF4F2] text-[#25544D] font-semibold'
                            : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-[#3D7D73]/40 text-stone-700'
                        }`}
                      >
                        <span className="text-xl transition-transform hover:scale-110">{acc.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium leading-tight">{acc.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider pt-1">
                  Gen Z Streetwear & Hiện Đại
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ACCESSORIES.filter((a) => a.category === 'streetwear').map((acc) => {
                    const active = accessories.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-2 cursor-pointer hover:shadow-xs active:scale-95 ${
                          active
                            ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] font-semibold'
                            : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-[#C82A27]/40 text-stone-700'
                        }`}
                      >
                        <span className="text-xl transition-transform hover:scale-110">{acc.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium leading-tight">{acc.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Harmony Validator & Cultural Guide */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <ColorHarmonyValidator
                primaryColor={activeColorData}
                secondaryColorHex={secondaryColorHex}
                onSelectSecondaryColor={setSecondaryColorHex}
              />
              <CulturalGuide warnings={culturalInsights} />
            </div>

            {/* Tra cứu tri thức phục trang */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-stone-200/90 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#C82A27]/10 text-[#C82A27] flex items-center justify-center shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    Tri thức: {activeOutfitData.name} ({activeOutfitData.era.split('(')[0].trim()})
                  </div>
                  <div className="text-[11px] text-stone-500 font-serif italic truncate">
                    "{activeOutfitData.tagline}"
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowKnowledgeModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold shadow-xs hover:border-[#C82A27]/40 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                Tra cứu 📜
              </button>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLookbookModal(true)}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-[#C82A27] hover:bg-[#A8221F] text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Xuất Thẻ Lookbook Của Bạn</span>
              </button>

              <button
                onClick={() => setShowGeminiModal(true)}
                className="py-3.5 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <Bot className="w-4 h-4 text-amber-300" />
                <span>Cố Vấn AI Gemini</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL POPUP: SO SÁNH PHƯƠNG ÁN PHỐI (OVERLAY BACKDROP-FILTER BLUR 4PX) */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        currentOutfit={currentSlotForComparator}
        onApplyOutfit={handleApplyComparatorSlot}
      />

      {/* 4. SLIDE-OVER DRAWER: GỢI Ý THỜI TIẾT & SỰ KIỆN TỪ CẠNH PHẢI */}
      <WeatherEventDrawer
        isOpen={showWeatherDrawer}
        onClose={() => setShowWeatherDrawer(false)}
        onApplyPreset={handleApplyWeatherPreset}
      />

      {/* Garment Knowledge Modal */}
      <GarmentKnowledgeModal
        isOpen={showKnowledgeModal}
        onClose={() => setShowKnowledgeModal(false)}
        outfit={activeOutfitData}
      />

      {/* Export Lookbook Card Modal */}
      <LookbookCardModal
        isOpen={showLookbookModal}
        onClose={() => setShowLookbookModal(false)}
        outfitData={activeOutfitData}
        colorData={activeColorData}
        secondaryColorHex={secondaryColorHex}
        pattern={pattern}
        gender={gender}
        selectedAccessories={selectedAccessoriesData}
        lookName={customLookName || activeOutfitData.name}
      />

      {/* Google Gemini AI Stylist Modal */}
      <GeminiAiStylistModal
        isOpen={showGeminiModal}
        onClose={() => setShowGeminiModal(false)}
        outfitData={activeOutfitData}
        colorData={activeColorData}
        secondaryColorHex={secondaryColorHex}
        accessories={selectedAccessoriesData}
        gender={gender}
      />

      {/* Saved Lookbooks Modal */}
      <SavedLookbooksModal
        isOpen={showSavedLooksModal}
        onClose={() => setShowSavedLooksModal(false)}
        onApplyLook={handleApplySavedLook}
      />
    </div>
  );
};
