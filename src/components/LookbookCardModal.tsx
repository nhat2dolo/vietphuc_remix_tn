import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { OutfitData, TraditionalColor, AccessoryData, PatternId, GenderMode } from '../types/vietphuc';
import { normalizeVietnameseText } from '../utils/textUtils';
import { Download, Copy, Check, X, Sparkles } from 'lucide-react';

interface LookbookCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfitData: OutfitData;
  colorData: TraditionalColor;
  secondaryColorHex: string;
  pattern: PatternId;
  gender: GenderMode;
  selectedAccessories: AccessoryData[];
  lookName: string;
}

export const LookbookCardModal: React.FC<LookbookCardModalProps> = ({
  isOpen,
  onClose,
  outfitData,
  colorData,
  secondaryColorHex,
  pattern,
  gender,
  selectedAccessories,
  lookName,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || 'auto';
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleCopyRecipe = async () => {
    const accList = selectedAccessories.map((a) => `${a.name} (${a.emoji})`).join(', ') || 'Không phụ kiện';
    const text = normalizeVietnameseText(`🇻🇳 [VIỆT PHỤC REMIX - LOOKBOOK]
Bộ trang phục: ${outfitData.name} (${outfitData.era})
Tone màu: ${colorData.name} [${colorData.hex}] - Ngũ hành: ${colorData.element}
Phụ kiện remix: ${accList}
Triết lý: "${outfitData.philosophy}"
👉 Khám phá tại: Việt phục Remix - Di sản & Gen Z`);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadImage = () => {
    setIsExporting(true);

    // Render onto an HTML5 Canvas for pristine PNG download
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // 1. Background
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative border frame
    ctx.strokeStyle = '#D6CEBE';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = colorData.hex;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

    // Header Tag
    ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#8D1815';
    ctx.fillText('VIỆT PHỤC REMIX · GEN Z HERITAGE ATELIER', 80, 110);

    // Look Name & Outfit Title
    ctx.font = 'bold 64px Lora, "Be Vietnam Pro", serif';
    ctx.fillStyle = '#1C1917';
    ctx.fillText(lookName || outfitData.name, 80, 200);

    ctx.font = 'italic 32px Lora, "Be Vietnam Pro", serif';
    ctx.fillStyle = '#78350F';
    ctx.fillText(outfitData.tagline, 80, 255);

    // Divider
    ctx.beginPath();
    ctx.moveTo(80, 290);
    ctx.lineTo(canvas.width - 80, 290);
    ctx.strokeStyle = '#E5E0D8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Large Center Showcase Box
    ctx.fillStyle = '#F3ECE0';
    ctx.beginPath();
    ctx.roundRect(80, 330, canvas.width - 160, 720, 24);
    ctx.fill();

    // Swatch representation in canvas
    ctx.fillStyle = colorData.hex;
    ctx.beginPath();
    ctx.roundRect(140, 390, 400, 600, 20);
    ctx.fill();

    // Text details inside card
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Lora, "Be Vietnam Pro", serif';
    ctx.fillText(outfitData.name, 170, 470);

    ctx.font = '24px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`Màu chính: ${colorData.name}`, 170, 530);
    ctx.fillText(`Mã màu: ${colorData.hex}`, 170, 575);
    ctx.fillText(`Hành: ${colorData.element}`, 170, 620);
    ctx.fillText(`Kiểu dáng: ${gender === 'female' ? 'Nữ giới' : 'Nam giới'}`, 170, 665);

    // Accessories box on the right
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(580, 390, 480, 600, 20);
    ctx.fill();

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 30px Lora, "Be Vietnam Pro", serif';
    ctx.fillText('Phụ Kiện Remix Đã Chọn', 620, 460);

    ctx.font = '26px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#44403C';
    let yOffset = 520;
    if (selectedAccessories.length === 0) {
      ctx.fillText('• Thuần mộc (Không phụ kiện)', 620, yOffset);
    } else {
      selectedAccessories.forEach((acc) => {
        ctx.fillText(`• ${acc.emoji}  ${acc.name}`, 620, yOffset);
        yOffset += 50;
      });
    }

    // Heritage Philosophy Section
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 30px Lora, "Be Vietnam Pro", serif';
    ctx.fillText('Ý Nghĩa & Triết Lý Di Sản', 80, 1140);

    ctx.font = '26px Lora, "Be Vietnam Pro", serif';
    ctx.fillStyle = '#57534E';
    const words = outfitData.philosophy.split(' ');
    let line = '';
    let py = 1190;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 180 && n > 0) {
        ctx.fillText(line, 80, py);
        line = words[n] + ' ';
        py += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, py);

    // Footer Citation
    ctx.font = 'italic 22px sans-serif';
    ctx.fillStyle = '#A8A29E';
    ctx.fillText(outfitData.referenceCitation, 80, 1490);
    ctx.fillText('© Việt phục Remix · Thiết kế dành riêng cho bạn', 80, 1530);

    // Export to Download Link
    const link = document.createElement('a');
    link.download = `viet-phuc-lookbook-${outfitData.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsExporting(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-stone-300 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white/70">
          <div className="flex items-center gap-2 text-stone-800 font-medium">
            <Sparkles className="w-5 h-5 text-[#C82A27]" />
            <span>Thẻ Lookbook Di Sản Của Bạn</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Card View */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1" ref={cardRef}>
          {/* Card Paper Box */}
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
            {/* Top Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans border-b border-stone-100 pb-3">
              <span>VOL. 2026 · VIỆT PHỤC REMIX COLLECTION</span>
              <span className="text-[#C82A27] font-semibold">TẬP SAN DI SẢN & GEN Z</span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
                {lookName || outfitData.name}
              </h2>
              <p className="text-sm sm:text-base font-serif italic text-[#8D1815] mt-1">
                {outfitData.tagline}
              </p>
            </div>

            {/* Grid of Palette & Spec */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl shadow-inner shrink-0 border border-black/10"
                  style={{ backgroundColor: colorData.hex }}
                />
                <div className="text-xs space-y-1">
                  <div className="text-stone-400 uppercase tracking-wider">Sắc màu chủ đạo</div>
                  <div className="font-semibold text-stone-900 text-sm">{colorData.name}</div>
                  <div className="text-stone-500 font-mono text-[11px]">{colorData.hex} · Hành {colorData.element}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 text-xs space-y-1.5">
                <div className="text-stone-400 uppercase tracking-wider">Thời kỳ lịch sử</div>
                <div className="font-medium text-stone-800 text-sm">{outfitData.era}</div>
                <div className="text-stone-500">Giới tính: {gender === 'female' ? 'Nữ giới' : 'Nam giới'} · Họa tiết: {pattern}</div>
              </div>
            </div>

            {/* Accessories Chosen */}
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-400 mb-2 font-medium">
                Phụ kiện phối kết (Remix Elements)
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedAccessories.length === 0 ? (
                  <span className="text-xs italic text-stone-500">Thuần mộc, chưa gắn thêm phụ kiện</span>
                ) : (
                  selectedAccessories.map((acc) => (
                    <span
                      key={acc.id}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-700"
                    >
                      <span>{acc.emoji}</span>
                      <span className="font-medium">{acc.name}</span>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Philosophy quote */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border-l-4 border-[#C82A27] text-stone-800 text-sm leading-relaxed font-serif">
              <p className="font-medium text-[#8D1815] mb-1 font-sans text-xs uppercase tracking-wide">
                Triết lý trang phục:
              </p>
              "{outfitData.philosophy}"
            </div>

            {/* Citation */}
            <div className="text-[11px] text-stone-400 italic pt-2 border-t border-stone-100 flex items-center justify-between">
              <span>{outfitData.referenceCitation}</span>
              <span>Hà Nội · Huế · TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleCopyRecipe}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-medium transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép công thức!' : 'Sao chép công thức phối'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C82A27] hover:bg-[#A8221F] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang xuất thẻ...' : 'Tải ảnh thẻ Lookbook (HD)'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
