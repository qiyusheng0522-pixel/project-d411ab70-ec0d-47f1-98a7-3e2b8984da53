import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Send, ClipboardCheck, Sparkles, X, Check, RefreshCw, Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { nurseThreads } from "./nurse.chat.index";

export const Route = createFileRoute("/nurse/chat/$id")({ component: NurseChatDetail });

type Msg = { id: string; role: "me" | "them"; text: string; time: string };

const seedByPatient: Record<string, Msg[]> = {
  "1": [
    { id: "m1", role: "them", text: "护士,今天早上忘记服用抗凝药了,该怎么办?", time: "10:20" },
    { id: "m2", role: "me", text: "别紧张,先看一下距离服药时间过了多久,漏服 <12 h 可以补服。", time: "10:21" },
    { id: "m3", role: "them", text: "大概过了 3 小时,现在补吃可以吗?我还需要复查 INR 吗?", time: "10:22" },
  ],
  "2": [
    { id: "m1", role: "them", text: "你好,入院需要带哪些既往检查资料?", time: "09:41" },
  ],
  "3": [
    { id: "m1", role: "them", text: "预约入院评估已过期,请重新预约。", time: "6/30" },
  ],
  "4": [
    { id: "m1", role: "them", text: "吞咽训练视频看完了,饮水还是有点呛咳。", time: "昨天" },
  ],
  "5": [
    { id: "m1", role: "them", text: "3 天未上传血压记录,请及时补测。", time: "6/25" },
  ],
};

const quickReplies = [
  "请按医嘱继续服药,勿自行停药",
  "建议今日复测并上传血压 / INR",
  "康复训练每日 2 次,循序渐进",
  "如出现头晕、口齿不清立即联系我",
];

