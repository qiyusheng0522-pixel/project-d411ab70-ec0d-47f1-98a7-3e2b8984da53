import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera, BookOpen, ChevronRight, MessageSquare,
  HeartPulse, Brain, Bone, Stethoscope, Utensils, Apple, Pill, Activity, Smile,
  CheckCircle2, Circle, Droplet,
  ClipboardList, FileBarChart, ShieldCheck, FileText,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { readAllScaleResults, type ScaleStatus } from "@/lib/scale-status";
import { loadSelf, loadLife, type QResult } from "@/lib/questionnaire";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export const Route = createFileRoute("/patient")({
  component: Index,
});

const assessments = [
  { id: "essen", icon: ShieldCheck, title: "Essen 卒中风险", desc: "评估复发风险等级", bg: "bg-gradient-to-br from-sky-100 to-sky-200", required: true },
  { id: "mrs", icon: HeartPulse, title: "mRS 残障评估", desc: "判断恢复程度", bg: "bg-gradient-to-br from-rose-100 to-rose-200", required: true },
  { id: "barthel", icon: Bone, title: "Barthel 日常活动", desc: "测评生活自理能力", bg: "bg-gradient-to-br from-amber-100 to-amber-200", required: false },
  { id: "eat10", icon: Utensils, title: "EAT-10 吞咽评估", desc: "筛查吞咽与误吸风险", bg: "bg-gradient-to-br from-orange-100 to-orange-200", required: false },
  { id: "phq9", icon: Brain, title: "PHQ-9 抑郁筛查", desc: "近2周情绪状态", bg: "bg-gradient-to-br from-violet-100 to-violet-200", required: true },
  { id: "gad7", icon: Smile, title: "GAD-7 焦虑筛查", desc: "近2周焦虑症状", bg: "bg-gradient-to-br from-indigo-100 to-indigo-200", required: false },
  { id: "mnasf", icon: Apple, title: "MNA-SF 营养评估", desc: "筛查营养不良风险", bg: "bg-gradient-to-br from-emerald-100 to-emerald-200", required: false },
  { id: "medadh", icon: Pill, title: "用药依从性", desc: "评估服药规律程度", bg: "bg-gradient-to-br from-teal-100 to-teal-200", required: true },
  { id: "fall", icon: Activity, title: "跌倒风险自评", desc: "居家跌倒风险筛查", bg: "bg-gradient-to-br from-yellow-100 to-yellow-200", required: false },
] as const;

type Task = {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  to?: "/records" | "/scales";
};

