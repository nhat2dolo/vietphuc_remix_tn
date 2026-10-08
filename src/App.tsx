/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { VirtualTryOn } from './components/VirtualTryOn';
import { FittingStudio } from './components/FittingStudio';
import { PresetLookbook } from './components/PresetLookbook';
import { HeritageArchive } from './components/HeritageArchive';
import { PersonalityQuiz } from './components/PersonalityQuiz';
import { WeatherEventRecommender } from './components/WeatherEventRecommender';
import { OutfitComparator, SavedOutfitSlot } from './components/OutfitComparator';
import { GlobalAiAssistant } from './components/GlobalAiAssistant';
import { OutfitId, PresetLook, PatternId, AccessoryId } from './types/vietphuc';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [targetOutfit, setTargetOutfit] = useState<OutfitId>('nguthan');
  const [activePresetId, setActivePresetId] = useState<string | undefined>('preset-1');

  // Comparison current slot
  const [currentComparatorSlot, setCurrentComparatorSlot] = useState<SavedOutfitSlot>({
    outfit: 'nguthan',
    gender: 'female',
    colorId: 'vang-nghe',
    secondaryColorHex: '#EDE7DC',
    pattern: 'lotus',
    accessories: ['man', 'chuoingoc'],
    label: 'Phương án A (Hiện tại)',
  });

  const handleSelectOutfitFromHome = (outfitId: OutfitId) => {
    setTargetOutfit(outfitId);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (preset: PresetLook) => {
    setTargetOutfit(preset.outfit);
    setActivePresetId(preset.id);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOutfitFromArchive = (outfitId: OutfitId) => {
    setTargetOutfit(outfitId);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyQuizResult = (outfitId: OutfitId) => {
    setTargetOutfit(outfitId);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyWeatherPreset = (config: {
    outfit: OutfitId;
    colorId: string;
    accessories: string[];
    pattern: PatternId;
  }) => {
    setTargetOutfit(config.outfit);
    setCurrentComparatorSlot({
      outfit: config.outfit,
      gender: 'female',
      colorId: config.colorId,
      secondaryColorHex: '#EDE7DC',
      pattern: config.pattern,
      accessories: config.accessories as AccessoryId[],
      label: 'Gợi ý Hoàn Cảnh',
    });
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyComparatorSlot = (slot: SavedOutfitSlot) => {
    setTargetOutfit(slot.outfit);
    setCurrentComparatorSlot(slot);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24211E] flex flex-col font-sans selection:bg-[#C82A27]/20 selection:text-[#8D1815]">
      {/* 1. TOP BAR (FLOATING CAPSULE NAVBAR TRÊN DESKTOP & DƯỚI MOBILE) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickStudio={() => {
          setActiveTab('studio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. MAIN WORKSPACE / ACTIVE VIEW WITH SMOOTH SPRING-LIKE HORIZONTAL SLIDE & FADE TRANSITION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full pb-24 lg:pb-12">
        <div key={activeTab} className="animate-tab-transition">
          {/* TRANG CHỦ (HOMEPAGE TRỰC QUAN - VISUAL STORYTELLING) */}
          {activeTab === 'home' && (
            <HomeView
              onStartTryOn={() => {
                setActiveTab('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectOutfit={handleSelectOutfitFromHome}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* VIRTUAL TRY-ON (THỬ ĐỒ ẢO FABRIC.JS) */}
          {activeTab === 'tryon' && (
            <div className="space-y-12">
              <VirtualTryOn />
            </div>
          )}

          {/* STUDIO MANNEQUIN MODE */}
          {activeTab === 'studio' && (
            <div className="space-y-12">
              <FittingStudio key={targetOutfit} initialOutfit={targetOutfit} />

              {/* Presets carousel underneath Studio for quick styling inspiration */}
              <div className="pt-8 border-t border-stone-200/80">
                <PresetLookbook
                  onSelectPreset={handleSelectPreset}
                  activePresetId={activePresetId}
                />
              </div>
            </div>
          )}

          {/* WEATHER & EVENT RECOMMENDER VIEW */}
          {activeTab === 'weather' && (
            <div className="space-y-10">
              <WeatherEventRecommender onApplyPreset={handleApplyWeatherPreset} />
            </div>
          )}

          {/* OUTFIT COMPARATOR VIEW */}
          {activeTab === 'compare' && (
            <div className="space-y-10">
              <OutfitComparator
                currentOutfit={currentComparatorSlot}
                onApplyOutfit={handleApplyComparatorSlot}
              />
            </div>
          )}

          {/* PRESET LOOKBOOK VIEW */}
          {activeTab === 'presets' && (
            <div className="space-y-10">
              <div className="border-b border-stone-200 pb-4">
                <div className="text-xs uppercase tracking-widest text-[#8D1815] font-semibold mb-1">
                  LOOKBOOK GALLERY
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                  Gợi Ý Bản Phối Phong Cách Cho Từng Hoàn Cảnh
                </h2>
              </div>
              <PresetLookbook
                onSelectPreset={handleSelectPreset}
                activePresetId={activePresetId}
              />
            </div>
          )}

          {/* HERITAGE ARCHIVE VIEW */}
          {activeTab === 'archive' && (
            <HeritageArchive onSelectOutfitForStudio={handleSelectOutfitFromArchive} />
          )}

          {/* PERSONALITY QUIZ VIEW */}
          {activeTab === 'quiz' && (
            <div className="py-6">
              <PersonalityQuiz onApplyResult={handleApplyQuizResult} />
            </div>
          )}
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-10 pb-24 lg:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <div className="font-display font-bold text-lg text-[#8D1815]">
                Việt phục Remix
              </div>
              <p className="text-xs text-stone-500 font-serif italic mt-0.5">
                Đưa di sản trăm năm trở thành nhịp thở thời trang của thế hệ mới.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 text-xs text-stone-600 font-medium">
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Trang chủ
              </button>
              <button
                onClick={() => {
                  setActiveTab('studio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Studio
              </button>
              <button
                onClick={() => {
                  setActiveTab('tryon');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Thử đồ ảo
              </button>
              <button
                onClick={() => {
                  setActiveTab('weather');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Thời tiết & Dịp lễ
              </button>
              <button
                onClick={() => {
                  setActiveTab('compare');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                So sánh
              </button>
              <button
                onClick={() => {
                  setActiveTab('presets');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Cảm hứng
              </button>
              <button
                onClick={() => {
                  setActiveTab('archive');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Bách khoa
              </button>
              <button
                onClick={() => {
                  setActiveTab('quiz');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Trắc nghiệm
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
            <div>
              Tư liệu khảo cứu: "Ngàn năm áo mũ" (Trần Quang Đức), Bảo tàng Lịch sử Quốc gia & Trung tâm BTDT Cố đô Huế.
            </div>
            <div>
              Dành trọn tình yêu cho văn hóa phục trang truyền thống Việt Nam 🇻🇳
            </div>
          </div>
        </div>
      </footer>

      {/* 4. TRỢ LÝ AI TOÀN CỤC ĐA NGỮ CẢNH (GLOBAL CONTEXT-AWARE ASSISTANT DRAWER) */}
      <GlobalAiAssistant
        activeTab={activeTab}
        currentOutfitId={targetOutfit}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
