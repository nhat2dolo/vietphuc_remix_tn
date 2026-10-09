import React, { useState, useRef, useEffect } from 'react';
import {
  Rotate3D,
  RotateCcw,
  Sparkles,
  Maximize2,
  X,
  Volume2,
  VolumeX,
  Layers,
  Info,
  Compass,
  Check,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { OutfitId } from '../types/vietphuc';
import { OUTFITS } from '../data/vietphucData';

// Khai báo TypeScript cho Web Component <model-viewer>
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            src?: string;
            alt?: string;
            'camera-controls'?: boolean | string;
            'auto-rotate'?: boolean | string;
            'auto-rotate-delay'?: number | string;
            'rotation-per-second'?: string;
            'shadow-intensity'?: number | string;
            'shadow-softness'?: number | string;
            'exposure'?: number | string;
            'camera-orbit'?: string;
            'min-camera-orbit'?: string;
            'max-camera-orbit'?: string;
            'field-of-view'?: string;
            poster?: string;
            loading?: 'auto' | 'lazy' | 'eager';
            ar?: boolean | string;
            'ar-modes'?: string;
            'ar-scale'?: string;
            'environment-image'?: string;
            'seamless-poster'?: boolean | string;
          },
          HTMLElement
        >;
      }
    }
  }
}

export interface Heritage3DModelConfig {
  id: OutfitId;
  name: string;
  dynasty: string;
  glbSrc: string;
  fallbackGlbSrc?: string;
  posterSrc?: string;
  accentColor: string;
  badge: string;
  description: string;
  meshyPromptCitation: string;
}

// Danh mục mô hình 3D cổ phục Meshy AI (.glb)
export const HERITAGE_3D_CATALOG: Record<OutfitId, Heritage3DModelConfig> = {
  nhatbinh: {
    id: 'nhatbinh',
    name: 'Áo Nhật Bình Hoàng Gia Triều Nguyễn',
    dynasty: 'Thời Nguyễn (1802 - 1945)',
    glbSrc: '/models/nhatbinh.glb',
    fallbackGlbSrc: '/models/heritage-fallback.glb',
    posterSrc: '/assets/nhatbinh.png',
    accentColor: '#1F4F89',
    badge: 'Phẩm Phục Hoàng Tộc',
    description: 'Chiếc áo Nhật Bình cung đình triều Nguyễn lộng lẫy với cổ áo thêu hoa văn ngũ sắc viền vàng kim, tà áo thùy lưu dài trang nhã biểu trưng cho sự quang minh chính đại.',
    meshyPromptCitation: 'Meshy AI Gen-3: "Traditional Vietnamese Royal Nhat Binh Court Dress, Nguyen Dynasty Empress Robe, elaborate gold embroidery, silk textures, 8k PBR".',
  },
  nguthan: {
    id: 'nguthan',
    name: 'Áo Ngũ Thân Lập Lĩnh (Nam Phục & Nữ Phục)',
    dynasty: 'Chúa Nguyễn & Triều Nguyễn',
    glbSrc: '/models/nguthan.glb',
    fallbackGlbSrc: '/models/heritage-fallback.glb',
    posterSrc: '/assets/nguthan.png',
    accentColor: '#D49B26',
    badge: 'Chuẩn Mực Sĩ Phu',
    description: 'Áo Ngũ Thân 5 thân đại diện tứ thân phụ mẫu và thân con, 5 khuy cài tượng trưng Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
    meshyPromptCitation: 'Meshy AI: "Traditional Vietnamese Ngu Than robe, upright lap linh collar, 5 buttons, authentic silk damask, museum quality".',
  },
  aodai: {
    id: 'aodai',
    name: 'Áo Dài Tân Thời Duyên Dáng',
    dynasty: 'Thập niên 1930 - Nay',
    glbSrc: '/models/aodai.glb',
    fallbackGlbSrc: '/models/heritage-fallback.glb',
    posterSrc: '/assets/aodai.png',
    accentColor: '#C92828',
    badge: 'Quốc Phục Đương Đại',
    description: 'Thiết kế tôn vinh vóc dáng thanh xuân Việt Nam, hai tà áo thướt tha kết hợp quần lụa trắng thanh lịch.',
    meshyPromptCitation: 'Meshy AI: "Vietnamese Ao Dai flowing silk gown, crimson red silk, golden embroidery, modern 3D drape".',
  },
  giaolinh: {
    id: 'giaolinh',
    name: 'Áo Giao Lĩnh (Tràng Vạt Quý Tộc)',
    dynasty: 'Thời Lý - Trần - Hậu Lê',
    glbSrc: '/models/giaolinh.glb',
    fallbackGlbSrc: '/models/heritage-fallback.glb',
    posterSrc: '/assets/giaolinh.png',
    accentColor: '#7C3F24',
    badge: 'Cổ Phong Hoàng Kim',
    description: 'Vạt áo vắt chéo cổ kính thâm nghiêm thời Lý - Trần - Lê, biểu tượng của tri thức và phong thái đại nhân.',
    meshyPromptCitation: 'Meshy AI: "Ancient Vietnamese Giao Linh cross-collar silk robe, Ly Tran dynasty scholar attire".',
  },
  tuthan: {
    id: 'tuthan',
    name: 'Áo Tứ Thân & Yếm Đào Kinh Bắc',
    dynasty: 'Đồng Bằng Bắc Bộ',
    glbSrc: '/models/tuthan.glb',
    fallbackGlbSrc: '/models/heritage-fallback.glb',
    posterSrc: '/assets/tuthan.png',
    accentColor: '#4A2338',
    badge: 'Hồn Nhiên Dân Gian',
    description: 'Bốn vạt áo buông lơi hoặc buộc thắt tao nhã, hòa cùng sắc yếm đào thắm và khăn mỏ quạ đậm nét dân ca.',
    meshyPromptCitation: 'Meshy AI: "Traditional Vietnamese Tu Than four-panel folk dress with pink yem halter top and silk skirt".',
  },
  baba: {
    id: 'baba',
    name: 'Áo Bà Ba Nam Bộ Hồn Hậu',
    dynasty: 'Miệt Vườn Phương Nam',
    glbSrc: '/models/baba.glb',
    fallbackGlbSrc: '/models/heritage-fallback.glb',
    posterSrc: '/assets/baba.png',
    accentColor: '#2E5A44',
    badge: 'Phóng Khoáng Miệt Vườn',
    description: 'Thiết kế giản dị, xẻ tà hai bên hông tạo sự phóng khoáng, thoải mái đậm chất phù sa châu thổ Cửu Long.',
    meshyPromptCitation: 'Meshy AI: "Vietnamese Ba Ba southern blouse, comfortable linen cotton, emerald green, authentic peasant aesthetic".',
  },
};

