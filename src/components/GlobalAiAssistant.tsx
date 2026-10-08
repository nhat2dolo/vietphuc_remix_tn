import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Compass,
  ArrowRight,
  User,
  Shirt,
  Loader2,
} from 'lucide-react';
import { NavTab } from './Navbar';
import { OutfitId } from '../types/vietphuc';
import { OUTFITS } from '../data/vietphucData';
import { chatWithHeritageStylist } from '../services/geminiService';

interface GlobalAiAssistantProps {
  activeTab: NavTab;
  currentOutfitId?: OutfitId;
  onNavigate?: (tab: NavTab) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedTab?: NavTab;
}

interface QuickAction {
  label: string;
  query: string;
}

/**
 * Biểu tượng Hoa Sen Cách Điệu và Tinh Hoa Ánh Sáng AI
 * Gam màu chủ đạo: Đỏ chu sa (#8D1815, #C82A27) và Vàng hoàng yến (#E4A025)
 * Kèm huy hiệu nhỏ "AI"
 */
export const HeritageAiIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <linearGradient id="lotusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="50%" stopColor="#E4A025" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="lotusRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C82A27" />
            <stop offset="100%" stopColor="#8D1815" />
          </linearGradient>
          <radialGradient id="aiCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#E4A025" />
            <stop offset="100%" stopColor="#C82A27" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Hào quang trung tâm */}
        <circle cx="24" cy="24" r="15" fill="url(#aiCoreGlow)" opacity="0.5" />

        {/* Cánh sen ngoài (Outer Lotus Petals) */}
        <path
          d="M24 8 C20 17 9 23 13 34 C17 32 20 28 24 25 C28 28 31 32 35 34 C39 23 28 17 24 8 Z"
          fill="url(#lotusRedGrad)"
        />

        {/* Cánh sen xòe hai bên (Lateral Petals) */}
        <path
          d="M12 28 C7 23 9 17 16 18 C13 22 14 25 18 27 C15 28 13 28 12 28 Z"
          fill="#8D1815"
          opacity="0.95"
        />
        <path
          d="M36 28 C41 23 39 17 32 18 C35 22 34 25 30 27 C33 28 35 28 36 28 Z"
          fill="#8D1815"
          opacity="0.95"
        />

        {/* Cánh sen búp trung tâm ánh kim (Inner Golden Petals) */}
        <path
          d="M24 12 C22 17 17 22 20 28 C22 26 23 23 24 21 C25 23 26 26 28 28 C31 22 26 17 24 12 Z"
          fill="url(#lotusGoldGrad)"
        />

        {/* Ánh sao AI bốn cánh trung tâm (AI Radiance Star) */}
        <path
          d="M24 17 L25.5 22 L30 23.5 L25.5 25 L24 30 L22.5 25 L18 23.5 L22.5 22 Z"
          fill="#FFFFFF"
        />
        <circle cx="24" cy="23.5" r="1.5" fill="#E4A025" />

        {/* Tinh hoa lấp lánh xung quanh */}
        <circle cx="15" cy="14" r="1" fill="#FFF176" />
        <circle cx="33" cy="14" r="1" fill="#FFF176" />
      </svg>

      {/* Huy hiệu nhỏ "AI" */}
      <span className="absolute -bottom-1 -right-1 px-1.5 py-[0.5px] text-[8px] font-black tracking-wider leading-none rounded-full bg-[#8D1815] text-[#E4A025] border border-[#E4A025] shadow-xs select-none">
        AI
      </span>
    </div>
  );
};

