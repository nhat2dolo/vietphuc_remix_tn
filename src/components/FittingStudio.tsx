import React, { useState, useMemo, useRef, useEffect } from 'react';
import { OutfitId, GenderMode, AccessoryId, PatternId } from '../types/vietphuc';
import {
  OUTFITS,
  TRADITIONAL_COLORS,
  ACCESSORIES,
  PRESET_LOOKS,
  analyzeCulturalContext,
} from '../data/vietphucData';
import { PresetLook, TraditionalColor } from '../types/vietphuc';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  X,
  Palette,
  Scissors,
  Copy,
  Trash2,
} from 'lucide-react';

/* =========================================================================
   1. TYPES & CONSTANTS
   ========================================================================= */

export type CustomizerSection = 'outfit' | 'color' | 'material' | 'accessories' | 'score';

export interface MaterialOption {
  id: string;
  name: string;
  origin: string;
  desc: string;
  sheen: string;
  suitableFor: string;
}

export const MATERIAL_OPTIONS: MaterialOption[] = [
  {
    id: 'lua-ha-dong',
    name: 'Lụa Tơ Tằm Vạn Phúc',
    origin: 'Làng dệt Vạn Phúc, Hà Đông',
    desc: 'Sợi tơ tự nhiên mềm rủ, thoáng mát mùa hè, ấm áp mùa se lạnh.',
    sheen: 'Óng ả mềm rủ',
    suitableFor: 'Áo Dài, Áo Bà Ba, Áo Ngũ Thân',
  },
  {
    id: 'gam-cung-dinh',
    name: 'Gấm Hoa Cung Đình',
    origin: 'Cung xưởng dệt Triều Nguyễn',
    desc: 'Chất vải gấm dày dặn, dệt sợi kim tuyến tinh xảo tạo hoa văn nổi khối vương giả.',
    sheen: 'Vương giả lộng lẫy',
    suitableFor: 'Áo Nhật Bình, Áo Ngũ Thân đại lễ',
  },
  {
    id: 'dui-to-sen',
    name: 'Đũi Tự Nhiên & Tơ Sen',
    origin: 'Đồng bằng Bắc Bộ',
    desc: 'Chất liệu sợi tự nhiên thô mộc, thấm hút mồ hôi tốt, phong trần tao nhã.',
    sheen: 'Mộc mạc thoáng mát',
    suitableFor: 'Áo Tứ Thân, Áo Giao Lĩnh, Áo Bà Ba',
  },
  {
    id: 'nhung-to',
    name: 'Nhung Tơ Đại Việt',
    origin: 'Thăng Long xưa',
    desc: 'Lớp tuyết nhung mượt mà, giữ nhiệt tốt, tạo chiều sâu thị giác quý phái.',
    sheen: 'Trầm ấm sang trọng',
    suitableFor: 'Áo Ngũ Thân mùa đông, Áo Nhật Bình',
  },
  {
    id: 'da-gam',
    name: 'Dạ Gấm Dệt Tay Cổ Phong',
    origin: 'Làng nghề truyền thống',
    desc: 'Đứng phom dáng áo chuẩn mực xưa, không nhăn, bề mặt đanh chắc.',
    sheen: 'Đứng phom chuẩn mực',
    suitableFor: 'Áo Ngũ Thân Lập Lĩnh, Áo Giao Lĩnh',
  },
];

export const PATTERN_OPTIONS: { id: PatternId; label: string; desc: string; meaning: string }[] = [
  {
    id: 'plain',
    label: 'Lụa Tơ Trơn (Tối Giản)',
    desc: 'Thanh lịch & tinh khôi',
    meaning: 'Tôn vinh trọn vẹn đường cắt may và chất liệu vải, thuần khiết.',
  },
  {
    id: 'lotus',
    label: 'Gấm Hoa Sen (Liên Hoa)',
    desc: 'Thanh cao & thoát tục',
    meaning: 'Biểu tượng quốc hoa, "gần bùn mà chẳng hôi tanh mùi bùn".',
  },
  {
    id: 'clouds',
    label: 'Vân Mây Cung Đình (Tam Sơn)',
    desc: 'Bay bổng & vương giả',
    meaning: 'Họa tiết mây cuộn và ba ngọn núi thiêng, thái bình thịnh trị.',
  },
  {
    id: 'tho',
    label: 'Chữ Thọ Cách Điệu',
    desc: 'Trường thọ & cát tường',
    meaning: 'Họa tiết cát tường mang lời chúc sức khỏe, an khang trường thọ.',
  },
  {
    id: 'waves',
    label: 'Thủy Ba Sóng Nước',
    desc: 'Uyển chuyển & trường tồn',
    meaning: 'Sóng cuộn đại dương biểu trưng cho sinh khí cuồn cuộn.',
  },
];

/* Helper color conversions */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c
      .split('')
      .map((x) => x + x)
      .join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return { h: 10, s: 75, l: 45 };
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

interface FittingStudioProps {
  initialOutfit?: OutfitId;
  initialOpenWeatherDrawer?: boolean;
}

