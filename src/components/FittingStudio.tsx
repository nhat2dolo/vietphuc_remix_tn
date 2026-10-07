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
  const [gender, setGender] = useState<GenderMode>('female');
  const [selectedColorId, setSelectedColorId] = useState<string>('vang-nghe');
  const [secondaryColorHex, setSecondaryColorHex] = useState<string>('#EDE7DC');
  const [pattern, setPattern] = useState<PatternId>('lotus');
  const [accessories, setAccessories] = useState<AccessoryId[]>(['man', 'chuoingoc']);
  const [isNightStudio, setIsNightStudio] = useState<boolean>(false);

  // Modals & Collapsible Sections
  const [showLookbookModal, setShowLookbookModal] = useState<boolean>(false);
  const [showGeminiModal, setShowGeminiModal] = useState<boolean>(false);
  const [showSavedLooksModal, setShowSavedLooksModal] = useState<boolean>(false);
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

  // Handlers
  const toggleAccessory = (accId: AccessoryId) => {
    setAccessories((prev) =>
      prev.includes(accId) ? prev.filter((id) => id !== accId) : [...prev, accId]
    );
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
          {/* Gemini AI Stylist Button with glowing accent */}
          <button
            onClick={() => setShowGeminiModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C82A27] via-[#D93835] to-[#E4A025] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bot className="w-4 h-4 text-amber-200" />
            <span>Cố Vấn AI Gemini (Google AI)</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">2.5 Flash</span>
          </button>

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
            {/* Top Toolbar above Mannequin */}
            <div className="flex items-center justify-between">
              {/* Gender Switch */}
              <div className="inline-flex p-1 bg-stone-100 rounded-xl">
                <button
                  onClick={() => setGender('female')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    gender === 'female' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Nữ Giới
                </button>
                <button
                  onClick={() => setGender('male')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    gender === 'male' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Nam Giới
                </button>
              </div>

              {/* Day/Night Lighting and Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNightStudio(!isNightStudio)}
                  className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors border border-stone-200/80 cursor-pointer"
                  title="Chuyển ánh sáng ngày / đêm"
                  aria-label="Chuyển ánh sáng ngày / đêm"
                >
                  {isNightStudio ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-stone-600" />}
                </button>
                <button
                  onClick={handleResetOutfit}
                  className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors border border-stone-200/80 cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C82A27] hover:bg-[#A8221F] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer shrink-0"
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
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] shadow-xs'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 text-stone-800'
                      }`}
                    >
                      <div className="font-semibold text-sm flex items-center justify-between">
                        <span>{item.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#C82A27]" />}
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
                      className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-stone-900 bg-stone-100 ring-2 ring-stone-900/10'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full shadow-inner border border-black/10 shrink-0"
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
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#1F4F89] bg-blue-50/50 text-[#12335A] font-semibold'
                          : 'border-stone-200 bg-stone-50/40 text-stone-700 hover:bg-stone-50'
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
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          active
                            ? 'border-[#3D7D73] bg-[#EBF4F2] text-[#25544D] font-semibold'
                            : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xl">{acc.emoji}</span>
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
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                          active
                            ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] font-semibold'
                            : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="text-xl">{acc.emoji}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium leading-tight">{acc.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Garment Knowledge Box */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-stone-200/90 space-y-3">
              <div className="flex items-center gap-2 text-[#8D1815] text-xs font-bold uppercase tracking-wider">
                <Info className="w-4 h-4" />
                <span>Tri thức phục trang: {activeOutfitData.name}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                {activeOutfitData.desc}
              </p>
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500 italic">
                <span>{activeOutfitData.referenceCitation}</span>
                <span className="font-sans font-medium text-stone-700">{activeOutfitData.era}</span>
              </div>
            </div>

            {/* Export Lookbook Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowLookbookModal(true)}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#C82A27] hover:bg-[#A8221F] text-white font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer hover:shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span>Xuất Thẻ Lookbook Của Bạn</span>
              </button>

              <button
                onClick={() => setShowGeminiModal(true)}
                className="py-4 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Bot className="w-5 h-5 text-amber-300" />
                <span>Cố Vấn AI Gemini</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