export const GlobalAiAssistant: React.FC<GlobalAiAssistantProps> = ({
  activeTab,
  currentOutfitId = 'nguthan',
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quản lý tọa độ kéo thả nút tròn tự do khắp màn hình
  const [btnPos, setBtnPos] = useState<{ x: number; y: number } | null>(null);
  const dragInfoRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialBtnX: 0,
    initialBtnY: 0,
    hasMoved: false,
  });

  const outfit = OUTFITS[currentOutfitId] || OUTFITS.nguthan;

  // Giữ vị trí nút trong màn hình khi cửa sổ thay đổi kích thước
  useEffect(() => {
    const handleResize = () => {
      setBtnPos((prev) => {
        if (!prev) return null;
        const btnSize = 56;
        const padding = 12;
        const maxX = window.innerWidth - btnSize - padding;
        const maxY = window.innerHeight - btnSize - padding;
        return {
          x: Math.max(padding, Math.min(maxX, prev.x)),
          y: Math.max(padding, Math.min(maxY, prev.y)),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lấy tên nhãn hiển thị cho ngữ cảnh tab hiện tại
  const getContextLabel = (tab: NavTab) => {
    switch (tab) {
      case 'home':
        return 'Khám Phá Di Sản & 6 Dáng Cổ Phục';
      case 'studio':
        return `Studio Ma-nơ-canh (${outfit.name})`;
      case 'tryon':
        return `Thử Đồ Ảo Toàn Thân (${outfit.name})`;
      case 'weather':
        return 'Thời Tiết & Dịp Lễ Hội';
      case 'compare':
        return 'Đối Chiếu & So Sánh Triều Đại';
      case 'presets':
        return 'Bộ Sưu Tập Lookbook Gợi Ý';
      case 'archive':
        return 'Bách Khoa Điển Chế Cổ Phục';
      case 'quiz':
        return 'Trắc Nghiệm Bản Sắc Phong Cách';
      default:
        return 'Việt Phục Remix';
    }
  };

  // Danh sách Quick Actions thông minh theo từng tab
  const getQuickActions = (tab: NavTab): QuickAction[] => {
    switch (tab) {
      case 'home':
        return [
          {
            label: 'Nguồn gốc 6 dáng cổ phục',
            query: 'Hãy giới thiệu ngắn gọn nguồn gốc và nét đặc trưng của 6 dáng cổ phục: Áo Dài, Ngũ Thân, Nhật Bình, Tứ Thân, Bà Ba và Giao Lĩnh.',
          },
          {
            label: 'Ngũ Thân vs Áo Dài tân thời',
            query: 'Áo Ngũ Thân thời Nguyễn khác biệt cốt lõi như thế nào so với Áo Dài tân thời Le Mur và Áo Dài hiện đại?',
          },
          {
            label: 'Ý nghĩa áo Nhật Bình cung đình',
            query: 'Vì sao áo Nhật Bình lại mang cổ áo hình chữ nhật và có hoa văn dải ngũ hành đặc trưng của bậc hoàng tộc?',
          },
          {
            label: 'Bắt đầu thử đồ thế nào?',
            query: 'Tôi là người mới bắt đầu tìm hiểu cổ phục, tôi nên thử phom dáng và cách phối màu nào đầu tiên?',
          },
        ];
      case 'studio':
        return [
          {
            label: `Tư vấn phối màu ngũ hành cho ${outfit.name}`,
            query: `Dáng ${outfit.name} nên phối màu sắc nào theo nguyên lý Ngũ Hành tương sinh để vừa sang trọng vừa hợp phong thủy?`,
          },
          {
            label: 'Gợi ý phụ kiện hài thêu & quạt',
            query: `Khi mặc ${outfit.name}, nên kết hợp phụ kiện truyền thống nào (mấn, quạt xếp lụa, hài thêu) để chuẩn chỉnh nhất?`,
          },
          {
            label: 'Mẹo mix sneaker Gen Z không lỗi',
            query: 'Làm thế nào để phối giày sneaker đương đại với cổ phục Việt Nam mà vẫn giữ được sự thanh thoát, không bị phản cảm?',
          },
          {
            label: 'Ý nghĩa hoa văn mây và sóng',
            query: 'Hoa văn mây cuộn (vân khí) và sóng nước thủy ba trên cổ phục mang hàm ý văn hóa gì trong mỹ thuật xưa?',
          },
        ];
      case 'tryon':
        return [
          {
            label: `Hoàn cảnh mặc đẹp nhất cho ${outfit.name}`,
            query: `Trang phục ${outfit.name} phù hợp nhất cho các dịp nào (lễ cưới hỏi, chúc Tết, dự tiệc, chụp ảnh kỷ yếu)?`,
          },
          {
            label: 'Mẹo phối đồ ướm dáng',
            query: `Tôi đang thử ${outfit.name} trên phòng thử đồ ảo, hãy gợi ý cho tôi bản phối phụ kiện và màu sắc tôn dáng nhất.`,
          },
          {
            label: 'Bí quyết chọn nón lá hay mấn',
            query: 'Khi nào nên đội nón lá chóp nhọn, nón quai thao và khi nào nên quấn mấn lụa/khăn đóng?',
          },
          {
            label: 'Tạo dáng chụp ảnh kỷ niệm',
            query: 'Gợi ý những dáng đứng, tư thế cầm quạt hoặc bắt chéo tay thanh nhã, tôn lên nếp áo cổ phục khi chụp ảnh.',
          },
        ];
      case 'compare':
        return [
          {
            label: 'Tay chẽn vs Tay thụng',
            query: 'Phân tích sự khác biệt về công năng và ý nghĩa xã hội giữa Áo Tay Chẽn và Áo Tay Thụng (Áo Tấc) thời Nguyễn.',
          },
          {
            label: 'Giao Lĩnh vs Nhật Bình',
            query: 'So sánh cấu trúc cổ áo và niên đại lịch sử giữa áo Giao Lĩnh thời Lê và áo Nhật Bình thời Nguyễn.',
          },
          {
            label: 'Quy chế ngũ sắc cung đình',
            query: 'Trong cung đình Huế xưa, quy chuẩn màu sắc phân định phẩm hàm giữa hoàng thái hậu, hoàng hậu, công chúa và mệnh phụ ra sao?',
          },
          {
            label: 'Chọn phương án phối nổi bật',
            query: 'Khi đối sánh hai phương án phối đồ, yếu tố nào tạo nên điểm nhấn tương phản ấn tượng nhất cho trang phục?',
          },
        ];
      case 'presets':
        return [
          {
            label: 'Lookbook cưới hỏi truyền thống',
            query: 'Tư vấn trang phục cổ phục trang trọng, tôn nghiêm và viên mãn nhất cho lễ tân hôn hoặc dạm ngõ.',
          },
          {
            label: 'Dạo phố & chụp ảnh Tết',
            query: 'Gợi ý phong cách Việt Phục trẻ trung, tươi tắn cho dịp du xuân đầu năm cùng bạn bè.',
          },
          {
            label: 'Cổ phục dự sự kiện ngoại giao',
            query: 'Khi tham dự dạ tiệc văn hóa quốc tế, nên chọn dáng áo và màu sắc nào thể hiện rõ nhất vị thế văn hiến Đại Việt?',
          },
          {
            label: 'Phong cách tối giản đương đại',
            query: 'Cách tối giản hóa các chi tiết cổ phục để mặc đi làm hoặc gặp gỡ đối tác hàng ngày.',
          },
        ];
      case 'archive':
        return [
          {
            label: 'Điển chế Áo Ngũ Thân thời Nguyễn',
            query: 'Giải thích chi tiết quy chế canh tân y phục năm 1744 của Chúa Nguyễn Phúc Khoát và năm 1837 của Vua Minh Mạng.',
          },
          {
            label: 'Ý nghĩa 5 thân áo và 5 hạt khuy',
            query: 'Ý nghĩa triết lý nhân sinh của 5 thân áo (tứ thân phụ mẫu + thân con) và 5 hạt khuy (Nhân, Lễ, Nghĩa, Trí, Tín) là gì?',
          },
          {
            label: 'Nguồn gốc và cấu trúc Áo Tứ Thân',
            query: 'Lịch sử hình thành của Áo Tứ Thân vùng đồng bằng Bắc Bộ và vì sao lại buộc vạt trước khi lao động?',
          },
          {
            label: 'Hành trình Áo Bà Ba Nam Bộ',
            query: 'Áo Bà Ba du nhập và biến đổi như thế nào để trở thành biểu tượng mộc mạc của đất phương Nam?',
          },
        ];
      case 'quiz':
        return [
          {
            label: 'Khí chất của tôi hợp áo nào?',
            query: 'Tôi có tính cách trầm tĩnh, yêu chiều sâu văn hóa truyền thống, dáng áo nào phản ánh tốt nhất khí chất này?',
          },
          {
            label: 'Phối màu theo cung mệnh ngũ hành',
            query: 'Làm thế nào để xác định màu tương sinh tương hợp với mệnh bản thân khi chọn vải may cổ phục?',
          },
          {
            label: 'Phong cách Gen Z phá cách',
            query: 'Tôi thích sự năng động, nổi bật và hiện đại, hãy gợi ý cho tôi cách remix áo ngũ thân với streetstyle.',
          },
          {
            label: 'Tư vấn phom người và dáng áo',
            query: 'Người vóc dáng nhỏ nhắn hoặc người cao gầy nên ưu tiên phom áo cổ phục nào để tôn dáng nhất?',
          },
        ];
      case 'weather':
        return [
          {
            label: 'Chất liệu thoáng mát mùa hè',
            query: 'Thời tiết mùa hè nóng bức nên chọn chất liệu vải cổ phục nào (lụa tơ tằm, đũi, lanh) để luôn thoải mái mát mẻ?',
          },
          {
            label: 'Phối đồ giữ ấm mùa đông',
            query: 'Mùa đông miền Bắc se lạnh thì diện Áo Tấc hay Áo Ngũ Thân nhiều lớp như thế nào để vừa ấm vừa đúng phong thái?',
          },
          {
            label: 'Mẹo bảo quản khi trời nồm ẩm',
            query: 'Mẹo giữ gìn và bảo quản tơ lụa cổ phục khi thời tiết mưa ẩm hoặc khí hậu nhiệt đới gió mùa?',
          },
          {
            label: 'Màu sắc tôn da tiết trời thu',
            query: 'Tiết trời thu dịu mát phù hợp với những gam màu cổ truyền nào như xanh ngọc bích, trắng ngà hay vàng hoàng yến?',
          },
        ];
      default:
        return [
          {
            label: 'Nguồn gốc cổ phục Việt',
            query: 'Hãy giới thiệu ngắn gọn về lịch sử trang phục truyền thống Việt Nam.',
          },
          {
            label: 'Tư vấn dáng áo phù hợp',
            query: 'Làm sao để tôi chọn được dáng cổ phục phù hợp nhất với bản thân?',
          },
        ];
    }
  };

  // Khởi tạo lời chào ban đầu theo ngữ cảnh
  const getInitialGreeting = (tab: NavTab) => {
    switch (tab) {
      case 'studio':
        return `Dạ chào bạn! Tôi là Trợ Lý Việt Phục Remix. Bạn đang ở Studio ma-nơ-canh với dáng **${outfit.name}**. Tôi có thể gợi ý cho bạn về quy tắc phối màu Ngũ Hành, hoa văn truyền thống, hoặc phụ kiện hài thêu, quạt lụa chuẩn phong cách hoàng cung giao hòa đương đại!`;
      case 'tryon':
        return `Dạ chào bạn! Bạn đang trong không gian **Thử Đồ Ảo (Virtual Try-On)** với trang phục **${outfit.name}**. Bạn có thể kéo thả phụ kiện, thử áo ngũ thân, nhật bình, hoặc hỏi tôi về cách ướm đồ, hoàn cảnh diện đẹp nhất nhé!`;
      case 'compare':
        return `Dạ chào bạn! Tôi rất vui được đồng hành trong chuyên mục **Đối Sánh Trực Quan**. Tôi có thể giúp bạn đối chiếu chi tiết giữa tay chẽn thời Nguyễn và tay thụng thời Lê, kết cấu vạt đắp, khuy cài và sự biến thiên qua các triều đại.`;
      case 'weather':
        return `Dạ chào bạn! Bạn đang tra cứu **Thời Tiết & Dịp Lễ Hội**. Hãy cho tôi biết thời tiết hôm nay hoặc sự kiện bạn sắp tham gia (chúc Tết, cưới hỏi, lễ chùa), tôi sẽ gợi ý bản phối trang phục tương ứng ngay!`;
      case 'presets':
        return `Dạ chào bạn! Bạn đang xem bộ sưu tập **Lookbook Gợi Ý**. Nếu ưng ý bản phối nào hoặc muốn cá nhân hóa thêm phụ kiện Gen Z, hãy hỏi tôi nhé!`;
      case 'archive':
        return `Dạ chào bạn! Chào mừng bạn đến với **Bách Khoa Điển Chế Cổ Phục**. Mọi câu hỏi khảo cứu từ 'Ngàn năm áo mũ', phẩm trật thời Nguyễn đến lịch sử Áo Bà Ba, tôi đều sẵn sàng giải đáp tường tận.`;
      case 'quiz':
        return `Dạ chào bạn! Bạn đang ở phần **Trắc Nghiệm Phong Cách**. Cùng tôi khám phá xem khí chất và bản sắc tiềm ẩn của bạn hòa hợp nhất với dáng cổ phục nào trong 6 dáng kinh điển nhé!`;
      default:
        return `Dạ chào bạn! Tôi là Trợ Lý Cố Vấn Văn Hóa & Phong Cách Việt Phục Remix, được hỗ trợ bởi công nghệ Google Gemini AI. Tôi luôn túc trực để giải đáp mọi thắc mắc về 6 dáng cổ phục Đại Việt, quy tắc phối màu hoàng cung, và mẹo remix phong cách Gen Z đầy tự hào!`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: getInitialGreeting(activeTab),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Cập nhật tin nhắn chào nếu đổi tab và chưa có hội thoại
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: 'init-tab',
            sender: 'ai',
            text: getInitialGreeting(activeTab),
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [activeTab, currentOutfitId]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // NON-BLOCKING SCROLL: Tuyệt đối KHÔNG khóa cuộn trang (document.body.style.overflow = 'hidden')
  // Người dùng vẫn có thể dùng chuột cuộn trang web bên cạnh để ngắm trang phục và đọc tư vấn AI cùng một lúc.

  // Xử lý gửi tin nhắn hỏi AI
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessageItem: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessageItem]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const reply = await chatWithHeritageStylist(text, {
        outfitName: outfit.name,
        colorName: 'Hoàng Yến / Chu Sa',
        accessories: ['Mấn', 'Chuỗi Ngọc', 'Quạt lụa'],
      });

      // Kiểm tra xem phản hồi có gợi ý chuyển tab không
      let suggestedTab: NavTab | undefined;
      const lowerReply = reply.toLowerCase();
      if (lowerReply.includes('studio') || lowerReply.includes('phòng thử đồ')) {
        suggestedTab = 'studio';
      } else if (lowerReply.includes('thử đồ ảo') || lowerReply.includes('virtual try-on')) {
        suggestedTab = 'tryon';
      } else if (lowerReply.includes('so sánh') || lowerReply.includes('đối chiếu')) {
        suggestedTab = 'compare';
      } else if (lowerReply.includes('bách khoa') || lowerReply.includes('khảo cứu')) {
        suggestedTab = 'archive';
      }

      const aiMessageItem: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestedTab,
      };

      setMessages((prev) => [...prev, aiMessageItem]);
    } catch (err) {
      console.error('Chat assistant error:', err);
      const fallbackItem: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Dạ, về ${outfit.name}: Đây là trang phục thuộc ${outfit.era}. ${outfit.desc} Bạn có thể phối cùng quạt lụa hoặc hài thêu để giữ nét thanh tao, hoặc phối nhẹ cùng kính gọng kim loại thanh mảnh và sneaker trắng để tạo phong cách hiện đại mà vẫn giữ gìn cốt cách di sản.`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'ai',
        text: getInitialGreeting(activeTab),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Xử lý kéo thả nút tròn tự do trên màn hình (Pointer capture)
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const button = e.currentTarget;
    try {
      button.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const rect = button.getBoundingClientRect();
    dragInfoRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialBtnX: rect.left,
      initialBtnY: rect.top,
      hasMoved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragInfoRef.current.isDragging) return;

    const deltaX = e.clientX - dragInfoRef.current.startX;
    const deltaY = e.clientY - dragInfoRef.current.startY;
    const dist = Math.hypot(deltaX, deltaY);

    // Phân biệt Click vs Drag: Nếu di chuyển > 4px thì chỉ dời nút
    if (dist > 4) {
      dragInfoRef.current.hasMoved = true;
      const btnSize = 56; // w-14 h-14 = 56px
      const padding = 12;
      const maxX = window.innerWidth - btnSize - padding;
      const maxY = window.innerHeight - btnSize - padding;

      const newX = Math.max(padding, Math.min(maxX, dragInfoRef.current.initialBtnX + deltaX));
      const newY = Math.max(padding, Math.min(maxY, dragInfoRef.current.initialBtnY + deltaY));

      setBtnPos({ x: newX, y: newY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragInfoRef.current.isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const { hasMoved } = dragInfoRef.current;
    dragInfoRef.current.isDragging = false;

    // Phân biệt Click vs Drag: nếu nhấp chuột (<= 4px) thì bật/tắt Drawer
    if (!hasMoved) {
      setIsOpen((prev) => !prev);
    }
  };

  const quickActions = getQuickActions(activeTab);

  return (
    <>
      {/* 1. NÚT TRÒN NHỎ GỌN DRAGGABLE (KÉO THẢ TỰ DO KHẮP MÀN HÌNH - w-14 h-14 bo tròn 100%) */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragInfoRef.current.isDragging = false;
        }}
        style={
          btnPos
            ? {
                position: 'fixed',
                left: `${btnPos.x}px`,
                top: `${btnPos.y}px`,
                bottom: 'auto',
                right: 'auto',
                touchAction: 'none',
              }
            : {
                touchAction: 'none',
              }
        }
        className={`w-14 h-14 rounded-full flex items-center justify-center z-40 select-none shadow-[0_10px_30px_rgba(141,24,21,0.5)] border-2 border-[#E4A025] bg-gradient-to-tr from-[#8D1815] via-[#C82A27] to-[#E4A025] hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing transition-transform duration-150 ${
          !btnPos ? 'fixed bottom-6 right-6' : ''
        }`}
        title="✨ Trợ lý Việt Phục (Google Gemini AI) - Nhấn để mở/đóng, nhấn giữ để kéo"
        aria-label="Trợ lý Việt Phục AI"
      >
        {/* Hiệu ứng hào quang phát xung nhẹ (ambient glow pulse) */}
        <span className="absolute -inset-1 rounded-full bg-[#E4A025]/35 animate-ping opacity-50 pointer-events-none" />
        <span className="absolute -inset-2 rounded-full bg-[#8D1815]/25 animate-pulse pointer-events-none" />

        {/* Component riêng: HeritageAiIcon (hoa sen cách điệu và tinh hoa ánh sáng AI) */}
        <HeritageAiIcon className="w-8 h-8" />
      </button>

      {/* 2. RIGHT SLIDE-IN DRAWER VỚI CREATE PORTAL - KHÔNG BACKDROP, KHÔNG KHÓA CUỘN NỀN */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`w-[360px] sm:w-[400px] fixed top-0 right-0 h-full z-50 bg-[#FAF7F2]/98 backdrop-blur-md shadow-2xl border-l border-stone-200 flex flex-col transition-transform duration-300 ease-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
            }`}
            style={{ willChange: 'transform' }}
          >
            {/* HEADER DRAWER */}
            <div className="relative px-5 py-4 border-b border-stone-200 bg-white/80 backdrop-blur-sm flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8D1815] to-[#E4A025] p-0.5 flex items-center justify-center shadow-xs">
                  <div className="w-full h-full rounded-full bg-[#FAF7F2] flex items-center justify-center">
                    <HeritageAiIcon className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 tracking-tight">
                      ✨ Trợ lý Việt Phục
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-[#E4A025]/20 text-[#8D1815] border border-[#E4A025]/50">
                      Gemini
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8D1815] truncate max-w-[210px] font-medium flex items-center gap-1">
                    <Compass className="w-3 h-3 shrink-0 text-[#C82A27]" />
                    <span className="truncate">{getContextLabel(activeTab)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Nút Reset Cuộc Trò Chuyện */}
                <button
                  onClick={handleResetChat}
                  className="p-2 rounded-lg text-stone-500 hover:text-[#8D1815] hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Làm mới cuộc trò chuyện"
                  aria-label="Làm mới trò chuyện"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Nút Đóng Drawer (X) */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-stone-500 hover:text-[#8D1815] hover:bg-[#8D1815]/10 transition-colors cursor-pointer"
                  title="Đóng trợ lý"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* NGỮ CẢNH NHANH (CONTEXT BADGE BANNER) */}
            <div className="px-5 py-2.5 bg-[#F5EFE6] border-b border-stone-200/90 flex items-center justify-between text-xs text-stone-700">
              <div className="flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-[#8D1815]" />
                <span>
                  Dáng áo tiêu điểm: <strong className="text-stone-900">{outfit.name}</strong>
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-serif italic">
                Triều {outfit.era.split(' ')[1] || 'Đại Việt'}
              </span>
            </div>

            {/* KHU VỰC NỘI DUNG CHAT & GỢI Ý (Cuộn độc lập, không ảnh hưởng trang chính) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm scroll-smooth bg-[#FAF7F2]">
              {/* LỊCH SỬ TIN NHẮN */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 px-1">
                    {msg.sender === 'user' ? (
                      <>
                        <span>Bạn</span>
                        <User className="w-3 h-3 text-stone-500" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-[#E4A025]" />
                        <span className="text-[#8D1815] font-semibold">Trợ lý Cổ Phong</span>
                      </>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed text-xs sm:text-sm shadow-sm whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#8D1815] text-white rounded-br-xs border border-[#A82522]'
                        : 'bg-white text-stone-800 rounded-bl-xs border border-stone-200/90'
                    }`}
                  >
                    {msg.text}

                    {/* Nút tắt chuyển tab nếu AI đề xuất */}
                    {msg.suggestedTab && onNavigate && msg.suggestedTab !== activeTab && (
                      <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#8D1815] font-medium">Mở mục gợi ý:</span>
                        <button
                          onClick={() => {
                            onNavigate(msg.suggestedTab!);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#8D1815]/10 text-[#8D1815] hover:bg-[#8D1815] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <span>Khám phá ngay</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* TRẠNG THÁI AI ĐANG SUY NGHĨ / SOẠN TIN */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#8D1815] bg-white border border-[#E4A025]/50 p-3 rounded-xl w-fit shadow-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#8D1815]" />
                  <span>Trợ lý đang tham vấn điển tích cổ phục...</span>
                </div>
              )}

              {/* 4 THẺ GỢI Ý NHANH THEO NGỮ CẢNH (QUICK ACTIONS) */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8D1815] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-[#E4A025]" />
                  <span>Gợi ý câu hỏi nhanh:</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action.query)}
                      disabled={isLoading}
                      className="text-left p-2.5 rounded-xl bg-white hover:bg-[#F5EFE6] border border-stone-200/90 hover:border-[#E4A025] transition-all text-xs text-stone-800 flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <span className="truncate pr-2 font-medium">{action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#8D1815] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Ô NHẬP TIN NHẮN Ở ĐÁY DRAWER */}
            <div className="p-4 border-t border-stone-200 bg-white/95 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Hỏi về lịch sử, phối màu, phụ kiện..."
                    disabled={isLoading}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-300 focus:border-[#C82A27] focus:ring-1 focus:ring-[#C82A27] text-xs sm:text-sm text-stone-900 placeholder-stone-400 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-tr from-[#8D1815] via-[#C82A27] to-[#E4A025] text-white hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer shrink-0"
                  title="Gửi câu hỏi"
                  aria-label="Gửi"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* FOOTER BẮT BUỘC: "Được hỗ trợ bởi Google Gemini AI" */}
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-medium tracking-wide">
                <Sparkles className="w-3 h-3 text-[#E4A025]" />
                <span>Được hỗ trợ bởi Google Gemini AI</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
