import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, ChevronRight } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/followup")({ component: NurseFollowup });

const list = [
  { id: "n001", name: "韩晶", disease: "糖尿病", days: "服务第 9 天", plan: "住院准备 · 术前评估", priority: "重要" },
];

function NurseFollowup() {
  return (
    <PortalShell role="nurse" title="随访" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <Stethoscope className="size-4 text-orange-500" /> 术后 / 慢病随访
        </p>
        <span className="text-[11px] text-muted-foreground">共 {list.length} 位</span>
      </section>

      <ul className="mx-3 mt-3 space-y-2.5">
        {list.map((p) => (
          <li key={p.id}>
            <Link
              to="/nurse/patients"
              className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)] active:scale-[0.99]"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                {p.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                    {p.priority}
                  </span>
                  <p className="text-[15px] font-bold text-foreground">{p.name}</p>
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
                    {p.days}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                    {p.disease}
                  </span>
                  <p className="truncate text-xs text-muted-foreground">{p.plan}</p>
                </div>
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