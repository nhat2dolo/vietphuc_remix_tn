import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { OutfitId, GenderMode, PatternId, AccessoryId } from '../types/vietphuc';
import { OUTFITS, TRADITIONAL_COLORS, ACCESSORIES } from '../data/vietphucData';
import { normalizeVietnameseText } from '../utils/textUtils';
import { MannequinViewer } from './MannequinViewer';
import { Bookmark, Trash2, ArrowRight, X, Share2, Check, Sparkles } from 'lucide-react';

export interface SavedLookItem {
  id: string;
  name: string;
  savedAt: string;
  outfit: OutfitId;
  gender: GenderMode;
  colorId: string;
  secondaryColorHex: string;
  pattern: PatternId;
  accessories: AccessoryId[];
}

const STORAGE_KEY = 'vietphuc_saved_lookbooks';

export function getSavedLooks(): SavedLookItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLookToStorage(item: Omit<SavedLookItem, 'id' | 'savedAt'>): SavedLookItem {
  const looks = getSavedLooks();
  const newItem: SavedLookItem = {
    ...item,
    name: normalizeVietnameseText(item.name),
    id: `look-${Date.now()}`,
    savedAt: new Date().toLocaleDateString('vi-VN'),
  };
  looks.unshift(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(looks.slice(0, 30)));
  return newItem;
}

interface SavedLookbooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLook: (look: SavedLookItem) => void;
}

export const SavedLookbooksModal: React.FC<SavedLookbooksModalProps> = ({
  isOpen,
  onClose,
  onApplyLook,
}) => {
  const [looks, setLooks] = useState<SavedLookItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLooks(getSavedLooks());
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'auto';
      };
    }
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleDelete = (id: string) => {
    const updated = looks.filter((l) => l.id !== id);
    setLooks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleShareLook = async (look: SavedLookItem) => {
    const outfit = OUTFITS[look.outfit];
    const color = TRADITIONAL_COLORS.find((c) => c.id === look.colorId) || TRADITIONAL_COLORS[0];
    const accList = look.accessories
      .map((aId) => ACCESSORIES.find((a) => a.id === aId)?.name)
      .filter(Boolean)
      .join(', ');

    const shareText = normalizeVietnameseText(`🇻🇳 [VIỆT PHỤC REMIX] Look: "${look.name}"
Cổ phục: ${outfit.name} (${outfit.era})
Màu sắc: ${color.name} [${color.hex}]
Phụ kiện remix: ${accList || 'Không'}
Triết lý: "${outfit.philosophy}"`);

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedId(look.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF7F2] to-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C82A27] text-white flex items-center justify-center shadow-md">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                Lookbook Của Tôi ({looks.length})
              </h3>
              <p className="text-xs text-stone-500 font-serif italic">
                Các bản phối di sản do bạn tự tay sáng tạo và lưu giữ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {looks.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Bookmark className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-stone-700 text-lg">
                Chưa có bản phối nào được lưu
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto font-serif">
                Hãy vào Fitting Studio, chọn trang phục yêu thích và nhấn "Lưu Vào Lookbook Của Tôi" để xây dựng bộ sưu tập thời trang cổ phong cá nhân!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {looks.map((look) => {
                const outfit = OUTFITS[look.outfit];
                const color =
                  TRADITIONAL_COLORS.find((c) => c.id === look.colorId) || TRADITIONAL_COLORS[0];

                return (
                  <div
                    key={look.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-[#FAF7F2] flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D1815]">
                          {look.savedAt}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleShareLook(look)}
                            className="p-1.5 rounded-lg text-stone-500 hover:bg-white transition-colors cursor-pointer"
                            title="Sao chép công thức phối"
                          >
                            {copiedId === look.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(look.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                            title="Xóa bản phối"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="w-full h-44 rounded-xl overflow-hidden bg-white border border-stone-200/80 flex items-center justify-center">
                        <MannequinViewer
                          outfit={look.outfit}
                          gender={look.gender}
                          colorHex={color.hex}
                          secondaryColorHex={look.secondaryColorHex}
                          pattern={look.pattern}
                          accessories={look.accessories}
                        />
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-stone-900 text-sm truncate">
                          {look.name}
                        </h4>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{outfit.name}</span>
                          <span>· Sắc {color.name}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onApplyLook(look);
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#C82A27] hover:text-white border border-stone-200 text-stone-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Mặc lên Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
