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
  if (disease.includes("TIA") || disease.includes("短暂")) {
    return [
      "ABCD² 评分 5 分,48h 内卒中风险高",
      "既往高血压 10 年,近月控制不佳",
      "颈动脉斑块负荷中等,存在动脉粥样硬化",
      "吸烟史 20 年,尚未戒烟",
    ];
  }
  if (disease.includes("房颤") || disease.includes("心源性")) {
    return [
      "CHA₂DS₂-VASc 5 分,卒中年发生率 >6%",
      "非瓣膜性房颤,已启动 NOAC 抗凝",
      "HAS-BLED 2 分,出血风险中等",
      "左心房增大,需长期心律监测",
    ];
  }
  if (disease.includes("恢复期") || disease.includes("康复")) {
    return [
      "mRS 3 级,日常活动部分依赖",
      "右侧偏瘫 Brunnstrom Ⅲ-Ⅳ 期",
      "轻度构音障碍,吞咽功能待复评",
      "LDL-C 2.1 mmol/L,需继续强化他汀",
    ];
  }
  return [
    "Essen 评分 4 分,卒中复发高风险",
    "颈动脉狭窄 60%,存在血流受限",
    "血压波动 140-160/90 mmHg,控制不佳",
    "NIHSS 4 分,轻度神经功能缺损",
    "吸烟史 30 年,已戒 6 个月",
  ];
}


function structurePlan(text: string): { title: string; body: string }[] {
  // 结构化模板:药物 / 康复 / 饮食 / 监测 / 随访
  return [
    { title: "药物治疗", body: pick(text, ["阿司匹林", "氯吡格雷", "他汀", "抗血小板", "抗凝", "利伐沙班", "NOAC", "药"]) || "遵医嘱规律服用抗血小板与他汀,勿自行停药。" },
    { title: "康复训练", body: pick(text, ["康复", "PT", "OT", "训练", "言语", "肢体", "偏瘫"]) || "每日肢体主动+被动训练 2 次,言语与吞咽训练循序进行。" },
    { title: "饮食管理", body: pick(text, ["饮食", "低盐", "低脂", "深海鱼", "蔬果", "戒烟", "限酒"]) || "低盐(<5 g/日)低脂饮食,增加蔬果与深海鱼,戒烟限酒。" },
    { title: "监测指标", body: pick(text, ["血压", "LDL", "血脂", "颈动脉", "NIHSS", "mRS", "心率", "监测"]) || "每日晨起血压、每周体重与步态;每 3 个月复查血脂与颈动脉超声。" },
    { title: "随访计划", body: pick(text, ["随访", "复评", "门诊", "两周", "复查"]) || "每 2 周神经内科门诊随访,评估 NIHSS / mRS 与药物依从性。" },
  ];
}


function pick(text: string, keys: string[]): string {
  const sentences = text.split(/[。;;]/).map((s) => s.trim()).filter(Boolean);
  const hit = sentences.filter((s) => keys.some((k) => s.includes(k)));
  return hit.slice(0, 2).join("。") + (hit.length ? "。" : "");
}