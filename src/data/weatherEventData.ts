import { OutfitId, AccessoryId } from '../types/vietphuc';

export interface EventOption {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  recommendedOutfit: OutfitId;
  recommendedColorId: string;
  recommendedAccessories: AccessoryId[];
  vibeTip: string;
}

export interface WeatherOption {
  id: string;
  name: string;
  temp: string;
  icon: string;
  desc: string;
  fabricRecommendation: string;
  recommendedPattern: 'plain' | 'lotus' | 'clouds' | 'waves' | 'tho';
  colorToneAdvice: string;
}

export const EVENT_PRESETS: EventOption[] = [
  {
    id: 'tet',
    name: 'Du Xuân & Chúc Tết Cổ Truyền',
    emoji: '🌸',
    desc: 'Không khí sum vầy đầu năm, đòi hỏi sự tươi vui, may mắn và kính trọng bề trên.',
    recommendedOutfit: 'nguthan',
    recommendedColorId: 'do-son',
    recommendedAccessories: ['man', 'quat', 'chuoingoc'],
    vibeTip: 'Tông Đỏ Son hoặc Vàng Hoàng Yến tượng trưng cho tài lộc, phối cùng mấn xếp tạo vẻ trang trọng truyền thống.',
  },
  {
    id: 'grad',
    name: 'Lễ Tốt Nghiệp & Chụp Ảnh Kỷ Yếu',
    emoji: '🎓',
    desc: 'Khoảnh khắc ghi dấu thanh xuân rực rỡ, trang trọng mà vẫn trẻ trung, năng động.',
    recommendedOutfit: 'aodai',
    recommendedColorId: 'trang-nga',
    recommendedAccessories: ['nonla', 'quat', 'sneaker'],
    vibeTip: 'Sắc Trắng Bạch Ngà hoặc Lam Chàm kết hợp sneaker trắng giúp tà áo thanh thoát, tôn vinh nét nho nhã hiếu học.',
  },
  {
    id: 'wedding',
    name: 'Dự Tiệc Cưới & Ngày Hỷ Sự',
    emoji: '💐',
    desc: 'Không gian tiệc cưới ấm cúng, sang trọng, cần sự duyên dáng lịch thiệp.',
    recommendedOutfit: 'nhatbinh',
    recommendedColorId: 'xanh-ngoc',
    recommendedAccessories: ['chuoingoc', 'quat', 'man'],
    vibeTip: 'Áo Nhật Bình sắc Xanh Ngọc Bích vừa quý phái vừa nhã nhặn, không lấn át cô dâu nhưng vẫn nổi bật nét hoàng gia.',
  },
  {
    id: 'photowalk',
    name: 'Photowalk Phố Cổ & Di Tích Lịch Sử',
    emoji: '📸',
    desc: 'Dạo quanh Hoàng thành Thăng Long, Cố đô Huế, phố cổ Hội An chụp ảnh nghệ thuật.',
    recommendedOutfit: 'tuthan',
    recommendedColorId: 'nau-dat',
    recommendedAccessories: ['nonla', 'tuicoi', 'kinhram'],
    vibeTip: 'Áo Tứ Thân kết hợp nón quai thao/nón lá và kính râm Gen Z tạo nên concept vừa mộc mạc vừa thời thượng.',
  },
  {
    id: 'cafe',
    name: 'Cà Phê Dạo Phố Cuối Tuần (Streetwear)',
    emoji: '☕',
    desc: 'Gặp gỡ bạn bè tại các quán cà phê vintage, đi dạo phố đi bộ cuối tuần.',
    recommendedOutfit: 'baba',
    recommendedColorId: 'nau-dat',
    recommendedAccessories: ['khanran', 'sneaker', 'headphone'],
    vibeTip: 'Áo Bà Ba Nam Bộ phối khăn rằn và headphone tạo vibe miền Tây phóng khoáng kết hợp streetwear hiện đại.',
  },
  {
    id: 'exhibition',
    name: 'Triển Lãm Mỹ Thuật & Hội Thảo Văn Hóa',
    emoji: '🏛️',
    desc: 'Không gian nghệ thuật hàn lâm, cần sự chỉn chu, trầm tĩnh và chiều sâu thẩm mỹ.',
    recommendedOutfit: 'giaolinh',
    recommendedColorId: 'xanh-lam',
    recommendedAccessories: ['quat', 'kinhram'],
    vibeTip: 'Áo Giao Lĩnh vạt chéo sắc Lam Chàm thể hiện sự uyên bác, trang nhã của sĩ tử Đại Việt thời Lê.',
  },
];

export const WEATHER_PRESETS: WeatherOption[] = [
  {
    id: 'spring',
    name: 'Xuân Dịu Mát',
    temp: '22°C - 26°C',
    icon: '🌱',
    desc: 'Tiết trời thanh tân, gió thoảng, hoa nở.',
    fabricRecommendation: 'Lụa tơ tằm mềm mại, tơ sen thoáng khí.',
    recommendedPattern: 'lotus',
    colorToneAdvice: 'Tông màu tươi sáng, ấm áp như Đỏ Son, Vàng Hoàng Yến, Xanh Ngọc.',
  },
  {
    id: 'summer',
    name: 'Hè Nắng Rực',
    temp: '32°C - 38°C',
    icon: '☀️',
    desc: 'Nắng gắt ban trưa, nhiệt độ cao oi ả.',
    fabricRecommendation: 'Lụa đũi mỏng nhẹ, sa tanh tự nhiên, áo một lớp hạn chế nhiều lớp áo lót.',
    recommendedPattern: 'waves',
    colorToneAdvice: 'Tông màu lạnh, làm dịu mắt như Xanh Lam Chàm, Xanh Ngọc Bích, Trắng Bạch Ngà.',
  },
  {
    id: 'autumn',
    name: 'Thu Heo May',
    temp: '18°C - 24°C',
    icon: '🍂',
    desc: 'Gió thu se lạnh, nắng vàng hanh hao lãng mạn.',
    fabricRecommendation: 'Gấm dệt tơ bóng bẩy, lụa Vạn Phúc giữ nhiệt vừa phải.',
    recommendedPattern: 'clouds',
    colorToneAdvice: 'Tông màu ấm nồng, hoài niệm như Vàng Nghệ, Nâu Đất, Tím Hoa Cà.',
  },
  {
    id: 'winter',
    name: 'Đông Giá Rét',
    temp: '12°C - 16°C',
    icon: '❄️',
    desc: 'Gió mùa đông bắc lạnh buốt miền Bắc.',
    fabricRecommendation: 'Gấm dệt dày dặn, áo ngũ thân kép chần bông hoặc phối áo choàng ngoài.',
    recommendedPattern: 'tho',
    colorToneAdvice: 'Tông màu trầm sẫm, giữ ấm thị giác như Đen Huyền Mun, Đỏ Son sẫm, Tím Huế.',
  },
  {
    id: 'rain',
    name: 'Mưa Phùn Xứ Huế',
    temp: '19°C - 22°C',
    icon: '🌧️',
    desc: 'Mưa bay lất phất đặc trưng miền Trung.',
    fabricRecommendation: 'Chất liệu lụa dệt mật độ cao ít bám nước, tà áo may ngắn vừa chạm mắt cá.',
    recommendedPattern: 'waves',
    colorToneAdvice: 'Tông màu Trắng Bạch Ngà hoặc Tím Hoa Cà xứ thần kinh mộng mơ.',
  },
];
