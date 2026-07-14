import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Trash2, Sparkles, AlertTriangle, CheckCircle2, Lightbulb, ImageIcon, ShieldCheck, Loader2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/reports_/$id")({ component: ReportDetail });

type ReportDetail = {
  id: string;
  title: string;
  date: string;
  tag: string;
  source: string;
  hospital: string;
  uploadedAt: string;
  items: { label: string; value: string; ref: string; status: "normal" | "high" | "low" }[];
  ai: {
    summary: string;
    findings: string[];
    advice: string[];
    risks: string[];
  };
};

const REPORTS: Record<string, ReportDetail> = {
  r1: {
    id: "r1",
    title: "2026 年 7 月健康月报",
    date: "2026-07-01",
    tag: "月报",
    source: "系统自动生成",
    hospital: "市第一人民医院 · 神经内科",
    uploadedAt: "2026.07.01",
    items: [
      { label: "平均收缩压", value: "138 mmHg", ref: "<140", status: "normal" },
      { label: "平均舒张压", value: "86 mmHg", ref: "<90", status: "normal" },
      { label: "静息心率", value: "74 bpm", ref: "60-100", status: "normal" },
      { label: "空腹血糖", value: "6.2 mmol/L", ref: "3.9-6.1", status: "high" },
    ],
    ai: {
      summary: "本月血压整体控制良好,较上月下降 4 mmHg,提示当前用药方案有效。空腹血糖略高于正常上限,需关注饮食结构。",
      findings: [
        "血压达标率 86%,晨峰现象基本消失。",
        "空腹血糖 3 次超过 6.1 mmol/L,集中在周末。",
        "静息心率平稳,无明显波动。",
      ],
      advice: [
        "继续现有降压方案,保持每日早晚测量。",
        "减少精制糖与含糖饮料摄入,主食粗细搭配。",
        "每周至少 150 分钟中等强度有氧运动。",
      ],
      risks: ["若空腹血糖持续 >6.5 mmol/L,建议加测糖化血红蛋白。"],
    },
  },
  r2: {
    id: "r2",
    title: "卒中康复季度评估",
    date: "2026-06-30",
    tag: "季报",
    source: "康复科 · 李医生",
    hospital: "市第一人民医院 · 卒中康复中心",
    uploadedAt: "2026.06.30",
    items: [
      { label: "NIHSS", value: "3 分", ref: "越低越好", status: "normal" },
      { label: "mRS", value: "2 级", ref: "0-2 良好", status: "normal" },
      { label: "Barthel", value: "85 分", ref: ">60 轻度依赖", status: "normal" },
      { label: "MoCA", value: "24 分", ref: "≥26 正常", status: "low" },
    ],
    ai: {
      summary: "本季度运动功能较上一季度提升约 12%,日常生活自理能力接近独立;认知评分略低于正常阈值,建议加强认知训练。",
      findings: [
        "步态稳定性显著改善,跌倒风险下降。",
        "上肢精细动作恢复较慢,握力偏弱。",
        "MoCA 主要失分在延迟回忆与注意力。",
      ],
      advice: [
        "继续每周 3 次康复训练,增加手部精细动作练习。",
        "每日安排 15 分钟认知训练(数字回忆、看图记忆)。",
        "保证 7 小时睡眠,有助于认知恢复。",
      ],
      risks: ["情绪低落可能影响康复速度,必要时可评估卒中后抑郁量表。"],
    },
  },
  r3: {
    id: "r3",
    title: "血脂随访分析",
    date: "2026-06-15",
    tag: "专项",
    source: "检验科",
    hospital: "南京市第一医院检验科",
    uploadedAt: "2026.06.15",
    items: [
      { label: "LDL-C", value: "1.7 mmol/L", ref: "<1.8", status: "normal" },
      { label: "HDL-C", value: "1.2 mmol/L", ref: ">1.0", status: "normal" },
      { label: "总胆固醇", value: "3.9 mmol/L", ref: "<5.2", status: "normal" },
      { label: "甘油三酯", value: "1.9 mmol/L", ref: "<1.7", status: "high" },
    ],
    ai: {
      summary: "LDL-C 已达到卒中二级预防目标(<1.8 mmol/L),他汀治疗有效。甘油三酯轻度升高,与饮食及体重相关。",
      findings: [
        "LDL-C 较上次下降 0.4 mmol/L。",
        "HDL-C 稳定在保护范围内。",
        "甘油三酯连续 2 次高于参考值。",
      ],
      advice: [
        "继续服用他汀,3 个月后复查肝功与肌酶。",
        "减少油炸食品与酒精摄入。",
        "增加深海鱼类,补充 Omega-3。",
      ],
      risks: ["若甘油三酯 >2.3 mmol/L,可考虑联合贝特类药物,需医生评估。"],
    },
  },
  r4: {
    id: "r4",
    title: "2026 年 6 月健康月报",
    date: "2026-06-01",
    tag: "月报",
    source: "系统自动生成",
    hospital: "系统汇总(多家机构)",
    uploadedAt: "2026.06.01",
    items: [
      { label: "平均收缩压", value: "142 mmHg", ref: "<140", status: "high" },
      { label: "平均舒张压", value: "88 mmHg", ref: "<90", status: "normal" },
      { label: "睡眠时长", value: "6.1 h", ref: "7-9", status: "low" },
      { label: "步数均值", value: "5,800 步", ref: ">6000", status: "low" },
    ],
    ai: {
      summary: "整体指标平稳,收缩压偶有超标,睡眠不足与运动量不够可能是主要影响因素。",
      findings: [
        "夜间血压波动较大,需关注睡眠质量。",
        "工作日步数明显低于周末。",
        "服药依从性 92%,表现良好。",
      ],
      advice: [
        "固定就寝时间,睡前 1 小时远离电子屏幕。",
        "利用碎片时间散步,目标 8000 步/日。",
        "如收缩压持续 >140,建议就诊调整用药。",
      ],
      risks: ["长期睡眠不足会加重高血压与卒中复发风险。"],
    },
  },
};

