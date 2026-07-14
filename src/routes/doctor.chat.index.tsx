import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Pin, Sparkles } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { doctorTabs } from "./doctor.index";
import { useState } from "react";

export const Route = createFileRoute("/doctor/chat/")({ component: DoctorChat });

const threads = [
  { id: "1", name: "张大伯", last: "医生,今天早上血压 158/96,要不要加药?", time: "10:22", unread: 2, pin: true },
  { id: "2", name: "李阿姨", last: "情绪最近有点差,晚上睡不好。", time: "09:41", unread: 0, pin: false },
  { id: "3", name: "王先生", last: "空腹血糖 7.8,饮食有点管不住。", time: "昨天", unread: 0, pin: false },
  { id: "4", name: "康复群 · 三病房", last: "护士王:今日康复训练打卡。", time: "昨天", unread: 5, pin: false },
  { id: "5", name: "赵大爷", last: "药停了两天,是不是没事?", time: "周三", unread: 0, pin: false },
];

function DoctorChat() {
  const [q, setQ] = useState("");
  const [aiAuto, setAiAuto] = useState(true);
  const list = threads.filter((t) => t.name.includes(q) || t.last.includes(q));
  return (
    <PortalShell role="doctor" title="沟通" tabs={doctorTabs}>
      <section className="mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white p-3 shadow-[var(--shadow-card)]">
        <span className="grid size-9 place-items-center rounded-xl bg-sky-100 text-sky-600">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-foreground">AI 自动回复</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">开启后 AI 会为每条患者消息生成建议回复,需您确认后发送</p>
        </div>
        <button
          onClick={() => setAiAuto((v) => !v)}
          aria-label="切换 AI 自动回复"
          className={"relative h-6 w-11 rounded-full transition-colors " + (aiAuto ? "bg-sky-500" : "bg-muted-foreground/30")}
        >
          <span className={"absolute top-0.5 size-5 rounded-full bg-white shadow transition-all " + (aiAuto ? "left-[22px]" : "left-0.5")} />
        </button>
      </section>

      <section className="mx-3 mt-3">
        <div className="flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索会话/患者"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <ul className="mx-3 mt-3 divide-y divide-border rounded-2xl bg-card shadow-[var(--shadow-card)]">
        {list.map((t) => (
          <li key={t.id}>
            <Link
              to="/doctor/chat/$id"
              params={{ id: t.id }}
              className="flex items-center gap-3 p-3.5 active:bg-muted/50"
            >
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
              {t.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {t.pin && <Pin className="size-3 text-sky-500" />}
                <p className="truncate text-[15px] font-semibold text-foreground">{t.name}</p>
                <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{t.time}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <p className="truncate text-xs text-muted-foreground">{t.last}</p>
                {t.unread > 0 && (
                  <span className="ml-auto grid size-5 shrink-0 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {t.unread}
                  </span>
                )}
              </div>
            </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="h-6" />
    </PortalShell>
  );
}