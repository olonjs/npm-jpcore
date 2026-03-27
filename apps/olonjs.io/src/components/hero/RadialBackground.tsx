import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

// CSS var names — order matches STOPS
const TOKEN_VARS = [
  '--background',   // #0B0907 center
  '--background',         // #130F0D
  '--background',     // #1E1814
  '--background',       // #2E271F
  '--background',      // #241D17
  '--elevated',     // #1E1814
  '--background',   // #0B0907 outer
] as const;

const STOPS = [0, 30, 55, 72, 84, 93, 100] as const;

function readTokenColors(): string[] {
  if (typeof document === 'undefined') return TOKEN_VARS.map(() => '#000');
  const s = getComputedStyle(document.documentElement);
  return TOKEN_VARS.map((v) => s.getPropertyValue(v).trim() || '#000');
}

export function RadialBackground({
  startingGap =80, 
  breathing = true,
  animationSpeed = 0.01,
  breathingRange = 180,
  topOffset = 0,
}: {
  startingGap?: number;
  breathing?: boolean;
  animationSpeed?: number;
  breathingRange?: number;
  topOffset?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [colors, setColors] = useState<string[]>(() => readTokenColors());

  // Re-read tokens when data-theme changes (dark ↔ light)
  useEffect(() => {
    setColors(readTokenColors());
    const observer = new MutationObserver(() => setColors(readTokenColors()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrame: number;
    let width = startingGap;
    let direction = 1;

    const animate = () => {
      if (width >= startingGap + breathingRange) direction = -1;
      if (width <= startingGap - breathingRange) direction = 1;
      if (!breathing) direction = 0;
      width += direction * animationSpeed;

      const stops = STOPS.map((s, i) => `${colors[i]} ${s}%`).join(', ');
      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${stops})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [startingGap, breathing, animationSpeed, breathingRange, topOffset, colors]);

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, transition: { duration: 2, ease: [0.25, 0.1, 0.25, 1] } }}
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0, scale: 1.5 }}
    >
      <div className="absolute inset-0" ref={containerRef} />
    </motion.div>
  );
}
