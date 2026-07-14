import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { doctorTabs } from "./doctor.index";
import {
  User, Wallet, BarChart3, Settings, ChevronRight, LogOut, Bell,
  TrendingDown, HeartPulse, Activity, ClipboardCheck, MessageSquare, FileCheck2, Clock, Award,
} from "lucide-react";

export const Route = createFileRoute("/doctor/me")({ component: DoctorMe });

const groups = [
  {
    title: "工作与数据",
    items: [
      { icon: BarChart3, label: "工作统计", sub: "本月接诊 42 · 方案 18", to: "/doctor/stats" as const },
      { icon: Wallet, label: "收益结算", sub: "本月 ¥0 · 待结算 ¥0", to: "/doctor" as const },
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

const outcomes = [
  { icon: TrendingDown, color: "text-emerald-600", bg: "bg-emerald-100", value: "-38%", label: "卒中再发风险", sub: "签约患者 12 个月对比" },
  { icon: HeartPulse, color: "text-sky-600", bg: "bg-sky-100", value: "82%", label: "血压达标率", sub: "较入组提升 24%" },
  { icon: Activity, color: "text-violet-600", bg: "bg-violet-100", value: "mRS↓0.8", label: "神经功能改善", sub: "康复期患者均值" },
  { icon: Award, color: "text-amber-500", bg: "bg-amber-100", value: "4.9", label: "患者满意度", sub: "近 90 天 218 条评价" },
];

const workload = [
  { icon: ClipboardCheck, color: "text-sky-600", label: "本月方案", value: "18" },
  { icon: MessageSquare, color: "text-emerald-600", label: "沟通消息", value: "428" },
  { icon: FileCheck2, color: "text-amber-500", label: "报告审核", value: "63" },
  { icon: Clock, color: "text-rose-500", label: "在线时长", value: "72h" },
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

      {/* 工作量 */}
      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">本月工作量</p>
          <span className="text-[11px] text-muted-foreground">7 月 1 日 - 今日</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {workload.map((w) => {
            const Icon = w.icon;
            return (
              <div key={w.label} className="rounded-xl bg-muted/40 py-2.5 text-center">
                <Icon className={`mx-auto size-4 ${w.color}`} />
                <p className="mt-1 text-base font-bold text-foreground">{w.value}</p>
                <p className="text-[10px] text-muted-foreground">{w.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 成效统计 */}
      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">成效统计</p>
          <span className="text-[11px] text-muted-foreground">近 90 天</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {outcomes.map((o) => {
            const Icon = o.icon;
            return (
              <div key={o.label} className="rounded-xl bg-muted/40 p-3">
                <div className={`grid size-8 place-items-center rounded-lg ${o.bg}`}>
                  <Icon className={`size-4 ${o.color}`} />
                </div>
                <p className={`mt-2 text-lg font-bold ${o.color}`}>{o.value}</p>
                <p className="text-[12px] font-semibold text-foreground">{o.label}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{o.sub}</p>
              </div>
            );
          })}
        </div>
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

void User;
