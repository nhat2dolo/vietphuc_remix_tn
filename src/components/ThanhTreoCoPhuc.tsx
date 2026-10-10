import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  Check,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Shirt,
  X,
  Calendar,
  Eye,
  Maximize2,
  Rotate3D,
} from 'lucide-react';
import { OutfitId } from '../types/vietphuc';
import { HeritageModelViewer } from './HeritageModelViewer';

// =====================================================================
// 1. DATA STRUCTURE (MẢNG DỮ LIỆU CỔ PHỤC MẪU)
// =====================================================================
export interface HeritageOutfit {
  id: string;
  name: string;
  period: string;
  colorHex: string;
  image: string; // URL ảnh áo đã tách nền
  description: string;
  tagline?: string;
  category?: 'nguyen' | 'ly-tran-le' | 'bac-bo' | 'nam-bo' | 'tan-thoi';
  categoryLabel?: string;
  material?: string;
  rarity?: string;
  details?: string[];
  historicalNote?: string;
  studioOutfitId?: OutfitId;
}

export const HERITAGE_OUTFITS: HeritageOutfit[] = [
  {
    id: 'ao-dai',
    name: 'Áo Dài Tân Thời',
    period: 'Thập niên 1930 - Nay',
    colorHex: '#C92828',
    image: '/assets/aodai.png',
    description: 'Tôn vinh đường nét thanh thoát giao hòa kim cổ, hai tà bay bổng.',
    tagline: 'Quốc phục thanh lịch giao hòa mỹ cảm Đông - Tây',
    category: 'tan-thoi',
    categoryLabel: 'Tân Thời',
    material: 'Lụa tơ tằm Hà Đông thêu hoa chỉ tơ',
    rarity: 'Biểu Tượng Quốc Gia',
    details: ['Cổ đứng cao 3cm', 'Hai tà trước sau xẻ ngang hông', 'Nút bấm chéo mạn sườn'],
    historicalNote: 'Khởi nguồn từ cuộc cải cách áo Lemur Cát Tường và Lê Phổ những năm 1930, tạo nên dáng áo dài kiêu sa cho phụ nữ tân thời.',
    studioOutfitId: 'aodai',
  },
  {
    id: 'ngu-than',
    name: 'Áo Ngũ Thân (Lập Lĩnh)',
    period: 'Thời Chúa Nguyễn & Nhà Nguyễn',
    colorHex: '#D49B26',
    image: '/assets/nguthan.png',
    description: 'Năm thân áo tượng trưng cho tứ thân phụ mẫu và chính bản thân.',
    tagline: 'Đạo làm người và chuẩn mực Nho giáo trong từng nếp áo',
    category: 'nguyen',
    categoryLabel: 'Triều Nguyễn',
    material: 'Gấm sa Hàn lượn vân mây vàng hoàng yến',
    rarity: 'Chuẩn Mực Sĩ Phu',
    details: ['5 thân vải ghép khéo léo', '5 khuy cài Ngũ Thường', 'Cổ lập lĩnh vuông vức'],
    historicalNote: 'Định hình từ chỉ dụ cải cách năm 1744 của Võ Vương Nguyễn Phúc Khoát và phổ cập toàn quốc dưới triều vua Minh Mạng.',
    studioOutfitId: 'nguthan',
  },
  {
    id: 'nhat-binh',
    name: 'Áo Nhật Bình',
    period: 'Triều Nhà Nguyễn (1802 - 1945)',
    colorHex: '#1D3B6F',
    image: '/assets/nhatbinh.png',
    description: 'Phẩm phục tôn quý chốn hoàng cung với cổ áo hình chữ nhật đặc trưng.',
    tagline: 'Đại triều hoàng tộc với viền ngũ sắc và thùy lưu cung đình',
    category: 'nguyen',
    categoryLabel: 'Triều Nguyễn',
    material: 'Đoạn bát ty dệt rồng phượng viền kim tuyến',
    rarity: 'Hoàng Tộc Vương Triều',
    details: ['Cổ áo chữ nhật ngũ sắc', 'Tay áo dải ngũ hành thùy lưu', 'Khuy ngọc cẩn vàng'],
    historicalNote: 'Thường phục tôn quý của Hoàng hậu, Công chúa và Cung tần triều Nguyễn, biểu trưng cho sự quang minh chính đại.',
    studioOutfitId: 'nhatbinh',
  },
  {
    id: 'tu-than',
    name: 'Áo Tứ Thân',
    period: 'Thế kỷ 12 - Thế kỷ 20',
    colorHex: '#4A2338',
    image: '/assets/tuthan.png',
    description: 'Nét đẹp mộc mạc, đoan trang của người phụ nữ Kinh Bắc.',
    tagline: 'Hồn nhiên Kinh Bắc gắn liền yếm đào và nón quai thao',
    category: 'bac-bo',
    categoryLabel: 'Kinh Bắc',
    material: 'Vải đũi tơ tằm dệt thô nhuộm củ nâu bùn sông',
    rarity: 'Hồn Quê Mộc Mạc',
    details: ['Bốn vạt áo buông lơi', 'Yếm đào thắm sắc', 'Váy đụp lụa đen huyền'],
    historicalNote: 'Trang phục cổ truyền mang đậm tinh thần lao động cần mẫn và vẻ đẹp dung dị trong các lễ hội dân gian miền Bắc.',
    studioOutfitId: 'tuthan',
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    period: 'Thế kỷ 19 - Nay',
    colorHex: '#2E5A44',
    image: '/assets/baba.png',
    description: 'Nét mộc mạc, hào sảng và phóng khoáng đậm chất sông nước phương Nam.',
    tagline: 'Hồn hậu miệt vườn, dịu dàng thanh thoát bên bờ kênh xanh',
    category: 'nam-bo',
    categoryLabel: 'Nam Bộ',
    material: 'Vải ú, the mỏng mát dệt thủ công',
    rarity: 'Dân Dã Phóng Khoáng',
    details: ['Cổ tròn mở nhẹ', 'Hàng cúc bấm trước ngực', 'Xẻ tà hai bên hông'],
    historicalNote: 'Giao thoa văn hóa đặc sắc phương Nam, trở thành biểu tượng kiên cường và nhân hậu của người dân miệt vườn Nam Bộ.',
    studioOutfitId: 'baba',
  },
  {
    id: 'giao-linh',
    name: 'Áo Giao Lĩnh (Tràng Vạt)',
    period: 'Thời Lý - Trần - Lê (TK 11 - 18)',
    colorHex: '#7C3F24',
    image: '/assets/giaolinh.png',
    description: 'Cổ phong trầm mặc thuở Lý - Trần - Lê với vạt áo bắt chéo thâm nghiêm.',
    tagline: 'Dấu ấn nghìn năm hưng thịnh của các triều đại tự chủ Đại Việt',
    category: 'ly-tran-le',
    categoryLabel: 'Lý - Trần - Lê',
    material: 'Lụa the dệt nổi vân kỷ hà và hoa sen',
    rarity: 'Cổ Phong Hoàng Kim',
    details: ['Vạt cổ chéo giao nhau', 'Tay thụng rộng tôn phong thái', 'Đai thắt lưng bản lớn'],
    historicalNote: 'Phục trang thịnh hành bậc nhất thời Lý - Trần - Hậu Lê, gắn liền phong thái uy nghiêm, tự tại của giới trí thức phong kiến.',
    studioOutfitId: 'giaolinh',
  },
];