export interface HeritageModelViewerProps {
  modelSrc?: string;
  initialOutfitId?: OutfitId;
  title?: string;
  subtitle?: string;
  isModal?: boolean;
  onClose?: () => void;
  onSelectForStudio?: (id: OutfitId) => void;
}

export const HeritageModelViewer: React.FC<HeritageModelViewerProps> = ({
  modelSrc,
  initialOutfitId = 'nhatbinh',
  title,
  subtitle,
  isModal = false,
  onClose,
  onSelectForStudio,
}) => {
  const [activeOutfitId, setActiveOutfitId] = useState<OutfitId>(initialOutfitId);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modelLoadError, setModelLoadError] = useState<boolean>(false);
  const [currentCameraOrbit, setCurrentCameraOrbit] = useState<string>('0deg 75deg 105%');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCitation, setShowCitation] = useState<boolean>(false);

  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const modelViewerElementRef = useRef<HTMLElement | null>(null);

  const activeConfig = HERITAGE_3D_CATALOG[activeOutfitId] || HERITAGE_3D_CATALOG.nhatbinh;
  const activeOutfitMeta = OUTFITS[activeOutfitId];

  // Resolve source: ưu tiên prop `modelSrc` nếu có, sau đó đến file glb local, và fallback nếu cần
  const effectiveModelSrc = modelSrc || (modelLoadError && activeConfig.fallbackGlbSrc ? activeConfig.fallbackGlbSrc : activeConfig.glbSrc);

  // Lắng nghe sự kiện load của model-viewer Web Component
  useEffect(() => {
    setIsLoading(true);
    setModelLoadError(false);

    const viewer = modelViewerElementRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      setIsLoading(false);
      setModelLoadError(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setModelLoadError(true);
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
    };
  }, [effectiveModelSrc, activeOutfitId]);

  // Điều khiển góc xoay camera về góc chuẩn
  const handleResetCamera = (angle: 'front' | 'side' | 'back' | 'top' = 'front') => {
    const viewer = modelViewerElementRef.current as any;
    let orbit = '0deg 75deg 105%';
    if (angle === 'front') orbit = '0deg 75deg 105%';
    if (angle === 'side') orbit = '90deg 75deg 105%';
    if (angle === 'back') orbit = '180deg 75deg 105%';
    if (angle === 'top') orbit = '0deg 20deg 115%';

    setCurrentCameraOrbit(orbit);
    if (viewer && viewer.cameraOrbit !== undefined) {
      viewer.cameraOrbit = orbit;
    }
  };

  const toggleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const content = (
    <div
      ref={viewerContainerRef}
      className={`relative flex flex-col w-full h-full rounded-3xl overflow-hidden border border-stone-300/80 bg-gradient-to-b from-[#1C1A17] via-[#26231F] to-[#12100E] text-stone-100 shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : ''
      }`}
    >
      {/* 1. TOP BAR: Tiêu đề, thông tin phục trang & nút đóng */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-stone-700/60 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8D1815] to-[#C82A27] flex items-center justify-center shadow-lg border border-amber-400/30">
            <Rotate3D className="w-5 h-5 text-amber-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {activeConfig.badge}
              </span>
              <span className="text-xs text-stone-400 font-serif">
                {activeConfig.dynasty}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-bold text-white tracking-tight mt-0.5">
              {title || activeConfig.name}
            </h3>
          </div>
        </div>

        {/* Cụm công cụ điều khiển trên Top Bar */}
        <div className="flex items-center gap-2">
          {/* Nút xem nguồn Meshy AI Prompt */}
          <button
            type="button"
            onClick={() => setShowCitation(!showCitation)}
            className="px-2.5 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Xem thông tin tái tạo từ Meshy AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Meshy 3D AI</span>
          </button>

          {/* Nút Phóng to / Toàn màn hình */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 flex items-center justify-center border border-stone-700 transition-all cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Nút Đóng Modal nếu được gọi trong Modal */}
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/50 flex items-center justify-center transition-all cursor-pointer ml-1"
              title="Đóng cửa sổ 3D"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. TAB LỰA CHỌN 6 DÁNG CỔ PHỤC 3D NHANH */}
      <div className="relative z-20 px-4 py-2.5 bg-black/30 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 whitespace-nowrap flex items-center gap-1 pl-1 pr-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Mô hình:</span>
        </span>
        {Object.values(HERITAGE_3D_CATALOG).map((item) => {
          const isSelected = item.id === activeOutfitId;
          return (
            <button
              key={item.id}
              onClick={() => setActiveOutfitId(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#8D1815] to-[#C82A27] text-white border-amber-400/60 shadow-md scale-102 font-bold'
                  : 'bg-stone-800/60 hover:bg-stone-700/80 text-stone-300 border-stone-700/60 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.accentColor }}
              />
              <span>{item.name.split(' (')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 3. KHU VỰC CANVAS 3D MODEL VIEWER */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] md:min-h-[520px] w-full flex items-center justify-center overflow-hidden bg-radial from-stone-800/40 via-stone-900/90 to-[#0e0d0c]">
        {/* Subtle royal background glow pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#E5A93C_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* GOOGLE MODEL-VIEWER WEB COMPONENT */}
        <model-viewer
          ref={modelViewerElementRef as any}
          src={effectiveModelSrc}
          poster={activeConfig.posterSrc}
          alt={`Mô hình 3D ${activeConfig.name}`}
          camera-controls="true"
          auto-rotate={autoRotate ? "true" : undefined}
          auto-rotate-delay="1000"
          rotation-per-second="25deg"
          shadow-intensity="1.5"
          shadow-softness="0.8"
          exposure="1.15"
          camera-orbit={currentCameraOrbit}
          min-camera-orbit="auto auto 50%"
          max-camera-orbit="auto auto 200%"
          loading="eager"
          ar="true"
          ar-modes="webxr scene-viewer quick-look"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '380px',
            backgroundColor: 'transparent',
            outline: 'none',
          }}
        >
          {/* Loading Slot fallback */}
          {isLoading && (
            <div slot="poster" className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-amber-200 gap-3 z-30">
              <div className="w-12 h-12 rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold tracking-wider font-sans">
                Đang nạp mô hình 3D cổ phục GLB...
              </p>
            </div>
          )}
        </model-viewer>

        {/* FLOATING CONTROL BAR: Góc nhìn nhanh & Xoay 360 & Đặt lại */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Tắt / Bật Auto Rotate */}
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-2 rounded-2xl backdrop-blur-md border text-xs font-semibold transition-all duration-200 shadow-lg flex items-center gap-1.5 cursor-pointer ${
              autoRotate
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                : 'bg-black/60 text-stone-300 border-stone-700/80 hover:bg-black/80'
            }`}
            title="Bật/Tắt tự động xoay 360°"
          >
            <Rotate3D className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">{autoRotate ? 'Dừng Xoay' : 'Tự Xoay'}</span>
          </button>

          {/* Đặt lại góc chính diện */}
          <button
            type="button"
            onClick={() => handleResetCamera('front')}
            className="px-3 py-2 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-stone-700/80 text-stone-200 text-xs font-semibold transition-all duration-200 shadow-lg flex items-center gap-1.5 cursor-pointer"
            title="Xem góc chính diện"
          >
            <RotateCcw className="w-4 h-4 text-stone-400" />
            <span className="hidden sm:inline">Chính diện</span>
          </button>

          {/* Xem góc nghiêng 90 độ */}
          <button
            type="button"
            onClick={() => handleResetCamera('side')}
            className="px-3 py-2 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-stone-700/80 text-stone-200 text-xs font-semibold transition-all duration-200 shadow-lg flex items-center gap-1.5 cursor-pointer"
            title="Xem góc nhìn bên sườn"
          >
            <Compass className="w-4 h-4 text-stone-400" />
            <span className="hidden sm:inline">Mạn sườn</span>
          </button>
        </div>

        {/* HƯỚNG DẪN TƯƠNG TÁC TẠI CHÂN CANVAS (FLOATING HINT) */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <div className="px-3.5 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-stone-700/60 text-[11px] text-stone-300 flex items-center gap-2 shadow-lg">
            <span className="text-amber-400 text-xs">✨</span>
            <span>Giữ chuột / ngón tay để <strong>xoay 360°</strong> · Cuộn để <strong>zoom</strong></span>
          </div>
        </div>

        {/* POPUP THÔNG TIN MESHY AI PROMPT NẾU BẬT */}
        {showCitation && (
          <div className="absolute inset-x-4 top-4 z-30 p-4 rounded-2xl bg-stone-900/95 backdrop-blur-md border border-amber-400/50 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Quy trình tái tạo 3D bằng Meshy AI (Text-to-3D)</span>
              </div>
              <button
                onClick={() => setShowCitation(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-mono bg-black/50 p-2.5 rounded-xl border border-stone-800">
              {activeConfig.meshyPromptCitation}
            </p>
            <p className="text-[11px] text-stone-400">
              Mô hình được tối ưu dạng mesh PBR đa giác thấp (.GLB), chuẩn màu sắc ngũ hành và hoa văn hoàng triều.
            </p>
          </div>
        )}
      </div>

      {/* 4. FOOTER: Chi tiết mô tả văn hóa & Nút thử đồ ngay */}
      <div className="relative z-20 p-4 sm:p-5 bg-black/60 backdrop-blur-md border-t border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-amber-400">Khảo cứu đặc trưng:</span>
            <span className="text-stone-300">{activeConfig.description}</span>
          </div>
          {activeOutfitMeta?.philosophy && (
            <p className="text-[11px] text-stone-400 font-serif italic line-clamp-1">
              "{activeOutfitMeta.philosophy}"
            </p>
          )}
        </div>

        {/* Nút Đưa vào Studio Remix */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          {onSelectForStudio && (
            <button
              type="button"
              onClick={() => {
                onSelectForStudio(activeOutfitId);
                if (onClose) onClose();
              }}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C82A27] to-[#8D1815] hover:from-[#E03531] hover:to-[#A8221F] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-red-900/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Phối Đồ Trong Studio Ngay</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Nếu là Modal popup thì bọc trong overlay fixed toàn màn hình
  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl h-[85vh] max-h-[850px] flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default HeritageModelViewer;
