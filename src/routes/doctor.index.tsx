import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, MessageSquare, ClipboardCheck, LayoutGrid, BarChart3, Wallet, ChevronRight,
  AlertTriangle, Clock, FileCheck2, HeartPulse, Pill, User,
} from "lucide-react";
import { PortalShell, StatTriple, TileCard, type PortalTab } from "@/components/PortalShell";

export const Route = createFileRoute("/doctor/")({ component: DoctorHome });

export const doctorTabs: PortalTab[] = [
  { to: "/doctor", label: "工作台", icon: LayoutGrid },
  { to: "/doctor/patients", label: "患者", icon: Users },
  { to: "/doctor/plans", label: "方案", icon: ClipboardCheck },
  { to: "/doctor/chat", label: "沟通", icon: MessageSquare },
  { to: "/doctor/me", label: "我的", icon: User },
];

function DoctorHome() {
  return (
    <PortalShell role="doctor" title="工作台" tabs={doctorTabs}>
      {/* Greeting */}
      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-xl font-bold text-foreground">莫医生,早上好</p>
        <p className="mt-1 text-sm text-muted-foreground">今日有 13 项待处理事项</p>
      </section>

      {/* Stat triple */}
      <StatTriple
        items={[
          { value: 6, label: "患者", color: "text-sky-600" },
          { value: 0, label: "未读消息", color: "text-rose-500" },
          { value: 8, label: "待审核", color: "text-amber-500" },
        ]}
      />

      {/* Tiles */}
      <section className="mx-3 mt-3 grid grid-cols-2 gap-3">
        <TileCard icon={Users} iconBg="bg-sky-100" iconColor="text-sky-600" count={6} label="患者 · 在期 5" dot to="/doctor/patients" />
        <TileCard icon={MessageSquare} iconBg="bg-emerald-100" iconColor="text-emerald-600" count={0} label="待回复 · 条未读" to="/doctor/chat" />
        <TileCard icon={ClipboardCheck} iconBg="bg-amber-100" iconColor="text-amber-600" count={8} label="方案审核 · 共 8 条" dot to="/doctor/plans" />
      </section>

      {/* Earnings */}
      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid size-6 place-items-center rounded-md bg-emerald-100 text-emerald-600">
              <Wallet className="size-4" />
            </div>
            <p className="text-sm font-bold text-foreground">7 月收益</p>
          </div>
          <p className="text-xs text-muted-foreground">已完成 0 单 · 待结算 ¥0</p>
        </div>
        <p className="mt-2 text-3xl font-bold text-emerald-600">¥0</p>
        <p className="mt-1 text-xs text-muted-foreground">已完成 0 单 · 待结算 ¥0</p>
      </section>

      {/* Quick actions */}
      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
            <Clock className="size-4 text-sky-500" /> 今日待办
          </p>
          <span className="text-[11px] text-muted-foreground">共 5 条</span>
        </div>
        <ul className="divide-y divide-border">
          {todos.map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.id}>
                <Link
                  to={t.to.path}
                  params={t.to.params}
                  className="flex items-center gap-3 py-3 active:opacity-70"
                >
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${t.bg} ${t.color}`}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{t.title}</p>
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${t.tagStyle}`}>
                        {t.tag}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.sub}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="h-6" />
    </PortalShell>
  );
}

type TodoTarget =
  | { path: "/doctor/patients/$id"; params: { id: string } }
  | { path: "/doctor/chat/$id"; params: { id: string } }
  | { path: "/doctor/plans"; params: Record<string, never> };

type Todo = {
  id: string;
  icon: typeof AlertTriangle;
  bg: string;
  color: string;
  title: string;
  sub: string;
  tag: string;
  tagStyle: string;
  to: TodoTarget;
};

const todos: Todo[] = [
  {
    id: "t1",
    icon: AlertTriangle,
    bg: "bg-rose-100", color: "text-rose-600",
    title: "张大伯 · 血压连续偏高",
    sub: "158/96 · 需线上随访",
    tag: "高危", tagStyle: "bg-rose-100 text-rose-600",
    to: { path: "/doctor/patients/$id", params: { id: "p001" } },
  },
  {
    id: "t2",
    icon: FileCheck2,
    bg: "bg-amber-100", color: "text-amber-600",
    title: "李阿姨 · 情绪干预方案待审核",
    sub: "PHQ-9 12 分,1 小时前提交",
    tag: "待审核", tagStyle: "bg-amber-100 text-amber-600",
    to: { path: "/doctor/plans", params: {} },
  },
  {
    id: "t3",
    icon: MessageSquare,
    bg: "bg-sky-100", color: "text-sky-600",
    title: "张大伯 · 未读消息",
    sub: "医生,今天早上血压 158/96…",
    tag: "沟通", tagStyle: "bg-sky-100 text-sky-600",
    to: { path: "/doctor/chat/$id", params: { id: "1" } },
  },
  {
    id: "t4",
    icon: Pill,
    bg: "bg-violet-100", color: "text-violet-600",
    title: "赵大爷 · 抗血小板恢复用药",
    sub: "自行停药 2 天,需干预",
    tag: "用药", tagStyle: "bg-violet-100 text-violet-600",
    to: { path: "/doctor/patients/$id", params: { id: "p005" } },
  },
  {
    id: "t5",
    icon: HeartPulse,
    bg: "bg-emerald-100", color: "text-emerald-600",
    title: "陈女士 · 康复训练方案确认",
    sub: "mRS 2 级,今日到期",
    tag: "随访", tagStyle: "bg-emerald-100 text-emerald-600",
    to: { path: "/doctor/patients/$id", params: { id: "p004" } },
  },
];