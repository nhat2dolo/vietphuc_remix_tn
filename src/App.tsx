/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { VirtualTryOn } from './components/VirtualTryOn';
import { FittingStudio } from './components/FittingStudio';
import { PresetLookbook } from './components/PresetLookbook';
import { HeritageArchive } from './components/HeritageArchive';
import { PersonalityQuiz } from './components/PersonalityQuiz';
import { WeatherEventRecommender } from './components/WeatherEventRecommender';
import { OutfitComparator, SavedOutfitSlot } from './components/OutfitComparator';
import { OutfitId, PresetLook, PatternId, AccessoryId } from './types/vietphuc';
import {
  Sparkles,
  Compass,
  BookOpen,
  Heart,
  ArrowUpRight,
  Camera,
  Calendar,
  ArrowLeftRight,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('tryon');
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

  const handleSelectPreset = (preset: PresetLook) => {
    setTargetOutfit(preset.outfit);
    setActivePresetId(preset.id);
    setActiveTab('studio');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectOutfitFromArchive = (outfitId: OutfitId) => {
    setTargetOutfit(outfitId);
    setActiveTab('studio');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleApplyQuizResult = (outfitId: OutfitId) => {
    setTargetOutfit(outfitId);
    setActiveTab('studio');
    window.scrollTo({ top: 380, behavior: 'smooth' });
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
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleApplyComparatorSlot = (slot: SavedOutfitSlot) => {
    setTargetOutfit(slot.outfit);
    setCurrentComparatorSlot(slot);
    setActiveTab('studio');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#24211E] flex flex-col font-sans selection:bg-[#C82A27]/20 selection:text-[#8D1815]">
      {/* 1. TOP BAR */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQuickStudio={() => {
          setActiveTab('tryon');
          window.scrollTo({ top: 340, behavior: 'smooth' });
        }}
      />

      {/* 2. EDITORIAL HERO BANNER */}
      <section className="relative overflow-hidden border-b border-stone-200/90 bg-gradient-to-b from-[#F5EFEB] to-[#FAF7F2] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Editorial Lead Text */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8D1815] font-sans">
                <Sparkles className="w-4 h-4 text-[#C82A27]" />
                <span>Việt Phục Remix · Di Sản Trong Nhịp Sống Gen Z</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-stone-900 leading-tight">
                Khoác Lên Dấu Ấn Cha Ông, <br className="hidden sm:inline" />
                <span className="text-[#C82A27]">Tự Hào Bước Ra Thế Giới</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                Khám phá cấu trúc chuẩn mực của Áo Dài, Ngũ Thân, Nhật Bình, Tứ Thân, Bà Ba, Giao Lĩnh. Phối đồ thông minh cùng Cố vấn AI Google Gemini, gợi ý theo thời tiết & dịp lễ, và ướm thử kéo thả tương tác Fabric.js!
              </p>

              {/* Natural Editorial Stats */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-stone-500 font-sans border-t border-stone-200/70">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-800 tabular-nums">06</span>
                  <span>Kiểu Dáng Cổ Phục</span>
                </div>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-800 tabular-nums">08</span>
                  <span>Sắc Màu Ngũ Hành</span>
                </div>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-800 tabular-nums">AI</span>
                  <span>Gemini 3.8 Flash Tích Hợp</span>
                </div>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-800">100%</span>
                  <span>Khảo Cứu Lịch Sử</span>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Card on Right */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">
                Khám Phá Nhanh
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setActiveTab('tryon')}
                  className={`group w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-95 ${
                    activeTab === 'tryon'
                      ? 'border-[#C82A27] bg-gradient-to-r from-[#FFF5F4] to-[#FFF0EE] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                      : 'border-stone-200/90 bg-white hover:border-[#C82A27]/40 hover:bg-stone-50/90 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-[#C82A27] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-3" />
                    <span className="group-hover:font-semibold transition-all">Thử Đồ Ảo (Virtual Try-On)</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 transition-all duration-200 group-hover:text-[#C82A27] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  onClick={() => setActiveTab('studio')}
                  className={`group w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-95 ${
                    activeTab === 'studio'
                      ? 'border-[#C82A27] bg-gradient-to-r from-[#FFF5F4] to-[#FFF0EE] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                      : 'border-stone-200/90 bg-white hover:border-[#C82A27]/40 hover:bg-stone-50/90 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Compass className="w-4 h-4 text-[#1F4F89] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-3" />
                    <span className="group-hover:font-semibold transition-all">Studio Mannequin & Gemini AI</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 transition-all duration-200 group-hover:text-[#C82A27] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  onClick={() => setActiveTab('weather')}
                  className={`group w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-95 ${
                    activeTab === 'weather'
                      ? 'border-[#C82A27] bg-gradient-to-r from-[#FFF5F4] to-[#FFF0EE] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                      : 'border-stone-200/90 bg-white hover:border-[#C82A27]/40 hover:bg-stone-50/90 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#C82A27] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-3" />
                    <span className="group-hover:font-semibold transition-all">Gợi Ý Dịp Lễ & Thời Tiết</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 transition-all duration-200 group-hover:text-[#C82A27] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  onClick={() => setActiveTab('compare')}
                  className={`group w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-95 ${
                    activeTab === 'compare'
                      ? 'border-[#C82A27] bg-gradient-to-r from-[#FFF5F4] to-[#FFF0EE] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                      : 'border-stone-200/90 bg-white hover:border-[#C82A27]/40 hover:bg-stone-50/90 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ArrowLeftRight className="w-4 h-4 text-[#3D7D73] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-3" />
                    <span className="group-hover:font-semibold transition-all">So Sánh Các Phương Án</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 transition-all duration-200 group-hover:text-[#C82A27] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  onClick={() => setActiveTab('presets')}
                  className={`group w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-95 ${
                    activeTab === 'presets'
                      ? 'border-[#C82A27] bg-gradient-to-r from-[#FFF5F4] to-[#FFF0EE] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                      : 'border-stone-200/90 bg-white hover:border-[#C82A27]/40 hover:bg-stone-50/90 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#E4A025] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-3" />
                    <span className="group-hover:font-semibold transition-all">Bộ Sưu Tập Lookbook Mẫu</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 transition-all duration-200 group-hover:text-[#C82A27] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  onClick={() => setActiveTab('archive')}
                  className={`group w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-95 ${
                    activeTab === 'archive'
                      ? 'border-[#C82A27] bg-gradient-to-r from-[#FFF5F4] to-[#FFF0EE] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                      : 'border-stone-200/90 bg-white hover:border-[#C82A27]/40 hover:bg-stone-50/90 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#593C28] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-3" />
                    <span className="group-hover:font-semibold transition-all">Bách Khoa Cổ Phục & Triết Lý</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 transition-all duration-200 group-hover:text-[#C82A27] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`group w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] active:translate-y-0 active:scale-95 ${
                    activeTab === 'quiz'
                      ? 'border-[#C82A27] bg-gradient-to-r from-[#FFF5F4] to-[#FFF0EE] text-[#8D1815] shadow-xs ring-1 ring-[#C82A27]/20'
                      : 'border-stone-200/90 bg-white hover:border-[#C82A27]/40 hover:bg-stone-50/90 text-stone-700 hover:text-stone-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#3D7D73] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-3" />
                    <span className="group-hover:font-semibold transition-all">Trắc Nghiệm: Vibe Của Bạn</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 transition-all duration-200 group-hover:text-[#C82A27] group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE / ACTIVE VIEW */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {/* VIRTUAL TRY-ON */}
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
      </main>

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-10">
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
                onClick={() => setActiveTab('tryon')}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Thử đồ ảo
              </button>
              <button
                onClick={() => setActiveTab('studio')}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Studio
              </button>
              <button
                onClick={() => setActiveTab('weather')}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Thời tiết & Sự kiện
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                So sánh
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Cảm hứng
              </button>
              <button
                onClick={() => setActiveTab('archive')}
                className="hover:text-[#C82A27] transition-colors cursor-pointer"
              >
                Bách khoa
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
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
    </div>
  );
}
