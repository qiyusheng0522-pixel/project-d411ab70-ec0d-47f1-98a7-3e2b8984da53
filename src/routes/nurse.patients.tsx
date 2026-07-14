import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, HeartPulse, ChevronRight } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/patients")({ component: NursePatients });

const list = [
  { id: "n001", name: "张大伯", room: "三病房 · 302", bed: "床 12", tag: "缺血性卒中 · 恢复期", risk: "danger", note: "血压偏高 · 需 10:00 服药" },
  { id: "n002", name: "李阿姨", room: "三病房 · 305", bed: "床 03", tag: "TIA 后随访", risk: "warn", note: "情绪低落 · 待心理评估" },
  { id: "n003", name: "王先生", room: "四病房 · 401", bed: "床 08", tag: "高血压 / 糖尿病", risk: "warn", note: "空腹血糖偏高" },
  { id: "n004", name: "陈女士", room: "四病房 · 402", bed: "床 05", tag: "康复期", risk: "ok", note: "各项指标平稳" },
  { id: "n005", name: "赵大爷", room: "三病房 · 301", bed: "床 09", tag: "复发高危", risk: "danger", note: "抗血小板药中断" },
  { id: "n006", name: "刘女士", room: "五病房 · 502", bed: "床 02", tag: "健康宣教", risk: "ok", note: "配合度良好" },
] as const;

const style = { danger: "bg-rose-100 text-rose-600", warn: "bg-amber-100 text-amber-600", ok: "bg-emerald-100 text-emerald-600" } as const;
const label = { danger: "高危", warn: "关注", ok: "稳定" } as const;

function NursePatients() {
  return (
    <PortalShell role="nurse" title="在管患者" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input placeholder="搜索姓名 / 床号" className="w-full bg-transparent text-sm outline-none" />
      </section>

      <section className="mx-3 mt-3 flex gap-2 overflow-x-auto pb-1">
        {["全部 18", "三病房 8", "四病房 6", "五病房 4", "高危 4"].map((c, i) => (
          <button
            key={c}
            className={
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold " +
              (i === 0 ? "bg-emerald-500 text-white" : "bg-card text-muted-foreground shadow-[var(--shadow-card)]")
            }
          >{c}</button>
        ))}
      </section>

      <ul className="mx-3 mt-3 space-y-2.5">
        {list.map((p) => (
          <li key={p.id}>
            <Link
              to="/nurse/patients/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)] active:scale-[0.99]"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                {p.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-bold text-foreground">{p.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{p.bed}</span>
                  <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style[p.risk]}`}>
                    {label[p.risk]}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.room} · {p.tag}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground/70">
                  <HeartPulse className="size-3" /> {p.note}
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

export { list as nurseList };