import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Mic, MicOff, Plus, Camera, Send, Hash, ShieldCheck, ChevronRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  component: AIAssistantPage,
  head: () => ({
    meta: [
      { title: "AI 健康助手 · 卒中健康" },
      { name: "description", content: "AI 卒中健康助手,支持语音提问、康复咨询、用药答疑" },
    ],
  }),
});

type ChatMsg = { id: string; role: "user" | "ai"; text: string };

const presets = [
  { icon: Hash, text: "空腹血糖多少算达标?糖化目标是多少?" },
  { icon: Hash, text: "二甲双胍饭前还是饭后吃?会伤肾吗?" },
  { icon: Hash, text: "甲状腺结节 TI-RADS 3 类需要复查吗?" },
];

const quickChips = ["血糖管理", "胰岛素注射", "低糖饮食", "甲状腺随访", "并发症筛查"];

function mockReply(q: string): string {
  if (/二甲双胍|格列|胰岛素|降糖|药/.test(q)) return "二甲双胍建议随餐或餐后服用以减轻胃肠反应;肾功能 eGFR <30 需停用。胰岛素需按医嘱调整,注意低血糖识别与处理(15g 快糖 → 15 分钟复测)。";
  if (/血糖|糖化|HbA1c|达标/.test(q)) return "成人 2 型糖尿病一般目标:空腹 4.4-7.0 mmol/L,餐后 2h <10.0 mmol/L,HbA1c <7%;老年或合并症患者可放宽至 <7.5%~8%,具体请遵内分泌科医生个体化建议。";
  if (/甲状腺|TSH|结节|甲亢|甲减/.test(q)) return "甲状腺结节 TI-RADS 3 类考虑良性可能大,建议 6-12 个月超声随访;TSH 异常需结合 FT3/FT4 及抗体判断,勿自行服药。";
  if (/饮食|吃/.test(q)) return "内分泌代谢饮食建议:主食优选全谷物粗粮,控制精制碳水;每餐搭配优质蛋白与蔬菜,先菜后肉再主食;限盐 <5g/日,限含糖饮料。";
  if (/低血糖|头晕|出汗/.test(q)) return "低血糖(<3.9 mmol/L)处理:立即口服 15g 快糖(葡萄糖片/糖水/果汁),15 分钟后复测,未纠正再补 15g;意识不清立即送医。";
  if (/运动|锻炼/.test(q)) return "推荐每周 ≥150 分钟中等强度有氧(快走/游泳/骑车)+ 2-3 次抗阻训练;餐后 1 小时运动更利于控糖,避免空腹剧烈运动。";
  return "我已记录您的问题,建议结合您的血糖/激素档案与近期化验结果进一步咨询内分泌科医生。也可在 咨询医生 页面 1v1 对接。";
}

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: mockReply(text) }]);
    }, 500);
  };

  const toggleVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("当前浏览器暂不支持语音识别", { description: "请使用 Chrome/Edge/Safari 最新版" });
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "zh-CN";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(""); // eslint-disable-line @typescript-eslint/no-explicit-any
      setInput(t);
    };
    rec.onerror = () => { setListening(false); toast.error("语音识别中断"); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
    toast("正在聆听…", { description: "说出您的问题,我在听" });
  };

  return (
    <MobileShell>
      <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        {/* Header */}
        <header className="relative flex shrink-0 items-start justify-between px-5 pt-4">
          <div>
            <p className="flex items-center gap-1 text-lg font-bold text-primary">
              你好呀 <Sparkles className="size-4 text-primary" />
            </p>
            <p className="mt-0.5 text-lg font-bold text-primary">愿您康复顺利 · 身体轻盈</p>
          </div>
          <RoleSwitcher />
        </header>

        {/* Mascot / hero */}
        <div className="pointer-events-none absolute right-2 top-2 grid size-20 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-primary/20 blur-md" />
        <div className="pointer-events-none absolute right-16 top-3 grid size-14 place-items-center rounded-full bg-white/70 text-2xl shadow-[0_10px_30px_rgba(139,92,246,0.35)]">
          🧑‍⚕️
        </div>

        {/* Health status card */}
        <section className="mx-4 mt-4 shrink-0 rounded-2xl bg-white/95 p-3 shadow-[0_10px_30px_rgba(139,92,246,0.12)] ring-1 ring-primary/10">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-bold text-primary">
              <span className="inline-block h-4 w-1 rounded-full bg-primary" /> 我的健康
            </p>
          </div>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-500" /> 健康档案 · 已开启
            </li>
            <li className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                <span className="grid size-4 place-items-center rounded-full bg-primary text-[10px] text-white">!</span>
                完善个人健康数据
              </p>
              <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white active:scale-95">
                去完善
              </button>
            </li>
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="grid size-4 place-items-center rounded-full bg-muted text-[10px]">·</span>
              解锁个性化健康解读报告 · 待解锁
            </li>
          </ul>
        </section>

        {/* Chat area / preset questions */}
        <section ref={scrollRef} className="mx-4 mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto pb-2">
          {messages.length === 0 ? (
            presets.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.text}
                  onClick={() => send(p.text)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white/95 px-4 py-3.5 text-left shadow-[0_6px_20px_rgba(139,92,246,0.1)] ring-1 ring-primary/10 active:scale-[0.99]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {p.text}
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              );
            })
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                    m.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary text-white"
                      : "bg-white text-foreground ring-1 ring-primary/10",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Bottom composer (frozen) */}
        <div className="shrink-0 bg-gradient-to-t from-background via-background/95 to-background/70 pb-3 pt-4">
          {/* Quick chips */}
          <div className="no-scrollbar mx-3 mb-2 flex gap-2 overflow-x-auto">
            {quickChips.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="shrink-0 rounded-full border border-primary/30 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-primary shadow-sm active:scale-95"
              >
                {c}
              </button>
            ))}
          </div>
          {/* Input row */}
          <div className="mx-3 flex items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_10px_25px_rgba(139,92,246,0.2)] ring-1 ring-primary/10">
            <button
              onClick={toggleVoice}
              aria-label="语音输入"
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full transition",
                listening
                  ? "bg-gradient-to-br from-rose-500 to-primary text-white animate-pulse"
                  : "bg-primary/10 text-primary",
              )}
            >
              {listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder={listening ? "正在聆听…" : "对话内容已开启隐私保护"}
              className="min-w-0 flex-1 bg-transparent px-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {input.trim() ? (
              <button
                onClick={() => send()}
                aria-label="发送"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-white active:scale-95"
              >
                <Send className="size-4" />
              </button>
            ) : (
              <>
                <button aria-label="更多" className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground active:scale-95">
                  <Plus className="size-5" />
                </button>
                <button aria-label="拍照" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary active:scale-95">
                  <Camera className="size-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}