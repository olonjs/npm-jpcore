import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function DawnBackground({
  dawnDuration = 3.5,
  breathingSpeed = 0.5,
  breathingRange = 0.03,
  intensity = 0.55,
}: {
  dawnDuration?: number;
  breathingSpeed?: number;
  breathingRange?: number;
  intensity?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const rafRef       = useRef<number>(0);
  const startRef     = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas || !container) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = container.offsetWidth  * dpr;
      canvas.height = container.offsetHeight * dpr;
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function draw(ts: number) {
      if (!canvas || !ctx) return;
      if (!startRef.current) startRef.current = ts;

      const elapsed = (ts - startRef.current) / 1000;
      const dawnP   = Math.min(elapsed / dawnDuration, 1);
      const dawnE   = easeOut(dawnP);
      const breathT = Math.max(0, elapsed - dawnDuration);
      const breathe = dawnP >= 1
        ? 1 + Math.sin(breathT * breathingSpeed) * breathingRange
        : 1;

      const W = canvas.width;
      const H = canvas.height;
      const masterIntensity = dawnE * intensity * breathe;

      ctx.clearRect(0, 0, W, H);

      // Left source — bottom left, primary blue
      const lx = W * 0.18;
      const ly = H * 0.92;
      const lr = W * 0.75 * breathe;
      const gL = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
      gL.addColorStop(0.00, `rgba(15,52,224,${0.70 * masterIntensity})`);
      gL.addColorStop(0.20, `rgba(23,99,255,${0.60 * masterIntensity})`);
      gL.addColorStop(0.45, `rgba(91,142,255,${0.35 * masterIntensity})`);
      gL.addColorStop(0.70, `rgba(84,171,255,${0.15 * masterIntensity})`);
      gL.addColorStop(1.00, 'rgba(12,17,22,0)');
      ctx.fillStyle = gL;
      ctx.fillRect(0, 0, W, H);

      // Right source — mirror
      const gR = ctx.createRadialGradient(W - lx, ly, 0, W - lx, ly, lr);
      gR.addColorStop(0.00, `rgba(15,52,224,${0.70 * masterIntensity})`);
      gR.addColorStop(0.20, `rgba(23,99,255,${0.60 * masterIntensity})`);
      gR.addColorStop(0.45, `rgba(91,142,255,${0.35 * masterIntensity})`);
      gR.addColorStop(0.70, `rgba(84,171,255,${0.15 * masterIntensity})`);
      gR.addColorStop(1.00, 'rgba(12,17,22,0)');
      ctx.fillStyle = gR;
      ctx.fillRect(0, 0, W, H);

      // Center V tip — deep navy, very subtle
      const vr = W * 0.32 * breathe;
      const gV = ctx.createRadialGradient(W * 0.5, H * 0.72, 0, W * 0.5, H * 0.72, vr);
      gV.addColorStop(0.00, `rgba(9,64,184,${0.50 * masterIntensity})`);
      gV.addColorStop(0.40, `rgba(15,52,224,${0.25 * masterIntensity})`);
      gV.addColorStop(1.00, 'rgba(12,17,22,0)');
      ctx.fillStyle = gV;
      ctx.fillRect(0, 0, W, H);

      // Top dark veil — keeps header very dark
      const gTop = ctx.createLinearGradient(0, 0, 0, H * 0.6);
      gTop.addColorStop(0,    'rgba(12,17,22,1)');
      gTop.addColorStop(0.55, 'rgba(12,17,22,0.85)');
      gTop.addColorStop(1,    'rgba(12,17,22,0)');
      ctx.fillStyle = gTop;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [dawnDuration, breathingSpeed, breathingRange, intensity]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      animate={{ opacity: 1, transition: { duration: 0.1 } }}
      initial={{ opacity: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </motion.div>
  );
}
