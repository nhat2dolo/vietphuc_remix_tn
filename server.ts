import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with GEMINI_API_KEY from environment
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), ms)
    ),
  ]);
}

function getLocalStylingAnalysis(
  outfit: any,
  color: any,
  accessories: any[],
  event?: string,
  weather?: string
) {
  const accList = Array.isArray(accessories) ? accessories : [];
  const hasStreetwear = accList.some((a) => a.category === 'streetwear');
  const hasTraditional = accList.some((a) => a.category === 'traditional');

  let score = 88;
  if (hasStreetwear && hasTraditional) score = 95;
  if (!hasStreetwear && hasTraditional) score = 92;

  const outfitName = outfit?.name || 'Cổ phục';
  const colorName = color?.name || 'Truyền thống';
  let verdict = `Sự kết hợp giữa ${outfitName} tông ${colorName} mang đậm tính thẩm mỹ Á Đông`;
  if (event) verdict += `, đặc biệt trang nhã cho dịp ${event}`;
  if (weather) verdict += ` trong tiết trời ${weather}`;
  verdict += '.';

  return {
    score,
    title: `${outfitName} × ${colorName} (Hành ${color?.element || 'Ngũ Hành'})`,
    verdict,
    culturalInsight: `Trang phục ${outfitName} thuộc ${outfit?.era || 'Việt Nam'}. ${outfit?.philosophy || 'Mang đậm hồn cốt dân tộc và vẻ đẹp thanh cao.'}`,
    modernStylingAdvice: hasStreetwear
      ? 'Điểm nhấn phụ kiện đương đại giúp giải phóng dáng vẻ trang nghiêm truyền thống, tạo cá tính trẻ trung rất riêng cho Gen Z mà không làm mất đi phom dáng gốc.'
      : 'Bản phối giữ trọn nét thuần khiết cổ phong. Bạn có thể phối thêm một đôi sneaker trắng hoặc túi tote vải thêu để tăng hơi thở đường phố.',
    eventSuitability: event
      ? `Rất phù hợp với sự kiện ${event}. Nên chọn phom dáng thoải mái và chất liệu thoáng khí.`
      : `Phù hợp với các dịp: ${(outfit?.suitableOccasions || ['Lễ hội', 'Dạo phố']).join(', ')}.`,
  };
}

// POST /api/stylist/analyze
app.post('/api/stylist/analyze', async (req, res) => {
  try {
    const { outfit, color, secondaryColorHex, accessories, gender, event, weather } = req.body;
    const accList = Array.isArray(accessories) ? accessories : [];
    const accNames = accList.map((a: any) => `${a.name} (${a.category})`).join(', ') || 'Không phụ kiện';

    if (!ai) {
      return res.json(getLocalStylingAnalysis(outfit, color, accList, event, weather));
    }

    const prompt = `Bạn là Chuyên gia Cố vấn Văn hóa & Nhà thiết kế Thời trang Gen Z của dự án "Việt phục Remix".
Hãy đánh giá bản phối trang phục truyền thống Việt Nam sau:
- Trang phục: ${outfit?.name || 'Cổ phục'} (${outfit?.era || 'Việt Nam'})
- Giới tính: ${gender === 'female' ? 'Nữ' : 'Nam'}
- Màu chủ đạo: ${color?.name || 'Truyền thống'} (Hex: ${color?.hex || '#C82A27'}, Ngũ hành: ${color?.element || 'Hỏa'})
- Màu phối phụ: ${secondaryColorHex || '#EDE7DC'}
- Phụ kiện remix: ${accNames}
- Dịp tham gia: ${event || 'Tự do / Dạo phố'}
- Thời tiết: ${weather || 'Thoải mái'}

Yêu cầu trả về định dạng JSON thuần túy (không bọc markdown \`\`\`json) với cấu trúc sau:
{
  "score": <số nguyên từ 70 đến 100>,
  "title": "<Tiêu đề ngắn gọn giật tít thời trang>",
  "verdict": "<Nhận xét tổng quan 2-3 câu>",
  "culturalInsight": "<Góc nhìn bảo tồn văn hóa, lưu ý lịch sử>",
  "modernStylingAdvice": "<Mẹo phối đồ cho Gen Z để vừa ngầu vừa chuẩn mực>",
  "eventSuitability": "<Đánh giá mức độ hợp với dịp tham gia>"
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      }),
      6000
    );

    const text = response.text || '';
    const cleanText = text.replace(/^```json/g, '').replace(/```$/g, '').trim();
    try {
      const data = JSON.parse(cleanText);
      return res.json({
        score: Number(data.score) || 92,
        title: data.title || `${outfit?.name || 'Cổ phục'} Remix`,
        verdict: data.verdict || '',
        culturalInsight: data.culturalInsight || '',
        modernStylingAdvice: data.modernStylingAdvice || '',
        eventSuitability: data.eventSuitability || '',
      });
    } catch {
      return res.json(getLocalStylingAnalysis(outfit, color, accList, event, weather));
    }
  } catch (error: any) {
    console.error('Gemini analysis error:', error);
    const { outfit, color, accessories, event, weather } = req.body;
    return res.json(getLocalStylingAnalysis(outfit, color, accessories, event, weather));
  }
});

// POST /api/stylist/chat
app.post('/api/stylist/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!ai) {
      return res.json({
        reply: `[Cố vấn Việt Phục Remix (Chế độ Cổ Phong)]: Bộ ${context?.outfitName || 'cổ phục'} sắc ${context?.colorName || 'truyền thống'} của bạn rất ấn tượng! Để tăng tính Gen Z mà vẫn chuẩn mực, hãy chú ý giữ nguyên phom dáng cổ áo và tà áo, đồng thời bạn có thể tự do biến tấu phụ kiện như túi tote thổ cẩm, giày sneaker tối giản hoặc mắt kính gọng kim loại thanh mảnh.`
      });
    }

    const systemInstruction = `Bạn là Trợ lý AI Cố Vấn Văn Hóa & Thời Trang "Việt phục Remix" được tài trợ bởi Google AI.
Người dùng đang mặc: ${context?.outfitName || 'Cổ phục'}, màu ${context?.colorName || 'Truyền thống'}, phụ kiện: ${(context?.accessories || []).join(', ') || 'Không'}.
Nhiệm vụ: Trả lời thân thiện, am hiểu sâu sắc về lịch sử Đại Việt (Ngàn năm áo mũ, triều Nguyễn, Lê...), khéo léo cổ vũ tinh thần Gen Z phối đồ hiện đại mà vẫn tôn trọng chuẩn mực văn hóa. Trả lời súc tích, truyền cảm hứng dưới 150 từ.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
        },
      }),
      6000
    );

    return res.json({
      reply: response.text || 'Rất vui được hỗ trợ bạn khám phá di sản Việt phục!',
    });
  } catch (error: any) {
    console.warn('Gemini chat error, using contextual fallback:', error?.message);
    const { context } = req.body;
    return res.json({
      reply: `[Cố vấn Việt Phục Remix (Chế độ Cổ Phong)]: Bộ ${context?.outfitName || 'cổ phục'} sắc ${context?.colorName || 'truyền thống'} của bạn rất ấn tượng! Để tăng tính Gen Z mà vẫn chuẩn mực, hãy chú ý giữ nguyên phom dáng cổ áo và tà áo, đồng thời bạn có thể tự do biến tấu phụ kiện như túi tote thổ cẩm, giày sneaker tối giản hoặc mắt kính gọng kim loại thanh mảnh.`
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
