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
}

export const MannequinViewer: React.FC<MannequinViewerProps> = ({
  outfit,
  gender,
  colorHex,
  secondaryColorHex,
  pattern,
  accessories,
  isNightStudio = false,
}) => {
  const hasAccessory = (acc: AccessoryId) => accessories.includes(acc);

  return (
    <div
      className={`relative w-full h-[480px] sm:h-[540px] flex items-center justify-center rounded-2xl overflow-hidden transition-colors duration-500 border border-stone-200/80 shadow-inner ${
        isNightStudio
          ? 'bg-gradient-to-b from-[#181a20] via-[#20222a] to-[#121318]'
          : 'bg-gradient-to-b from-[#FAF6F0] via-[#F3ECE0] to-[#EAE1D1]'
      }`}
    >
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
          {/* Subtle concentric circles like Dong Son drum echo */}
          <circle cx="50%" cy="50%" r="160" stroke="#8D1815" strokeWidth="0.5" fill="none" opacity="0.3" strokeDasharray="4 4" />
          <circle cx="50%" cy="50%" r="220" stroke="#8D1815" strokeWidth="0.5" fill="none" opacity="0.2" />
        </svg>
      </div>

      {/* Ground Shadow */}
      <div className="absolute bottom-6 w-52 h-6 bg-black/15 blur-md rounded-full pointer-events-none" />

      {/* SVG Canvas for Vietnamese Attire */}
      <svg
        viewBox="0 0 340 540"
        className="w-full h-full max-w-[340px] max-h-[540px] drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients for dynamic lighting */}
          <linearGradient id="fabricShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Pattern Definitions */}
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

        {/* 1. MANNEQUIN BASE (Skin, Head, Hair, Neck) */}
        <g id="body-base">
          {/* Neck */}
          <rect x="156" y="112" width="28" height="36" rx="6" fill="#F8D3B2" />
          <path d="M156 128 L184 128 L184 140 L156 140 Z" fill="#E8BD9A" opacity="0.3" />

          {/* Head & Face */}
          <ellipse cx="170" cy="85" rx="27" ry="33" fill="#FBD8B8" />

          {/* Cheeks / Blush */}
          <ellipse cx="153" cy="94" rx="6" ry="3.5" fill="#F87171" opacity="0.25" />
          <ellipse cx="187" cy="94" rx="6" ry="3.5" fill="#F87171" opacity="0.25" />

          {/* Eyes & Brows */}
          <path d="M152 74 Q159 71 164 74" stroke="#4A3423" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M176 74 Q181 71 188 74" stroke="#4A3423" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="158" cy="82" rx="3.5" ry="2.2" fill="#2E2319" />
          <ellipse cx="182" cy="82" rx="3.5" ry="2.2" fill="#2E2319" />

          {/* Nose & Lips */}
          <path d="M170 82 L169 91 L172 92" stroke="#D79E79" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M165 99 Q170 102 175 99" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Ears */}
          <ellipse cx="142" cy="86" rx="5" ry="8" fill="#FBD8B8" />
          <ellipse cx="198" cy="86" rx="5" ry="8" fill="#FBD8B8" />

          {/* Pearl Earrings (if traditional pearl accessory) */}
          {hasAccessory('chuoingoc') && (
            <>
              <circle cx="142" cy="94" r="3" fill="#FFFDF8" stroke="#D1D5DB" strokeWidth="0.5" />
              <circle cx="198" cy="94" r="3" fill="#FFFDF8" stroke="#D1D5DB" strokeWidth="0.5" />
            </>
          )}

          {/* Hair */}
          {gender === 'female' ? (
            <g id="hair-female">
              {/* Back Hair Bun */}
              <circle cx="170" cy="50" r="17" fill="#1C1815" />
              {/* Forehead Hair Parting */}
              <path
                d="M142 80 C142 58 152 52 170 54 C188 52 198 58 198 80 C188 66 177 64 170 66 C163 64 152 66 142 80 Z"
                fill="#1C1815"
              />
              {/* Side wisps */}
              <path d="M143 78 Q140 92 144 100" stroke="#1C1815" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M197 78 Q200 92 196 100" stroke="#1C1815" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            <g id="hair-male">
              {/* Topknot / Búi tó nam xưa */}
              <circle cx="170" cy="54" r="14" fill="#1C1815" />
              <path
                d="M143 80 C143 62 154 56 170 56 C186 56 197 62 197 80 C188 70 178 68 170 68 C162 68 152 70 143 80 Z"
                fill="#1C1815"
              />
            </g>
          )}

          {/* Legs & Silk Trousers under outfit */}
          <g id="trousers-pants">
            <path
              d="M144 320 L135 480 L164 480 L168 340 L172 340 L176 480 L205 480 L196 320 Z"
              fill={outfit === 'baba' ? '#1F2937' : outfit === 'tuthan' ? '#18181B' : secondaryColorHex}
            />
            {/* Trouser center crease shadow */}
            <path d="M149 350 L149 475" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
            <path d="M191 350 L191 475" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
          </g>

          {/* Shoes / Feet Base */}
          {!hasAccessory('sneaker') ? (
            <g id="shoes-traditional">
              {/* Traditional cloth slippers or wooden clogs (guốc mộc) */}
              <ellipse cx="148" cy="486" rx="14" ry="6" fill="#4B3322" />
              <ellipse cx="192" cy="486" rx="14" ry="6" fill="#4B3322" />
              <path d="M136 484 Q148 480 160 484" stroke="#8D1815" strokeWidth="2.5" fill="none" />
              <path d="M180 484 Q192 480 204 484" stroke="#8D1815" strokeWidth="2.5" fill="none" />
            </g>
          ) : (
            <g id="shoes-sneaker">
              {/* Gen Z Chunky Sneaker */}
              <path
                d="M132 478 L142 470 L156 470 L163 477 L165 490 L130 490 Z"
                fill="#F3F4F6"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
              <path d="M130 488 L165 488" stroke="#EF4444" strokeWidth="3" />
              <circle cx="148" cy="477" r="2" fill="#9CA3AF" />
              <path d="M142 474 L154 478" stroke="#111827" strokeWidth="1.2" />

              <path
                d="M175 477 L182 470 L196 470 L206 478 L208 490 L173 490 Z"
                fill="#F3F4F6"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
              <path d="M173 488 L208 488" stroke="#EF4444" strokeWidth="3" />
              <circle cx="190" cy="477" r="2" fill="#9CA3AF" />
              <path d="M184 474 L196 478" stroke="#111827" strokeWidth="1.2" />
            </g>
          )}
        </g>

        {/* 2. OUTFIT LAYERS ACCORDING TO SPECIFIC VIETNAMESE TRADITIONAL ATTIRE */}
        <g id="outfit-garment">
          {/* A. ÁO DÀI */}
          {outfit === 'aodai' && (
            <g id="garment-aodai">
              {/* Sleeves */}
              <path
                d="M130 144 L80 230 L102 240 L138 180 Z"
                fill={colorHex}
              />
              <path
                d="M210 144 L260 230 L238 240 L202 180 Z"
                fill={colorHex}
              />
              {/* Hands */}
              <circle cx="90" cy="235" r="9" fill="#FBD8B8" />
              <circle cx="250" cy="235" r="9" fill="#FBD8B8" />

              {/* Main Body & Front Panel */}
              <path
                d="M134 140 C140 136 160 134 170 134 C180 134 200 136 206 140 C212 154 214 186 210 230 C206 250 200 270 200 286 L226 448 L114 448 L140 286 C140 270 134 250 130 230 C126 186 128 154 134 140 Z"
                fill={colorHex}
              />
              {/* Side slit indication */}
              <path d="M140 286 L114 448" stroke="#8D1815" strokeWidth="1.5" opacity="0.3" />
              <path d="M200 286 L226 448" stroke="#8D1815" strokeWidth="1.5" opacity="0.3" />

              {/* Pattern Texture Overlay */}
              {pattern !== 'plain' && (
                <path
                  d="M134 140 C140 136 160 134 170 134 C180 134 200 136 206 140 C212 154 214 186 210 230 C206 250 200 270 200 286 L226 448 L114 448 L140 286 C140 270 134 250 130 230 C126 186 128 154 134 140 Z"
                  fill={`url(#pattern-${pattern})`}
                />
              )}

              {/* Fabric Soft Shading */}
              <path
                d="M134 140 C140 136 160 134 170 134 C180 134 200 136 206 140 C212 154 214 186 210 230 C206 250 200 270 200 286 L226 448 L114 448 L140 286 C140 270 134 250 130 230 C126 186 128 154 134 140 Z"
                fill="url(#fabricShine)"
              />

              {/* Traditional Standing Collar (Cổ đứng Áo Dài) */}
              <path
                d="M156 124 C162 122 178 122 184 124 L186 138 C178 141 162 141 154 138 Z"
                fill={colorHex}
                stroke="#6B1311"
                strokeWidth="1.5"
              />
              {/* Right shoulder clasp seam (Nẹp áo cài chéo bên phải) */}
              <path
                d="M172 138 Q186 142 198 152 Q208 162 210 186"
                stroke="#FFDF9B"
                strokeWidth="2"
                strokeDasharray="2 4"
                fill="none"
              />
            </g>
          )}

          {/* B. ÁO NGŨ THÂN (LẬP LĨNH) */}
          {outfit === 'nguthan' && (
            <g id="garment-nguthan">
              {/* Wide Straight Sleeves (Tay chẽn ngũ thân) */}
              <path
                d="M128 142 L70 220 L94 236 L136 186 Z"
                fill={colorHex}
              />
              <path
                d="M212 142 L270 220 L246 236 L204 186 Z"
                fill={colorHex}
              />
              <circle cx="82" cy="228" r="9" fill="#FBD8B8" />
              <circle cx="258" cy="228" r="9" fill="#FBD8B8" />

              {/* Wide Stately 5-Panel Body (Vạt rộng, đĩnh đạc) */}
              <path
                d="M130 142 C142 136 160 134 170 134 C180 134 198 136 210 142 L224 220 L234 425 L106 425 L116 220 Z"
                fill={colorHex}
              />

              {/* Thân trong / Vạt con lót bên phải (Phần lót lộ nhẹ) */}
              <path d="M170 140 L195 240 L198 425" stroke="rgba(0,0,0,0.25)" strokeWidth="1.8" fill="none" />

              {/* Pattern Overlay */}
              {pattern !== 'plain' && (
                <path
                  d="M130 142 C142 136 160 134 170 134 C180 134 198 136 210 142 L224 220 L234 425 L106 425 L116 220 Z"
                  fill={`url(#pattern-${pattern})`}
                />
              )}

              {/* Fabric Shine */}
              <path
                d="M130 142 C142 136 160 134 170 134 C180 134 198 136 210 142 L224 220 L234 425 L106 425 L116 220 Z"
                fill="url(#fabricShine)"
              />

              {/* Lập Lĩnh (Cổ Đứng Chuẩn Mực 5 Khuy) */}
              <rect
                x="154"
                y="120"
                width="32"
                height="18"
                rx="3"
                fill={colorHex}
                stroke="#5B1210"
                strokeWidth="1.8"
              />
              <rect x="156" y="122" width="28" height="3" fill="#EDE7DC" opacity="0.6" />

              {/* Seam line running down right ribs */}
              <path
                d="M170 138 C182 140 196 148 202 165 C206 182 208 210 208 240"
                stroke="#FFDD94"
                strokeWidth="2.2"
                fill="none"
              />

              {/* The 5 Virtues Buttons (5 Hạt Cúc Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín) */}
              <g id="ngu-thuong-buttons">
                {/* 1. Cúc cổ áo */}
                <circle cx="170" cy="129" r="3.2" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                {/* 2. Cúc xương đòn */}
                <circle cx="182" cy="144" r="3.2" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                {/* 3. Cúc nách phải */}
                <circle cx="198" cy="162" r="3.2" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                {/* 4. Cúc sườn ngực */}
                <circle cx="204" cy="190" r="3.2" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
                {/* 5. Cúc ngang hông */}
                <circle cx="206" cy="224" r="3.2" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
              </g>
            </g>
          )}

          {/* C. ÁO NHẬT BÌNH */}
          {outfit === 'nhatbinh' && (
            <g id="garment-nhatbinh">
              {/* Grand Wide Flowing Royal Sleeves (Tay thụng) */}
              <path
                d="M130 144 L50 200 L44 330 L110 320 L134 200 Z"
                fill={colorHex}
              />
              <path
                d="M210 144 L290 200 L296 330 L230 320 L206 200 Z"
                fill={colorHex}
              />
              {/* Multicolored Royal Sleeve Cuffs (Dải ngũ sắc cửa tay) */}
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

              {/* The Iconic Rectangular Embroidered Collar (Cổ áo Nhật Bình) */}
              <g id="nhat-binh-collar">
                {/* Outer embroidered rectangular ribbon */}
                <path
                  d="M148 126 L192 126 L192 240 L180 240 L180 144 L160 144 L160 240 L148 240 Z"
                  fill="url(#goldRibbon)"
                  stroke="#92400E"
                  strokeWidth="1.5"
                />
                {/* Inner red & blue stripes */}
                <path d="M152 130 L188 130 L188 238 L182 238 L182 140 L158 140 L158 238 L152 238 Z" fill="#C82A27" />
                <path d="M155 134 L185 134 L185 236 L183 236 L183 138 L157 138 L157 236 L155 236 Z" fill="#1F4F89" />

                {/* Golden knot button clasp in the center */}
                <circle cx="170" cy="180" r="4.5" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="170" cy="220" r="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" />

                {/* Two hanging embroidered ribbons (Dải thùy lưu cung đình) */}
                <path d="M162 240 L158 380 L166 380 L168 240 Z" fill="#E4A025" stroke="#B45309" strokeWidth="0.8" />
                <path d="M172 240 L174 380 L182 380 L178 240 Z" fill="#E4A025" stroke="#B45309" strokeWidth="0.8" />
              </g>
            </g>
          )}

          {/* D. ÁO TỨ THÂN */}
          {outfit === 'tuthan' && (
            <g id="garment-tuthan">
              {/* Sleeves */}
              <path d="M130 144 L76 224 L98 238 L138 184 Z" fill={colorHex} />
              <path d="M210 144 L264 224 L242 238 L202 184 Z" fill={colorHex} />
              <circle cx="87" cy="231" r="9" fill="#FBD8B8" />
              <circle cx="253" cy="231" r="9" fill="#FBD8B8" />

              {/* Yếm Đào (Traditional Silk Bodice/Halter under garment) */}
              <path
                d="M152 140 L188 140 L196 230 L144 230 Z"
                fill={secondaryColorHex || '#C82A27'}
              />
              <path d="M154 138 Q170 134 186 138" stroke="#FDE047" strokeWidth="2" fill="none" />

              {/* Váy Đụp Đen (Traditional Northern pleated black skirt) */}
              <path
                d="M138 240 L202 240 L220 460 L120 460 Z"
                fill="#18181B"
              />

              {/* 4 Panels (Áo Tứ Thân): 2 back panels + 2 front panels knotted at waist */}
              <path
                d="M130 142 L150 142 L146 244 L114 430 L102 360 L120 220 Z"
                fill={colorHex}
              />
              <path
                d="M210 142 L190 142 L194 244 L226 430 L238 360 L220 220 Z"
                fill={colorHex}
              />

              {/* Front knotted ties (Buộc vạt trước bụng lả lơi) */}
              <path
                d="M150 240 C160 256 166 270 162 330 L154 330 C156 280 152 260 146 244 Z"
                fill={colorHex}
              />
              <path
                d="M190 240 C180 256 174 270 178 330 L186 330 C184 280 188 260 194 244 Z"
                fill={colorHex}
              />

              {/* Silk Sash / Bao Tượng (Thắt lưng lụa màu sắc) */}
              <rect x="140" y="234" width="60" height="14" rx="3" fill="#E4A025" />
              <path d="M166 248 L160 310 L168 310 L172 248 Z" fill="#F59E0B" />
              <path d="M174 248 L178 320 L186 320 L180 248 Z" fill="#EF4444" />
            </g>
          )}

          {/* E. ÁO BÀ BA */}
          {outfit === 'baba' && (
            <g id="garment-baba">
              {/* Casual Sleeves */}
              <path d="M130 144 L78 226 L98 238 L138 180 Z" fill={colorHex} />
              <path d="M210 144 L262 226 L242 238 L202 180 Z" fill={colorHex} />
              <circle cx="88" cy="232" r="9" fill="#FBD8B8" />
              <circle cx="252" cy="232" r="9" fill="#FBD8B8" />

              {/* Short Tapered Body with Side Slits at hips */}
              <path
                d="M134 140 C142 136 160 134 170 134 C180 134 198 136 206 140 C212 154 214 186 210 230 L216 315 L190 315 L170 312 L150 315 L124 315 L130 230 C126 186 128 154 134 140 Z"
                fill={colorHex}
              />

              {/* Round / Betel Leaf Collar (Cổ tròn / lá trầu) */}
              <path
                d="M154 126 C160 140 180 140 186 126 C180 132 160 132 154 126 Z"
                fill="#FBD8B8"
              />
              <path
                d="M152 128 C160 142 180 142 188 128"
                stroke={colorHex}
                strokeWidth="3"
                fill="none"
              />

              {/* Front Center Placket with buttons (Nẹp cúc trước) */}
              <line x1="170" y1="138" x2="170" y2="312" stroke="rgba(0,0,0,0.18)" strokeWidth="2" />
              <circle cx="170" cy="154" r="2.5" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="184" r="2.5" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="214" r="2.5" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="244" r="2.5" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />
              <circle cx="170" cy="274" r="2.5" fill="#FAF5E8" stroke="#3D281B" strokeWidth="0.8" />

              {/* Two Characteristic Patch Pockets (2 Túi đắp Nam Bộ) */}
              <rect x="140" y="260" width="22" height="26" rx="2" fill={colorHex} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              <rect x="178" y="260" width="22" height="26" rx="2" fill={colorHex} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              {/* Pocket trim */}
              <line x1="140" y1="264" x2="162" y2="264" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <line x1="178" y1="264" x2="200" y2="264" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />

              {pattern !== 'plain' && (
                <path
                  d="M134 140 C142 136 160 134 170 134 C180 134 198 136 206 140 C212 154 214 186 210 230 L216 315 L124 315 L130 230 Z"
                  fill={`url(#pattern-${pattern})`}
                />
              )}
            </g>
          )}

          {/* F. ÁO GIAO LĨNH */}
          {outfit === 'giaolinh' && (
            <g id="garment-giaolinh">
              {/* Wide Han-Tang-Viet ancient flowing sleeves */}
              <path d="M130 144 L60 215 L78 300 L130 220 Z" fill={colorHex} />
              <path d="M210 144 L280 215 L262 300 L210 220 Z" fill={colorHex} />
              <circle cx="70" cy="245" r="9" fill="#FBD8B8" />
              <circle cx="270" cy="245" r="9" fill="#FBD8B8" />

              {/* Main Robe with Crossed V-lapel */}
              <path
                d="M132 142 L208 142 L224 220 L234 445 L106 445 L116 220 Z"
                fill={colorHex}
              />

              {/* Crossed Lapel Collar (Cổ vạt giao chéo sang bên phải) */}
              <path
                d="M150 134 L170 190 L204 142"
                stroke={secondaryColorHex || '#FDE68A'}
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M138 136 L170 195 L212 250"
                stroke="#EDE7DC"
                strokeWidth="3"
                fill="none"
              />

              {/* Broad Belt (Đai lưng bản lớn) */}
              <rect x="136" y="240" width="68" height="22" rx="2" fill={secondaryColorHex || '#1F4F89'} />
              <rect x="160" y="244" width="20" height="14" rx="2" fill="url(#goldRibbon)" stroke="#78350F" strokeWidth="0.8" />
              {/* Hanging sash tails */}
              <path d="M164 262 L160 380 L168 380 L170 262 Z" fill={secondaryColorHex || '#1F4F89'} />
            </g>
          )}
        </g>

        {/* 3. ACCESSORIES OVERLAY LAYER */}
        <g id="accessories-overlay">
          {/* Pearl Necklace / Thẻ bài (Chuỗi ngọc) */}
          {hasAccessory('chuoingoc') && (
            <g id="acc-pearls">
              <path
                d="M152 146 Q170 178 188 146"
                stroke="#FFFDF6"
                strokeWidth="4"
                strokeDasharray="2 5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Golden jade medallion pendant */}
              <circle cx="170" cy="168" r="6" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
              <circle cx="170" cy="168" r="3" fill="#10B981" />
            </g>
          )}

          {/* Khăn Rằn (Gingham Scarf) */}
          {hasAccessory('khanran') && (
            <g id="acc-khanran">
              {/* Scarf draped around neck falling over chest */}
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
                strokeWidth="8"
                fill="none"
              />
              {/* Fringes at bottom */}
              <path d="M146 310 L146 318 M150 310 L150 318 M154 310 L154 318 M158 310 L158 318" stroke="#E4E4E7" strokeWidth="1.5" />
              <path d="M182 300 L182 308 M186 300 L186 308 M190 300 L190 308 M194 300 L194 308" stroke="#E4E4E7" strokeWidth="1.5" />
            </g>
          )}

          {/* Headphone (Over-ear) resting around neck */}
          {hasAccessory('headphone') && (
            <g id="acc-headphone">
              <path
                d="M140 120 Q170 148 200 120"
                stroke="#18181B"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <rect x="134" y="112" width="10" height="18" rx="5" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.2" />
              <rect x="196" y="112" width="10" height="18" rx="5" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="1.2" />
            </g>
          )}

          {/* Kính Râm Y2K (Cyber Sunglasses) */}
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
              {/* Cyber lens highlight */}
              <line x1="150" y1="80" x2="160" y2="83" stroke="#06B6D4" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="176" y1="80" x2="186" y2="83" stroke="#06B6D4" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}

          {/* Quạt Lụa / Quạt Trầm (Handheld Fan) */}
          {hasAccessory('quat') && (
            <g id="acc-fan">
              {/* Fan held in right hand */}
              <path
                d="M236 210 Q256 170 286 186 Q266 226 236 210 Z"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="1.2"
              />
              {/* Fan ribs */}
              <line x1="236" y1="210" x2="286" y2="186" stroke="#B45309" strokeWidth="0.8" />
              <line x1="236" y1="210" x2="274" y2="176" stroke="#B45309" strokeWidth="0.8" />
              <line x1="236" y1="210" x2="256" y2="172" stroke="#B45309" strokeWidth="0.8" />
              {/* Red tassel (Tua rua quạt) */}
              <path d="M236 210 Q230 225 232 245" stroke="#DC2626" strokeWidth="2" fill="none" />
              <circle cx="232" cy="245" r="2.5" fill="#EF4444" />
            </g>
          )}

          {/* Túi Cói / Túi Canvas (Tote bag) */}
          {hasAccessory('tuicoi') && (
            <g id="acc-tuicoi">
              {/* Strap over shoulder */}
              <path d="M128 148 Q100 210 95 280" stroke="#B45309" strokeWidth="2.5" fill="none" />
              {/* Straw woven body */}
              <path
                d="M84 275 L116 275 L112 325 L88 325 Z"
                fill="#D97706"
                stroke="#92400E"
                strokeWidth="1.5"
              />
              {/* Straw weave texture */}
              <path d="M86 285 L114 285 M87 295 L113 295 M88 305 L112 305 M88 315 L112 315" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 3" />
            </g>
          )}

          {/* Khăn Xếp / Mấn Lụa (Turban) */}
          {hasAccessory('man') && (
            <g id="acc-man">
              {/* Concentric rings of wrapped silk turban on head */}
              <ellipse cx="170" cy="58" rx="27" ry="14" fill={colorHex} stroke="#5B1210" strokeWidth="1.2" />
              <ellipse cx="170" cy="55" rx="24" ry="12" fill={colorHex} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <ellipse cx="170" cy="52" rx="21" ry="10" fill={colorHex} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              {gender === 'male' && (
                /* Chóp chữ Nhân góc trán cho nam */
                <path d="M166 65 L170 60 L174 65" stroke="#FFDD94" strokeWidth="1.8" fill="none" />
              )}
            </g>
          )}

          {/* Nón Lá Chuông (Conical Hat) */}
          {hasAccessory('nonla') && (
            <g id="acc-nonla">
              {/* Conical hat tilted on head */}
              <path
                d="M110 52 L170 14 L230 52 Z"
                fill="#FEF3C7"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              {/* Rings inside conical hat (Vành nón) */}
              <path d="M125 42 Q170 30 215 42" stroke="#B45309" strokeWidth="0.8" fill="none" />
              <path d="M140 32 Q170 24 200 32" stroke="#B45309" strokeWidth="0.8" fill="none" />
              <path d="M155 22 Q170 18 185 22" stroke="#B45309" strokeWidth="0.8" fill="none" />
              {/* Silk ribbon chin strap (Quai nón lụa mềm mại) */}
              <path
                d="M126 50 Q138 98 160 106 Q182 98 214 50"
                stroke="#F43F5E"
                strokeWidth="2.5"
                fill="none"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
