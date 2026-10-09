import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Sparkles,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  Shirt,
  Layers,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

export const VirtualTryOn: React.FC = () => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // 1. Quản lý trạng thái Collapsible Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStickerInfo, setSelectedStickerInfo] = useState<StickerItem | null>(null);
  const [isInfoFading, setIsInfoFading] = useState<boolean>(false);
  const infoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const infoAnimTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeObject, setActiveObject] = useState<fabric.FabricObject | null>(null);
  const [culturalWarning, setCulturalWarning] = useState<string | null>(null);
  const [isWarningDismissed, setIsWarningDismissed] = useState<boolean>(false);

  // Background and Onboarding
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(false);
  const [currentBgPreset, setCurrentBgPreset] = useState<ModelPreset>(MODEL_PRESETS[0]);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);

  // Lock body scroll when setup modal is open
  useEffect(() => {
    if (!showSetupModal) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || 'auto';
    };
  }, [showSetupModal]);

  // Undo / Redo history
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef<boolean>(false);

  // Base virtual model dimensions (tỷ lệ chuẩn mực 2:3)
  const BASE_WIDTH = 400;
  const BASE_HEIGHT = 600;

  // Save state to undo history
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current || isUndoRedoRef.current) return;
    try {
      const json = JSON.stringify(fabricCanvasRef.current.toJSON());
      const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      newHistory.push(json);
      if (newHistory.length > 25) newHistory.shift();
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
    } catch {
      // ignore
    }
  }, []);

  // Update background image on Fabric canvas and re-render
  const setCanvasBackground = useCallback((imageUrl: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!canvas) return;
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        // Background scales to completely fit canvas frame
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

  // 3. Thuật toán hiển thị Người Mẫu Toàn Thân (Head-to-Toe - KHÔNG crop đầu chân)
  const adjustCanvasDimensions = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const containerWidth = container.clientWidth || 400;
    const containerHeight = container.clientHeight || 600;

    // Tỷ lệ chuẩn mực 2:3 (baseWidth: 400, baseHeight: 600)
    // const scale = Math.min(containerWidth / baseWidth, containerHeight / baseHeight) * 0.96;
    const scale = Math.min(containerWidth / BASE_WIDTH, containerHeight / BASE_HEIGHT) * 0.96;

    // Kích thước canvas thực tế
    const targetWidth = Math.round(BASE_WIDTH * scale);
    const targetHeight = Math.round(BASE_HEIGHT * scale);

    const oldWidth = canvas.getWidth();
    const oldHeight = canvas.getHeight();

    canvas.setDimensions({ width: targetWidth, height: targetHeight });

    // Cập nhật lại tỉ lệ các đối tượng và ảnh nền nếu kích thước thay đổi
    if (oldWidth > 0 && oldHeight > 0 && (oldWidth !== targetWidth || oldHeight !== targetHeight)) {
      const zoomRatio = targetWidth / oldWidth;

      // Cập nhật background
      if (canvas.backgroundImage && typeof canvas.backgroundImage === 'object') {
        const bg = canvas.backgroundImage as fabric.FabricImage;
        bg.set({
          scaleX: (bg.scaleX || 1) * zoomRatio,
          scaleY: (bg.scaleY || 1) * zoomRatio,
          left: targetWidth / 2,
          top: targetHeight / 2,
        });
      }

      // Cập nhật các đối tượng trên canvas mà không làm mất trang phục
      canvas.getObjects().forEach((obj) => {
        obj.set({
          left: (obj.left || 0) * zoomRatio,
          top: (obj.top || 0) * zoomRatio,
          scaleX: (obj.scaleX || 1) * zoomRatio,
          scaleY: (obj.scaleY || 1) * zoomRatio,
        });
        obj.setCoords();
      });
    }

    canvas.renderAll();
  }, [BASE_WIDTH, BASE_HEIGHT]);

  // Lắng nghe thay đổi kích thước container khi đóng/mở sidebar hoặc resize cửa sổ
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      adjustCanvasDimensions();
    });

    resizeObserver.observe(containerRef.current);

    // Trigger một nhịp sau khi kết thúc transition 300ms của sidebar
    const timer = setTimeout(() => {
      adjustCanvasDimensions();
    }, 320);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [isSidebarOpen, adjustCanvasDimensions]);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth || 400;
    const containerHeight = container.clientHeight || 600;
    const initialScale = Math.min(containerWidth / BASE_WIDTH, containerHeight / BASE_HEIGHT) * 0.96;

    const initialWidth = Math.round(BASE_WIDTH * initialScale);
    const initialHeight = Math.round(BASE_HEIGHT * initialScale);

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: initialWidth,
      height: initialHeight,
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
  }, [currentBgPreset, customBgUrl, setCanvasBackground, saveState, evaluateCulturalCombinations, BASE_WIDTH, BASE_HEIGHT]);

  // 4. Kéo & thả (Drag and Drop) và Click 1-chạm vào ma-nơ-canh
  const addStickerToCanvasAt = (item: StickerItem, dropX?: number, dropY?: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Prevent multiple overlapping hats, robes, or shoes
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

        // Tỷ lệ scale của canvas so với BASE_WIDTH
        const currentScaleFactor = canvasWidth / BASE_WIDTH;

        // Điểm thả tự do hoặc vị trí tự động tính theo giải phẫu cơ thể
        let posX = dropX !== undefined ? dropX : canvasWidth / 2;
        let posY = dropY !== undefined ? dropY : canvasHeight / 2;
        let baseScale = 0.75 * currentScaleFactor;

        if (dropX === undefined || dropY === undefined) {
          if (item.type === 'mu') {
            posY = canvasHeight * 0.155;
            baseScale = (item.id.includes('quai-thao') ? 0.75 : item.id.includes('non-la') ? 0.72 : 0.65) * currentScaleFactor;
          } else if (item.type === 'ao') {
            posY = canvasHeight * 0.44;
            baseScale = (item.category === 'baba' ? 0.9 : 0.95) * currentScaleFactor;
          } else if (item.type === 'giay') {
            posY = canvasHeight * 0.89;
            baseScale = 0.55 * currentScaleFactor;
          } else if (item.type === 'khan') {
            posY = canvasHeight * 0.31;
            baseScale = 0.72 * currentScaleFactor;
          } else if (item.id === 'pk-kinh-ram') {
            posY = canvasHeight * 0.155;
            baseScale = 0.55 * currentScaleFactor;
          } else if (item.id === 'pk-chuoi-ngoc') {
            posY = canvasHeight * 0.26;
            baseScale = 0.65 * currentScaleFactor;
          } else if (item.id === 'pk-quat') {
            posX = canvasWidth * 0.72;
            posY = canvasHeight * 0.45;
            baseScale = 0.65 * currentScaleFactor;
          } else if (item.id === 'pk-tui-coi') {
            posX = canvasWidth * 0.28;
            posY = canvasHeight * 0.46;
            baseScale = 0.62 * currentScaleFactor;
          } else if (item.id === 'pk-headphone') {
            posY = canvasHeight * 0.21;
            baseScale = 0.62 * currentScaleFactor;
          }
        } else {
          // Khi kéo thả tự do, vẫn giữ scale chuẩn
          if (item.type === 'ao') {
            baseScale = 0.92 * currentScaleFactor;
          } else if (item.type === 'mu') {
            baseScale = 0.68 * currentScaleFactor;
          } else if (item.type === 'giay') {
            baseScale = 0.55 * currentScaleFactor;
          }
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

        // Layer ordering
        if (item.type === 'ao' || item.id === 'pk-headphone') {
          canvas.sendObjectBackwards(img);
        } else {
          canvas.bringObjectToFront(img);
        }

        canvas.setActiveObject(img);
        canvas.renderAll();
        saveState();
        showStickerNotification(item);
        evaluateCulturalCombinations();
      })
      .catch((err) => {
        console.error('Failed to load sticker:', err);
      });
  };

  // Hiển thị thông tin văn hóa sticker với cơ chế tự làm mờ sau 1000ms và hủy khỏi DOM sau 1300ms
  const showStickerNotification = (item: StickerItem) => {
    // Hủy bỏ các timer cũ nếu đang chạy
    if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
    if (infoAnimTimerRef.current) clearTimeout(infoAnimTimerRef.current);

    setSelectedStickerInfo(item);
    setIsInfoFading(false);

    // Sau 1000ms (1s), kích hoạt hiệu ứng mờ dần và trượt nhẹ
    infoTimerRef.current = setTimeout(() => {
      setIsInfoFading(true);
      // Sau 300ms tiếp theo (tổng 1300ms), xóa hoàn toàn khỏi DOM
      infoAnimTimerRef.current = setTimeout(() => {
        setSelectedStickerInfo(null);
        setIsInfoFading(false);
      }, 300);
    }, 1000);
  };

  // Đóng thông báo ngay lập tức khi bấm nút X
  const handleDismissStickerInfo = () => {
    if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
    if (infoAnimTimerRef.current) clearTimeout(infoAnimTimerRef.current);
    setSelectedStickerInfo(null);
    setIsInfoFading(false);
  };

  // Dọn dẹp timer khi component unmount
  useEffect(() => {
    return () => {
      if (infoTimerRef.current) clearTimeout(infoTimerRef.current);
      if (infoAnimTimerRef.current) clearTimeout(infoAnimTimerRef.current);
    };
  }, []);

  const addStickerToCanvas = (item: StickerItem) => {
    addStickerToCanvasAt(item);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, sticker: StickerItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(sticker));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const sticker: StickerItem = JSON.parse(dataStr);
      if (!sticker || !sticker.svgDataUri) return;

      const canvasEl = canvasElRef.current;
      if (!canvasEl) {
        addStickerToCanvas(sticker);
        return;
      }

      const rect = canvasEl.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;

      addStickerToCanvasAt(sticker, dropX, dropY);
    } catch {
      // ignore
    }
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

    canvas.discardActiveObject();
    canvas.renderAll();

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
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

  // Filtered stickers for sidebar
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
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#8D1815] font-sans font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E4A025]" />
            <span>VIRTUAL TRY-ON STUDIO · KÉO THẢ PHỤC TRANG & ƯỚM ĐỒ TOÀN THÂN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
            Thử Đồ Ảo: Trực Tiếp Ướm Cổ Phục Lên Ảnh Của Bạn
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-serif italic mt-0.5">
            Dáng đứng chuẩn mực tỷ lệ 2:3 từ đỉnh đầu đến gót chân — Kéo thả hoặc click chọn trang phục để tự động ướm
          </p>
        </div>

        {/* Action Buttons: Background Setup & Expand Wardrobe */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSetupModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 hover:border-[#C82A27] hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 text-stone-800 text-xs font-semibold transition-all duration-200 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#C82A27]" />
            <span>Đổi người mẫu / Tải ảnh bạn</span>
          </button>

          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C82A27] to-[#8D1815] text-white text-xs font-bold hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer shadow-sm border border-amber-300/30"
              title="Mở tủ đồ"
            >
              <Shirt className="w-4 h-4 text-amber-200" />
              <span>Chọn trang phục</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. BỐ CỤC 2 PHẦN CO GIÃN LINH HOẠT: Canvas bên trái & Tủ đồ trượt xếp bên phải */}
      <div className="relative flex flex-col md:flex-row w-full h-[calc(100vh-170px)] min-h-[580px] max-h-[840px] rounded-3xl overflow-hidden bg-[#0F0D0B] border border-stone-800 shadow-2xl">
        
        {/* CỘT TRÁI (PREVIEW CANVAS AREA) */}
        <div
          ref={containerRef}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          className="relative flex-1 flex flex-col items-center justify-center p-3 sm:p-5 transition-all duration-300 ease-in-out overflow-hidden"
        >
          {/* Top Canvas Bar (Tools: Undo, Redo, Reset, Download) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-lg">
            <button
              onClick={handleUndo}
              className="p-1.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
              title="Hoàn tác (Undo)"
              aria-label="Hoàn tác"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              className="p-1.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
              title="Làm lại (Redo)"
              aria-label="Làm lại"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-white/20 mx-0.5" />
            <button
              onClick={handleResetCanvas}
              className="p-1.5 rounded-xl text-stone-300 hover:text-rose-400 hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
              title="Làm mới trang phục"
              aria-label="Làm mới"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-[#E4A025] to-[#C99700] hover:from-[#f0b037] hover:to-[#dfa705] text-stone-950 font-bold text-xs shadow-sm hover:scale-[1.03] active:scale-95 transition-all cursor-pointer ml-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải ảnh</span>
            </button>
          </div>

          {/* NÚT MỞ LẠI SIDEBAR KHI ĐANG ẨN (Desktop: góc trên bên phải, Mobile: cạnh đáy thuận tiện ngón cái) */}
          {!isSidebarOpen && (
            <>
              {/* Desktop button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden md:flex absolute top-4 right-4 z-20 items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#C82A27] via-[#A8221F] to-[#8D1815] text-white text-xs sm:text-sm font-bold shadow-xl border border-amber-400/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-in fade-in zoom-in-95 group"
              >
                <Shirt className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-200" />
                <span>Chọn trang phục</span>
                <ChevronRight className="w-4 h-4 text-amber-200/80" />
              </button>

              {/* Mobile Floating Button cạnh đáy màn hình thuận tiện cho ngón tay cái */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden absolute bottom-4 right-4 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#C82A27] via-[#A8221F] to-[#8D1815] text-white text-xs font-bold shadow-2xl border border-amber-300/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer animate-in slide-in-from-bottom-3 group"
                aria-label="Mở tủ đồ cổ phục"
              >
                <Shirt className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-200" />
                <span>Mở tủ đồ</span>
                <ChevronUp className="w-4 h-4 text-amber-200" />
              </button>
            </>
          )}

          {/* Cultural Warnings & Info Overlay (Top Left) */}
          <div className="absolute top-16 left-4 max-w-sm pointer-events-none flex flex-col gap-2 z-10">
            {culturalWarning && !isWarningDismissed && (
              <div className="pointer-events-auto p-3 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-amber-500/40 text-amber-100 shadow-xl text-xs leading-relaxed animate-in fade-in duration-200">
                <div className="flex items-center justify-between font-bold text-amber-400 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Lưu ý Remix Phục Trang:</span>
                  </span>
                  <button
                    onClick={() => setIsWarningDismissed(true)}
                    className="text-stone-400 hover:text-white cursor-pointer p-0.5"
                    aria-label="Đóng"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-stone-200 text-[11px]">{culturalWarning}</p>
              </div>
            )}

            {selectedStickerInfo && (
              <div
                className={`pointer-events-auto p-3 rounded-2xl bg-stone-900/95 backdrop-blur-md border-l-4 border-[#E4A025] border-stone-800 text-stone-200 shadow-xl text-xs leading-relaxed transition-all duration-300 ${
                  isInfoFading
                    ? 'opacity-0 -translate-y-2 pointer-events-none'
                    : 'opacity-100 translate-y-0 animate-in fade-in'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[#E4A025] mb-1">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>{selectedStickerInfo.name}</span>
                  </span>
                  <button
                    onClick={handleDismissStickerInfo}
                    className="text-stone-400 hover:text-white cursor-pointer p-0.5 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Đóng thông báo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-stone-300 text-[11px]">{selectedStickerInfo.info}</div>
              </div>
            )}
          </div>

          {/* Canvas Wrapper với Drop-shadow và bo tròn sang trọng */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-stone-800/80 bg-stone-950 flex items-center justify-center">
            {/* Real Fabric.js Canvas */}
            <canvas ref={canvasElRef} className="touch-none" />

            {/* Hint overlay on bottom for users */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-stone-300 border border-white/10">
                💡 Kéo thả hoặc click vào trang phục bên phải để ướm thử
              </span>
            </div>
          </div>

          {/* Floating Object Controls (Right Side when object is active) */}
          {activeObject && (
            <div className="absolute right-4 top-20 flex flex-col gap-1.5 z-20 animate-in fade-in zoom-in-95 duration-150 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl">
              <button
                onClick={handleDeleteActive}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-500/80 text-rose-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Xóa vật phẩm này"
                aria-label="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleFlipActive}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Lật ngang (Flip)"
                aria-label="Lật ngang"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRotateStep(15)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Xoay 15°"
                aria-label="Xoay"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScaleStep(0.1)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Phóng to"
                aria-label="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScaleStep(-0.1)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Thu nhỏ"
                aria-label="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleMoveUp}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Đưa lên trên (Bring forward)"
                aria-label="Đưa lên trên"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={handleMoveDown}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Hạ xuống dưới (Send backward)"
                aria-label="Hạ xuống dưới"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleLock}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/25 text-stone-200 flex items-center justify-center cursor-pointer transition-colors"
                title="Khóa / Mở khóa vị trí"
                aria-label="Khóa vị trí"
              >
                {activeObject.lockMovementX ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-stone-300" />}
              </button>
            </div>
          )}
        </div>

        {/* CỘT PHẢI (WARDROBE: BOTTOM SHEET DRAWER TRÊN MOBILE & COLLAPSIBLE SIDEBAR TRÊN DESKTOP) */}
        <div
          className={`flex flex-col select-none transition-all duration-300 ease-in-out ${
            isSidebarOpen
              ? 'absolute md:relative inset-x-0 bottom-0 md:inset-auto md:right-0 md:top-0 h-auto md:h-full max-h-[62vh] md:max-h-none w-full sm:w-[360px] md:w-[380px] z-30 opacity-100 translate-y-0 md:translate-y-0 md:translate-x-0 rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-stone-700 md:border-stone-800 bg-stone-900/98 md:bg-stone-900 backdrop-blur-xl md:backdrop-blur-none shadow-2xl'
              : 'pointer-events-none opacity-0 overflow-hidden border-none translate-y-full md:translate-y-0 md:translate-x-full h-0 md:h-full md:w-0'
          }`}
        >
          {/* Thanh Kéo Tay Cầm Cho Mobile (Drag/Pull Handle Indicator) */}
          <div className="md:hidden flex justify-center pt-2.5 pb-1 cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-12 h-1.5 rounded-full bg-stone-600/90 hover:bg-stone-500 transition-colors" />
          </div>

          {/* Header Sidebar với Nút Đóng X nổi bật */}
          <div className="p-3.5 sm:p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#C82A27] to-[#8D1815] text-white shadow-xs">
                <Shirt className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">Tủ Đồ Cổ Phục</h3>
                <p className="text-[10px] text-stone-400">Chạm để mặc thử thời gian thực</p>
              </div>
            </div>

            {/* Nút đóng sidebar "✕" nổi bật */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700/80 transition-colors cursor-pointer group flex items-center justify-center shadow-xs"
              title="Đóng tủ đồ"
              aria-label="Đóng tủ đồ"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform text-stone-200" />
            </button>
          </div>

          {/* Danh mục (Category Tabs) */}
          <div className="p-3 bg-stone-900/90 border-b border-stone-800 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                  activeCategory === cat.id
                    ? 'bg-[#E4A025] text-stone-950 border-[#E4A025] shadow-xs font-bold'
                    : 'bg-stone-800 text-stone-300 border-stone-700/60 hover:border-stone-500 hover:text-white hover:bg-stone-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Lưới vật phẩm 3 cột (Grid Items) với pb-16 cho mobile */}
          <div className="flex-1 overflow-y-auto p-3.5 pr-2.5 pb-16 md:pb-6 space-y-3">
            <div className="grid grid-cols-3 gap-2.5">
              {filteredStickers.map((sticker) => (
                <div
                  key={sticker.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, sticker)}
                  onClick={() => addStickerToCanvas(sticker)}
                  className="group relative aspect-square rounded-2xl bg-stone-800/80 hover:bg-[#8D1815]/20 border border-stone-700/60 hover:border-[#E4A025] p-2 flex flex-col items-center justify-between transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-lg select-none"
                  title={`${sticker.name} (Kéo hoặc bấm để thử)`}
                >
                  <div className="w-full flex-1 flex items-center justify-center p-1 pointer-events-none">
                    <img
                      src={sticker.svgDataUri}
                      alt={sticker.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-200 filter drop-shadow-sm"
                    />
                  </div>
                  <span className="text-[10px] text-stone-300 group-hover:text-amber-300 font-medium truncate w-full text-center transition-colors">
                    {sticker.name}
                  </span>

                  {/* Badges for Hat, Robe, Shoes */}
                  {sticker.type === 'mu' && (
                    <span className="absolute top-1 right-1 text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded-md font-mono">
                      Mũ
                    </span>
                  )}
                  {sticker.type === 'ao' && (
                    <span className="absolute top-1 right-1 text-[8px] bg-rose-500/20 text-rose-300 px-1 rounded-md font-mono">
                      Áo
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Custom PNG Sticker Box */}
            <div className="pt-2 border-t border-stone-800">
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-2xl border border-dashed border-stone-700 hover:border-[#E4A025] bg-stone-800/40 hover:bg-stone-800/80 text-stone-300 hover:text-amber-300 text-xs font-semibold cursor-pointer transition-all">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Thêm sticker ảnh PNG của bạn</span>
                <input
                  type="file"
                  accept="image/png, image/webp"
                  className="hidden"
                  onChange={handleCustomStickerUpload}
                />
              </label>
            </div>
          </div>

          {/* Footer Sidebar Info */}
          <div className="p-3 bg-stone-950 border-t border-stone-800 text-center text-[10px] text-stone-500">
            Hỗ trợ kéo & thả tự do hoặc 1-chạm tự động căn chỉnh
          </div>
        </div>

      </div>

      {/* Setup / Background & Model Selection Modal */}
      {showSetupModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSetupModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
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
        </div>,
        document.body
      )}
    </div>
  );
};
