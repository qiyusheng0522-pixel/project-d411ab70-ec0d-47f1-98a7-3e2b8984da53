import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { doctorTabs } from "./doctor.index";
import {
  User, Wallet, BarChart3, Settings, ChevronRight, LogOut, Bell,
  TrendingDown, HeartPulse, Activity, Award, FileCheck2, MessageSquare, Clock, CircleDollarSign,
} from "lucide-react";

export const Route = createFileRoute("/doctor/me")({ component: DoctorMe });

const workload = [
  { icon: FileCheck2, color: "text-amber-600", bg: "bg-amber-100", value: "63", label: "审核数量" },
  { icon: MessageSquare, color: "text-sky-600", bg: "bg-sky-100", value: "42", label: "沟通患者" },
  { icon: Clock, color: "text-violet-600", bg: "bg-violet-100", value: "72h", label: "在线时长" },
  { icon: CircleDollarSign, color: "text-emerald-600", bg: "bg-emerald-100", value: "¥0", label: "收益金额" },
];

const groups = [
  {
    title: "工作与数据",
    items: [
      { icon: BarChart3, label: "工作统计", sub: "本月接诊 42 · 方案 18", to: "/doctor/stats" as const },
      { icon: Wallet, label: "收益结算", sub: "本月 ¥0 · 待结算 ¥0", to: "/doctor" as const },
    ],
  },
  {
    title: "成效统计",
    items: [
      { icon: TrendingDown, label: "卒中再发风险", sub: "签约患者 12 个月 -38%", to: "/doctor/stats" as const },
      { icon: HeartPulse, label: "血压达标率", sub: "82% · 较入组提升 24%", to: "/doctor/stats" as const },
      { icon: Activity, label: "神经功能改善", sub: "康复期 mRS 均值 ↓0.8", to: "/doctor/stats" as const },
      { icon: Award, label: "患者满意度", sub: "4.9 · 近 90 天 218 条评价", to: "/doctor/stats" as const },
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

void User;