const statusStyle: Record<"normal" | "high" | "low", string> = {
  normal: "bg-emerald-50 text-emerald-600",
  high: "bg-rose-50 text-rose-600",
  low: "bg-amber-50 text-amber-600",
};

const statusLabel: Record<"normal" | "high" | "low", string> = {
  normal: "正常",
  high: "偏高",
  low: "偏低",
};

function ReportDetail() {
  const { id } = Route.useParams();
  const report = REPORTS[id];
  if (!report) throw notFound();
  const [aiState, setAiState] = useState<"idle" | "loading" | "done">("idle");

  const runInterpret = () => {
    if (aiState === "loading") return;
    setAiState("loading");
    setTimeout(() => setAiState("done"), 1200);
  };

  return (
    <MobileShell>
      {/* Top bar */}
      <header className="relative flex items-center justify-center px-4 pt-5">
        <Link
          to="/reports"
          className="absolute left-4 top-5 grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-bold text-foreground">报告单详情</h1>
        <button className="absolute right-4 top-5 grid size-9 place-items-center rounded-full bg-card text-muted-foreground shadow-[var(--shadow-card)]">
          <Trash2 className="size-[18px]" />
        </button>
      </header>

      {/* Info card */}
      <section className="mx-4 mt-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex gap-4">
          <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
            <ImageIcon className="size-8 text-slate-400" strokeWidth={1.5} />
            <span className="absolute inset-x-0 bottom-0 bg-black/45 py-1 text-center text-[10px] font-medium text-white">
              图片预览
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold leading-snug text-foreground">{report.title}</p>
            <dl className="mt-2 space-y-1 text-[12px] leading-relaxed">
              <InfoRow label="就诊医院" value={report.hospital} />
              <InfoRow label="报告时间" value={report.date.replace(/-/g, ".")} />
              <InfoRow label="上传时间" value={report.uploadedAt} />
              <InfoRow label="数据来源" value={report.source} />
            </dl>
          </div>
        </div>
      </section>

      {/* AI section title */}
      <div className="mt-5 px-5">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-foreground">
          <Sparkles className="size-4 text-violet-500" /> AI 解读
        </h2>
      </div>

      {/* AI content */}
      {aiState !== "done" ? (
        <section className="mx-4 mt-3 rounded-2xl bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col items-center py-4 text-center">
            <div className="grid size-32 place-items-center rounded-full bg-gradient-to-br from-violet-100 via-sky-100 to-white">
              {aiState === "loading" ? (
                <Loader2 className="size-10 animate-spin text-violet-500" />
              ) : (
                <Sparkles className="size-12 text-violet-400" strokeWidth={1.5} />
              )}
            </div>
            <p className="mt-4 text-base font-bold text-foreground">
              {aiState === "loading" ? "AI 正在解读中…" : "暂时没有解读内容"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {aiState === "loading"
                ? "请稍候,预计几秒内完成"
                : "点击下方 AI 解读按钮,查看详细解读和健康建议"}
            </p>
          </div>
        </section>
      ) : (
        <section className="mx-4 mt-3 space-y-3">
          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="text-sm leading-relaxed text-foreground/85">{report.ai.summary}</p>
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" /> 主要发现
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/80">
              {report.ai.findings.map((f, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Lightbulb className="size-4 text-amber-500" /> 健康建议
            </p>
            <ul className="space-y-1.5 text-sm text-foreground/80">
              {report.ai.advice.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {report.ai.risks.length > 0 && (
            <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-rose-600">
                <AlertTriangle className="size-4" /> 风险提示
              </p>
              <ul className="space-y-1.5 text-sm text-foreground/80">
                {report.ai.risks.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-rose-400">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Privacy note */}
      <p className="mt-5 flex items-center justify-center gap-1 px-4 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        档案内容仅供您本人使用,我们将严格保护您的隐私安全
      </p>

      {/* Spacer for sticky bar */}
      <div className="h-28" />

      {/* Sticky action bar */}
      <div className="sticky bottom-0 -mx-0 border-t border-border/60 bg-card/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button className="h-11 flex-1 rounded-full bg-background text-sm font-semibold text-foreground ring-1 ring-border active:scale-[0.99]">
            修改
          </button>
          <button
            onClick={runInterpret}
            disabled={aiState === "loading"}
            className="h-11 flex-[1.4] rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-sm font-semibold text-white shadow-[var(--shadow-soft)] active:scale-[0.99] disabled:opacity-70"
          >
            {aiState === "loading" ? "解读中…" : aiState === "done" ? "重新解读" : "AI 智能解读"}
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 text-foreground/85">{value}</dd>
    </div>
  );
}