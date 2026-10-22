import { HeroMotion } from "./hero-motion";
import { lerp, requiredElement } from "./motion-math";
import { ScrollMotion } from "./scroll-motion";

type FrameClock = { request: (callback: FrameRequestCallback) => number; cancel: (id: number) => void };

export class LandingMotionController {
  private readonly hero: HeroMotion;
  private readonly sections: ScrollMotion;
  private readonly button: HTMLButtonElement;
  private readonly buttonLabel: HTMLElement;
  private readonly preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  private readonly coarse = window.matchMedia("(pointer: coarse)");
  private readonly abort = new AbortController();
  private readonly observer: IntersectionObserver;
  private readonly resize: ResizeObserver;
  private frame: number | undefined;
  private previousTime: number | undefined;
  private scroll = window.scrollY;
  private dirty = true;
  private paused = false;
  private disposed = false;
  private readonly animated: HTMLElement[];

  constructor(private readonly root: HTMLElement, private readonly clock: FrameClock) {
    this.hero = new HeroMotion(root);
    this.sections = new ScrollMotion(root);
    this.button = requiredElement(root, "[data-motion-toggle]");
    this.buttonLabel = requiredElement(root, "[data-motion-label]");
    this.animated = [...root.querySelectorAll<HTMLElement>("[data-hero], [data-animated-section], [data-process-visual]")];
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { (entry.target as HTMLElement).dataset.visible = String(entry.isIntersecting); });
      this.request();
    });
    this.resize = new ResizeObserver(() => { this.dirty = true; this.request(); });
  }

  start() {
    const { signal } = this.abort;
    this.animated.forEach((element) => {
      const rect = element.getBoundingClientRect();
      element.dataset.visible = String(rect.bottom > 0 && rect.top < window.innerHeight);
      this.observer.observe(element);
    });
    this.sections.observedElements.forEach((element) => this.resize.observe(element));
    window.addEventListener("scroll", this.request, { passive: true, signal });
    window.addEventListener("resize", this.invalidate, { passive: true, signal });
    this.root.addEventListener("pointermove", this.pointer, { passive: true, signal });
    this.root.addEventListener("pointerleave", this.leave, { passive: true, signal });
    this.root.addEventListener("click", this.navigate, { signal });
    this.button.addEventListener("click", this.toggle, { signal });
    this.preference.addEventListener("change", this.setMode, { signal });
    document.addEventListener("visibilitychange", this.visibility, { signal });
    void document.fonts.ready.then(() => { if (!this.disposed) this.invalidate(); });
    this.root.dataset.documentHidden = String(document.hidden);
    this.setMode();
    this.button.hidden = false;
  }

  private invalidate = () => { this.dirty = true; this.request(); };
  private pointer = (event: PointerEvent) => {
    const target = event.target;
    if (target instanceof Element && target.closest("[data-hero]")) { this.hero.point(event.clientX, event.clientY); this.request(); }
  };
  private leave = () => this.hero.leave();
  private toggle = () => { this.paused = !this.paused; this.setMode(); };

  private setMode = () => {
    if (this.disposed) return;
    const active = document.activeElement;
    const reading = active instanceof HTMLElement && this.root.contains(active) && active !== this.button && active !== document.body
      ? active
      : document.elementFromPoint(window.innerWidth / 2, window.innerHeight * .4)?.closest<HTMLElement>("[data-platform-card], [data-process-card], section, footer");
    const oldTop = reading?.getBoundingClientRect().top;
    const mode = this.preference.matches ? "reduced" : this.paused ? "paused" : "running";
    this.root.dataset.motion = mode;
    this.button.disabled = mode === "reduced";
    this.buttonLabel.textContent = mode === "reduced" ? "Motion reduced" : mode === "paused" ? "Resume motion" : "Pause motion";
    this.hero.reset();
    if (mode !== "running") this.sections.finishCounters();
    this.sections.measure();
    this.hero.measure();
    if (reading && oldTop !== undefined) window.scrollBy({ top: reading.getBoundingClientRect().top - oldTop, behavior: "instant" });
    this.scroll = window.scrollY;
    this.previousTime = undefined;
    this.dirty = false;
    if (mode === "running") this.request();
    else this.cancel();
  };

  private navigate = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const anchor = event.target.closest<HTMLAnchorElement>("a[href^='#']");
    const href = anchor?.getAttribute("href");
    const target = href ? document.getElementById(href.slice(1)) : null;
    if (!target || !href) return;
    event.preventDefault();
    history.pushState(null, "", href);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: this.root.dataset.motion === "running" ? "smooth" : "instant", block: "start" });
  };

  private visibility = () => {
    this.root.dataset.documentHidden = String(document.hidden);
    this.previousTime = undefined;
    if (document.hidden) this.cancel(); else this.request();
  };

  private request = () => {
    if (!this.disposed && !document.hidden && this.root.dataset.motion === "running" && this.frame === undefined) this.frame = this.clock.request(this.tick);
  };

  private tick = (time: number) => {
    this.frame = undefined;
    if (this.disposed || document.hidden || this.root.dataset.motion !== "running") return;
    const delta = this.previousTime === undefined ? 0 : Math.min(64, time - this.previousTime);
    this.previousTime = time;
    if (this.dirty) { this.sections.measure(); this.hero.measure(); this.dirty = false; }
    this.scroll = lerp(this.scroll, window.scrollY, .075);
    this.hero.render(this.scroll, delta, this.coarse.matches);
    this.sections.render(window.scrollY, delta);
    if (this.hero.visible || this.animated.some((element) => element.dataset.visible === "true") || this.sections.needsFrame || Math.abs(this.scroll - window.scrollY) > .05) this.request();
    else this.previousTime = undefined;
  };

  private cancel() {
    if (this.frame !== undefined) this.clock.cancel(this.frame);
    this.frame = undefined;
  }

  dispose() {
    this.disposed = true;
    this.cancel();
    this.abort.abort();
    this.observer.disconnect();
    this.resize.disconnect();
    this.hero.reset();
    this.sections.finishCounters();
    this.root.dataset.motion = "static";
    this.button.hidden = true;
  }
}
