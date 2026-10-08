// Preset background models and scenes for immediate virtual try-on
// High-fidelity anatomy: natural contours, sculpted necks and graceful hands (no stiff paper doll cutout)

export interface ModelPreset {
  id: string;
  name: string;
  tagline: string;
  dataUri: string;
}

const svgToUri = (svgStr: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;

// 1. Female Standing Portrait Model with Natural Human Anatomy
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
    <linearGradient id="skinF" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE8D4"/>
      <stop offset="60%" stop-color="#F8D4B7"/>
      <stop offset="100%" stop-color="#ECC19E"/>
    </linearGradient>
  </defs>
  <!-- Background Studio Environment -->
  <rect width="400" height="600" fill="url(#bgG)"/>
  <circle cx="200" cy="200" r="180" fill="url(#halo)"/>

  <!-- Soft Ground Ambient Shadow -->
  <ellipse cx="200" cy="565" rx="105" ry="12" fill="rgba(0,0,0,0.12)"/>

  <!-- Legs / Base Silk Trousers -->
  <path d="M174 340 L166 540 L188 540 L195 380 L205 380 L212 540 L234 540 L226 340 Z" fill="#E8DEC8"/>
  <ellipse cx="177" cy="545" rx="12" ry="5" fill="#B39F85"/>
  <ellipse cx="223" cy="545" rx="12" ry="5" fill="#B39F85"/>

  <!-- Torso & Natural Shoulder Contours -->
  <path d="M156 168 C168 158 190 154 200 154 C210 154 232 158 244 168 L248 340 L152 340 Z" fill="#F4EADB"/>
  <path d="M152 170 C140 205 125 245 118 280 L134 286 C144 250 156 215 164 195 Z" fill="#F4EADB"/>
  <path d="M248 170 C260 205 275 245 282 280 L266 286 C256 250 244 215 236 195 Z" fill="#F4EADB"/>

  <!-- Graceful Sculpted Hands (No floating circles) -->
  <ellipse cx="125" cy="283" rx="7" ry="9" fill="url(#skinF)" transform="rotate(-15 125 283)"/>
  <ellipse cx="275" cy="283" rx="7" ry="9" fill="url(#skinF)" transform="rotate(15 275 283)"/>

  <!-- Naturally Sculpted Neck Tapering into Clavicle (No crude rectangle) -->
  <path d="M187 122 C187 136 182 152 176 160 L224 160 C218 152 213 136 213 122 Z" fill="url(#skinF)"/>
  <path d="M188 124 Q200 132 212 124" stroke="#D79E79" stroke-width="1.2" fill="none" opacity="0.3"/>
  <path d="M182 158 Q192 160 200 163 Q208 160 218 158" stroke="#D79E79" stroke-width="0.8" fill="none" opacity="0.3"/>

  <!-- Symmetrical Head & Facial Features -->
  <ellipse cx="200" cy="94" rx="27" ry="34" fill="url(#skinF)"/>
  <ellipse cx="184" cy="102" rx="5" ry="3" fill="#F87171" opacity="0.22"/>
  <ellipse cx="216" cy="102" rx="5" ry="3" fill="#F87171" opacity="0.22"/>

  <!-- Eyes, Lips, Serene Facial Expression -->
  <path d="M183 85 Q189 82 195 85" stroke="#3D291C" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M205 85 Q211 82 217 85" stroke="#3D291C" stroke-width="2" stroke-linecap="round" fill="none"/>
  <ellipse cx="189" cy="92" rx="3" ry="2" fill="#261A13"/>
  <ellipse cx="211" cy="92" rx="3" ry="2" fill="#261A13"/>
  <path d="M200 91 L199 100 L202 101" stroke="#C98A62" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M195 109 Q200 112 205 109" stroke="#C82A27" stroke-width="2.2" stroke-linecap="round" fill="none"/>

  <!-- Hair Bun (Tucked neatly, ready for headwear without clipping) -->
  <circle cx="200" cy="56" r="16" fill="#1C1815"/>
  <path d="M174 88 C174 65 184 58 200 60 C216 58 226 65 226 88 C216 75 206 73 200 74 C194 73 184 75 174 88 Z" fill="#1C1815"/>
</svg>`;

// 2. Male Standing Portrait Model with Natural Anatomy
const maleModelSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgM" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EEF2F6"/>
      <stop offset="100%" stop-color="#CFD9E5"/>
    </linearGradient>
    <linearGradient id="skinM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE5D0"/>
      <stop offset="60%" stop-color="#F5CEB0"/>
      <stop offset="100%" stop-color="#E5B995"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#bgM)"/>
  <ellipse cx="200" cy="565" rx="110" ry="14" fill="rgba(0,0,0,0.12)"/>

  <!-- Legs -->
  <path d="M170 340 L162 540 L188 540 L195 380 L205 380 L212 540 L238 540 L230 340 Z" fill="#2A323D"/>
  <ellipse cx="175" cy="545" rx="14" ry="6" fill="#1E232B"/>
  <ellipse cx="225" cy="545" rx="14" ry="6" fill="#1E232B"/>

  <!-- Broad Natural Shoulders -->
  <path d="M148 168 C164 156 190 152 200 152 C210 152 236 156 252 168 L256 340 L144 340 Z" fill="#E2E8F0"/>
  <path d="M144 170 C132 205 116 248 108 280 L126 288 C136 250 150 215 158 195 Z" fill="#E2E8F0"/>
  <path d="M256 170 C268 205 284 248 292 280 L274 288 C264 250 250 215 242 195 Z" fill="#E2E8F0"/>

  <!-- Natural Hands -->
  <ellipse cx="116" cy="285" rx="8" ry="10" fill="url(#skinM)" transform="rotate(-15 116 285)"/>
  <ellipse cx="284" cy="285" rx="8" ry="10" fill="url(#skinM)" transform="rotate(15 284 285)"/>

  <!-- Natural Sculpted Neck -->
  <path d="M185 120 C185 136 178 152 172 160 L228 160 C222 152 215 136 215 120 Z" fill="url(#skinM)"/>

  <!-- Head -->
  <ellipse cx="200" cy="92" rx="28" ry="36" fill="url(#skinM)"/>
  <path d="M178 81 L196 80" stroke="#261A13" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M204 80 L222 81" stroke="#261A13" stroke-width="3" stroke-linecap="round" fill="none"/>
  <ellipse cx="188" cy="89" rx="3" ry="2" fill="#2E2319"/>
  <ellipse cx="212" cy="89" rx="3" ry="2" fill="#2E2319"/>
  <path d="M200 89 L199 98 L203 99" stroke="#C98A62" stroke-width="1.4" fill="none"/>
  <path d="M194 107 L206 107" stroke="#C27A5B" stroke-width="1.8" stroke-linecap="round" fill="none"/>

  <!-- Modern Neat Short Hair (No Bun) -->
  <path d="M172 82 C172 58 182 48 200 48 C218 48 228 58 228 82 C226 77 222 72 216 70 C208 66 192 66 184 70 C178 72 174 77 172 82 Z" fill="#18181B"/>
  <path d="M174 70 C177 56 187 48 200 48 C212 48 224 53 226 67 C220 60 210 57 200 58 C189 59 180 62 174 70 Z" fill="#27272A"/>
  <path d="M192 50 C193 56 191 62 189 67" stroke="#3F3F46" stroke-width="1.2" stroke-linecap="round" fill="none"/>
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
