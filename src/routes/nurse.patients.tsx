import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Crown, MessageSquare, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/patients")({ component: NursePatients });

type Stage = "待入院" | "院中" | "待出院" | "院外";

const list = [
  {
    id: "n001",
    name: "陈建国",
    age: 65,
    stage: "院中" as Stage,
    vip: true,
    conds: ["高血压", "房颤"],
    reason: "遗漏抗凝药,建议 10:00 补服并复测 INR",
    days: "第 7 天",
    createdAt: "2026-07-08 00:00",
  },
  {
    id: "n002",
    name: "王秀兰",
    age: 58,
    stage: "院中" as Stage,
    vip: true,
    conds: ["出血性卒中", "高血压"],
    reason: "血压 168/98 mmHg · 需复测并通知医生",
    days: "第 3 天",
    createdAt: "2026-07-12 00:00",
  },
  {
    id: "n003",
    name: "李国强",
    age: 72,
    stage: "待入院" as Stage,
    vip: false,
    conds: ["TIA 后随访", "高血脂", "吸烟"],
    reason: "预约入院评估,完善颈动脉超声",
    days: "第 1 天",
    createdAt: "2026-07-14 00:00",
  },
  {
    id: "n004",
    name: "赵美华",
    age: 61,
    stage: "待出院" as Stage,
    vip: false,
    conds: ["缺血性卒中恢复期", "颈动脉狭窄"],
    reason: "出院前 mRS 评分与吞咽功能复评",
    days: "第 12 天",
    createdAt: "2026-07-03 00:00",
  },
  {
    id: "n005",
    name: "刘志明",
    age: 68,
    stage: "院外" as Stage,
    vip: false,
    conds: ["复发高危", "房颤"],
    reason: "居家抗凝随访 · 3 天未上传血压",
    days: "第 45 天",
    createdAt: "2026-05-31 00:00",
  },
] as const;

const stageStyle: Record<Stage, string> = {
  待入院: "bg-slate-100 text-slate-600",
  院中: "bg-amber-100 text-amber-700",
  待出院: "bg-sky-100 text-sky-700",
  院外: "bg-emerald-100 text-emerald-700",
};

function NursePatients() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<Stage | "全部">("全部");
  const [cond, setCond] = useState<string>("全部");

  const filtered = list.filter(
    (p) =>
      (stage === "全部" || p.stage === stage) &&
      (cond === "全部" || p.conds.includes(cond)) &&
      (p.name.includes(q) || p.conds.some((c) => c.includes(q))),
  );

  const count = (s: Stage) => list.filter((p) => p.stage === s).length;
  const stageTabs: Array<{ key: Stage | "全部"; label: string; n: number }> = [
    { key: "全部", label: "全部", n: list.length },
    { key: "待入院", label: "待入院", n: count("待入院") },
    { key: "院中", label: "院中", n: count("院中") },
    { key: "待出院", label: "待出院", n: count("待出院") },
    { key: "院外", label: "院外", n: count("院外") },
  ];

  const conds = ["全部", "高血压", "房颤", "出血性卒中", "TIA 后随访", "颈动脉狭窄", "复发高危"];

  return (
    <PortalShell role="nurse" title="患者管理" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索患者姓名"
          className="w-full bg-transparent text-sm outline-none"
        />
      </section>

      <section className="mx-3 mt-3 flex gap-2 overflow-x-auto pb-1">
        {stageTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setStage(t.key)}
            className={
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold " +
              (stage === t.key
                ? "bg-sky-500 text-white"
                : "bg-card text-muted-foreground shadow-[var(--shadow-card)]")
            }
          >
            {t.label} <span className="opacity-70">{t.n}</span>
          </button>
        ))}
      </section>

      <section className="mx-3 mt-2 flex gap-2 overflow-x-auto pb-1">
        {conds.map((c) => (
          <button
            key={c}
            onClick={() => setCond(c)}
            className={
              "shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold " +
              (cond === c
                ? "border border-sky-400 bg-sky-50 text-sky-600"
                : "bg-card text-muted-foreground shadow-[var(--shadow-card)]")
            }
          >
            {c}
          </button>
        ))}
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-bold text-foreground">患者列表</p>
          <span className="text-[11px] text-muted-foreground">{filtered.length} 位</span>
        </div>
        <ul className="mt-2 divide-y divide-border">
          {filtered.map((p) => (
            <li key={p.id}>
              <Link
                to="/nurse/patients/$id"
                params={{ id: p.id }}
                className="flex items-start gap-3 py-3 active:bg-muted/40"
              >
                <div className="relative shrink-0">
                  <div className="grid size-11 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                    {p.name.slice(0, 1)}
                  </div>
                  {p.vip && (
                    <Crown className="absolute -top-1.5 -right-1.5 size-4 rotate-12 fill-amber-400 text-amber-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[15px] font-bold text-foreground">{p.name}</p>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${stageStyle[p.stage]}`}>
                      {p.stage}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {p.conds.map((c) => (
                      <span key={c} className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 rounded bg-rose-50/60 px-1.5 py-1 text-[11px] text-rose-700/80">
                    {p.reason}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full bg-sky-50 px-1.5 py-0.5 font-semibold text-sky-600">
                      {p.days}
                    </span>
                    <span className="flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5">
                      <MessageSquare className="size-3" /> 沟通
                    </span>
                    <span className="ml-auto flex items-center gap-0.5">
                      <Clock className="size-3" /> 创建于 {p.createdAt}
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 shrink-0 self-center text-muted-foreground" />
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-8 text-center text-xs text-muted-foreground">暂无匹配患者</li>
          )}
        </ul>
      </section>

      <div className="h-6" />
    </PortalShell>
  );
}

export { list as nurseList };
