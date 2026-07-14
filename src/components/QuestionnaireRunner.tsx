import { useMemo, useState } from "react";
import type { Answers, Section } from "@/lib/questionnaire";
import { ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";

type Props = {
  title: string;
  subtitle?: string;
  sections: Section[];
  initial?: Answers;
  onSubmit: (answers: Answers) => void;
  backTo: "/questionnaire";
};

export function QuestionnaireRunner({ title, subtitle, sections, initial, onSubmit, backTo }: Props) {
  const [answers, setAnswers] = useState<Answers>(initial ?? {});

  const allQuestions = useMemo(() => sections.flatMap((s) => s.questions), [sections]);
  const answered = allQuestions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== null && !Number.isNaN(answers[q.id])).length;
  const total = allQuestions.length;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const canSubmit = answered === total;

  const setValue = (id: string, v: number) => setAnswers((a) => ({ ...a, [id]: v }));

  return (
    <MobileShell>
      <header className="flex items-center gap-2 px-4 pt-5">
        <Link to={backTo} className="grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </header>

      {/* Progress */}
      <div className="mx-4 mt-3 rounded-full bg-card p-1 shadow-[var(--shadow-card)]">
        <div className="relative h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 px-2 text-center text-[11px] text-muted-foreground">
          已完成 {answered}/{total} 题
        </p>
      </div>

      <div className="mx-4 mt-4 space-y-4">
        {sections.map((sec, si) => (
          <section key={sec.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-baseline gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {si + 1}
              </span>
              <h2 className="text-base font-bold text-foreground">{sec.title}</h2>
            </div>
            {sec.desc && <p className="mb-3 text-xs text-muted-foreground">{sec.desc}</p>}
            <ul className="space-y-4">
              {sec.questions.map((q, qi) => (
                <li key={q.id}>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    <span className="mr-1 text-muted-foreground">{qi + 1}.</span>
                    {q.label}
                  </p>
                  {q.type === "radio" ? (
                    <div className="grid grid-cols-2 gap-2">
                      {q.options!.map((opt) => {
                        const active = answers[q.id] === opt.value;
                        return (
                          <button
                            key={`${q.id}-${opt.value}-${opt.label}`}
                            type="button"
                            onClick={() => setValue(q.id, opt.value)}
                            className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                              active
                                ? "border-primary bg-primary/10 font-semibold text-primary"
                                : "border-border bg-background text-foreground/80"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={answers[q.id] ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAnswers((a) => {
                            const next = { ...a };
                            if (v === "") delete next[q.id];
                            else next[q.id] = Number(v);
                            return next;
                          });
                        }}
                        className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-base text-foreground focus:border-primary focus:outline-none"
                        placeholder="请输入"
                      />
                      {q.suffix && <span className="text-sm text-muted-foreground">{q.suffix}</span>}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="h-24" />

      <div className="sticky bottom-0 border-t border-border/60 bg-card/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit(answers)}
          className="h-12 w-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-base font-semibold text-white shadow-[var(--shadow-soft)] active:scale-[0.99] disabled:from-muted disabled:to-muted disabled:text-muted-foreground disabled:shadow-none"
        >
          {canSubmit ? "提交问卷" : `还有 ${total - answered} 题未完成`}
        </button>
      </div>
    </MobileShell>
  );
}