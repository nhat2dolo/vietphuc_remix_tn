import React from 'react';
import { OutfitData } from '../types/vietphuc';
import { X, BookOpen, Clock, HeartHandshake, ShieldCheck } from 'lucide-react';

interface GarmentKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitData | null;
}

export const GarmentKnowledgeModal: React.FC<GarmentKnowledgeModalProps> = ({
  isOpen,
  onClose,
  outfit,
}) => {
  if (!isOpen || !outfit) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2 text-[#8D1815]">
            <BookOpen className="w-5 h-5 text-[#C82A27]" />
            <span className="text-xs font-bold uppercase tracking-wider font-sans">
              Tri Thức Phục Trang · Khảo Cứu Di Sản
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outfit Title & Era */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C82A27]/10 text-[#C82A27] text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{outfit.era}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
            {outfit.name}
          </h3>
          <p className="text-stone-600 font-serif italic text-sm">
            "{outfit.tagline}"
          </p>
        </div>

        {/* In-depth descriptions */}
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#1F4F89]" />
              <span>Cấu trúc & Đặc trưng</span>
            </div>
            <p>{outfit.desc}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-2">
            <div className="font-bold text-stone-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-[#C82A27]" />
              <span>Ý nghĩa & Triết lý văn hóa</span>
            </div>
            <p className="font-serif">{outfit.philosophy}</p>
          </div>
        </div>

        {/* Source citation */}
        <div className="pt-3 border-t border-stone-200/70 flex items-start gap-2 text-[11px] text-stone-500 italic">
          <span className="font-bold font-sans not-italic text-stone-600">Nguồn tra cứu:</span>
          <span>{outfit.referenceCitation}</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Đã hiểu · Trở lại trải nghiệm
        </button>
      </div>
    </div>
  );
};
