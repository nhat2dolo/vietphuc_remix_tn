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
          className="text-xl sm:text-2xl font-display font-bold text-[#8D1815] tracking-tight whitespace-nowrap"
        >
          Việt phục Remix
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('tryon')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-900 ${
              activeTab === 'tryon' ? 'text-[#C82A27] font-semibold border-b-2 border-[#C82A27] pb-1' : ''
            }`}
          >
            Thử đồ ảo
          </button>
          <button
            onClick={() => onSelectTab('studio')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-900 ${
              activeTab === 'studio' ? 'text-[#C82A27] font-semibold border-b-2 border-[#C82A27] pb-1' : ''
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => onSelectTab('weather')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-900 ${
              activeTab === 'weather' ? 'text-[#C82A27] font-semibold border-b-2 border-[#C82A27] pb-1' : ''
            }`}
          >
            Dịp lễ & Thời tiết
          </button>
          <button
            onClick={() => onSelectTab('compare')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-900 ${
              activeTab === 'compare' ? 'text-[#C82A27] font-semibold border-b-2 border-[#C82A27] pb-1' : ''
            }`}
          >
            So sánh
          </button>
          <button
            onClick={() => onSelectTab('presets')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-900 ${
              activeTab === 'presets' ? 'text-[#C82A27] font-semibold border-b-2 border-[#C82A27] pb-1' : ''
            }`}
          >
            Cảm hứng
          </button>
          <button
            onClick={() => onSelectTab('archive')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-900 ${
              activeTab === 'archive' ? 'text-[#C82A27] font-semibold border-b-2 border-[#C82A27] pb-1' : ''
            }`}
          >
            Bách khoa
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-stone-900 ${
              activeTab === 'quiz' ? 'text-[#C82A27] font-semibold border-b-2 border-[#C82A27] pb-1' : ''
            }`}
          >
            Trắc nghiệm
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQuickStudio}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#C82A27] hover:bg-[#A8221F] rounded-xl transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            Thử đồ ngay
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Small Screens */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-2 border-t border-stone-200/60 bg-white/80 text-xs font-medium overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectTab('tryon')}
          className={`py-1 px-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'tryon' ? 'bg-[#C82A27]/10 text-[#C82A27] font-bold' : 'text-stone-600'
          }`}
        >
          Thử đồ ảo
        </button>
        <button
          onClick={() => onSelectTab('studio')}
          className={`py-1 px-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'studio' ? 'bg-[#C82A27]/10 text-[#C82A27] font-bold' : 'text-stone-600'
          }`}
        >
          Studio
        </button>
        <button
          onClick={() => onSelectTab('weather')}
          className={`py-1 px-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'weather' ? 'bg-[#C82A27]/10 text-[#C82A27] font-bold' : 'text-stone-600'
          }`}
        >
          Dịp lễ & Thời tiết
        </button>
        <button
          onClick={() => onSelectTab('compare')}
          className={`py-1 px-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'compare' ? 'bg-[#C82A27]/10 text-[#C82A27] font-bold' : 'text-stone-600'
          }`}
        >
          So sánh
        </button>
        <button
          onClick={() => onSelectTab('presets')}
          className={`py-1 px-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'presets' ? 'bg-[#C82A27]/10 text-[#C82A27] font-bold' : 'text-stone-600'
          }`}
        >
          Cảm hứng
        </button>
        <button
          onClick={() => onSelectTab('archive')}
          className={`py-1 px-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'archive' ? 'bg-[#C82A27]/10 text-[#C82A27] font-bold' : 'text-stone-600'
          }`}
        >
          Bách khoa
        </button>
        <button
          onClick={() => onSelectTab('quiz')}
          className={`py-1 px-2.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'quiz' ? 'bg-[#C82A27]/10 text-[#C82A27] font-bold' : 'text-stone-600'
          }`}
        >
          Trắc nghiệm
        </button>
      </div>
    </header>
  );
};
