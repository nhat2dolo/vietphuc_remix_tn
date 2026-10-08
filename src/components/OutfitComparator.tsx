import React, { useState } from 'react';
import { OutfitId, GenderMode, PatternId, AccessoryId } from '../types/vietphuc';
import { OUTFITS, TRADITIONAL_COLORS, ACCESSORIES } from '../data/vietphucData';
import { MannequinViewer } from './MannequinViewer';
import { ArrowLeftRight, Check, Sparkles, Copy, RefreshCw } from 'lucide-react';

export interface SavedOutfitSlot {
  outfit: OutfitId;
  gender: GenderMode;
  colorId: string;
  secondaryColorHex: string;
  pattern: PatternId;
  accessories: AccessoryId[];
  label: string;
}

interface OutfitComparatorProps {
  currentOutfit: SavedOutfitSlot;
  onApplyOutfit: (slot: SavedOutfitSlot) => void;
}

export const OutfitComparator: React.FC<OutfitComparatorProps> = ({
  currentOutfit,
  onApplyOutfit,
}) => {
  // Initial Slot A
  const [slotA, setSlotA] = useState<SavedOutfitSlot>({
    ...currentOutfit,
    label: 'Phương án A (Hiện tại)',
  });

  // Initial Slot B (A contrast alternative)
  const [slotB, setSlotB] = useState<SavedOutfitSlot>({
    outfit: currentOutfit.outfit === 'nguthan' ? 'nhatbinh' : 'nguthan',
    gender: currentOutfit.gender,
    colorId: 'xanh-lam',
    secondaryColorHex: '#EDE7DC',
    pattern: 'clouds',
    accessories: ['man', 'quat'],
    label: 'Phương án B (So sánh)',
  });

  const getColorData = (colorId: string) =>
    TRADITIONAL_COLORS.find((c) => c.id === colorId) || TRADITIONAL_COLORS[0];

  const colorA = getColorData(slotA.colorId);
  const colorB = getColorData(slotB.colorId);

  const outfitDataA = OUTFITS[slotA.outfit];
  const outfitDataB = OUTFITS[slotB.outfit];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8D1815]">
            <ArrowLeftRight className="w-4 h-4 text-[#C82A27]" />
            <span>ĐỐI SÁNH TRỰC QUAN</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 mt-1">
            So Sánh Các Phương Án Phối Đồ
          </h3>
        </div>

        {/* Action to capture current studio look */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSlotA({ ...currentOutfit, label: 'Phương án A (Cập nhật)' })}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
          >
            Lưu đồ đang chọn vào A
          </button>
          <button
            onClick={() => setSlotB({ ...currentOutfit, label: 'Phương án B (Cập nhật)' })}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
          >
            Lưu đồ đang chọn vào B
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* SLOT A */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-[#FAF7F2] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8D1815]">
              {slotA.label}
            </span>
            <button
              onClick={() => onApplyOutfit(slotA)}
              className="px-3.5 py-1.5 rounded-xl bg-[#C82A27] hover:bg-[#A8221F] hover:-translate-y-0.5 hover:shadow-md active:scale-95 text-white text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              Chọn bản A
            </button>
          </div>

          <div className="w-full min-h-[580px] sm:min-h-[620px] md:min-h-[640px] rounded-2xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center">
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

          <div className="space-y-2 text-xs text-stone-700 bg-white p-4 rounded-2xl border border-stone-200/80">
            <div className="font-display font-bold text-base text-stone-900">
              {outfitDataA.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorA.hex }} />
              <span className="font-medium">{colorA.name}</span>
              <span className="text-stone-400">·</span>
              <span>Hành {colorA.element}</span>
            </div>
            <div className="text-stone-500 font-serif italic">"{outfitDataA.tagline}"</div>
            <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
              {slotA.accessories.map((accId) => {
                const acc = ACCESSORIES.find((a) => a.id === accId);
                return (
                  <span
                    key={accId}
                    className="px-2 py-0.5 rounded-md bg-stone-100 text-[11px] text-stone-700"
                  >
                    {acc?.emoji} {acc?.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* SLOT B */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-[#FAF7F2] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F4F89]">
              {slotB.label}
            </span>
            <button
              onClick={() => onApplyOutfit(slotB)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1F4F89] hover:bg-[#12335A] hover:-translate-y-0.5 hover:shadow-md active:scale-95 text-white text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              Chọn bản B
            </button>
          </div>

          <div className="w-full min-h-[580px] sm:min-h-[620px] md:min-h-[640px] rounded-2xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center">
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

          <div className="space-y-2 text-xs text-stone-700 bg-white p-4 rounded-2xl border border-stone-200/80">
            <div className="font-display font-bold text-base text-stone-900">
              {outfitDataB.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorB.hex }} />
              <span className="font-medium">{colorB.name}</span>
              <span className="text-stone-400">·</span>
              <span>Hành {colorB.element}</span>
            </div>
            <div className="text-stone-500 font-serif italic">"{outfitDataB.tagline}"</div>
            <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
              {slotB.accessories.map((accId) => {
                const acc = ACCESSORIES.find((a) => a.id === accId);
                return (
                  <span
                    key={accId}
                    className="px-2 py-0.5 rounded-md bg-stone-100 text-[11px] text-stone-700"
                  >
                    {acc?.emoji} {acc?.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
