import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import { ALL_STICKERS, StickerItem } from '../data/stickersData';
import { MODEL_PRESETS, ModelPreset } from '../data/modelPresets';
import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  FlipHorizontal,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  Info,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Image as ImageIcon,
  Check,
  X,
} from 'lucide-react';

export const VirtualTryOn: React.FC = () => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStickerInfo, setSelectedStickerInfo] = useState<StickerItem | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.FabricObject | null>(null);
  const [culturalWarning, setCulturalWarning] = useState<string | null>(null);
  const [isWarningDismissed, setIsWarningDismissed] = useState<boolean>(false);

  // Background and Onboarding
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const [currentBgPreset, setCurrentBgPreset] = useState<ModelPreset>(MODEL_PRESETS[0]);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);

  // Undo / Redo history
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef<boolean>(false);

  // Save state to undo history
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current || isUndoRedoRef.current) return;
    try {
      const json = JSON.stringify(fabricCanvasRef.current.toJSON());
      // Truncate redo steps
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(json);
      // Limit to 20 states
      if (newHistory.length > 20) newHistory.shift();
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
    } catch {
      // ignore
    }
  }, []);

  // Update background image on Fabric canvas
  const setCanvasBackground = useCallback((imageUrl: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!canvas) return;
        // Scale to fit canvas dimensions nicely
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const scaleX = canvasWidth / img.width;
        const scaleY = canvasHeight / img.height;
        const scale = Math.max(scaleX, scaleY);

        img.set({
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'center',
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          selectable: false,
          evented: false,
        });

        canvas.backgroundImage = img;
        canvas.renderAll();
        saveState();
      })
      .catch((err) => {
        console.error('Failed to load background image:', err);
      });
  }, [saveState]);

  // Check cultural combinations present on canvas
  const evaluateCulturalCombinations = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    const categoriesOnCanvas = new Set<string>();
    const namesOnCanvas: string[] = [];

    objects.forEach((obj) => {
      // Custom attached metadata
      const meta = (obj as unknown as { stickerMeta?: StickerItem }).stickerMeta;
      if (meta) {
        categoriesOnCanvas.add(meta.category);
        namesOnCanvas.push(meta.id);
      }
    });

    let warning: string | null = null;
    if (categoriesOnCanvas.has('aodai') && namesOnCanvas.includes('pk-khan-ran')) {
      warning = 'Khăn rằn phối cùng Áo Dài là nét chấm phá đường phố rất cá tính, phù hợp dạo phố du xuân!';
    } else if (categoriesOnCanvas.has('tuthan') && (namesOnCanvas.includes('pk-man-do') || namesOnCanvas.includes('pk-man-vang'))) {
      warning = 'Áo tứ thân truyền thống Bắc Bộ thường đi liền với nón quai thao hoặc mỏ quạ. Đội mấn là phong cách cách tân giao thoa.';
    } else if (namesOnCanvas.includes('pk-sneaker')) {
      warning = 'Phối cổ phục cùng Sneaker chunky cực kỳ năng động! Hãy xắn gấu quần trên mắt cá để tránh vấp tà áo.';
    } else if (namesOnCanvas.includes('pk-kinh-ram') || namesOnCanvas.includes('pk-headphone')) {
      warning = 'Sự kết hợp giữa phụ kiện công nghệ hiện đại và lụa là truyền thống tạo nên thần thái Cyber Heritage rất cuốn hút!';
    } else if (categoriesOnCanvas.has('baba') && namesOnCanvas.includes('pk-khan-ran')) {
      warning = 'Áo Bà Ba đi cùng Khăn Rằn là bộ đôi chuẩn mực, mộc mạc và thân thương của người dân Nam Bộ.';
    }

    setCulturalWarning((prev) => {
      if (prev !== warning) {
        setIsWarningDismissed(false);
      }
      return warning;
    });
  }, []);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    // Responsive dimensions
    const container = containerRef.current;
    const width = Math.min(container.clientWidth || 380, 480);
    const height = Math.min(window.innerHeight * 0.58, 620);

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width,
      height,
      preserveObjectStacking: true,
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Load initial background
    setCanvasBackground(customBgUrl || currentBgPreset.dataUri);

    // Event listeners
    const handleSelection = () => {
      const active = canvas.getActiveObject();
      setActiveObject(active || null);
      if (active) {
        const meta = (active as unknown as { stickerMeta?: StickerItem }).stickerMeta;
        if (meta) setSelectedStickerInfo(meta);
      } else {
        setSelectedStickerInfo(null);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
      setActiveObject(null);
      setSelectedStickerInfo(null);
    });

    canvas.on('object:modified', () => {
      saveState();
      evaluateCulturalCombinations();
    });

    canvas.on('object:added', () => {
      evaluateCulturalCombinations();
    });

    canvas.on('object:removed', () => {
      evaluateCulturalCombinations();
    });

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [currentBgPreset, customBgUrl, setCanvasBackground, saveState, evaluateCulturalCombinations]);

  // Add Sticker to Canvas with Anatomical Grounding & Single-Item Replacement
  const addStickerToCanvas = (item: StickerItem) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Prevent multiple overlapping hats, robes, or shoes:
    // Remove conflicting item of the same major type before adding the new one
    if (['mu', 'ao', 'giay'].includes(item.type)) {
      const existingConflicting = canvas.getObjects().filter((obj) => {
        const meta = (obj as unknown as { stickerMeta?: StickerItem }).stickerMeta;
        return meta && meta.type === item.type;
      });
      existingConflicting.forEach((obj) => canvas.remove(obj));
    }

    fabric.FabricImage.fromURL(item.svgDataUri, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!canvas) return;

        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Anatomically anchored positioning and scaling based on model coordinates
        let posX = canvasWidth / 2;
        let posY = canvasHeight / 2;
        let baseScale = 0.75;

        if (item.type === 'mu') {
          // Anchored directly on top of head crown (no floating hat, no clipping through skull)
          posY = canvasHeight * 0.155;
          baseScale = item.id.includes('quai-thao') ? 0.75 : item.id.includes('non-la') ? 0.72 : 0.65;
        } else if (item.type === 'ao') {
          // Anchored cleanly at chest and torso down to hem
          posY = canvasHeight * 0.44;
          baseScale = item.category === 'baba' ? 0.9 : 0.95;
        } else if (item.type === 'giay') {
          // Anchored at feet level
          posY = canvasHeight * 0.89;
          baseScale = 0.55;
        } else if (item.type === 'khan') {
          // Anchored around neck and collar
          posY = canvasHeight * 0.31;
          baseScale = 0.72;
        } else if (item.id === 'pk-kinh-ram') {
          posY = canvasHeight * 0.155;
          baseScale = 0.55;
        } else if (item.id === 'pk-chuoi-ngoc') {
          posY = canvasHeight * 0.26;
          baseScale = 0.65;
        } else if (item.id === 'pk-quat') {
          posX = canvasWidth * 0.72;
          posY = canvasHeight * 0.45;
          baseScale = 0.65;
        } else if (item.id === 'pk-tui-coi') {
          posX = canvasWidth * 0.28;
          posY = canvasHeight * 0.46;
          baseScale = 0.62;
        } else if (item.id === 'pk-headphone') {
          posY = canvasHeight * 0.21;
          baseScale = 0.62;
        }

        img.set({
          left: posX,
          top: posY,
          originX: 'center',
          originY: 'center',
          scaleX: baseScale,
          scaleY: baseScale,
          cornerColor: '#C82A27',
          cornerStrokeColor: '#ffffff',
          borderColor: '#C82A27',
          cornerSize: 10,
          transparentCorners: false,
        });

        // Attach custom sticker metadata
        (img as unknown as { stickerMeta: StickerItem }).stickerMeta = item;

        canvas.add(img);

        // Natural layer ordering: robes in back, headphone behind neck/collar, headwear & accessories on top
        if (item.type === 'ao' || item.id === 'pk-headphone') {
          canvas.sendObjectBackwards(img);
        } else {
          canvas.bringObjectToFront(img);
        }

        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState();
        setSelectedStickerInfo(item);
        evaluateCulturalCombinations();
      })
      .catch((err) => {
        console.error('Failed to load sticker:', err);
      });
  };

  // Object Control Actions
  const handleDeleteActive = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeObject) return;
    canvas.remove(activeObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    setActiveObject(null);
    setSelectedStickerInfo(null);
    saveState();
    evaluateCulturalCombinations();
  };

  const handleFlipActive = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeObject) return;
    activeObject.set('flipX', !activeObject.flipX);
    canvas.renderAll();
    saveState();
  };

  const handleMoveUp = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeObject) return;
    canvas.bringObjectForward(activeObject);
    canvas.renderAll();
    saveState();
  };

  const handleMoveDown = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeObject) return;
    canvas.sendObjectBackwards(activeObject);
    canvas.renderAll();
    saveState();
  };

  const handleScaleStep = (delta: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeObject) return;
    const currentScale = activeObject.scaleX || 1;
    const nextScale = Math.max(0.2, Math.min(2.5, currentScale + delta));
    activeObject.set({ scaleX: nextScale, scaleY: nextScale });
    canvas.renderAll();
    saveState();
  };

  const handleRotateStep = (degrees: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeObject) return;
    const currentAngle = activeObject.angle || 0;
    activeObject.set('angle', (currentAngle + degrees) % 360);
    canvas.renderAll();
    saveState();
  };

  const handleToggleLock = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeObject) return;
    const isLocked = activeObject.lockMovementX;
    activeObject.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
    });
    canvas.renderAll();
    saveState();
  };

  // Top Bar Actions
  const handleUndo = () => {
    if (historyIndexRef.current <= 0 || !fabricCanvasRef.current) return;
    isUndoRedoRef.current = true;
    historyIndexRef.current -= 1;
    const prevState = historyRef.current[historyIndexRef.current];
    fabricCanvasRef.current.loadFromJSON(JSON.parse(prevState)).then(() => {
      fabricCanvasRef.current?.renderAll();
      isUndoRedoRef.current = false;
      evaluateCulturalCombinations();
    });
  };

  const handleRedo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1 || !fabricCanvasRef.current) return;
    isUndoRedoRef.current = true;
    historyIndexRef.current += 1;
    const nextState = historyRef.current[historyIndexRef.current];
    fabricCanvasRef.current.loadFromJSON(JSON.parse(nextState)).then(() => {
      fabricCanvasRef.current?.renderAll();
      isUndoRedoRef.current = false;
      evaluateCulturalCombinations();
    });
  };

  const handleResetCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    // Remove all sticker objects except background
    const objects = [...canvas.getObjects()];
    objects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    setActiveObject(null);
    setSelectedStickerInfo(null);
    setCulturalWarning(null);
    saveState();
  };

  // Download Output Image
  const handleDownloadImage = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Deselect object first so bounding box controls are hidden in exported image
    canvas.discardActiveObject();
    canvas.renderAll();

    // Create high-res data URL
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // 2x for retina quality
    });

    const link = document.createElement('a');
    link.download = `viet-phuc-remix-virtual-tryon-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // Upload Custom Background Image
  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomBgUrl(result);
        setCanvasBackground(result);
        setShowSetupModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload Custom PNG Sticker
  const handleCustomStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const customItem: StickerItem = {
          id: `custom-${Date.now()}`,
          category: 'phukien',
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'phukien',
          svgDataUri: result,
          info: 'Sticker tùy chỉnh tải lên từ máy tính/điện thoại của bạn.',
        };
        addStickerToCanvas(customItem);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filtered stickers for drawer
  const filteredStickers = activeCategory === 'all'
    ? ALL_STICKERS
    : ALL_STICKERS.filter((s) => s.category === activeCategory);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'aodai', name: 'Áo Dài' },
    { id: 'nguthan', name: 'Ngũ Thân' },
    { id: 'nhatbinh', name: 'Nhật Bình' },
    { id: 'tuthan', name: 'Tứ Thân' },
    { id: 'baba', name: 'Bà Ba' },
    { id: 'phukien', name: 'Phụ Kiện' },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#8D1815] font-sans font-semibold mb-1">
            VIRTUAL TRY-ON STUDIO · KÉO THẢ PHỤC TRANG & THỬ ĐỒ TRỰC TIẾP
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
            Thử Đồ Ảo: Trực Tiếp Ướm Cổ Phục Lên Ảnh Của Bạn
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5">
            Tải ảnh của bạn hoặc chọn người mẫu sẵn có, kéo thả áo dài, ngũ thân, nón lá, sneaker và tạo dáng ấn tượng
          </p>
        </div>

        {/* Change Background / Upload Photo Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSetupModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 hover:border-[#C82A27] hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-95 text-stone-800 text-xs font-semibold transition-all duration-200 shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#C82A27]" />
            <span>Đổi người mẫu / Tải ảnh bạn</span>
          </button>
        </div>
      </div>

      {/* Main Studio Frame (Mobile-first responsive card container) */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-md border border-stone-200/90 overflow-hidden flex flex-col">
        {/* Top Tools Bar inside Frame */}
        <div className="bg-[#C82A27] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Thử Đồ Trực Tiếp 🇻🇳</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={handleUndo}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 hover:-translate-y-0.5 active:scale-95 text-white transition-all duration-150 cursor-pointer"
              title="Hoàn tác (Undo)"
              aria-label="Hoàn tác"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 hover:-translate-y-0.5 active:scale-95 text-white transition-all duration-150 cursor-pointer"
              title="Làm lại (Redo)"
              aria-label="Làm lại"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetCanvas}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 hover:-translate-y-0.5 active:scale-95 text-white transition-all duration-150 cursor-pointer"
              title="Làm mới (Clear)"
              aria-label="Làm mới"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E4A025] hover:bg-[#c9891c] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 text-stone-900 font-bold transition-all duration-200 cursor-pointer shadow-xs ml-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải ảnh</span>
            </button>
          </div>
        </div>

        {/* Canvas Workspace Area */}
        <div
          ref={containerRef}
          className="relative bg-stone-100 flex items-center justify-center overflow-hidden min-h-[460px] sm:min-h-[520px]"
        >
          {/* Real Fabric.js HTML5 Canvas */}
          <canvas ref={canvasElRef} className="touch-none" />

          {/* Cultural Warnings & Info Overlay (Top Left) */}
          <div className="absolute top-3 left-3 right-16 pointer-events-none flex flex-col gap-2 z-10">
            {culturalWarning && !isWarningDismissed && (
              <div
                id="remixAlertBox"
                className="remix-alert-box pointer-events-auto animate-in fade-in duration-200"
              >
                <div className="alert-header">
                  <div className="alert-title">
                    <span className="alert-icon">⚠️</span>
                    <strong>Lưu ý Remix:</strong>
                  </div>
                  {/* Nút đóng dấu x */}
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setIsWarningDismissed(true)}
                    aria-label="Đóng"
                  >
                    &times;
                  </button>
                </div>
                <p className="alert-content">
                  {culturalWarning}
                </p>
              </div>
            )}

            {selectedStickerInfo && (
              <div className="pointer-events-auto p-3 rounded-xl bg-white/95 backdrop-blur-xs border-l-4 border-[#1F4F89] text-stone-900 shadow-md text-xs leading-relaxed animate-in fade-in duration-200">
                <div className="flex items-center justify-between font-bold text-[#1F4F89] mb-0.5">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>{selectedStickerInfo.name}</span>
                  </span>
                  <button
                    onClick={() => setSelectedStickerInfo(null)}
                    className="text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-stone-700">{selectedStickerInfo.info}</div>
              </div>
            )}
          </div>

          {/* Floating Object Controls (Right Side when object is active) */}
          {activeObject && (
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={handleDeleteActive}
                className="w-9 h-9 rounded-full bg-white hover:bg-rose-50 border border-stone-300 text-rose-600 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Xóa vật phẩm này"
                aria-label="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleFlipActive}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Lật ngang (Flip)"
                aria-label="Lật ngang"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRotateStep(15)}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Xoay 15°"
                aria-label="Xoay"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScaleStep(0.1)}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Phóng to"
                aria-label="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScaleStep(-0.1)}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Thu nhỏ"
                aria-label="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleMoveUp}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Đưa lên trên (Bring forward)"
                aria-label="Đưa lên trên"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={handleMoveDown}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Hạ xuống dưới (Send backward)"
                aria-label="Hạ xuống dưới"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleLock}
                className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Khóa / Mở khóa vị trí"
                aria-label="Khóa vị trí"
              >
                {activeObject.lockMovementX ? <Lock className="w-4 h-4 text-amber-600" /> : <Unlock className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Sticker Drawer (Bottom Container) */}
        <div className="bg-white border-t border-stone-200 flex flex-col">
          {/* Drawer Tabs */}
          <div className="flex gap-2 overflow-x-auto px-4 py-2.5 bg-stone-50 border-b border-stone-200/70 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border hover:-translate-y-0.5 hover:shadow-xs active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-[#E4A025] text-stone-900 border-[#E4A025] shadow-xs'
                    : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {/* Custom Sticker Upload button */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white text-[#C82A27] border border-[#C82A27] hover:bg-[#FFF5F4] hover:-translate-y-0.5 hover:shadow-xs active:scale-95 transition-all duration-200 cursor-pointer shrink-0">
              <Upload className="w-3 h-3" />
              <span>Thêm Sticker PNG</span>
              <input
                type="file"
                accept="image/png, image/webp"
                className="hidden"
                onChange={handleCustomStickerUpload}
              />
            </label>
          </div>

          {/* Sticker Grid Items */}
          <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-52 overflow-y-auto">
            {filteredStickers.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => addStickerToCanvas(sticker)}
                className="group aspect-square rounded-2xl border-2 border-dashed border-stone-200 hover:border-[#C82A27] bg-stone-50/50 hover:bg-[#FFF5F4] p-1.5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer relative hover:-translate-y-1 hover:shadow-md active:scale-95"
                title={`Nhấn để thêm: ${sticker.name}`}
              >
                <img
                  src={sticker.svgDataUri}
                  alt={sticker.name}
                  className="max-w-full max-h-full object-contain pointer-events-none group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-[10px] text-stone-600 group-hover:text-[#8D1815] font-medium truncate w-full text-center mt-1 transition-colors">
                  {sticker.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Setup / Background & Model Selection Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-xl font-display font-bold text-stone-900">
                Chọn Người Mẫu & Tải Ảnh Nền
              </h3>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-1 rounded-full text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Choose from preset models */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">
                Cách 1: Chọn Người Mẫu Sẵn Có
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {MODEL_PRESETS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCurrentBgPreset(m);
                      setCustomBgUrl(null);
                      setCanvasBackground(m.dataUri);
                      setShowSetupModal(false);
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                      currentBgPreset.id === m.id && !customBgUrl
                        ? 'border-[#C82A27] bg-[#FFF5F4] text-[#8D1815] font-semibold'
                        : 'border-stone-200 hover:border-stone-400 bg-stone-50/50 text-stone-700'
                    }`}
                  >
                    <div className="w-12 h-16 mx-auto rounded-lg overflow-hidden border border-black/10 mb-1.5 shadow-2xs">
                      <img src={m.dataUri} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs font-medium truncate">{m.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Upload personal background photo */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">
                Cách 2: Tải Ảnh Chụp Của Chính Bạn
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Nên dùng ảnh chụp thẳng toàn thân hoặc nửa người, phông nền đơn giản để ướm trang phục vừa vặn nhất.
              </p>

              {/* Privacy Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-[#C82A27] focus:ring-[#C82A27]"
                />
                <span>
                  Tôi xác nhận đây là ảnh của tôi hoặc tôi đã có sự đồng ý của người trong ảnh.
                  <strong> Ảnh chỉ xử lý trực tiếp trên thiết bị (client-side), không bao giờ lưu trữ lên máy chủ.</strong>
                </span>
              </label>

              {/* File upload button */}
              <label
                className={`w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  privacyAgreed
                    ? 'bg-[#C82A27] hover:bg-[#A8221F] text-white shadow-sm'
                    : 'bg-stone-200 text-stone-400 pointer-events-none'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Tải ảnh từ máy tính / điện thoại</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  disabled={!privacyAgreed}
                  onChange={handleBgFileUpload}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
