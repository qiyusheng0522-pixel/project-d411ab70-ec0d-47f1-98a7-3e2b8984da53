import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Camera, ClipboardList, Activity, ChevronUp, Check, ChevronRight, X } from "lucide-react";

type Step = {
  n: number;
  to: "/records" | "/scales";
  title: string;
  desc: string;
  cta: string;
  icon: typeof Camera;
};

const STEPS: Step[] = [
  { n: 1, to: "/records", title: "拍照录入档案", desc: "用 OCR 上传出院小结", cta: "去拍照", icon: Camera },
  { n: 2, to: "/scales",  title: "填写卒中量表", desc: "完成 NIHSS 等问卷",  cta: "去填写", icon: ClipboardList },
  { n: 3, to: "/records", title: "录入我的数据", desc: "血压、血糖、心率、体温", cta: "去录入", icon: Activity },
];

const KEY = "onboarding_done";

function readDone(): Record<number, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function OnboardingPrompt() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDone(readDone());
    setMounted(true);
    const onStorage = () => setDone(readDone());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!mounted) return null;

  const current = STEPS.find((s) => !done[s.n]);
  const completed = STEPS.filter((s) => done[s.n]).length;
  const allDone = !current;

  if (allDone) return null;

  // Collapsed pill
  if (collapsed) {
    return (
      <div className="pointer-events-none sticky bottom-[80px] z-30 flex justify-center px-4 pb-2">
        <button
          onClick={() => setCollapsed(false)}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-[var(--shadow-soft)] active:scale-95"
        >
          <ChevronUp className="size-5" />
          继续下一步 · {completed}/{STEPS.length}
        </button>
      </div>
    );
  }

  const Icon = current.icon;

  return (
    <div className="pointer-events-none sticky bottom-[72px] z-30 px-3 pb-2">
      <div className="pointer-events-auto overflow-hidden rounded-3xl border-2 border-primary/30 bg-card shadow-[var(--shadow-soft)]">
        {/* Header: title + collapse */}
        <div className="flex items-center justify-between gap-3 px-5 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-primary">使用引导</span>
            <span className="text-sm text-muted-foreground">
              已完成 {completed}/{STEPS.length} 步
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(true)}
              className="grid size-9 place-items-center rounded-full text-muted-foreground active:bg-muted"
              aria-label="收起"
            >
              <ChevronUp className="size-5 rotate-180" />
            </button>
            <button
              onClick={() => {
                STEPS.forEach((s) => markStepDone(s.n as 1 | 2 | 3));
                setDone(readDone());
              }}
              className="grid size-9 place-items-center rounded-full text-muted-foreground active:bg-muted"
              aria-label="关闭引导"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-1.5 px-5">
          {STEPS.map((s) => {
            const isDone = done[s.n];
            const isCurrent = s.n === current.n;
            return (
              <div
                key={s.n}
                className={`h-2 flex-1 rounded-full ${
                  isDone ? "bg-primary" : isCurrent ? "bg-primary/40" : "bg-border"
                }`}
              />
            );
          })}
        </div>

        {/* Current step CTA — single full-width row, no truncation */}
        <Link
          to={current.to}
          onClick={() => markStepDone(current.n as 1 | 2 | 3)}
          className="mt-3 flex items-center gap-3 px-5 pb-4 active:scale-[0.99]"
        >
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            {done[current.n] ? <Check className="size-7" /> : <Icon className="size-7" strokeWidth={2} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">第 {current.n} 步 / 共 {STEPS.length} 步</p>
            <p className="text-xl font-bold leading-tight text-foreground">{current.title}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-primary px-4 py-3 text-base font-bold text-primary-foreground">
            {current.cta}
            <ChevronRight className="size-5" />
          </div>
        </Link>
      </div>
    </div>
  );
}

// Helper to mark a step done from anywhere (call then dispatch storage event)
export function markStepDone(n: 1 | 2 | 3) {
  if (typeof window === "undefined") return;
  const cur = (() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  })();
  if (cur[n]) return;
  cur[n] = true;
  localStorage.setItem(KEY, JSON.stringify(cur));
  window.dispatchEvent(new StorageEvent("storage", { key: KEY }));
}