/**
 * Google Gemini AI Integration for Việt Phục Remix
 * Powered by server-side proxy routes and Google Gemini 2.5 Flash API
 * Provides AI Cultural Stylist & Heritage Advisor
 */

import { OutfitData, TraditionalColor, AccessoryData } from '../types/vietphuc';
import { normalizeVietnameseText } from '../utils/textUtils';

export interface StylingAnalysisResult {
  score: number; // 0 - 100
  title: string;
  verdict: string;
  culturalInsight: string;
  modernStylingAdvice: string;
  eventSuitability: string;
}

/**
 * Intelligent fallback when server is unreachable or offline
 */
function getLocalStylingAnalysis(
  outfit: OutfitData,
  color: TraditionalColor,
  accessories: AccessoryData[],
  event?: string,
  weather?: string
): StylingAnalysisResult {
  const hasStreetwear = accessories.some((a) => a.category === 'streetwear');
  const hasTraditional = accessories.some((a) => a.category === 'traditional');

  let score = 88;
  if (hasStreetwear && hasTraditional) score = 95;
  if (!hasStreetwear && hasTraditional) score = 92;

  let verdict = `Sự kết hợp giữa ${outfit.name} tông ${color.name} mang đậm tính thẩm mỹ Á Đông`;
  if (event) verdict += `, đặc biệt trang nhã cho dịp ${event}`;
  if (weather) verdict += ` trong tiết trời ${weather}`;
  verdict += '.';

  return {
    score,
    title: `${outfit.name} × ${color.name} (Hành ${color.element})`,
    verdict,
    culturalInsight: `Trang phục ${outfit.name} thuộc ${outfit.era}. ${outfit.philosophy}`,
    modernStylingAdvice: hasStreetwear
      ? 'Điểm nhấn phụ kiện đương đại giúp giải phóng dáng vẻ trang nghiêm truyền thống, tạo cá tính trẻ trung rất riêng cho Gen Z mà không làm mất đi phom dáng gốc.'
      : 'Bản phối giữ trọn nét thuần khiết cổ phong. Bạn có thể phối thêm một đôi sneaker trắng hoặc túi tote vải thêu để tăng hơi thở đường phố.',
    eventSuitability: event
      ? `Rất phù hợp với sự kiện ${event}. Nên chọn phom dáng thoải mái và chất liệu thoáng khí.`
      : `Phù hợp với các dịp: ${outfit.suitableOccasions.join(', ')}.`,
  };
}

/**
 * Call server-side Gemini 2.5 Flash API to analyze outfit and remix style
 */
export async function analyzeOutfitWithGemini(params: {
  outfit: OutfitData;
  color: TraditionalColor;
  secondaryColorHex: string;
  accessories: AccessoryData[];
  gender: string;
  event?: string;
  weather?: string;
}): Promise<StylingAnalysisResult> {
  try {
    const res = await fetch('/api/stylist/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      score: Number(data.score) || 90,
      title: normalizeVietnameseText(data.title || `${params.outfit.name} Remix`),
      verdict: normalizeVietnameseText(data.verdict || ''),
      culturalInsight: normalizeVietnameseText(data.culturalInsight || ''),
      modernStylingAdvice: normalizeVietnameseText(data.modernStylingAdvice || ''),
      eventSuitability: normalizeVietnameseText(data.eventSuitability || ''),
    };
  } catch (err) {
    console.warn('API call failed, using local cultural engine fallback:', err);
    return getLocalStylingAnalysis(
      params.outfit,
      params.color,
      params.accessories,
      params.event,
      params.weather
    );
  }
}

/**
 * Chat conversation with Gemini Heritage Stylist via server proxy
 */
