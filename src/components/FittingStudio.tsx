import React, { useState, useMemo } from 'react';
import { OutfitId, GenderMode, AccessoryId, PatternId, PresetLook } from '../types/vietphuc';
import { OUTFITS, TRADITIONAL_COLORS, ACCESSORIES, analyzeCulturalContext } from '../data/vietphucData';
import { MannequinViewer } from './MannequinViewer';
import { CulturalGuide } from './CulturalGuide';
import { LookbookCardModal } from './LookbookCardModal';
import { GeminiAiStylistModal } from './GeminiAiStylistModal';
import { WeatherEventRecommender } from './WeatherEventRecommender';
import { ColorHarmonyValidator } from './ColorHarmonyValidator';
import { OutfitComparator, SavedOutfitSlot } from './OutfitComparator';
import { SavedLookbooksModal, saveLookToStorage } from './SavedLookbooksModal';
import { GarmentKnowledgeModal } from './GarmentKnowledgeModal';
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
  ChevronDown,
  ChevronUp,
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

  // Modals & Collapsible Sections
  const [showLookbookModal, setShowLookbookModal] = useState<boolean>(false);
  const [showGeminiModal, setShowGeminiModal] = useState<boolean>(false);
  const [showSavedLooksModal, setShowSavedLooksModal] = useState<boolean>(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState<boolean>(false);
  const [showWeatherSection, setShowWeatherSection] = useState<boolean>(false);
  const [showComparatorSection, setShowComparatorSection] = useState<boolean>(false);
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
      // If selecting a headwear item, replace existing headwear to avoid overlapping hats
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
    setShowWeatherSection(false);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleApplyComparatorSlot = (slot: SavedOutfitSlot) => {
    setOutfit(slot.outfit);
    setGender(slot.gender);
    setSelectedColorId(slot.colorId);
    setSecondaryColorHex(slot.secondaryColorHex);
    setPattern(slot.pattern);
    setAccessories(slot.accessories);
    setShowComparatorSection(false);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleApplySavedLook = (look: any) => {
    setOutfit(look.outfit);
    setGender(look.gender);
    setSelectedColorId(look.colorId);
    setSecondaryColorHex(look.secondaryColorHex);
    setPattern(look.pattern);
    setAccessories(look.accessories);
    setCustomLookName(look.name);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Object representing current look for comparator
  const currentSlotForComparator: SavedOutfitSlot = useMemo(() => ({
    outfit,
    gender,
    colorId: selectedColorId,
    secondaryColorHex,
    pattern,
    accessories,
    label: customLookName || 'Phương án Hiện tại',
  }), [outfit, gender, selectedColorId, secondaryColorHex, pattern, accessories, customLookName]);

  return (
    <div className="space-y-8">
      {/* 1. TOP STUDIO ACTION TOOLBAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Weather & Event Toggle */}
          <button
            onClick={() => setShowWeatherSection(!showWeatherSection)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              showWeatherSection
                ? 'border-[#1F4F89] bg-blue-50 text-[#12335A]'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#1F4F89]" />
            <span>Gợi Ý Thời Tiết & Dịp Lễ</span>
            {showWeatherSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Comparator Toggle */}
          <button
            onClick={() => setShowComparatorSection(!showComparatorSection)}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              showComparatorSection
                ? 'border-[#3D7D73] bg-[#EBF4F2] text-[#25544D]'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-[#3D7D73]" />
            <span>So Sánh Phương Án</span>
            {showComparatorSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Action: Save to Lookbook & View Saved Collection */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveLook}
            className="px-3.5 py-2.5 rounded-2xl border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Lưu bản phối này vào danh sách cá nhân"
          >
            <Bookmark className="w-4 h-4 text-[#8D1815]" />
            <span>Lưu Lookbook</span>
          </button>

          <button
            onClick={() => setShowSavedLooksModal(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer"
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

      {/* 2. OPTIONAL COLLAPSIBLE: WEATHER & EVENT RECOMMENDER */}
      {showWeatherSection && (
        <div className="animate-in fade-in duration-300">
          <WeatherEventRecommender onApplyPreset={handleApplyWeatherPreset} />
        </div>
      )}

      {/* 3. OPTIONAL COLLAPSIBLE: OUTFIT COMPARATOR */}
      {showComparatorSection && (
        <div className="animate-in fade-in duration-300">
          <OutfitComparator
            currentOutfit={currentSlotForComparator}
            onApplyOutfit={handleApplyComparatorSlot}
          />
        </div>
      )}

      {/* 4. MAIN STUDIO WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Visual Mannequin Avatar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-sm space-y-4">
            {/* Top Toolbar above Mannequin: Day/Night Lighting and Reset */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-700 tracking-wider uppercase font-sans">
                  Góc Trưng Bày Phục Trang
                </span>
                <span className="text-[11px] text-stone-400 font-serif italic hidden sm:inline">
                  (Dáng đứng toàn thân 2D chuẩn mực)
                </span>
              </div>

              {/* Day/Night Lighting and Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNightStudio(!isNightStudio)}
                  className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:-translate-y-0.5 hover:shadow-xs active:scale-95 transition-all duration-200 border border-stone-200/80 cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                  title="Chuyển ánh sáng ngày / đêm"
                  aria-label="Chuyển ánh sáng ngày / đêm"
                >
                  {isNightStudio ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-stone-600" />}
                  <span className="hidden sm:inline">{isNightStudio ? 'Ban Ngày' : 'Ban Đêm'}</span>
                </button>
                <button
                  onClick={handleResetOutfit}
                  className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:-translate-y-0.5 hover:shadow-xs active:scale-95 transition-all duration-200 border border-stone-200/80 cursor-pointer"
                  title="Đặt lại nguyên bản"
                  aria-label="Đặt lại nguyên bản"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mannequin Viewer */}
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

            {/* Quick Summary Pill Bar under Mannequin */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C82A27] hover:bg-[#A8221F] hover:-translate-y-0.5 hover:shadow-md text-white text-xs font-semibold transition-all duration-200 shadow-sm cursor-pointer shrink-0 active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Xuất thẻ Lookbook</span>
              </button>
            </div>
          </div>

          {/* Color Harmony Validator Widget (Live Five Elements Evaluation) */}
          <ColorHarmonyValidator
            primaryColor={activeColorData}
            secondaryColorHex={secondaryColorHex}
            onSelectSecondaryColor={setSecondaryColorHex}
          />

          {/* Cultural Warnings & Real-time Insights */}
          <CulturalGuide warnings={culturalInsights} />
        </div>

        {/* Right Column: Customizer Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-8">
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
                      className={`group p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:scale-[0.98] ${
                        isSelected
                          ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] shadow-xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-[#C82A27]/40 text-stone-800'
                      }`}
                    >
                      <div className="font-semibold text-sm flex items-center justify-between">
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

              <div className="flex flex-wrap gap-3">
                {TRADITIONAL_COLORS.map((col) => {
                  const isSelected = col.id === selectedColorId;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColorId(col.id)}
                      className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-200 cursor-pointer hover:scale-105 hover:-translate-y-0.5 hover:shadow-xs active:scale-95 ${
                        isSelected
                          ? 'border-stone-900 bg-stone-100 ring-2 ring-stone-900/10'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shadow-inner border border-black/10 shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-xs font-medium text-stone-800">{col.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-stone-500 font-serif italic pt-1">
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
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.98] ${
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
                        className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-xs hover:scale-[1.02] active:scale-95 ${
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

                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider pt-2">
                  Gen Z Streetwear & Hiện Đại
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ACCESSORIES.filter((a) => a.category === 'streetwear').map((acc) => {
                    const active = accessories.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-xs hover:scale-[1.02] active:scale-95 ${
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

            {/* Nút Tri thức phục trang dạng viên thuốc kèm icon 'i' mở popup/modal (Tối giản chữ cho học sinh) */}
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
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-bold shadow-xs hover:border-[#C82A27]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
              >
                Tra cứu 📜
              </button>
            </div>

            {/* Export Lookbook Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLookbookModal(true)}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#C82A27] hover:bg-[#A8221F] hover:-translate-y-1 hover:shadow-xl text-white font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md cursor-pointer active:translate-y-0 active:scale-95"
              >
                <Sparkles className="w-5 h-5 transition-transform hover:rotate-12" />
                <span>Xuất Thẻ Lookbook Của Bạn</span>
              </button>

              <button
                onClick={() => setShowGeminiModal(true)}
                className="py-4 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 hover:-translate-y-1 hover:shadow-xl text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:translate-y-0 active:scale-95"
              >
                <Bot className="w-5 h-5 text-amber-300 transition-transform hover:scale-110" />
                <span>Cố Vấn AI Gemini</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Garment Knowledge Modal (Tri thức khảo cứu lịch sử) */}
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
