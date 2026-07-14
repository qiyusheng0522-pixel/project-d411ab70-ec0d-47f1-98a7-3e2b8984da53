import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, FileText, Activity, Users2, ChevronRight, AlertTriangle, Mic, Check } from "lucide-react";
import { plansSeed } from "./doctor.plans.index";
import { useState } from "react";

export const Route = createFileRoute("/doctor/plans/$id")({ component: PlanDetail });

function PlanDetail() {
  const { id } = Route.useParams();
  const p = plansSeed.find((x) => x.id === id) ?? plansSeed[0];
  const [recording, setRecording] = useState(false);

  const issues = extractIssues(p.disease, p.assessment);
  const [planSections, setPlanSections] = useState(() => structurePlan(p.plan));

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex items-center border-b border-border/60 bg-card px-3 py-3">
        <Link to="/doctor/plans" className="flex items-center gap-1 text-sm font-semibold text-sky-600 active:scale-95">
          <ChevronLeft className="size-4" /> 返回
        </Link>
        <p className="absolute left-1/2 -translate-x-1/2 text-base font-bold">方案详情</p>
        <span className="ml-auto rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold text-sky-600">
          {p.status === "reviewing" ? "审核中" : "待审核"}
        </span>
      </header>

      {/* 患者关键问题突出显示 */}
      <section className="mx-3 mt-3 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-amber-50 p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-base font-bold text-rose-700">
          <AlertTriangle className="size-4" /> 患者关键问题
        </p>
        <p className="mt-1 text-xs text-rose-600/80">{p.patient} · {p.disease}</p>
        <ul className="mt-3 space-y-1.5">
          {issues.map((it, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] font-medium text-foreground">
              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-500" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-foreground">{p.title}</p>
          <span className="flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-600">
            <Users2 className="size-3" /> 会诊查看
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
          <Field label="医院" value={p.hospital} />
          <Field label="科室" value={p.dept} />
          <Field label="评估时间" value={p.time} />
          <Field label="疾病" value={p.disease} accent />
          <Field label="方案状态" value="已生成" center />
          <Field label="风险状态" value="已评估" center />
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-base font-bold text-foreground">
          <FileText className="size-4 text-sky-600" /> 评估内容
        </p>
        <p className="mt-2 text-xs text-muted-foreground">普通评估</p>
        <div className="mt-2 rounded-xl bg-muted/60 p-3 text-[13px] leading-relaxed text-foreground/85">
          {p.assessment}
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-base font-bold text-foreground">
            <FileText className="size-4 text-sky-600" /> 方案内容
          </p>
          <button
            onClick={() => setRecording((v) => !v)}
            className={
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold active:scale-95 " +
              (recording ? "bg-rose-500 text-white" : "bg-sky-50 text-sky-600")
            }
          >
            <Mic className="size-3.5" /> {recording ? "录音中…" : "语音输入"}
          </button>
        </div>

        {/* 结构化模板预览 */}
        <div className="mt-3 space-y-2">
          {planSections.map((s, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-muted/40 p-3">
              <p className="flex items-center gap-1.5 text-[12px] font-bold text-sky-700">
                <span className="grid size-4 place-items-center rounded bg-sky-100 text-[10px]">{i + 1}</span>
                {s.title}
              </p>
              <textarea
                value={s.body}
                onChange={(e) => {
                  const v = e.target.value;
                  setPlanSections((prev) => prev.map((x, idx) => (idx === i ? { ...x, body: v } : x)));
                }}
                rows={3}
                className="mt-1.5 w-full resize-y rounded-lg border border-transparent bg-background/70 p-2 text-[13px] leading-relaxed text-foreground/90 outline-none focus:border-sky-400"
              />
            </div>
          ))}
        </div>
      </section>

      <Link
        to="/doctor/patients"
        className="mx-3 mt-3 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-sky-100 text-sky-600">
          <Activity className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">查看患者详情</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{p.patient} 的完整档案</p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>

      <div className="mx-3 my-4">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-full bg-sky-500 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] active:scale-[0.99]">
          <Check className="size-4" /> 确认
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, accent, center }: { label: string; value: string; accent?: boolean; center?: boolean }) {
  return (
    <div className={"rounded-xl bg-muted/60 p-3 " + (center ? "text-center" : "")}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={"mt-1 text-[13px] font-semibold " + (accent ? "text-sky-600" : "text-foreground")}>{value}</p>
    </div>
  );
}

function extractIssues(disease: string, _assessment: string): string[] {
  if (disease.includes("糖尿病")) {
    return [
      "BMI ≥ 30,存在肥胖,胰岛素抵抗风险高",
      "腰围 ≥ 95 cm,腹型肥胖显著",
      "收缩压 140-149 mmHg,合并高血压",
      "CDRS 评分 31 分,属糖尿病高风险人群",
      "长期疲乏、气短,建议排查代谢综合征",
    ];
  }
  if (disease.includes("甲状腺")) {
    return [
      "TI-RADS 3 类结节,恶性风险 <2%",
      "TSH / FT3 / FT4 目前在正常范围",
      "需 6-12 个月超声随访,警惕结节增大",
    ];
  }
  return [
    "HbA1c 由 7.6% → 8.1%,血糖控制不佳",
    "空腹血糖波动 7.0-8.5 mmol/L",
    "需评估用药依从性与饮食因素",
  ];
}

function structurePlan(text: string): { title: string; body: string }[] {
  // 结构化模板:饮食 / 运动 / 用药 / 监测 / 随访
  return [
    { title: "饮食管理", body: pick(text, ["饮食", "餐", "饮水", "糖", "盐", "奶"]) || "低糖低脂饮食,规律三餐,每日饮水 ≥ 2000 ml,控制外卖 ≤ 1 次/周。" },
    { title: "运动方案", body: pick(text, ["运动", "步行", "太极", "有氧"]) || "每周 5 天 × 30 分钟中等强度运动(快走 / 太极)。" },
    { title: "用药与治疗", body: pick(text, ["二甲双胍", "药", "SGLT2", "胰岛素", "剂量"]) || "遵医嘱用药,不擅自增减剂量。" },
    { title: "监测指标", body: pick(text, ["监测", "血糖", "血压", "腰围", "HbA1c", "复查"]) || "每周记录空腹与餐后 2h 血糖,每月测腰围与血压。" },
    { title: "随访计划", body: pick(text, ["随访", "复评", "门诊", "两周", "复查"]) || "每 2 周社区随访 1 次,4 周门诊复评 HbA1c。" },
  ];
}

function pick(text: string, keys: string[]): string {
  const sentences = text.split(/[。;;]/).map((s) => s.trim()).filter(Boolean);
  const hit = sentences.filter((s) => keys.some((k) => s.includes(k)));
  return hit.slice(0, 2).join("。") + (hit.length ? "。" : "");
}