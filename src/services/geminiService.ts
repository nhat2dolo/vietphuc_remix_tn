/**
 * Google Gemini AI Integration for Việt Phục Remix
 * Powered by @google/genai and Google Gemini 2.5 Flash API
 * Provides AI Cultural Stylist & Heritage Advisor
 */

import { GoogleGenAI } from '@google/genai';
import { OutfitData, TraditionalColor, AccessoryData } from '../types/vietphuc';

// Storage key for user-provided Gemini API Key
const API_KEY_STORAGE_KEY = 'vietphuc_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(API_KEY_STORAGE_KEY) ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (import.meta as any).env?.GEMINI_API_KEY ||
    ((typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY) ? (process as any).env.GEMINI_API_KEY : '') ||
    ''
  );
}

export function setStoredApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  }
}

export interface StylingAnalysisResult {
  score: number; // 0 - 100
  title: string;
  verdict: string;
  culturalInsight: string;
  modernStylingAdvice: string;
  eventSuitability: string;
}

/**
 * Intelligent fallback when Gemini API key is missing or offline
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
 * Universal Gemini request handler: tries @google/genai SDK, then REST fetch
 */
async function generateWithGemini(apiKey: string, prompt: string, systemInstruction?: string): Promise<string> {
  // Method 1: Try @google/genai SDK
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });
    if (response && response.text) {
      return response.text;
    }
  } catch (sdkError) {
    // If SDK fails in browser context, fallback to direct REST API
  }

  // Method 2: Direct REST fetch to Google AI endpoint
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const requestBody: any = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Lỗi Gemini API (Mã: ${res.status})`);
  }

  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Call Gemini 2.5 Flash to analyze outfit and remix style
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
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    // Provide high-quality local analysis if no API key
    return getLocalStylingAnalysis(
      params.outfit,
      params.color,
      params.accessories,
      params.event,
      params.weather
    );
  }

  try {
    const accNames = params.accessories.map((a) => `${a.name} (${a.category})`).join(', ') || 'Không phụ kiện';

    const prompt = `Bạn là Chuyên gia Cố vấn Văn hóa & Nhà thiết kế Thời trang Gen Z của dự án "Việt phục Remix".
Hãy đánh giá bản phối trang phục truyền thống Việt Nam sau:
- Trang phục: ${params.outfit.name} (${params.outfit.era})
- Giới tính: ${params.gender === 'female' ? 'Nữ' : 'Nam'}
- Màu chủ đạo: ${params.color.name} (Hex: ${params.color.hex}, Ngũ hành: ${params.color.element})
- Phụ kiện remix: ${accNames}
- Dịp tham gia: ${params.event || 'Tự do / Dạo phố'}
- Thời tiết: ${params.weather || 'Thoải mái'}

Yêu cầu trả về định dạng JSON thuần túy (không bọc markdown \`\`\`json) với cấu trúc sau:
{
  "score": <số nguyên từ 70 đến 100>,
  "title": "<Tiêu đề ngắn gọn giật tít thời trang>",
  "verdict": "<Nhận xét tổng quan 2-3 câu>",
  "culturalInsight": "<Góc nhìn bảo tồn văn hóa, lưu ý lịch sử>",
  "modernStylingAdvice": "<Mẹo phối đồ cho Gen Z để vừa ngầu vừa chuẩn mực>",
  "eventSuitability": "<Đánh giá mức độ hợp với dịp tham gia>"
}`;

    const text = await generateWithGemini(apiKey, prompt);
    const cleanText = text.replace(/^```json/g, '').replace(/```$/g, '').trim();
    const data = JSON.parse(cleanText);

    return {
      score: Number(data.score) || 92,
      title: data.title || `${params.outfit.name} Remix`,
      verdict: data.verdict || '',
      culturalInsight: data.culturalInsight || '',
      modernStylingAdvice: data.modernStylingAdvice || '',
      eventSuitability: data.eventSuitability || '',
    };
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local cultural engine:', err);
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
 * Chat conversation with Gemini Heritage Stylist
 */
export async function chatWithHeritageStylist(
  message: string,
  context: {
    outfitName: string;
    colorName: string;
    accessories: string[];
  }
): Promise<string> {
  const apiKey = getStoredApiKey();

  if (!apiKey) {
    return `[Cố vấn Việt Phục Remix (Chế độ Cổ Phong)]: Bộ ${context.outfitName} sắc ${context.colorName} của bạn rất ấn tượng! Để tăng tính Gen Z mà vẫn chuẩn mực, hãy chú ý giữ nguyên phom dáng cổ áo và tà áo, đồng thời bạn có thể tự do biến tấu phụ kiện như túi tote thổ cẩm, giày sneaker tối giản hoặc mắt kính gọng kim loại thanh mảnh.`;
  }

  try {
    const systemInstruction = `Bạn là Trợ lý AI Cố Vấn Văn Hóa & Thời Trang "Việt phục Remix" được tài trợ bởi Google AI.
Người dùng đang mặc: ${context.outfitName}, màu ${context.colorName}, phụ kiện: ${context.accessories.join(', ') || 'Không'}.
Nhiệm vụ: Trả lời thân thiện, am hiểu sâu sắc về lịch sử Đại Việt (Ngàn năm áo mũ, triều Nguyễn, Lê...), khéo léo cổ vũ tinh thần Gen Z phối đồ hiện đại mà vẫn tôn trọng chuẩn mực văn hóa. Trả lời súc tích, truyền cảm hứng dưới 150 từ.`;

    const reply = await generateWithGemini(apiKey, message, systemInstruction);
    return reply || 'Rất vui được hỗ trợ bạn khám phá di sản Việt phục!';
  } catch (err: any) {
    console.warn('Gemini Chat error:', err);
    return `Rất tiếc có lỗi kết nối với Gemini AI (${err?.message || 'Lỗi mạng'}). Bạn hãy kiểm tra lại API Key nhé!`;
  }
}
