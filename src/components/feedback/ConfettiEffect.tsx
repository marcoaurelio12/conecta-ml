
import React, { useEffect, useRef } from "react";

const colors = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#22C55E"];

const ConfettiEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

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

    // Create confetti pieces
    for (let i = 0; i < 200; i++) {
      confettiPieces.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight - canvasHeight,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let animationFrameId: number;
    
    // Update confetti positions
    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      confettiPieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += Math.sin(piece.angle) * 1;
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

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50" 
      aria-hidden="true"
    />
  );
};

export default ConfettiEffect;
