import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { doctorTabs } from "./doctor.index";
import { User, Stethoscope, Wallet, BarChart3, Settings, ShieldCheck, ChevronRight, LogOut, BookOpen, Bell } from "lucide-react";

export const Route = createFileRoute("/doctor/me")({ component: DoctorMe });

const groups = [
  {
    title: "执业与资质",
    items: [
      { icon: Stethoscope, label: "执业信息", sub: "副主任医师 · 神经内科", to: "/doctor" as const },
      { icon: ShieldCheck, label: "实名与认证", sub: "已认证", to: "/doctor" as const },
    ],
  },
  {
    title: "工作与数据",
    items: [
      { icon: BarChart3, label: "工作统计", sub: "本月接诊 42 · 方案 18", to: "/doctor/stats" as const },
      { icon: Wallet, label: "收益结算", sub: "本月 ¥0 · 待结算 ¥0", to: "/doctor" as const },
      { icon: BookOpen, label: "科普与内容", sub: "已发布 3 篇", to: "/doctor" as const },
    ],
  },
  {
    title: "偏好设置",
    items: [
      { icon: Bell, label: "消息通知", sub: "预警 / 沟通 / 审核", to: "/doctor" as const },
      { icon: Settings, label: "系统设置", sub: "隐私 · 缓存 · 关于", to: "/doctor" as const },
    ],
  },
];

function DoctorMe() {
  return (
    <PortalShell role="doctor" title="我的" tabs={doctorTabs}>
      <section className="mx-3 mt-3 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="grid size-14 place-items-center rounded-full bg-sky-500 text-lg font-bold text-white">莫</div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-foreground">莫医生</p>
          <p className="mt-0.5 text-xs text-muted-foreground">神经内科 · 副主任医师</p>
          <p className="mt-1 text-[11px] text-muted-foreground">工号 D-10029 · 卒中随访团队</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">在岗</span>
      </section>

      <section className="mx-3 mt-3 grid grid-cols-3 divide-x divide-border rounded-2xl bg-card py-4 shadow-[var(--shadow-card)]">
        <Stat value="42" label="本月接诊" color="text-sky-600" />
        <Stat value="18" label="方案发布" color="text-amber-500" />
        <Stat value="96%" label="随访达成" color="text-emerald-600" />
      </section>

      {groups.map((g) => (
        <section key={g.title} className="mx-3 mt-3 rounded-2xl bg-card shadow-[var(--shadow-card)]">
          <p className="px-4 pt-3 text-[12px] font-semibold text-muted-foreground">{g.title}</p>
          <ul className="divide-y divide-border px-1">
            {g.items.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.label}>
                  <Link to={it.to} className="flex items-center gap-3 px-3 py-3 active:bg-muted/50">
                    <span className="grid size-9 place-items-center rounded-xl bg-sky-50 text-sky-600">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{it.label}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{it.sub}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="mx-3 my-4">
        <Link to="/" className="flex items-center justify-center gap-1.5 rounded-full bg-card py-3 text-sm font-semibold text-rose-500 shadow-[var(--shadow-card)] active:scale-[0.99]">
          <LogOut className="size-4" /> 退出登录
        </Link>
      </div>
    </PortalShell>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}

// keep User import referenced to avoid tree-shake surprises in editors
void User;