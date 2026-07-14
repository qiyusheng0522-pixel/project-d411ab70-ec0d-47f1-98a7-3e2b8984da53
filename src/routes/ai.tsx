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
  { icon: Hash, text: "如何用 FAST 法快速识别卒中先兆?" },
  { icon: Hash, text: "抗血小板药阿司匹林 + 氯吡格雷需要吃多久?" },
  { icon: Hash, text: "颈动脉狭窄 60% 需要手术吗?" },
];

const quickChips = ["卒中识别", "抗栓治疗", "血压管理", "康复训练", "复发预防"];

function mockReply(q: string): string {
  if (/阿司匹林|氯吡格雷|抗血小板|抗凝|利伐沙班|华法林|NOAC|药/.test(q)) return "缺血性卒中/TIA 后建议长期单药抗血小板(阿司匹林 100 mg qd 或氯吡格雷 75 mg qd);高危患者短程双抗 21 天后转单药。房颤患者优先 NOAC 抗凝。切勿自行停药,警惕黑便、鼻衄等出血信号。";
  if (/FAST|识别|先兆|症状|发作/.test(q)) return "FAST 识别法:F(Face 面瘫)、A(Arm 单侧无力)、S(Speech 言语含糊)、T(Time 立即拨打 120)。发病 4.5 小时内为静脉溶栓黄金窗,6-24 小时内可评估血管内取栓。";
  if (/血压|高血压|降压/.test(q)) return "卒中二级预防血压目标 <130/80 mmHg;推荐晨起服用长效降压药(ACEI/ARB/CCB),每日晨起测量并记录。突发血压 >180/110 mmHg 或伴头痛呕吐立即就诊。";
  if (/颈动脉|狭窄|斑块/.test(q)) return "颈动脉狭窄 50-69% 首选强化药物治疗(他汀 + 抗血小板 + 危险因素控制);≥70% 有症状者可评估颈动脉内膜剥脱术(CEA)或支架(CAS),请神经内/外科门诊会诊。";
  if (/康复|训练|偏瘫|言语|吞咽/.test(q)) return "卒中后 24-48 小时病情稳定即可启动床旁康复;PT/OT 每日 2 次,言语与吞咽训练循序渐进。家属参与被动关节活动,避免关节挛缩与压疮。";
  if (/饮食|吃|营养/.test(q)) return "卒中患者推荐地中海饮食:每日蔬菜 ≥500 g、深海鱼每周 2-3 次、限盐 <5 g/日、限糖限饱和脂肪;戒烟限酒,控制体重。";
  if (/运动|锻炼/.test(q)) return "病情稳定后每周 ≥150 分钟中等强度有氧(快走、骑车、游泳)+ 2 次抗阻训练;运动前后测血压,避免屏气用力。";
  return "我已记录您的问题,建议结合您的头颅影像、颈动脉超声与近期血压/血脂记录,进一步咨询神经内科医生。也可在 咨询医生 页面 1v1 对接。";
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