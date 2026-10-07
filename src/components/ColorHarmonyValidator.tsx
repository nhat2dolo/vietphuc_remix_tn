import React, { useMemo } from 'react';
import { TraditionalColor } from '../types/vietphuc';
import { TRADITIONAL_COLORS } from '../data/vietphucData';
import { ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

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

    let harmonyType: 'sinh' | 'hoa' | 'khac' | 'tuongphan' = 'hoa';
    let score = 92;
    let title = 'Hài Hòa Nhã Nhặn';
    let description = `Sắc ${primaryColor.name} kết hợp cùng lớp lót tà nền nã mang lại vẻ đẹp chuẩn mực cổ phong.`;

    if (ELEMENT_GENERATING[primElem] === secElem || ELEMENT_GENERATING[secElem] === primElem) {
      harmonyType = 'sinh';
      score = 98;
      title = `Ngũ Hành Tương Sinh (${primElem} ⇄ ${secElem})`;
      description = `Cực kỳ thịnh vượng và may mắn! Hai sắc màu này bổ trợ năng lượng cho nhau, tôn dáng vóc người mặc trong các nghi lễ trang trọng.`;
    } else if (primElem === secElem) {
      harmonyType = 'hoa';
      score = 94;
      title = `Đồng Khí Tương Hòa (Cùng hành ${primElem})`;
      description = `Phong cách Monochromatic (đơn sắc) thời thượng, tạo chiều sâu thị giác đồng nhất và thanh lịch.`;
    } else if (ELEMENT_OVERCOMING[primElem] === secElem || ELEMENT_OVERCOMING[secElem] === primElem) {
      harmonyType = 'khac';
      score = 86;
      title = `Tương Phản Ấn Tượng (${primElem} & ${secElem})`;
      description = `Độ tương phản màu sắc mạnh mẽ rất được Gen Z ưa chuộng để thể hiện cá tính nổi bật. Nên điểm thêm phụ kiện trung tính để cân bằng.`;
    }

    return { harmonyType, score, title, description };
  }, [primaryColor, matchedSecondaryColor]);

  // Suggested paired colors for the current primary color
  const recommendedPairs = useMemo(() => {
    const primElem = primaryColor.element.split(' ')[0];
    const sinhElem = ELEMENT_GENERATING[primElem];
    return TRADITIONAL_COLORS.filter(
      (c) => c.id !== primaryColor.id && (c.element.includes(sinhElem) || c.id === 'trang-nga' || c.id === 'den-mun')
    ).slice(0, 4);
  }, [primaryColor]);

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8D1815]">
          <ShieldCheck className="w-4 h-4 text-[#C82A27]" />
          <span>Kiểm Tra Độ Hài Hòa Màu Sắc (Color Harmony)</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold">
          <span>Điểm:</span>
          <span className="text-[#C82A27]">{analysis.score}/100</span>
        </div>
      </div>

      {/* Visual Contrast Swatch Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="p-4 rounded-2xl border border-stone-100 bg-[#FAF7F2] flex items-center gap-4">
          <div className="flex -space-x-3 items-center shrink-0">
            <div
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: primaryColor.hex }}
              title={`Màu chính: ${primaryColor.name}`}
            />
            <div
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
              style={{ backgroundColor: secondaryColorHex }}
              title="Màu tà/quần phối kèm"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-stone-800 truncate">
              {primaryColor.name} × {matchedSecondaryColor ? matchedSecondaryColor.name : 'Trắng / Tự nhiên'}
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              Hành {primaryColor.element} · {analysis.title}
            </div>
          </div>
        </div>

        {/* Evaluation Summary */}
        <div className="space-y-1.5 text-xs text-stone-600">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
            {analysis.score >= 90 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 inline" />
            )}
            <span>{analysis.title}</span>
          </div>
          <p className="leading-relaxed font-serif italic">{analysis.description}</p>
        </div>
      </div>

      {/* Suggested Pairings Quick Click */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
          Gợi ý phối màu tà / quần chuẩn ngũ hành tương sinh:
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendedPairs.map((pair) => (
            <button
              key={pair.id}
              onClick={() => onSelectSecondaryColor(pair.hex)}
              className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                secondaryColorHex.toLowerCase() === pair.hex.toLowerCase()
                  ? 'border-stone-800 bg-stone-100 font-semibold'
                  : 'border-stone-200 bg-white hover:border-stone-400 text-stone-700'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs shrink-0"
                style={{ backgroundColor: pair.hex }}
              />
              <span>{pair.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
