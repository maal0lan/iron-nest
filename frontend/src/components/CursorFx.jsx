import { useEffect } from 'react';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary, article';

/**
 * Cursor ring + dot that eases toward the pointer (requestAnimationFrame),
 * grows over interactive elements, and shrinks while pressed.
 * Skipped on touch devices and when prefers-reduced-motion is set.
 * The native cursor is left visible for accessibility.
 */
function CursorFx({ enabled = true }) {
  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    const ring = document.createElement('div');
    const dot = document.createElement('div');
    ring.className = 'cursor-ring';
    dot.className = 'cursor-dot';
    ring.setAttribute('aria-hidden', 'true');
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(ring, dot);

    let tx = -100, ty = -100; // pointer target
    let rx = -100, ry = -100; // eased ring position
    let raf = 0;
    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      ring.classList.add('is-visible');
      dot.classList.add('is-visible');
    };
    const hide = () => {
      shown = false;
      ring.classList.remove('is-visible');
      dot.classList.remove('is-visible');
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) { rx = tx; ry = ty; show(); }
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };
    // Event delegation, so elements added after mount (route changes) are handled too.
    const onOver = (e) => {
      ring.classList.toggle('is-active', !!(e.target instanceof Element && e.target.closest(INTERACTIVE)));
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    const tick = () => {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', show);
      ring.remove();
      dot.remove();
    };
  }, [enabled]);

  return null;
}

export { CursorFx };
export default CursorFx;
