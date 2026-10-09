import React from 'react';
import { OutfitId, GenderMode, AccessoryId, PatternId } from '../types/vietphuc';

interface MannequinViewerProps {
  outfit: OutfitId;
  gender: GenderMode;
  colorHex: string;
  secondaryColorHex: string;
  pattern: PatternId;
  accessories: AccessoryId[];
  isNightStudio?: boolean;
  onSelectGender?: (gender: GenderMode) => void;
}

export const MannequinViewer: React.FC<MannequinViewerProps> = ({
  outfit,
  gender,
  colorHex,
  secondaryColorHex,
  pattern,
  accessories,
  isNightStudio = false,
  onSelectGender,
}) => {
  const hasAccessory = (acc: AccessoryId) => accessories.includes(acc);

  // Avoid multiple overlapping hats: prioritize nonla, then man
  const activeHeadwear: 'nonla' | 'man' | null = hasAccessory('nonla')
    ? 'nonla'
    : hasAccessory('man')
    ? 'man'
    : null;

  const isMale = gender === 'male';

  return (
    <div
      className={`relative w-full h-[540px] sm:h-[600px] flex items-center justify-center rounded-2xl overflow-hidden transition-colors duration-500 border border-stone-200/80 shadow-inner ${
        isNightStudio
          ? 'bg-gradient-to-b from-[#181a20] via-[#20222a] to-[#121318]'
          : 'bg-gradient-to-b from-[#FAF6F0] via-[#F3ECE0] to-[#EAE1D1]'
      }`}
    >
      {/* UI Tags duy nhất: Nữ Giới / Nam Giới ở góc trên bên trái khung Canvas */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-sm">
        <button
          type="button"
          onClick={() => onSelectGender?.('female')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            !isMale
              ? 'bg-[#8B1E1E] text-white shadow-xs font-bold border border-[#E5A93C]/40'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Nữ Giới
        </button>
        <button
          type="button"
          onClick={() => onSelectGender?.('male')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 ${
            isMale
              ? 'bg-[#8B1E1E] text-white shadow-xs font-bold border border-[#E5A93C]/40'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Nam Giới
        </button>
      </div>
      {/* Subtle Studio Backdrop Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="studioGlow" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#E4A025" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C82A27" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#studioGlow)" />
          <circle cx="50%" cy="50%" r="160" stroke="#8D1815" strokeWidth="0.5" fill="none" opacity="0.3" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="220" stroke="#8D1815" strokeWidth="0.5" fill="none" opacity="0.2" />
        </svg>
      </div>

      {/* Ground Soft Ambient Shadow */}
      <div className="absolute bottom-4 w-52 h-5 bg-stone-900/12 blur-md rounded-full pointer-events-none" />

      {/* High-Fidelity SVG Canvas for Vietnamese Attire - Scaled and Centered Head-to-Toe */}
      <svg
        viewBox="0 0 340 550"
        className="w-full h-full max-h-full drop-shadow-md select-none p-2 object-contain"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for dynamic realistic lighting & silk drapery */}
          <linearGradient id="fabricShine" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="75%" stopColor="#000000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
          </linearGradient>

          <linearGradient id="silkHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="35%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCE7D2" />
            <stop offset="60%" stopColor="#F7D3B5" />
            <stop offset="100%" stopColor="#EABF9B" />
          </linearGradient>

          <linearGradient id="nonLaGrad" x1="30%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FEF3C7" />
            <stop offset="75%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="nonLaInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.1" />
          </linearGradient>

          {/* Traditional Cultural Patterns */}
          <pattern id="pattern-lotus" width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M14 6 C10 12, 10 16, 14 20 C18 16, 18 12, 14 6 Z M8 12 C10 16, 14 18, 14 20 C10 20, 6 16, 8 12 Z M20 12 C18 16, 14 18, 14 20 C18 20, 22 16, 20 12 Z"
              fill="rgba(255,255,255,0.18)"
            />
          </pattern>

          <pattern id="pattern-clouds" width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M6 16 C6 12 12 10 16 13 C19 10 26 12 26 16 C28 18 27 22 22 22 C18 22 10 22 7 20 C5 19 5 17 6 16 Z"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
          </pattern>

          <pattern id="pattern-tho" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="8" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <path d="M7 12 L17 12 M12 7 L12 17 M9 9 L15 15 M9 15 L15 9" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
          </pattern>

          <pattern id="pattern-waves" width="30" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M0 10 Q7.5 0 15 10 T30 10"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
            />
            <path
              d="M0 16 Q7.5 6 15 16 T30 16"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {/* NỀN MÀU KEM NHẠT VỚI CÁC ĐƯỜNG VÒNG TRÒN MẢNH ĐỒNG TÂM */}
        <g id="concentric-background-circles" opacity="0.38">
          <circle cx="170" cy="270" r="60" fill="none" stroke="#D3C7B5" strokeWidth="0.8" />
          <circle cx="170" cy="270" r="110" fill="none" stroke="#D3C7B5" strokeWidth="0.8" />
          <circle cx="170" cy="270" r="160" fill="none" stroke="#D3C7B5" strokeWidth="0.8" />
          <circle cx="170" cy="270" r="210" fill="none" stroke="#D3C7B5" strokeWidth="0.8" />
          <circle cx="170" cy="270" r="260" fill="none" stroke="#D3C7B5" strokeWidth="0.8" />
        </g>

        {/* 0. TAI NGHE CHỤP TAI QUÀNG HẲN RA PHÍA SAU CỔ (Worn completely behind the neck & collar) */}
        {hasAccessory('headphone') && (
          <g id="headphone-behind-neck">
            {/* Vòm nối đệm màu đen quàng vòng hẳn ra phía sau gáy */}
            <path
              d="M130 122 C134 112 206 112 210 122"
              stroke="#0F172A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M134 122 C142 114 198 114 206 122"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Ốp tai trái - Đặt hai bên dưới tai và ôm nhẹ vai sau */}
            <g transform="rotate(-15 130 124)">
              <rect x="121" y="112" width="18" height="26" rx="8" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
              <rect x="123" y="114" width="14" height="22" rx="6" fill="#1E3A8A" />
              <rect x="126" y="117" width="8" height="16" rx="4" fill="#1D4ED8" />
              <circle cx="130" cy="125" r="2.2" fill="#38BDF8" opacity="0.8" />
              <rect x="127" y="110" width="6" height="4" rx="1.5" fill="#475569" />
            </g>

            {/* Ốp tai phải - Đặt hai bên dưới tai và ôm nhẹ vai sau đối xứng */}
            <g transform="rotate(15 210 124)">
              <rect x="201" y="112" width="18" height="26" rx="8" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
              <rect x="203" y="114" width="14" height="22" rx="6" fill="#1E3A8A" />
              <rect x="206" y="117" width="8" height="16" rx="4" fill="#1D4ED8" />
              <circle cx="210" cy="125" r="2.2" fill="#38BDF8" opacity="0.8" />
              <rect x="207" y="110" width="6" height="4" rx="1.5" fill="#475569" />
            </g>
          </g>
        )}

        {/* 1. SCULPTED ANATOMICAL MANNEQUIN BASE */}
        <g id="body-base">
          {/* Sculpted Neck */}
          {isMale ? (
            /* Wider, sturdier masculine neck */
            <path
              d="M152 112 C152 125 146 138 140 146 L200 146 C194 138 188 125 188 112 Z"
              fill="url(#skinGrad)"
            />
          ) : (
            /* Graceful feminine neck */
            <path
              d="M157 114 C157 126 153 140 148 148 L192 148 C187 140 183 126 183 114 Z"
              fill="url(#skinGrad)"
            />
          )}

          {/* Subtle Neck shadow under jaw */}
          <path
            d="M156 115 Q170 123 184 115 L184 120 Q170 127 156 120 Z"
            fill="#C99470"
            opacity="0.28"
          />

          {/* Clavicle / Collarbone subtle lines */}
          <path d="M150 145 Q162 147 170 150 Q178 147 190 145" stroke="#D79E79" strokeWidth="0.8" fill="none" opacity="0.35" />

          {/* Head & Face Contour */}
          {isMale ? (
            /* Masculine squarer jawline and defined chin */
            <path
              d="M144 76 C144 54 154 50 170 50 C186 50 196 54 196 76 C196 95 188 108 178 113 L162 113 C152 108 144 95 144 76 Z"
              fill="url(#skinGrad)"
            />
          ) : (
            /* Feminine soft oval contour */
            <ellipse cx="170" cy="85" rx="26" ry="33" fill="url(#skinGrad)" />
          )}

          {/* Facial Blush (Female only) */}
          {!isMale && (
            <>
              <ellipse cx="154" cy="94" rx="5" ry="3" fill="#F87171" opacity="0.22" />
              <ellipse cx="186" cy="94" rx="5" ry="3" fill="#F87171" opacity="0.22" />
            </>
          )}

          {/* Eyebrows */}
          {isMale ? (
            /* Straight, bold, masculine eyebrows */
            <g id="brows-male">
              <path d="M149 74 L165 73" stroke="#261A13" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M175 73 L191 74" stroke="#261A13" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          ) : (
            /* Delicate arched feminine eyebrows */
            <g id="brows-female">
              <path d="M153 75 Q159 72 165 75" stroke="#3D291C" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M175 75 Q181 72 187 75" stroke="#3D291C" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Clean Eyes & Pupils */}
          <ellipse cx="159" cy="82" rx="3.2" ry="2.2" fill="#261A13" />
          <ellipse cx="181" cy="82" rx="3.2" ry="2.2" fill="#261A13" />
          <circle cx="160" cy="81.5" r="0.7" fill="#ffffff" />
          <circle cx="182" cy="81.5" r="0.7" fill="#ffffff" />

          {/* Nose Bridge */}
          <path d="M170 80 L169 90 L172 91" stroke="#C98A62" strokeWidth="1.3" fill="none" strokeLinecap="round" />

          {/* Lips */}
          {isMale ? (
            /* Thin natural skin-peach lips (No red lipstick) */
            <g id="lips-male">
              <path d="M164 99 L176 99" stroke="#C27A5B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M166 100.5 Q170 102 174 100.5" stroke="#A86348" strokeWidth="0.9" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* Serene red feminine lips */
            <g id="lips-female">
              <path d="M165 99 Q170 102 175 99" stroke="#C82A27" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M167 101 Q170 103 173 101" stroke="#991B1B" strokeWidth="1" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Symmetrical Ears */}
          <ellipse cx="143" cy="86" rx="4.5" ry="7.5" fill="#F7D3B5" />
          <ellipse cx="197" cy="86" rx="4.5" ry="7.5" fill="#F7D3B5" />

          {/* Pearl Earrings (Female only, if chuoingoc is active) */}
          {!isMale && hasAccessory('chuoingoc') && (
            <>
              <circle cx="143" cy="94" r="2.8" fill="#FFFDF8" stroke="#D1D5DB" strokeWidth="0.5" />
              <circle cx="197" cy="94" r="2.8" fill="#FFFDF8" stroke="#D1D5DB" strokeWidth="0.5" />
            </>
          )}

          {/* Hair */}
          {!isMale ? (
            <g id="hair-female">
              {/* Back Hair Bun */}
              {activeHeadwear !== 'nonla' && (
                <circle cx="170" cy="50" r="16" fill="#1C1815" />
              )}
              {/* Forehead Hair Parting */}
              <path
                d="M144 80 C144 58 153 52 170 54 C187 52 196 58 196 80 C186 66 177 64 170 65 C163 64 154 66 144 80 Z"
                fill="#1C1815"
              />
              <path d="M144 78 Q142 92 145 98" stroke="#1C1815" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M196 78 Q198 92 195 98" stroke="#1C1815" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            <g id="hair-male">
              {/* Modern Neat Short Haircut for Men (Side-part / Undercut - Tuyệt đối không có búi tóc) */}
              <path
                d="M144 76 C143 54 153 43 170 43 C187 43 197 54 196 76 C194 72 192 68 189 66 C183 62 175 62 170 63 C165 62 157 62 151 66 C148 68 146 72 144 76 Z"
                fill="#18181B"
              />
              {/* Top styled hair volume */}
              <path
                d="M146 64 C149 50 159 43 170 43 C182 43 194 48 196 62 C190 56 182 53 172 54 C162 55 153 58 146 64 Z"
                fill="#27272A"
              />
              {/* Subtle side-part line */}
              <path d="M162 45 C163 51 161 58 159 64" stroke="#3F3F46" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              {/* Clean sideburns */}
              <path d="M144 76 L144 87 L147 85 L146 76 Z" fill="#18181B" />
              <path d="M196 76 L196 87 L193 85 L194 76 Z" fill="#18181B" />
            </g>
          )}

          {/* Legs & Silk Trousers */}
          <g id="trousers-pants">
            {isMale ? (
              /* Quần dài màu tối ống đứng nam giới */
              <path
                d="M142 320 L132 490 L166 490 L168 340 L172 340 L174 490 L208 490 L198 320 Z"
                fill="#1E293B"
              />
            ) : (
              <path
                d="M144 315 L135 480 L165 480 L168 335 L172 335 L175 480 L205 480 L196 315 Z"
                fill={outfit === 'baba' ? '#1F2937' : outfit === 'tuthan' ? '#18181B' : secondaryColorHex}
              />
            )}
            {/* Center crease shadow & soft highlight */}
            <path d="M149 340 L149 480" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
            <path d="M191 340 L191 480" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
          </g>

          {/* Shoes / Flat Shoes or Sneakers */}
          {!hasAccessory('sneaker') ? (
            <g id="shoes-flat-traditional">
              {isMale ? (
                /* Giày dẹt nam giới tối giản màu tối */
                <>
                  <ellipse cx="149" cy="495" rx="14" ry="5.5" fill="#0F172A" />
                  <ellipse cx="191" cy="495" rx="14" ry="5.5" fill="#0F172A" />
                  <ellipse cx="149" cy="493.5" rx="12" ry="3.5" fill="#1E293B" />
                  <ellipse cx="191" cy="493.5" rx="12" ry="3.5" fill="#1E293B" />
                </>
              ) : (
                <>
                  <ellipse cx="148" cy="485" rx="13" ry="5.5" fill="#4B3322" />
                  <ellipse cx="192" cy="485" rx="13" ry="5.5" fill="#4B3322" />
                  <path d="M137 483 Q148 479 159 483" stroke="#8D1815" strokeWidth="2.2" fill="none" />
                  <path d="M181 483 Q192 479 203 483" stroke="#8D1815" strokeWidth="2.2" fill="none" />
                </>
              )}
            </g>
          ) : (
            <g id="shoes-sneaker">
              <path
                d="M133 484 L143 477 L156 477 L163 483 L164 495 L131 495 Z"
                fill="#F3F4F6"
                stroke="#D1D5DB"
                strokeWidth="1.2"
              />
              <path d="M131 493 L164 493" stroke="#EF4444" strokeWidth="2.5" />
              <circle cx="148" cy="483" r="1.8" fill="#9CA3AF" />

              <path
                d="M176 483 L183 477 L196 477 L206 484 L208 495 L175 495 Z"
                fill="#F3F4F6"
                stroke="#D1D5DB"
                strokeWidth="1.2"
              />
              <path d="M175 493 L208 493" stroke="#EF4444" strokeWidth="2.5" />
              <circle cx="191" cy="483" r="1.8" fill="#9CA3AF" />
            </g>
          )}
        </g>

        {/* 2. OUTFIT LAYERS WITH HISTORICALLY ACCURATE, UNDISTORTED COLLARS */}
        <g id="outfit-garment">
          {/* A. ÁO DÀI */}
          {outfit === 'aodai' && (
            <g id="garment-aodai">
              {/* Natural Sleeves */}
              <path
                d="M130 144 C116 170 96 200 80 230 L102 240 C114 210 128 185 138 180 Z"
                fill={colorHex}
              />
              <path
                d="M210 144 C224 170 244 200 260 230 L238 240 C226 210 212 185 202 180 Z"
                fill={colorHex}
              />
              {/* Circular Peach-Pink Hands */}
              <circle cx="90" cy="235" r="9.5" fill="#FBD8B8" />
              <circle cx="250" cy="235" r="9.5" fill="#FBD8B8" />

              {/* Main Body & Front Panel */}
              <path
                d="M134 142 C142 138 158 136 170 136 C182 136 198 138 206 142 C212 156 214 186 210 230 C206 252 200 270 200 286 L226 448 L114 448 L140 286 C140 270 134 252 130 230 C126 186 128 156 134 142 Z"
                fill={colorHex}
              />
              <path d="M140 286 L114 448" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
              <path d="M200 286 L226 448" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />

              {pattern !== 'plain' && (
                <path
                  d="M134 142 C142 138 158 136 170 136 C182 136 198 138 206 142 C212 156 214 186 210 230 C206 252 200 270 200 286 L226 448 L114 448 L140 286 C140 270 134 252 130 230 Z"
                  fill={`url(#pattern-${pattern})`}
                />
              )}

              <path
                d="M134 142 C142 138 158 136 170 136 C182 136 198 138 206 142 C212 156 214 186 210 230 C206 252 200 270 200 286 L226 448 L114 448 L140 286 C140 270 134 252 130 230 Z"
                fill="url(#fabricShine)"
              />

              {/* Standing Collar */}
              <path
                d="M155 125 C162 122 178 122 185 125 C187 131 187 138 185 142 C178 145 162 145 155 142 C153 138 153 131 155 125 Z"
                fill={colorHex}
                stroke="#5B1210"
                strokeWidth="1.2"
              />
              <path d="M156 126 C163 124 177 124 184 126" stroke="#FAF7F2" strokeWidth="1.8" fill="none" />

              <path
                d="M170 142 C182 144 195 152 202 165 C206 176 208 195 208 220"
                stroke="#FFDF9B"
                strokeWidth="1.8"
                strokeDasharray="2 3"
                fill="none"
              />
            </g>
          )}

          {/* B. ÁO NGŨ THÂN (LẬP LĨNH CHUẨN MỰC) */}
          {outfit === 'nguthan' && (
            <g id="garment-nguthan">
              {isMale ? (
                /* FORM ÁO NGŨ THÂN NAM GIỚI: VAI RỘNG VUÔNG VẮN, HÀNG CÚC DỌC Ở GIỮA, 2 TÚI ỐP HAI BÊN */
                <g id="nguthan-male-form">
                  {/* Broad Straight Masculine Sleeves */}
                  <path
                    d="M116 142 L60 220 L86 238 L128 186 Z"
                    fill={colorHex}
                  />
                  <path
                    d="M224 142 L280 220 L254 238 L212 186 Z"
                    fill={colorHex}
                  />
                  {/* Circular Peach-Pink Hands */}
                  <circle cx="73" cy="229" r="9.5" fill="#FBD8B8" />
                  <circle cx="267" cy="229" r="9.5" fill="#FBD8B8" />

                  {/* Straight Broad Masculine Body Form (Thẳng đứng, không thắt eo) */}
                  <path
                    d="M118 142 C134 138 152 136 170 136 C188 136 206 138 222 142 L232 220 L236 385 L104 385 L108 220 Z"
                    fill={colorHex}
                  />

                  {/* Pattern Overlay */}
                  {pattern !== 'plain' && (
                    <path
                      d="M118 142 C134 138 152 136 170 136 C188 136 206 138 222 142 L232 220 L236 385 L104 385 L108 220 Z"
                      fill={`url(#pattern-${pattern})`}
                    />
                  )}

                  {/* Fabric Shine */}
                  <path
                    d="M118 142 C134 138 152 136 170 136 C188 136 206 138 222 142 L232 220 L236 385 L104 385 L108 220 Z"
                    fill="url(#fabricShine)"
                  />

                  {/* High Standing Collar (Cổ Đứng Lập Lĩnh Nam Tính Kín Đáo) */}
                  <g id="lap-linh-collar-male">
                    <path
                      d="M152 122 C161 118 179 118 188 122 C190 128 190 136 188 141 C179 144 161 144 152 141 C150 136 150 128 152 122 Z"
                      fill={colorHex}
                      stroke="#5B1210"
                      strokeWidth="1.3"
                    />
                    {/* White Inner Collar Lining */}
                    <path
                      d="M154 123 C162 120 178 120 186 123"
                      stroke="#FAF7F2"
                      strokeWidth="2.2"
                      fill="none"
                    />
                  </g>

                  {/* Center Vertical Seam */}
                  <line x1="170" y1="141" x2="170" y2="385" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />

                  {/* Center Vertical Button Line (Hàng Cúc Dọc Thẳng Hàng Ở Giữa) */}
                  <g id="vertical-buttons">
                    {[152, 190, 230, 270, 310, 350].map((cy) => (
                      <g key={cy}>
                        <circle cx="170" cy={cy} r="3.2" fill="#F8FAFC" stroke="#334155" strokeWidth="0.8" />
                        <circle cx="170" cy={cy} r="1" fill="#64748B" />
                      </g>
                    ))}
                  </g>

                  {/* Two Patch Pockets on Sides (Túi Ốp Hai Bên) */}
                  <g id="patch-pockets">
                    {/* Left Pocket */}
                    <rect x="120" y="325" width="36" height="42" rx="4" fill={colorHex} stroke="rgba(0,0,0,0.22)" strokeWidth="1.2" />
                    <line x1="120" y1="334" x2="156" y2="334" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
                    
                    {/* Right Pocket */}
                    <rect x="184" y="325" width="36" height="42" rx="4" fill={colorHex} stroke="rgba(0,0,0,0.22)" strokeWidth="1.2" />
                    <line x1="184" y1="334" x2="220" y2="334" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
                  </g>
                </g>
              ) : (
                /* FORM ÁO NGŨ THÂN NỮ GIỚI: VẠT CON LỆCH, CÚC NGŨ THƯỜNG */
                <g id="nguthan-female-form">
                  <path
                    d="M128 142 L70 220 L94 236 L136 186 Z"
                    fill={colorHex}
                  />
                  <path
                    d="M212 142 L270 220 L246 236 L204 186 Z"
                    fill={colorHex}
                  />
                  <circle cx="82" cy="228" r="9.5" fill="#FBD8B8" />
                  <circle cx="258" cy="228" r="9.5" fill="#FBD8B8" />

                  <path
                    d="M130 142 C142 136 160 134 170 134 C180 134 198 136 210 142 L224 220 L234 425 L106 425 L116 220 Z"
                    fill={colorHex}
                  />
                  <path d="M170 140 L195 240 L198 425" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" fill="none" />

                  {pattern !== 'plain' && (
                    <path
                      d="M130 142 C142 136 160 134 170 134 C180 134 198 136 210 142 L224 220 L234 425 L106 425 L116 220 Z"
                      fill={`url(#pattern-${pattern})`}
                    />
                  )}

                  <path
                    d="M130 142 C142 136 160 134 170 134 C180 134 198 136 210 142 L224 220 L234 425 L106 425 L116 220 Z"
                    fill="url(#fabricShine)"
                  />

                  <g id="lap-linh-collar">
                    <path
                      d="M154 122 C162 119 178 119 186 122 C188 128 188 136 186 140 C178 143 162 143 154 140 C152 136 152 128 154 122 Z"
                      fill={colorHex}
                      stroke="#5B1210"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M156 123 C163 121 177 121 184 123"
                      stroke="#FAF7F2"
                      strokeWidth="2"
                      fill="none"
                    />
                  </g>

                  <path
                    d="M170 140 C182 142 196 150 202 166 C206 182 208 208 208 238"
                    stroke="#FFDD94"
                    strokeWidth="1.8"
                    fill="none"
                  />

                  <g id="ngu-thuong-buttons">
                    <circle cx="170" cy="130" r="3" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                    <circle cx="182" cy="145" r="3" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                    <circle cx="198" cy="164" r="3" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                    <circle cx="204" cy="192" r="3" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                    <circle cx="206" cy="226" r="3" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                  </g>
                </g>
              )}
            </g>
          )}

          {/* C. ÁO NHẬT BÌNH (CUNG ĐÌNH TRIỀU NGUYỄN) */}
          {outfit === 'nhatbinh' && (
            <g id="garment-nhatbinh">
              {/* Grand Wide Royal Sleeves */}
              <path
                d="M130 144 L50 200 L44 330 L110 320 L134 200 Z"
                fill={colorHex}
              />
              <path
                d="M210 144 L290 200 L296 330 L230 320 L206 200 Z"
                fill={colorHex}
              />
              {/* Sleeve Ngũ Sắc Bands */}
              <path d="M44 316 L110 306 L110 320 L44 330 Z" fill="#E4A025" />
              <path d="M46 304 L108 294 L108 306 L44 316 Z" fill="#1F4F89" />
              <path d="M48 292 L106 282 L106 294 L46 304 Z" fill="#C82A27" />

              <path d="M230 320 L296 330 L296 316 L230 306 Z" fill="#E4A025" />
              <path d="M232 306 L294 316 L294 304 L232 294 Z" fill="#1F4F89" />
              <path d="M234 294 L292 304 L292 292 L234 282 Z" fill="#C82A27" />

              <circle cx="78" cy="315" r="8" fill="#FBD8B8" />
              <circle cx="262" cy="315" r="8" fill="#FBD8B8" />

              {/* Main Robe Body */}
              <path
                d="M132 142 C144 136 160 134 170 134 C180 134 196 136 208 142 L226 220 L236 435 L104 435 L114 220 Z"
                fill={colorHex}
              />

              {pattern !== 'plain' && (
                <path
                  d="M132 142 C144 136 160 134 170 134 C180 134 196 136 208 142 L226 220 L236 435 L104 435 L114 220 Z"
                  fill={`url(#pattern-${pattern})`}
                />
              )}

              <path
                d="M132 142 C144 136 160 134 170 134 C180 134 196 136 208 142 L226 220 L236 435 L104 435 L114 220 Z"
                fill="url(#fabricShine)"
              />

              {/* Rectangular Collar */}
              <g id="nhat-binh-collar">
                <path
                  d="M148 126 C155 124 185 124 192 126 L192 240 L180 240 L180 144 C175 142 165 142 160 144 L160 240 L148 240 Z"
                  fill="url(#goldRibbon)"
                  stroke="#92400E"
                  strokeWidth="1.2"
                />
                <path d="M152 130 L188 130 L188 238 L182 238 L182 140 L158 140 L158 238 L152 238 Z" fill="#C82A27" />
                <path d="M155 134 L185 134 L185 236 L183 236 L183 138 L157 138 L157 236 L155 236 Z" fill="#1F4F89" />

                <circle cx="170" cy="180" r="4.2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.4" />
                <circle cx="170" cy="220" r="3.8" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" />

                <path d="M162 240 L159 380 L166 380 L167 240 Z" fill="#E4A025" stroke="#B45309" strokeWidth="0.8" />
                <path d="M173 240 L174 380 L181 380 L178 240 Z" fill="#E4A025" stroke="#B45309" strokeWidth="0.8" />
              </g>
            </g>
          )}

          {/* D. ÁO TỨ THÂN */}
          {outfit === 'tuthan' && (
            <g id="garment-tuthan">
              <path d="M130 144 L76 224 L98 238 L138 184 Z" fill={colorHex} />
              <path d="M210 144 L264 224 L242 238 L202 184 Z" fill={colorHex} />
              <circle cx="87" cy="231" r="9" fill="#FBD8B8" />
              <circle cx="253" cy="231" r="9" fill="#FBD8B8" />

              <path
                d="M152 138 C158 135 182 135 188 138 L196 230 L144 230 Z"
                fill={secondaryColorHex || '#C82A27'}
              />
              <path d="M154 136 Q170 133 186 136" stroke="#FDE047" strokeWidth="1.8" fill="none" />

              <path
                d="M138 240 L202 240 L220 460 L120 460 Z"
                fill="#18181B"
              />

              <path
                d="M130 142 L150 142 L146 244 L114 430 L102 360 L120 220 Z"
                fill={colorHex}
              />
              <path
                d="M210 142 L190 142 L194 244 L226 430 L238 360 L220 220 Z"
                fill={colorHex}
              />

              <path
                d="M150 240 C160 256 166 270 162 330 L154 330 C156 280 152 260 146 244 Z"
                fill={colorHex}
              />
              <path
                d="M190 240 C180 256 174 270 178 330 L186 330 C184 280 188 260 194 244 Z"
                fill={colorHex}
              />

              <rect x="140" y="234" width="60" height="14" rx="3" fill="#E4A025" />
              <path d="M166 248 L160 310 L168 310 L172 248 Z" fill="#F59E0B" />
              <path d="M174 248 L178 320 L186 320 L180 248 Z" fill="#EF4444" />
            </g>
          )}

          {/* E. ÁO BÀ BA */}
          {outfit === 'baba' && (
            <g id="garment-baba">
              <path d="M130 144 L78 226 L98 238 L138 180 Z" fill={colorHex} />
              <path d="M210 144 L262 226 L242 238 L202 180 Z" fill={colorHex} />
              <circle cx="88" cy="232" r="9" fill="#FBD8B8" />
              <circle cx="252" cy="232" r="9" fill="#FBD8B8" />

              <path
                d="M134 140 C142 136 160 134 170 134 C180 134 198 136 206 140 C212 154 214 186 210 230 L216 315 L190 315 L170 312 L150 315 L124 315 L130 230 C126 186 128 154 134 140 Z"
                fill={colorHex}
              />

              <path
                d="M154 126 C160 140 180 140 186 126 C180 132 160 132 154 126 Z"
                fill="url(#skinGrad)"
              />
              <path
                d="M152 127 C160 141 180 141 188 127"
                stroke={colorHex}
                strokeWidth="2.8"
                fill="none"
              />

              <line x1="170" y1="138" x2="170" y2="312" stroke="rgba(0,0,0,0.18)" strokeWidth="1.8" />
              <circle cx="170" cy="154" r="2.4" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="184" r="2.4" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="214" r="2.4" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="244" r="2.4" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="274" r="2.4" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />

              <rect x="140" y="260" width="22" height="26" rx="2" fill={colorHex} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
              <rect x="178" y="260" width="22" height="26" rx="2" fill={colorHex} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
            </g>
          )}

          {/* F. ÁO GIAO LĨNH */}
          {outfit === 'giaolinh' && (
            <g id="garment-giaolinh">
              <path d="M130 144 L60 215 L78 300 L130 220 Z" fill={colorHex} />
              <path d="M210 144 L280 215 L262 300 L210 220 Z" fill={colorHex} />
              <circle cx="70" cy="245" r="9" fill="#FBD8B8" />
              <circle cx="270" cy="245" r="9" fill="#FBD8B8" />

              <path
                d="M132 142 L208 142 L224 220 L234 445 L106 445 L116 220 Z"
                fill={colorHex}
              />

              <path
                d="M150 134 L170 190 L204 142"
                stroke={secondaryColorHex || '#FDE68A'}
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M138 136 L170 195 L212 250"
                stroke="#EDE7DC"
                strokeWidth="2.5"
                fill="none"
              />

              <rect x="136" y="240" width="68" height="22" rx="2" fill={secondaryColorHex || '#1F4F89'} />
              <rect x="160" y="244" width="20" height="14" rx="2" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
              <path d="M164 262 L160 380 L168 380 L170 262 Z" fill={secondaryColorHex || '#1F4F89'} />
            </g>
          )}
        </g>

        {/* 3. ACCESSORIES OVERLAY LAYER */}
        <g id="accessories-overlay">
          {/* Pearl Necklace (Chuỗi ngọc) - NỮ GIỚI MỚI ĐEO, NAM GIỚI BỎ HOÀN TOÀN ĐỂ TÔN DÁNG MẠNH MẼ */}
          {!isMale && hasAccessory('chuoingoc') && (
            <g id="acc-pearls">
              <path
                d="M152 146 Q170 178 188 146"
                stroke="#FFFDF6"
                strokeWidth="3.5"
                strokeDasharray="2 5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="170" cy="168" r="5.5" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
              <circle cx="170" cy="168" r="2.8" fill="#10B981" />
            </g>
          )}

          {/* Khăn Rằn Nam Bộ */}
          {hasAccessory('khanran') && (
            <g id="acc-khanran">
              <path
                d="M150 130 C156 142 160 148 160 160 L158 310 L146 310 L146 150 C146 140 148 134 150 130 Z"
                fill="#27272A"
                stroke="#F4F4F5"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <path
                d="M190 130 C184 142 180 148 180 160 L182 300 L194 300 L194 150 C194 140 192 134 190 130 Z"
                fill="#27272A"
                stroke="#F4F4F5"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <path
                d="M150 130 Q170 146 190 130"
                stroke="#27272A"
                strokeWidth="7"
                fill="none"
              />
              <path d="M146 310 L146 318 M150 310 L150 318 M154 310 L154 318 M158 310 L158 318" stroke="#E4E4E7" strokeWidth="1.5" />
              <path d="M182 300 L182 308 M186 300 L186 308 M190 300 L190 308 M194 300 L194 308" stroke="#E4E4E7" strokeWidth="1.5" />
            </g>
          )}

          {/* Kính Râm Y2K */}
          {hasAccessory('kinhram') && (
            <g id="acc-sunglasses">
              <path
                d="M148 78 L166 77 L164 88 L148 86 Z"
                fill="#09090B"
                stroke="#E4E4E7"
                strokeWidth="1"
              />
              <path
                d="M174 77 L192 78 L192 86 L176 88 Z"
                fill="#09090B"
                stroke="#E4E4E7"
                strokeWidth="1"
              />
              <line x1="166" y1="78" x2="174" y2="78" stroke="#E4E4E7" strokeWidth="1.5" />
              <line x1="150" y1="80" x2="160" y2="83" stroke="#06B6D4" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="176" y1="80" x2="186" y2="83" stroke="#06B6D4" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}

          {/* Quạt Lụa Cầm Tay */}
          {hasAccessory('quat') && (
            <g id="acc-fan">
              <path
                d="M236 210 Q256 170 286 186 Q266 226 236 210 Z"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="1.2"
              />
              <line x1="236" y1="210" x2="286" y2="186" stroke="#B45309" strokeWidth="0.8" />
              <line x1="236" y1="210" x2="274" y2="176" stroke="#B45309" strokeWidth="0.8" />
              <line x1="236" y1="210" x2="256" y2="172" stroke="#B45309" strokeWidth="0.8" />
              <path d="M236 210 Q230 225 232 245" stroke="#DC2626" strokeWidth="2" fill="none" />
              <circle cx="232" cy="245" r="2.5" fill="#EF4444" />
            </g>
          )}

          {/* Túi Cói Nam Bộ */}
          {hasAccessory('tuicoi') && (
            <g id="acc-tuicoi">
              <path d="M128 148 Q100 210 95 280" stroke="#B45309" strokeWidth="2.2" fill="none" />
              <path
                d="M84 275 L116 275 L112 325 L88 325 Z"
                fill="#D97706"
                stroke="#92400E"
                strokeWidth="1.4"
              />
              <path d="M86 285 L114 285 M87 295 L113 295 M88 305 L112 305 M88 315 L112 315" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 3" />
            </g>
          )}

          {/* 4. HEADWEAR */}
          {activeHeadwear === 'man' && (
            <g id="acc-man">
              <ellipse cx="170" cy="58" rx="27" ry="14" fill={colorHex} stroke="#5B1210" strokeWidth="1.2" />
              <ellipse cx="170" cy="55" rx="24" ry="12" fill={colorHex} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              <ellipse cx="170" cy="52" rx="21" ry="10" fill={colorHex} stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
              {isMale && (
                <path d="M166 65 L170 60 L174 65" stroke="#FFDD94" strokeWidth="1.8" fill="none" />
              )}
            </g>
          )}

          {activeHeadwear === 'nonla' && (
            <g id="acc-nonla">
              <ellipse cx="170" cy="62" rx="64" ry="12" fill="url(#nonLaInner)" />
              <path
                d="M106 60 C125 57 150 56 170 14 C190 56 215 57 234 60 C215 72 125 72 106 60 Z"
                fill="url(#nonLaGrad)"
                stroke="#B45309"
                strokeWidth="1.2"
              />
              <path d="M116 57 Q170 67 224 57" stroke="#B45309" strokeWidth="0.7" fill="none" opacity="0.6" />
              <path d="M128 50 Q170 59 212 50" stroke="#B45309" strokeWidth="0.7" fill="none" opacity="0.6" />
              <path d="M140 42 Q170 49 200 42" stroke="#B45309" strokeWidth="0.7" fill="none" opacity="0.6" />
              <path d="M152 32 Q170 38 188 32" stroke="#B45309" strokeWidth="0.7" fill="none" opacity="0.6" />
              <path d="M162 22 Q170 26 178 22" stroke="#B45309" strokeWidth="0.7" fill="none" opacity="0.6" />

              <path
                d="M106 60 Q170 71 234 60"
                stroke="#D97706"
                strokeWidth="1.6"
                fill="none"
              />

              <g id="non-la-strap">
                <path
                  d="M136 63 C138 82 148 108 170 114"
                  stroke="#F43F5E"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M204 63 C202 82 192 108 170 114"
                  stroke="#F43F5E"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="170" cy="115" rx="3" ry="2" fill="#E11D48" />
                <path
                  d="M168 116 C166 130 163 146 161 160"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M172 116 C174 130 177 146 179 160"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
