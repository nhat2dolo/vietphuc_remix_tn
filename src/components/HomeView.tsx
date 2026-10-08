import React, { useRef, useState } from 'react';
import { HeroVisualBackground } from './HeroVisualBackground';
import { GarmentKnowledgeModal } from './GarmentKnowledgeModal';
import { OutfitId, OutfitData } from '../types/vietphuc';
import { OUTFITS } from '../data/vietphucData';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  ArrowRight,
  Compass,
  Camera,
  Heart,
  CloudSun,
} from 'lucide-react';

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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedKnowledgeOutfit, setSelectedKnowledgeOutfit] = useState<OutfitData | null>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 360;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
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
    svgPreview: React.ReactNode;
  }> = [
    {
      id: 'aodai',
      vibeShort: 'Quốc phục thanh lịch, hai tà bay bổng tôn vinh nét duyên',
      bgGradient: 'from-[#8D1815] via-[#C82A27] to-[#F59E0B]',
      accentColor: '#C82A27',
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

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION WITH BACKGROUND VIDEO / ANIMATION */}
      <HeroVisualBackground className="min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex items-center justify-center rounded-3xl sm:rounded-4xl shadow-xl border border-stone-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8">
          {/* Inspiring Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Việt Phục Remix · Di Sản Trăm Năm Trong Nhịp Sống Trẻ</span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-lg max-w-4xl">
            Khoác Lên Dấu Ấn Cha Ông, <br className="hidden sm:inline" />
            <span className="text-[#FBBF24]">Tự Hào Bước Ra Thế Giới</span>
          </h1>

          {/* Clean Inspiring Subtitle */}
          <p className="text-stone-100/95 text-base sm:text-lg md:text-xl max-w-2xl font-serif italic leading-relaxed drop-shadow-md">
            Khám phá kết cấu chuẩn mực của Áo Dài, Ngũ Thân, Nhật Bình, Tứ Thân, Bà Ba, Giao Lĩnh qua công nghệ thử đồ tương tác và Cố vấn AI Google Gemini.
          </p>

          {/* 2 Nút Bấm Lớn Dạng Viên Thuốc Nổi (Floating Pill Glassmorphism) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* Nút 1: Bắt Đầu Thử Đồ Ngay */}
            <button
              onClick={onStartTryOn}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C82A27]/95 hover:bg-[#A8221F] text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/40 shadow-xl hover:shadow-red-900/50 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-amber-300 transition-transform group-hover:rotate-12" />
              <span>✨ Bắt Đầu Thử Đồ Ngay</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Nút 2: Khám Phá 6 Dáng Cổ Phục */}
            <button
              onClick={scrollToGarments}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/25 hover:bg-white/40 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/40 shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>📜 Khám Phá 6 Dáng Cổ Phục</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </HeroVisualBackground>

      {/* 2. KHU VỰC 6 CỔ PHỤC: CAROUSEL THẺ ẢNH LỚN VUỐT NGANG (VISUAL STORYTELLING) */}
      <section id="heritage-carousel-section" className="space-y-6 pt-4">
        {/* Section Header with Carousel Navigation */}
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
              Chạm vào bất kỳ cổ phục nào để đưa thẳng vào Studio thử đồ hoặc bấm "i" để tra cứu tri thức
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:bg-stone-50 hover:border-[#C82A27] text-stone-700 hover:text-[#C82A27] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm cursor-pointer"
              aria-label="Xem trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-10 h-10 rounded-full border border-stone-300 bg-white hover:bg-stone-50 hover:border-[#C82A27] text-stone-700 hover:text-[#C82A27] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm cursor-pointer"
              aria-label="Xem tiếp"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container (Horizontal Swipeable Cards) */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-1"
        >
          {GARMENT_CARDS.map((card) => {
            const outfitInfo = OUTFITS[card.id];
            return (
              <div
                key={card.id}
                className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[340px] group rounded-3xl bg-white border border-stone-200/90 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Visual Artwork Container */}
                <div
                  onClick={() => onSelectOutfit(card.id)}
                  className={`h-64 sm:h-72 w-full bg-gradient-to-b ${card.bgGradient} p-6 flex items-center justify-center relative cursor-pointer overflow-hidden`}
                >
                  {/* Subtle silk glow background */}
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] group-hover:bg-transparent transition-colors duration-300" />
                  
                  {/* Garment SVG Artwork Preview */}
                  <div className="w-44 h-56 transition-transform duration-300 group-hover:scale-105">
                    {card.svgPreview}
                  </div>

                  {/* Era Badge in Card Corner */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                    {outfitInfo.era.split('(')[0]}
                  </div>

                  {/* Scholarly Knowledge Info "i" Icon Button (Tối Giản Chữ) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKnowledgeOutfit(outfitInfo);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 hover:text-[#C82A27] flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
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
                      className="text-xl font-display font-bold text-stone-900 group-hover:text-[#C82A27] transition-colors cursor-pointer"
                    >
                      {outfitInfo.name}
                    </h3>
                    <p className="text-xs text-stone-600 font-serif italic mt-1 line-clamp-2">
                      "{card.vibeShort}"
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectOutfit(card.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-100 group-hover:bg-[#C82A27] text-stone-800 group-hover:text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Mở Studio & Phối Đồ Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
      />
    </div>
  );
};
