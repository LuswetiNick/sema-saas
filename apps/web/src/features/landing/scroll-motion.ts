import { clamp, formatCounter, requiredElement } from "./motion-math";

type CardGeometry = { element: HTMLElement; shade: HTMLElement; top: number; height: number };

export class ScrollMotion {
  private readonly platform: HTMLElement;
  private readonly viewport: HTMLElement;
  private readonly track: HTMLElement;
  private readonly progress: HTMLElement;
  private readonly processList: HTMLElement;
  private readonly cards: CardGeometry[];
  private readonly reveal: HTMLElement;
  private readonly words: HTMLElement[];
  private readonly metrics: HTMLElement;
  private readonly counters: HTMLElement[];
  private readonly marquee: HTMLElement;
  private readonly examples: HTMLElement;
  private readonly gauge: HTMLElement;
  private readonly gaugeArc: SVGElement;
  private readonly gaugeValue: SVGElement;
  private distance = 0;
  private platformTop = 0;
  private revealTop = 0;
  private revealDistance = 1;
  private lit = -1;
  private counterTime = 0;
  private countersStarted = false;
  private countersDone = false;
  private marqueeTime = 0;
  private marqueeWidth = 1;
  private gaugeTime = 0;

  constructor(private readonly root: HTMLElement) {
    this.platform = requiredElement(root, "[data-platform]");
    this.viewport = requiredElement(root, "[data-platform-viewport]");
    this.track = requiredElement(root, "[data-platform-track]");
    this.progress = requiredElement(root, "[data-platform-progress]");
    this.processList = requiredElement(root, "[data-process] ol");
    this.cards = [...root.querySelectorAll<HTMLElement>("[data-process-card]")].map((element) => ({ element, shade: requiredElement(element, "[data-stack-shade]"), top: 0, height: 1 }));
    this.reveal = requiredElement(root, "[data-reveal]");
    this.words = [...root.querySelectorAll<HTMLElement>("[data-reveal-word]")];
    this.metrics = requiredElement(root, "[data-metrics]");
    this.counters = [...root.querySelectorAll<HTMLElement>("[data-counter]")];
    this.marquee = requiredElement(root, "[data-marquee]");
    this.examples = requiredElement(root, "#examples");
    this.gaugeArc = requiredElement(root, "[data-gauge-arc]");
    this.gaugeValue = requiredElement(root, "[data-gauge-value]");
    this.gauge = requiredElement(this.gaugeArc.closest("[data-process-card]")!, "[data-process-visual]");
  }

  get observedElements() { return [this.viewport, this.track, this.processList]; }
  get needsFrame() { return this.metrics.dataset.visible === "true" && this.countersStarted && !this.countersDone; }

  measure() {
    const running = this.root.dataset.motion === "running";
    this.distance = Math.max(0, this.track.scrollWidth - this.viewport.clientWidth);
    this.platform.style.setProperty("--platform-height", `${window.innerHeight + this.distance}px`);
    this.platformTop = this.platform.getBoundingClientRect().top + window.scrollY;
    this.revealTop = this.reveal.getBoundingClientRect().top + window.scrollY;
    this.revealDistance = Math.max(1, this.reveal.offsetHeight - window.innerHeight);
    const style = getComputedStyle(this.processList);
    let top = this.processList.getBoundingClientRect().top + window.scrollY + parseFloat(style.paddingTop);
    const gap = parseFloat(style.rowGap) || 0;
    this.cards.forEach((card) => { card.top = top; card.height = card.element.offsetHeight; top += card.height + gap; });
    this.marqueeWidth = this.marquee.firstElementChild?.getBoundingClientRect().width || 1;
    if (!running) this.reset();
  }

  render(scroll: number, delta: number) {
    const progress = this.distance > 0 ? clamp((scroll - this.platformTop) / this.distance) : 0;
    this.track.style.transform = `translate3d(${-progress * this.distance}px,0,0)`;
    this.progress.style.transform = `scaleX(${progress})`;
    this.cards.forEach((card, i) => {
      let covered = 0;
      let arrival = 0;
      for (let j = i + 1; j < this.cards.length; j += 1) {
        const next = this.cards[j];
        const stickyTop = window.innerHeight * .13 + j * 20;
        const p = clamp((scroll + window.innerHeight - next.top) / Math.max(1, window.innerHeight - stickyTop));
        if (p > 0) { covered = j - i; arrival = p; }
      }
      card.element.style.transform = `scale(${1 - arrival * .035 * covered})`;
      card.shade.style.opacity = String(.55 * arrival);
    });
    const lit = Math.min(this.words.length, Math.floor(clamp((scroll - this.revealTop) / this.revealDistance) * this.words.length * 1.15));
    if (lit !== this.lit) {
      this.words.forEach((word, i) => word.style.setProperty("--word-opacity", i < lit ? "1" : ".12"));
      this.lit = lit;
    }
    if (this.examples.dataset.visible === "true") {
      this.marqueeTime += delta;
      this.marquee.style.transform = `translate3d(${-((this.marqueeTime / 40000) % 1) * this.marqueeWidth}px,0,0)`;
    }
    if (this.metrics.dataset.visible === "true" && !this.countersDone) {
      this.countersStarted = true;
      this.counterTime += delta;
      const progress = clamp(this.counterTime / 1600);
      this.counters.forEach((counter) => {
        counter.textContent = progress === 1 ? counter.dataset.final! : formatCounter(Number(counter.dataset.target) * (1 - (1 - progress) ** 3), counter.dataset.format!);
      });
      this.countersDone = progress === 1;
    }
    if (this.gauge.dataset.visible === "true" && this.gaugeTime < 1600) {
      this.gaugeTime += delta;
      const value = 72 * (1 - (1 - clamp(this.gaugeTime / 1600)) ** 3);
      this.gaugeValue.textContent = `${Math.round(value)}%`;
      this.gaugeArc.style.strokeDasharray = `${value} 100`;
    }
  }

  reset() {
    this.track.style.removeProperty("transform");
    this.marquee.style.removeProperty("transform");
    this.cards.forEach((card) => { card.element.style.removeProperty("transform"); card.shade.style.removeProperty("opacity"); });
    this.words.forEach((word) => word.style.removeProperty("--word-opacity"));
    this.lit = -1;
    this.gaugeValue.textContent = "72%";
    this.gaugeArc.style.removeProperty("stroke-dasharray");
  }

  finishCounters() {
    this.counters.forEach((counter) => { counter.textContent = counter.dataset.final!; });
    this.countersDone = true;
    this.gaugeTime = 1600;
    this.reset();
  }
}
