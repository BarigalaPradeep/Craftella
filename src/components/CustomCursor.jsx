import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const canvasRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (mouse)
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId;

    // Sparkle particles for mouse trail
    const particles = [];
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastSpawnTime = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Spawn subtle rhinestone sparkle particles on move (throttled)
      const now = performance.now();
      if (now - lastSpawnTime > 40 && particles.length < 28) {
        lastSpawnTime = now;
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 8,
          y: mouseY + (Math.random() - 0.5) * 8,
          size: Math.random() * 2.8 + 1.2,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8 - 0.2,
          life: 1,
          decay: Math.random() * 0.035 + 0.02,
          color: Math.random() > 0.4 ? '#9EBEF6' : '#C084FC',
        });
      }

      // Check if hovering over clickable elements
      const target = e.target;
      const isInteractive = Boolean(
        target &&
          (target.closest('a') ||
            target.closest('button') ||
            target.closest('input') ||
            target.closest('select') ||
            target.closest('textarea') ||
            target.closest('[role="button"]') ||
            target.closest('.interactive-target') ||
            target.closest('.payment-card'))
      );
      setIsHovered(isInteractive);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation render loop
    const render = () => {
      // Smooth lerp for outer ring
      const ease = 0.18;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      // Render sparkles on canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.speedX;
          p.y += p.speedY;
          p.life -= p.decay;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.life * 0.8;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;

          // Draw small 4-point star rhinestone
          ctx.beginPath();
          const s = p.size * p.life;
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
          ctx.fill();

          // Subtle cross shine on larger particles
          if (p.size > 2.2) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x - s * 1.5, p.y);
            ctx.lineTo(p.x + s * 1.5, p.y);
            ctx.moveTo(p.x, p.y - s * 1.5);
            ctx.lineTo(p.x, p.y + s * 1.5);
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      {/* Sparkle particle trail canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9990] transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
      />

      {/* Center inner pinpoint dot */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className={`rounded-full transition-transform duration-150 ${
            isHovered
              ? 'h-3 w-3 bg-gradient-to-r from-[#9EBEF6] to-[#C084FC] shadow-[0_0_12px_#7AA5F2]'
              : isClicked
              ? 'h-2 w-2 bg-white scale-75'
              : 'h-2 w-2 bg-[#7AA5F2] shadow-[0_0_8px_#7AA5F2]'
          }`}
        />
      </div>

      {/* Trailing crystal halo ring */}
      <div
        ref={cursorRingRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] will-change-transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className={`rounded-full border transition-all duration-300 ease-out flex items-center justify-center ${
            isHovered
              ? 'h-11 w-11 border-[#7AA5F2] bg-[#7AA5F2]/10 backdrop-blur-[1px] shadow-[0_0_20px_rgba(122,165,242,0.4)] scale-110'
              : isClicked
              ? 'h-6 w-6 border-white bg-white/20 scale-90'
              : 'h-8 w-8 border-[rgba(158,190,246,0.4)] shadow-[0_0_10px_rgba(122,165,242,0.15)]'
          }`}
        >
          {isHovered && (
            <span className="h-1 w-1 rounded-full bg-white animate-ping" />
          )}
        </div>
      </div>
    </>
  );
}
