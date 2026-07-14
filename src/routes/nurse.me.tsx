import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut, TrendingUp, ChevronRight, BookOpen, LogOut as ExitIcon } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/me")({ component: NurseMe });

const week = [
  { d: "周一", v: 82 },
  { d: "今日", v: 96 },
  { d: "周三", v: 70 },
  { d: "周四", v: 88 },
  { d: "周五", v: 74 },
  { d: "周六", v: 60 },
  { d: "周日", v: 30 },
];

function NurseMe() {
  const max = Math.max(...week.map((w) => w.v));
  const total = 500;
  const done = 11;
  const pending = total - done;
  const rate = Math.round((done / total) * 100);

  return (
    <PortalShell role="nurse" title="我的" tabs={nurseTabs}>
      <section className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-5 text-white shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full bg-white/25 text-lg font-bold">张</div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">张宁</p>
            <p className="mt-0.5 text-xs text-white/85">护士 · 神经科卒中专病组</p>
          </div>
          <Link to="/" className="grid size-9 place-items-center rounded-full bg-white/15 active:scale-95">
            <ExitIcon className="size-4" />
          </Link>
        </div>
        <div className="mt-4 border-t border-white/25 pt-3">
          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="text-[11px] text-white/85">服务患者</p>
              <p className="mt-1 text-2xl font-extrabold">5</p>
            </div>
            <div>
              <p className="text-[11px] text-white/85">本周任务</p>
              <p className="mt-1 text-2xl font-extrabold">{total}</p>
            </div>
            <div>
              <p className="text-[11px] text-white/85">完成率</p>
              <p className="mt-1 text-2xl font-extrabold">{rate}%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <TrendingUp className="size-4 text-emerald-500" /> 本周工作量
          </p>
          <span className="text-[11px] text-muted-foreground">任务数 / 天</span>
        </div>

        <div className="mt-3 flex h-28 items-end gap-2">
          {week.map((w) => (
            <div key={w.d} className="flex flex-1 items-end justify-center">
              <div
                className={
                  "w-full rounded-t-md " +
                  (w.d === "今日" ? "bg-emerald-500" : "bg-emerald-200")
                }
                style={{ height: `${(w.v / max) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-2 border-t border-border pt-2 text-center text-[11px] text-muted-foreground">
          {week.map((w) => (
            <div key={w.d} className="flex-1">{w.d}</div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xl font-extrabold text-sky-600">{total}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">本周总任务</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-emerald-600">{done}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">已完成</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-orange-500">{pending}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">待完成</p>
          </div>
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card shadow-[var(--shadow-card)]">
        <ul className="divide-y divide-border px-1">
          <li>
            <Link to="/nurse/patients" className="flex items-center gap-3 px-3 py-3.5 active:bg-muted/50">
              <span className="grid size-8 place-items-center rounded-lg text-sky-600">
                <LogOut className="size-4" />
              </span>
              <p className="flex-1 text-sm font-semibold text-foreground">出院转交</p>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
          <li>
            <Link to="/nurse/education" className="flex items-center gap-3 px-3 py-3.5 active:bg-muted/50">
              <span className="grid size-8 place-items-center rounded-lg text-amber-600">
                <BookOpen className="size-4" />
              </span>
              <p className="flex-1 text-sm font-semibold text-foreground">宣教管理</p>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </li>
        </ul>
      </section>

      <div className="h-6" />
    </PortalShell>
  );
}
