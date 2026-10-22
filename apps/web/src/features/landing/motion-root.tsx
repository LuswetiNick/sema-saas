"use client";

import { useEffect, useRef, type ReactNode } from "react";
import s from "./landing.module.css";

export function MotionRoot({ children, fontClasses }: { children: ReactNode; fontClasses: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    element.dataset.motion = "static";
  }, []);
  return <div ref={root} id="top" className={`${s.landing} ${fontClasses}`} data-motion="static">{children}</div>;
}
