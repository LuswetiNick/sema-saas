import { initialRuns, sampleDurations, sampleRoutes, sampleSubjects } from "./content";
import { clamp, elapsedLabel, lerp, requiredElement } from "./motion-math";

export class HeroMotion {
  private readonly hero: HTMLElement;
  private readonly stage: HTMLElement;
  private readonly rig: HTMLElement;
  private readonly artwork: HTMLElement;
  private readonly veil: HTMLElement;
  private readonly glare: HTMLElement;
  private readonly nodes: HTMLElement[];
  private readonly layers: { element: HTMLElement; depth: number; x: number; y: number }[];
  private readonly rows: HTMLElement[];
  private readonly chip: HTMLElement;
  private bounds = { left: 0, top: 0, width: 1, height: 1 };
  private target = { x: 0, y: 0 };
  private cursor = { x: 0, y: 0 };
  private idle = 90;
  private activeTime = 0;
  private completed = 0;
  private activeNode = -1;
  private runs: { id: number; subject: string; duration: number; elapsed: string }[] = [...initialRuns];

  constructor(private readonly root: HTMLElement) {
    this.hero = requiredElement(root, "[data-hero]");
    this.stage = requiredElement(root, "[data-stage]");
    this.rig = requiredElement(root, "[data-rig]");
    this.artwork = requiredElement(root, "[data-background-artwork]");
    this.veil = requiredElement(root, "[data-veil]");
    this.glare = requiredElement(root, "[data-glare]");
    this.nodes = [...root.querySelectorAll<HTMLElement>("[data-flow-node]")];
    this.layers = [...root.querySelectorAll<HTMLElement>("[data-layer]")].map((element) => ({ element, depth: Number(element.dataset.depth), x: 0, y: 0 }));
    this.rows = [...root.querySelectorAll<HTMLElement>("[data-run-list] > div")];
    this.chip = requiredElement(root, "[data-chip-duration]");
  }

  get visible() { return this.hero.dataset.visible === "true"; }

  measure() {
    const rect = this.stage.getBoundingClientRect();
    this.bounds = { left: rect.left, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
  }

  point(clientX: number, clientY: number) {
    this.target.x = clamp((clientX - this.bounds.left) / this.bounds.width * 2 - 1, -1, 1);
    this.target.y = clamp((clientY - this.bounds.top + window.scrollY) / this.bounds.height * 2 - 1, -1, 1);
    this.idle = 0;
  }

  leave() { this.idle = 90; }

  render(scroll: number, delta: number, coarse: boolean) {
    const height = Math.max(1, window.innerHeight);
    const heroScroll = clamp(scroll / height);
    this.artwork.style.transform = `translate3d(${Math.sin(scroll / 700) * 7 + Math.sin(scroll / 1900) * 3}vw,${Math.sin(scroll / 1300) * -2}vh,0) scale(${1.02 + Math.abs(Math.sin(scroll / 1600)) * .04}) rotate(${Math.sin(scroll / 1100) * -1.2}deg)`;
    this.artwork.style.opacity = String(.6 * (1 - heroScroll * .6));
    this.veil.style.opacity = String(clamp((scroll - height * .12) / (height * .45)) * .97);
    if (!this.visible) return;
    this.activeTime += delta;
    this.idle += 1;
    const x = this.idle >= 90 || coarse ? Math.sin(this.activeTime / 2800) * .3 : this.target.x;
    const y = this.idle >= 90 || coarse ? Math.cos(this.activeTime / 3300) * .2 : this.target.y;
    this.cursor.x = lerp(this.cursor.x, x, .07);
    this.cursor.y = lerp(this.cursor.y, y, .07);
    this.rig.style.transform = `rotateY(${-16 * (1 - heroScroll * .5) + this.cursor.x * 13}deg) rotateX(${7 - this.cursor.y * 9}deg) translateY(${heroScroll * -40}px)`;
    this.layers.forEach((layer, i) => {
      layer.x = lerp(layer.x, this.cursor.x, .06 + i * .025);
      layer.y = lerp(layer.y, this.cursor.y, .06 + i * .025);
      const k = layer.depth / 100;
      layer.element.style.transform = `translate3d(${layer.x * k * 40}px,${layer.y * k * 30}px,${layer.depth}px)`;
    });
    this.nodes.forEach((node, i) => {
      node.style.setProperty("--px", `${this.cursor.x * (16 + i * 4)}px`);
      node.style.setProperty("--py", `${this.cursor.y * (12 + i * 3)}px`);
    });
    this.glare.style.setProperty("--glare-x", `${(this.cursor.x + 1) * 50}%`);
    this.glare.style.setProperty("--glare-y", `${(this.cursor.y + 1) * 50}%`);
    const routeCount = Math.floor(this.activeTime / 2700);
    if (routeCount > this.completed) {
      const index = this.completed;
      this.runs.unshift({ id: 4410 + index, subject: sampleSubjects[index % sampleSubjects.length], duration: sampleDurations[index % sampleDurations.length], elapsed: elapsedLabel(this.activeTime) });
      this.runs = this.runs.slice(0, 3);
      this.rows.forEach((row, i) => {
        const run = this.runs[i];
        requiredElement(row, "[data-run-time]").textContent = run.elapsed;
        requiredElement(row, "[data-run-subject]").textContent = `#${run.id} ${run.subject}`;
        requiredElement(row, "[data-run-duration]").textContent = `${run.duration}ms ✓`;
      });
      this.completed = routeCount;
      this.chip.textContent = String(sampleDurations[this.completed % sampleDurations.length]);
    }
    const nodeIndex = sampleRoutes[this.completed % 2][Math.floor(this.activeTime / 900) % 3];
    if (this.activeNode !== nodeIndex) {
      this.nodes.forEach((node, i) => { node.dataset.active = String(i === nodeIndex); });
      this.activeNode = nodeIndex;
    }
  }

  reset() {
    [this.rig, this.artwork, this.veil, ...this.layers.map((layer) => layer.element)].forEach((element) => { element.style.removeProperty("transform"); element.style.removeProperty("opacity"); });
    this.nodes.forEach((node) => { node.style.removeProperty("--px"); node.style.removeProperty("--py"); });
  }
}
