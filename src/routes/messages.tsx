import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Bell, Stethoscope, AlertTriangle, Gift } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/messages")({ component: Messages });

const items = [
  { icon: Stethoscope, color: "bg-sky-100 text-sky-600", title: "王主任回复了您", desc: "关于您上次的血压咨询,建议继续观察一周…", time: "10 分钟前", unread: true },
  { icon: Bell, color: "bg-emerald-100 text-emerald-600", title: "服药提醒", desc: "该服用阿司匹林肠溶片了(100mg)", time: "1 小时前", unread: true },
  { icon: AlertTriangle, color: "bg-rose-100 text-rose-600", title: "健康预警", desc: "今日血压 158/95 mmHg 偏高,请注意休息", time: "今天 08:20", unread: true },
  { icon: Gift, color: "bg-amber-100 text-amber-600", title: "系统通知", desc: "新版健康档案功能已上线,快来体验", time: "昨天", unread: false },
  { icon: Stethoscope, color: "bg-sky-100 text-sky-600", title: "复诊提醒", desc: "距您预约的复诊还有 3 天(7/12 上午)", time: "2 天前", unread: false },
];

function Messages() {
  return (
    <MobileShell>
      <header className="flex items-center gap-2 px-4 pt-5">
        <Link to="/patient" className="grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">消息中心</h1>
      </header>

      <ul className="mx-4 mt-4 space-y-2">
        {items.map((m, i) => {
          const Icon = m.icon;
          return (
            <li key={i} className="flex items-start gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <div className={`grid size-11 shrink-0 place-items-center rounded-full ${m.color}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-semibold text-foreground">{m.title}</p>
                  {m.unread && <span className="size-2 shrink-0 rounded-full bg-rose-500" />}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{m.desc}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">{m.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="h-6" />
    </MobileShell>
  );
}