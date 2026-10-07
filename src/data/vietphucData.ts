import { OutfitData, TraditionalColor, AccessoryData, PresetLook, CulturalWarning, OutfitId, AccessoryId } from '../types/vietphuc';

export const TRADITIONAL_COLORS: TraditionalColor[] = [
  {
    id: 'do-son',
    name: 'Đỏ Son (Chu Sa)',
    hex: '#C82A27',
    accentHex: '#8D1815',
    element: 'Hỏa',
    meaning: 'Tượng trưng cho hỷ sự, may mắn, nguồn sinh khí dồi dào và thịnh vượng ngày Tết.',
  },
  {
    id: 'vang-nghe',
    name: 'Vàng Hoàng Yến',
    hex: '#E4A025',
    accentHex: '#A36F12',
    element: 'Thổ',
    meaning: 'Sắc vàng vương giả, tượng trưng cho trung tâm, sự bao dung và cốt cách tôn quý.',
  },
  {
    id: 'xanh-lam',
    name: 'Lam Chàm (Thanh Lam)',
    hex: '#1F4F89',
    accentHex: '#12335A',
    element: 'Thủy',
    meaning: 'Nhuộm từ lá chàm tự nhiên, gợi vẻ điềm đạm, trầm tĩnh và chiều sâu trí tuệ hiền nhân.',
  },
  {
    id: 'xanh-ngoc',
    name: 'Xanh Ngọc Bích',
    hex: '#3D7D73',
    accentHex: '#25544D',
    element: 'Mộc',
    meaning: 'Biểu tượng của cây cỏ đâm chồi mùa xuân, sự thanh tân, nhã nhặn và tươi mới.',
  },
  {
    id: 'nau-dat',
    name: 'Nâu Củ Nâu',
    hex: '#5E402D',
    accentHex: '#3D281B',
    element: 'Thổ',
    meaning: 'Màu sắc dung dị của đất mẹ và đời sống nông nghiệp Đại Việt, mộc mạc mà bền bỉ.',
  },
  {
    id: 'trang-nga',
    name: 'Trắng Bạch Ngà',
    hex: '#EDE7DC',
    accentHex: '#BFB5A2',
    element: 'Kim',
    meaning: 'Màu lụa tơ tự nhiên thanh khiết, tượng trưng cho sự tinh khôi, chính trực và tao nhã.',
  },
  {
    id: 'tim-hue',
    name: 'Tím Hoa Cà',
    hex: '#6B3574',
    accentHex: '#451E4C',
    element: 'Hỏa - Thủy',
    meaning: 'Sắc màu hoài cổ gắn liền với xứ thần kinh Huế, dịu dàng, kín đáo và vương giả.',
  },
  {
    id: 'den-mun',
    name: 'Đen Huyền Mun',
    hex: '#232225',
    accentHex: '#141315',
    element: 'Thủy',
    meaning: 'Sắc đen nghiêm cẩn của các bậc túc nho triều Nguyễn, sang trọng và chuẩn mực.',
  },
];

