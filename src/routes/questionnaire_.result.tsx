import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import {
  loadSelf, loadLife, ensureDefaultQuestionnaires,
  scoreEssen, essenLevel, befastPositive, scorePHQ9, phq9Level,
  scoreMed, medLevel, mrsLevel, scoreLife, bmiLevel,
  type Tone,
} from "@/lib/questionnaire";

export const Route = createFileRoute("/questionnaire_/result")({ component: ResultPage });

type Problem = {
  tag: string;
  tone: Tone;
  paragraphs: string[];
  advice?: string[];
  goals?: string[];
};

const toneTagBg: Record<Tone, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  danger: "bg-rose-500",
};

const toneChipActive: Record<Tone, string> = {
  ok: "bg-emerald-50 text-emerald-600 border-emerald-200",
  warn: "bg-amber-50 text-amber-600 border-amber-200",
  danger: "bg-rose-50 text-rose-600 border-rose-200",
};

// Candidate tags that may be shown as "concerns to watch" even if not triggered
const DEFAULT_WATCH_TAGS = [
  "预防三高", "血脂管理", "体重控制", "规律运动", "戒烟限酒", "睡眠健康", "情绪调节", "定期复诊",
];

function BodySilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 380" className={className} fill="currentColor" aria-hidden>
      <ellipse cx="100" cy="42" rx="26" ry="30" />
      <rect x="90" y="66" width="20" height="18" rx="6" />
      <path d="M62 92 Q100 78 138 92 L150 190 Q150 210 138 220 L62 220 Q50 210 50 190 Z" />
      <path d="M56 96 Q34 150 42 220 Q46 240 54 240 Q62 236 58 220 Q56 168 68 110 Z" />
      <path d="M144 96 Q166 150 158 220 Q154 240 146 240 Q138 236 142 220 Q144 168 132 110 Z" />
      <path d="M62 218 L138 218 L134 250 L66 250 Z" />
      <path d="M66 250 Q60 320 68 366 Q72 374 82 372 Q90 370 92 360 Q94 310 96 252 Z" />
      <path d="M134 250 Q140 320 132 366 Q128 374 118 372 Q110 370 108 360 Q106 310 104 252 Z" />
      <g opacity="0.35">
        <ellipse cx="88" cy="130" rx="14" ry="20" />
        <ellipse cx="112" cy="130" rx="14" ry="20" />
        <ellipse cx="100" cy="170" rx="18" ry="14" />
        <rect x="86" y="188" width="28" height="26" rx="8" />
      </g>
    </svg>
  );
}