export async function chatWithHeritageStylist(
  message: string,
  context: {
    outfitName?: string;
    colorName?: string;
    accessories?: string[];
    activeTab?: string;
  }
): Promise<string> {
  try {
    const res = await fetch('/api/stylist/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return normalizeVietnameseText(data.reply || 'Rất vui được hỗ trợ bạn khám phá di sản Việt phục!');
  } catch (err) {
    console.warn('Chat API error, using intelligent contextual fallback:', err);
    const msg = message.toLowerCase();
    const outfit = context?.outfitName || 'cổ phục';

    if (msg.includes('ngũ thân') || msg.includes('áo dài tân thời') || msg.includes('le mur')) {
      return normalizeVietnameseText(
        `Áo Ngũ Thân thời Nguyễn (ra đời từ cải cách năm 1744 của Chúa Nguyễn Phúc Khoát và vua Minh Mạng) gồm 5 thân vải tượng trưng cho Tứ thân phụ mẫu và bản thân người mặc, 5 hạt cúc biểu trưng cho Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín). Đến thập niên 1930, họa sĩ Cát Tường (Le Mur) đã cách tân tà áo ôm sát đường cong cơ thể, mở ra thời kỳ Áo Dài hiện đại. Khi remix, bạn có thể giữ phom áo suông trang nhã của ngũ thân và kết hợp cùng sneaker trắng tối giản để tôn dáng đĩnh đạc.`
      );
    }
    if (msg.includes('nhật bình') || msg.includes('cung đình') || msg.includes('hoàng tộc')) {
      return normalizeVietnameseText(
        `Áo Nhật Bình là thường phục cao quý của bậc Hoàng hậu, Công chúa và Mệnh phụ triều Nguyễn. Đặc trưng nổi bật nhất là phần cổ áo to bản ghép lại thành hình chữ nhật trước ngực, phối cùng dải ngũ hành rực rỡ ở viền tay (tượng trưng cho Kim - Mộc - Thủy - Hỏa - Thổ). Khi mặc Nhật Bình ngày nay trong lễ cưới hoặc chụp ảnh kỷ niệm, nên búi tóc gọn gàng hoặc quấn mấn và tránh phụ kiện rườm rà để tôn trọn vẻ uy nghiêm lộng lẫy.`
      );
    }
    if (msg.includes('ngũ hành') || msg.includes('phối màu') || msg.includes('màu sắc')) {
      return normalizeVietnameseText(
        `Theo triết lý Ngũ Hành Á Đông: Kim (Trắng bạch ngà), Mộc (Xanh ngọc bích), Thủy (Lam chàm/Đen), Hỏa (Đỏ son/Chu sa), Thổ (Vàng hoàng yến/Nâu củ nâu). Khi phối đồ, bạn có thể áp dụng quy tắc Tương Sinh (như Thủy sinh Mộc: Áo lam chàm phối quần ngọc bích) hoặc Tương Hợp (song hành cùng hành). Gam màu Đỏ son và Vàng hoàng yến luôn là lựa chọn vương giả, ngập tràn cát khí cho ngày lễ hội.`
      );
    }
    if (msg.includes('sneaker') || msg.includes('hiện đại') || msg.includes('gen z') || msg.includes('mix')) {
      return normalizeVietnameseText(
        `Bí quyết để phối sneaker với cổ phục mà không bị thô: Hãy chọn những đôi sneaker cổ thấp (low-top) có phom dáng tối giản, tông màu đơn sắc trung tính như trắng ngà, be nhạt hoặc xám khói. Tránh những đôi chunky sneaker quá hầm hố làm phân tán sự thanh thoát của tà áo. Bạn có thể phối thêm kính râm gọng kim loại thanh mảnh và túi tote thổ cẩm để tạo nét cá tính đương đại hài hòa.`
      );
    }
    if (msg.includes('tứ thân') || msg.includes('bà ba') || msg.includes('giao lĩnh')) {
      return normalizeVietnameseText(
        `Mỗi dáng áo mang một hồn cốt riêng: Áo Tứ Thân gắn liền với liền anh liền chị quan họ Bắc Bộ và dải yếm đào duyên dáng; Áo Bà Ba mộc mạc mang nét phóng khoáng, kiên cường của vùng sông nước Nam Bộ; trong khi Áo Giao Lĩnh (vạt chéo) thời Lý - Trần - Lê lại toát lên khí phách hào sảng và cổ kính của thời kỳ đỉnh cao văn hiến Đại Việt.`
      );
    }
    if (msg.includes('mùa hè') || msg.includes('mùa đông') || msg.includes('thời tiết') || msg.includes('chất liệu')) {
      return normalizeVietnameseText(
        `Về chất liệu trang phục: Mùa hè oi bức rất hợp với lụa tơ tằm Nha Xá, Vạn Phúc, vải đũi hoặc vải tơ sống thoáng khí, thấm hút mồ hôi tự nhiên. Mùa đông miền Bắc có thể diện Áo Tấc (áo ngũ thân tay thụng) nhiều lớp lót trong kèm khăn lụa ấm áp, vừa trang trọng vừa giữ ấm cơ thể tuyệt đối.`
      );
    }
    return normalizeVietnameseText(
      `Bộ ${outfit} sắc ${context?.colorName || 'truyền thống'} mang đậm vẻ đẹp thanh tao của di sản văn hóa Việt Nam. Để tôn lên khí chất người mặc, bạn hãy giữ gìn sự ngay ngắn của cổ áo và nếp tà, kết hợp thêm quạt lụa hoặc trang sức bạc/ngọc bội thanh nhã. Chúc bạn có trải nghiệm thăng hoa cùng Việt Phục Remix!`
    );
  }
}

