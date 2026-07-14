import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, Sparkles, Search, RefreshCw, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/followup")({ component: NurseFollowup });

const pending = [
  {
    id: "n001",
    name: "陈建国",
    disease: "缺血性卒中恢复期",
    days: "术后第 9 天",
    plan: "康复训练 · NIHSS 复评",
    priority: "重要",
    tags: ["高血压", "房颤"],
  },
  {
    id: "n004",
    name: "赵美华",
    disease: "颈动脉狭窄术后",
    days: "术后第 12 天",
    plan: "吞咽功能复评 · mRS 评分",
    priority: "常规",
    tags: ["高血压", "糖尿病"],
  },
];

const done = [
  {
    id: "n005",
    name: "刘志明",
    disease: "房颤 · 复发高危",
    days: "居家第 45 天",
    plan: "抗凝依从性回访 · 完成",
    tags: ["房颤"],
  },
];

function NurseFollowup() {
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [q, setQ] = useState("");
  const src = tab === "pending" ? pending : done;
  const list = src.filter((p) => p.name.includes(q) || p.disease.includes(q));

  return (
    <PortalShell role="nurse" title="随访管理" tabs={nurseTabs}>
      <section className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-4 text-white shadow-[var(--shadow-card)]">
        <button className="flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5 text-[13px] font-bold backdrop-blur-sm active:scale-95">
          <Sparkles className="size-4" /> 打开 AI 随访清单
        </button>
        <p className="mt-2 text-xs text-white/85">智能识别需随访患者 · 按术后天数与卒中复发风险排序</p>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">随访进度</p>
          <button className="flex items-center gap-1 text-[11px] text-sky-600 active:scale-95">
            <RefreshCw className="size-3" /> 刷新
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-extrabold text-sky-600">{pending.length}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">待随访</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-600">{done.length}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">已完成</p>
          </div>
          <div className="rounded-xl bg-muted/40 py-1">
            <p className="text-2xl font-extrabold text-foreground">2</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">出院患者</p>
          </div>
        </div>
      </section>

      <section className="mx-3 mt-3 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索患者姓名…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </section>

      <section className="mx-3 mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 p-1">
        {(["pending", "done"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={
              "rounded-xl py-2 text-sm font-bold " +
              (tab === k ? "bg-card text-foreground shadow-[var(--shadow-card)]" : "text-muted-foreground")
            }
          >
            {k === "pending" ? `待随访 (${pending.length})` : `已完成 (${done.length})`}
          </button>
        ))}
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between px-1">
          <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <Stethoscope className="size-4 text-orange-500" />
            {tab === "pending" ? "待随访患者" : "已完成随访"}
          </p>
          <span className="text-[11px] text-muted-foreground">{list.length} 人</span>
        </div>
        {list.length === 0 ? (
          <p className="py-10 text-center text-xs text-muted-foreground">暂无{tab === "pending" ? "待随访" : "已完成"}患者</p>
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {list.map((p) => (
              <li key={p.id}>
                <Link
                  to="/nurse/patients"
                  className="flex items-start gap-3 py-3 active:bg-muted/40"
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                    {p.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {"priority" in p && p.priority && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          {p.priority}
                        </span>
                      )}
                      <p className="text-[15px] font-bold text-foreground">{p.name}</p>
                      <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
                        {p.days}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                        {p.disease}
                      </span>
                      {p.tags.map((t) => (
                        <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{p.plan}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="h-6" />
    </PortalShell>
  );
}