function ResultPage() {
  const [ready, setReady] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    ensureDefaultQuestionnaires();
    const self = loadSelf();
    const life = loadLife();
    if (!self || !life) { setReady(true); return; }
    const s = self.answers;
    const l = life.answers;

    const built: Problem[] = [];

    const bf = befastPositive(s);
    if (bf > 0) {
      built.push({
        tag: "急性卒中征象", tone: "danger",
        paragraphs: [
          `您在近 24 小时内出现了 BE-FAST 中的 ${bf} 项阳性症状,提示可能正在发生急性脑卒中。`,
          "此类症状是脑血管意外的高度可疑信号,时间窗内的溶栓/取栓治疗对预后至关重要。",
          "请立即拨打 120 就医,不要自行驾车,也不要等待症状自行消退。",
        ],
      });
    }

    const essen = scoreEssen(s);
    const essenL = essenLevel(essen);
    if (essenL.tone !== "ok") {
      built.push({
        tag: "卒中复发风险", tone: essenL.tone,
        paragraphs: [
          `根据 Essen 评分,您当前累计 ${essen} 分,属于${essenL.label}人群,一年内卒中复发概率显著高于普通人。`,
          "多项传统危险因素(高血压、糖尿病、吸烟、既往 TIA/卒中等)叠加,会持续损伤血管内皮并加速动脉粥样硬化。",
          "建议规律服用抗血小板药与他汀,每 3 个月神经内科随访,并复查颈动脉超声与血脂。",
        ],
      });
    }

    const mrs = mrsLevel(s);
    if (mrs.tone !== "ok") {
      built.push({
        tag: "功能残障", tone: mrs.tone,
        paragraphs: [
          `改良 Rankin 评分为 ${mrs.score} 级(${mrs.label}),您在日常生活中存在不同程度的功能障碍。`,
          "长期缺乏结构化康复训练,肌力与协调性会进一步下降,并显著增加跌倒与继发感染风险。",
          "建议在康复科医生指导下每周 3~5 次康复训练,并请家属协助监督居家安全。",
        ],
      });
    }

    const phq = scorePHQ9(s);
    const phqL = phq9Level(phq);
    if (phqL.tone !== "ok") {
      built.push({
        tag: "情绪障碍", tone: phqL.tone,
        paragraphs: [
          `PHQ-9 抑郁筛查 ${phq} 分,提示存在${phqL.label}抑郁倾向。`,
          "卒中后抑郁会显著影响康复配合度与远期预后,还可能加重躯体不适与失眠。",
          Number(s.PHQ_09) > 0
            ? "您报告了自伤或自杀相关念头,请务必立即告知家属,并拨打心理援助热线 400-161-9995。"
            : "建议 2 周内前往心理科或神经内科接受进一步评估,必要时启动药物或心理治疗。",
        ],
      });
    }

    const med = scoreMed(s);
    const medL = medLevel(med);
    if (medL.tone !== "ok") {
      built.push({
        tag: "用药不规律", tone: medL.tone,
        paragraphs: [
          `您的用药依从性得分为 ${med.toFixed(1)} 分,处于${medL.label}区间。`,
          "抗血小板、他汀、降压等药物需长期维持稳态血药浓度,擅自停药或漏服会显著增加卒中复发风险。",
          "建议开启用药提醒、使用分药盒,并邀请家属协助核对每日用药。",
        ],
      });
    }

    const lifeScore = scoreLife(l);
    const bmiL = bmiLevel(lifeScore.bmi);
    if (bmiL && bmiL.tone !== "ok" && lifeScore.bmi != null) {
      built.push({
        tag: bmiL.label, tone: bmiL.tone,
        paragraphs: [
          `您的 BMI 为 ${lifeScore.bmi},属于${bmiL.label}范围。`,
          bmiL.label === "偏瘦"
            ? "体重偏低可能提示营养摄入不足或存在慢性消耗,需排查基础疾病并加强营养。"
            : "体重超出健康范围会加重血压、血糖与血脂负担,并显著增加睡眠呼吸暂停与心脑血管事件风险。",
          "建议在营养师指导下调整能量与蛋白摄入,并配合规律有氧运动逐步达标。",
        ],
      });
    }

    const dietIssues: string[] = [];
    if (Number(l.TASTE) >= 1) dietIssues.push("口味偏咸或偏油");
    if (Number(l.VEG) >= 1) dietIssues.push("蔬果摄入不足");
    if (Number(l.REDMEAT) >= 1) dietIssues.push("红肉/加工肉过多");
    if (Number(l.WATER) >= 1) dietIssues.push("每日饮水量偏少");
    if (dietIssues.length) {
      built.push({
        tag: "饮食结构失衡", tone: dietIssues.length >= 3 ? "danger" : "warn",
        paragraphs: [
          `您的饮食问卷中命中 ${dietIssues.length} 项风险因素,主要问题集中在:${dietIssues.join("、")}。`,
          "高盐、高脂、低膳食纤维的饮食结构与高血压、动脉粥样硬化直接相关,是可控风险中影响最大的一项。",
          "建议每日食盐 <5 g、蔬菜 ≥500 g,红肉每周 ≤500 g,并保证 1500~1700 ml 饮水量。",
        ],
      });
    }

    if (Number(l.EX_FREQ) >= 2 || Number(l.EX_DUR) >= 1) {
      built.push({
        tag: "运动不足", tone: Number(l.EX_FREQ) >= 3 ? "danger" : "warn",
        paragraphs: [
          "您每周中等强度运动频率或时长未达标,长期缺乏规律运动会导致心肺功能与代谢调控能力下降。",
          "建议每周至少 5 天、每次 30 分钟以上的快走、骑车或游泳,循序渐进累计达到 150 分钟/周。",
        ],
      });
    }

    if (Number(s.ESSEN_SMOKE) === 1 || Number(l.SMOKE) >= 2) {
      built.push({
        tag: "吸烟", tone: "danger",
        paragraphs: [
          "您目前仍在吸烟,这是最重要且可干预的卒中危险因素之一。",
          "吸烟通过损伤血管内皮、促进斑块形成使卒中风险成倍增加,同时降低药物疗效。",
          "戒烟 1 年后心血管风险下降约 50%,建议尽快预约戒烟门诊,可结合尼古丁替代或药物辅助。",
        ],
      });
    }

    if (Number(l.ALCOHOL) >= 2) {
      built.push({
        tag: "饮酒过量", tone: Number(l.ALCOHOL) >= 3 ? "danger" : "warn",
        paragraphs: [
          "您的饮酒频率已超出安全范围,长期过量饮酒会升高血压、诱发心律失常并增加出血性卒中风险。",
          "建议男性每日纯酒精摄入 <25 g、女性 <15 g,并鼓励逐步戒酒。",
        ],
      });
    }

    if (Number(l.SLEEP_H) >= 1 || Number(l.SLEEP_Q) >= 1) {
      built.push({
        tag: "睡眠不佳", tone: "warn",
        paragraphs: [
          "您的睡眠时长或质量未达标,睡眠不足或过多都会打乱血压节律并加重胰岛素抵抗。",
          "建议固定在 22:30 前入睡,保证 7~8 小时高质量睡眠;若打鼾严重需进一步筛查睡眠呼吸暂停。",
        ],
      });
    }

    if (Number(l.STRESS) >= 1 || Number(l.SOCIAL) >= 1) {
      built.push({
        tag: "压力偏高", tone: "warn",
        paragraphs: [
          "近期心理压力偏高或家庭社会支持较少,慢性应激会持续升高皮质醇水平,加重血压波动与情绪障碍。",
          "建议每日 10 分钟正念或深呼吸练习,主动与家人朋友沟通,必要时寻求专业心理咨询。",
        ],
      });
    }

    if (built.length === 0) {
      built.push({
        tag: "整体良好", tone: "ok",
        paragraphs: [
          "综合本次评估,您在卒中相关的可控风险因素上均处于健康区间,未发现明显异常。",
          "请继续保持当前的饮食、运动与用药习惯,并按计划定期复诊、复查关键指标。",
        ],
      });
    }

    setProblems(built);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <MobileShell>
        <div className="p-6 text-center text-sm text-muted-foreground">加载中…</div>
      </MobileShell>
    );
  }

  const primary = problems[0]?.tone ?? "ok";
  const bodyTint =
    primary === "danger" ? "text-rose-200/70"
    : primary === "warn" ? "text-amber-200/80"
    : "text-sky-200/70";

  return (
    <MobileShell>
      {/* 标题栏 */}
      <header className="relative mt-5 flex items-center justify-center px-4">
        <Link
          to="/questionnaire"
          className="absolute left-4 grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-[17px] font-bold text-foreground">档案评估详情</h1>
      </header>

      {/* 人体插画 */}
      <div className="relative mx-4 mt-4 flex justify-center rounded-2xl bg-gradient-to-b from-sky-50 to-white py-6">
        {problems[0] && (
          <span
            className={`absolute left-4 top-4 inline-flex items-center rounded-md px-3 py-1 text-[13px] font-bold text-white ${toneTagBg[problems[0].tone]}`}
          >
            {problems[0].tag}
          </span>
        )}
        <BodySilhouette className={`h-64 w-auto ${bodyTint}`} />
      </div>

      {/* 详情叙述 */}
      <section className="mx-4 mt-4 space-y-6 border-t border-border/60 pt-5 pb-6">
        {problems.map((p, idx) => (
          <div key={p.tag + idx} className="space-y-3">
            {idx > 0 && (
              <span
                className={`inline-flex items-center rounded-md px-3 py-1 text-[13px] font-bold text-white ${toneTagBg[p.tone]}`}
              >
                {p.tag}
              </span>
            )}
            {p.paragraphs.map((t, i) => (
              <p key={i} className="text-[15px] leading-[1.9] text-foreground/85">
                {t}
              </p>
            ))}
            {idx < problems.length - 1 && <div className="pt-3 border-b border-dashed border-border/60" />}
          </div>
        ))}
      </section>

      <div className="h-6" />
    </MobileShell>
  );
}