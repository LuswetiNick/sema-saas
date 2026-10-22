"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { LandingMotionController } from "./motion-controller";

export function MotionRoot({ children, fontClasses }: { children: ReactNode; fontClasses: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!window.matchMedia || !window.IntersectionObserver || !window.ResizeObserver) return;
    let controller: LandingMotionController | undefined;
    try {
      controller = new LandingMotionController(element, {
        request: (callback) => window.requestAnimationFrame(callback),
        cancel: (id) => window.cancelAnimationFrame(id),
      });
      controller.start();
    } catch {
      controller?.dispose();
      element.dataset.motion = "static";
    }
    return () => controller?.dispose();
  }, []);
  return <div ref={root} id="top" tabIndex={-1} className={`sema-landing ${fontClasses}`} data-motion="static">
    {children}
    <button type="button" className="sema-motionToggle" data-motion-toggle hidden><span aria-hidden="true">◫</span><span data-motion-label>Pause motion</span></button>
  </div>;
}
