import React, { useState } from 'react';
import { OUTFITS, TRADITIONAL_COLORS } from '../data/vietphucData';
import { OutfitId } from '../types/vietphuc';
import { BookOpen, Scroll, CheckCircle2, Award, History, Layers } from 'lucide-react';

interface HeritageArchiveProps {
  onSelectOutfitForStudio?: (id: OutfitId) => void;
}

export const HeritageArchive: React.FC<HeritageArchiveProps> = ({ onSelectOutfitForStudio }) => {
  const [selectedOutfitId, setSelectedOutfitId] = useState<OutfitId>('nguthan');
  const activeOutfit = OUTFITS[selectedOutfitId];

  return (
    <div className="space-y-10">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="text-xs uppercase tracking-widest text-[#8D1815] font-sans font-semibold mb-2">
          BÁCH KHOA DI SẢN CỔ PHỤC ĐẠI VIỆT · LỊCH SỬ & QUY CÁCH
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-stone-900">
          Ngàn Năm Áo Mũ: Dấu Ấn Văn Hóa Qua Từng Tà Áo
        </h2>
        <p className="text-stone-600 mt-2 max-w-3xl leading-relaxed font-serif text-base sm:text-lg">
          Trang phục truyền thống Việt Nam không chỉ là tấm vải che thân, mà là sự phản ánh nhân sinh quan, trật tự xã hội và thẩm mỹ tinh tế của cha ông qua các thời kỳ Lý, Trần, Lê, Nguyễn.
        </p>
      </div>

      {/* Outfit Selector Horizontal Rail */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.values(OUTFITS).map((outfit) => {
          const isSelected = outfit.id === selectedOutfitId;
          return (
            <button
              key={outfit.id}
              onClick={() => setSelectedOutfitId(outfit.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? 'bg-[#C82A27] text-white border-[#C82A27] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              {outfit.name}
            </button>
          );
        })}
      </div>

      {/* Main Exhibition Display for Active Outfit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Details & Philosophy Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-stone-400 font-sans">Thời đại lưu hành</span>
                <div className="text-sm font-semibold text-stone-800">{activeOutfit.era}</div>
              </div>
              {onSelectOutfitForStudio && (
                <button
                  onClick={() => onSelectOutfitForStudio(activeOutfit.id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-[#C82A27] hover:text-white text-stone-800 transition-colors"
                >
                  Thử đồ dáng này trong Studio →
                </button>
              )}
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                {activeOutfit.name}
              </h3>
              <p className="text-stone-600 font-serif italic text-base mt-1">
                "{activeOutfit.tagline}"
              </p>
            </div>

            <div className="space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
              <p>{activeOutfit.desc}</p>
            </div>

            {/* Deep Philosophy Callout */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border-l-4 border-[#C82A27] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8D1815]">
                <Layers className="w-4 h-4" />
                <span>Ý Nghĩa Cấu Trúc & Đạo Học</span>
              </div>
              <p className="text-stone-800 font-serif leading-relaxed text-sm">
                {activeOutfit.philosophy}
              </p>
            </div>

            {/* Suitable Occasions */}
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                Dịp Thích Hợp Diện Trang Phục
              </div>
              <div className="flex flex-wrap gap-2">
                {activeOutfit.suitableOccasions.map((occ, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C82A27]" />
                    <span>{occ}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Source Reference */}
            <div className="pt-4 border-t border-stone-100 flex items-start gap-2.5 text-xs text-stone-500 italic">
              <BookOpen className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>Nguồn tra cứu uy tín: {activeOutfit.referenceCitation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Knowledge & Color System */}
        <div className="lg:col-span-5 space-y-6">
          {/* Traditional Color Palette Guide */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#E4A025]" />
              <h4 className="font-display font-bold text-lg text-stone-900">
                Màu Sắc & Ngũ Hành Cổ Truyền
              </h4>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Màu nhuộm tự nhiên từ cây chàm, củ nâu, hoa hòe, chu sa... mang biểu tượng cân bằng âm dương trong triết học phương Đông:
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {TRADITIONAL_COLORS.slice(0, 6).map((col) => (
                <div
                  key={col.id}
                  className="p-3 rounded-xl border border-stone-200/60 flex items-center gap-2.5 bg-stone-50/50"
                >
                  <div
                    className="w-7 h-7 rounded-lg shrink-0 border border-black/10 shadow-sm"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div className="text-[11px] min-w-0">
                    <div className="font-semibold text-stone-800 truncate">{col.name}</div>
                    <div className="text-stone-400">Hành: {col.element}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quy Tắc Mặc Đẹp Cho Gen Z */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-[#8D1815]">
              <History className="w-5 h-5" />
              <h4 className="font-display font-bold text-lg text-stone-900">
                Sổ Tay Remix: Tôn Trọng & Tự Hào
              </h4>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#C82A27]">01.</span>
                <span>
                  <strong>Độ dài tà áo & gấu quần:</strong> Khi kết hợp cùng giày thể thao, chọn quần chấm mắt cá chân để bước đi thanh thoát, tránh để gấu quần chạm đất gây vấy bẩn.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#C82A27]">02.</span>
                <span>
                  <strong>Cài đủ cúc cổ:</strong> Áo ngũ thân và áo dài cần cài cúc cổ đứng ngay ngắn để giữ form dáng trang nghiêm khi vào chốn linh thiêng.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#C82A27]">03.</span>
                <span>
                  <strong>Thái độ khi mặc:</strong> Cổ phục không phải là hóa trang. Hãy mặc với tinh thần tự hào về nền văn minh lâu đời của nước mình.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
