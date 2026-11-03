import { useEffect } from 'react';

export default function CursorFx({ enabled = true }) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursor = document.createElement('div');
    Object.assign(cursor.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '20px',
      height: '20px',
      border: '2px solid var(--color-primary-600)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '99999',
      transition: 'transform 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out, background-color 0.15s ease-out',
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
    });
    document.body.style.cursor = 'none';
    document.body.appendChild(cursor);

    let x = 0, y = 0;
    let cx = 0, cy = 0;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
    };

    const over = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.backgroundColor = 'var(--color-primary-100)';
    };
    const out = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'transparent';
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseenter', over, true);
    document.addEventListener('mouseleave', out, true);

    const animate = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const els = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
    els.forEach((el) => {
      el.addEventListener('mouseenter', over);
      el.addEventListener('mouseleave', out);
    });

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', over, true);
      document.removeEventListener('mouseleave', out, true);
      document.body.style.cursor = '';
      if (document.body.contains(cursor)) document.body.removeChild(cursor);
      els.forEach((el) => {
        el.removeEventListener('mouseenter', over);
        el.removeEventListener('mouseleave', out);
      });
    };
  }, [enabled]);
}