// Web Audio sound synthesizer for hanger slides & clicks
class AudioRackSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {}

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playHangerHover() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio failure
    }
  }

  playHangerSelect() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore audio failure
    }
  }
}

const rackAudio = new AudioRackSynth();

// =====================================================================
// 2. SVG MINH HỌA ÁO TRUYỀN THỐNG TREO MÓC GỖ
// =====================================================================
interface GarmentGraphicProps {
  outfit: HeritageOutfit;
  isFrontFacing: boolean;
}

const GarmentGraphic: React.FC<GarmentGraphicProps> = ({ outfit, isFrontFacing }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const { id, colorHex, image } = outfit;

  // Nếu có ảnh thật và chưa lỗi tải ảnh, ưu tiên hiển thị ảnh thật
  if (image && !imageFailed) {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={outfit.name}
          onError={() => setImageFailed(true)}
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300 filter drop-shadow-xl"
          style={{
            transform: isFrontFacing ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 200 270"
      className="w-full h-full overflow-visible transition-all duration-300 pointer-events-none"
    >
      <defs>
        <linearGradient id={`silk-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colorHex} stopOpacity="0.88" />
          <stop offset="30%" stopColor={colorHex} stopOpacity="1" />
          <stop offset="50%" stopColor="#FFF" stopOpacity="0.25" />
          <stop offset="70%" stopColor={colorHex} stopOpacity="1" />
          <stop offset="100%" stopColor={colorHex} stopOpacity="0.82" />
        </linearGradient>

        <linearGradient id={`foldShadow-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* ÁO DÀI TÂN THỜI */}
      {id === 'ao-dai' && (
        <g>
          {/* Cổ đứng & ngực */}
          <path
            d="M 90 14 C 95 12 105 12 110 14 L 108 26 C 103 27 97 27 92 26 Z"
            fill="#FAF7F2"
            stroke="#8D1815"
            strokeWidth="1.2"
          />
          {/* Thân áo & Hai tà bay */}
          <path
            d="M 88 26 C 70 28 42 34 26 44 L 40 85 C 46 80 56 60 76 56 L 68 240 L 96 240 L 98 120 L 102 120 L 104 240 L 132 240 L 124 56 C 144 60 154 80 160 85 L 174 44 C 158 34 130 28 112 26 Z"
            fill={colorHex}
          />
          <path
            d="M 88 26 C 70 28 42 34 26 44 L 40 85 C 46 80 56 60 76 56 L 68 240 L 96 240 L 98 120 L 102 120 L 104 240 L 132 240 L 124 56 C 144 60 154 80 160 85 L 174 44 C 158 34 130 28 112 26 Z"
            fill={`url(#silk-${id})`}
            opacity="0.3"
          />
          {/* Quần lụa trắng ngà bên trong */}
          <path
            d="M 82 120 L 74 252 L 96 252 L 100 160 L 104 252 L 126 252 L 118 120 Z"
            fill="#FAF6EE"
            opacity="0.95"
          />
          {/* Đường chỉ may cúc chéo mạn sườn */}
          <path
            d="M 100 26 C 106 38 114 44 124 54"
            stroke="#FDE68A"
            strokeWidth="1.2"
            strokeDasharray="2,2"
            fill="none"
          />
          {/* Nếp gấp tà áo mềm mại */}
          <path d="M 85 60 Q 82 150 78 238" stroke="#000" strokeWidth="1" opacity="0.25" fill="none" />
          <path d="M 115 60 Q 118 150 122 238" stroke="#000" strokeWidth="1" opacity="0.25" fill="none" />
        </g>
      )}

      {/* ÁO NGŨ THÂN (LẬP LĨNH) */}
      {id === 'ngu-than' && (
        <g>
          {/* Cổ đứng lập lĩnh */}
          <path
            d="M 88 15 C 93 13 107 13 112 15 L 110 27 C 105 28 95 28 90 27 Z"
            fill="#FAF6EE"
            stroke="#78350F"
            strokeWidth="1.2"
          />
          <line x1="90" y1="16" x2="110" y2="16" stroke="#FAF7F2" strokeWidth="2" />
          {/* Khối áo chữ nhật rộng rãi, 5 thân nghiêm cẩn */}
          <path
            d="M 88 27 C 65 29 38 35 22 45 L 34 94 C 44 88 56 68 74 65 L 62 235 L 138 235 L 126 65 C 144 68 156 88 166 94 L 178 45 C 162 35 135 29 112 27 Z"
            fill={colorHex}
          />
          {/* Thân lót & hàng cúc 5 hạt kim loại */}
          <path d="M 102 27 L 102 235" stroke="#78350F" strokeWidth="1.8" />
          {[38, 70, 102, 134, 166].map((cy) => (
            <g key={cy}>
              <circle cx="102" cy={cy} r="3" fill="#D4AF37" stroke="#451A03" strokeWidth="0.8" />
              <circle cx="101" cy={cy - 1} r="1" fill="#FFF" />
            </g>
          ))}
          {/* Hai túi đắp dưới vạt */}
          <rect x="74" y="170" width="18" height="24" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <rect x="108" y="170" width="18" height="24" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          {/* Quần đen/trắng lót dưới */}
          <path
            d="M 72 235 L 70 252 L 96 252 L 100 235 L 104 235 L 104 252 L 130 252 L 128 235 Z"
            fill="#292524"
          />
        </g>
      )}

      {/* ÁO NHẬT BÌNH */}
      {id === 'nhat-binh' && (
        <g>
          {/* Thân áo rộng tôn quý */}
          <path
            d="M 85 24 C 60 26 32 34 16 45 L 28 108 C 42 100 56 75 74 70 L 64 240 L 136 240 L 126 70 C 144 75 158 100 172 108 L 184 45 C 168 34 140 26 115 24 Z"
            fill={colorHex}
          />
          {/* Cổ áo hình chữ nhật đặc trưng với dải hoa văn ngũ sắc */}
          <rect x="84" y="22" width="32" height="90" rx="2" fill="#EAB308" stroke="#92400E" strokeWidth="1.2" />
          <rect x="88" y="24" width="24" height="86" rx="1" fill="#DC2626" />
          {/* Họa tiết cổ ngực triều đình */}
          <circle cx="100" cy="40" r="4" fill="#FDE047" stroke="#92400E" strokeWidth="0.8" />
          <circle cx="100" cy="65" r="4" fill="#059669" stroke="#92400E" strokeWidth="0.8" />
          <circle cx="100" cy="90" r="4" fill="#2563EB" stroke="#92400E" strokeWidth="0.8" />
          {/* Tay áo thùy lưu ngũ sắc */}
          {[-12, -7, -2, 3, 8].map((offset, idx) => {
            const colors = ['#DC2626', '#EAB308', '#2563EB', '#059669', '#FAF7F2'];
            return (
              <g key={idx}>
                <line x1="22" y1={95 + offset} x2="34" y2={105 + offset} stroke={colors[idx]} strokeWidth="2.5" />
                <line x1="178" y1={95 + offset} x2="166" y2={105 + offset} stroke={colors[idx]} strokeWidth="2.5" />
              </g>
            );
          })}
          {/* Dải thùy lưu trước ngực buông rủ */}
          <rect x="94" y="112" width="12" height="80" fill="#DC2626" stroke="#EAB308" strokeWidth="1" />
        </g>
      )}

      {/* ÁO TỨ THÂN */}
      {id === 'tu-than' && (
        <g>
          {/* Yếm đào lót trong */}
          <path d="M 88 28 L 112 28 L 120 90 L 80 90 Z" fill="#DC2626" />
          <path d="M 89 26 Q 100 22 111 26" stroke="#FDE047" strokeWidth="2" fill="none" />
          {/* 4 Vạt áo nâu trầm buông lơi */}
          <path
            d="M 84 26 C 65 30 38 38 24 50 L 36 98 C 48 90 60 70 76 66 L 60 236 L 86 236 L 98 120 L 102 120 L 114 236 L 140 236 L 124 66 C 140 70 152 90 164 98 L 176 50 C 162 38 135 30 116 26 Z"
            fill={colorHex}
          />
          {/* Dải thắt lưng bao tượng & ruột tượng buông dài */}
          <rect x="76" y="90" width="48" height="12" rx="2" fill="#EAB308" />
          <path d="M 92 102 L 86 160 L 94 160 L 98 102 Z" fill="#F59E0B" />
          <path d="M 100 102 L 104 175 L 112 175 L 106 102 Z" fill="#DC2626" />
          {/* Chân váy đụp lụa đen huyền */}
          <path d="M 72 135 L 64 248 L 136 248 L 128 135 Z" fill="#1C1917" opacity="0.9" />
        </g>
      )}

      {/* ÁO BÀ BA */}
      {id === 'ao-ba-ba' && (
        <g>
          {/* Cổ tròn mở nhẹ */}
          <path d="M 88 24 Q 100 32 112 24" stroke="#FAF7F2" strokeWidth="2" fill="none" />
          {/* Thân áo ngắn dáng ôm gọn */}
          <path
            d="M 86 25 C 68 28 42 34 28 44 L 40 90 C 50 84 62 68 76 64 L 70 190 L 130 190 L 124 64 C 138 68 150 84 160 90 L 172 44 C 158 34 132 28 114 25 Z"
            fill={colorHex}
          />
          {/* Đường cúc bấm ngực giữa */}
          <line x1="100" y1="28" x2="100" y2="190" stroke="#134E4A" strokeWidth="1.5" />
          {[42, 65, 88, 111, 134, 157, 180].map((cy) => (
            <circle key={cy} cx="100" cy={cy} r="2.2" fill="#FAF5E8" stroke="#042F2E" strokeWidth="0.8" />
          ))}
          {/* 2 Túi đắp Nam Bộ */}
          <rect x="76" y="152" width="16" height="20" rx="2" fill="#1F4736" stroke="#0F2D21" strokeWidth="0.8" />
          <rect x="108" y="152" width="16" height="20" rx="2" fill="#1F4736" stroke="#0F2D21" strokeWidth="0.8" />
          {/* Quần lụa đen Nam Bộ thả dài */}
          <path
            d="M 80 190 L 74 252 L 96 252 L 100 205 L 104 252 L 126 252 L 120 190 Z"
            fill="#1E293B"
          />
        </g>
      )}

      {/* ÁO GIAO LĨNH */}
      {id === 'giao-linh' && (
        <g>
          {/* Cổ chéo vạt giao nhau */}
          <path
            d="M 84 22 C 60 25 32 32 16 42 L 30 102 C 44 94 58 72 74 68 L 62 242 L 138 242 L 126 68 C 142 72 156 94 170 102 L 184 42 C 168 32 140 25 116 22 Z"
            fill={colorHex}
          />
          {/* Nẹp viền cổ áo bản to bắt chéo qua ngực */}
          <path d="M 82 22 L 100 65 L 124 24" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 76 24 L 100 70 L 130 115" stroke="#FAF7F2" strokeWidth="2" fill="none" />
          {/* Đai thắt lưng lụa bản to thời Lý - Trần */}
          <rect x="76" y="120" width="48" height="14" rx="2" fill="#065F46" />
          <rect x="94" y="121" width="12" height="12" rx="1" fill="#FDE68A" />
          <path d="M 97 134 L 95 185 L 105 185 L 103 134 Z" fill="#047857" />
        </g>
      )}
    </svg>
  );
};

// =====================================================================
// 3. MAIN COMPONENT: "ThanhTreoCoPhuc" (INTERACTIVE HERITAGE RACK)
// =====================================================================
export interface ThanhTreoCoPhucProps {
  onSelectOutfit?: (outfit: HeritageOutfit) => void;
  onExploreKnowledge?: (outfit: HeritageOutfit) => void;
  className?: string;
  autoFocusFirst?: boolean;
}

export const ThanhTreoCoPhuc: React.FC<ThanhTreoCoPhucProps> = ({
  onSelectOutfit,
  onExploreKnowledge,
  className = '',
  autoFocusFirst = false,
}) => {
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(
    autoFocusFirst ? HERITAGE_OUTFITS[0].id : null
  );
  // Hovered index để tính toán hiệu ứng đẩy (Push effect)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [inspectModalOutfit, setInspectModalOutfit] = useState<HeritageOutfit | null>(null);
  const [active3DOutfit, setActive3DOutfit] = useState<HeritageOutfit | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const rackScrollRef = useRef<HTMLDivElement>(null);

  // Sync sound settings
  useEffect(() => {
    rackAudio.setMuted(!isSoundEnabled);
  }, [isSoundEnabled]);

  // Filter outfits
  const filteredOutfits = useMemo(() => {
    if (activeFilter === 'all') return HERITAGE_OUTFITS;
    return HERITAGE_OUTFITS.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  // Active outfit object
  const currentSelectedOutfit = useMemo(() => {
    return HERITAGE_OUTFITS.find((o) => o.id === selectedOutfitId) || null;
  }, [selectedOutfitId]);

  // Cuộn giá treo mượt mà
  const handleScrollRack = (direction: 'left' | 'right') => {
    if (!rackScrollRef.current) return;
    rackAudio.playHangerHover();
    const scrollDelta = 260;
    rackScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollDelta : scrollDelta,
      behavior: 'smooth',
    });
  };

  // Handle select outfit
  const handleSelect = (outfit: HeritageOutfit) => {
    rackAudio.playHangerSelect();
    setSelectedOutfitId(outfit.id);
    onSelectOutfit?.(outfit);
  };

  // Quick categories
  const categories = [
    { key: 'all', label: 'Tất Cả (6 Dáng)' },
    { key: 'nguyen', label: 'Triều Nguyễn' },
    { key: 'ly-tran-le', label: 'Lý - Trần - Lê' },
    { key: 'bac-bo', label: 'Kinh Bắc' },
    { key: 'nam-bo', label: 'Nam Bộ' },
    { key: 'tan-thoi', label: 'Tân Thời' },
  ];

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#F9F6F0] via-[#F2ECE1] to-[#E5DAC8] border border-stone-200/90 shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6 ${className}`}
      style={{ perspective: '1200px' }}
      ref={containerRef}
    >
      {/* =================================================================
          A. HEADER BAR CỦA GIÁ TREO THỜI TRANG ATELIER
         ================================================================= */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-300/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8D1815]">
            <Compass className="w-4 h-4 text-[#C82A27]" />
            <span>ATELIER DI SẢN · 3D HERITAGE WARDROBE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-0.5">
            Thanh Treo Cổ Phục Tương Tác
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5">
            Các áo treo nghiêng xếp lớp dọc theo thanh ray. Rê chuột vào để áo bung thẳng và dạt các áo khác sang hai bên.
          </p>
        </div>

        {/* Cụm công cụ: Lọc thời kỳ & Âm thanh & Điều hướng thanh treo */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
          {/* Nút bật/tắt âm thanh sột soạt/kim loại */}
          <button
            type="button"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
              isSoundEnabled
                ? 'bg-amber-100/80 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
            title={isSoundEnabled ? 'Tắt âm thanh tương tác' : 'Bật âm thanh tương tác'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Nút cuộn thanh treo Trái/Phải */}
          <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md p-1 rounded-full border border-stone-200 shadow-xs">
            <button
              type="button"
              onClick={() => handleScrollRack('left')}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-700 hover:text-[#8D1815] transition-colors cursor-pointer"
              title="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollRack('right')}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-stone-700 hover:text-[#8D1815] transition-colors cursor-pointer"
              title="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER PILLS THEO THỜI KỲ */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              rackAudio.playHangerHover();
              setActiveFilter(cat.key);
              setHoveredIndex(null);
            }}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === cat.key
                ? 'bg-[#8D1815] text-white shadow-xs font-semibold'
                : 'bg-white/70 hover:bg-white text-stone-700 border border-stone-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* =================================================================
          B. KHUNG GIÁ TREO QUẦN ÁO 3D / 2.5D (THE CLOTHING RACK STAGE)
         ================================================================= */}
      <div className="relative w-full pt-14 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#ECE1D0] rounded-3xl border border-amber-900/25 overflow-hidden shadow-xl">
        {/* 1. THANH ĐÒN TREO KIM LOẠI ĐỒNG THAU BÓNG BẨY (METALLIC BRASS RAIL) */}
        <div className="absolute top-16 left-2 right-2 z-30 pointer-events-none">
          {/* Cột đỡ 2 bên trần */}
          <div className="absolute -top-16 left-8 w-3 h-16 bg-gradient-to-r from-amber-900 via-amber-600 to-amber-950 rounded-sm shadow-md" />
          <div className="absolute -top-16 right-8 w-3 h-16 bg-gradient-to-r from-amber-900 via-amber-600 to-amber-950 rounded-sm shadow-md" />

          {/* Chốt chặn tròn mạ vàng hai đầu xà */}
          <div className="absolute -left-1 -top-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-900 border border-amber-600 shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-100" />
          </div>
          <div className="absolute -right-1 -top-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-900 border border-amber-600 shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-100" />
          </div>

          {/* Thanh xà ngang chính */}
          <div className="w-full h-3.5 rounded-full bg-gradient-to-r from-amber-900 via-amber-300 via-yellow-100 via-amber-400 to-amber-900 shadow-[0_4px_12px_rgba(120,53,15,0.45)] border-y border-amber-500/70" />

          {/* Vệt bóng đổ dưới thanh xà */}
          <div className="w-full h-2.5 bg-gradient-to-b from-stone-900/20 to-transparent blur-xs mt-0.5" />
        </div>

        {/* 2. KHU VỰC CÁC BỘ CỔ PHỤC TREO TRÊN THANH (3D SIDE-HUNG SLIDER WITH PUSH EFFECT) */}
        <div
          ref={rackScrollRef}
          onMouseLeave={() => setHoveredIndex(null)}
          className="flex items-start overflow-x-auto no-scrollbar scroll-smooth pt-8 pb-4 px-8 sm:px-16 cursor-grab active:cursor-grabbing min-h-[460px]"
          style={{
            perspective: '1400px',
            perspectiveOrigin: '50% 30%',
          }}
        >
          {filteredOutfits.map((outfit, index) => {
            const isHovered = hoveredIndex === index;
            const isSelected = selectedOutfitId === outfit.id;

            // Tính toán hiệu ứng đẩy (Push effect) khi có item được hover:
            // - Item trước item hovered: dịch sang trái (x: -50px)
            // - Item sau item hovered: dịch sang phải (x: +50px)
            // - Item đang hovered: bung rộng (width: 240px, scale: 1.15, transform bung mặt trước)
            let pushX = 0;
            if (hoveredIndex !== null) {
              if (index < hoveredIndex) {
                const dist = hoveredIndex - index;
                pushX = -Math.min(65, 45 + (3 - Math.min(dist, 2)) * 10);
              } else if (index > hoveredIndex) {
                const dist = index - hoveredIndex;
                pushX = Math.min(65, 45 + (3 - Math.min(dist, 2)) * 10);
              }
            }

            // Z-index: khi hover có z-index cao nhất (50).
            // Bình thường, xếp lớp nối tiếp nhau từ trái sang phải hoặc từ phải sang trái.
            const calculatedZIndex = isHovered
              ? 50
              : isSelected
              ? 30
              : 20 - index;

            return (
              <motion.div
                key={outfit.id}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  rackAudio.playHangerHover();
                }}
                onClick={() => handleSelect(outfit)}
                animate={{
                  x: pushX,
                  width: isHovered ? 240 : 100,
                  zIndex: calculatedZIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 26,
                  mass: 0.8,
                }}
                className={`shrink-0 flex flex-col items-center group cursor-pointer relative select-none transition-all ${
                  index !== 0 ? '-ml-7 sm:-ml-9' : ''
                }`}
                style={{
                  height: '420px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* KHUNG BIẾN HÌNH ÁO (TRANSFORM 3D CONTAINER)
                    - Treo bình thường: nghiêng 60 độ, skewY, scaleX 0.55 để tạo độ nghiêng dọc theo thanh ray.
                    - Khi hover: bung thẳng 0 độ, scaleX 1, scale 1.15, nâng lên y: -18px
                */}
                <motion.div
                  className="w-full flex flex-col items-center relative"
                  style={{
                    transformOrigin: 'top left',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                  animate={{
                    rotateY: isHovered ? 0 : -18,
                    skewY: isHovered ? 0 : -3,
                    scaleX: 1,
                    scale: isHovered ? 1.12 : 1,
                    y: isSelected ? -24 : isHovered ? -16 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 320,
                    damping: 24,
                  }}
                >
                  {/* Tag Kraft Vintage treo trên mắc áo */}
                  <motion.div
                    animate={{
                      rotate: isHovered ? [0, 4, -3, 0] : 4,
                      opacity: isHovered ? 1 : 0.85,
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: isHovered ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    className="absolute right-1 top-8 z-30 bg-[#FAF6EE] text-[#451A03] border border-[#D4AF37]/70 rounded-xs shadow-xs px-1.5 py-0.5 text-[8px] font-mono tracking-tight pointer-events-none flex flex-col items-center"
                  >
                    <span className="text-[6.5px] text-[#8D1815] font-bold uppercase tracking-wider border-b border-stone-300 pb-0.5">
                      DI SẢN
                    </span>
                    <span className="font-bold text-[8px] mt-0.5 text-stone-800">
                      #{outfit.id.slice(0, 3).toUpperCase()}
                    </span>
                  </motion.div>

                  {/* Vòng hào quang khi đã chọn */}
                  {isSelected && (
                    <motion.div
                      layoutId="rackActiveGlow"
                      className="absolute -inset-2 rounded-2xl bg-amber-400/25 border-2 border-[#D4AF37] pointer-events-none blur-xs z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}

                  {/* Badge Active "ĐÃ CHỌN" */}
                  {isSelected && (
                    <div className="absolute -top-3 z-40 px-2.5 py-0.5 rounded-full bg-[#8D1815] text-white text-[10px] font-bold shadow-md flex items-center gap-1 border border-amber-300">
                      <Check className="w-3 h-3 text-amber-300" />
                      <span>ĐÃ CHỌN</span>
                    </div>
                  )}

                  {/* Khuyên treo đồng thau thanh nhã nối với xà ngang (loại bỏ móc gỗ thô che cổ) */}
                  <div className="w-6 h-6 z-20 flex flex-col items-center justify-start pointer-events-none mb-1">
                    <div className="w-3.5 h-4 rounded-full border-2 border-amber-400 bg-amber-950/40 shadow-xs" />
                    <div className="w-[1.5px] h-2 bg-gradient-to-b from-amber-400 to-amber-600" />
                  </div>

                  {/* Dáng Áo Cổ Phục Rủ Xuống */}
                  <div
                    className="w-52 sm:w-56 h-72 sm:h-80 -mt-2 z-15 flex items-center justify-center transition-all duration-300"
                    style={{
                      filter: isSelected
                        ? 'drop-shadow(0 14px 22px rgba(200, 42, 39, 0.35))'
                        : isHovered
                        ? 'drop-shadow(0 14px 22px rgba(0, 0, 0, 0.3))'
                        : 'drop-shadow(-8px 6px 12px rgba(0, 0, 0, 0.22))',
                    }}
                  >
                    <GarmentGraphic outfit={outfit} isFrontFacing={isHovered} />
                  </div>

                  {/* Vệt bóng đổ dưới sàn nhà */}
                  <div
                    className="w-28 sm:w-36 h-3.5 rounded-full bg-stone-900/20 blur-[5px] transition-all duration-300 mt-1"
                    style={{
                      transform: isHovered ? 'scale(1) translateY(8px)' : 'scale(0.65) translateY(0)',
                      opacity: isHovered ? 0.25 : 0.4,
                    }}
                  />
                </motion.div>

                {/* THÔNG TIN NHÃN DƯỚI ĐÁY KHI HOVER HOẶC CHỌN */}
                <div
                  className={`mt-2 text-center space-y-1 w-full px-1 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-70 sm:opacity-0 -translate-y-1'
                  }`}
                >
                  <div className="font-display font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#8D1815] truncate">
                    {outfit.name}
                  </div>
                  <div className="text-[10.5px] font-serif italic text-stone-500 truncate">
                    {outfit.period}
                  </div>

                  {/* Cụm nút hành động nhanh khi hover */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-1.5 flex items-center justify-center gap-1.5"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectModalOutfit(outfit);
                          onExploreKnowledge?.(outfit);
                        }}
                        className="px-2 py-0.5 rounded-full bg-white/95 hover:bg-white text-stone-700 text-[11px] font-medium border border-stone-300 shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                        title="Xem chi tiết khảo cứu"
                      >
                        <Eye className="w-3 h-3 text-amber-700" />
                        <span>Xem</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(outfit);
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-[#8D1815] hover:bg-[#A8221F] text-white text-[11px] font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Thử</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =================================================================
          C. THẺ THÔNG TIN TÓM TẮT CỦA CỔ PHỤC ĐANG CHỌN (HERITAGE SHOWCASE BANNER)
         ================================================================= */}
      <AnimatePresence mode="wait">
        {currentSelectedOutfit && (
          <motion.div
            key={currentSelectedOutfit.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/90 p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#8D1815]/10 text-[#8D1815] text-[11px] font-bold">
                  {currentSelectedOutfit.categoryLabel}
                </span>
                <span className="text-xs font-serif italic text-stone-500">
                  {currentSelectedOutfit.period}
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-xs"
                  style={{ backgroundColor: currentSelectedOutfit.colorHex }}
                  title="Sắc màu chủ đạo"
                />
              </div>

              <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900">
                {currentSelectedOutfit.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-serif italic">
                {currentSelectedOutfit.description}
              </p>

              {/* Tag chi tiết */}
              {currentSelectedOutfit.details && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {currentSelectedOutfit.details.map((dt, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                    >
                      • {dt}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Cụm nút hành động chính */}
            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setActive3DOutfit(currentSelectedOutfit)}
                className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs sm:text-sm font-bold border border-amber-300 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Xem mô hình 3D xoay 360 độ từ Meshy AI"
              >
                <Rotate3D className="w-4 h-4 text-[#8D1815]" />
                <span>Mô Hình 3D</span>
              </button>

              <button
                type="button"
                onClick={() => setInspectModalOutfit(currentSelectedOutfit)}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Info className="w-4 h-4 text-stone-600" />
                <span>Khảo Cứu Lịch Sử</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectOutfit?.(currentSelectedOutfit)}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#8D1815] hover:bg-[#A8221F] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Đưa Vào Thử Đồ Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================================
          D. MODAL XEM CHI TIẾT KHẢO CỨU CỔ PHỤC (INSPECT MODAL)
         ================================================================= */}
      <AnimatePresence>
        {inspectModalOutfit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 overflow-hidden space-y-6"
            >
              {/* Nút đóng modal */}
              <button
                type="button"
                onClick={() => setInspectModalOutfit(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8D1815]">
                  <Shirt className="w-4 h-4 text-[#C82A27]" />
                  <span>CHI TIẾT DI SẢN PHỤC TRANG</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-stone-900">
                  {inspectModalOutfit.name}
                </h3>
                <div className="text-xs font-serif italic text-stone-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{inspectModalOutfit.period}</span>
                </div>
              </div>

              {/* Thông tin cốt lõi */}
              <div className="space-y-3 bg-white rounded-2xl p-4 border border-stone-200/80">
                <div>
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                    Ý nghĩa & Triết lý:
                  </span>
                  <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-1 leading-relaxed">
                    {inspectModalOutfit.description}
                  </p>
                </div>

                {inspectModalOutfit.historicalNote && (
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                      Khảo cứu lịch sử:
                    </span>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                      {inspectModalOutfit.historicalNote}
                    </p>
                  </div>
                )}

                {inspectModalOutfit.material && (
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 font-medium">Chất liệu truyền thống:</span>
                    <span className="font-semibold text-stone-800">{inspectModalOutfit.material}</span>
                  </div>
                )}
              </div>

              {/* Cụm nút hành động */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const outfitTo3D = inspectModalOutfit;
                    setInspectModalOutfit(null);
                    setActive3DOutfit(outfitTo3D);
                  }}
                  className="py-3 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Xem mô hình 3D xoay 360 độ"
                >
                  <Rotate3D className="w-4 h-4 text-stone-950" />
                  <span>Xem 3D</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectModalOutfit(null)}
                  className="flex-1 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSelect(inspectModalOutfit);
                    setInspectModalOutfit(null);
                    onSelectOutfit?.(inspectModalOutfit);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#8D1815] hover:bg-[#A8221F] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Thử Trang Phục Này</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL XEM MÔ HÌNH 3D (.GLB) TỪ MESHY AI */}
      {active3DOutfit && (
        <HeritageModelViewer
          initialOutfitId={active3DOutfit.studioOutfitId || 'nhatbinh'}
          isModal={true}
          onClose={() => setActive3DOutfit(null)}
          onSelectForStudio={(studioId) => {
            setActive3DOutfit(null);
            const foundOutfit = HERITAGE_OUTFITS.find((o) => o.studioOutfitId === studioId);
            if (foundOutfit) {
              handleSelect(foundOutfit);
            }
          }}
        />
      )}
    </div>
  );
};

export default ThanhTreoCoPhuc;
