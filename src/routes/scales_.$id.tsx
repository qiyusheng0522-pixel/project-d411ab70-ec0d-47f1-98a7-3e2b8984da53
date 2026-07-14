import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { Button } from "@/components/ui/button";
import { scales } from "@/lib/scales";
import { cn } from "@/lib/utils";
import { saveScaleResult } from "@/lib/scale-status";
import { useEffect } from "react";

export const Route = createFileRoute("/scales_/$id")({ component: ScaleDetail });

function ScaleDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const scale = scales[id];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!scale) {
    return (
      <MobileShell>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">未找到该量表</p>
          <Link to="/scales" className="mt-3 inline-block text-primary">返回列表</Link>
        </div>
      </MobileShell>
    );
  }

  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / scale.questions.length) * 100);
  const result = submitted ? scale.interpret(total) : null;

  const reset = () => { setAnswers({}); setSubmitted(false); };

  useEffect(() => {
    if (submitted && result) saveScaleResult(scale.id, total, result.level);
  }, [submitted, result, total, scale.id]);

  return (
    <MobileShell>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate({ to: "/scales" })} className="p-1">
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{scale.name} · {scale.fullName}</p>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{answered}/{scale.questions.length}</span>
      </header>

      {!submitted ? (
        <>
          <div className="mx-4 mt-4 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
            {scale.description}
          </div>
          <ol className="mx-4 mt-4 space-y-4">
            {scale.questions.map((q, idx) => (
              <li key={q.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="text-sm font-semibold text-foreground">
                  <span className="mr-1.5 text-primary">{idx + 1}.</span>{q.text}
                </p>
                <div className="mt-3 space-y-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.score && answers[q.id] !== undefined;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt.score }))}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm transition",
                          selected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border bg-card text-foreground/80 active:bg-accent",
                        )}
                      >
                        <span>{opt.label}</span>
                        {selected && <CheckCircle2 className="size-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
          <div className="mx-4 mb-6 mt-6">
            <Button
              className="h-12 w-full rounded-2xl text-base"
              disabled={answered < scale.questions.length}
              onClick={() => setSubmitted(true)}
            >
              {answered < scale.questions.length ? `还有 ${scale.questions.length - answered} 题未完成` : "提交评估"}
            </Button>
          </div>
        </>
      ) : (
        <div className="px-4 pt-6">
          <div className="overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-[var(--shadow-soft)]"
            style={{ background: "var(--gradient-primary)" }}>
            <p className="text-sm opacity-90">{scale.name} 评估结果</p>
            <p className="mt-2 text-5xl font-bold">{total}<span className="ml-1 text-lg opacity-80">分</span></p>
            <p className="mt-3 text-lg font-semibold">{result!.level}</p>
          </div>
          <div className="mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-sm font-bold text-foreground">健康建议</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{result!.advice}</p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              本结果仅供参考,具体诊疗请咨询专科医师。
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="h-12 flex-1 rounded-2xl" onClick={reset}>
              <RotateCcw className="size-4" /> 重新评估
            </Button>
            <Button className="h-12 flex-1 rounded-2xl" onClick={() => navigate({ to: "/education" })}>
              查看相关宣教
            </Button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}