import React, { useState } from 'react';
import { CulturalWarning } from '../types/vietphuc';
import { AlertCircle, Lightbulb, HeartHandshake, ShieldCheck } from 'lucide-react';

interface CulturalGuideProps {
  warnings: CulturalWarning[];
}

export const CulturalGuide: React.FC<CulturalGuideProps> = ({ warnings }) => {
  const [dismissedTitles, setDismissedTitles] = useState<Set<string>>(new Set());

  const activeWarnings = warnings.filter((item) => !dismissedTitles.has(item.title));
  if (activeWarnings.length === 0) return null;

  const handleDismiss = (title: string) => {
    setDismissedTitles((prev) => new Set(prev).add(title));
  };

  return (
    <div className="space-y-3">
      {activeWarnings.map((item, index) => {
        let borderColor = 'border-amber-400 bg-amber-50/70 text-amber-950';
        let icon = <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;

        if (item.severity === 'praise') {
          borderColor = 'border-emerald-400 bg-emerald-50/70 text-emerald-950';
          icon = <HeartHandshake className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
        } else if (item.severity === 'tip') {
          borderColor = 'border-blue-400 bg-blue-50/70 text-blue-950';
          icon = <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={index}
            className={`p-4 rounded-xl border-l-4 border shadow-sm transition-all animate-in fade-in duration-300 relative group ${borderColor}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div className="space-y-1 text-xs sm:text-sm flex-1 pr-6">
                <div className="font-semibold flex items-center gap-2 flex-wrap">
                  <span>{item.title}</span>
                  {item.severity === 'praise' && (
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Góc Nhìn Gen Z
                    </span>
                  )}
                  {item.severity === 'tip' && (
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Tri Thức Cổ Phong
                    </span>
                  )}
                  {item.severity === 'note' && (
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Lưu Ý Ứng Xử
                    </span>
                  )}
                </div>
                <p className="leading-relaxed opacity-90">{item.message}</p>
                {item.historyContext && (
                  <div className="text-[11px] pt-1.5 opacity-75 italic border-t border-black/5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 inline" />
                    <span>Nguồn gốc: {item.historyContext}</span>
                  </div>
                )}
              </div>

              {/* Nút đóng dấu x */}
              <button
                type="button"
                onClick={() => handleDismiss(item.title)}
                className="close-btn absolute top-3 right-3 text-stone-400 hover:text-stone-800 p-1 rounded hover:bg-black/5 cursor-pointer transition-colors leading-none font-bold text-base"
                aria-label="Đóng"
                title="Đóng lưu ý này"
              >
                &times;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
