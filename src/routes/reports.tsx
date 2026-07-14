import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, FileBarChart, TrendingDown, TrendingUp, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/reports")({ component: Reports });

const metrics = [
  { label: "平均收缩压", value: "138", unit: "mmHg", trend: -4, good: true },
  { label: "平均舒张压", value: "86", unit: "mmHg", trend: -2, good: true },
  { label: "空腹血糖", value: "6.2", unit: "mmol/L", trend: 0.3, good: false },
  { label: "静息心率", value: "74", unit: "bpm", trend: -1, good: true },
];

const reports = [
  { id: "r1", title: "2026 年 7 月健康月报", date: "2026-07-01", tag: "月报", desc: "血压控制良好,建议继续当前用药方案。" },
  { id: "r2", title: "卒中康复季度评估", date: "2026-06-30", tag: "季报", desc: "运动功能较上季度提升 12%,认知稳定。" },
  { id: "r3", title: "血脂随访分析", date: "2026-06-15", tag: "专项", desc: "LDL-C 已降至 1.7 mmol/L,达到二级预防目标。" },
  { id: "r4", title: "2026 年 6 月健康月报", date: "2026-06-01", tag: "月报", desc: "整体指标平稳,睡眠质量有待改善。" },
];

function Reports() {
  return (
    <MobileShell>
      <header className="flex items-center gap-2 px-4 pt-5">
        <Link to="/patient" className="grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">我的报告</h1>
      </header>

      <section className="mx-4 mt-4 grid grid-cols-2 gap-2.5">
        {metrics.map((m) => {
          const up = m.trend > 0;
          return (
            <div key={m.label} className="rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)]">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {m.value}<span className="ml-1 text-xs font-normal text-muted-foreground">{m.unit}</span>
              </p>
              <div className={`mt-1 flex items-center gap-1 text-xs ${m.good ? "text-emerald-600" : "text-rose-600"}`}>
                {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                <span>较上月 {up ? "+" : ""}{m.trend}</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mx-4 mt-5">
        <h3 className="mb-3 px-1 text-lg font-bold text-foreground">历史报告</h3>
        <ul className="space-y-2.5">
          {reports.map((r) => (
            <li key={r.id}>
              <Link
                to="/reports/$id"
                params={{ id: r.id }}
                className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600">
                  <FileBarChart className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-semibold text-foreground">{r.title}</p>
                    <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground">{r.tag}</span>
                    <span className="shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">AI 解读</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{r.desc}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">{r.date}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <div className="h-6" />
    </MobileShell>
  );
}