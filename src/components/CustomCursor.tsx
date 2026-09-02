import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

const TRAIL_COUNT = 7;
// Lerp factors for progressive trailing inertia
const LERP_FACTORS = [0.45, 0.35, 0.28, 0.22, 0.17, 0.13, 0.10];
const DOT_SIZES = [8, 6.5, 5, 4, 3, 2.2, 1.6];
const OPACITIES = [1.0, 0.75, 0.55, 0.40, 0.28, 0.18, 0.10];

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [cursorType, setCursorType] = useState<'default' | 'button' | 'interactive' | 'crosshair' | 'text'>('default');
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isOverTour, setIsOverTour] = useState<boolean>(false);
  const [isDarkSurface, setIsDarkSurface] = useState<boolean>(false);
  const [magneticPos, setMagneticPos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Mouse coordinates
  const mouseRef = useRef<Point>({ x: -100, y: -100 });
  const trailRefs = useRef<Point[]>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );
  const dotElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const auraElementRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number>(0);
  const isTouchRef = useRef<boolean>(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      isTouchRef.current = true;
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseRef.current = { x: clientX, y: clientY };

      if (!isVisible) {
        setIsVisible(true);
        // Initialize all trail points to mouse position to prevent fly-in glitch
        trailRefs.current = Array.from({ length: TRAIL_COUNT }, () => ({ x: clientX, y: clientY }));
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Context detection (Tour Modal, dark surfaces, etc.)
      const tourEl = target.closest('[data-tour-modal], .tour-modal-overlay, .tour-modal-container') as HTMLElement | null;
      const darkEl = !!tourEl || !!target.closest('.dark, .bg-neutral-900, .bg-neutral-950, .bg-[#121417], .bg-[#0A0A0A], footer, [data-theme="dark"]');
      
      setIsOverTour(!!tourEl);
      setIsDarkSurface(darkEl);

      // Magnetic detection
      const interactiveEl = target.closest('button, a, [role="button"], input[type="range"], select, .cursor-magnetic') as HTMLElement | null;
      const textInputEl = target.closest('input[type="text"], input[type="email"], textarea') as HTMLElement | null;
      const diagramEl = target.closest('[data-cursor="crosshair"], svg, canvas, .diagram-area') as HTMLElement | null;
      const labEl = target.closest('[data-cursor="interactive"], .interactive-component, [data-interactive]') as HTMLElement | null;

      if (interactiveEl) {
        setCursorType('button');
        const rect = interactiveEl.getBoundingClientRect();
        // Calculate element center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from cursor to element center
        const dx = centerX - clientX;
        const dy = centerY - clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply magnetic capture if within proximity
        if (distance < 80) {
          setMagneticPos({
            x: centerX,
            y: centerY,
            width: rect.width,
            height: rect.height,
          });
        } else {
          setMagneticPos(null);
        }
      } else if (textInputEl) {
        setCursorType('text');
        setMagneticPos(null);
      } else if (diagramEl) {
        setCursorType('crosshair');
        setMagneticPos(null);
      } else if (labEl) {
        setCursorType('interactive');
        setMagneticPos(null);
      } else {
        setCursorType('default');
        setMagneticPos(null);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Animation Loop for Smooth Trail Interpolation
    const animate = () => {
      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      // If magnetically attached, pull target slightly toward center
      if (magneticPos) {
        const pullStrength = 0.38;
        targetX += (magneticPos.x - targetX) * pullStrength;
        targetY += (magneticPos.y - targetY) * pullStrength;
      }

      // Update lead point
      trailRefs.current[0].x += (targetX - trailRefs.current[0].x) * LERP_FACTORS[0];
      trailRefs.current[0].y += (targetY - trailRefs.current[0].y) * LERP_FACTORS[0];

      // Update trailing dots progressively
      for (let i = 1; i < TRAIL_COUNT; i++) {
        const prev = trailRefs.current[i - 1];
        const curr = trailRefs.current[i];
        const factor = LERP_FACTORS[i];

        curr.x += (prev.x - curr.x) * factor;
        curr.y += (prev.y - curr.y) * factor;
      }

      // Directly update DOM elements for optimal 120fps performance
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = dotElementsRef.current[i];
        if (el) {
          const pt = trailRefs.current[i];
          el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0px) translate(-50%, -50%)`;
        }
      }

      // Update outer magnetic aura
      if (auraElementRef.current) {
        const lead = trailRefs.current[0];
        auraElementRef.current.style.transform = `translate3d(${lead.x}px, ${lead.y}px, 0px) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isVisible, magneticPos]);

  if (isTouchRef.current || !isVisible) return null;

  // Determine active theme color
  const getThemeColor = () => {
    if (isOverTour) {
      // High-contrast luminous palette specially tuned for the 2-Minute Slide Tour
      switch (cursorType) {
        case 'button':
          return '#10B981'; // Bright Neon Emerald on clickable actions
        case 'interactive':
          return '#FBBF24'; // Radiant Solar Amber Gold on interactive cards
        case 'crosshair':
          return '#38BDF8'; // Bright Cyan for technical diagrams
        case 'text':
          return '#60A5FA'; // Luminous Sky Blue
        default:
          return '#F59E0B'; // Vivid SunStride Amber Gold default for high visibility
      }
    }

    if (isDarkSurface) {
      switch (cursorType) {
        case 'button':
          return '#34D399';
        case 'interactive':
          return '#FBBF24';
        case 'crosshair':
          return '#38BDF8';
        default:
          return '#F59E0B';
      }
    }

    switch (cursorType) {
      case 'button':
        return '#059669'; // Emerald
      case 'crosshair':
        return '#0284c7'; // Sky
      case 'interactive':
        return '#d97706'; // Amber
      case 'text':
        return '#2563eb'; // Blue
      default:
        return '#1a1a1a'; // Neutral dark
    }
  };

  const themeColor = getThemeColor();

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Outer Magnetic Aura / Target Snap Ring */}
      <div
        ref={auraElementRef}
        className="fixed top-0 left-0 pointer-events-none rounded-full transition-all duration-200 ease-out flex items-center justify-center"
        style={{
          width: cursorType === 'button' ? (magneticPos ? 46 : 38) : cursorType === 'crosshair' ? 34 : cursorType === 'interactive' ? 42 : 28,
          height: cursorType === 'button' ? (magneticPos ? 46 : 38) : cursorType === 'crosshair' ? 34 : cursorType === 'interactive' ? 42 : 28,
          border: `1.5px solid ${themeColor}`,
          backgroundColor: isOverTour
            ? (cursorType === 'button' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.12)')
            : (cursorType === 'button' ? 'rgba(5, 150, 105, 0.08)' : 'transparent'),
          boxShadow: isOverTour
            ? `0 0 16px ${themeColor}66, inset 0 0 8px ${themeColor}33`
            : isDarkSurface
            ? `0 0 12px ${themeColor}44`
            : 'none',
          opacity: cursorType === 'default' ? (isOverTour ? 0.9 : 0.4) : 0.95,
          transform: `scale(${isMouseDown ? 0.8 : 1})`,
        }}
      >
        {/* Crosshair precision marks */}
        {cursorType === 'crosshair' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-70">
            <div className="w-full h-[1px]" style={{ backgroundColor: themeColor }} />
            <div className="h-full w-[1px] absolute" style={{ backgroundColor: themeColor }} />
          </div>
        )}

        {/* Magnetic indicator dot */}
        {magneticPos && (
          <div
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: themeColor }}
          />
        )}
      </div>

      {/* Trailing Dots Trail (Rendered from tail to lead for correct z-stacking) */}
      {Array.from({ length: TRAIL_COUNT })
        .map((_, idx) => idx)
        .reverse()
        .map((i) => {
          const size = DOT_SIZES[i] * (isMouseDown ? 0.75 : 1);
          const opacity = OPACITIES[i];
          const isLead = i === 0;

          return (
            <div
              key={i}
              ref={(el) => (dotElementsRef.current[i] = el)}
              className="fixed top-0 left-0 pointer-events-none rounded-full transition-colors duration-150"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: isLead
                  ? themeColor
                  : i < 3
                  ? themeColor
                  : isOverTour
                  ? '#D97706'
                  : isDarkSurface
                  ? '#9CA3AF'
                  : '#374151',
                opacity: isLead ? 1 : opacity,
                boxShadow: isLead
                  ? `0 0 10px ${themeColor}aa`
                  : i < 3
                  ? `0 0 6px ${themeColor}55`
                  : 'none',
                zIndex: 99999 + (TRAIL_COUNT - i),
              }}
            />
          );
        })}
    </div>
  );
};

