import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, MessageSquare, Star } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { doctorTabs } from "./doctor.index";

export const Route = createFileRoute("/doctor/stats")({ component: DoctorStats });

const bars = [42, 58, 65, 51, 78, 90, 84];
const days = ["周一","周二","周三","周四","周五","周六","周日"];

function DoctorStats() {
  const max = Math.max(...bars);
  return (
    <PortalShell role="doctor" title="统计" tabs={doctorTabs}>
      <section className="mx-3 mt-3 grid grid-cols-2 gap-3">
        <Card icon={Users} color="text-sky-600" bg="bg-sky-100" value="126" label="累计签约患者" delta="+12" />
        <Card icon={MessageSquare} color="text-emerald-600" bg="bg-emerald-100" value="428" label="本月互动" delta="+58" />
        <Card icon={TrendingUp} color="text-violet-600" bg="bg-violet-100" value="92%" label="随访依从率" delta="+3%" />
        <Card icon={Star} color="text-amber-500" bg="bg-amber-100" value="4.9" label="患者评分" delta="+0.1" />
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">本周随访量</p>
          <span className="text-xs text-muted-foreground">共 468 次</span>
        </div>
        <div className="mt-4 flex h-40 items-end gap-2">
          {bars.map((b, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-sky-400 to-sky-500"
                style={{ height: `${(b / max) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="mb-3 text-sm font-bold text-foreground">病种分布</p>
        <ul className="space-y-2.5 text-xs">
          {[
            { name: "缺血性卒中", n: 62, pct: 50 },
            { name: "出血性卒中", n: 18, pct: 15 },
            { name: "TIA", n: 26, pct: 21 },
            { name: "其他", n: 20, pct: 14 },
          ].map((r) => (
            <li key={r.name}>
              <div className="flex justify-between">
                <span className="text-foreground">{r.name}</span>
                <span className="text-muted-foreground">{r.n} 例 · {r.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${r.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-6" />
    </PortalShell>
  );
}

function Card({ icon: Icon, color, bg, value, label, delta }: {
  icon: React.ComponentType<{ className?: string }>; color: string; bg: string; value: string; label: string; delta: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
      <div className={`grid size-9 place-items-center rounded-xl ${bg}`}>
        <Icon className={`size-4 ${color}`} />
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[11px] font-semibold text-emerald-600">较上月 {delta}</p>
    </div>
  );
}