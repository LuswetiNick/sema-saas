export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export function elapsedLabel(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  return `t+${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function formatCounter(value: number, format: string) {
  if (format === "billions") return `${(value / 1_000_000_000).toFixed(1)}B`;
  return `${Math.round(value)}${format === "ms" ? "ms" : format === "percent" ? "%" : "+"}`;
}

export function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Landing scene is missing ${selector}`);
  return element;
}