export const OUTFITS: Record<OutfitId, OutfitData> = {
  aodai: {
    id: 'aodai',
    name: 'Áo Dài',
    tagline: 'Quốc phục thanh lịch, tôn vinh đường nét duyên dáng',
    era: 'Thập niên 1930 đến Nay (Định hình từ Áo Ngũ Thân)',
    desc: 'Trang phục biểu tượng của văn hóa Việt, phát triển qua các thời kỳ từ áo ngũ thân, áo dài Lemur Cát Tường đến dáng áo dài tân thời chiết eo ôm khéo léo với hai tà bay bổng.',
    philosophy: 'Vẻ đẹp kín đáo mà gợi cảm, hòa quyện giữa cấu trúc phục trang truyền thống phương Đông và kỹ thuật cắt may phương Tây hiện đại.',
    recommendedAccessories: ['man', 'nonla', 'quat', 'chuoingoc'],
    suitableOccasions: ['Lễ Tết', 'Cưới hỏi', 'Tốt nghiệp', 'Dạo phố du xuân'],
    referenceCitation: 'Sách "Ngàn năm áo mũ" (Trần Quang Đức) & Tư liệu Bảo tàng Phụ nữ Việt Nam.',
    defaultSecondaryColor: '#FAF7F2',
  },
  nguthan: {
    id: 'nguthan',
    name: 'Áo Ngũ Thân (Lập Lĩnh)',
    tagline: 'Đạo làm người trong từng đường kim, dáng áo chuẩn mực xưa',
    era: 'Thời Chúa Nguyễn Phúc Khoát (1744) & Triều Nguyễn (1802 - 1945)',
    desc: 'Áo có cổ đứng vuông góc (lập lĩnh), cài 5 khuy bên mạn sườn phải, gồm 5 thân vải ghép lại: 2 thân trước, 2 thân sau và 1 thân con (thân thứ 5) nằm lót phía trong bên phải.',
    philosophy: '4 thân ngoài tượng trưng cho "Tứ thân phụ mẫu" (cha mẹ ruột và cha mẹ chồng/vợ), thân con bên trong tượng trưng cho bản thân người mặc được gia đình chở che. 5 chiếc khuy tượng trưng cho "Ngũ thường": Nhân - Lễ - Nghĩa - Trí - Tín.',
    recommendedAccessories: ['man', 'quat', 'chuoingoc', 'sneaker'],
    suitableOccasions: ['Đại lễ truyền thống', 'Thờ cúng tổ tiên', 'Photowalk di sản', 'Hội nghị văn hóa'],
    referenceCitation: 'Chỉ dụ cải cách trang phục năm 1744 của Chúa Nguyễn Vũ Vương & Nghi lễ Đại triều Nguyễn.',
    defaultSecondaryColor: '#EDE7DC',
  },
  nhatbinh: {
    id: 'nhatbinh',
    name: 'Áo Nhật Bình',
    tagline: 'Phẩm phục vương triều lộng lẫy chốn hoàng cung Huế',
    era: 'Triều nhà Nguyễn (1802 - 1945)',
    desc: 'Thường phục tôn quý của Hoàng hậu, Công chúa, Cung tần và phu nhân quan lại nhất, nhị phẩm. Điểm nhấn là cổ áo hình chữ nhật viền thêu hoa văn ngũ sắc trước ngực và dải ngũ sắc thùy lưu nơi tay áo.',
    philosophy: 'Tên gọi "Nhật Bình" bắt nguồn từ chiếc cổ áo khi khép lại tạo thành một hình chữ nhật nằm ngang ngay ngắn trước ngực, biểu trưng cho sự ngay thẳng, quang minh chính đại.',
    recommendedAccessories: ['man', 'quat', 'chuoingoc', 'tuicoi'],
    suitableOccasions: ['Cưới hỏi cổ điển', 'Chụp ảnh nghệ thuật Concept Cung đình', 'Triển lãm văn hóa'],
    referenceCitation: 'Khâm định Đại Nam hội điển sự lệ - Ban Lễ Bộ triều Nguyễn.',
    defaultSecondaryColor: '#E4A025',
  },
  tuthan: {
    id: 'tuthan',
    name: 'Áo Tứ Thân',
    tagline: 'Giai điệu dân ca Kinh Bắc, mộc mạc và phóng khoáng',
    era: 'Thế kỷ 12 đến thế kỷ 20 (Đặc trưng vùng đồng bằng Bắc Bộ)',
    desc: 'Gồm 4 vạt vải: hai vạt sau may liền thành sống áo, hai vạt trước buông tự do hoặc buộc vạt trước bụng. Thường kết hợp cùng yếm đào, áo cánh trắng bên trong, bao tượng thắt lưng và váy đụp đen.',
    philosophy: 'Tôn vinh tinh thần lao động cần cù, nét duyên thầm dịu dàng của người phụ nữ nông thôn Bắc Bộ và văn hóa hội Lim, quan họ.',
    recommendedAccessories: ['nonla', 'quat', 'tuicoi', 'chuoingoc'],
    suitableOccasions: ['Lễ hội dân gian', 'Chụp ảnh sen mùa hạ', 'Biểu diễn âm nhạc truyền thống'],
    referenceCitation: 'Trang phục phụ nữ Bắc Bộ - Viện Nghiên cứu Văn hóa & Dân tộc học.',
    defaultSecondaryColor: '#C82A27',
  },
  baba: {
    id: 'baba',
    name: 'Áo Bà Ba',
    tagline: 'Hồn hậu Nam Bộ, linh hoạt dạo phố ngày thường',
    era: 'Thế kỷ 19 đến Nay (Giao thoa văn hóa phương Nam)',
    desc: 'Thân áo ngắn tới mông, cổ tròn hoặc lá trầu, xẻ tà hai bên hông tạo sự thoải mái tối đa khi cử động. Mặt trước có hàng cúc bấm hoặc cài, kèm theo hai túi đắp tiện dụng.',
    philosophy: 'Tượng trưng cho sự phóng khoáng, chân chất, cởi mở và tinh thần năng động của con người miền sông nước Cửu Long.',
    recommendedAccessories: ['khanran', 'nonla', 'sneaker', 'tuicoi'],
    suitableOccasions: ['Dã ngoại', 'Du lịch miền Tây', 'Dạo phố cuối tuần', 'Quán cà phê vintage'],
    referenceCitation: 'Văn hóa Nam Bộ thời khai hoang & Ký sự xứ Đàng Trong.',
    defaultSecondaryColor: '#232225',
  },
  giaolinh: {
    id: 'giaolinh',
    name: 'Áo Giao Lĩnh',
    tagline: 'Cổ phong trầm mặc thuở Lý - Trần - Lê',
    era: 'Thời Lý, Trần, Lê (Từ thế kỷ 11 đến thế kỷ 18)',
    desc: 'Kiểu áo vạt chéo đè lên nhau, tay thụng rộng hoặc tay bó, thắt đai lưng bản lớn. Đây là dạng thức trang phục phổ biến của cả nam và nữ trong tầng lớp quý tộc và trí thức thời trung đại.',
    philosophy: 'Thể hiện phong thái đĩnh đạc, ung dung tự tại của Nho sĩ Đại Việt trong thời kỳ đỉnh cao của các triều đại phong kiến độc lập.',
    recommendedAccessories: ['quat', 'man', 'chuoingoc'],
    suitableOccasions: ['Tái hiện lịch sử', 'Sự kiện cổ phong', 'Chụp ảnh phong cách kiếm hiệp/cổ trang'],
    referenceCitation: 'Bia đá thời Lý - Trần & Tranh tượng Chùa Thầy, Chùa Bút Tháp.',
    defaultSecondaryColor: '#3D7D73',
  },
};

