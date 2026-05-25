"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LightRaysBackgroundProps {
  className?: string;
  /**
   * Base color of the rays. E.g. "rgba(255,255,255,"
   */
  rayColor?: string;
}

export default function LightRaysBackground({
  className,
  rayColor = "rgba(255, 255, 255,",
}: LightRaysBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let animationFrameId: number;

    class Ray {
      x: number;
      width: number;
      speed: number;
      opacity: number;
      angle: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        // Rays stretch far outside the canvas to cover diagonal space
        this.x = Math.random() * (canvasWidth * 2) - canvasWidth / 2;
        this.width = Math.random() * 150 + 50; // 50 to 200px wide
        this.speed = (Math.random() * 0.5 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
        this.opacity = Math.random() * 0.15 + 0.05; // 0.05 to 0.2 opacity
        this.angle = -Math.PI / 4; // -45 degrees
      }

      update(canvasWidth: number) {
        this.x += this.speed;
        
        // Wrap around
        if (this.speed > 0 && this.x > canvasWidth * 1.5) {
          this.x = -canvasWidth / 2;
        } else if (this.speed < 0 && this.x < -canvasWidth / 2) {
          this.x = canvasWidth * 1.5;
        }
      }

      draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
        ctx.save();
        ctx.translate(this.x, 0);
        ctx.rotate(this.angle);

        const gradient = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
        gradient.addColorStop(0, `${rayColor}0)`);
        gradient.addColorStop(0.5, `${rayColor}${this.opacity})`);
        gradient.addColorStop(1, `${rayColor}0)`);

        ctx.fillStyle = gradient;
        // Draw a long rectangle covering the diagonal
        ctx.fillRect(-this.width / 2, -canvasHeight * 2, this.width, canvasHeight * 4);
        
        ctx.restore();
      }
    }

    let rays: Ray[] = [];

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      rays = [];
      const numRays = Math.floor(width / 50); // Density of rays
      for (let i = 0; i < numRays; i++) {
        rays.push(new Ray(width, height));
      }
    };

    const animate = () => {
      // Very dark background
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";
      rays.forEach((ray) => {
        ray.update(width);
        ray.draw(ctx, height);
      });
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      init();
    };

    init();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [rayColor]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#050505]", className)}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-50 pointer-events-none" />
    </div>
  );
}
