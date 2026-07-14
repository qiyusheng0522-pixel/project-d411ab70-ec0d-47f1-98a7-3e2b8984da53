export type ScaleStatus = { score: number; level: string; date: string };

const key = (id: string) => `scale_done_${id}`;

export function saveScaleResult(id: string, score: number, level: string) {
  if (typeof window === "undefined") return;
  const payload: ScaleStatus = { score, level, date: new Date().toISOString() };
  localStorage.setItem(key(id), JSON.stringify(payload));
  window.dispatchEvent(new StorageEvent("storage", { key: key(id) }));
}

export function readScaleResult(id: string): ScaleStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(id));
    return raw ? (JSON.parse(raw) as ScaleStatus) : null;
  } catch {
    return null;
  }
}

export function readAllScaleResults(ids: string[]): Record<string, ScaleStatus | null> {
  const out: Record<string, ScaleStatus | null> = {};
  for (const id of ids) out[id] = readScaleResult(id);
  return out;
}