export const FittingStudio: React.FC<FittingStudioProps> = ({
  initialOutfit = 'nguthan',
  initialOpenWeatherDrawer = false,
}) => {
  // 1. Outfit State
  const [outfit, setOutfit] = useState<OutfitId>(initialOutfit);
  const [gender, setGender] = useState<GenderMode>('female');
  const [selectedColorId, setSelectedColorId] = useState<string>('do-son');
  const [currentColorHex, setCurrentColorHex] = useState<string>('#C82A27');
  const [secondaryColorHex, setSecondaryColorHex] = useState<string>('#FAF7F2');
  const [pattern, setPattern] = useState<PatternId>('lotus');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('lua-ha-dong');
  const [accessories, setAccessories] = useState<AccessoryId[]>([]);
  const [isNightStudio, setIsNightStudio] = useState<boolean>(false);
  const [customLookName, setCustomLookName] = useState<string>('');

  // 2. Custom Color Sliders State (Hue & Lightness)
  const initialHsl = useMemo(() => hexToHsl('#C82A27'), []);
  const [hueValue, setHueValue] = useState<number>(initialHsl.h);
  const [lightnessValue, setLightnessValue] = useState<number>(initialHsl.l);

  // 3. Exclusive Accordion Single State ('outfit' | 'color' | 'material' | 'accessories' | null)
  // Default to 'outfit'
  const [activeSection, setActiveSection] = useState<CustomizerSection | null>('outfit');

  // 4. Modals & Drawers State
  const [showLookbookModal, setShowLookbookModal] = useState<boolean>(false);
  const [showGeminiModal, setShowGeminiModal] = useState<boolean>(false);
  const [showSavedLooksModal, setShowSavedLooksModal] = useState<boolean>(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState<boolean>(false);
  const [showWeatherDrawer, setShowWeatherDrawer] = useState<boolean>(initialOpenWeatherDrawer);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [inspectingPreset, setInspectingPreset] = useState<PresetLook | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [copyHexNotice, setCopyHexNotice] = useState<boolean>(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Active outfit info
  const activeOutfitData = OUTFITS[outfit];

  // Active Color computation: either matching a preset or custom user choice
  const activeColorData: TraditionalColor = useMemo(() => {
    const matched = TRADITIONAL_COLORS.find(
      (c) =>
        c.hex.toLowerCase() === currentColorHex.toLowerCase() ||
        c.id === selectedColorId
    );
    if (matched && matched.hex.toLowerCase() === currentColorHex.toLowerCase()) {
      return matched;
    }
    return {
      id: 'custom',
      name: 'Sắc Màu Tự Phối',
      hex: currentColorHex,
      accentHex: currentColorHex,
      element: 'Ngũ Hành Remix',
      meaning:
        'Sắc thái độc bản sáng tạo trực tiếp từ dải màu Studio Việt phục Remix.',
    };
  }, [currentColorHex, selectedColorId]);

  // Active material info
  const activeMaterialData = useMemo(() => {
    return (
      MATERIAL_OPTIONS.find((m) => m.id === selectedMaterialId) ||
      MATERIAL_OPTIONS[0]
    );
  }, [selectedMaterialId]);

  // Active pattern info
  const activePatternData = useMemo(() => {
    return PATTERN_OPTIONS.find((p) => p.id === pattern) || PATTERN_OPTIONS[0];
  }, [pattern]);

  // Selected accessories data
  const selectedAccessoriesData = useMemo(() => {
    return ACCESSORIES.filter((a) => accessories.includes(a.id));
  }, [accessories]);

  // Cultural Warnings and Context
  const culturalInsights = useMemo(() => {
    return analyzeCulturalContext(outfit, accessories);
  }, [outfit, accessories]);

  // Headwear items are mutually exclusive to prevent clipping
  const HEADWEAR_IDS: AccessoryId[] = ['man', 'nonla'];

  // Toggle Single Exclusive Accordion Section
  const handleToggleSection = (section: CustomizerSection) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  // AI Score & Evaluation Calculation (Item 5)
  const aiScoreEvaluation = useMemo(() => {
    // 1. Color Harmony Score (0 - 100)
    // Contrast check between main color and secondary / garment style
    const mainHsl = hexToHsl(currentColorHex);
    const secHsl = hexToHsl(secondaryColorHex);
    const hueDiff = Math.abs(mainHsl.h - secHsl.h);
    const lightnessDiff = Math.abs(mainHsl.l - secHsl.l);

    let colorScore = 80;
    let colorAnalysis = 'Sắc màu chủ đạo tươi sáng, phối hợp ăn ý.';
    if (lightnessDiff >= 30) {
      colorScore += 12;
      colorAnalysis = 'Độ tương phản sáng tối xuất sắc giữa thân áo và nền lót!';
    } else if (hueDiff >= 60 && hueDiff <= 180) {
      colorScore += 10;
      colorAnalysis = 'Sắc thái tương sinh/tương phản cân bằng ngũ hành tốt.';
    } else if (lightnessDiff < 15 && (hueDiff < 25 || hueDiff > 335)) {
      colorScore -= 10;
      colorAnalysis = 'Tông tiệp tông đồng nhất, có thể nhấn thêm phụ kiện tương phản.';
    }
    colorScore = Math.min(98, Math.max(70, colorScore));

    // 2. Cultural Integrity Score (0 - 100)
    let culturalScore = 95;
    let culturalNotes = 'Trang phục chuẩn mực, hài hòa với quy thức truyền thống.';
    if (culturalInsights.length > 0) {
      culturalScore = Math.max(70, 95 - culturalInsights.length * 10);
      culturalNotes = culturalInsights[0].message;
    } else if (accessories.includes('man') || accessories.includes('nonla') || accessories.includes('khanran')) {
      culturalScore = 98;
      culturalNotes = 'Đi kèm nón mũ/khăn cổ phong tôn nghiêm, rất đúng tinh thần di sản.';
    }

    // 3. Gen Z Trendiness & Practicality Score (0 - 100)
    let trendScore = 78;
    const streetwearCount = accessories.filter((id) =>
      ['sneaker', 'kinhram', 'tainghe', 'tuicoi', 'quat', 'chuoingoc'].includes(id)
    ).length;

    if (streetwearCount >= 2) {
      trendScore = 94;
    } else if (streetwearCount === 1) {
      trendScore = 88;
    } else {
      trendScore = 80;
    }

    // Overall Score
    const overallScore = Math.round(
      colorScore * 0.35 + culturalScore * 0.35 + trendScore * 0.30
    );

    // Title / Rank Badge
    let title = 'Bậc Thầy Phối Cổ Phục';
    let badgeColor = 'text-amber-800 bg-amber-100 border-amber-300';
    if (overallScore >= 92) {
      title = 'Bậc Thầy Cổ Phục Remix';
      badgeColor = 'text-emerald-800 bg-emerald-100 border-emerald-300';
    } else if (overallScore >= 85) {
      title = 'Gen Z Tân Thời Hài Hòa';
      badgeColor = 'text-blue-800 bg-blue-100 border-blue-300';
    } else {
      title = 'Phối Đồ Tự Do Phá Cách';
      badgeColor = 'text-stone-800 bg-stone-100 border-stone-300';
    }

    // AI Strengths and Advice Suggestions
    const pros = [
      `Dáng ${activeOutfitData.name} kết hợp sắc ${activeColorData.name} tạo cảm giác sang trọng.`,
      streetwearCount > 0
        ? `Remix phá cách thành công với ${streetwearCount} món phụ kiện hiện đại.`
        : 'Giữ được phong vị cổ điển thanh thoát, nền nã.',
    ];

    const suggestion =
      culturalInsights.length > 0
        ? 'Lưu ý điều chỉnh phụ kiện cho đúng bối cảnh như lưu ý văn hóa bên dưới.'
        : streetwearCount === 0
        ? 'Bạn có thể thử thêm Sneaker Retro hoặc Kính Râm Y2K để tăng điểm Thời Thượng Gen Z!'
        : 'Thử nghiệm đổi góc ánh sáng Ngày/Đêm hoặc ướm thử nón lá/quạt xếp để hoàn thiện phong thái!';

    return {
      overallScore,
      title,
      badgeColor,
      colorScore,
      colorAnalysis,
      culturalScore,
      culturalNotes,
      trendScore,
      pros,
      suggestion,
    };
  }, [currentColorHex, secondaryColorHex, culturalInsights, accessories, activeOutfitData, activeColorData]);

  // Gender Switch
  const handleSetGender = (newGender: GenderMode) => {
    setGender(newGender);
    if (newGender === 'male') {
      setAccessories((prev) => prev.filter((id) => id !== 'chuoingoc'));
    }
  };

  // Preset Color Selector
  const handleSelectPresetColor = (color: TraditionalColor) => {
    setSelectedColorId(color.id);
    setCurrentColorHex(color.hex);
    const hsl = hexToHsl(color.hex);
    setHueValue(hsl.h);
    setLightnessValue(hsl.l);
  };

  // Custom Hue Slider Change
  const handleHueChange = (newHue: number) => {
    setHueValue(newHue);
    const newHex = hslToHex(newHue, 75, lightnessValue);
    setCurrentColorHex(newHex);
    setSelectedColorId('custom');
  };

  // Custom Lightness Slider Change
  const handleLightnessChange = (newLightness: number) => {
    setLightnessValue(newLightness);
    const newHex = hslToHex(hueValue, 75, newLightness);
    setCurrentColorHex(newHex);
    setSelectedColorId('custom');
  };

  // Direct Hex Color Input
  const handleDirectHexChange = (hexVal: string) => {
    let cleanHex = hexVal.trim();
    if (!cleanHex.startsWith('#')) cleanHex = `#${cleanHex}`;
    setCurrentColorHex(cleanHex);
    if (/^#[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      const hsl = hexToHsl(cleanHex);
      setHueValue(hsl.h);
      setLightnessValue(hsl.l);
    }
  };

  // Accessory Toggle
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

  // Reset to original default
  const handleResetOutfit = () => {
    setAccessories([]);
    setPattern('lotus');
    setSelectedMaterialId('lua-ha-dong');
    setSelectedColorId('do-son');
    setCurrentColorHex('#C82A27');
    setSecondaryColorHex('#FAF7F2');
    const hsl = hexToHsl('#C82A27');
    setHueValue(hsl.h);
    setLightnessValue(hsl.l);
    setCustomLookName('');
  };

  // Save current look to localStorage
  const handleSaveLook = () => {
    const name =
      customLookName ||
      `${activeOutfitData.name} ${activeColorData.name} Remix`;
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

  // Apply Weather/Event preset
  const handleApplyWeatherPreset = (config: {
    outfit: OutfitId;
    colorId: string;
    accessories: string[];
    pattern: PatternId;
  }) => {
    setOutfit(config.outfit);
    setSelectedColorId(config.colorId);
    const matchedCol = TRADITIONAL_COLORS.find((c) => c.id === config.colorId);
    if (matchedCol) {
      setCurrentColorHex(matchedCol.hex);
      const hsl = hexToHsl(matchedCol.hex);
      setHueValue(hsl.h);
      setLightnessValue(hsl.l);
    }
    setAccessories(config.accessories as AccessoryId[]);
    setPattern(config.pattern);
  };

  // Apply Comparator Slot
  const handleApplyComparatorSlot = (slot: SavedOutfitSlot) => {
    setOutfit(slot.outfit);
    setGender(slot.gender);
    setSelectedColorId(slot.colorId);
    const matchedCol = TRADITIONAL_COLORS.find((c) => c.id === slot.colorId);
    if (matchedCol) {
      setCurrentColorHex(matchedCol.hex);
      const hsl = hexToHsl(matchedCol.hex);
      setHueValue(hsl.h);
      setLightnessValue(hsl.l);
    }
    setSecondaryColorHex(slot.secondaryColorHex);
    setPattern(slot.pattern);
    setAccessories(slot.accessories);
  };

  // Apply saved look
  const handleApplySavedLook = (look: any) => {
    setOutfit(look.outfit);
    setGender(look.gender);
    setSelectedColorId(look.colorId);
    const matchedCol = TRADITIONAL_COLORS.find((c) => c.id === look.colorId);
    if (matchedCol) {
      setCurrentColorHex(matchedCol.hex);
      const hsl = hexToHsl(matchedCol.hex);
      setHueValue(hsl.h);
      setLightnessValue(hsl.l);
    }
    setSecondaryColorHex(look.secondaryColorHex);
    setPattern(look.pattern);
    setAccessories(look.accessories);
    setCustomLookName(look.name);
  };

  // Apply lookbook preset
  const handleApplyPresetLook = (preset: PresetLook) => {
    setOutfit(preset.outfit);
    setGender(preset.gender);
    setCurrentColorHex(preset.colorHex);
    const matchedCol = TRADITIONAL_COLORS.find(
      (c) => c.hex.toLowerCase() === preset.colorHex.toLowerCase()
    );
    if (matchedCol) {
      setSelectedColorId(matchedCol.id);
    } else {
      setSelectedColorId('custom');
    }
    const hsl = hexToHsl(preset.colorHex);
    setHueValue(hsl.h);
    setLightnessValue(hsl.l);
    setSecondaryColorHex(preset.secondaryColorHex);
    setPattern(preset.pattern);
    setAccessories(preset.accessories);
    setCustomLookName(preset.name);
    setSaveSuccessNotice(`Đã áp dụng bản phối "${preset.name}"!`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Copy HEX code
  const handleCopyHex = () => {
    navigator.clipboard?.writeText(currentColorHex);
    setCopyHexNotice(true);
    setTimeout(() => setCopyHexNotice(false), 2000);
  };

  // Slot object for comparison
  const currentSlotForComparator: SavedOutfitSlot = useMemo(
    () => ({
      outfit,
      gender,
      colorId: selectedColorId,
      secondaryColorHex,
      pattern,
      accessories,
      label:
        customLookName || `${activeOutfitData.name} (${activeColorData.name})`,
    }),
    [
      outfit,
      gender,
      selectedColorId,
      secondaryColorHex,
      pattern,
      accessories,
      customLookName,
      activeOutfitData,
      activeColorData,
    ]
  );

  return (
    <div className="space-y-6">
      {/* ===================================================================
          1. TOP STUDIO ACTION TOOLBAR (GỌN GÀNG, ĐẦY ĐỦ TIỆN ÍCH)
          =================================================================== */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Weather & Event Slide Drawer Trigger */}
          <button
            type="button"
            onClick={() => setShowWeatherDrawer(true)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#1F4F89] hover:bg-blue-50/70 text-stone-700 hover:text-[#12335A] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            title="Mở thanh trượt gợi ý thời tiết và dịp lễ từ cạnh phải"
          >
            <Calendar className="w-4 h-4 text-[#1F4F89]" />
            <span>Gợi Ý Thời Tiết & Dịp Lễ</span>
          </button>

          {/* Comparator Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:border-[#3D7D73] hover:bg-[#EBF4F2] text-stone-700 hover:text-[#25544D] text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            title="Mở bảng so sánh 2 phương án phối đồ"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#3D7D73]" />
            <span>So Sánh Phương Án</span>
          </button>
        </div>

        {/* Right Actions: Save Look & Saved Looks Collection */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveLook}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:border-[#b84a14] hover:bg-[#FFF8F5] text-stone-700 hover:text-[#b84a14] text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
            title="Lưu bản phối vào danh sách cá nhân"
          >
            <Bookmark className="w-4 h-4 text-[#b84a14]" />
            <span>Lưu Lookbook</span>
          </button>

          <button
            type="button"
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
            type="button"
            onClick={() => setShowSavedLooksModal(true)}
            className="underline font-semibold hover:text-emerald-950 cursor-pointer"
          >
            Mở xem ngay →
          </button>
        </div>
      )}

      {/* ===================================================================
          2. KIẾN TRÚC GIAO DIỆN CHÍNH (DESKTOP 2-COLUMN VIEWPORT)
          - Cột Trái (col-span-12 lg:col-span-6 xl:col-span-7): Focus Canvas
          - Cột Phải (col-span-12 lg:col-span-6 xl:col-span-5): Accordion Hub
          =================================================================== */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start w-full">
        {/* =================================================================
            CỘT TRÁI (COL-SPAN-12 LG:COL-SPAN-6 XL:COL-SPAN-7)
            Khung Canvas cố định, hiển thị trọn vẹn toàn thân từ đầu đến chân
            Cụm 2 nút hành động chính ngay dưới ma-nơ-canh
            ================================================================= */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 flex flex-col space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3.5">
            {/* Top Toolbar above Mannequin: Studio title, Lighting mode, Reset */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800 tracking-wider uppercase font-sans">
                  Góc Trưng Bày Phục Trang
                </span>
                <span className="text-[11px] text-stone-400 font-serif italic hidden sm:inline">
                  (Dáng đứng toàn thân 2D)
                </span>
              </div>

              {/* Day/Night Lighting and Reset */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsNightStudio(!isNightStudio)}
                  className={`p-1.5 px-3 rounded-xl transition-all border cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs active:scale-95 ${
                    isNightStudio
                      ? 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] hover:bg-amber-900'
                      : 'bg-white border-stone-200/90 text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                  title="Chuyển chế độ ánh sáng studio Ngày / Đêm"
                  aria-label="Chuyển chế độ ánh sáng studio Ngày / Đêm"
                >
                  {isNightStudio ? (
                    <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                  ) : (
                    <Moon className="w-4 h-4 text-stone-600" />
                  )}
                  <span className="text-[11px]">
                    {isNightStudio ? 'Ánh Sáng Đêm' : 'Ánh Sáng Ngày'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleResetOutfit}
                  className="p-1.5 rounded-xl text-stone-600 hover:bg-stone-100 hover:shadow-xs active:scale-95 transition-all border border-stone-200/80 cursor-pointer"
                  title="Đặt lại nguyên bản phục trang"
                  aria-label="Đặt lại nguyên bản"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mannequin Viewer Canvas: Hiển thị đầy đủ tỷ lệ toàn thân từ đầu đến chân */}
            <div className="relative overflow-hidden flex items-center justify-center rounded-2xl bg-stone-50/50">
              <MannequinViewer
                outfit={outfit}
                gender={gender}
                colorHex={currentColorHex}
                secondaryColorHex={secondaryColorHex}
                pattern={pattern}
                accessories={accessories}
                isNightStudio={isNightStudio}
                onSelectGender={handleSetGender}
                className="w-full h-[470px] sm:h-[520px] lg:h-[540px] xl:h-[560px]"
              />
            </div>

            {/* Quick Summary Pill Bar under Mannequin */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="font-semibold text-stone-900">
                  {activeOutfitData.name}
                </span>
                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                    style={{ backgroundColor: currentColorHex }}
                  />
                  <span>{activeColorData.name}</span>
                </span>
                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>
                <span className="text-stone-600">
                  {activeMaterialData.name.split(' ')[0]}
                </span>
                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>
                <span className="text-stone-600">
                  {accessories.length} phụ kiện
                </span>
              </div>

              {/* Tooltip (i) icon for Heritage Knowledge */}
              <button
                type="button"
                onClick={() => setShowKnowledgeModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#FFF8F5] text-stone-700 hover:text-[#b84a14] text-xs font-medium transition-colors cursor-pointer border border-stone-200/80 shadow-2xs shrink-0"
                title={`Khảo cứu tri thức di sản: ${activeOutfitData.name}`}
              >
                <Info className="w-3.5 h-3.5 text-[#b84a14]" />
                <span className="text-[11px] font-sans font-semibold">
                  Tri thức
                </span>
              </button>
            </div>

            {/* 2 NÚT HÀNH ĐỘNG CHÍNH ĐẶT NGAY DƯỚI MA-NƠ-CANH */}
            <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowLookbookModal(true)}
                className="py-3 px-4 rounded-2xl bg-[#C82A27] hover:bg-[#A8221F] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4 shrink-0" />
                <span>Xuất Thẻ Lookbook</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGeminiModal(true)}
                className="py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Bot className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Cố Vấn AI Gemini</span>
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================
            CỘT PHẢI (COL-SPAN-12 LG:COL-SPAN-6 XL:COL-SPAN-5)
            Khung điều khiển chứa Exclusive Accordion 5 mục
            Cuộn êm bên trong, tự động đóng các mục còn lại
            ================================================================= */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5 flex flex-col space-y-4 min-w-0">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-sm space-y-3.5">
            {/* Header of Configuration Hub */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider font-sans">
                  Tùy Biến Cổ Phục Remix
                </h3>
                <p className="text-[11px] text-stone-400 font-serif italic">
                  Chọn 1 trong 5 mục để tùy biến & đánh giá · Tự động cuộn mở mượt mà
                </p>
              </div>

              {/* Quick section indicators */}
              <div className="flex items-center gap-1.5">
                {(['outfit', 'color', 'material', 'accessories', 'score'] as CustomizerSection[]).map(
                  (sec, idx) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleToggleSection(sec)}
                      className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                        activeSection === sec
                          ? 'bg-[#b84a14] text-white shadow-xs'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                      title={`Chuyển nhanh đến mục ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* ===============================================================
                PANEL 1: TRANG PHỤC (OUTFIT)
                =============================================================== */}
            <div
              className={`rounded-2xl border transition-colors ${
                activeSection === 'outfit'
                  ? 'border-[#b84a14]/60 bg-[#FFF8F5]/30'
                  : 'border-stone-200/80 bg-stone-50/20 hover:border-stone-300'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleSection('outfit')}
                className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer select-none group focus:outline-hidden"
                aria-expanded={activeSection === 'outfit'}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#b84a14] text-white text-[11px] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    1
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 truncate">
                    Trang Phục (Outfit)
                  </span>

                  {/* Collapsed summary pill */}
                  <span className="text-[11px] font-semibold text-[#8D1815] bg-[#FFF5F4] px-2 py-0.5 rounded-full border border-[#C82A27]/20 truncate">
                    {activeOutfitData.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-400 font-serif italic hidden sm:inline">
                    6 dáng di sản
                  </span>
                  <div
                    className={`p-1 text-stone-400 group-hover:text-stone-700 transition-transform duration-300 ${
                      activeSection === 'outfit' ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Panel 1 Body */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-3 sm:px-3.5 ${
                  activeSection === 'outfit'
                    ? 'max-h-[850px] opacity-100 pb-3.5'
                    : 'max-h-0 opacity-0 pb-0 pointer-events-none'
                }`}
              >
                <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
                  {Object.values(OUTFITS).map((item) => {
                    const isSelected = item.id === outfit;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setOutfit(item.id)}
                        className={`group p-2.5 sm:p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer hover:shadow-xs active:scale-[0.98] relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-2 border-[#b84a14] bg-[#FFF8F5] text-[#8D1815] shadow-xs'
                            : 'border border-stone-200/90 bg-white hover:border-[#b84a14]/40 hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <div>
                          {/* Mini visual icon & Checkmark */}
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-base sm:text-lg">
                              {item.id === 'aodai'
                                ? '👘'
                                : item.id === 'nguthan'
                                ? '🥻'
                                : item.id === 'nhatbinh'
                                ? '👑'
                                : item.id === 'tuthan'
                                ? '🌾'
                                : item.id === 'baba'
                                ? '🛶'
                                : '📜'}
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-[#b84a14] text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          <div className="font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-[#b84a14] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {item.era.split('(')[0].trim()}
                          </div>
                        </div>

                        <div className="text-[10px] text-stone-400 font-serif italic line-clamp-1 mt-2 pt-1 border-t border-stone-100">
                          {item.tagline}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ===============================================================
                PANEL 2: MÀU SẮC (COLORS) - THIẾT KẾ 2 TẦNG
                =============================================================== */}
            <div
              className={`rounded-2xl border transition-colors ${
                activeSection === 'color'
                  ? 'border-[#E4A025]/80 bg-[#FFFDF5]/40'
                  : 'border-stone-200/80 bg-stone-50/20 hover:border-stone-300'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleSection('color')}
                className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer select-none group focus:outline-hidden"
                aria-expanded={activeSection === 'color'}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#E4A025] text-white text-[11px] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    2
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 truncate">
                    Màu Sắc (Colors)
                  </span>

                  {/* Collapsed summary pill */}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-800 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-2xs shrink-0 border border-black/15"
                      style={{ backgroundColor: currentColorHex }}
                    />
                    <span className="font-mono text-[10px]">{currentColorHex}</span>
                    <span className="hidden sm:inline">· {activeColorData.name}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-600 font-medium hidden sm:inline">
                    {activeColorData.element}
                  </span>
                  <div
                    className={`p-1 text-stone-400 group-hover:text-stone-700 transition-transform duration-300 ${
                      activeSection === 'color' ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Panel 2 Body (Bảng phối màu 2 tầng) */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-3 sm:px-3.5 ${
                  activeSection === 'color'
                    ? 'max-h-[900px] opacity-100 pb-3.5 space-y-3.5'
                    : 'max-h-0 opacity-0 pb-0 pointer-events-none'
                }`}
              >
                {/* Khu vực hiển thị màu hiện tại (Current Color Display Card) */}
                <div className="p-3 rounded-2xl bg-white border border-stone-200/90 flex items-center gap-3.5 shadow-2xs">
                  {/* Ô vuông màu lớn */}
                  <div
                    className="w-14 h-14 rounded-2xl border-2 border-white shadow-md shrink-0 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: currentColorHex }}
                  >
                    <span className="sr-only">{currentColorHex}</span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                        {activeColorData.name}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-medium shrink-0">
                        {activeColorData.element}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-stone-700">
                        {currentColorHex}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyHex}
                        className="text-[10px] text-stone-400 hover:text-stone-800 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Sao chép mã màu HEX"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copyHexNotice ? 'Đã chép!' : 'Sao chép'}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-stone-500 font-serif italic line-clamp-1">
                      {activeColorData.meaning}
                    </p>
                  </div>
                </div>

                {/* TẦNG 1: MÀU GỢI Ý TRUYỀN THỐNG (PRESETS) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between">
                    <span>1. Màu Gợi Ý Truyền Thống (Ngũ Hành)</span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      8 sắc kinh điển
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                    {TRADITIONAL_COLORS.map((col) => {
                      const isSelected =
                        currentColorHex.toLowerCase() === col.hex.toLowerCase();
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => handleSelectPresetColor(col)}
                          className={`p-2 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center gap-2 hover:shadow-2xs active:scale-95 ${
                            isSelected
                              ? 'border-[#b84a14] bg-[#FFF8F5] ring-2 ring-[#b84a14]/20 shadow-2xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50'
                          }`}
                          title={`${col.name} (${col.element}) - ${col.meaning}`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-black/15 shadow-inner shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: col.hex }}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white drop-shadow-sm stroke-[3]" />
                            )}
                          </span>
                          <span className="text-xs font-medium text-stone-800 truncate">
                            {col.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TẦNG 2: TÙY CHỈNH MÀU TỰ DO (CUSTOM COLOR PICKER) */}
                <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#b84a14]" />
                      <span>2. Tùy Chỉnh Màu Tự Do (Color Picker)</span>
                    </span>

                    {/* Native color picker launcher */}
                    <label className="inline-flex items-center gap-1 text-[10px] font-medium text-[#b84a14] hover:underline cursor-pointer">
                      <span>Chọn nhanh</span>
                      <input
                        type="color"
                        value={currentColorHex}
                        onChange={(e) => handleDirectHexChange(e.target.value)}
                        className="w-4 h-4 rounded cursor-pointer border-0 p-0 opacity-0 absolute"
                      />
                    </label>
                  </div>

                  {/* Thanh trượt Hue (Dải màu 0 - 360) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                      <span>Dải màu (Hue):</span>
                      <span className="font-mono">{hueValue}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={hueValue}
                      onChange={(e) => handleHueChange(Number(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background:
                          'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                      }}
                    />
                  </div>

                  {/* Thanh trượt Độ sáng / Đậm nhạt (Lightness 15% - 85%) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                      <span>Độ đậm / sáng (Lightness):</span>
                      <span className="font-mono">{lightnessValue}%</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={85}
                      value={lightnessValue}
                      onChange={(e) =>
                        handleLightnessChange(Number(e.target.value))
                      }
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #1a1a1a 0%, hsl(${hueValue}, 75%, 50%) 50%, #f7f7f7 100%)`,
                      }}
                    />
                  </div>

                  {/* Nhập mã HEX trực tiếp */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-stone-500">Mã HEX:</span>
                    <input
                      type="text"
                      value={currentColorHex}
                      onChange={(e) => handleDirectHexChange(e.target.value)}
                      maxLength={7}
                      className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-[#b84a14]"
                      placeholder="#C82A27"
                    />
                    <span className="text-[10px] text-stone-400 italic">
                      Tự động đồng bộ lên phục trang
                    </span>
                  </div>
                </div>

                {/* Thanh tiến trình 1 dòng kiểm tra độ hài hòa màu sắc */}
                <ColorHarmonyValidator
                  primaryColor={activeColorData}
                  secondaryColorHex={secondaryColorHex}
                  onSelectSecondaryColor={setSecondaryColorHex}
                />
              </div>
            </div>

            {/* ===============================================================
                PANEL 3: CHẤT LIỆU & HOA VĂN (MATERIALS & PATTERNS)
                =============================================================== */}
            <div
              className={`rounded-2xl border transition-colors ${
                activeSection === 'material'
                  ? 'border-[#1F4F89]/60 bg-blue-50/20'
                  : 'border-stone-200/80 bg-stone-50/20 hover:border-stone-300'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleSection('material')}
                className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer select-none group focus:outline-hidden"
                aria-expanded={activeSection === 'material'}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#1F4F89] text-white text-[11px] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    3
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 truncate">
                    Chất Liệu & Hoa Văn
                  </span>

                  {/* Collapsed summary pill */}
                  <span className="text-[11px] font-semibold text-[#12335A] bg-blue-50 px-2 py-0.5 rounded-full border border-[#1F4F89]/20 truncate">
                    {activeMaterialData.name.split(' ')[0]} · {activePatternData.label.split('(')[0].trim()}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-500 font-serif italic hidden sm:inline">
                    Vải dệt & Gấm hoa
                  </span>
                  <div
                    className={`p-1 text-stone-400 group-hover:text-stone-700 transition-transform duration-300 ${
                      activeSection === 'material' ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Panel 3 Body */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-3 sm:px-3.5 ${
                  activeSection === 'material'
                    ? 'max-h-[850px] opacity-100 pb-3.5 space-y-3.5'
                    : 'max-h-0 opacity-0 pb-0 pointer-events-none'
                }`}
              >
                {/* 1. Chọn chất liệu vải */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Chất Liệu Vải Tự Nhiên Di Sản</span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      5 loại sợi thủ công
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {MATERIAL_OPTIONS.map((mat) => {
                      const isSelected = selectedMaterialId === mat.id;
                      return (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setSelectedMaterialId(mat.id)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] ${
                            isSelected
                              ? 'border-[#1F4F89] bg-blue-50/60 ring-1 ring-[#1F4F89]/20 shadow-2xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-stone-900 truncate">
                                {mat.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 border border-stone-200/80">
                                {mat.sheen}
                              </span>
                            </div>
                            <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                              {mat.desc}
                            </div>
                          </div>

                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#1F4F89] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Chọn hoa văn & họa tiết */}
                <div className="space-y-1.5 pt-1 border-t border-stone-100">
                  <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Họa Tiết Cung Đình & Phong Thủy</span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      Mô phỏng vân dệt
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PATTERN_OPTIONS.map((pat) => {
                      const isSelected = pattern === pat.id;
                      return (
                        <button
                          key={pat.id}
                          type="button"
                          onClick={() => setPattern(pat.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 active:scale-[0.98] ${
                            isSelected
                              ? 'border-[#1F4F89] bg-blue-50/70 text-[#12335A] font-semibold ring-1 ring-[#1F4F89]/20'
                              : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">
                              {pat.label}
                            </div>
                            <div className="text-[10px] text-stone-500 font-normal line-clamp-1 mt-0.5">
                              {pat.desc}
                            </div>
                          </div>

                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#1F4F89] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ===============================================================
                PANEL 4: PHỤ KIỆN REMIX (ACCESSORIES)
                =============================================================== */}
            <div
              className={`rounded-2xl border transition-colors ${
                activeSection === 'accessories'
                  ? 'border-[#3D7D73]/60 bg-[#EBF4F2]/30'
                  : 'border-stone-200/80 bg-stone-50/20 hover:border-stone-300'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleSection('accessories')}
                className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer select-none group focus:outline-hidden"
                aria-expanded={activeSection === 'accessories'}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#3D7D73] text-white text-[11px] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    4
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 truncate">
                    Phụ Kiện Remix
                  </span>

                  {/* Collapsed summary pill */}
                  <span className="text-[11px] font-semibold text-[#25544D] bg-[#EBF4F2] px-2 py-0.5 rounded-full border border-[#3D7D73]/20 truncate">
                    {accessories.length > 0
                      ? `${accessories.length} món đã chọn`
                      : 'Chưa chọn'}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                    {accessories.length > 0
                      ? `${accessories.length} món đang đeo`
                      : 'Chạm để phối'}
                  </span>
                  <div
                    className={`p-1 text-stone-400 group-hover:text-stone-700 transition-transform duration-300 ${
                      activeSection === 'accessories' ? 'rotate-180' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Panel 4 Body */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-3 sm:px-3.5 ${
                  activeSection === 'accessories'
                    ? 'max-h-[850px] opacity-100 pb-3.5 space-y-3.5'
                    : 'max-h-0 opacity-0 pb-0 pointer-events-none'
                }`}
              >
                {/* Active Accessories Counter & Quick Clear */}
                <div className="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                  <span className="font-medium text-stone-700">
                    Đang trang bị:{' '}
                    <strong className="text-stone-900">
                      {accessories.length} món
                    </strong>
                  </span>
                  {accessories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setAccessories([])}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Bỏ chọn tất cả</span>
                    </button>
                  )}
                </div>

                {/* Nhóm 1: Cổ phong truyền thống & Nón/Mũ */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Cổ Phong & Nón Mũ Di Sản
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ACCESSORIES.filter((a) => a.category === 'traditional').map(
                      (acc) => {
                        const active = accessories.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => toggleAccessory(acc.id)}
                            className={`px-3 py-1.5 rounded-xl border text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                              active
                                ? 'border-[#3D7D73] bg-[#EBF4F2] text-[#25544D] font-bold ring-1 ring-[#3D7D73]/30'
                                : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-[#3D7D73]/40 text-stone-700'
                            }`}
                          >
                            <span>{acc.emoji}</span>
                            <span>{acc.name}</span>
                            {active && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Nhóm 2: Gen Z Streetwear & Hiện Đại */}
                <div className="space-y-1.5 pt-1 border-t border-stone-100">
                  <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Gen Z Streetwear & Hiện Đại
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ACCESSORIES.filter((a) => a.category === 'streetwear').map(
                      (acc) => {
                        const active = accessories.includes(acc.id);
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => toggleAccessory(acc.id)}
                            className={`px-3 py-1.5 rounded-xl border text-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                              active
                                ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] font-bold ring-1 ring-[#C82A27]/30'
                                : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-[#C82A27]/40 text-stone-700'
                            }`}
                          >
                            <span>{acc.emoji}</span>
                            <span>{acc.name}</span>
                            {active && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Cultural Warnings & Tips (nếu có lưu ý phục trang) */}
                {culturalInsights.length > 0 && (
                  <div className="pt-2 border-t border-stone-100">
                    <CulturalGuide warnings={culturalInsights} />
                  </div>
                )}
              </div>
            </div>

            {/* ===============================================================
                PANEL 5: ĐÁNH GIÁ & CHẤM ĐIỂM BẢN PHỐI (AI SCORE)
                =============================================================== */}
            <div
              className={`rounded-2xl border transition-colors ${
                activeSection === 'score'
                  ? 'border-[#b84a14]/60 bg-[#FFF8F5]/30'
                  : 'border-stone-200/80 bg-stone-50/20 hover:border-stone-300'
              }`}
            >
              {/* Accordion Item 5 Header */}
              <button
                type="button"
                onClick={() => handleToggleSection('score')}
                className="w-full p-3 sm:p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors"
                aria-expanded={activeSection === 'score'}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                      activeSection === 'score'
                        ? 'bg-[#b84a14] text-white shadow-xs'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    5
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-sans uppercase tracking-wide">
                      ĐÁNH GIÁ & CHẤM ĐIỂM (AI SCORE)
                    </h4>
                    <span className="text-[11px] text-stone-500 font-serif italic">
                      Chấm điểm thẩm mỹ & chuẩn mực văn hóa
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge điểm số hoặc Nút chấm điểm nhanh */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${aiScoreEvaluation.badgeColor}`}
                  >
                    {aiScoreEvaluation.overallScore}/100 · {aiScoreEvaluation.title.split(' ')[0]}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform duration-300 ${
                      activeSection === 'score' ? 'rotate-180 text-[#b84a14]' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Panel 5 Body (Content Dashboard) */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden px-3 sm:px-3.5 ${
                  activeSection === 'score'
                    ? 'max-h-[900px] opacity-100 pb-3.5 space-y-3.5'
                    : 'max-h-0 opacity-0 pb-0 pointer-events-none'
                }`}
              >
                {/* 1. Tổng điểm phong cách (Overall Score Banner) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-amber-300 font-bold">
                      TỔNG ĐIỂM PHONG CÁCH REMIX
                    </div>
                    <div className="text-sm sm:text-base font-display font-bold text-amber-50 mt-0.5">
                      {aiScoreEvaluation.title}
                    </div>
                    <div className="text-[11px] text-stone-300 font-serif italic mt-0.5">
                      Đánh giá theo tỷ lệ Ngũ Hành & bối cảnh trang phục
                    </div>
                  </div>

                  {/* Circular/Bold Score Ring */}
                  <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 px-3 border border-white/15">
                    <span className="text-2xl sm:text-3xl font-display font-extrabold text-amber-300 leading-none">
                      {aiScoreEvaluation.overallScore}
                    </span>
                    <span className="text-[10px] text-stone-300 font-medium tracking-wider uppercase mt-0.5">
                      / 100 ĐIỂM
                    </span>
                  </div>
                </div>

                {/* 2. Chi tiết 3 tiêu chí cốt lõi (Progress Bars) */}
                <div className="space-y-3 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80">
                  <div className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    3 Tiêu Chí Chấm Điểm Cốt Lõi
                  </div>

                  {/* Tiêu chí 1: Độ tương phản & Hài hòa màu sắc */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#C82A27]" />
                        <span>Độ tương phản & Hài hòa màu sắc</span>
                      </span>
                      <span className="font-bold text-stone-900">
                        {aiScoreEvaluation.colorScore}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-[#C82A27] rounded-full transition-all duration-500"
                        style={{ width: `${aiScoreEvaluation.colorScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 italic">
                      {aiScoreEvaluation.colorAnalysis}
                    </p>
                  </div>

                  {/* Tiêu chí 2: Chuẩn mực văn hóa */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chuẩn mực văn hóa & Điển chế</span>
                      </span>
                      <span className="font-bold text-stone-900">
                        {aiScoreEvaluation.culturalScore}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-[#3D7D73] rounded-full transition-all duration-500"
                        style={{ width: `${aiScoreEvaluation.culturalScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 italic">
                      {aiScoreEvaluation.culturalNotes}
                    </p>
                  </div>

                  {/* Tiêu chí 3: Độ thời thượng Gen Z & Tính ứng dụng */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Độ thời thượng Gen Z & Ứng dụng</span>
                      </span>
                      <span className="font-bold text-stone-900">
                        {aiScoreEvaluation.trendScore}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${aiScoreEvaluation.trendScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-500 italic">
                      {accessories.length > 0
                        ? `Trang bị ${accessories.length} phụ kiện gia tăng tính thực tế khi dạo phố, kỷ yếu.`
                        : 'Bản phối thuần túy di sản, thanh lịch trang nhã.'}
                    </p>
                  </div>
                </div>

                {/* 3. Phân tích chi tiết & Gợi ý từ Gemini AI */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <Bot className="w-3.5 h-3.5 text-amber-700" />
                    <span>Nhận Xét & Gợi Ý Nâng Cấp Từ AI</span>
                  </div>

                  <div className="space-y-1 text-xs text-stone-700">
                    {aiScoreEvaluation.pros.map((pro, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="text-stone-700 text-[11px] leading-relaxed">
                          <strong className="text-stone-900">Ưu điểm:</strong> {pro}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-start gap-1.5 pt-0.5">
                      <span className="text-amber-600 font-bold">✦</span>
                      <span className="text-stone-700 text-[11px] leading-relaxed">
                        <strong className="text-stone-900">Gợi ý nâng cấp:</strong>{' '}
                        {aiScoreEvaluation.suggestion}
                      </span>
                    </div>
                  </div>

                  {/* Nút hành động nhanh mở Cố Vấn AI chuyên sâu */}
                  <div className="pt-1.5 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-[10px] text-amber-800/80 italic">
                      Cần giải đáp bối cảnh chuyên sâu?
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowGeminiModal(true)}
                      className="px-2.5 py-1 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Bot className="w-3 h-3 text-amber-200" />
                      <span>Hỏi AI Stylist Chi Tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. LOOKBOOK PRESETS CAROUSEL (CẢM HỨNG PHỐI ĐỒ SẴN CÓ)
          =================================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#8D1815] text-white text-xs flex items-center justify-center font-bold">
                ★
              </span>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
                Bộ Sưu Tập Cảm Hứng Phối Đồ (Lookbook Presets)
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-serif italic mt-0.5">
              Trượt ngang để khám phá các bản phối thịnh hành · Nhấp để xem chi tiết hoặc ướm thử ngay
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                carouselRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
              }}
              className="p-2 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-stone-700 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Cuộn sang trái"
              aria-label="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                carouselRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
              }}
              className="p-2 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-stone-700 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Cuộn sang phải"
              aria-label="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Track */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory focus:outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PRESET_LOOKS.map((preset) => {
            const outfitInfo = OUTFITS[preset.outfit];
            const isCurrent =
              outfit === preset.outfit && customLookName === preset.name;

            return (
              <div
                key={preset.id}
                className={`snap-start shrink-0 w-[260px] sm:w-[290px] rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between bg-stone-50/50 hover:bg-white hover:shadow-md hover:-translate-y-1 ${
                  isCurrent
                    ? 'border-[#C82A27] ring-2 ring-[#C82A27]/20 bg-white shadow-xs'
                    : 'border-stone-200/80 hover:border-[#C82A27]/40'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-sans font-bold tracking-wider text-[#8D1815] uppercase">
                      {outfitInfo?.name || preset.outfit}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-4 h-4 rounded-full border border-black/15 shadow-xs"
                        style={{ backgroundColor: preset.colorHex }}
                        title={`Sắc màu chính: ${preset.colorHex}`}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-black/15 shadow-xs"
                        style={{ backgroundColor: preset.secondaryColorHex }}
                        title={`Màu lót / viền: ${preset.secondaryColorHex}`}
                      />
                    </div>
                  </div>

                  <h4 className="text-sm font-display font-bold text-stone-900 line-clamp-1">
                    {preset.name}
                  </h4>

                  <p className="text-xs text-stone-600 font-serif italic line-clamp-2">
                    "{preset.tagline}"
                  </p>

                  <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 flex items-center justify-between">
                    <span className="truncate">
                      Vibe:{' '}
                      <strong className="text-stone-700">
                        {preset.vibe.split('·')[0]}
                      </strong>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700 font-medium">
                      {preset.accessories.length} phụ kiện
                    </span>
                  </div>
                </div>

                <div className="pt-3.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectingPreset(preset)}
                    className="p-2 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-100 text-stone-600 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Xem chi tiết bản phối (Popup)"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetLook(preset)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                      isCurrent
                        ? 'bg-[#C82A27] text-white shadow-xs'
                        : 'bg-white hover:bg-[#8D1815] hover:text-white text-stone-800 border border-stone-200 hover:border-[#8D1815]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isCurrent ? 'Đang ướm thử' : 'Thử ngay'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================================
          4. MODALS & DRAWERS
          =================================================================== */}
      {/* Modal Popup: So sánh 2 phương án phối đồ */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        currentOutfit={currentSlotForComparator}
        onApplyOutfit={handleApplyComparatorSlot}
      />

      {/* Slide-over Drawer: Gợi ý bối cảnh Thời tiết & Dịp lễ từ cạnh phải */}
      <WeatherEventDrawer
        isOpen={showWeatherDrawer}
        onClose={() => setShowWeatherDrawer(false)}
        onApplyPreset={handleApplyWeatherPreset}
      />

      {/* Modal Tri thức Di sản Phục trang */}
      <GarmentKnowledgeModal
        isOpen={showKnowledgeModal}
        onClose={() => setShowKnowledgeModal(false)}
        outfit={activeOutfitData}
      />

      {/* Modal Xuất thẻ Lookbook */}
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

      {/* Modal Cố vấn AI Stylist Gemini */}
      <GeminiAiStylistModal
        isOpen={showGeminiModal}
        onClose={() => setShowGeminiModal(false)}
        outfitData={activeOutfitData}
        colorData={activeColorData}
        secondaryColorHex={secondaryColorHex}
        accessories={selectedAccessoriesData}
        gender={gender}
      />

      {/* Modal Bộ sưu tập Lookbook đã lưu */}
      <SavedLookbooksModal
        isOpen={showSavedLooksModal}
        onClose={() => setShowSavedLooksModal(false)}
        onApplyLook={handleApplySavedLook}
      />

      {/* Popup Modal: Chi tiết bản phối Lookbook Preset */}
      {inspectingPreset && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setInspectingPreset(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#8D1815] text-white text-xs flex items-center justify-center font-bold">
                  ★
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8D1815] font-sans">
                  Chi Tiết Bản Phối Lookbook
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectingPreset(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                aria-label="Đóng popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[#C82A27]/10 text-[#C82A27] text-xs font-semibold">
                  {OUTFITS[inspectingPreset.outfit]?.name ||
                    inspectingPreset.outfit}
                </span>
                <span className="px-3 py-1 rounded-full bg-stone-200/70 text-stone-700 text-xs font-medium">
                  {inspectingPreset.gender === 'male' ? 'Dáng Nam' : 'Dáng Nữ'}
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold text-stone-900">
                {inspectingPreset.name}
              </h3>
              <p className="text-sm text-stone-600 font-serif italic">
                "{inspectingPreset.tagline}"
              </p>
            </div>

            {/* Colors & Vibe Details */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-stone-200/80 text-xs">
              <div className="space-y-1">
                <span className="text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                  Tông màu chủ đạo
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <div
                    className="w-5 h-5 rounded-full border border-black/15 shadow-xs"
                    style={{ backgroundColor: inspectingPreset.colorHex }}
                  />
                  <span className="font-semibold text-stone-800 font-mono">
                    {inspectingPreset.colorHex}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                  Màu lót / phối tà
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <div
                    className="w-5 h-5 rounded-full border border-black/15 shadow-xs"
                    style={{
                      backgroundColor: inspectingPreset.secondaryColorHex,
                    }}
                  />
                  <span className="font-semibold text-stone-800 font-mono">
                    {inspectingPreset.secondaryColorHex}
                  </span>
                </div>
              </div>

              <div className="col-span-2 pt-2 border-t border-stone-100 space-y-1">
                <span className="text-stone-400 uppercase tracking-wider font-semibold text-[10px]">
                  Phong cách & Thần thái
                </span>
                <p className="text-stone-700 font-medium">
                  {inspectingPreset.vibe}
                </p>
              </div>
            </div>

            {/* Accessories in Preset */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Phụ kiện đồng hành ({inspectingPreset.accessories.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {inspectingPreset.accessories.map((accId) => {
                  const accData = ACCESSORIES.find((a) => a.id === accId);
                  return (
                    <div
                      key={accId}
                      className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{accData?.emoji || '✨'}</span>
                      <span className="font-medium text-stone-800">
                        {accData?.name || accId}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInspectingPreset(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={() => {
                  handleApplyPresetLook(inspectingPreset);
                  setInspectingPreset(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#C82A27] hover:bg-[#8D1815] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ướm Thử Vào Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
