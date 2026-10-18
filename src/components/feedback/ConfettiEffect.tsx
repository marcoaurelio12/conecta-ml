import React, { useEffect, useRef } from "react";

/** Brand palette, read from the design tokens so confetti follows the theme. */
const tokenColors = (fallbacks: string[]): string[] => {
  if (typeof window === "undefined") return fallbacks;
  const styles = getComputedStyle(document.documentElement);
  return ["primary", "success", "warning", "muted-foreground"].map((token) => {
    const value = styles.getPropertyValue(`--${token}`).trim();
    return value ? `hsl(${value})` : fallbacks[0];
  });
};

const ConfettiEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect the OS reduce-motion setting: skip the animation entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const colors = tokenColors(["#007EA7", "#008550", "#EAA900"]);

    const confettiPieces: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    for (let i = 0; i < 160; i++) {
      confettiPieces.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight - canvasHeight,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      confettiPieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += Math.sin(piece.angle);
        piece.rotation += piece.rotationSpeed;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" aria-hidden="true" />
  );
};

export default ConfettiEffect;
