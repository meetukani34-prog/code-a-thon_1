"use client";

import React, { useEffect, useRef } from "react";

interface CrystalCursorProps {
  children?: React.ReactNode;
  crystalColor?: string;
  shatterColor?: string;
  className?: string;
}

const CrystalCursor = ({
  children,
  crystalColor = "hsla(220, 100%, 80%, 0.1)",
  shatterColor = "hsla(220, 100%, 90%, 1)",
  className = "",
}: CrystalCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const mouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const crystals = useRef<Crystal[]>([]);
  const shards = useRef<Shard[]>([]);

  class Crystal {
    x: number;
    y: number;
    angle: number;
    radius: number;
    targetRadius: number;
    life: number;
    context: CanvasRenderingContext2D;
    lineWidth: number;
    turnAngle: number;

    constructor(x: number, y: number, context: CanvasRenderingContext2D) {
      this.x = x;
      this.y = y;
      this.angle = Math.random() * Math.PI * 2;
      this.radius = 0;
      this.targetRadius = Math.random() * 80 + 20;
      this.life = 150;
      this.context = context;
      this.lineWidth = Math.random() * 1.5 + 0.5;
      this.turnAngle = (Math.random() - 0.5) * 0.1;
    }

    draw() {
      this.context.strokeStyle = `hsla(220, 100%, 80%, ${this.life / 150})`;
      this.context.lineWidth = this.lineWidth;
      this.context.beginPath();
      this.context.moveTo(this.x, this.y);
      const endX = this.x + Math.cos(this.angle) * this.radius;
      const endY = this.y + Math.sin(this.angle) * this.radius;
      this.context.lineTo(endX, endY);
      this.context.stroke();
    }

    update() {
      if (this.radius < this.targetRadius) {
        this.radius += 0.5;
      }
      this.life -= 1;
      this.angle += this.turnAngle;
    }
  }

  class Shard {
    x: number;
    y: number;
    angle: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    context: CanvasRenderingContext2D;

    constructor(x: number, y: number, context: CanvasRenderingContext2D) {
      this.x = x;
      this.y = y;
      this.angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.vx = Math.cos(this.angle) * speed;
      this.vy = Math.sin(this.angle) * speed;
      this.life = 100;
      this.size = Math.random() * 3 + 1;
      this.context = context;
    }

    draw() {
      this.context.fillStyle = `hsla(220, 100%, 90%, ${this.life / 100})`;
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.context.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 1;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      // Clear with transparent bg instead of solid color so it layers over existing backgrounds
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() > 0.7) {
        crystals.current.push(
          new Crystal(
            mouse.current.x + (Math.random() - 0.5) * 50,
            mouse.current.y + (Math.random() - 0.5) * 50,
            ctx
          )
        );
      }

      crystals.current = crystals.current.filter((c) => c.life > 0);
      crystals.current.forEach((c) => {
        c.update();
        c.draw();
      });

      shards.current = shards.current.filter((s) => s.life > 0);
      shards.current.forEach((s) => {
        s.update();
        s.draw();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 50; i++) {
        shards.current.push(new Shard(e.clientX, e.clientY, ctx));
      }
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClick);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="fixed inset-0 block h-full w-full z-0 pointer-events-none" />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default CrystalCursor;
