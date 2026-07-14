import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Send, Search, X, Check } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";
import { nurseList } from "./nurse.patients";

export const Route = createFileRoute("/nurse/education")({ component: NurseEducation });

const materials = [
  { id: "e1", cat: "高血压", title: "低盐饮食与家庭血压测量", tag: "监测" },
  { id: "e2", cat: "抗栓", title: "抗血小板/抗凝药服药要点", tag: "用药" },
  { id: "e3", cat: "识别", title: "FAST 法快速识别卒中先兆", tag: "识别" },
  { id: "e4", cat: "康复", title: "偏瘫肢体康复训练要点", tag: "康复" },
  { id: "e5", cat: "康复", title: "吞咽障碍进食安全指导", tag: "康复" },
  { id: "e6", cat: "心理", title: "卒中后情绪管理与睡眠改善", tag: "心理" },
  { id: "e7", cat: "用药", title: "他汀类药物依从性与副作用", tag: "用药" },
  { id: "e8", cat: "生活方式", title: "戒烟限酒与规律有氧运动", tag: "生活" },
];

const cats = ["全部", "高血压", "抗栓", "识别", "康复", "心理", "用药", "生活方式"];

type Material = (typeof materials)[number];

function NurseEducation() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("全部");
  const [pushTarget, setPushTarget] = useState<Material | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const list = materials.filter(
    (m) => (cat === "全部" || m.cat === cat) && (m.title.includes(q) || m.cat.includes(q)),
  );

  const openPush = (m: Material) => { setPushTarget(m); setPicked([]); };
  const togglePick = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const confirmPush = () => {
    if (!pushTarget || picked.length === 0) return;
    setToast(`已向 ${picked.length} 位患者推送《${pushTarget.title}》`);
    setPushTarget(null);
    setPicked([]);
    setTimeout(() => setToast(null), 2200);
  };

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
            <button
              onClick={() => openPush(m)}
              className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white active:scale-95"
            >
              <Send className="size-3" /> 推送
            </button>
          </li>
        ))}
      </ul>

      <div className="h-6" />

      {pushTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setPushTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-card p-4 shadow-[var(--shadow-card)] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-2">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                <BookOpen className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">推送宣教</p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">《{pushTarget.title}》</p>
              </div>
              <button
                onClick={() => setPushTarget(null)}
                className="grid size-8 place-items-center rounded-full active:scale-95"
                aria-label="关闭"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-3 text-[11px] font-semibold text-muted-foreground">选择患者({picked.length} / {nurseList.length})</p>
            <ul className="mt-1.5 max-h-72 space-y-1 overflow-y-auto">
              {nurseList.map((p) => {
                const on = picked.includes(p.id);
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => togglePick(p.id)}
                      className={
                        "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left active:scale-[0.99] " +
                        (on ? "bg-emerald-50" : "bg-muted/30")
                      }
                    >
                      <span
                        className={
                          "grid size-5 place-items-center rounded-md border " +
                          (on ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-card")
                        }
                      >
                        {on && <Check className="size-3.5" />}
                      </span>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                        {p.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-foreground">{p.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{p.conds.join(" · ")}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setPushTarget(null)}
                className="flex-1 rounded-full bg-muted py-2.5 text-sm font-semibold text-muted-foreground active:scale-95"
              >
                取消
              </button>
              <button
                onClick={confirmPush}
                disabled={picked.length === 0}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-emerald-500 py-2.5 text-sm font-bold text-white active:scale-95 disabled:opacity-50"
              >
                <Send className="size-4" /> 确认推送
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </PortalShell>
  );
}