export const ACCESSORIES: AccessoryData[] = [
  {
    id: 'nonla',
    name: 'Nón Lá Chuông',
    emoji: '👒',
    category: 'traditional',
    desc: 'Chiếc nón lá truyền thống đan từ lá cọ/lá gồi, nhẹ nhàng che mưa nắng và tạo góc nghiêng e ấp kinh điển.',
    tips: 'Nghiêng góc 15 độ khi chụp hình để tôn góc mặt thanh tú.',
  },
  {
    id: 'man',
    name: 'Khăn Xếp / Mấn Lụa',
    emoji: '🪷',
    category: 'traditional',
    desc: 'Khăn xếp vấn nhiều vòng tròn ngay ngắn trên đầu, biểu trưng cho sự chững chạc, chỉn chu và quý phái.',
    tips: 'Khăn xếp nam thường có chóp góc chữ Nhân (nhân nghĩa), mấn nữ tròn đều thanh nhã.',
  },
  {
    id: 'khanran',
    name: 'Khăn Rằn Nam Bộ',
    emoji: '🧣',
    category: 'traditional',
    desc: 'Chiếc khăn dệt sọc caro đen trắng hoặc đỏ trắng đặc trưng miền phù sa, thấm mồ hôi và cực kỳ phong trần.',
    tips: 'Quàng qua cổ thả dài hai vạt hoặc quấn hờ quanh trán tạo chất bụi bặm retro.',
  },
  {
    id: 'sneaker',
    name: 'Sneaker Chunky Retro',
    emoji: '👟',
    category: 'streetwear',
    desc: 'Điểm nhấn Gen Z Streetwear phối cùng tà áo truyền thống, vừa thoải mái di chuyển vừa bộc lộ cá tính trẻ.',
    tips: 'Chọn sneaker màu trắng/kem hoặc tiệp màu áo. Xắn gấu quần trên mắt cá 2cm để tôn form giày.',
  },
  {
    id: 'quat',
    name: 'Quạt Trầm Hương / Lụa',
    emoji: '🪭',
    category: 'traditional',
    desc: 'Phụ kiện cầm tay tao nhã của giới tao nhân mặc khách xưa, vừa tạo dáng vừa toát lên phong thái phong lưu.',
    tips: 'Cầm hờ góc quạt, khép hờ hoặc xòe nửa nan quạt trước ngực.',
  },
  {
    id: 'kinhram',
    name: 'Kính Râm Y2K Cyber',
    emoji: '🕶️',
    category: 'streetwear',
    desc: 'Cú twist phong cách viễn tưởng hiện đại đối thoại với di sản ngàn năm, phong thái tự tin và ấn tượng.',
    tips: 'Rất hợp khi đi cùng Áo Ngũ Thân hoặc Nhật Bình trong các bộ ảnh fashion lookbook.',
  },
  {
    id: 'headphone',
    name: 'Tai Nghe Chụp Tai (Over-ear)',
    emoji: '🎧',
    category: 'streetwear',
    desc: 'Vibe "Gen Z nghe nhạc Lofi truyền thống", tạo nét đối lập thị giác giữa nhịp sống công nghệ số và cội nguồn.',
    tips: 'Đeo hờ quanh cổ như một chiếc vòng cổ thời thượng.',
  },
  {
    id: 'tuicoi',
    name: 'Túi Cói / Túi Canvas Mộc',
    emoji: '👜',
    category: 'streetwear',
    desc: 'Chất liệu thân thiện môi trường từ cói dệt, hòa hợp tuyệt đối với chất liệu lụa, đũi của cổ phục.',
    tips: 'Thích hợp cho các buổi dạo phố cuối tuần, đựng vừa bình nước và sổ tay.',
  },
  {
    id: 'chuoingoc',
    name: 'Chuỗi Ngọc Trai / Thẻ Bài',
    emoji: '📿',
    category: 'traditional',
    desc: 'Chuỗi hạt ngọc trai nhã nhặn hoặc thẻ bài gỗ chạm khắc, làm sáng khuôn mặt và tôn vẻ quyền quý.',
    tips: 'Đeo 1 hoặc 2 vòng ngắn ngang ngực để không che mất đường xẻ cổ áo.',
  },
];