function Index() {
  const scaleIds = assessments.map((a) => a.id);
  const [scaleStatus, setScaleStatus] = useState<Record<string, ScaleStatus | null>>({});
  const [mounted, setMounted] = useState(false);
  const [selfQ, setSelfQ] = useState<QResult | null>(null);
  const [lifeQ, setLifeQ] = useState<QResult | null>(null);

  useEffect(() => {
    setMounted(true);
    const refresh = () => {
      setScaleStatus(readAllScaleResults(scaleIds));
      setSelfQ(loadSelf());
      setLifeQ(loadLife());
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requiredScales = assessments.filter((a) => a.required);
  const completedScales = mounted
    ? requiredScales.filter((a) => scaleStatus[a.id]).length
    : 0;
  // selfQ / lifeQ retained for potential future gating
  void selfQ; void lifeQ;

  const tasks: Task[] = [
    { id: "bp", title: "测量今日血压", desc: "早晚各一次", done: false, to: "/records" },
    { id: "med", title: "服用降压药", desc: "8:00 · 苯磺酸氨氯地平", done: false, to: "/records" },
    {
      id: "scale",
      title: "完成必填量表评估",
      desc: `已完成 ${completedScales}/${requiredScales.length}`,
      done: completedScales === requiredScales.length,
      to: "/scales",
    },
  ];
  const doneCount = tasks.filter((t) => t.done).length;

  const quickTiles = [
    { key: "input", label: "数据录入", icon: Droplet, to: "/records" as const, tint: "bg-sky-100 text-sky-600", active: true },
    { key: "tasks", label: "今日任务", icon: ClipboardList, to: "/tasks" as const, tint: "bg-sky-50 text-sky-600" },
    { key: "records", label: "健康档案", icon: FileText, to: "/records" as const, tint: "bg-emerald-50 text-emerald-600" },
    { key: "report", label: "我的报告", icon: FileBarChart, to: "/reports" as const, tint: "bg-violet-50 text-violet-500" },
  ];

  return (
    <MobileShell>
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 pt-8">
        <span className="text-xl font-bold tracking-wide text-foreground">
          <span className="text-primary">卒中健康</span>
        </span>
        <RoleSwitcher />
      </header>

      {/* OCR — hero card */}
      <section
        className="mx-4 mt-4 overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-soft)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Link to="/records" className="flex items-center gap-3 active:scale-[0.99]">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/20">
            <Camera className="size-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold leading-tight">拍照录入档案</p>
            <p className="mt-0.5 truncate text-xs opacity-90">智能 OCR 自动识别</p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary">
            去拍照
          </span>
        </Link>
      </section>

      {/* Consult doctor + messages */}
      <section className="mx-4 mt-4 flex items-stretch gap-3">
        <Link
          to="/consult"
          className="flex flex-1 items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-[var(--shadow-card)] active:scale-[0.99]"
        >
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600">
            <Stethoscope className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-foreground">咨询专科医生?</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              选择主任 / 主治医生 1v1
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
        <Link
          to="/messages"
          className="relative flex w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-card shadow-[var(--shadow-card)] active:scale-95"
        >
          <span className="absolute right-3 top-2 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            3
          </span>
          <MessageSquare className="size-6 text-sky-600" />
          <span className="mt-1 text-xs font-semibold text-foreground">消息</span>
        </Link>
      </section>

      {/* Quick tiles */}
      <section className="mx-4 mt-3 grid grid-cols-4 gap-2">
        {quickTiles.map((t) => {
          const Icon = t.icon;
          const inner = (
            <div
              className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 shadow-[var(--shadow-card)] active:scale-95 ${
                t.active ? "bg-sky-50 ring-1 ring-sky-200" : "bg-card"
              }`}
            >
              <div className={`grid size-10 place-items-center rounded-xl ${t.tint}`}>
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <p className={`whitespace-nowrap text-sm font-semibold ${t.active ? "text-sky-700" : "text-foreground"}`}>
                {t.label}
              </p>
            </div>
          );
          return <Link key={t.key} to={t.to}>{inner}</Link>;
        })}
      </section>

      {/* Today's tasks */}
      <section className="mx-4 mt-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-foreground">今日任务</h3>
          <span className="text-sm text-muted-foreground">{doneCount}/{tasks.length} 已完成</span>
        </div>
        <ul className="mt-3 space-y-2">
          {tasks.map((t) => {
            const content = (
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3 active:scale-[0.99]">
                {t.done ? (
                  <CheckCircle2 className="size-6 shrink-0 text-primary" />
                ) : (
                  <Circle className="size-6 shrink-0 text-muted-foreground" strokeWidth={1.8} />
                )}
                <div className="min-w-0 flex-1">
                  <p className={`text-base font-semibold ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {t.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            );
            return (
              <li key={t.id}>
                {t.to ? <Link to={t.to}>{content}</Link> : content}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Scales with fill status */}
      <section className="mx-4 mt-6">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <div>
            <h3 className="text-xl font-bold text-foreground">卒中专病量表 · 必填</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">医生随访核心项 · 其余量表点「全部」查看</p>
          </div>
          <Link to="/scales" className="flex items-center text-base text-primary">
            全部 <ChevronRight className="size-4" />
          </Link>
        </div>
        <ul className="space-y-3">
          {assessments.filter((a) => a.required).map((a) => {
            const Icon = a.icon;
            const status = mounted ? scaleStatus[a.id] : null;
            const done = !!status;
            return (
              <li key={a.id}>
                <Link
                  to="/scales/$id"
                  params={{ id: a.id }}
                  className={`flex items-center gap-3 rounded-2xl p-4 shadow-[var(--shadow-card)] active:scale-[0.99] ${a.bg}`}
                >
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/70">
                    <Icon className="size-7 text-foreground/70" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-bold text-foreground">{a.title}</p>
                      <span className="rounded-full bg-rose-500/90 px-2 py-0.5 text-[11px] font-semibold text-white">必填</span>
                      {done ? (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">已填写</span>
                      ) : (
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-foreground/60">未填写</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-foreground/70">
                      {done ? `${status!.level} · ${status!.score} 分` : a.desc}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-primary">
                    {done ? "重新填写" : "去填写"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Education */}
      <section className="mx-4 mt-6">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <h3 className="text-xl font-bold text-foreground">
            <BookOpen className="mr-1 inline size-5" /> 健康宣教
          </h3>
          <Link to="/education" className="flex items-center text-base text-primary">
            进入百科 <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto px-1">
          {["全部", "视频", "图文", "直播"].map((c, i) => (
            <button
              key={c}
              className={
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium " +
                (i === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")
              }
            >
              {c}
            </button>
          ))}
        </div>
        <ul className="space-y-3">
          {[
            { id: "recovery", tag: "必读", meta: "王医生 · 5 分钟", cover: "from-blue-300 to-sky-200", title: "卒中后运动康复指南" },
            { id: "diet", tag: "食谱", meta: "营养师 · 4 分钟", cover: "from-emerald-300 to-teal-200", title: "卒中患者饮食管理" },
            { id: "warning", tag: "预警", meta: "主任医师 · 3 分钟", cover: "from-rose-300 to-orange-200", title: "卒中复发预警信号 FAST" },
          ].map((a) => (
            <li key={a.id}>
              <Link
                to="/education/$id"
                params={{ id: a.id }}
                className="flex gap-4 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)] active:scale-[0.99]"
              >
                <div className={`h-28 w-28 shrink-0 rounded-xl bg-gradient-to-br ${a.cover}`} />
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <p className="line-clamp-2 text-base font-bold leading-snug text-foreground">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] text-accent-foreground">
                      {a.tag}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{a.meta}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-4" />
    </MobileShell>
  );
}