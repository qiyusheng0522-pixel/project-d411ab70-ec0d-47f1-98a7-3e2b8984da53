import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Sparkles, Check, FileText, RefreshCw, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nurse/followup_/$id")({ component: AiFollowup });

type FUPatient = {
  id: string;
  name: string;
  disease: string;
  days: string;
  questions: string[];
  answers: string[];
};

const patients: Record<string, FUPatient> = {
  n001: {
    id: "n001",
    name: "陈建国",
    disease: "缺血性卒中恢复期",
    days: "术后第 9 天",
    questions: [
      "您好,我是 AI 随访助手。今天是术后第 9 天,请问您近 3 天是否按时服用阿司匹林与阿托伐他汀?有无漏服?",
      "近 3 天有没有出现头晕、肢体无力、口齿不清或视物模糊等症状?",
      "康复训练完成情况如何?每天能坚持完成 2 次肢体训练吗?",
      "最近一次测量的血压是多少?晨起与睡前分别是多少?",
    ],
    answers: [
      "都按时吃了,没有漏服。",
      "偶尔起身有点头晕,没有肢体无力,说话正常。",
      "每天能做 1~2 次,右手握力还比较弱。",
      "晨起 148/92,睡前 138/86。",
    ],
  },
  n004: {
    id: "n004",
    name: "赵美华",
    disease: "颈动脉狭窄术后",
    days: "术后第 12 天",
    questions: [
      "您好,我是 AI 随访助手。术后第 12 天,请问伤口有无红肿、渗液或疼痛加重?",
      "吞咽功能怎么样?饮水或进食时是否还有呛咳?",
      "抗血小板药(氯吡格雷)是否按时服用?有无出血倾向(牙龈出血、皮下瘀斑)?",
      "近期活动耐力如何?步行或上楼梯有无明显气促、乏力?",
    ],
    answers: [
      "伤口没有红肿,轻微紧绷感,不痛。",
      "喝水偶尔呛咳,吃软饭没问题。",
      "按时吃,刷牙有点出血,身上没有瘀斑。",
      "步行 10 分钟没问题,上 2 楼稍气促。",
    ],
  },
};

type Msg = { id: string; role: "ai" | "patient"; text: string; time: string };

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function AiFollowup() {
  const { id } = Route.useParams();
  const p = patients[id] ?? patients.n001;
  const nav = useNavigate();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  const push = (role: "ai" | "patient", text: string) =>
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role, text, time: nowTime() }]);

  const askNext = (i: number) => {
    if (i >= p.questions.length) {
      setDone(true);
      return;
    }
    setTimeout(() => push("ai", p.questions[i]), 500);
    setTimeout(() => {
      push("patient", p.answers[i]);
      setStep(i + 1);
    }, 1600);
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    askNext(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step > 0 && step < p.questions.length && !done) askNext(step);
    if (step === p.questions.length) setDone(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, done]);

  const summary = buildSummary(p);

  const restart = () => {
    setMsgs([]);
    setStep(0);
    setDone(false);
    setSaved(false);
    started.current = false;
    setTimeout(() => {
      started.current = true;
      askNext(0);
    }, 100);
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card px-3 py-3">
        <Link to="/nurse/followup" className="grid size-9 place-items-center rounded-full active:scale-95">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="grid size-9 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
          {p.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{p.name} · AI 随访</p>
          <p className="truncate text-[11px] text-muted-foreground">{p.disease} · {p.days}</p>
        </div>
        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          {done ? "已完成" : `${step}/${p.questions.length}`}
        </span>
      </header>

      <div className="flex items-center gap-1.5 border-b border-border/60 bg-emerald-50/70 px-3 py-2 text-[12px] text-emerald-700">
        <Sparkles className="size-3.5" />
        <span className="font-semibold">AI 自动随访</span>
        <span className="text-muted-foreground">依据卒中术后随访清单自动提问,并生成随访结果</span>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {msgs.map((m) => (
          <div key={m.id} className={cn("flex items-end gap-1.5", m.role === "ai" ? "justify-start" : "justify-end")}>
            {m.role === "ai" && (
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Bot className="size-3.5" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[78%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                m.role === "ai" ? "bg-card text-foreground" : "bg-emerald-500 text-white",
              )}
            >
              {m.text}
              <p className={cn("mt-0.5 text-[10px]", m.role === "ai" ? "text-muted-foreground" : "text-white/70")}>{m.time}</p>
            </div>
          </div>
        ))}

        {done && (
          <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700">
              <FileText className="size-3.5" /> AI 随访结果
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">基于本次问答自动生成 · 请护士核对</p>
            <div className="mt-2 space-y-1.5 text-[12px] text-foreground">
              <p><span className="font-semibold">风险等级:</span> <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", summary.riskColor)}>{summary.risk}</span></p>
              <p><span className="font-semibold">主要发现:</span></p>
              <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
                {summary.findings.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <p className="pt-1"><span className="font-semibold">处理建议:</span></p>
              <ul className="list-disc space-y-0.5 pl-5 text-muted-foreground">
                {summary.advice.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={restart}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-1.5 text-xs font-semibold text-emerald-700 active:scale-95"
              >
                <RefreshCw className="size-3.5" /> 重新随访
              </button>
              <button
                onClick={() => { setSaved(true); setTimeout(() => nav({ to: "/nurse/followup" }), 900); }}
                disabled={saved}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-emerald-500 py-1.5 text-xs font-semibold text-white active:scale-95 disabled:opacity-70"
              >
                <Check className="size-3.5" /> {saved ? "已归档" : "确认并归档"}
              </button>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function buildSummary(p: FUPatient) {
  const joined = p.answers.join(" ");
  const findings: string[] = [];
  const advice: string[] = [];
  let riskScore = 0;

  if (/漏服|忘记/.test(joined)) { findings.push("存在漏服抗栓/降压药物情况"); advice.push("重申服药依从性,必要时设置提醒"); riskScore += 2; }
  else findings.push("药物依从性良好");

  if (/头晕|无力|口齿|视物/.test(joined)) { findings.push("出现体位性头晕等神经系统症状"); advice.push("嘱缓慢起身,监测血压,若加重立即就诊"); riskScore += 1; }

  const bp = joined.match(/(\d{2,3})\s*\/\s*(\d{2,3})/g);
  if (bp && bp.some((b) => Number(b.split("/")[0]) >= 140)) {
    findings.push(`血压偏高(${bp.join(", ")})`);
    advice.push("低盐饮食,加测早晚血压,持续 ≥160 需联系医生调整降压方案");
    riskScore += 2;
  }

  if (/呛咳/.test(joined)) { findings.push("仍存在饮水呛咳"); advice.push("饮水增稠,继续吞咽康复训练,一周后复评"); riskScore += 1; }
  if (/出血|瘀斑/.test(joined)) { findings.push("出现轻度出血倾向"); advice.push("观察出血程度,必要时复查凝血功能"); riskScore += 1; }
  if (/气促|乏力/.test(joined)) { findings.push("活动耐力下降"); advice.push("循序渐进增加活动量,监测心率"); }

  advice.push("下一次随访:7 天后");

  const risk = riskScore >= 3 ? "高风险" : riskScore >= 1 ? "中风险" : "低风险";
  const riskColor = riskScore >= 3 ? "bg-rose-100 text-rose-700" : riskScore >= 1 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return { risk, riskColor, findings, advice };
}
