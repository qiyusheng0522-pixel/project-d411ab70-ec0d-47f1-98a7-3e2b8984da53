import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Send, Search } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";

export const Route = createFileRoute("/nurse/education")({ component: NurseEducation });

const materials = [
  { id: "e1", cat: "高血压", title: "低盐饮食指导", tag: "饮食" },
  { id: "e2", cat: "高血压", title: "家庭血压测量方法", tag: "监测" },
  { id: "e3", cat: "糖尿病", title: "糖尿病饮食原则", tag: "饮食" },
  { id: "e4", cat: "糖尿病", title: "空腹与餐后 2h 血糖监测", tag: "监测" },
  { id: "e5", cat: "康复", title: "偏瘫肢体康复训练要点", tag: "康复" },
  { id: "e6", cat: "心理", title: "情绪管理与睡眠改善", tag: "心理" },
  { id: "e7", cat: "用药", title: "抗血小板药服药依从性", tag: "用药" },
  { id: "e8", cat: "生活方式", title: "戒烟限酒与运动建议", tag: "生活" },
];

const cats = ["全部", "高血压", "糖尿病", "康复", "心理", "用药", "生活方式"];

function NurseEducation() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("全部");
  const list = materials.filter(
    (m) => (cat === "全部" || m.cat === cat) && (m.title.includes(q) || m.cat.includes(q)),
  );
  return (
    <PortalShell role="nurse" title="宣教内容" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索宣教内容"
          className="w-full bg-transparent text-sm outline-none"
        />
      </section>

      <section className="mx-3 mt-3 flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={
              "shrink-0 rounded-full px-3 py-1 text-xs font-semibold " +
              (cat === c ? "bg-emerald-500 text-white" : "bg-card text-muted-foreground shadow-[var(--shadow-card)]")
            }
          >
            {c}
          </button>
        ))}
      </section>

      <ul className="mx-3 mt-3 space-y-2.5">
        {list.map((m) => (
          <li key={m.id} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)]">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
              <BookOpen className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{m.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{m.cat} · {m.tag}</p>
            </div>
            <button className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white active:scale-95">
              <Send className="size-3" /> 推送
            </button>
          </li>
        ))}
      </ul>

      <div className="h-6" />
    </PortalShell>
  );
}