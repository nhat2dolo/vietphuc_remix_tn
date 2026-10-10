import React, { useState, useEffect } from 'react';
import { HeroVisualBackground } from './HeroVisualBackground';
import { GarmentKnowledgeModal } from './GarmentKnowledgeModal';
import { HeritageModelViewer } from './HeritageModelViewer';
import { OutfitId, OutfitData } from '../types/vietphuc';
import { OUTFITS } from '../data/vietphucData';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowRight,
  Compass,
  Camera,
  Heart,
  CloudSun,
  Rotate3D,
} from 'lucide-react';

// Component hiển thị hình ảnh thật từ Assets với fallback thông minh
const CardGarmentArtwork: React.FC<{
  image?: string;
  fallbackSvg: React.ReactNode;
  alt: string;
}> = ({ image, fallbackSvg, alt }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(image);

  const handleError = () => {
    if (currentSrc && currentSrc.startsWith('/assets/')) {
      setCurrentSrc(currentSrc.replace('/assets/', '/'));
    } else {
      setImageError(true);
    }
  };

  if (currentSrc && !imageError) {
    return (
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] group-hover:scale-108 group-hover:-translate-y-2.5 transition-all duration-500 ease-out select-none pointer-events-none"
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105">
      {fallbackSvg}
    </div>
  );
};

