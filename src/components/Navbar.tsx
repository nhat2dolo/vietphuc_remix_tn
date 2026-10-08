import React from 'react';

export type NavTab = 'tryon' | 'studio' | 'weather' | 'compare' | 'presets' | 'archive' | 'quiz';

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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand single text element wordmark */}
        <a
          href="#tryon"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('tryon');
          }}
          className="text-xl sm:text-2xl font-display font-bold text-[#8D1815] tracking-tight whitespace-nowrap transition-all duration-200 hover:scale-[1.02] hover:text-[#C82A27] active:scale-95"
        >
          Việt phục Remix
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
          <button
            onClick={() => onSelectTab('tryon')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'tryon'
                ? 'bg-[#C82A27] text-white font-semibold shadow-xs hover:bg-[#A8221F] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            Thử đồ ảo
          </button>
          <button
            onClick={() => onSelectTab('studio')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-[#C82A27] text-white font-semibold shadow-xs hover:bg-[#A8221F] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => onSelectTab('weather')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'weather'
                ? 'bg-[#C82A27] text-white font-semibold shadow-xs hover:bg-[#A8221F] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            Dịp lễ & Thời tiết
          </button>
          <button
            onClick={() => onSelectTab('compare')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-[#C82A27] text-white font-semibold shadow-xs hover:bg-[#A8221F] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            So sánh
          </button>
          <button
            onClick={() => onSelectTab('presets')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-[#C82A27] text-white font-semibold shadow-xs hover:bg-[#A8221F] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            Cảm hứng
          </button>
          <button
            onClick={() => onSelectTab('archive')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-[#C82A27] text-white font-semibold shadow-xs hover:bg-[#A8221F] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            Bách khoa
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-[#C82A27] text-white font-semibold shadow-xs hover:bg-[#A8221F] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 active:scale-95'
            }`}
          >
            Trắc nghiệm
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickStudio}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#C82A27] to-[#A8221F] hover:from-[#B52522] hover:to-[#8D1815] hover:shadow-lg hover:shadow-red-900/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm cursor-pointer"
          >
            Thử đồ ngay
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Small Screens */}
      <div className="lg:hidden flex items-center gap-1.5 px-3 py-2 border-t border-stone-200/60 bg-white/80 text-xs font-medium overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectTab('tryon')}
          className={`py-1.5 px-3 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            activeTab === 'tryon'
              ? 'bg-[#C82A27] text-white font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Thử đồ ảo
        </button>
        <button
          onClick={() => onSelectTab('studio')}
          className={`py-1.5 px-3 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            activeTab === 'studio'
              ? 'bg-[#C82A27] text-white font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Studio
        </button>
        <button
          onClick={() => onSelectTab('weather')}
          className={`py-1.5 px-3 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            activeTab === 'weather'
              ? 'bg-[#C82A27] text-white font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Dịp lễ & Thời tiết
        </button>
        <button
          onClick={() => onSelectTab('compare')}
          className={`py-1.5 px-3 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            activeTab === 'compare'
              ? 'bg-[#C82A27] text-white font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          So sánh
        </button>
        <button
          onClick={() => onSelectTab('presets')}
          className={`py-1.5 px-3 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            activeTab === 'presets'
              ? 'bg-[#C82A27] text-white font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Cảm hứng
        </button>
        <button
          onClick={() => onSelectTab('archive')}
          className={`py-1.5 px-3 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            activeTab === 'archive'
              ? 'bg-[#C82A27] text-white font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Bách khoa
        </button>
        <button
          onClick={() => onSelectTab('quiz')}
          className={`py-1.5 px-3 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            activeTab === 'quiz'
              ? 'bg-[#C82A27] text-white font-bold shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Trắc nghiệm
        </button>
      </div>
    </header>
  );
};
