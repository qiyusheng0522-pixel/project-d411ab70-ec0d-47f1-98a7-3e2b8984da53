import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Video, Calendar, Users, Stethoscope, FileText, Plus, Check } from "lucide-react";
import { useState } from "react";
import { patients } from "./doctor.patients.index";

export const Route = createFileRoute("/doctor/patients/$id/consult")({ component: ConsultPage });

const experts = [
  { id: "e1", name: "陈明远 主任", dept: "神经内科 · 卒中中心", hospital: "省人民医院", status: "在线", online: true },
  { id: "e2", name: "刘慧敏 副主任", dept: "心血管内科", hospital: "市第一医院", status: "在线", online: true },
  { id: "e3", name: "王志强 主任", dept: "神经外科", hospital: "华东医院", status: "1小时内回复", online: false },
  { id: "e4", name: "李思远 副主任", dept: "康复医学科", hospital: "康复研究中心", status: "离线", online: false },
] as const;

const history = [
  { d: "2026-06-18", topic: "抗凝方案调整讨论", experts: "陈明远、刘慧敏", status: "已完成" },
  { d: "2026-05-02", topic: "颈动脉支架术前评估", experts: "王志强", status: "已完成" },
];

function ConsultPage() {
  const { id } = Route.useParams();
  const p = patients.find((x) => x.id === id) ?? patients[0];
  const [type, setType] = useState<"video" | "graphic" | "mdt">("video");
  const [selected, setSelected] = useState<string[]>(["e1"]);
  const [purpose, setPurpose] = useState("");

  const toggle = (eid: string) =>
    setSelected((s) => (s.includes(eid) ? s.filter((x) => x !== eid) : [...s, eid]));

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-muted/40 pb-24">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card px-3 py-3">
        <Link to="/doctor/patients/$id" params={{ id }} className="grid size-9 place-items-center rounded-full active:scale-95">
          <ChevronLeft className="size-5" />
        </Link>
        <p className="text-base font-bold">发起会诊</p>
      </header>

      <section className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-400 p-4 text-white shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-white/20 text-lg font-bold">
            {p.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold">{p.name} · 会诊申请</p>
            <p className="text-[11px] opacity-90">{p.gender} · {p.age}岁 · {p.tag}</p>
          </div>
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">会诊类型</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { k: "video" as const, icon: Video, label: "视频会诊" },
            { k: "graphic" as const, icon: FileText, label: "图文会诊" },
            { k: "mdt" as const, icon: Users, label: "MDT 多学科" },
          ].map((t) => {
            const Icon = t.icon;
            const active = type === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setType(t.k)}
                className={
                  "flex flex-col items-center gap-1 rounded-xl border py-3 text-xs " +
                  (active
                    ? "border-sky-500 bg-sky-50 text-sky-600"
                    : "border-border bg-muted/30 text-muted-foreground")
                }
              >
                <Icon className="size-5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">邀请专家</p>
          <span className="text-[11px] text-muted-foreground">已选 {selected.length} 位</span>
        </div>
        <ul className="mt-2 divide-y divide-border">
          {experts.map((e) => {
            const on = selected.includes(e.id);
            return (
              <li key={e.id}>
                <button
                  onClick={() => toggle(e.id)}
                  className="flex w-full items-center gap-3 py-2.5 text-left"
                >
                  <div className="relative">
                    <div className="grid size-10 place-items-center rounded-full bg-sky-100 text-sky-600 text-sm font-bold">
                      {e.name.slice(0, 1)}
                    </div>
                    <span
                      className={
                        "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-card " +
                        (e.online ? "bg-emerald-500" : "bg-muted-foreground/40")
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-foreground">{e.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{e.dept} · {e.hospital}</p>
                    <p className="text-[10px] text-muted-foreground/80">{e.status}</p>
                  </div>
                  <div
                    className={
                      "grid size-6 place-items-center rounded-full border " +
                      (on ? "border-sky-500 bg-sky-500 text-white" : "border-border")
                    }
                  >
                    {on ? <Check className="size-3.5" /> : <Plus className="size-3.5 text-muted-foreground" />}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">会诊时间</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/50 p-3">
          <Calendar className="size-4 text-sky-600" />
          <span className="text-[13px] font-semibold text-foreground">2026-07-15 15:00</span>
          <span className="ml-auto text-[11px] text-sky-600">修改</span>
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">会诊目的与病情摘要</p>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="请说明本次会诊的核心问题,例如:抗凝方案调整、二级预防评估、影像判读等"
          className="mt-2 h-24 w-full resize-none rounded-xl border border-border bg-muted/30 p-3 text-[12px] outline-none focus:border-sky-400"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["近3天血压持续偏高", "PHQ-9 12分", "服药依从性下降", "LDL-C 未达标"].map((t) => (
            <span key={t} className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700">
              # {t}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">附带资料</p>
        <ul className="mt-2 space-y-2 text-[12px]">
          {["近3月化验报告.pdf", "颅脑 MRI 影像.dcm", "近7日血压记录", "现用药清单"].map((f) => (
            <li key={f} className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2">
              <FileText className="size-4 text-sky-600" />
              <span className="flex-1 truncate">{f}</span>
              <Check className="size-4 text-emerald-500" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <Stethoscope className="size-4 text-sky-600" /> 历史会诊
        </p>
        <ul className="mt-2 divide-y divide-border text-[12px]">
          {history.map((h) => (
            <li key={h.d} className="py-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{h.topic}</p>
                <span className="text-[10px] text-emerald-600">{h.status}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{h.experts} · {h.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md gap-3 border-t border-border/60 bg-card p-3">
        <button className="flex-1 rounded-full bg-muted py-3 text-sm font-bold text-muted-foreground active:scale-[0.99]">
          存为草稿
        </button>
        <button className="flex-1 rounded-full bg-sky-500 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] active:scale-[0.99]">
          发起会诊
        </button>
      </div>
    </div>
  );
}
