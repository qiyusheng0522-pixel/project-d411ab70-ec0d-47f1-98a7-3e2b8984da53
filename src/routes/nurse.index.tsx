import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, LayoutGrid, BookOpen, ChevronRight, Activity, MessageSquare,
  AlertTriangle, Stethoscope, ClipboardCheck,
} from "lucide-react";
import { PortalShell, type PortalTab } from "@/components/PortalShell";

export const Route = createFileRoute("/nurse/")({ component: NurseHome });

export const nurseTabs: PortalTab[] = [
  { to: "/nurse", label: "工作台", icon: LayoutGrid },
  { to: "/nurse/patients", label: "档案", icon: Users },
  { to: "/nurse/education", label: "宣教", icon: BookOpen },
  { to: "/nurse/chat", label: "沟通", icon: MessageSquare },
  { to: "/nurse/followup", label: "随访", icon: Stethoscope },
];

const tiles = [
  { icon: Users, iconBg: "bg-sky-100", iconColor: "text-sky-600", count: "2", unit: "在管", title: "患者档案", sub: "在管 · 社区", to: "/nurse/patients" as const, countColor: "text-sky-600" },
  { icon: BookOpen, iconBg: "bg-amber-100", iconColor: "text-amber-600", count: "0", unit: "条待推送", title: "宣教", sub: "糖尿病/甲状腺管理", to: "/nurse/education" as const, countColor: "text-amber-600" },
  { icon: MessageSquare, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", count: "0", unit: "条未读", title: "沟通", sub: "患者/上级医生", to: "/nurse/chat" as const, countColor: "text-emerald-600" },
  { icon: AlertTriangle, iconBg: "bg-rose-100", iconColor: "text-rose-600", count: "0", unit: "位异常", title: "异常", sub: "异常患者待处置", to: "/nurse/patients" as const, countColor: "text-rose-600" },
  { icon: Stethoscope, iconBg: "bg-orange-100", iconColor: "text-orange-600", count: "1", unit: "位待随访", title: "随访", sub: "术后/慢病随访", to: "/nurse/followup" as const, countColor: "text-orange-500" },
];

const todos = [
  { id: "1", priority: 1, tags: ["随访", "重要"], name: "韩晶", disease: "糖尿病", days: "服务第 9 天", note: "住院准备 · 服务第 9 天" },
];

function NurseHome() {
  return (
    <PortalShell role="nurse" title="工作台" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-base font-bold text-foreground">
          <Activity className="size-4 text-emerald-500" /> 今日待办
        </p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">共 3 项</span>
      </section>

      <section className="mx-3 mt-3 grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.title}
              to={t.to}
              className="rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)] active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <div className={`grid size-10 place-items-center rounded-xl ${t.iconBg}`}>
                  <Icon className={`size-5 ${t.iconColor}`} />
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-extrabold ${t.countColor}`}>{t.count}</p>
                  <p className="text-[10px] text-muted-foreground">{t.unit}</p>
                </div>
              </div>
              <p className="mt-3 text-[15px] font-bold text-foreground">{t.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t.sub}</p>
            </Link>
          );
        })}
      </section>

      <section className="mx-3 mt-4 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-base font-bold text-foreground">
          <ClipboardCheck className="size-4 text-emerald-500" /> 今日待办清单
        </p>
        <span className="text-[11px] text-muted-foreground">共 {todos.length} 项 · 按优先级</span>
      </section>

      <ul className="mx-3 mt-2 space-y-2">
        {todos.map((t) => (
          <li key={t.id}>
            <Link
              to="/nurse/followup"
              className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)] active:scale-[0.99]"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                {t.priority}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className={
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold " +
                        (tag === "重要"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-orange-100 text-orange-700")
                      }
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-[15px] font-bold text-foreground">{t.name}</span>
                  <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
                    {t.days}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                    {t.disease}
                  </span>
                  <p className="truncate text-xs text-muted-foreground">{t.note}</p>
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