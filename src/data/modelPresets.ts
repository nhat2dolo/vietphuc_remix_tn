// Preset background models and scenes for immediate virtual try-on

export interface ModelPreset {
  id: string;
  name: string;
  tagline: string;
  dataUri: string;
}

const svgToUri = (svgStr: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;

// 1. Female Standing Portrait Model
const femaleModelSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgG" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F5EFEB"/>
      <stop offset="100%" stop-color="#E2D7C8"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FFF8EE" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#E2D7C8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="400" height="600" fill="url(#bgG)"/>
  <circle cx="200" cy="200" r="180" fill="url(#halo)"/>

  <!-- Soft Shadow -->
  <ellipse cx="200" cy="565" rx="100" ry="12" fill="rgba(0,0,0,0.12)"/>

  <!-- Legs / Base Trousers -->
  <path d="M175 340 L168 540 L188 540 L195 380 L205 380 L212 540 L232 540 L225 340 Z" fill="#E8DEC8"/>
  <ellipse cx="178" cy="545" rx="12" ry="5" fill="#C5B7A1"/>
  <ellipse cx="222" cy="545" rx="12" ry="5" fill="#C5B7A1"/>

  <!-- Silhouette Torso & Basic Base Layer -->
  <path d="M160 170 C170 160 190 156 200 156 C210 156 230 160 240 170 L248 340 L152 340 Z" fill="#F4EADB"/>
  <path d="M152 172 L120 280 L136 288 L164 210 Z" fill="#F4EADB"/>
  <path d="M248 172 L280 280 L264 288 L236 210 Z" fill="#F4EADB"/>
  <circle cx="126" cy="284" r="10" fill="#FCD7BA"/>
  <circle cx="274" cy="284" r="10" fill="#FCD7BA"/>

  <!-- Neck -->
  <rect x="187" y="125" width="26" height="35" rx="5" fill="#FCD7BA"/>

  <!-- Head & Facial Features -->
  <ellipse cx="200" cy="95" rx="28" ry="36" fill="#FDE1CA"/>
  <!-- Eyes, Lips, Hair -->
  <path d="M182 85 Q190 82 195 85" stroke="#4A3423" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M205 85 Q210 82 218 85" stroke="#4A3423" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="188" cy="93" rx="3.5" ry="2" fill="#2E2319"/>
  <ellipse cx="212" cy="93" rx="3.5" ry="2" fill="#2E2319"/>
  <path d="M200 93 L199 102 L202 103" stroke="#D79E79" stroke-width="1.5" fill="none"/>
  <path d="M194 110 Q200 114 206 110" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <!-- Hair Bun -->
  <circle cx="200" cy="56" r="18" fill="#1C1815"/>
  <path d="M172 90 C172 65 182 58 200 60 C218 58 228 65 228 90 C218 76 206 74 200 76 C194 74 182 76 172 90 Z" fill="#1C1815"/>
</svg>`;

// 2. Male Standing Portrait Model
const maleModelSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EEF2F6"/>
      <stop offset="100%" stop-color="#CFD9E5"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bgM)"/>
  <ellipse cx="200" cy="565" rx="110" ry="14" fill="rgba(0,0,0,0.12)"/>

  <!-- Legs -->
  <path d="M170 340 L162 540 L188 540 L195 380 L205 380 L212 540 L238 540 L230 340 Z" fill="#2A323D"/>
  <ellipse cx="175" cy="545" rx="14" ry="6" fill="#1E232B"/>
  <ellipse cx="225" cy="545" rx="14" ry="6" fill="#1E232B"/>

  <!-- Broad Shoulders -->
  <path d="M150 170 C165 158 190 154 200 154 C210 154 235 158 250 170 L256 340 L144 340 Z" fill="#E2E8F0"/>
  <path d="M144 172 L110 280 L128 290 L158 210 Z" fill="#E2E8F0"/>
  <path d="M256 172 L290 280 L272 290 L242 210 Z" fill="#E2E8F0"/>
  <circle cx="118" cy="286" r="11" fill="#FCD7BA"/>
  <circle cx="282" cy="286" r="11" fill="#FCD7BA"/>

  <!-- Neck -->
  <rect x="185" y="122" width="30" height="38" rx="5" fill="#FCD7BA"/>

  <!-- Head -->
  <ellipse cx="200" cy="92" rx="30" ry="38" fill="#FDE1CA"/>
  <path d="M180 82 Q188 78 195 82" stroke="#332418" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <path d="M205 82 Q212 78 220 82" stroke="#332418" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <ellipse cx="187" cy="90" rx="3.5" ry="2" fill="#2E2319"/>
  <ellipse cx="213" cy="90" rx="3.5" ry="2" fill="#2E2319"/>
  <path d="M200 90 L199 100 L203 101" stroke="#D79E79" stroke-width="1.6" fill="none"/>
  <path d="M192 108 Q200 110 208 108" stroke="#B91C1C" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <!-- Hair -->
  <circle cx="200" cy="58" r="15" fill="#18181B"/>
  <path d="M170 85 C170 60 182 54 200 54 C218 54 230 60 230 85 C220 72 208 70 200 70 C192 70 180 72 170 85 Z" fill="#18181B"/>
</svg>`;

// 3. Ancient Heritage Garden Backdrop
const courtyardSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="skyG" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFEED6"/>
      <stop offset="50%" stop-color="#FCD5A4"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <!-- Sunset Sky -->
  <rect width="400" height="600" fill="url(#skyG)"/>
  <!-- Sun -->
  <circle cx="200" cy="180" r="70" fill="#FFFDF5" opacity="0.85"/>

  <!-- Ancient Temple Gate Silhouette in Distance -->
  <path d="M60 280 L120 230 L280 230 L340 280 L320 290 L80 290 Z" fill="#7C2D12" opacity="0.6"/>
  <rect x="130" y="280" width="140" height="120" fill="#9A3412" opacity="0.5"/>
  <path d="M170 400 C170 330 230 330 230 400 Z" fill="#FFEED6" opacity="0.7"/>

  <!-- Courtyard Stone Bricks Ground -->
  <rect x="0" y="400" width="400" height="200" fill="#78350F"/>
  <line x1="0" y1="440" x2="400" y2="440" stroke="#9A3412" stroke-width="2"/>
  <line x1="0" y1="490" x2="400" y2="490" stroke="#9A3412" stroke-width="2"/>
  <line x1="0" y1="545" x2="400" y2="545" stroke="#9A3412" stroke-width="2"/>

  <!-- Soft Mannequin Target Shadow in Center -->
  <ellipse cx="200" cy="530" rx="90" ry="14" fill="rgba(0,0,0,0.3)"/>
  <text x="200" y="320" font-family="serif" font-size="16" fill="#FFF8EE" text-anchor="middle" opacity="0.85">Kéo thả trang phục vào đây</text>
</svg>`;

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'model-female',
    name: 'Người Mẫu Nữ',
    tagline: 'Dáng đứng chuẩn thử áo dài, tứ thân, nhật bình',
    dataUri: svgToUri(femaleModelSvg),
  },
  {
    id: 'model-male',
    name: 'Người Mẫu Nam',
    tagline: 'Dáng đứng chuẩn thử áo ngũ thân, áo bà ba',
    dataUri: svgToUri(maleModelSvg),
  },
  {
    id: 'model-courtyard',
    name: 'Sân Đình Cổ Kính',
    tagline: 'Bối cảnh hoàng hôn cổ phong Đại Việt',
    dataUri: svgToUri(courtyardSvg),
  },
];
