import React, { useEffect, useRef } from 'react';
import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
});

const ParticleText: React.FC<{ color?: string; height?: string }> = ({ color = 'white', height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const textToRender = "Gattabara Games";
    const particleGap = 2;
    const particleSize = 2.86;
    const mouse = { x: 0, y: 0, radius: 60 };
    let isHovering = false;
    let particles: any[] = [];
    let animationFrameId: number;

    const init = () => {
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      const isMobile = window.innerWidth < 768;

      // Significantly larger font size for mobile (splitting lines)
      const baseFontSize = isMobile ? (canvas.width * 0.09) : (canvas.width * 0.0485);
      const responsiveFontSize = Math.min(baseFontSize, isMobile ? 64 : 96);

      const responsiveVerticalScale = isMobile ? 1.0 : 1.0;
      const responsiveHorizontalScale = isMobile ? 1.0 : 1.0;
      const responsiveFont = `400 ${responsiveFontSize}px ${pressStart2P.style.fontFamily}, sans-serif`;

      ctx.fillStyle = color;
      ctx.font = responsiveFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.save();
      ctx.scale(responsiveHorizontalScale, responsiveVerticalScale);

      // Get scroll offset to counteract movement
      const rect = container.getBoundingClientRect();
      const scrollOffsetY = rect.top; // This changes as user scrolls

      if (isMobile) {
        // Multi-line rendering for mobile
        const lineHeight = responsiveFontSize * 1.2;
        const centerY = (canvas.height * 0.3) / responsiveVerticalScale;

        // Subtract scrollOffsetY to keep text fixed relative to viewport
        const fixedCenterY = centerY - (scrollOffsetY / responsiveVerticalScale);

        ctx.fillText("Gattabara", (canvas.width / 2) / responsiveHorizontalScale, fixedCenterY - (lineHeight * 0.5));
        ctx.fillText("Games", (canvas.width / 2) / responsiveHorizontalScale, fixedCenterY + (lineHeight * 0.5));
      } else {
        // Single line for desktop
        const textY = (canvas.height / 2);
        // Subtract scrollOffsetY
        const fixedTextY = textY - (scrollOffsetY / responsiveVerticalScale);

        ctx.fillText(textToRender, (canvas.width / 2) / responsiveHorizontalScale, fixedTextY / responsiveVerticalScale);
      }

      ctx.restore();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      particles = [];

      for (let y = 0; y < canvas.height; y += particleGap) {
        for (let x = 0; x < canvas.width; x += particleGap) {
          const index = (y * canvas.width + x) * 4 + 3;
          if (data[index] > 128) {
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: particleSize,
              color: color
            });
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isAffected = isHovering && distance < mouse.radius;

        if (isAffected) {
          const force = (mouse.radius - distance) / mouse.radius;
          p.vx -= (dx / distance) * force * 20;
          p.vy -= (dy / distance) * force * 20;
        } else {
          p.vx -= (p.x - p.originX) * 0.04;
          p.vy -= (p.y - p.originY) * 0.04;
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      isHovering = true;
    };

    if (typeof document !== 'undefined' && (document as any).fonts) {
      (document as any).fonts.ready.then(() => {
        init();
        animate();
      });
    } else {
      init();
      animate();
    }

    window.addEventListener('resize', init);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', () => {
      isHovering = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full ${height || 'h-screen'} flex justify-center items-center overflow-hidden bg-transparent ${pressStart2P.className}`}
    >
      <canvas ref={canvasRef} className="max-w-full" />
    </div>
  );
};

export default ParticleText;