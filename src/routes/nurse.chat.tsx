import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Search, Crown, Home } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/chat")({ component: NurseChat });

type Thread = {
  id: string;
  patient: string;
  nurse: string;
  vip: boolean;
  stage: "住院办理" | "住院准备" | "居家随访";
  status: "active" | "expired";
  last: string;
  date: string;
  conds: string[];
  issues: string[];
};

const threads: Thread[] = [
  {
    id: "1",
    patient: "陈建国",
    nurse: "张宁",
    vip: true,
    stage: "住院办理",
    status: "active",
    last: "护士,今天早上忘记服用抗凝药了,该怎么办?",
    date: "7/8",
    conds: ["高血压", "房颤"],
    issues: ["抗凝药漏服", "INR 待复查"],
  },
  {
    id: "2",
    patient: "王秀兰",
    nurse: "张宁",
    vip: true,
    stage: "住院准备",
    status: "active",
    last: "你好,入院需要带哪些既往检查资料?",
    date: "7/12",
    conds: ["出血性卒中", "高血压"],
    issues: ["血压波动", "情绪紧张"],
  },
  {
    id: "3",
    patient: "李国强",
    nurse: "张宁",
    vip: false,
    stage: "住院办理",
    status: "expired",
    last: "预约入院评估已过期,请重新预约。",
    date: "6/30",
    conds: ["TIA 后随访", "高血脂"],
    issues: ["未按时复诊", "吸烟未戒"],
  },
  {
    id: "4",
    patient: "赵美华",
    nurse: "张宁",
    vip: false,
    stage: "居家随访",
    status: "active",
    last: "吞咽训练视频看完了,饮水还是有点呛咳。",
    date: "7/13",
    conds: ["缺血性卒中恢复期", "颈动脉狭窄"],
    issues: ["吞咽障碍", "康复训练依从性"],
  },
  {
    id: "5",
    patient: "刘志明",
    nurse: "张宁",
    vip: false,
    stage: "居家随访",
    status: "expired",
    last: "3 天未上传血压记录,请及时补测。",
    date: "6/25",
    conds: ["复发高危", "房颤"],
    issues: ["血压未上传", "抗凝依从性差"],
  },
];

function NurseChat() {
  const [q, setQ] = useState("");
  const list = threads.filter(
    (t) => t.patient.includes(q) || t.nurse.includes(q) || t.last.includes(q),
  );

  return (
    <PortalShell role="nurse" title="沟通" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索患者"
          className="w-full bg-transparent text-sm outline-none"
        />
      </section>

      <ul className="mx-3 mt-3 space-y-2.5">
        {list.map((t) => {
          const dim = t.status === "expired";
          return (
            <li
              key={t.id}
              className={
                "flex items-start gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)] active:bg-muted/40 " +
                (dim ? "opacity-70" : "")
              }
            >
              <div className="relative shrink-0">
                <div
                  className={
                    "grid size-11 place-items-center rounded-full text-sm font-bold " +
                    (dim ? "bg-muted text-muted-foreground" : "bg-emerald-100 text-emerald-600")
                  }
                >
                  {t.patient.slice(0, 1)}
                </div>
                {t.vip && !dim && (
                  <Crown className="absolute -top-1.5 -right-1.5 size-4 rotate-12 fill-amber-400 text-amber-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[15px] font-bold text-foreground">{t.patient}</p>
                  {t.vip && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      VIP
                    </span>
                  )}
                  <span
                    className={
                      "flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold " +
                      (dim ? "bg-muted text-muted-foreground" : "bg-orange-100 text-orange-700")
                    }
                  >
                    <Home className="size-2.5" /> {t.stage}
                  </span>
                  <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{t.date}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t.patient}-{t.nurse}
                </p>
                <p className="mt-1 truncate text-xs text-foreground/80">{t.last}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  {t.conds.map((c) => (
                    <span key={c} className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600">
                      {c}
                    </span>
                  ))}
                  {t.issues.map((c) => (
                    <span key={c} className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] font-semibold text-orange-600">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="flex flex-col items-center gap-1 rounded-2xl bg-card p-8 text-muted-foreground shadow-[var(--shadow-card)]">
            <MessageSquare className="size-6" />
            <p className="text-xs">暂无会话</p>
          </li>
        )}
      </ul>
      <div className="h-6" />
    </PortalShell>
  );
}
