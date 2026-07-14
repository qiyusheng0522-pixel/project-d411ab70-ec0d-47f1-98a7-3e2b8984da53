import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Send, ClipboardCheck, Sparkles, X, Check, RefreshCw, Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doctor/chat/$id")({ component: ChatDetail });

type Msg = { id: string; role: "me" | "them"; text: string; time: string };

const seedByPatient: Record<string, { name: string; msgs: Msg[] }> = {
  "1": {
    name: "张大伯",
    msgs: [
      { id: "m1", role: "them", text: "医生,今天早上血压 158/96,要不要加药?", time: "10:20" },
      { id: "m2", role: "me", text: "先别急,注意近 3 天的连续测量。饮食有没有偏咸?", time: "10:21" },
      { id: "m3", role: "them", text: "昨天中午吃了咸菜,晚上确实高。", time: "10:22" },
    ],
  },
  "2": { name: "李阿姨", msgs: [{ id: "m1", role: "them", text: "情绪最近有点差,晚上睡不好。", time: "09:41" }] },
  "3": { name: "王先生", msgs: [{ id: "m1", role: "them", text: "空腹血糖 7.8,饮食有点管不住。", time: "昨天" }] },
  "4": { name: "康复群", msgs: [{ id: "m1", role: "them", text: "护士王:今日康复训练打卡。", time: "昨天" }] },
  "5": { name: "赵大爷", msgs: [{ id: "m1", role: "them", text: "药停了两天,是不是没事?", time: "周三" }] },
};

const quickReplies = [
  "请按医嘱继续用药,勿自行停药",
  "建议明天上午来门诊复查",
  "先测量 3 天血压,记录后发我",
  "情绪问题建议心理科评估",
];

function ChatDetail() {
  const { id } = Route.useParams();
  const seed = seedByPatient[id] ?? seedByPatient["1"];
  const [msgs, setMsgs] = useState<Msg[]>(seed.msgs);
  const [input, setInput] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const lastPatientMsg = [...msgs].reverse().find((m) => m.role === "them")?.text ?? "";

  const generateAiFor = (patientText: string) => {
    setAiLoading(true);
    setAiDraft(null);
    setTimeout(() => {
      let text = "建议先规律测量,记录 3 天血压后再评估是否调整用药。";
      if (/血压|高压|收缩/.test(patientText)) {
        text = "血压 158/96 属于 2 级偏高,先别自行加药。建议:①今起早晚各测 1 次并记录 3 天;②饮食低盐(每日盐<5g),避免咸菜、腌制品;③如仍持续 ≥160/100 或伴头痛、胸闷,请随时联系我复诊。";
      } else if (/血糖|糖/.test(patientText)) {
        text = "空腹血糖 7.8 略高于目标(4.4-7.0)。建议:①主食减 1/4,增加蔬菜与优质蛋白;②餐后 30 分钟散步 20 分钟;③连续记录 3 天空腹+餐后 2 h 血糖发我评估。";
      } else if (/情绪|睡|抑郁|心情/.test(patientText)) {
        text = "睡眠与情绪问题需要关注。建议:①规律作息、23 点前入睡;②每日 10 分钟正念呼吸;③如持续 2 周以上,预约心理科评估 PHQ-9/GAD-7。";
      } else if (/停药|漏|忘记/.test(patientText)) {
        text = "请务必按医嘱继续服药,勿自行停药。可设置每日固定时间提醒,漏服 <12 h 可补服,>12 h 直接跳过,不加倍。";
      }
      setAiDraft(text);
      setAiLoading(false);
    }, 600);
  };

  const generateAi = () => generateAiFor(lastPatientMsg);

  // Auto-generate AI draft whenever a new patient message arrives (if enabled)
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
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "them", text: "好的医生,我按您说的做。", time }]);
    }, 700);
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card px-3 py-3">
        <Link to="/doctor/chat" className="grid size-9 place-items-center rounded-full active:scale-95">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="grid size-9 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
          {seed.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{seed.name}</p>
          <p className="text-[11px] text-muted-foreground">在线 · 卒中随访</p>
        </div>
        <Link to="/doctor/plans" className="grid size-9 place-items-center rounded-full bg-sky-50 text-sky-600 active:scale-95">
          <ClipboardCheck className="size-4" />
        </Link>
      </header>

      {/* AI toggle bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-sky-50/60 px-3 py-2">
        <div className="flex items-center gap-1.5 text-[12px] text-sky-700">
          <Sparkles className="size-3.5" />
          <span className="font-semibold">AI 快捷回复</span>
          <span className="text-muted-foreground">生成后需确认再发送</span>
        </div>
        <button
          onClick={() => { setAiEnabled((v) => !v); if (aiEnabled) setAiDraft(null); }}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            aiEnabled ? "bg-sky-500" : "bg-muted-foreground/30",
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
                m.role === "me" ? "bg-sky-500 text-white" : "bg-card text-foreground",
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
          <div className="mx-3 mt-2 rounded-2xl border border-sky-200 bg-sky-50 p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-700">
              <Sparkles className="size-3.5" /> AI 生成建议 · 请医生确认
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
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-1.5 text-xs font-semibold text-sky-700 active:scale-95"
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
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-sky-500 py-1.5 text-xs font-semibold text-white active:scale-95"
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
              className="flex shrink-0 items-center gap-1 rounded-full bg-sky-500 px-3 py-1 text-[11px] font-semibold text-white active:scale-95 disabled:opacity-60"
            >
              <Sparkles className="size-3" />
              {aiLoading ? "生成中…" : "AI 生成回复"}
            </button>
          )}
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full bg-sky-50 px-3 py-1 text-[11px] text-sky-700 active:scale-95"
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
            className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-500 text-white active:scale-95"
            aria-label="发送"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
