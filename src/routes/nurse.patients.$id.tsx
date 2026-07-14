import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, NotebookPen, BookOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { nurseList } from "./nurse.patients";

export const Route = createFileRoute("/nurse/patients/$id")({ component: NursePatientDetail });

type Note = { id: string; time: string; author: string; text: string };

const seed: Note[] = [
  { id: "1", time: "今天 08:20", author: "李护士", text: "晨起血压 148/92,已提醒按时服药,情绪平稳。" },
  { id: "2", time: "今天 10:05", author: "李护士", text: "完成低盐饮食宣教,家属配合度良好。" },
  { id: "3", time: "昨天 20:10", author: "王护士", text: "睡前测量血压 138/86,夜间无不适。" },
];

function NursePatientDetail() {
  const { id } = Route.useParams();
  const p = nurseList.find((x) => x.id === id) ?? nurseList[0];
  const [notes, setNotes] = useState<Note[]>(seed);
  const [draft, setDraft] = useState("");

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = `今天 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setNotes((n) => [{ id: crypto.randomUUID(), time, author: "李护士", text }, ...n]);
    setDraft("");
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card px-3 py-3">
        <Link to="/nurse/patients" className="grid size-9 place-items-center rounded-full active:scale-95">
          <ChevronLeft className="size-5" />
        </Link>
        <p className="text-base font-bold">日常护理备注</p>
      </header>

      <section className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-400 p-4 text-white shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full bg-white/20 text-xl font-bold">
            {p.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">{p.name}</p>
            <p className="text-xs opacity-90">{p.age} 岁 · {p.stage}</p>
            <p className="mt-1 text-xs opacity-90">{p.conds.join(" / ")}</p>
          </div>
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <NotebookPen className="size-4 text-emerald-600" /> 新增护理备注
        </p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="记录患者今日状态、饮食、情绪、依从性等…"
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-3 text-[13px] leading-relaxed text-foreground outline-none focus:border-emerald-400"
        />
        <div className="mt-2 flex gap-2">
          {["血压偏高已提醒服药", "情绪平稳", "饮食清淡配合良好", "康复训练已完成"].map((s) => (
            <button
              key={s}
              onClick={() => setDraft((d) => (d ? d + " · " + s : s))}
              className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700 active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={addNote}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 py-2.5 text-sm font-bold text-white active:scale-[0.99]"
        >
          <Plus className="size-4" /> 保存备注
        </button>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">历史备注</p>
        <ul className="mt-2 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-border/60 p-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-semibold text-emerald-700">{n.author}</span>
                <span>{n.time}</span>
                <button
                  onClick={() => setNotes((arr) => arr.filter((x) => x.id !== n.id))}
                  className="ml-auto text-muted-foreground/70 active:text-rose-500"
                  aria-label="删除"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{n.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <Link
        to="/nurse/education"
        className="mx-3 mt-3 mb-6 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
          <BookOpen className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">推送宣教内容</p>
          <p className="mt-0.5 text-xs text-muted-foreground">从宣教库选择内容发送给 {p.name}</p>
        </div>
      </Link>
    </div>
  );
}