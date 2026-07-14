import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, CheckCircle2, Circle, Droplet, Pill, Activity, Utensils, Moon } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/tasks")({ component: Tasks });

type Task = { id: string; title: string; time: string; desc: string; icon: typeof Droplet; tint: string };
const initial: Task[] = [
  { id: "bp-am", title: "晨起测量血压", time: "07:00", desc: "起床后静坐 5 分钟再测量", icon: Droplet, tint: "bg-rose-100 text-rose-600" },
  { id: "med-am", title: "服用降压药", time: "08:00", desc: "苯磺酸氨氯地平 5mg", icon: Pill, tint: "bg-sky-100 text-sky-600" },
  { id: "walk", title: "康复步行训练", time: "10:00", desc: "散步 20 分钟,家属陪同", icon: Activity, tint: "bg-emerald-100 text-emerald-600" },
  { id: "meal", title: "记录午餐饮食", time: "12:30", desc: "参考低盐低脂食谱", icon: Utensils, tint: "bg-amber-100 text-amber-600" },
  { id: "med-pm", title: "服用他汀类药物", time: "20:00", desc: "阿托伐他汀 20mg,晚餐后", icon: Pill, tint: "bg-sky-100 text-sky-600" },
  { id: "bp-pm", title: "睡前测量血压", time: "21:30", desc: "记录当日晚间血压值", icon: Droplet, tint: "bg-rose-100 text-rose-600" },
  { id: "sleep", title: "规律作息入睡", time: "22:30", desc: "保证 7-8 小时睡眠", icon: Moon, tint: "bg-violet-100 text-violet-600" },
];

function Tasks() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const count = Object.values(done).filter(Boolean).length;

  return (
    <MobileShell>
      <header className="flex items-center gap-2 px-4 pt-5">
        <Link to="/patient" className="grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">今日任务</h1>
      </header>

      <section className="mx-4 mt-4 rounded-2xl p-4 text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-primary)" }}>
        <p className="text-sm opacity-90">今日进度</p>
        <p className="mt-1 text-3xl font-bold">{count} / {initial.length}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${(count / initial.length) * 100}%` }} />
        </div>
      </section>

      <ul className="mx-4 mt-4 space-y-2">
        {initial.map((t) => {
          const Icon = t.icon;
          const isDone = !!done[t.id];
          return (
            <li key={t.id}>
              <button
                onClick={() => toggle(t.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-[var(--shadow-card)] active:scale-[0.99]"
              >
                <div className={`grid size-11 shrink-0 place-items-center rounded-xl ${t.tint}`}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-[15px] font-semibold ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{t.title}</p>
                    <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground">{t.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.desc}</p>
                </div>
                {isDone ? <CheckCircle2 className="size-6 shrink-0 text-primary" /> : <Circle className="size-6 shrink-0 text-muted-foreground" />}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="h-6" />
    </MobileShell>
  );
}