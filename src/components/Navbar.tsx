import React from 'react';
import { createPortal } from 'react-dom';
import { Home, Compass, Camera, Heart, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'tryon' | 'studio' | 'weather' | 'compare' | 'presets' | 'archive' | 'quiz';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickStudio,
}) => {
  return (
    <>
      {/* 1. DESKTOP FLOATING CAPSULE NAVBAR (Thanh viên thuốc nổi sang trọng) */}
      <header className="sticky top-3 z-40 px-3 sm:px-6 w-full flex justify-center pointer-events-none">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between py-2 px-4 sm:px-6 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-stone-200/90 shadow-md pointer-events-auto transition-all duration-300">
          {/* Zone 1: Brand single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('home');
            }}
            className="text-lg sm:text-xl font-display font-bold text-[#8D1815] tracking-tight whitespace-nowrap transition-all duration-200 hover:scale-[1.02] hover:text-[#C82A27] active:scale-95"
          >
            Việt Phục Remix
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => onSelectTab('studio')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => onSelectTab('tryon')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'tryon'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              Thử đồ ảo
            </button>
            <button
              onClick={() => onSelectTab('weather')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'weather'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              Thời tiết & Dịp lễ
            </button>
            <button
              onClick={() => onSelectTab('compare')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'compare'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              So sánh
            </button>
            <button
              onClick={() => onSelectTab('presets')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              Cảm hứng
            </button>
            <button
              onClick={() => onSelectTab('archive')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'archive'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              Bách khoa
            </button>
            <button
              onClick={() => onSelectTab('quiz')}
              className={`px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-[#C82A27] text-white shadow-xs font-bold hover:bg-[#A8221F] hover:-translate-y-0.5'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 hover:-translate-y-0.5'
              }`}
            >
              Trắc nghiệm
            </button>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQuickStudio}
              className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#C82A27] to-[#A8221F] hover:from-[#B52522] hover:to-[#8D1815] rounded-full shadow-md hover:shadow-red-900/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Thử đồ ngay</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MOBILE BOTTOM NAVIGATION BAR (Render trực tiếp vào document.body bằng createPortal) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto bg-[#FAF7F2]/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] py-2 px-3 flex items-center justify-around safe-area-bottom">
            {/* Nút 1: Trang Chủ */}
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer pointer-events-auto ${
                activeTab === 'home'
                  ? 'text-[#C82A27] font-bold bg-[#C82A27]/10'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Trang Chủ</span>
            </button>

            {/* Nút 2: Studio */}
            <button
              type="button"
              onClick={() => onSelectTab('studio')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer pointer-events-auto ${
                activeTab === 'studio'
                  ? 'text-[#C82A27] font-bold bg-[#C82A27]/10'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Studio</span>
            </button>

            {/* Nút 3: Thử Đồ */}
            <button
              type="button"
              onClick={() => onSelectTab('tryon')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer pointer-events-auto ${
                activeTab === 'tryon'
                  ? 'text-[#C82A27] font-bold bg-[#C82A27]/10'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Thử Đồ</span>
            </button>

            {/* Nút 4: Trắc Nghiệm */}
            <button
              type="button"
              onClick={() => onSelectTab('quiz')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 active:scale-90 cursor-pointer pointer-events-auto ${
                activeTab === 'quiz'
                  ? 'text-[#C82A27] font-bold bg-[#C82A27]/10'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Heart className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">Trắc Nghiệm</span>
            </button>
          </nav>,
          document.body
        )}
    </>
  );
};

