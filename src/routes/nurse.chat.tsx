import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/chat")({ component: NurseChat });

const threads = [
  { id: "1", name: "韩晶", last: "护士姐姐,今天空腹血糖 7.2,可以吗?", time: "10:20", unread: 0, kind: "患者" },
  { id: "2", name: "莫医生", last: "请把韩晶今日血糖趋势发我看下。", time: "09:41", unread: 0, kind: "上级医生" },
];

function NurseChat() {
  const [q, setQ] = useState("");
  const list = threads.filter((t) => t.name.includes(q) || t.last.includes(q));
  return (
    <PortalShell role="nurse" title="沟通" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索患者/上级医生"
          className="w-full bg-transparent text-sm outline-none"
        />
      </section>

      <ul className="mx-3 mt-3 divide-y divide-border rounded-2xl bg-card shadow-[var(--shadow-card)]">
        {list.map((t) => (
          <li key={t.id} className="flex items-center gap-3 p-3.5 active:bg-muted/50">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
              {t.name.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[15px] font-semibold text-foreground">{t.name}</p>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{t.kind}</span>
                <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{t.time}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.last}</p>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="flex flex-col items-center gap-1 p-8 text-muted-foreground">
            <MessageSquare className="size-6" />
            <p className="text-xs">暂无会话</p>
          </li>
        )}
      </ul>
      <div className="h-6" />
    </PortalShell>
  );
}