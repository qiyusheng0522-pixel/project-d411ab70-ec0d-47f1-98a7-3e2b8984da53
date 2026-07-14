import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
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

    // Attach advice + goals per tag
    const adviceMap: Record<string, { advice: string[]; goals: string[] }> = {
      "急性卒中征象": {
        advice: ["立即拨打 120,不要自行驾车前往医院", "记录症状出现时间,便于溶栓/取栓评估", "保持平卧,勿进食进水以防误吸"],
        goals: ["4.5 小时内到达具备卒中救治能力的医院", "24 小时内完成头颅影像与病因初步评估"],
      },
      "卒中复发风险": {
        advice: ["每日规律服用抗血小板与他汀类药物,勿自行停药", "每 3 个月神经内科随访一次,复查血脂与颈动脉超声", "严格控制血压、血糖并记录晨起数值"],
        goals: ["血压 <140/90 mmHg,糖化血红蛋白 <7%", "LDL-C 降至 <1.8 mmol/L", "一年内 Essen 复评分数下降 ≥1 分"],
      },
      "功能残障": {
        advice: ["每周 3~5 次在康复科指导下进行结构化训练", "家中加装扶手与防滑垫,减少跌倒风险", "家属协助记录 ADL 完成情况并鼓励自主完成"],
        goals: ["3 个月内 mRS 评分下降 1 级", "独立完成穿衣、如厕等基础日常活动"],
      },
      "情绪障碍": {
        advice: ["2 周内前往心理科或神经内科进行专业评估", "保持每日 30 分钟户外活动与规律作息", "主动与家人朋友倾诉,必要时寻求心理咨询"],
        goals: ["3 个月内 PHQ-9 评分回落至 <10 分", "重建规律睡眠与社交节律"],
      },
      "用药不规律": {
        advice: ["使用分药盒并设置手机用药提醒", "邀请家属每日核对用药并做记录", "如有副作用及时复诊,勿自行减停"],
        goals: ["月度用药依从率 ≥95%", "下次随访 MMAS-8 评分达到高依从"],
      },
      "偏瘦": {
        advice: ["排查慢性消耗性疾病及消化吸收问题", "每日增加优质蛋白 1.0~1.2 g/kg", "少食多餐,适度增加坚果与全谷物"],
        goals: ["3 个月内 BMI 恢复至 18.5~23.9", "肌肉量与握力同步提升"],
      },
      "超重": {
        advice: ["每日能量摄入减少 300~500 kcal", "配合每周 150 分钟中等强度有氧运动", "限盐、限油、减少含糖饮料"],
        goals: ["6 个月内 BMI 回落至 <24", "腰围男 <90 cm、女 <85 cm"],
      },
      "肥胖": {
        advice: ["在营养师指导下制定个体化减重方案", "每周至少 5 次、每次 30 分钟以上有氧运动", "必要时寻求专业代谢减重门诊帮助"],
        goals: ["6 个月内体重下降 5%~10%", "空腹血糖、血脂逐步回归正常范围"],
      },
      "饮食结构失衡": {
        advice: ["每日食盐 <5 g,烹调用油 25~30 g", "每天蔬菜 ≥500 g、水果 200~350 g", "红肉每周 ≤500 g,多用鱼禽豆类替代"],
        goals: ["1 个月内建立稳定的低盐低脂饮食习惯", "血压与 LDL-C 指标改善"],
      },
      "运动不足": {
        advice: ["每周至少 5 天、每次 30 分钟中等强度运动", "从快走开始,循序渐进增加强度与时长", "结合居家拉伸与力量训练避免损伤"],
        goals: ["累计达到 150 分钟/周的中等强度运动", "静息心率下降 5~10 次/分"],
      },
      "吸烟": {
        advice: ["尽快预约戒烟门诊,可结合尼古丁替代", "清理家中烟具,避免二手烟环境", "识别吸烟触发点并制定替代应对方式"],
        goals: ["1 个月内每日吸烟量减半", "6 个月内完全戒断"],
      },
      "饮酒过量": {
        advice: ["设定每周无酒日并逐步减量", "避免空腹饮酒与烈性酒", "必要时寻求戒酒门诊药物辅助"],
        goals: ["男性每日纯酒精 <25 g、女性 <15 g", "3 个月内完全戒酒或稳定低量"],
      },
      "睡眠不佳": {
        advice: ["固定 22:30 前入睡,每日睡眠 7~8 小时", "睡前 1 小时远离手机与刺激性饮食", "打鼾严重者进行睡眠呼吸监测"],
        goals: ["匹兹堡睡眠质量指数 (PSQI) <7 分", "夜间觉醒次数 ≤1 次"],
      },
      "压力偏高": {
        advice: ["每日 10 分钟正念冥想或深呼吸练习", "主动与家人朋友沟通,建立支持网络", "必要时寻求专业心理咨询"],
        goals: ["感知压力量表 (PSS) 评分明显下降", "情绪与睡眠同步改善"],
      },
      "整体良好": {
        advice: ["保持当前饮食、运动与用药习惯", "每 6~12 个月完成一次卒中风险复评", "留意 BE-FAST 症状,出现异常立即就医"],
        goals: ["核心指标(血压、血脂、血糖、BMI)持续达标", "维持规律作息与积极心态"],
      },
    };
    for (const p of built) {
      const extra = adviceMap[p.tag];
      if (extra) {
        p.advice = extra.advice;
        p.goals = extra.goals;
      }
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

  // Build tag ring: active problem tags first, then default watch tags to fill
  const activeTags = problems.filter((p) => p.tone !== "ok").map((p) => ({ label: p.tag, tone: p.tone, active: true }));
  const usedNames = new Set(activeTags.map((t) => t.label));
  const filler = DEFAULT_WATCH_TAGS.filter((t) => !usedNames.has(t)).slice(0, Math.max(0, 6 - activeTags.length))
    .map((t) => ({ label: t, tone: "ok" as Tone, active: false }));
  const ringTags = [...activeTags, ...filler].slice(0, 6);

  // Ring positions: 6 slots around the circle (top-left, top-right, mid-left, mid-right, bottom-left, bottom-right)
  const ringPositions = [
    "left-0 top-4",
    "right-0 top-4",
    "left-[-8px] top-1/2 -translate-y-1/2",
    "right-[-8px] top-1/2 -translate-y-1/2",
    "left-2 bottom-4",
    "right-2 bottom-4",
  ];




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

      {/* 风险标签环形展示 */}
      <div className="mx-4 mt-4 rounded-3xl bg-gradient-to-b from-sky-50 via-sky-50/60 to-white p-4 pb-6">
        <p className="text-center text-[13px] font-medium text-sky-700/80">
          您当前建议关注的卒中及生活风险
        </p>
        <div className="relative mx-auto mt-3 h-[260px] w-full max-w-[360px]">
          {/* 中心圆盘 + 人体 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative grid size-[160px] place-items-center rounded-full bg-gradient-to-br from-sky-100 via-white to-violet-100 shadow-[0_10px_30px_-12px_rgba(56,189,248,0.55)] ring-4 ring-white">
              <BodySilhouette className={`h-32 w-auto ${bodyTint}`} />
              <span className="absolute right-4 top-6 text-sky-300">✦</span>
              <span className="absolute left-5 bottom-8 text-violet-300">✦</span>
            </div>
          </div>
          {/* 环形标签 */}
          {ringTags.map((t, i) => (
            <span
              key={t.label + i}
              className={`absolute inline-flex max-w-[7.5rem] items-center justify-center rounded-full border px-3 py-1.5 text-[13px] font-semibold shadow-sm ${
                t.active
                  ? toneChipActive[t.tone]
                  : "border-slate-200 bg-white/80 text-slate-400"
              } ${ringPositions[i]}`}
            >
              {t.label}
            </span>
          ))}
        </div>
        {activeTags.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {activeTags.map((t) => (
              <span
                key={"legend-" + t.label}
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold text-white ${toneTagBg[t.tone]}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 风险评估展示内容 */}
      <section className="mx-4 mt-5 mb-6 space-y-4">
        <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-[14px] leading-[1.85] text-foreground/85">
            初步判定您属于<span className="font-bold text-rose-500">脑卒中高危人群</span>，结合日常指标为您说明：
          </p>
        </div>

        <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] space-y-2">
          <h3 className="text-[15px] font-bold text-foreground">现状说明</h3>
          <p className="text-[14px] leading-[1.85] text-foreground/85">
            血管高危人群只要长期规范养护血压、血脂，就能大幅降低脑梗、脑出血发病概率，无需过度焦虑。
          </p>
          <p className="text-[14px] leading-[1.85] text-foreground/85">
            高危提示仅代表血管存在损伤诱因，及时调整饮食、作息、用药，可平稳保护脑血管。
          </p>
        </div>

        <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-[15px] font-bold text-foreground">
            每日日常血管养护<span className="text-[12px] font-medium text-emerald-600">（坚持就能见效）</span>
          </h3>
          <ol className="space-y-2.5">
            {[
              "早晚监测血压、定期复查血脂，完整留存数值记录",
              "遵从线下医生处方服药，不擅自停服降压、稳脂药物",
              "饮食控盐控油，避开咸菜、肥肉、油炸食品，增加杂粮、果蔬摄入",
              "避免长期久坐、熬夜、暴怒，每周坚持快走、太极等温和运动",
            ].map((tip, i) => (
              <li key={tip} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
                  {i + 1}
                </span>
                <p className="flex-1 text-[14px] leading-[1.8] text-foreground/85">{tip}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-violet-50 p-4 shadow-[var(--shadow-card)]">
          <h3 className="mb-2 text-[15px] font-bold text-foreground">
            定期专项复查<span className="text-[12px] font-medium text-sky-600">（每年必做）</span>
          </h3>
          <p className="text-[14px] leading-[1.85] text-foreground/85">
            每年完成颈动脉彩超、血脂四项、基础脑血管筛查，提前发现血管斑块及时干预。
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-sky-50 p-4 shadow-[var(--shadow-card)]">
          <h3 className="mb-2 text-[15px] font-bold text-foreground">专属血管养护帮扶</h3>
          <p className="text-[14px] leading-[1.85] text-foreground/85">
            如果还不清楚低盐低脂餐搭配、不知道适合心脑血管人群的运动强度，可咨询健康管理师，定制贴合您生活习惯的个性化养护方案。
          </p>
        </div>
      </section>

      <div className="h-6" />
    </MobileShell>
  );
}