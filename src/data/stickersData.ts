// SVG sticker definitions with transparent backgrounds for Fabric.js Virtual Try-On
// High-fidelity aesthetic: cultural authenticity, correct collars, symmetrical ribbons, and natural drapery

export interface StickerItem {
  id: string;
  category: 'aodai' | 'nguthan' | 'nhatbinh' | 'tuthan' | 'baba' | 'phukien';
  name: string;
  type: 'ao' | 'mu' | 'khan' | 'giay' | 'phukien';
  svgDataUri: string;
  info: string;
  warning?: string;
}

// Helper to encode SVG string to Data URI
const svgToUri = (svgStr: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;

// 1. Áo Dài SVGs with historically authentic standing collar
const svgAoDai = (color: string, collarColor: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320" width="200" height="320">
  <defs>
    <linearGradient id="sh" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.22"/>
      <stop offset="45%" stop-color="#fff" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <!-- Natural Flowing Sleeves -->
  <path d="M60 42 C44 70 24 100 10 130 L32 142 C44 112 60 85 72 75 Z" fill="${color}" />
  <path d="M140 42 C156 70 176 100 190 130 L168 142 C156 112 140 85 128 75 Z" fill="${color}" />
  <!-- Main Body / Flowing Panels -->
  <path d="M66 40 C76 34 88 32 100 32 C112 32 124 34 134 40 C144 56 146 95 142 140 C138 165 130 190 130 205 L160 315 L40 315 L70 205 C70 190 62 165 58 140 C54 95 56 56 66 40 Z" fill="${color}" />
  <!-- Side slit seam shadow -->
  <path d="M70 205 L40 315" stroke="rgba(0,0,0,0.18)" stroke-width="1.5" />
  <path d="M130 205 L160 315" stroke="rgba(0,0,0,0.18)" stroke-width="1.5" />
  <!-- Textile Sheen -->
  <path d="M66 40 C76 34 88 32 100 32 C112 32 124 34 134 40 C144 56 146 95 142 140 C138 165 130 190 130 205 L160 315 L40 315 L70 205 Z" fill="url(#sh)" />
  <!-- Historically Accurate Standing Collar (Cổ Đứng Chuẩn Mực 3cm) -->
  <path d="M85 20 C92 16 108 16 115 20 C117 26 117 32 115 36 C108 39 92 39 85 36 C83 32 83 26 85 20 Z" fill="${collarColor}" stroke="#3A0D0B" stroke-width="1.2" />
  <path d="M86 21 C93 18 107 18 114 21" stroke="#FAF7F2" stroke-width="1.8" fill="none" />
  <!-- Diagonal button placket to right underarm -->
  <path d="M100 36 C112 38 125 46 132 58 C136 68 138 85 138 105" stroke="#FFE082" stroke-width="1.8" stroke-dasharray="2 3" fill="none" />
</svg>`;

// 2. Áo Ngũ Thân SVGs with authentic Lập Lĩnh standing collar & 5 buttons
const svgNguThan = (color: string, collarColor: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 320" width="220" height="320">
  <defs>
    <linearGradient id="shN" x1="15%" y1="0%" x2="85%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.28"/>
    </linearGradient>
    <linearGradient id="goldB" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
  </defs>
  <!-- Stately Sleeves -->
  <path d="M60 42 L8 120 L32 136 L74 80 Z" fill="${color}" />
  <path d="M160 42 L212 120 L188 136 L146 80 Z" fill="${color}" />
  <!-- Broad 5-panel body -->
  <path d="M62 40 C76 34 96 32 110 32 C124 32 144 34 158 40 L174 120 L186 315 L34 315 L46 120 Z" fill="${color}" />
  <!-- 5th inner panel seam -->
  <path d="M110 36 L138 140 L142 315" stroke="rgba(0,0,0,0.2)" stroke-width="1.8" fill="none" />
  <path d="M62 40 C76 34 96 32 110 32 C124 32 144 34 158 40 L174 120 L186 315 L34 315 Z" fill="url(#shN)" />
  <!-- Authentic Lập Lĩnh Collar (Cong Đứng Tự Nhiên, Không Biến Dạng) -->
  <path d="M94 18 C102 15 118 15 126 18 C128 24 128 32 126 36 C118 39 102 39 94 36 C92 32 92 24 94 18 Z" fill="${collarColor}" stroke="#3A1700" stroke-width="1.4" />
  <path d="M96 19 C103 17 117 17 124 19" stroke="#FAF7F2" stroke-width="2" fill="none" />
  <!-- 5 Hạt Cúc Ngũ Thường Chuẩn Mực -->
  <circle cx="110" cy="27" r="3" fill="url(#goldB)" stroke="#78350F" stroke-width="0.8" />
  <circle cx="122" cy="42" r="3" fill="url(#goldB)" stroke="#78350F" stroke-width="0.8" />
  <circle cx="138" cy="62" r="3" fill="url(#goldB)" stroke="#78350F" stroke-width="0.8" />
  <circle cx="146" cy="92" r="3" fill="url(#goldB)" stroke="#78350F" stroke-width="0.8" />
  <circle cx="150" cy="130" r="3" fill="url(#goldB)" stroke="#78350F" stroke-width="0.8" />
</svg>`;

// 3. Áo Nhật Bình Royal Court SVGs
const svgNhatBinh = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 320" width="250" height="320">
  <defs>
    <linearGradient id="goldRibbonSticker" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
  </defs>
  <!-- Royal Flowing Sleeves with 5-color cuffs -->
  <path d="M70 45 L10 100 L4 210 L65 200 L84 100 Z" fill="${color}" />
  <path d="M180 45 L240 100 L246 210 L185 200 L166 100 Z" fill="${color}" />
  <!-- Sleeve rainbow ribbons -->
  <path d="M4 200 L65 190 L65 200 L4 210 Z" fill="#E4A025" />
  <path d="M6 190 L63 180 L63 190 L4 200 Z" fill="#1F4F89" />
  <path d="M8 180 L61 170 L61 180 L6 190 Z" fill="#C82A27" />
  <path d="M185 200 L246 210 L246 200 L185 190 Z" fill="#E4A025" />
  <path d="M187 190 L244 200 L244 190 L187 180 Z" fill="#1F4F89" />
  <path d="M189 180 L242 190 L242 180 L189 170 Z" fill="#C82A27" />
  <!-- Main Robe Body -->
  <path d="M72 42 C84 36 110 34 125 34 C140 34 166 36 178 42 L196 120 L206 315 L44 315 L54 120 Z" fill="${color}" />
  <!-- Historically Accurate Rectangular Court Collar (Cổ Nhật Bình Trang Trọng) -->
  <path d="M102 24 C110 22 140 22 148 24 L148 135 L136 135 L136 44 C132 42 118 42 114 44 L114 135 L102 135 Z" fill="url(#goldRibbonSticker)" stroke="#B45309" stroke-width="1.4" />
  <path d="M106 28 L144 28 L144 133 L138 133 L138 40 L112 40 L112 133 L106 133 Z" fill="#C82A27" />
  <path d="M110 32 L140 32 L140 131 L136 131 L136 38 L114 38 L114 131 L110 131 Z" fill="#1F4F89" />
  <!-- Golden Clasps -->
  <circle cx="125" cy="75" r="4.2" fill="#FEF08A" stroke="#92400E" stroke-width="1.2" />
  <circle cx="125" cy="115" r="3.8" fill="#FEF08A" stroke="#92400E" stroke-width="1" />
  <!-- Symmetrical Hanging Ribbons (Dải thùy lưu) -->
  <path d="M116 135 L113 260 L121 260 L122 135 Z" fill="#E4A025" stroke="#92400E" stroke-width="0.8" />
  <path d="M128 135 L129 260 L137 260 L134 135 Z" fill="#E4A025" stroke="#92400E" stroke-width="0.8" />
</svg>`;

// 4. Áo Tứ Thân SVGs
const svgTuThan = (color: string, yemColor: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 320" width="200" height="320">
  <!-- Sleeves -->
  <path d="M60 40 L12 120 L34 134 L74 80 Z" fill="${color}" />
  <path d="M140 40 L188 120 L166 134 L126 80 Z" fill="${color}" />
  <!-- Yếm Đào under garment -->
  <path d="M80 34 C86 31 114 31 120 34 L130 120 L70 120 Z" fill="${yemColor}" />
  <path d="M82 32 Q100 28 118 32" stroke="#FEF08A" stroke-width="1.8" fill="none" />
  <!-- Black skirt underneath -->
  <path d="M65 125 L135 125 L155 315 L45 315 Z" fill="#18181B" />
  <!-- 4 Panels (Knotted in front) -->
  <path d="M60 38 L80 38 L76 135 L44 310 L32 245 L50 115 Z" fill="${color}" />
  <path d="M140 38 L120 38 L124 135 L156 310 L168 245 L150 115 Z" fill="${color}" />
  <!-- Tied knots -->
  <path d="M80 135 C90 150 96 165 92 215 L84 215 C86 170 82 150 76 135 Z" fill="${color}" />
  <path d="M120 135 C110 150 104 165 108 215 L116 215 C114 170 118 150 124 135 Z" fill="${color}" />
  <!-- Silk Sash / Bao Tượng -->
  <rect x="70" y="128" width="60" height="14" rx="2" fill="#E4A025" />
  <path d="M96 142 L90 200 L98 200 L102 142 Z" fill="#F59E0B" />
  <path d="M104 142 L108 210 L116 210 L110 142 Z" fill="#EF4444" />
</svg>`;

// 5. Áo Bà Ba SVGs
const svgBaBa = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 230" width="190" height="230">
  <!-- Sleeves -->
  <path d="M55 38 L8 120 L28 132 L68 75 Z" fill="${color}" />
  <path d="M135 38 L182 120 L162 132 L122 75 Z" fill="${color}" />
  <!-- Body with side slit -->
  <path d="M60 36 C68 32 85 30 95 30 C105 30 122 32 130 36 C136 50 138 80 134 125 L140 210 L116 210 L95 206 L74 210 L50 210 L56 125 C52 80 54 50 60 36 Z" fill="${color}" />
  <!-- Round Betel Leaf Scoop Collar -->
  <path d="M78 26 C84 38 106 38 112 26" stroke="${color}" stroke-width="3.5" fill="none" />
  <!-- Center Buttons -->
  <line x1="95" y1="36" x2="95" y2="206" stroke="rgba(0,0,0,0.18)" stroke-width="1.8" />
  <circle cx="95" cy="50" r="2.5" fill="#FFFDF5" stroke="#3D281B" stroke-width="0.8" />
  <circle cx="95" cy="80" r="2.5" fill="#FFFDF5" stroke="#3D281B" stroke-width="0.8" />
  <circle cx="95" cy="110" r="2.5" fill="#FFFDF5" stroke="#3D281B" stroke-width="0.8" />
  <circle cx="95" cy="140" r="2.5" fill="#FFFDF5" stroke="#3D281B" stroke-width="0.8" />
  <circle cx="95" cy="170" r="2.5" fill="#FFFDF5" stroke="#3D281B" stroke-width="0.8" />
  <!-- Two Characteristic Patch Pockets -->
  <rect x="66" y="152" width="22" height="26" rx="2" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
  <rect x="102" y="152" width="22" height="26" rx="2" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
</svg>`;

// 6. Refined Accessories SVGs (Natural, Symmetrical, No Clipping, No Awkward Straps Across Face)
const svgNonLa = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110" width="160" height="110">
  <defs>
    <linearGradient id="nlGrad" x1="30%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="40%" stop-color="#FEF3C7" />
      <stop offset="75%" stop-color="#FDE68A" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <radialGradient id="nlInner" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#78350F" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#B45309" stop-opacity="0.05" />
    </radialGradient>
  </defs>
  <!-- Inner Rim Shadow -->
  <ellipse cx="80" cy="56" rx="66" ry="12" fill="url(#nlInner)" />

  <!-- 3D Conical Hat Body -->
  <path d="M14 54 C35 50 60 48 80 8 C100 48 125 50 146 54 C125 68 35 68 14 54 Z" fill="url(#nlGrad)" stroke="#B45309" stroke-width="1.2" />

  <!-- Concentric Bamboo Rings -->
  <path d="M24 51 Q80 62 136 51" stroke="#B45309" stroke-width="0.7" fill="none" opacity="0.6" />
  <path d="M38 44 Q80 53 122 44" stroke="#B45309" stroke-width="0.7" fill="none" opacity="0.6" />
  <path d="M52 35 Q80 43 108 35" stroke="#B45309" stroke-width="0.7" fill="none" opacity="0.6" />
  <path d="M64 24 Q80 30 96 24" stroke="#B45309" stroke-width="0.7" fill="none" opacity="0.6" />

  <!-- Front Rim Curve -->
  <path d="M14 54 Q80 66 146 54" stroke="#D97706" stroke-width="1.6" fill="none" />

  <!-- Symmetrical Elegant Silk Ribbon Chin Strap (Draped Under Chin, Framing Face Beautifully) -->
  <g id="silk-ribbon">
    <path d="M46 56 C48 72 58 92 80 96" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" fill="none" />
    <path d="M114 56 C112 72 102 92 80 96" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" fill="none" />
    <ellipse cx="80" cy="97" rx="2.8" ry="1.8" fill="#E11D48" />
    <path d="M78 98 C76 102 74 105 73 108" stroke="#F43F5E" stroke-width="1.8" stroke-linecap="round" fill="none" />
    <path d="M82 98 C84 102 86 105 87 108" stroke="#F43F5E" stroke-width="1.8" stroke-linecap="round" fill="none" />
  </g>
</svg>`;

const svgNonQuaiThao = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110" width="160" height="110">
  <defs>
    <linearGradient id="nqtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="100%" stop-color="#EAB308" />
    </linearGradient>
  </defs>
  <!-- Large flat palm hat with concentric rings -->
  <ellipse cx="80" cy="35" rx="74" ry="24" fill="url(#nqtGrad)" stroke="#B45309" stroke-width="1.6" />
  <ellipse cx="80" cy="35" rx="58" ry="17" fill="#FDE047" stroke="#92400E" stroke-width="1" />
  <ellipse cx="80" cy="35" rx="38" ry="10" fill="#CA8A04" stroke="#78350F" stroke-width="1" />

  <!-- Symmetrical Hanging Quai Thao Ribbons Beside Ears -->
  <path d="M38 35 C32 60 30 85 36 108" stroke="#DC2626" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M122 35 C128 60 130 85 124 108" stroke="#16A34A" stroke-width="3" stroke-linecap="round" fill="none" />
</svg>`;

const svgManTurban = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" width="120" height="60">
  <!-- Wrapped concentric turban with natural silk folds -->
  <ellipse cx="60" cy="32" rx="54" ry="24" fill="${color}" stroke="#3A1700" stroke-width="1.4" />
  <ellipse cx="60" cy="28" rx="46" ry="19" fill="${color}" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" />
  <ellipse cx="60" cy="24" rx="38" ry="15" fill="${color}" stroke="rgba(0,0,0,0.18)" stroke-width="1" />
  <!-- Male style subtle front notch -->
  <path d="M56 39 L60 34 L64 39" stroke="#FFDF9B" stroke-width="1.8" fill="none" />
</svg>`;

const svgKhanRan = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 160" width="100" height="160">
  <!-- Gingham Scarf draped cleanly around neck -->
  <path d="M25 15 C35 35 42 45 42 65 L38 150 L20 150 L20 50 C20 30 22 20 25 15 Z" fill="#27272A" stroke="#F4F4F5" stroke-width="1.6" stroke-dasharray="4 4" />
  <path d="M75 15 C65 35 58 45 58 65 L62 145 L80 145 L80 50 C80 30 78 20 75 15 Z" fill="#27272A" stroke="#F4F4F5" stroke-width="1.6" stroke-dasharray="4 4" />
  <path d="M25 15 Q50 35 75 15" stroke="#27272A" stroke-width="10" fill="none" />
  <path d="M20 150 L20 158 M26 150 L26 158 M32 150 L32 158 M38 150 L38 158" stroke="#E4E4E7" stroke-width="1.8" />
  <path d="M62 145 L62 153 M68 145 L68 153 M74 145 L74 153 M80 145 L80 153" stroke="#E4E4E7" stroke-width="1.8" />
</svg>`;

const svgSneaker = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 80" width="130" height="80">
  <!-- Chunky Streetwear Sneaker -->
  <path d="M15 50 L35 32 L75 32 L95 48 L115 50 L118 72 L12 72 Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.8" />
  <path d="M12 68 L118 68" stroke="#EF4444" stroke-width="3.5" />
  <path d="M40 40 L65 48" stroke="#0F172A" stroke-width="2" />
  <path d="M50 35 L75 44" stroke="#0F172A" stroke-width="2" />
  <circle cx="85" cy="54" r="2.8" fill="#64748B" />
</svg>`;

const svgKinhRam = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40">
  <!-- Y2K Cyber Sunglasses -->
  <path d="M10 8 L50 6 L46 28 L10 24 Z" fill="#09090B" stroke="#E2E8F0" stroke-width="1.5" />
  <path d="M70 6 L110 8 L110 24 L74 28 Z" fill="#09090B" stroke="#E2E8F0" stroke-width="1.5" />
  <line x1="50" y1="8" x2="70" y2="8" stroke="#E2E8F0" stroke-width="2" />
  <line x1="14" y1="12" x2="35" y2="16" stroke="#06B6D4" stroke-width="1.8" stroke-linecap="round" />
  <line x1="74" y1="12" x2="95" y2="16" stroke="#06B6D4" stroke-width="1.8" stroke-linecap="round" />
</svg>`;

const svgQuat = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100" width="110" height="100">
  <!-- Traditional Silk Fan with Tassel -->
  <path d="M10 80 Q50 15 100 45 Q70 95 10 80 Z" fill="#FEF08A" stroke="#B45309" stroke-width="1.5" />
  <line x1="10" y1="80" x2="100" y2="45" stroke="#B45309" stroke-width="1" />
  <line x1="10" y1="80" x2="75" y2="28" stroke="#B45309" stroke-width="1" />
  <line x1="10" y1="80" x2="45" y2="24" stroke="#B45309" stroke-width="1" />
  <path d="M10 80 Q6 95 8 115" stroke="#DC2626" stroke-width="2.5" fill="none" />
  <circle cx="8" cy="115" r="3.5" fill="#EF4444" />
</svg>`;

const svgHeadphone = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 70" width="120" height="70">
  <!-- Padded Headband worn behind the neck / nape -->
  <path d="M22 24 C30 10 90 10 98 24" stroke="#0F172A" stroke-width="6" stroke-linecap="round" fill="none" />
  <path d="M28 24 C38 13 82 13 92 24" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none" />

  <!-- Left Earcup - Deep Navy & Matte Black Resting Behind Neck / Shoulders -->
  <g transform="rotate(-15 22 24)">
    <rect x="11" y="10" width="22" height="32" rx="9" fill="#0F172A" stroke="#1E293B" stroke-width="1.2" />
    <rect x="13" y="12" width="18" height="28" rx="7" fill="#1E3A8A" />
    <rect x="17" y="16" width="10" height="20" rx="5" fill="#1D4ED8" />
    <circle cx="22" cy="26" r="3" fill="#38BDF8" opacity="0.8" />
    <rect x="18" y="7" width="8" height="5" rx="2" fill="#475569" />
  </g>

  <!-- Right Earcup - Deep Navy & Matte Black Resting Behind Neck / Shoulders Symmetrical -->
  <g transform="rotate(15 98 24)">
    <rect x="87" y="10" width="22" height="32" rx="9" fill="#0F172A" stroke="#1E293B" stroke-width="1.2" />
    <rect x="89" y="12" width="18" height="28" rx="7" fill="#1E3A8A" />
    <rect x="93" y="16" width="10" height="20" rx="5" fill="#1D4ED8" />
    <circle cx="98" cy="26" r="3" fill="#38BDF8" opacity="0.8" />
    <rect x="94" y="7" width="8" height="5" rx="2" fill="#475569" />
  </g>
</svg>`;

const svgTuiCoi = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 120" width="90" height="120">
  <!-- Straw woven bag -->
  <path d="M45 10 Q20 50 15 75" stroke="#B45309" stroke-width="2.5" fill="none" />
  <path d="M10 70 L80 70 L74 115 L16 115 Z" fill="#D97706" stroke="#92400E" stroke-width="1.6" />
  <line x1="12" y1="82" x2="78" y2="82" stroke="#FDE68A" stroke-width="1.8" stroke-dasharray="3 3" />
  <line x1="14" y1="94" x2="76" y2="94" stroke="#FDE68A" stroke-width="1.8" stroke-dasharray="3 3" />
  <line x1="16" y1="106" x2="74" y2="106" stroke="#FDE68A" stroke-width="1.8" stroke-dasharray="3 3" />
</svg>`;

const svgChuoiNgoc = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100" height="80">
  <!-- Pearl Necklace with Green Jade Medallion -->
  <path d="M15 15 Q50 65 85 15" stroke="#FFFDF5" stroke-width="4.5" stroke-dasharray="2 5" fill="none" stroke-linecap="round" />
  <circle cx="50" cy="46" r="7.5" fill="#FDE68A" stroke="#B45309" stroke-width="1.2" />
  <circle cx="50" cy="46" r="4" fill="#10B981" />
</svg>`;

// Complete Sticker Registry
export const ALL_STICKERS: StickerItem[] = [
  // Áo Dài
  {
    id: 'ad-do-son',
    category: 'aodai',
    name: 'Áo Dài Đỏ Son',
    type: 'ao',
    svgDataUri: svgToUri(svgAoDai('#C82A27', '#8D1815')),
    info: 'Áo Dài đỏ son rực rỡ, tượng trưng cho hỷ sự, may mắn ngày Tết và dịp trọng đại.',
  },
  {
    id: 'ad-vang-nghe',
    category: 'aodai',
    name: 'Áo Dài Vàng Nghệ',
    type: 'ao',
    svgDataUri: svgToUri(svgAoDai('#E4A025', '#A36F12')),
    info: 'Sắc vàng hoàng yến thanh cao, tôn vinh nét đẹp đằm thắm của người phụ nữ Việt.',
  },
  {
    id: 'ad-xanh-ngoc',
    category: 'aodai',
    name: 'Áo Dài Xanh Ngọc',
    type: 'ao',
    svgDataUri: svgToUri(svgAoDai('#3D7D73', '#25544D')),
    info: 'Xanh ngọc bích tươi tắn, dịu dàng như hoa cỏ mùa xuân, rất được Gen Z yêu thích.',
  },
  {
    id: 'ad-trang-nga',
    category: 'aodai',
    name: 'Áo Dài Trắng Ngà',
    type: 'ao',
    svgDataUri: svgToUri(svgAoDai('#FAF7F2', '#E2D9CB')),
    info: 'Nét đẹp học trò tinh khôi và thanh khiết gắn liền với tà áo nữ sinh truyền thống.',
  },

  // Áo Ngũ Thân
  {
    id: 'nt-vang-hoang-yen',
    category: 'nguthan',
    name: 'Áo Ngũ Thân Vàng',
    type: 'ao',
    svgDataUri: svgToUri(svgNguThan('#E4A025', '#A36F12')),
    info: 'Áo ngũ thân lập lĩnh 5 khuy, tượng trưng cho Tứ thân phụ mẫu và Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín).',
    warning: 'Nên cài đủ khuy cổ để giữ phong thái đĩnh đạc trang nghiêm.',
  },
  {
    id: 'nt-xanh-lam',
    category: 'nguthan',
    name: 'Áo Ngũ Thân Lam Chàm',
    type: 'ao',
    svgDataUri: svgToUri(svgNguThan('#1F4F89', '#12335A')),
    info: 'Màu nhuộm lá chàm tự nhiên, toát lên phong thái nho nhã, trí tuệ của văn nhân xưa.',
  },
  {
    id: 'nt-den-mun',
    category: 'nguthan',
    name: 'Áo Ngũ Thân Đen Mun',
    type: 'ao',
    svgDataUri: svgToUri(svgNguThan('#232225', '#141315')),
    info: 'Trang phục mực thước của bậc túc nho và quan bác triều Nguyễn, sang trọng chuẩn mực.',
  },
  {
    id: 'nt-do-son',
    category: 'nguthan',
    name: 'Áo Ngũ Thân Đỏ Son',
    type: 'ao',
    svgDataUri: svgToUri(svgNguThan('#C82A27', '#8D1815')),
    info: 'Áo ngũ thân hỷ phục đỏ rực, thích hợp cho đám cưới cổ phong và lễ hội đầu năm.',
  },

  // Áo Nhật Bình
  {
    id: 'nb-tim-hoang-cung',
    category: 'nhatbinh',
    name: 'Nhật Bình Tím Hoàng Gia',
    type: 'ao',
    svgDataUri: svgToUri(svgNhatBinh('#6B3574')),
    info: 'Thường phục tôn quý cung đình Huế với cổ áo thêu chữ nhật ngũ sắc và dải thùy lưu trước ngực.',
    warning: 'Giữ nếp dải cổ thẳng thớm khi di chuyển để toát lên khí chất hoàng tộc.',
  },
  {
    id: 'nb-do-son',
    category: 'nhatbinh',
    name: 'Nhật Bình Đỏ Son',
    type: 'ao',
    svgDataUri: svgToUri(svgNhatBinh('#C82A27')),
    info: 'Phẩm phục vương triều lộng lẫy chốn nội cung dành cho Hoàng hậu và Công chúa.',
  },
  {
    id: 'nb-xanh-lam',
    category: 'nhatbinh',
    name: 'Nhật Bình Lam Sapphire',
    type: 'ao',
    svgDataUri: svgToUri(svgNhatBinh('#1F4F89')),
    info: 'Sắc lam sâu thẳm kết hợp viền ngũ sắc rực rỡ, vẻ đẹp kiêu kỳ và quý phái.',
  },

  // Áo Tứ Thân
  {
    id: 'tt-nau-kinh-bac',
    category: 'tuthan',
    name: 'Áo Tứ Thân Nâu Đất',
    type: 'ao',
    svgDataUri: svgToUri(svgTuThan('#5E402D', '#C82A27')),
    info: 'Đặc trưng liền chị Kinh Bắc với yếm đào rực rỡ, 4 thân áo thắt vạt lả lơi trước bụng.',
    warning: 'Thường đi cùng nón quai thao hoặc khăn mỏ quạ.',
  },
  {
    id: 'tt-xanh-reu',
    category: 'tuthan',
    name: 'Áo Tứ Thân Xanh Rêu',
    type: 'ao',
    svgDataUri: svgToUri(svgTuThan('#3D7D73', '#E4A025')),
    info: 'Tone xanh rêu phối yếm vàng hoàng yến, mang âm hưởng câu quan họ ngày hội Lim.',
  },

  // Áo Bà Ba
  {
    id: 'bb-nau-dat',
    category: 'baba',
    name: 'Áo Bà Ba Nâu Đất',
    type: 'ao',
    svgDataUri: svgToUri(svgBaBa('#5E402D')),
    info: 'Trang phục mộc mạc Nam Bộ, cổ tròn lá trầu, xẻ tà hai bên hông và hai túi đắp tiện dụng.',
    warning: 'Bộ đôi kinh điển là phối cùng khăn rằn sọc caro!',
  },
  {
    id: 'bb-den-mun',
    category: 'baba',
    name: 'Áo Bà Ba Đen Mun',
    type: 'ao',
    svgDataUri: svgToUri(svgBaBa('#232225')),
    info: 'Màu sắc dung dị của người dân khai hoang phương Nam, phong trần và nhanh nhẹn.',
  },
  {
    id: 'bb-xanh-com',
    category: 'baba',
    name: 'Áo Bà Ba Xanh Cốm',
    type: 'ao',
    svgDataUri: svgToUri(svgBaBa('#4A8C82')),
    info: 'Phiên bản bà ba màu xanh cốm tươi trẻ, phù hợp dạo phố cà phê cuối tuần.',
  },

  // Phụ Kiện
  {
    id: 'pk-non-la',
    category: 'phukien',
    name: 'Nón Lá Chuông',
    type: 'mu',
    svgDataUri: svgToUri(svgNonLa),
    info: 'Chiếc nón lá truyền thống che nghiêng, biểu tượng duyên dáng của người Việt muôn đời.',
  },
  {
    id: 'pk-non-quai-thao',
    category: 'phukien',
    name: 'Nón Quai Thao',
    type: 'mu',
    svgDataUri: svgToUri(svgNonQuaiThao),
    info: 'Chiếc nón tròn phẳng rộng vành với dải quai thao rực rỡ của liền chị quan họ.',
  },
  {
    id: 'pk-man-do',
    category: 'phukien',
    name: 'Mấn Lụa Đỏ Son',
    type: 'mu',
    svgDataUri: svgToUri(svgManTurban('#C82A27')),
    info: 'Mấn xếp nhiều vòng trên đầu, tạo vẻ chững chạc và quý phái.',
  },
  {
    id: 'pk-man-vang',
    category: 'phukien',
    name: 'Mấn Lụa Vàng Hoàng Yến',
    type: 'mu',
    svgDataUri: svgToUri(svgManTurban('#E4A025')),
    info: 'Mấn vàng hoàng gia tôn dáng khuôn mặt thanh tú khi diện cùng Áo Dài hoặc Ngũ Thân.',
  },
  {
    id: 'pk-khan-ran',
    category: 'phukien',
    name: 'Khăn Rằn Nam Bộ',
    type: 'khan',
    svgDataUri: svgToUri(svgKhanRan),
    info: 'Chiếc khăn caro thấm đẫm phù sa Nam Bộ, quàng cổ hoặc quấn trán cực kỳ phong cách.',
    warning: 'Nếu phối cùng Áo Dài, đây là bản mix phá cách đường phố rất cá tính.',
  },
  {
    id: 'pk-sneaker',
    category: 'phukien',
    name: 'Chunky Sneaker',
    type: 'giay',
    svgDataUri: svgToUri(svgSneaker),
    info: 'Điểm nhấn Gen Z Streetwear, êm ái khi đi bộ chụp ảnh và tạo độ tương phản thị giác độc đáo.',
    warning: 'Xắn gấu quần trên mắt cá để bước đi không bị vấp tà áo.',
  },
  {
    id: 'pk-kinh-ram',
    category: 'phukien',
    name: 'Kính Râm Y2K Cyber',
    type: 'phukien',
    svgDataUri: svgToUri(svgKinhRam),
    info: 'Phong thái viễn tưởng giao hòa với nét cổ điển nghìn năm.',
  },
  {
    id: 'pk-quat',
    category: 'phukien',
    name: 'Quạt Lụa Cầm Tay',
    type: 'phukien',
    svgDataUri: svgToUri(svgQuat),
    info: 'Phụ kiện tao nhã giúp tạo dáng tự nhiên khi chụp hình ngoại cảnh.',
  },
  {
    id: 'pk-headphone',
    category: 'phukien',
    name: 'Tai Nghe Over-Ear',
    type: 'phukien',
    svgDataUri: svgToUri(svgHeadphone),
    info: 'Vibe Gen Z nghe nhạc Lofi di sản dạo phố cổ.',
  },
  {
    id: 'pk-tui-coi',
    category: 'phukien',
    name: 'Túi Cói Mộc',
    type: 'phukien',
    svgDataUri: svgToUri(svgTuiCoi),
    info: 'Chất liệu thân thiện với môi trường, tôn vẻ mộc mạc.',
  },
  {
    id: 'pk-chuoi-ngoc',
    category: 'phukien',
    name: 'Chuỗi Ngọc Trai',
    type: 'phukien',
    svgDataUri: svgToUri(svgChuoiNgoc),
    info: 'Làm bừng sáng khuôn mặt và tôn vẻ đài các chốn khuê các.',
  },
];