export const PRESET_LOOKS: PresetLook[] = [
  {
    id: 'preset-1',
    name: 'Tết Phố Đi Bộ',
    tagline: 'Gen Z tự tin dạo xuân giữa trung tâm thành phố',
    outfit: 'nguthan',
    gender: 'female',
    colorHex: '#E4A025',
    secondaryColorHex: '#EDE7DC',
    pattern: 'lotus',
    accessories: ['sneaker', 'kinhram', 'tuicoi'],
    vibe: 'Năng động · Thời thượng · Bản sắc',
  },
  {
    id: 'preset-2',
    name: 'Cung Đình Nghệ Thuật',
    tagline: 'Phong vị hoàng gia giao hòa cùng chất viễn tưởng',
    outfit: 'nhatbinh',
    gender: 'female',
    colorHex: '#1F4F89',
    secondaryColorHex: '#C82A27',
    pattern: 'clouds',
    accessories: ['man', 'headphone', 'chuoingoc'],
    vibe: 'Vương giả · Đột phá · Cyber Heritage',
  },
  {
    id: 'preset-3',
    name: 'Nàng Thơ Kinh Bắc',
    tagline: 'Dịu dàng quan họ hội Lim mùa lúa trổ đòng',
    outfit: 'tuthan',
    gender: 'female',
    colorHex: '#3D7D73',
    secondaryColorHex: '#C82A27',
    pattern: 'plain',
    accessories: ['nonla', 'quat', 'chuoingoc'],
    vibe: 'Thanh tao · Dân gian · Hoài niệm',
  },
  {
    id: 'preset-4',
    name: 'Tài Tử Sông Nước',
    tagline: 'Thong dong dạo chợ nổi buổi sớm mai',
    outfit: 'baba',
    gender: 'male',
    colorHex: '#5E402D',
    secondaryColorHex: '#232225',
    pattern: 'plain',
    accessories: ['khanran', 'nonla', 'sneaker'],
    vibe: 'Chân chất · Phóng khoáng · Bụi bặm',
  },
  {
    id: 'preset-5',
    name: 'Sĩ Tử Tràng An',
    tagline: 'Khí chất nho nhã, lịch duyệt chốn trường thi',
    outfit: 'nguthan',
    gender: 'male',
    colorHex: '#232225',
    secondaryColorHex: '#EDE7DC',
    pattern: 'tho',
    accessories: ['man', 'quat', 'sneaker'],
    vibe: 'Nghiêm cẩn · Trí tuệu · Hiện đại',
  },
  {
    id: 'preset-6',
    name: 'Áo Dài Tân Thời',
    tagline: 'Thanh xuân rực rỡ với sắc đỏ may mắn',
    outfit: 'aodai',
    gender: 'female',
    colorHex: '#C82A27',
    secondaryColorHex: '#EDE7DC',
    pattern: 'lotus',
    accessories: ['man', 'quat', 'chuoingoc'],
    vibe: 'Duyên dáng · Truyền thống · Hỷ sự',
  },
];

