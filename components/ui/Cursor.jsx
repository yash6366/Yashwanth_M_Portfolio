"use client";

import { useEffect, useRef } from "react";
import styles from "@/styles/ui/Cursor.module.css";

export default function Cursor() {
  const cursorRef = useRef(null);
  const mouse     = useRef({ x: -100, y: -100 });
  const pos       = useRef({ x: -100, y: -100 });
  const rafRef    = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      return;
    }

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={styles.cursor}
      aria-hidden="true"
    />
  );
}
