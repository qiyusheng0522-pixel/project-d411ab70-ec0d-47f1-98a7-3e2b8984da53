import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ClipboardList, HeartPulse, Sparkles, CheckCircle2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ensureDefaultQuestionnaires, loadLife, loadSelf, type QResult } from "@/lib/questionnaire";

export const Route = createFileRoute("/questionnaire")({ component: QuestionnaireIndex });

function QuestionnaireIndex() {
  const [self, setSelf] = useState<QResult | null>(null);
  const [life, setLife] = useState<QResult | null>(null);

  useEffect(() => {
    ensureDefaultQuestionnaires();
    setSelf(loadSelf());
    setLife(loadLife());
  }, []);

  const bothDone = !!self && !!life;

  return (
    <MobileShell>
      <header className="flex items-center gap-2 px-4 pt-5">
        <Link to="/patient" className="grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">健康风险评估</h1>
      </header>

      <section
        className="mx-4 mt-4 rounded-2xl p-4 text-primary-foreground shadow-[var(--shadow-soft)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <p className="text-base font-bold">完成两份问卷</p>
        <p className="mt-1 text-xs opacity-90">
          填写「卒中患者自评」和「生活习惯」问卷,系统将综合生成您的个人风险评估。
        </p>
      </section>

      <ul className="mx-4 mt-4 space-y-3">
        <QuestionnaireCard
          to="/questionnaire/self"
          icon={<HeartPulse className="size-6 text-rose-500" />}
          tint="bg-rose-50"
          title="卒中患者自评问卷"
          desc="Essen 风险 · BE-FAST · mRS · PHQ-9 · 用药依从"
          done={!!self}
          completedAt={self?.completedAt}
        />
        <QuestionnaireCard
          to="/questionnaire/life"
          icon={<ClipboardList className="size-6 text-sky-500" />}
          tint="bg-sky-50"
          title="患者生活问卷"
          desc="身体指标 · 饮食 · 运动 · 烟酒 · 睡眠情绪"
          done={!!life}
          completedAt={life?.completedAt}
        />
      </ul>

      <div className="mx-4 mt-6 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-lg bg-violet-500 text-white">
            <Sparkles className="size-4" />
          </div>
          <p className="text-base font-bold text-foreground">个人风险评估</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {bothDone
            ? "两份问卷已完成,点击查看您的综合风险评估。"
            : "完成上方两份问卷后,即可查看综合评估结果。"}
        </p>
        {bothDone ? (
          <Link
            to="/questionnaire/result"
            className="mt-3 grid h-11 place-items-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-sm font-semibold text-white shadow-[var(--shadow-soft)] active:scale-[0.99]"
          >
            查看风险评估
          </Link>
        ) : (
          <div className="mt-3 grid h-11 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            请先完成两份问卷
          </div>
        )}
      </div>

      <div className="h-6" />
    </MobileShell>
  );
}

function QuestionnaireCard({
  to, icon, tint, title, desc, done, completedAt,
}: {
  to: "/questionnaire/self" | "/questionnaire/life";
  icon: React.ReactNode;
  tint: string;
  title: string;
  desc: string;
  done: boolean;
  completedAt?: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
      >
        <div className={`grid size-12 shrink-0 place-items-center rounded-xl ${tint}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[15px] font-bold text-foreground">{title}</p>
            {done && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <CheckCircle2 className="size-3" /> 已完成
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{desc}</p>
          {done && completedAt && (
            <p className="mt-0.5 text-[11px] text-muted-foreground/70">
              完成于 {new Date(completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
    </li>
  );
}