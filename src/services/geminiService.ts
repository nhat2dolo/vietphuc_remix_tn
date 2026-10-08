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
    outfitName: string;
    colorName: string;
    accessories: string[];
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
    console.warn('Chat API error, using fallback:', err);
    return normalizeVietnameseText(`[Cố vấn Việt Phục Remix (Chế độ Cổ Phong)]: Bộ ${context.outfitName} sắc ${context.colorName} của bạn rất ấn tượng! Để tăng tính Gen Z mà vẫn chuẩn mực, hãy chú ý giữ nguyên phom dáng cổ áo và tà áo, đồng thời bạn có thể tự do biến tấu phụ kiện như túi tote thổ cẩm, giày sneaker tối giản hoặc mắt kính gọng kim loại thanh mảnh.`);
  }
}