export function analyzeCulturalContext(
  outfit: OutfitId,
  accessories: AccessoryId[]
): CulturalWarning[] {
  const warnings: CulturalWarning[] = [];

  // Outfit specific insights
  if (outfit === 'nguthan') {
    warnings.push({
      severity: 'tip',
      title: 'Triết lý Áo Ngũ Thân',
      message: 'Áo có 5 thân vải tượng trưng cho Tứ thân phụ mẫu che chở cho người mặc. Cài đủ 5 khuy tượng trưng cho Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín).',
      historyContext: 'Quy định cải cách của Chúa Nguyễn Vũ Vương năm 1744 nhằm thống nhất y phục Đàng Trong.',
    });
  }

  if (outfit === 'nhatbinh') {
    warnings.push({
      severity: 'tip',
      title: 'Dải Cổ Ngũ Sắc Triều Nguyễn',
      message: 'Cổ áo Nhật Bình viền các hoa văn loan phượng hoặc hoa lá cùng dải ngũ sắc tượng trưng cho ngũ hành tương sinh tương khắc nơi cung đình.',
      historyContext: 'Trang phục dành cho bậc Hoàng hậu, Phi tần và mệnh phụ quan lại triều Nguyễn.',
    });
  }

  // Cross accessory checks
  if (outfit === 'aodai' && accessories.includes('khanran')) {
    warnings.push({
      severity: 'note',
      title: 'Khăn rằn x Áo dài: Bản phối phá cách',
      message: 'Khăn rằn xuất xứ từ nét sinh hoạt phù sa Nam Bộ và vốn gắn liền với Áo Bà Ba. Phối cùng Áo Dài mang lại cá tính đường phố rất riêng, nhưng nếu tham gia nghi lễ cung đình hay hội nghị trang trọng, bạn nên cân nhắc đổi sang mấn lụa nhé!',
      historyContext: 'Khăn rằn du nhập từ cộng đồng Khmer và hòa huyết vào đời sống phương Nam từ thế kỷ 18.',
    });
  }

  if (outfit === 'tuthan' && accessories.includes('man')) {
    warnings.push({
      severity: 'note',
      title: 'Áo Tứ Thân x Mấn: Sự kết hợp cách tân',
      message: 'Trang phục truyền thống phụ nữ Bắc Bộ xưa thường đội nón quai thao hoặc chít khăn mỏ quạ đen. Đội mấn xếp là nét chấm phá giao thoa giữa phong cách miền Trung và Kinh Bắc.',
      historyContext: 'Khăn mỏ quạ chít theo hình búp sen là đặc trưng nhận diện của liền chị Kinh Bắc.',
    });
  }

  if (accessories.includes('sneaker')) {
    warnings.push({
      severity: 'praise',
      title: 'Streetwear Fusion: Cực kỳ năng động!',
      message: 'Sneaker cùng cổ phục là xu hướng được cộng đồng cổ phong Gen Z rất ưa chuộng vì vừa êm chân vừa tôn nét hiện đại. Mẹo nhỏ: Hãy chọn vạt quần dài vừa chạm mắt cá để tránh vấp tà khi bước nhanh.',
      historyContext: 'Di sản chỉ thực sự sống khi được thế hệ trẻ mặc vào nhịp sống thường nhật.',
    });
  }

  if (accessories.includes('headphone') || accessories.includes('kinhram')) {
    warnings.push({
      severity: 'praise',
      title: 'Cyberpunk & Cổ phục: Điểm 10 thần thái',
      message: 'Sự tương phản giữa phụ kiện công nghệ hiện đại và chất liệu lụa tơ tằm cổ điển tạo nên chất ảnh editorial cực hút mắt cho các bộ ảnh lookbook.',
      historyContext: 'Trang phục luôn biến chuyển theo dòng thời gian của mỗi thế hệ.',
    });
  }

  if (outfit === 'baba' && accessories.includes('khanran')) {
    warnings.push({
      severity: 'praise',
      title: 'Bộ đôi chuẩn mực miền Tây',
      message: 'Áo Bà Ba đi cùng Khăn Rằn là biểu tượng bất hủ của người dân Nam Bộ: giản dị, chân phương mà hào sảng.',
      historyContext: 'Gắn liền với hình ảnh người con gái miền Tây duyên dáng trên bến phà, con nước phù sa.',
    });
  }

  return warnings;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    targetOutfit: OutfitId;
    trait: string;
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Khi dạo phố cuối tuần cùng bạn bè, bạn muốn outfit của mình toát lên điều gì nhất?',
    options: [
      { text: 'Thanh lịch nhẹ nhàng, bay bổng trong gió', targetOutfit: 'aodai', trait: 'Duyên dáng' },
      { text: 'Chững chạc, chuẩn mực và có chiều sâu tri thức', targetOutfit: 'nguthan', trait: 'Đĩnh đạc' },
      { text: 'Lộng lẫy, kiêu kỳ như bước ra từ phim điện ảnh', targetOutfit: 'nhatbinh', trait: 'Vương giả' },
      { text: 'Mộc mạc, thoải mái vô tư không gò bó', targetOutfit: 'baba', trait: 'Chân phương' },
    ],
  },
  {
    id: 2,
    question: 'Địa điểm chụp hình trong mơ của bạn là ở đâu?',
    options: [
      { text: 'Cố đô Huế với cung điện ngói hoàng lưu ly trầm mặc', targetOutfit: 'nhatbinh', trait: 'Cổ kính' },
      { text: 'Cánh đồng lúa vàng Bắc Bộ trong mùa gặt rộn rã', targetOutfit: 'tuthan', trait: 'Dân gian' },
      { text: 'Chợ nổi Cà Mau rực rỡ trái cây sông nước', targetOutfit: 'baba', trait: 'Phóng khoáng' },
      { text: 'Khu phố cổ Hội An hoặc Văn Miếu Quốc Tử Giám rêu phong', targetOutfit: 'nguthan', trait: 'Nho nhã' },
    ],
  },
  {
    id: 3,
    question: 'Phụ kiện nào khiến bạn cảm thấy tự tin và mang đậm dấu ấn cá nhân nhất?',
    options: [
      { text: 'Đôi chunky sneaker đế cao cực êm chân', targetOutfit: 'nguthan', trait: 'Năng động' },
      { text: 'Chiếc nón lá truyền thống che nghiêng nửa khuôn mặt', targetOutfit: 'aodai', trait: 'Kín đáo' },
      { text: 'Chuỗi ngọc trai và mấn xếp quý phái trên tóc', targetOutfit: 'nhatbinh', trait: 'Sang trọng' },
      { text: 'Chiếc khăn rằn mộc mạc quấn hờ quanh cổ', targetOutfit: 'baba', trait: 'Bụi bặm' },
    ],
  },
];