interface HomeViewProps {
  onStartTryOn: () => void;
  onSelectOutfit: (outfitId: OutfitId) => void;
  onNavigateTab: (tab: 'studio' | 'tryon' | 'quiz' | 'weather') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartTryOn,
  onSelectOutfit,
  onNavigateTab,
}) => {
  const [selectedKnowledgeOutfit, setSelectedKnowledgeOutfit] = useState<OutfitData | null>(null);
  const [galleryViewMode, setGalleryViewMode] = useState<'cards' | '3d'>('cards');

  const [active3DModalOutfitId, setActive3DModalOutfitId] = useState<OutfitId | null>(null);
  const [manualOffset, setManualOffset] = useState(0);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const step = 344;
    setManualOffset((prev) => (direction === 'left' ? prev + step : prev - step));
  };

  const scrollToGarments = () => {
    const el = document.getElementById('heritage-carousel-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Garment visual artworks & color themes for the 6 cards
  const GARMENT_CARDS: Array<{
    id: OutfitId;
    vibeShort: string;
    bgGradient: string;
    accentColor: string;
    image: string;
    bgPatternDesc: string;
    svgPreview: React.ReactNode;
  }> = [
    {
      id: 'aodai',
      vibeShort: 'Quốc phục thanh lịch, hai tà bay bổng tôn vinh nét duyên',
      bgGradient: 'from-[#8D1815] via-[#C82A27] to-[#F59E0B]',
      accentColor: '#C82A27',
      image: '/assets/aodai.png',
      bgPatternDesc: 'Lụa tơ tằm Hà Đông thêu hoa chỉ tơ',
      svgPreview: (
        <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-xl">
          <ellipse cx="80" cy="35" rx="14" ry="18" fill="#FCE7D2" />
          <path d="M68 28 Q80 18 92 28 C92 42 68 42 68 28 Z" fill="#1C1815" />
          {/* Standing collar */}
          <path d="M72 45 C76 43 84 43 88 45 L86 52 C82 53 78 53 74 52 Z" fill="#FAF7F2" stroke="#8D1815" strokeWidth="1" />
          {/* Two flowing flaps */}
          <path d="M66 52 C72 50 88 50 94 52 L112 180 L88 180 L80 100 L72 180 L48 180 Z" fill="#C82A27" />
          <path d="M76 100 L70 195 L90 195 L84 100 Z" fill="#FAF7F2" opacity="0.9" />
          <path d="M48 60 L32 110 L44 116 L56 75 Z" fill="#C82A27" />
          <path d="M112 60 L128 110 L116 116 L104 75 Z" fill="#C82A27" />
          <circle cx="35" cy="114" r="5" fill="#FCE7D2" />
          <circle cx="125" cy="114" r="5" fill="#FCE7D2" />
        </svg>
      ),
    },
    {
      id: 'nguthan',
      vibeShort: 'Đạo làm người trong từng đường kim, dáng áo chuẩn mực xưa',
      bgGradient: 'from-[#92400E] via-[#D97706] to-[#FBBF24]',
      accentColor: '#E4A025',
      image: '/assets/nguthan.png',
      bgPatternDesc: 'Gấm sa Hàn vân mây hoàng yến',
      svgPreview: (
        <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-xl">
          <ellipse cx="80" cy="35" rx="14" ry="18" fill="#FCE7D2" />
          {/* Neat short hair */}
          <path d="M67 32 C67 20 73 16 80 16 C87 16 93 20 93 32 C90 30 87 28 80 28 C73 28 70 30 67 32 Z" fill="#18181B" />
          {/* Standing collar (lap linh) */}
          <path d="M71 46 C75 44 85 44 89 46 L87 54 C83 55 77 55 73 54 Z" fill="#E4A025" stroke="#78350F" strokeWidth="1" />
          <line x1="73" y1="47" x2="87" y2="47" stroke="#FAF7F2" strokeWidth="1.5" />
          {/* Square broad body */}
          <path d="M54 55 C65 52 95 52 106 55 L112 170 L48 170 Z" fill="#E4A025" />
          {/* Vertical button line */}
          <line x1="80" y1="54" x2="80" y2="170" stroke="#78350F" strokeWidth="1.2" />
          {[65, 85, 105, 125, 145].map((cy) => (
            <circle key={cy} cx="80" cy={cy} r="2" fill="#FAF7F2" stroke="#334155" strokeWidth="0.8" />
          ))}
          {/* Patch pockets */}
          <rect x="56" y="130" width="16" height="20" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
          <rect x="88" y="130" width="16" height="20" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
          {/* Sleeves */}
          <path d="M54 55 L28 105 L40 112 L60 75 Z" fill="#E4A025" />
          <path d="M106 55 L132 105 L120 112 L100 75 Z" fill="#E4A025" />
          <circle cx="32" cy="110" r="5" fill="#FCE7D2" />
          <circle cx="128" cy="110" r="5" fill="#FCE7D2" />
        </svg>
      ),
    },
    {
      id: 'nhatbinh',
      vibeShort: 'Phẩm phục vương triều lộng lẫy chốn hoàng cung Huế',
      bgGradient: 'from-[#1E3A8A] via-[#2563EB] to-[#DC2626]',
      accentColor: '#1F4F89',
      image: '/assets/nhatbinh.png',
      bgPatternDesc: 'Đoạn bát ty dệt rồng phượng cung đình',
      svgPreview: (
        <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-xl">
          <ellipse cx="80" cy="35" rx="14" ry="18" fill="#FCE7D2" />
          {/* Hair bun */}
          <circle cx="80" cy="22" r="8" fill="#1C1815" />
          <path d="M68 28 Q80 20 92 28 C92 40 68 40 68 28 Z" fill="#1C1815" />
          {/* Wide robe */}
          <path d="M50 56 L18 115 L32 125 L56 82 L52 180 L108 180 L104 82 L128 125 L142 115 L110 56 Z" fill="#1F4F89" />
          {/* Rectangular embroidered collar */}
          <rect x="68" y="48" width="24" height="60" rx="2" fill="#FBBF24" stroke="#92400E" strokeWidth="1" />
          <rect x="71" y="50" width="18" height="56" rx="1" fill="#DC2626" />
          <circle cx="80" cy="65" r="3" fill="#FBBF24" />
          <circle cx="80" cy="85" r="3" fill="#10B981" />
          {/* Striped sleeves */}
          <path d="M22 108 L28 120" stroke="#FBBF24" strokeWidth="3" />
          <path d="M138 108 L132 120" stroke="#FBBF24" strokeWidth="3" />
        </svg>
      ),
    },
    {
      id: 'tuthan',
      vibeShort: 'Vẻ đẹp thuần hậu mộc mạc, đậm hồn ca dao Bắc Bộ',
      bgGradient: 'from-[#78350F] via-[#9A3412] to-[#15803D]',
      accentColor: '#5E402D',
      image: '/assets/tuthan.png',
      bgPatternDesc: 'Đũi tơ tằm nhuộm bùn sông Kinh Bắc',
      svgPreview: (
        <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-xl">
          <ellipse cx="80" cy="35" rx="14" ry="18" fill="#FCE7D2" />
          <path d="M68 28 Q80 20 92 28 C92 40 68 40 68 28 Z" fill="#1C1815" />
          {/* Inner yếm */}
          <path d="M72 52 L88 52 L94 95 L66 95 Z" fill="#DC2626" />
          <path d="M73 50 Q80 47 87 50" stroke="#FDE047" strokeWidth="1.5" />
          {/* Outer 4-panel robe */}
          <path d="M56 55 L32 110 L44 116 L62 82 L52 185 L74 185 L80 115 L86 185 L108 185 L98 82 L116 116 L128 110 L104 55 Z" fill="#5E402D" />
          {/* Waist sash */}
          <rect x="66" y="94" width="28" height="8" rx="2" fill="#E4A025" />
          <path d="M76 102 L72 135 L78 135 L80 102 Z" fill="#F59E0B" />
          <path d="M81 102 L84 140 L90 140 L85 102 Z" fill="#DC2626" />
        </svg>
      ),
    },
    {
      id: 'baba',
      vibeShort: 'Hồn nhiên, mộc mạc, phóng khoáng miền sông nước Nam Bộ',
      bgGradient: 'from-[#065F46] via-[#0D9488] to-[#0284C7]',
      accentColor: '#3D7D73',
      image: '/assets/baba.png',
      bgPatternDesc: 'Vải the ú mỏng dệt thủ công miệt vườn',
      svgPreview: (
        <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-xl">
          <ellipse cx="80" cy="35" rx="14" ry="18" fill="#FCE7D2" />
          <path d="M68 28 Q80 20 92 28 C92 40 68 40 68 28 Z" fill="#1C1815" />
          {/* Gentle round collar */}
          <path d="M72 48 Q80 55 88 48" stroke="#3D7D73" strokeWidth="2.5" fill="none" />
          {/* Body */}
          <path d="M60 52 C70 50 90 50 100 52 L105 140 L90 140 L80 138 L70 140 L55 140 Z" fill="#3D7D73" />
          {/* Center line with small buttons */}
          <line x1="80" y1="53" x2="80" y2="138" stroke="#134E4A" strokeWidth="1" />
          {[64, 80, 96, 112, 128].map((cy) => (
            <circle key={cy} cx="80" cy={cy} r="1.8" fill="#FAF5E8" stroke="#134E4A" strokeWidth="0.6" />
          ))}
          {/* Bottom two small pockets */}
          <rect x="62" y="115" width="12" height="14" rx="1.5" fill="#2D6058" />
          <rect x="86" y="115" width="12" height="14" rx="1.5" fill="#2D6058" />
          {/* Sleeves */}
          <path d="M60 52 L36 100 L46 106 L66 72 Z" fill="#3D7D73" />
          <path d="M100 52 L124 100 L114 106 L94 72 Z" fill="#3D7D73" />
          {/* Dark trousers */}
          <path d="M66 140 L60 205 L76 205 L80 145 L84 145 L84 205 L100 205 L94 140 Z" fill="#1F2937" />
        </svg>
      ),
    },
    {
      id: 'giaolinh',
      vibeShort: 'Cổ kính uy nghi, dấu ấn triều đại Lý - Trần - Lê sơ',
      bgGradient: 'from-[#4C1D95] via-[#6D28D9] to-[#047857]',
      accentColor: '#1F4F89',
      image: '/assets/giaolinh.png',
      bgPatternDesc: 'Lụa the dệt nổi vân kỷ hà & hoa sen',
      svgPreview: (
        <svg viewBox="0 0 160 220" className="w-full h-full drop-shadow-xl">
          <ellipse cx="80" cy="35" rx="14" ry="18" fill="#FCE7D2" />
          {/* Hair */}
          <path d="M68 28 Q80 20 92 28 C92 40 68 40 68 28 Z" fill="#1C1815" />
          {/* Cross collar (Giao Lĩnh: Left over Right) */}
          <path d="M54 54 L20 115 L35 125 L64 80 L52 185 L108 185 L96 80 L125 125 L140 115 L106 54 Z" fill="#4C1D95" />
          {/* Overlapping collar bands */}
          <path d="M68 50 L80 82 L98 52" stroke="#FDE68A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M62 52 L80 86 L104 115" stroke="#FAF7F2" strokeWidth="1.5" fill="none" />
          {/* Belt */}
          <rect x="62" y="105" width="36" height="10" rx="1.5" fill="#047857" />
          <rect x="74" y="106" width="12" height="8" rx="1" fill="#FDE68A" />
        </svg>
      ),
    },
  ];

  const renderGarmentCard = (card: (typeof GARMENT_CARDS)[0], setPrefix: string) => {
    const outfitInfo = OUTFITS[card.id];
    return (
      <div
        key={`${setPrefix}-${card.id}`}
        className="shrink-0 w-[280px] sm:w-[320px] md:w-[340px] group/card rounded-3xl bg-white border border-amber-900/30 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden relative"
      >
        {/* Visual Artwork Container: Tủ Kính Bảo Tàng Hoàng Gia & Ánh Sáng Vàng Chiếu Từ Xung Quanh */}
        <div
          onClick={() => onSelectOutfit(card.id)}
          className="h-68 sm:h-76 w-full bg-gradient-to-b from-[#181614] via-[#100F0E] to-[#0A0908] p-5 flex items-center justify-center relative cursor-pointer overflow-hidden border-b border-amber-900/40 select-none group/glass"
        >
          {/* 1. ÁNH SÁNG VÀNG CHIẾU TỪ XUNG QUANH (PERIMETER & RIM GOLDEN SPOTLIGHTS) */}
          {/* Vầng sáng vàng rọi từ đỉnh tủ kính (Top Spotlight) */}
          <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.32)_0%,_rgba(217,119,6,0.12)_50%,_transparent_80%)] pointer-events-none" />

          {/* Vầng sáng vàng ấm bao quanh 4 góc & viền tủ kính (Perimeter Golden Rim Glow) */}
          <div className="absolute inset-0 shadow-[inset_0_0_55px_rgba(245,158,11,0.22)] pointer-events-none" />

          {/* Vầng sáng vàng chân đế hắt ngược lên (Bottom Pedestal Up-light) */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,_rgba(245,158,11,0.25)_0%,_transparent_75%)] pointer-events-none" />

          {/* Hào quang vàng hoàng gia trung tâm tỏa ra phía sau chiếc áo */}
          <div className="absolute w-48 h-56 rounded-full bg-gradient-to-b from-amber-400/25 via-yellow-500/15 to-transparent blur-2xl group-hover:from-amber-300/40 group-hover:scale-110 transition-all duration-700 pointer-events-none" />

          {/* 2. HIỆU ỨNG TỦ KÍNH BẢO TÀNG (MUSEUM GLASS CABINET SPECULAR & CORNERS) */}
          {/* Vệt phản chiếu ánh sáng chéo trên bề mặt kính (Diagonal Glass Glare Sheen) */}
          <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/8 to-transparent rotate-25 pointer-events-none group-hover:translate-x-20 transition-transform duration-1000 ease-out" />

          {/* Khung viền mạ đồng / vàng bảo tàng ở 4 góc tủ kính */}
          <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-500/60 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-500/60 pointer-events-none" />

          {/* 3. TÁC PHẨM CỔ PHỤC: ƯU TIÊN ẢNH THẬT 2D TỪ ASSETS THAY THẾ VECTOR */}
          <div className="w-48 sm:w-52 h-60 sm:h-64 transition-transform duration-500 group-hover/card:scale-108 group-hover/glass:scale-108 z-10 flex items-center justify-center p-1">
            <CardGarmentArtwork
              image={card.image}
              fallbackSvg={card.svgPreview}
              alt={outfitInfo.name}
            />
          </div>

          {/* 4. HUY HIỆU TRIỀU ĐẠI / THỜI KỲ (ERA BADGE) */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-200 text-[11px] font-semibold border border-amber-500/30 z-20 shadow-md">
            {outfitInfo.era.split('(')[0]}
          </div>

          {/* 5. NÚT XEM 3D 360 ĐỘ */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive3DModalOutfitId(card.id);
            }}
            className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-stone-900/85 hover:bg-amber-950/80 text-amber-300 hover:text-amber-200 text-[11px] font-semibold border border-amber-500/50 flex items-center gap-1 shadow-md transition-all cursor-pointer z-20 hover:scale-105 active:scale-95"
            title="Xem mô hình 3D xoay 360 độ"
          >
            <Rotate3D className="w-3.5 h-3.5 text-amber-400" />
            <span>3D</span>
          </button>

          {/* 6. NÚT TRI THỨC KHẢO CỨU LỊCH SỬ (INFO) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedKnowledgeOutfit(outfitInfo);
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-900/80 hover:bg-amber-600 text-amber-300 hover:text-white flex items-center justify-center shadow-md border border-amber-500/30 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-20"
            title="Xem tri thức khảo cứu lịch sử"
            aria-label="Xem tri thức khảo cứu lịch sử"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Card Content & Action */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
          <div>
            <h3
              onClick={() => onSelectOutfit(card.id)}
              className="text-xl font-display font-bold text-stone-900 group-hover/card:text-[#C82A27] transition-colors cursor-pointer"
            >
              {outfitInfo.name}
            </h3>
            <p className="text-xs text-stone-600 font-serif italic mt-1 line-clamp-2">
              "{card.vibeShort}"
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => onSelectOutfit(card.id)}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 group-hover/card:bg-[#C82A27] text-stone-800 group-hover/card:text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Mở Studio & Phối Đồ Ngay</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/card:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION WITH BACKGROUND VIDEO / ANIMATION */}
      <HeroVisualBackground className="min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex items-center justify-center rounded-3xl sm:rounded-4xl shadow-xl border border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8">
          {/* Inspiring Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#E5A93C]/40 text-[#FDFBF7] text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg">
            <Sparkles className="w-4 h-4 text-[#E5A93C] animate-spin" style={{ animationDuration: '6s' }} />
            <span>Việt Phục Remix · Di Sản Trăm Năm Trong Nhịp Sống Trẻ</span>
          </div>

          {/* Majestic Hero Headline: Serif Playfair/Lora, Dòng 1 Trắng Ngà Ánh Kim, Dòng 2 Vàng Kim Gradient */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight drop-shadow-2xl max-w-4xl text-center">
            <span className="block text-[#FDFBF7] drop-shadow-[0_2px_12px_rgba(201,151,0,0.45)]">
              KHOÁC LÊN DI SẢN
            </span>
            <span className="block bg-gradient-to-r from-[#FBBF24] via-[#E5A93C] to-[#C99700] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(201,151,0,0.55)]">
              TỰ HÀO DÁNG VIỆT
            </span>
          </h1>

          {/* Clean Inspiring Subtitle */}
          <p className="text-[#FDFBF7]/90 text-base sm:text-lg md:text-xl max-w-2xl font-serif italic leading-relaxed drop-shadow-md">
            Khám phá vẻ đẹp của Áo Dài, Ngũ Thân, Nhật Bình, Tứ Thân, Bà Ba và Giao Lĩnh — nơi di sản được tái hiện qua trải nghiệm thử đồ tương tác và công nghệ AI.
          </p>

          {/* 2 Nút Bấm Lớn Dạng Viên Thuốc Nổi (Floating Pill Glassmorphism) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* Nút 1: Bắt Đầu Thử Đồ (Nền đỏ chu sa viền vàng, hiệu ứng hover nở nhẹ) */}
            <button
              onClick={onStartTryOn}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#8B1E1E] hover:bg-[#A32222] text-[#FDFBF7] font-bold text-sm sm:text-base backdrop-blur-md border border-[#E5A93C]/80 shadow-[0_10px_30px_rgba(139,30,30,0.5)] hover:shadow-[0_14px_40px_rgba(229,169,60,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-[#E5A93C] transition-transform group-hover:rotate-12 group-hover:scale-110" />
              <span>Bắt Đầu Thử Đồ</span>
              <ArrowRight className="w-4 h-4 text-[#FDFBF7] transition-transform group-hover:translate-x-1" />
            </button>

            {/* Nút 2: Khám Phá 6 Dáng Cổ Phục */}
            <button
              onClick={scrollToGarments}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/20 hover:bg-white/30 text-[#FDFBF7] font-bold text-sm sm:text-base backdrop-blur-md border border-white/40 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>📜 Khám Phá 6 Dáng Cổ Phục</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Nút 3: Mô Hình 3D Thực Tế Ảo (Mới) */}
            <button
              onClick={() => setActive3DModalOutfitId('nhatbinh')}
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 font-bold text-sm sm:text-base backdrop-blur-md border border-amber-400/50 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Rotate3D className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Mô Hình 3D (.GLB)</span>
            </button>
          </div>
        </div>
      </HeroVisualBackground>

      {/* 2. KHU VỰC 6 CỔ PHỤC: THANH TREO 3D & CAROUSEL (VISUAL STORYTELLING) */}
      <section id="heritage-carousel-section" className="space-y-6 pt-4">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8D1815] font-sans">
              <Compass className="w-4 h-4 text-[#C82A27]" />
              <span>BỘ SƯU TẬP DI SẢN PHỤC TRANG</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-stone-900">
              6 Kiểu Dáng Cổ Phục Tiêu Biểu
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-serif italic">
              Khám phá di sản trăm năm qua tủ kính bảo tàng hoàng gia hoặc mô hình 3D Meshy AI
            </p>
          </div>

          {/* View Mode Toggle: Thẻ Cuộn Tủ Kính vs 3D Meshy AI & Cụm Nút Điều Hướng Trái/Phải */}
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <div className="flex items-center p-1 rounded-full bg-stone-200/80 border border-stone-300/80 shadow-xs">
              <button
                type="button"
                onClick={() => setGalleryViewMode('cards')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  galleryViewMode === 'cards'
                    ? 'bg-[#8D1815] text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Thẻ Cuộn Tủ Kính</span>
              </button>
              <button
                type="button"
                onClick={() => setGalleryViewMode('3d')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  galleryViewMode === '3d'
                    ? 'bg-[#8D1815] text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                <Rotate3D className="w-3.5 h-3.5 text-amber-300" />
                <span>3D Meshy AI</span>
              </button>
            </div>

            {/* Cụm điều hướng Trái / Phải & Tạm dừng */}
            {galleryViewMode === 'cards' && (
              <div className="flex items-center gap-1 p-1 rounded-full bg-stone-200/80 border border-stone-300/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => setIsMarqueePaused((prev) => !prev)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1"
                  title={isMarqueePaused ? 'Bật trôi tự động' : 'Tạm dừng trôi'}
                >
                  <span>{isMarqueePaused ? '▶ Trôi' : '⏸ Dừng'}</span>
                </button>
                <div className="h-4 w-px bg-stone-300 mx-0.5" />
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-white transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Cuộn thẻ sang trái"
                  aria-label="Cuộn thẻ sang trái"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-700 hover:text-stone-900 hover:bg-white transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Cuộn thẻ sang phải"
                  aria-label="Cuộn thẻ sang phải"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CHẾ ĐỘ THẺ CUỘN VÒNG LẶP VÔ TẬN THUẦN GPU (PURE CSS INFINITE LOOP - KHÔNG KHỰNG) */}
        {galleryViewMode === 'cards' && (
          <>
            {/* Nhúng Style Keyframe GPU thuần CSS: dịch chuyển mượt mà không bao giờ giật/khựng */}
            <style>{`
              @keyframes heritageInfiniteLoop {
                0% {
                  transform: translate3d(-50%, 0, 0);
                }
                100% {
                  transform: translate3d(0%, 0, 0);
                }
              }
              .animate-heritage-loop {
                animation: heritageInfiniteLoop 42s linear infinite;
                will-change: transform;
              }
              .group\\/loop:hover .animate-heritage-loop,
              .group\\/loop:active .animate-heritage-loop {
                animation-play-state: paused;
              }
            `}</style>

            <div className="w-full overflow-hidden py-4 px-1 relative group/loop select-none">
              {/* Dải viền mờ nghệ thuật (Vignette edge blur) ở mép trái và mép phải */}
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-20 pointer-events-none" />

              {/* Nút điều hướng nổi Trái / Phải tiện lợi */}
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-stone-950 text-white backdrop-blur-md border border-amber-400/50 shadow-xl flex items-center justify-center opacity-0 group-hover/loop:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                title="Cuộn thẻ sang trái"
                aria-label="Cuộn thẻ sang trái"
              >
                <ChevronLeft className="w-5 h-5 text-amber-300" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-stone-950 text-white backdrop-blur-md border border-amber-400/50 shadow-xl flex items-center justify-center opacity-0 group-hover/loop:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                title="Cuộn thẻ sang phải"
                aria-label="Cuộn thẻ sang phải"
              >
                <ChevronRight className="w-5 h-5 text-amber-300" />
              </button>

              {/* Dải trượt chính áp dụng GPU animation & dịch chuyển thủ công */}
              <div
                style={{
                  transform: `translate3d(${manualOffset}px, 0, 0)`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                <div
                  className={`flex w-max ${isMarqueePaused ? '' : 'animate-heritage-loop'}`}
                  style={{
                    animationPlayState: isMarqueePaused ? 'paused' : undefined,
                  }}
                >
                  {/* Cụm 1 */}
                  <div className="flex gap-6 pr-6 shrink-0">
                    {GARMENT_CARDS.map((card) => renderGarmentCard(card, 'set1'))}
                  </div>

                  {/* Cụm 2 (Nhân bản liền mạch chu kỳ vô tận) */}
                  <div className="flex gap-6 pr-6 shrink-0" aria-hidden="true">
                    {GARMENT_CARDS.map((card) => renderGarmentCard(card, 'set2'))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 3. CHẾ ĐỘ TRÌNH DIỄN MÔ HÌNH 3D MESHY AI (.GLB) */}
        {galleryViewMode === '3d' && (
          <div className="w-full min-h-[500px]">
            <HeritageModelViewer
              onSelectForStudio={(outfitId) => onSelectOutfit(outfitId)}
            />
          </div>
        )}
      </section>

      {/* 3. KHÁM PHÁ NHANH CÁC TÍNH NĂNG ĐỘC ĐÁO (FEATURE HIGHLIGHTS) */}
      <section className="bg-gradient-to-r from-[#FAF6F0] via-white to-[#FAF6F0] rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#8D1815]">
            TRẢI NGHIỆM ĐA TƯƠNG TÁC
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
            Sáng Tạo Phong Cách Của Riêng Bạn
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Thử Đồ Ảo Fabric.js */}
          <div
            onClick={() => onNavigateTab('tryon')}
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#C82A27]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C82A27] flex items-center justify-center transition-transform group-hover:scale-110">
                <Camera className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-stone-900 group-hover:text-[#C82A27] transition-colors">
                Thử Đồ Ảo Kéo Thả
              </h4>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                Tải ảnh của chính bạn, ướm thử nón lá, sneaker, ngũ thân và lưu khoảnh khắc cực chất.
              </p>
            </div>
            <div className="text-xs font-bold text-[#C82A27] flex items-center gap-1">
              <span>Trải nghiệm ngay</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Trắc Nghiệm Vibe */}
          <div
            onClick={() => onNavigateTab('quiz')}
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#3D7D73]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#3D7D73] flex items-center justify-center transition-transform group-hover:scale-110">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-stone-900 group-hover:text-[#3D7D73] transition-colors">
                Trắc Nghiệm Tính Cách
              </h4>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                Trả lời vài câu hỏi vui để tìm ra mẫu cổ phục chân ái đại diện cho cá tính của bạn.
              </p>
            </div>
            <div className="text-xs font-bold text-[#3D7D73] flex items-center gap-1">
              <span>Khám phá vibe</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Gợi Ý Dịp Lễ & Thời Tiết */}
          <div
            onClick={() => onNavigateTab('weather')}
            className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#1F4F89]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1F4F89] flex items-center justify-center transition-transform group-hover:scale-110">
                <CloudSun className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-stone-900 group-hover:text-[#1F4F89] transition-colors">
                Thời Tiết & Dịp Lễ
              </h4>
              <p className="text-xs text-stone-600 font-serif leading-relaxed">
                Tự động đề xuất sắc áo ngũ hành và phụ kiện tối ưu cho ngày nắng hè, se lạnh hay ngày Tết.
              </p>
            </div>
            <div className="text-xs font-bold text-[#1F4F89] flex items-center gap-1">
              <span>Xem gợi ý</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Garment Knowledge Modal (Tri thức khảo cứu lịch sử) */}
      <GarmentKnowledgeModal
        isOpen={Boolean(selectedKnowledgeOutfit)}
        onClose={() => setSelectedKnowledgeOutfit(null)}
        outfit={selectedKnowledgeOutfit}
        onOpen3DViewer={(outfitId) => {
          setActive3DModalOutfitId(outfitId as OutfitId);
        }}
      />

      {/* 3D Model Viewer Modal */}
      {active3DModalOutfitId && (
        <HeritageModelViewer
          initialOutfitId={active3DModalOutfitId}
          isModal={true}
          onClose={() => setActive3DModalOutfitId(null)}
          onSelectForStudio={(outfitId) => {
            setActive3DModalOutfitId(null);
            onSelectOutfit(outfitId);
          }}
        />
      )}
    </div>
  );
};
