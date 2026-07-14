import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Filter, ChevronRight, HeartPulse } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { doctorTabs } from "./doctor.index";
import { useState } from "react";

export const Route = createFileRoute("/doctor/patients/")({ component: DoctorPatients });

export const patients = [
  { id: "p001", name: "张大伯", age: 68, gender: "男", tag: "缺血性卒中", risk: "danger", last: "2 小时前", note: "血压 158/96,连续 3 天偏高" },
  { id: "p002", name: "李阿姨", age: 62, gender: "女", tag: "TIA 后随访", risk: "warn", last: "今日 10:20", note: "PHQ-9 抑郁筛查 12 分" },
  { id: "p003", name: "王先生", age: 55, gender: "男", tag: "颈动脉狭窄 · 高血压", risk: "warn", last: "昨天", note: "颈动脉狭窄 60%,LDL-C 3.4" },
  { id: "p004", name: "陈女士", age: 71, gender: "女", tag: "康复期", risk: "ok", last: "3 天前", note: "mRS 2 级,进展稳定" },
  { id: "p005", name: "赵大爷", age: 74, gender: "男", tag: "复发高危", risk: "danger", last: "4 天前", note: "自行停用抗血小板药" },
  { id: "p006", name: "刘女士", age: 58, gender: "女", tag: "健康宣教", risk: "ok", last: "上周", note: "各项指标平稳" },
] as const;

const riskStyle = {
  danger: "bg-rose-100 text-rose-600",
  warn: "bg-amber-100 text-amber-600",
  ok: "bg-emerald-100 text-emerald-600",
} as const;
const riskLabel = { danger: "高危", warn: "关注", ok: "稳定" } as const;

function DoctorPatients() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "danger" | "warn" | "ok" | "today">("all");
  const counts = {
    all: patients.length,
    danger: patients.filter((p) => p.risk === "danger").length,
    warn: patients.filter((p) => p.risk === "warn").length,
    ok: patients.filter((p) => p.risk === "ok").length,
  };
  const chips: { key: typeof tab; label: string }[] = [
    { key: "all", label: `全部 ${counts.all}` },
    { key: "danger", label: `高危 ${counts.danger}` },
    { key: "warn", label: `关注 ${counts.warn}` },
    { key: "ok", label: `稳定 ${counts.ok}` },
    { key: "today", label: "今日随访" },
  ];
  const filtered = patients.filter((p) => {
    if (tab === "today") { if (!/小时前|今日/.test(p.last)) return false; }
    else if (tab !== "all" && p.risk !== tab) return false;
    if (!q) return true;
    return p.name.includes(q) || p.id.includes(q) || p.tag.includes(q);
  });
  return (
    <PortalShell role="doctor" title="我的患者" tabs={doctorTabs}>
      <section className="mx-3 mt-3 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索姓名/编号/标签"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <button className="grid size-10 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <Filter className="size-4 text-muted-foreground" />
        </button>
      </section>

      <section className="mx-3 mt-3 flex gap-2 overflow-x-auto pb-1">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setTab(c.key)}
            className={
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold " +
              (tab === c.key ? "bg-sky-500 text-white" : "bg-card text-muted-foreground shadow-[var(--shadow-card)]")
            }
          >
            {c.label}
          </button>
        ))}
      </section>

      <ul className="mx-3 mt-3 space-y-2.5">
        {filtered.length === 0 && (
          <li className="rounded-2xl bg-card p-6 text-center text-xs text-muted-foreground shadow-[var(--shadow-card)]">
            未找到匹配的患者
          </li>
        )}
        {filtered.map((p) => (
          <li key={p.id}>
            <Link
              to="/doctor/patients/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)] active:scale-[0.99]"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600 text-sm font-bold">
                {p.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-bold text-foreground">{p.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{p.gender} · {p.age}</span>
                  <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskStyle[p.risk]}`}>
                    {riskLabel[p.risk]}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.tag} · {p.note}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                  <HeartPulse className="size-3" /> 最近沟通 {p.last}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="h-6" />
    </PortalShell>
  );
}