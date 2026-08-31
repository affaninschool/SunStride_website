import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'default' | 'button' | 'interactive' | 'crosshair'>('default');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Detect hover target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('button, a, [role="button"], input[type="range"], select')) {
        setCursorType('button');
      } else if (target.closest('[data-cursor="crosshair"], svg, canvas, .diagram-area')) {
        setCursorType('crosshair');
      } else if (target.closest('[data-cursor="interactive"], .interactive-component, [data-interactive]')) {
        setCursorType('interactive');
      } else {
        setCursorType('default');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Central precise dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#121417] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 mix-blend-difference"
        style={{
          backgroundColor: cursorType === 'button' ? '#10b981' : cursorType === 'crosshair' ? '#0284c7' : '#ffffff',
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: cursorType === 'button' ? 1.4 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 450, mass: 0.1 }}
      />

      {/* Delayed tracking ring */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 rounded-full border border-neutral-700/60 flex items-center justify-center"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          width: cursorType === 'button' ? 36 : cursorType === 'interactive' ? 44 : cursorType === 'crosshair' ? 32 : 24,
          height: cursorType === 'button' ? 36 : cursorType === 'interactive' ? 44 : cursorType === 'crosshair' ? 32 : 24,
          borderColor:
            cursorType === 'button'
              ? 'rgba(16, 185, 129, 0.8)'
              : cursorType === 'crosshair'
              ? 'rgba(2, 132, 199, 0.8)'
              : cursorType === 'interactive'
              ? 'rgba(245, 158, 11, 0.8)'
              : 'rgba(55, 65, 81, 0.5)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 220, mass: 0.25 }}
      >
        {/* Crosshair ticks when inspecting diagrams */}
        {cursorType === 'crosshair' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-sky-500/40" />
            <div className="h-full w-[1px] bg-sky-500/40 absolute" />
          </div>
        )}

        {/* Directional arrow tag when hovering actionable buttons */}
        {cursorType === 'button' && (
          <div className="absolute -right-3 -top-2 bg-emerald-500 text-white text-[8px] font-mono font-bold px-1 rounded">
            →
          </div>
        )}

        {/* RFID Target pulse when in interactive lab elements */}
        {cursorType === 'interactive' && (
          <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping" />
        )}
      </motion.div>
    </div>
  );
};
