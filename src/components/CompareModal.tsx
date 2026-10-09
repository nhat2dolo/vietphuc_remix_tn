import React, { useState } from 'react';
import { OutfitId, GenderMode, PatternId, AccessoryId } from '../types/vietphuc';
import { OUTFITS, TRADITIONAL_COLORS, ACCESSORIES } from '../data/vietphucData';
import { MannequinViewer } from './MannequinViewer';
import { SavedOutfitSlot } from './OutfitComparator';
import { X, ArrowLeftRight, Check, Sparkles, Shirt } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOutfit: SavedOutfitSlot;
  onApplyOutfit: (slot: SavedOutfitSlot) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  currentOutfit,
  onApplyOutfit,
}) => {
  // Slot A: initialized with current look
  const [slotA, setSlotA] = useState<SavedOutfitSlot>({
    ...currentOutfit,
    label: 'Phương án A (Hiện tại)',
  });

  // Slot B: alternative look
  const [slotB, setSlotB] = useState<SavedOutfitSlot>({
    outfit: currentOutfit.outfit === 'nguthan' ? 'nhatbinh' : 'nguthan',
    gender: currentOutfit.gender,
    colorId: currentOutfit.colorId === 'xanh-lam' ? 'do-son' : 'xanh-lam',
    secondaryColorHex: '#EDE7DC',
    pattern: 'clouds',
    accessories: ['man', 'quat'],
    label: 'Phương án B (So sánh)',
  });

  if (!isOpen) return null;

  const getColorData = (colorId: string) =>
    TRADITIONAL_COLORS.find((c) => c.id === colorId) || TRADITIONAL_COLORS[0];

  const colorA = getColorData(slotA.colorId);
  const colorB = getColorData(slotB.colorId);

  const outfitDataA = OUTFITS[slotA.outfit];
  const outfitDataB = OUTFITS[slotB.outfit];

  const handleSelectA = () => {
    onApplyOutfit(slotA);
    onClose();
  };

  const handleSelectB = () => {
    onApplyOutfit(slotB);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      style={{
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8D1815]/10 text-[#8D1815] flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-[#C82A27]" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8D1815]">
                Đối Sánh Trực Quan
              </div>
              <h2 id="compare-modal-title" className="text-lg sm:text-xl font-display font-bold text-stone-900 leading-tight">
                So Sánh Song Song 2 Phương Án Phối Đồ
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 font-serif italic">
              Lưu bản phối hiện tại vào A hoặc B để đối chiếu
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Đóng (Esc)"
              aria-label="Đóng bảng so sánh"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action capture buttons */}
        <div className="px-6 py-2.5 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-stone-600 font-medium">
            Bản phối đang thử: <span className="font-semibold text-stone-900">{currentOutfit.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSlotA({ ...currentOutfit, label: 'Phương án A (Vừa gán)' })}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 bg-white hover:bg-stone-100 text-[#8D1815] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              📌 Gán đồ đang chọn vào A
            </button>
            <button
              onClick={() => setSlotB({ ...currentOutfit, label: 'Phương án B (Vừa gán)' })}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 bg-white hover:bg-stone-100 text-[#1F4F89] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              📌 Gán đồ đang chọn vào B
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable side-by-side comparison */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {/* PANEL A */}
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-[#C82A27]/25 bg-white shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8D1815] text-white text-xs font-bold flex items-center justify-center">
                      A
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8D1815]">
                      {slotA.label}
                    </span>
                  </div>
                  <button
                    onClick={handleSelectA}
                    className="px-3.5 py-1.5 rounded-xl bg-[#C82A27] hover:bg-[#A8221F] active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Áp dụng bản A
                  </button>
                </div>

                {/* Mannequin Preview Container: Head-to-toe */}
                <div className="w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-stone-200 flex items-center justify-center">
                  <MannequinViewer
                    outfit={slotA.outfit}
                    gender={slotA.gender}
                    colorHex={colorA.hex}
                    secondaryColorHex={slotA.secondaryColorHex}
                    pattern={slotA.pattern}
                    accessories={slotA.accessories}
                    onSelectGender={(gender) => setSlotA({ ...slotA, gender })}
                  />
                </div>
              </div>

              {/* Details specs */}
              <div className="space-y-2 text-xs bg-[#FAF7F2] p-3.5 rounded-2xl border border-stone-200/90">
                <div className="font-display font-bold text-base text-stone-900">
                  {outfitDataA.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: colorA.hex }} />
                  <span className="font-semibold text-stone-800">{colorA.name}</span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-600">Hành {colorA.element}</span>
                </div>
                <p className="text-stone-500 font-serif italic text-[11px] line-clamp-2">
                  "{outfitDataA.tagline}"
                </p>
                <div className="pt-2 border-t border-stone-200/80 flex flex-wrap gap-1">
                  {slotA.accessories.length > 0 ? (
                    slotA.accessories.map((accId) => {
                      const acc = ACCESSORIES.find((a) => a.id === accId);
                      return (
                        <span
                          key={accId}
                          className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[11px] text-stone-700"
                        >
                          {acc?.emoji} {acc?.name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-stone-400 italic text-[11px]">Chưa chọn phụ kiện</span>
                  )}
                </div>
              </div>
            </div>

            {/* PANEL B */}
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-[#1F4F89]/25 bg-white shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1F4F89] text-white text-xs font-bold flex items-center justify-center">
                      B
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F4F89]">
                      {slotB.label}
                    </span>
                  </div>
                  <button
                    onClick={handleSelectB}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1F4F89] hover:bg-[#153a66] active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    Áp dụng bản B
                  </button>
                </div>

                {/* Mannequin Preview Container: Head-to-toe */}
                <div className="w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-stone-200 flex items-center justify-center">
                  <MannequinViewer
                    outfit={slotB.outfit}
                    gender={slotB.gender}
                    colorHex={colorB.hex}
                    secondaryColorHex={slotB.secondaryColorHex}
                    pattern={slotB.pattern}
                    accessories={slotB.accessories}
                    onSelectGender={(gender) => setSlotB({ ...slotB, gender })}
                  />
                </div>
              </div>

              {/* Details specs */}
              <div className="space-y-2 text-xs bg-[#FAF7F2] p-3.5 rounded-2xl border border-stone-200/90">
                <div className="font-display font-bold text-base text-stone-900">
                  {outfitDataB.name}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: colorB.hex }} />
                  <span className="font-semibold text-stone-800">{colorB.name}</span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-600">Hành {colorB.element}</span>
                </div>
                <p className="text-stone-500 font-serif italic text-[11px] line-clamp-2">
                  "{outfitDataB.tagline}"
                </p>
                <div className="pt-2 border-t border-stone-200/80 flex flex-wrap gap-1">
                  {slotB.accessories.length > 0 ? (
                    slotB.accessories.map((accId) => {
                      const acc = ACCESSORIES.find((a) => a.id === accId);
                      return (
                        <span
                          key={accId}
                          className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[11px] text-stone-700"
                        >
                          {acc?.emoji} {acc?.name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-stone-400 italic text-[11px]">Chưa chọn phụ kiện</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-stone-200/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500 font-sans">
            Bấm "Áp dụng" ở bất kỳ phương án nào để tải vào Studio làm việc chính.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Đóng bảng
          </button>
        </div>
      </div>
    </div>
  );
};
