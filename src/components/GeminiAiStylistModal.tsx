import React, { useState } from 'react';
import { OutfitData, TraditionalColor, AccessoryData } from '../types/vietphuc';
import {
  analyzeOutfitWithGemini,
  chatWithHeritageStylist,
  getStoredApiKey,
  setStoredApiKey,
  StylingAnalysisResult,
} from '../services/geminiService';
import {
  Sparkles,
  Bot,
  Key,
  Send,
  Loader2,
  CheckCircle2,
  X,
  ShieldCheck,
  Compass,
  MessageSquare,
} from 'lucide-react';

interface GeminiAiStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfitData: OutfitData;
  colorData: TraditionalColor;
  secondaryColorHex: string;
  accessories: AccessoryData[];
  gender: string;
}

export const GeminiAiStylistModal: React.FC<GeminiAiStylistModalProps> = ({
  isOpen,
  onClose,
  outfitData,
  colorData,
  secondaryColorHex,
  accessories,
  gender,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<StylingAnalysisResult | null>(null);

  // Chat states
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'gemini'; text: string }>>([
    {
      sender: 'gemini',
      text: `Xin chào! Tôi là Trợ lý AI Cố vấn Văn hóa & Phong cách Việt Phục Remix (hỗ trợ bởi Google Gemini). Hãy bấm "Phân Tích Bản Phối" hoặc gửi câu hỏi để cùng tôi khám phá trang phục ${outfitData.name} nhé!`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    setStoredApiKey(apiKey);
    setShowKeyInput(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeOutfitWithGemini({
        outfit: outfitData,
        color: colorData,
        secondaryColorHex,
        accessories,
        gender,
      });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || chatLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const reply = await chatWithHeritageStylist(userMsg, {
        outfitName: outfitData.name,
        colorName: colorData.name,
        accessories: accessories.map((a) => a.name),
      });
      setMessages((prev) => [...prev, { sender: 'gemini', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'gemini',
          text: 'Rất tiếc có lỗi xảy ra khi kết nối tới AI. Hãy thử lại sau nhé!',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF7F2] to-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C82A27] text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                  Gemini Heritage Stylist AI
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-stone-500 font-serif italic">
                Cố vấn văn hóa & thẩm mỹ phục trang ứng dụng Google GenAI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors border border-stone-200 text-xs flex items-center gap-1.5 cursor-pointer"
              title="Cài đặt Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API Key</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Banner Config if active */}
        {showKeyInput && (
          <div className="bg-blue-50/70 border-b border-blue-200 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-900">
                Nhập Google Gemini API Key (Không bắt buộc - Có sẵn AI Engine dự phòng):
              </span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline font-medium"
              >
                Lấy key miễn phí tại Google AI Studio ↗
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Dán AI Studio API Key (AIzaSy...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-blue-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Lưu Key
              </button>
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action Trigger for Outfit Analysis */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8D1815] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#C82A27]" />
                <span>Bản Phối Đang Chọn:</span>
              </div>
              <div className="text-sm font-semibold text-stone-900 mt-0.5">
                {outfitData.name} · Sắc {colorData.name} ({colorData.element})
              </div>
              <div className="text-xs text-stone-500 font-serif italic mt-0.5">
                {accessories.length > 0
                  ? `Phụ kiện: ${accessories.map((a) => a.name).join(', ')}`
                  : 'Chưa phối phụ kiện'}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C82A27] hover:bg-[#A8221F] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang phân tích cùng Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Chấm Điểm & Nhận Xét Cùng Gemini AI</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Result Card */}
          {analysis && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4 shadow-sm animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Đánh giá từ Gemini AI
                  </span>
                  <h4 className="font-display font-bold text-lg text-stone-900">
                    {analysis.title}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-[#C82A27]">
                    {analysis.score}
                    <span className="text-xs text-stone-400 font-sans">/100</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50">
                    Độ Hài Hòa Xuất Sắc
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                {analysis.verdict}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Góc Nhìn Văn Hóa & Lịch Sử</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">{analysis.culturalInsight}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                  <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mẹo Styling Cho Gen Z</span>
                  </div>
                  <p className="text-blue-800 leading-relaxed">{analysis.modernStylingAdvice}</p>
                </div>
              </div>
            </div>
          )}

          {/* Chat with Gemini Assistant */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
              <MessageSquare className="w-4 h-4 text-[#C82A27]" />
              <span>Hỏi Đáp Thời Gian Thực Cùng Cố Vấn Gemini</span>
            </div>

            <div className="h-48 overflow-y-auto p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#C82A27] text-white rounded-br-none'
                        : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2 text-stone-400 italic">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini đang suy nghĩ câu trả lời...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Ví dụ: Phối áo ngũ thân với sneaker cổ cao đi chụp ảnh Tết có ổn không?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C82A27]/20 focus:border-[#C82A27] bg-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || chatLoading}
                className="px-4 py-2.5 rounded-xl bg-[#C82A27] hover:bg-[#A8221F] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