function NurseChatDetail() {
  const { id } = Route.useParams();
  const thread = nurseThreads.find((t) => t.id === id) ?? nurseThreads[0];
  const seed = seedByPatient[id] ?? seedByPatient["1"];
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("当前浏览器不支持语音输入,请使用 Chrome/Edge/Safari。");
      return;
    }
    try {
      const rec = new SR();
      rec.lang = "zh-CN";
      rec.continuous = false;
      rec.interimResults = true;
      let finalText = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (e: any) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += t;
          else interim += t;
        }
        setInput((finalText + interim).trim());
      };
      rec.onend = () => { setListening(false); recognitionRef.current = null; };
      rec.onerror = () => { setListening(false); recognitionRef.current = null; };
      recognitionRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
      alert("语音识别启动失败,请检查麦克风权限。");
    }
  };

  const lastPatientMsg = [...msgs].reverse().find((m) => m.role === "them")?.text ?? "";

  const generateAiFor = (patientText: string) => {
    setAiLoading(true);
    setAiDraft(null);
    setTimeout(() => {
      let text = "已收到您的信息,建议按康复计划执行,若有不适请随时联系。";
      if (/抗凝|华法林|漏服|忘记|漏吃/.test(patientText)) {
        text = "漏服抗凝药 <12 h 可立即补服一次剂量;>12 h 则跳过本次,勿加倍。今晚请复测 INR 并上传,近 3 天避免剧烈运动与磕碰,如出现牙龈出血、黑便请立即联系我。";
      } else if (/血压|收缩/.test(patientText)) {
        text = "请早晚各测 1 次血压并连续记录 3 天上传。低盐饮食(<5g/日),避免情绪激动;如收缩压持续 ≥160 或伴头痛、肢体无力,立即拨打 120 或联系我。";
      } else if (/吞咽|呛咳|喝水/.test(patientText)) {
        text = "呛咳提示吞咽功能仍有障碍。建议:①饮水改为糊状或增稠液;②小口缓慢下咽,进食时坐直,餐后保持坐位 30 分钟;③每日 2 次吞咽康复训练,持续加重请及时复诊评估。";
      } else if (/入院|资料|检查/.test(patientText)) {
        text = "入院请携带:身份证、医保卡、近 3 个月的头颅 MRI/CT 片及报告、心电图、血常规凝血报告、目前正在服用的所有药物清单。到院后先到护士站登记,我会协助您办理。";
      } else if (/未上传|忘记测|没测/.test(patientText)) {
        text = "请今天补测血压并上传记录,建议在早餐前与睡前各 1 次,连续 3 天。若测量数值持续偏高或偏低,请及时告知我以便通知医生调整方案。";
      }
      setAiDraft(text);
      setAiLoading(false);
    }, 600);
  };

  const generateAi = () => generateAiFor(lastPatientMsg);

  useEffect(() => {
    if (!aiEnabled) return;
    const last = msgs[msgs.length - 1];
    if (last && last.role === "them") {
      generateAiFor(last.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, aiEnabled]);

  const confirmAiSend = () => {
    if (!aiDraft) return;
    send(aiDraft);
    setAiDraft(null);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "me", text, time }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "them", text: "好的护士,我按您说的做,谢谢!", time }]);
    }, 700);
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card px-3 py-3">
        <Link to="/nurse/chat" className="grid size-9 place-items-center rounded-full active:scale-95">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="grid size-9 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
          {thread.patient.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{thread.patient}</p>
          <p className="text-[11px] text-muted-foreground">{thread.stage} · {thread.conds.join(" / ")}</p>
        </div>
        <Link to="/nurse/education" className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 active:scale-95">
          <ClipboardCheck className="size-4" />
        </Link>
      </header>

      <div className="flex items-center justify-between border-b border-border/60 bg-emerald-50/60 px-3 py-2">
        <div className="flex items-center gap-1.5 text-[12px] text-emerald-700">
          <Sparkles className="size-3.5" />
          <span className="font-semibold">AI 快捷回复</span>
          <span className="text-muted-foreground">生成后需确认再发送</span>
        </div>
        <button
          onClick={() => { setAiEnabled((v) => !v); if (aiEnabled) setAiDraft(null); }}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            aiEnabled ? "bg-emerald-500" : "bg-muted-foreground/30",
          )}
          aria-label="切换 AI 生成"
        >
          <span
            className={cn(
              "absolute top-0.5 size-4 rounded-full bg-white shadow transition-all",
              aiEnabled ? "left-[18px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {msgs.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "me" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                m.role === "me" ? "bg-emerald-500 text-white" : "bg-card text-foreground",
              )}
            >
              {m.text}
              <p className={cn("mt-0.5 text-[10px]", m.role === "me" ? "text-white/70" : "text-muted-foreground")}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border/60 bg-card">
        {aiEnabled && aiDraft && (
          <div className="mx-3 mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <Sparkles className="size-3.5" /> AI 生成建议 · 请护士确认
            </div>
            <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">{aiDraft}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setAiDraft(null)}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-1.5 text-xs font-semibold text-muted-foreground active:scale-95"
              >
                <X className="size-3.5" /> 丢弃
              </button>
              <button
                onClick={generateAi}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-1.5 text-xs font-semibold text-emerald-700 active:scale-95"
              >
                <RefreshCw className="size-3.5" /> 重新生成
              </button>
              <button
                onClick={() => { setInput(aiDraft); setAiDraft(null); }}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-1.5 text-xs font-semibold text-foreground active:scale-95"
              >
                编辑
              </button>
              <button
                onClick={confirmAiSend}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-emerald-500 py-1.5 text-xs font-semibold text-white active:scale-95"
              >
                <Check className="size-3.5" /> 确认发送
              </button>
            </div>
          </div>
        )}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pt-2">
          {aiEnabled && (
            <button
              onClick={generateAi}
              disabled={aiLoading}
              className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white active:scale-95 disabled:opacity-60"
            >
              <Sparkles className="size-3" />
              {aiLoading ? "生成中…" : "AI 生成回复"}
            </button>
          )}
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            onClick={generateAi}
            disabled={aiLoading}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground active:scale-95 disabled:opacity-60"
            aria-label="重新生成 AI 回复"
            title="刷新 AI 建议"
          >
            <RefreshCw className={cn("size-4", aiLoading && "animate-spin")} />
          </button>
          <div className="relative min-w-0 flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder={listening ? "正在聆听…" : "输入回复或点麦克风语音输入…"}
              className="w-full rounded-full bg-muted py-2 pl-4 pr-11 text-sm outline-none focus:bg-background"
            />
            <button
              onClick={toggleVoice}
              className={cn(
                "absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full active:scale-95",
                listening ? "bg-rose-500 text-white animate-pulse" : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
              aria-label={listening ? "停止语音输入" : "开始语音输入"}
            >
              {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </button>
          </div>
          <button
            onClick={() => send()}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-white active:scale-95"
            aria-label="发送"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
