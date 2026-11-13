
"use client";

import { useEffect, useState } from "react";
import { content } from "@/data/content";

type Heart = {
  id: number;
  x: number;
  y: number;
};

export function HeartTouch() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (!content.heartTouchEnabled) return;

    const handleTouch = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("img, [data-heart-touch]")) return;

      const id = Date.now() + Math.random();

      setHearts((previous) => [
        ...previous,
        {
          id,
          x: event.clientX,
          y: event.clientY,
        },
      ]);

      window.setTimeout(() => {
        setHearts((previous) =>
          previous.filter((heart) => heart.id !== id)
        );
      }, content.heartTouchDuration || 1300);
    };

    document.addEventListener("pointerdown", handleTouch);

    return () => {
      document.removeEventListener("pointerdown", handleTouch);
    };
  }, []);

  if (!content.heartTouchEnabled) return null;

  return (
    <>
      <style jsx global>{`
        .floating-touch-heart {
          position: fixed;
          z-index: 999999;
          pointer-events: none;
          font-size: 36px;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 12px #ff69a4);
          animation: floatingHeartTouch
            ${content.heartTouchDuration || 1300}ms ease-out forwards;
        }

        @keyframes floatingHeartTouch {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
          }

          20% {
            opacity: 1;
            transform: translate(-50%, -80%) scale(1.5);
          }

          60% {
            opacity: 1;
            transform: translate(-50%, -130%) scale(1);
          }

          100% {
            opacity: 0;
            transform: translate(-50%, -200%) scale(0.5);
          }
        }
      `}</style>

      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-touch-heart"
          style={{
            left: heart.x,
            top: heart.y,
          }}
          aria-hidden="true"
        >
          {content.heartTouchEmoji || "💗"}
        </span>
      ))}
    </>
  );
}
