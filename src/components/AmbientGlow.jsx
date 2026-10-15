import React, { useEffect, useState } from 'react';

export default function AmbientGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    let animId;
    let targetX = -200;
    let targetY = -200;
    let currentX = -200;
    let currentY = -200;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Dynamic Torch / Spotlight following the mouse */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full will-change-transform transition-opacity duration-500 hidden md:block"
        style={{
          transform: `translate3d(${pos.x - 250}px, ${pos.y - 250}px, 0)`,
          background: 'radial-gradient(circle, rgba(122, 165, 242, 0.075) 0%, rgba(192, 132, 252, 0.035) 45%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Classic Slow-Breathing Ambient Cosmic Background Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(87,140,230,0.12),transparent_70%)] blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute top-2/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-[radial-gradient(circle,rgba(192,132,252,0.1),transparent_70%)] blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s]" />
      <div className="absolute -bottom-24 left-1/3 w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(122,165,242,0.08),transparent_70%)] blur-3xl animate-[pulse_12s_ease-in-out_infinite_4s]" />
    </div>
  );
}
