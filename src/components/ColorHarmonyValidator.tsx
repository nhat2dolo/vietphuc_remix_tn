import React, { useMemo } from 'react';
import { TraditionalColor } from '../types/vietphuc';
import { TRADITIONAL_COLORS } from '../data/vietphucData';
import { ShieldCheck, Info } from 'lucide-react';

interface ColorHarmonyValidatorProps {
  primaryColor: TraditionalColor;
  secondaryColorHex: string;
  onSelectSecondaryColor: (hex: string) => void;
}

// Ngũ hành tương sinh
const ELEMENT_GENERATING: Record<string, string> = {
  Kim: 'Thủy',
  Thủy: 'Mộc',
  Mộc: 'Hỏa',
  Hỏa: 'Thổ',
  Thổ: 'Kim',
};

// Ngũ hành tương khắc
const ELEMENT_OVERCOMING: Record<string, string> = {
  Kim: 'Mộc',
  Mộc: 'Thổ',
  Thổ: 'Thủy',
  Thủy: 'Hỏa',
  Hỏa: 'Kim',
};

export const ColorHarmonyValidator: React.FC<ColorHarmonyValidatorProps> = ({
  primaryColor,
  secondaryColorHex,
  onSelectSecondaryColor,
}) => {
  // Find matched secondary color data if available
  const matchedSecondaryColor = useMemo(() => {
    return TRADITIONAL_COLORS.find(
      (c) => c.hex.toLowerCase() === secondaryColorHex.toLowerCase()
    );
  }, [secondaryColorHex]);

  // Compute harmony analysis
  const analysis = useMemo(() => {
    const primElem = primaryColor.element.split(' ')[0]; // E.g., Hỏa, Thủy...
    const secElem = matchedSecondaryColor?.element.split(' ')[0] || 'Kim';

    let harmonyType: 'sinh' | 'hoa' | 'khac' = 'hoa';
    let score = 92;
    let label = 'Hài Hòa Cổ Điển';
    let detail = `Màu chính (${primElem}) & tà phối (${secElem}) cân bằng, nhã nhặn.`;

    if (ELEMENT_GENERATING[primElem] === secElem || ELEMENT_GENERATING[secElem] === primElem) {
      harmonyType = 'sinh';
      score = 98;
      label = `Tương Sinh (${primElem} ⇄ ${secElem})`;
      detail = `Cực kỳ thịnh vượng và may mắn theo quy luật ngũ hành truyền thống.`;
    } else if (primElem === secElem) {
      harmonyType = 'hoa';
      score = 94;
      label = `Đồng Khí (${primElem})`;
      detail = `Phong cách đơn sắc (ton-sur-ton) tinh tế, mang chiều sâu cung đình.`;
    } else if (ELEMENT_OVERCOMING[primElem] === secElem || ELEMENT_OVERCOMING[secElem] === primElem) {
      harmonyType = 'khac';
      score = 86;
      label = `Tương Phản (${primElem} - ${secElem})`;
      detail = `Tương phản cá tính, phong cách hiện đại ấn tượng cho Gen Z.`;
    }

    return { harmonyType, score, label, detail };
  }, [primaryColor, matchedSecondaryColor]);

  // Suggested paired colors
  const recommendedPairs = useMemo(() => {
    const primElem = primaryColor.element.split(' ')[0];
    const sinhElem = ELEMENT_GENERATING[primElem];
    return TRADITIONAL_COLORS.filter(
      (c) => c.id !== primaryColor.id && (c.element.includes(sinhElem) || c.id === 'trang-nga' || c.id === 'den-mun')
    ).slice(0, 4);
  }, [primaryColor]);

  return (
    <div className="pt-2 pb-1 space-y-2">
      {/* 1-Line Compact Harmony Progress Bar */}
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 min-w-0 font-medium text-stone-700">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C82A27] shrink-0" />
          <span className="truncate">Độ hài hòa: <strong className="text-stone-900">{analysis.label}</strong></span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Visual Mini Progress Bar */}
          <div className="w-20 sm:w-28 h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                analysis.score >= 95
                  ? 'bg-emerald-500'
                  : analysis.score >= 90
                  ? 'bg-[#C82A27]'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>
          <span className="font-mono font-bold text-xs text-stone-800">{analysis.score}%</span>
        </div>
      </div>

      {/* Quick Secondary Color Swatch Recommendation (Minimalist 1-line) */}
      <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 bg-stone-50/80 px-2.5 py-1.5 rounded-xl border border-stone-200/60">
        <span className="truncate">Tà lót / viền gợi ý:</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {recommendedPairs.map((col) => {
            const isSelected = secondaryColorHex.toLowerCase() === col.hex.toLowerCase();
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => onSelectSecondaryColor(col.hex)}
                className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 cursor-pointer shadow-2xs ${
                  isSelected ? 'ring-2 ring-stone-800 scale-110 border-white' : 'border-stone-300'
                }`}
                style={{ backgroundColor: col.hex }}
                title={`Đổi màu tà lót: ${col.name} (${col.element})`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
