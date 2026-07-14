import { createFileRoute } from "@tanstack/react-router";
import { Send, X, Check, ChevronRight, Eye, Activity, HeartPulse, Bell } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "@/components/PortalShell";
import { nurseTabs } from "./nurse.index";
import { nurseList } from "./nurse.patients";

export const Route = createFileRoute("/nurse/education")({ component: NurseEducation });

type Material = {
  id: string;
  cat: string;
  stage: "住院准备" | "住院期间" | "出院准备" | "居家康复";
  title: string;
  views: number;
  cover: string;
  pending?: boolean;
};

const materials: Material[] = [
  { id: "e1", cat: "卒中识别", stage: "住院准备", title: "FAST 法:一分钟识别卒中先兆", views: 268, cover: "from-rose-300 to-orange-200", pending: true },
  { id: "e2", cat: "急救转运", stage: "住院准备", title: "疑似卒中,拨打 120 前你要做的 5 件事", views: 154, cover: "from-red-300 to-rose-200" },
  { id: "e3", cat: "溶栓治疗", stage: "住院期间", title: "静脉溶栓的黄金 4.5 小时", views: 312, cover: "from-blue-300 to-sky-200" },
  { id: "e4", cat: "监护要点", stage: "住院期间", title: "卒中急性期血压与神经监测", views: 189, cover: "from-indigo-300 to-blue-200" },
  { id: "e5", cat: "并发症", stage: "住院期间", title: "预防深静脉血栓与坠积性肺炎", views: 142, cover: "from-purple-300 to-violet-200" },
  { id: "e6", cat: "康复训练", stage: "出院准备", title: "偏瘫肢体良肢位摆放与被动活动", views: 221, cover: "from-emerald-300 to-teal-200" },
  { id: "e7", cat: "吞咽指导", stage: "出院准备", title: "吞咽障碍进食安全 5 要点", views: 176, cover: "from-teal-300 to-cyan-200" },
  { id: "e8", cat: "用药管理", stage: "出院准备", title: "抗血小板与他汀:出院带药须知", views: 205, cover: "from-violet-300 to-purple-200" },
  { id: "e9", cat: "居家康复", stage: "居家康复", title: "居家步行与平衡训练循序渐进", views: 133, cover: "from-lime-300 to-emerald-200" },
  { id: "e10", cat: "血压监测", stage: "居家康复", title: "家庭血压自测与低盐饮食", views: 168, cover: "from-sky-300 to-blue-200" },
  { id: "e11", cat: "心理支持", stage: "居家康复", title: "卒中后抑郁识别与情绪调节", views: 121, cover: "from-pink-300 to-rose-200" },
  { id: "e12", cat: "复发预防", stage: "居家康复", title: "二级预防:如何避免卒中复发", views: 254, cover: "from-amber-300 to-orange-200" },
];

const stages: Material["stage"][] = ["住院准备", "住院期间", "出院准备", "居家康复"];
const tabs = ["待办", "推送", "监控"] as const;

function NurseEducation() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("待办");
  const [pushTarget, setPushTarget] = useState<Material | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const pendingCount = materials.filter((m) => m.pending).length;

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
    <PortalShell role="nurse" title="宣教管理" tabs={nurseTabs}>
      <section className="mx-3 mt-3 flex items-center gap-1 rounded-full bg-card p-1 shadow-[var(--shadow-card)]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "flex-1 rounded-full py-2 text-xs font-bold transition " +
              (tab === t ? "bg-emerald-500 text-white shadow" : "text-muted-foreground")
            }
          >
            {t}
          </button>
        ))}
      </section>

      {tab === "待办" && (
        <>
          <section className="mx-3 mt-3 flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)]">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">宣教待办</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">按住院阶段标签分组</p>
            </div>
            <span className="shrink-0 whitespace-nowrap rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white">
              {pendingCount} 待办
            </span>
          </section>

          {stages.map((s) => {
            const items = materials.filter((m) => m.stage === s && m.pending);
            if (items.length === 0) return null;
            return (
              <section key={s} className="mx-3 mt-3 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
                <header className="flex items-center justify-between border-b border-sky-100 bg-sky-50/70 px-3.5 py-2">
                  <span className="text-[13px] font-bold text-sky-700">{s}</span>
                  <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {items.length}条
                  </span>
                </header>
                <ul>
                  {items.map((m) => (
                    <li key={m.id} className="flex items-start gap-3 p-3">
                      <div className={`grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${m.cover} text-white`}>
                        <HeartPulse className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-bold text-foreground">{m.title}</p>
                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                          {m.cat},{m.stage} · 浏览 {m.views}
                        </p>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => openPush(m)}
                            className="flex items-center gap-1 rounded-full bg-emerald-500 px-3.5 py-1.5 text-[11px] font-bold text-white active:scale-95"
                          >
                            <Send className="size-3" /> 推送
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <button
            onClick={() => setToast("新建宣教推送(示例)")}
            className="mx-3 mt-3 flex w-[calc(100%-1.5rem)] items-center justify-center gap-2 rounded-2xl bg-card py-3.5 text-sm font-bold text-foreground shadow-[var(--shadow-card)] active:scale-[0.99]"
          >
            <Send className="size-4" /> 新建宣教推送
          </button>
        </>
      )}

      {tab === "推送" && (
        <>
          {stages.map((s) => {
            const items = materials.filter((m) => m.stage === s);
            return (
              <section key={s} className="mx-3 mt-3 overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
                <header className="flex items-center justify-between border-b border-sky-100 bg-sky-50/70 px-3.5 py-2">
                  <span className="text-[13px] font-bold text-sky-700">{s}</span>
                  <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {items.length}条
                  </span>
                </header>
                <ul className="divide-y divide-border">
                  {items.map((m) => (
                    <li key={m.id} className="flex items-center gap-3 p-3">
                      <div className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${m.cover} text-white`}>
                        <HeartPulse className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-foreground">{m.title}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{m.cat} · 浏览 {m.views}</p>
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
              </section>
            );
          })}
          <div className="h-6" />
        </>
      )}

      {tab === "监控" && (
        <section className="mx-3 mt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Send, k: "本周推送", v: "42" },
              { icon: Eye, k: "已读率", v: "78%" },
              { icon: Activity, k: "答题率", v: "63%" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
                <s.icon className="size-4 text-emerald-500" />
                <p className="mt-1.5 text-lg font-bold text-foreground">{s.v}</p>
                <p className="text-[11px] text-muted-foreground">{s.k}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)]">
            <p className="text-sm font-bold text-foreground">近期推送记录</p>
            <ul className="mt-2 divide-y divide-border">
              {materials.slice(0, 5).map((m) => (
                <li key={m.id} className="flex items-center justify-between py-2.5">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="truncate text-[13px] font-semibold text-foreground">{m.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{m.stage} · 已读 {Math.round(m.views * 0.7)} / {m.views}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
            <Bell className="size-4 shrink-0" /> 有 3 位患者近 7 天未查看已推送宣教
          </div>
        </section>
      )}

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
                <Send className="size-5" />
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
