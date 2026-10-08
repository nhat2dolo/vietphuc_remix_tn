import React, { useState } from 'react';
import { QUIZ_QUESTIONS, OUTFITS } from '../data/vietphucData';
import { OutfitId } from '../types/vietphuc';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface PersonalityQuizProps {
  onApplyResult: (outfit: OutfitId) => void;
}

export const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({ onApplyResult }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OutfitId[]>([]);
  const [resultOutfit, setResultOutfit] = useState<OutfitId | null>(null);

  const handleSelectOption = (targetOutfit: OutfitId) => {
    const updated = [...answers, targetOutfit];
    setAnswers(updated);

    if (currentStep + 1 < QUIZ_QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate most picked outfit or fallback
      const counts: Record<string, number> = {};
      updated.forEach((o) => {
        counts[o] = (counts[o] || 0) + 1;
      });
      let highestOutfit: OutfitId = updated[0];
      let maxCount = 0;
      Object.entries(counts).forEach(([outfitKey, count]) => {
        if (count > maxCount) {
          maxCount = count;
          highestOutfit = outfitKey as OutfitId;
        }
      });
      setResultOutfit(highestOutfit);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultOutfit(null);
  };

  if (resultOutfit) {
    const outfitInfo = OUTFITS[resultOutfit];
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C82A27]/10 text-[#C82A27] text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kết Quả Định Danh Phong Cách</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
          Bạn chính là hiện thân của: <br />
          <span className="text-[#C82A27]">{outfitInfo.name}</span>
        </h3>

        <p className="text-stone-600 font-serif italic text-base">
          "{outfitInfo.tagline}"
        </p>

        <p className="text-sm text-stone-700 leading-relaxed text-left bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
          {outfitInfo.desc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onApplyResult(resultOutfit)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#C82A27] hover:bg-[#A8221F] hover:-translate-y-1 hover:shadow-lg text-white text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer active:translate-y-0 active:scale-95"
          >
            <span>Khoác lên bộ {outfitInfo.name} ngay!</span>
            <ArrowRight className="w-4 h-4 transition-transform hover:translate-x-1" />
          </button>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-stone-300 hover:border-stone-400 hover:bg-stone-100 hover:-translate-y-0.5 hover:shadow-xs text-stone-700 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 transition-transform hover:-rotate-45" />
            <span>Thử lại trắc nghiệm</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-100 pb-3 font-sans">
        <span className="uppercase tracking-widest font-semibold text-[#8D1815]">
          Quiz Vui: Cổ Phục Hợp Vibe Của Bạn
        </span>
        <span className="font-mono">
          Câu {currentStep + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-display font-bold text-stone-900 leading-snug">
        {currentQ.question}
      </h3>

      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectOption(opt.targetOutfit)}
            className="w-full text-left p-4 rounded-xl border border-stone-200 hover:border-[#C82A27] hover:bg-[#FFF5F4] hover:-translate-y-1 hover:shadow-md transition-all duration-200 group flex items-center justify-between cursor-pointer active:scale-[0.98]"
          >
            <span className="text-sm text-stone-800 font-semibold group-hover:text-[#C82A27] transition-colors">
              {opt.text}
            </span>
            <span className="text-xs text-stone-400 group-hover:text-[#8D1815] shrink-0 ml-2 transition-colors">
              #{opt.trait}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
