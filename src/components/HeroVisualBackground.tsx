import React, { useState } from 'react';

/**
 * Hằng số cấu hình đường dẫn video background
 * Cho phép dễ dàng đổi sang URL video trực tuyến (CDN) hoặc file trong thư mục public/
 */
const HERO_VIDEO_SRC = "/hero-bg.mp4";

interface HeroVisualBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const HeroVisualBackground: React.FC<HeroVisualBackgroundProps> = ({
  children,
  className = '',
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);

  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      {/* 1. Lớp hình ảnh nghệ thuật & sương khói Fallback chất lượng cao (Không bao giờ để màn hình đen) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isVideoLoaded && !hasVideoError ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, #451210 0%, #200B0A 50%, #120505 100%)',
        }}
      >
        {/* Họa tiết lụa gấm tà áo cổ phong cách điệu với ánh sáng mềm */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#E4A025_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Lớp sóng lụa mềm mại mô phỏng tà áo bay bồng bềnh */}
        <svg
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="silkFlowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C82A27" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8D1815" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#E4A025" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="silkFlowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E4A025" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#7F1D1D" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M0 320 C320 180, 560 480, 960 260 C1200 120, 1360 220, 1440 280 L1440 800 L0 800 Z"
            fill="url(#silkFlowGrad1)"
            className="animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <path
            d="M0 450 C400 320, 720 580, 1100 380 C1280 280, 1380 340, 1440 400 L1440 800 L0 800 Z"
            fill="url(#silkFlowGrad2)"
            className="animate-pulse"
            style={{ animationDuration: '12s' }}
          />
        </svg>

        {/* Lớp sương khói mờ ảo (Atmospheric Heritage Mist) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 mix-blend-multiply" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#C82A27]/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#E4A025]/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* 2. Thẻ Video chuẩn kỹ thuật cho thiết bị di động & máy tính */}
      {!hasVideoError && (
        <video
          src={HERO_VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => {
            setHasVideoError(true);
            setIsVideoLoaded(false);
          }}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 3. Lớp phủ bóng mờ Gradient (Overlay) & Hiệu ứng điện ảnh Cung Đình */}
      {/* Ambient Glow ở tâm (quầng sáng vàng ấm lan tỏa nhẹ) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(229,169,60,0.18)_0%,rgba(201,151,0,0.06)_45%,transparent_75%)]" />

      {/* Viền tối điện ảnh (Vignette đen mờ dần về 4 cạnh) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(15,13,11,0.85)_100%)]" />

      {/* Gradient nâng đỡ chữ phía dưới */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0B]/90 via-black/25 to-black/60 pointer-events-none" />

      {/* 4. Nội dung phía trên (Hero text & buttons) */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
