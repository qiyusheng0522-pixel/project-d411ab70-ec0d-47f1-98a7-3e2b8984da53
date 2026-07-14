export type Option = { value: number; label: string };
export type Question = {
  id: string;
  label: string;
  type: "radio" | "number";
  options?: Option[];
  suffix?: string;
};
export type Section = {
  id: string;
  title: string;
  desc?: string;
  questions: Question[];
};

const YN: Option[] = [
  { value: 0, label: "否" },
  { value: 1, label: "是" },
];
const NY: Option[] = [
  { value: 1, label: "否" },
  { value: 0, label: "是" },
];
const PHQ: Option[] = [
  { value: 0, label: "完全没有" },
  { value: 1, label: "有几天" },
  { value: 2, label: "一半以上天数" },
  { value: 3, label: "几乎每天" },
];

export const SELF_SECTIONS: Section[] = [
  {
    id: "essen",
    title: "Essen 脑卒中风险",
    desc: "根据个人危险因素评估卒中风险",
    questions: [
      {
        id: "ESSEN_AGE",
        label: "您的年龄属于以下哪一类?",
        type: "radio",
        options: [
          { value: 0, label: "<65 岁" },
          { value: 1, label: "65~75 岁" },
          { value: 2, label: ">75 岁" },
        ],
      },
      { id: "ESSEN_HTN", label: "是否有高血压?", type: "radio", options: YN },
      { id: "ESSEN_DM", label: "是否有糖尿病?", type: "radio", options: YN },
      { id: "ESSEN_MI", label: "既往是否发生过心肌梗死?", type: "radio", options: YN },
      { id: "ESSEN_OCV", label: "是否有其他心血管疾病?", type: "radio", options: YN },
      { id: "ESSEN_PAD", label: "是否有外周动脉疾病?", type: "radio", options: YN },
      { id: "ESSEN_SMOKE", label: "目前是否吸烟?", type: "radio", options: YN },
      { id: "ESSEN_TIA", label: "既往是否发生过 TIA 或卒中?", type: "radio", options: YN },
    ],
  },
  {
    id: "befast",
    title: "BE-FAST 急性卒中症状筛查",
    desc: "近 24 小时内是否出现以下任一症状",
    questions: [
      { id: "BF_BALANCE", label: "B 平衡:突发头晕或走路不稳?", type: "radio", options: YN },
      { id: "BF_EYES", label: "E 眼睛:突发视力下降或复视?", type: "radio", options: YN },
      { id: "BF_FACE", label: "F 面部:一侧口角歪斜?", type: "radio", options: YN },
      { id: "BF_ARM", label: "A 手臂:一侧肢体无力或麻木?", type: "radio", options: YN },
      { id: "BF_SPEECH", label: "S 言语:言语含糊或听不懂他人说话?", type: "radio", options: YN },
    ],
  },
  {
    id: "mrs",
    title: "mRS 残障评估",
    desc: "请选择最符合您目前状态的一项",
    questions: [
      {
        id: "MRS_SCORE",
        label: "当前功能状态",
        type: "radio",
        options: [
          { value: 0, label: "0 · 完全无症状" },
          { value: 1, label: "1 · 有症状但无明显残疾" },
          { value: 2, label: "2 · 轻度残疾" },
          { value: 3, label: "3 · 中度残疾,需部分帮助" },
          { value: 4, label: "4 · 中重度残疾,不能独立生活" },
          { value: 5, label: "5 · 重度残疾,卧床" },
        ],
      },
    ],
  },
  {
    id: "phq9",
    title: "PHQ-9 情绪筛查",
    desc: "过去 2 周,以下情况困扰您的频率",
    questions: [
      { id: "PHQ_01", label: "做事时提不起兴趣", type: "radio", options: PHQ },
      { id: "PHQ_02", label: "感到心情低落、沮丧或绝望", type: "radio", options: PHQ },
      { id: "PHQ_03", label: "入睡困难、睡不安稳或睡眠过多", type: "radio", options: PHQ },
      { id: "PHQ_04", label: "感觉疲倦或没有活力", type: "radio", options: PHQ },
      { id: "PHQ_05", label: "食欲不振或吃太多", type: "radio", options: PHQ },
      { id: "PHQ_06", label: "觉得自己很差劲或让家人失望", type: "radio", options: PHQ },
      { id: "PHQ_07", label: "注意力难以集中", type: "radio", options: PHQ },
      { id: "PHQ_08", label: "动作或说话缓慢,或异常烦躁", type: "radio", options: PHQ },
      { id: "PHQ_09", label: "有伤害自己或不如死了的念头", type: "radio", options: PHQ },
    ],
  },
  {
    id: "med",
    title: "用药依从性",
    desc: "关于日常用药情况",
    questions: [
      { id: "MED_01", label: "您是否有忘记服药的经历?", type: "radio", options: NY },
      { id: "MED_02", label: "您有时是否不注意服药?", type: "radio", options: NY },
      { id: "MED_03", label: "感觉症状好转时,是否曾停止服药?", type: "radio", options: NY },
      { id: "MED_04", label: "服药后感觉不适时,是否曾自行停药?", type: "radio", options: NY },
      { id: "MED_05", label: "您昨天是否按时服药了?", type: "radio", options: YN },
      {
        id: "MED_08",
        label: "您觉得按时按量服药有困难吗?",
        type: "radio",
        options: [
          { value: 1, label: "从不" },
          { value: 0.75, label: "偶尔" },
          { value: 0.5, label: "有时" },
          { value: 0.25, label: "经常" },
          { value: 0, label: "一直有困难" },
        ],
      },
    ],
  },
];

export const LIFE_SECTIONS: Section[] = [
  {
    id: "body",
    title: "身体指标",
    questions: [
      { id: "HEIGHT", label: "身高", type: "number", suffix: "cm" },
      { id: "WEIGHT", label: "体重", type: "number", suffix: "kg" },
      { id: "WAIST", label: "腰围", type: "number", suffix: "cm" },
    ],
  },
  {
    id: "diet",
    title: "饮食习惯",
    questions: [
      {
        id: "TASTE",
        label: "日常饮食口味",
        type: "radio",
        options: [
          { value: 0, label: "清淡" },
          { value: 1, label: "中等" },
          { value: 2, label: "偏咸偏油" },
        ],
      },
      {
        id: "VEG",
        label: "每日蔬菜水果摄入",
        type: "radio",
        options: [
          { value: 0, label: "≥5 份" },
          { value: 1, label: "3-4 份" },
          { value: 2, label: "≤2 份" },
        ],
      },
      {
        id: "REDMEAT",
        label: "红肉/加工肉每周次数",
        type: "radio",
        options: [
          { value: 0, label: "≤2 次" },
          { value: 1, label: "3-4 次" },
          { value: 2, label: "≥5 次" },
        ],
      },
      {
        id: "WATER",
        label: "每日饮水量",
        type: "radio",
        options: [
          { value: 0, label: "≥1500 ml" },
          { value: 1, label: "1000-1500 ml" },
          { value: 2, label: "<1000 ml" },
        ],
      },
    ],
  },
  {
    id: "exercise",
    title: "运动习惯",
    questions: [
      {
        id: "EX_FREQ",
        label: "每周中等强度运动次数",
        type: "radio",
        options: [
          { value: 0, label: "≥5 次" },
          { value: 1, label: "3-4 次" },
          { value: 2, label: "1-2 次" },
          { value: 3, label: "几乎没有" },
        ],
      },
      {
        id: "EX_DUR",
        label: "每次运动时长",
        type: "radio",
        options: [
          { value: 0, label: "≥30 分钟" },
          { value: 1, label: "15-30 分钟" },
          { value: 2, label: "<15 分钟" },
        ],
      },
    ],
  },
  {
    id: "habit",
    title: "烟酒习惯",
    questions: [
      {
        id: "SMOKE",
        label: "吸烟状况",
        type: "radio",
        options: [
          { value: 0, label: "从不吸烟" },
          { value: 1, label: "已戒烟" },
          { value: 2, label: "偶尔吸烟" },
          { value: 3, label: "每日吸烟" },
        ],
      },
      {
        id: "ALCOHOL",
        label: "饮酒频率",
        type: "radio",
        options: [
          { value: 0, label: "从不" },
          { value: 1, label: "每周<1 次" },
          { value: 2, label: "每周 1-3 次" },
          { value: 3, label: "每周≥4 次" },
        ],
      },
    ],
  },
  {
    id: "sleep",
    title: "睡眠与情绪",
    questions: [
      {
        id: "SLEEP_H",
        label: "每晚睡眠时长",
        type: "radio",
        options: [
          { value: 0, label: "7-8 小时" },
          { value: 1, label: "6-7 小时" },
          { value: 2, label: "<6 或 >9 小时" },
        ],
      },
      {
        id: "SLEEP_Q",
        label: "睡眠质量",
        type: "radio",
        options: [
          { value: 0, label: "很好" },
          { value: 1, label: "一般" },
          { value: 2, label: "较差" },
        ],
      },
      {
        id: "STRESS",
        label: "近期压力水平",
        type: "radio",
        options: [
          { value: 0, label: "较低" },
          { value: 1, label: "中等" },
          { value: 2, label: "较高" },
        ],
      },
      {
        id: "SOCIAL",
        label: "亲友支持程度",
        type: "radio",
        options: [
          { value: 0, label: "充分" },
          { value: 1, label: "一般" },
          { value: 2, label: "较少" },
        ],
      },
    ],
  },
];

export type Answers = Record<string, number>;
export type QResult = { answers: Answers; completedAt: string };

const KEY_SELF = "questionnaire:self";
const KEY_LIFE = "questionnaire:life";

function safeGet(k: string): QResult | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(k);
    return v ? (JSON.parse(v) as QResult) : null;
  } catch {
    return null;
  }
}
function safeSet(k: string, a: Answers) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(k, JSON.stringify({ answers: a, completedAt: new Date().toISOString() } satisfies QResult));
}

export const loadSelf = () => safeGet(KEY_SELF);
export const loadLife = () => safeGet(KEY_LIFE);
export const saveSelf = (a: Answers) => safeSet(KEY_SELF, a);
export const saveLife = (a: Answers) => safeSet(KEY_LIFE, a);

// 默认演示答案:让"我的问卷"默认已完成
export const DEFAULT_SELF_ANSWERS: Answers = {
  ESSEN_AGE: 1, ESSEN_HTN: 1, ESSEN_DM: 1, ESSEN_MI: 0,
  ESSEN_OCV: 0, ESSEN_PAD: 0, ESSEN_SMOKE: 1, ESSEN_TIA: 1,
  BF_BALANCE: 0, BF_EYES: 0, BF_FACE: 0, BF_ARM: 0, BF_SPEECH: 0,
  MRS_SCORE: 1,
  PHQ_01: 1, PHQ_02: 1, PHQ_03: 2, PHQ_04: 1,
  PHQ_05: 0, PHQ_06: 0, PHQ_07: 1, PHQ_08: 0, PHQ_09: 0,
  MED_01: 1, MED_02: 1, MED_03: 0, MED_04: 0, MED_05: 1, MED_08: 0.75,
};
export const DEFAULT_LIFE_ANSWERS: Answers = {
  HEIGHT: 172, WEIGHT: 78, WAIST: 92,
  TASTE: 1, VEG: 1, REDMEAT: 1, WATER: 1,
  EX_FREQ: 2, EX_DUR: 1,
  SMOKE: 2, ALCOHOL: 1,
  SLEEP_H: 1, SLEEP_Q: 1, STRESS: 1, SOCIAL: 0,
};

export function ensureDefaultQuestionnaires() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(KEY_SELF)) saveSelf(DEFAULT_SELF_ANSWERS);
  if (!window.localStorage.getItem(KEY_LIFE)) saveLife(DEFAULT_LIFE_ANSWERS);
}

export type Tone = "ok" | "warn" | "danger";

export function sum(a: Answers, keys: string[]) {
  return keys.reduce((s, k) => s + (Number(a[k]) || 0), 0);
}

// --- scoring ---
export function scoreEssen(a: Answers) {
  return sum(a, ["ESSEN_AGE", "ESSEN_HTN", "ESSEN_DM", "ESSEN_MI", "ESSEN_OCV", "ESSEN_PAD", "ESSEN_SMOKE", "ESSEN_TIA"]);
}
export function essenLevel(s: number): { label: string; tone: Tone } {
  if (s <= 2) return { label: "低风险", tone: "ok" };
  if (s <= 6) return { label: "高风险", tone: "warn" };
  return { label: "极高风险", tone: "danger" };
}

export function befastPositive(a: Answers) {
  return ["BF_BALANCE", "BF_EYES", "BF_FACE", "BF_ARM", "BF_SPEECH"].filter((k) => Number(a[k]) === 1).length;
}

export function scorePHQ9(a: Answers) {
  return sum(a, Array.from({ length: 9 }, (_, i) => `PHQ_0${i + 1}`));
}
export function phq9Level(s: number): { label: string; tone: Tone } {
  if (s <= 4) return { label: "无/极轻", tone: "ok" };
  if (s <= 9) return { label: "轻度", tone: "ok" };
  if (s <= 14) return { label: "中度", tone: "warn" };
  if (s <= 19) return { label: "中重度", tone: "warn" };
  return { label: "重度", tone: "danger" };
}

export function scoreMed(a: Answers) {
  return sum(a, ["MED_01", "MED_02", "MED_03", "MED_04", "MED_05", "MED_08"]);
}
export function medLevel(s: number): { label: string; tone: Tone } {
  if (s >= 5.5) return { label: "依从性良好", tone: "ok" };
  if (s >= 4) return { label: "依从性一般", tone: "warn" };
  return { label: "依从性差", tone: "danger" };
}

export function mrsLevel(a: Answers): { label: string; tone: Tone; score: number } {
  const s = Number(a["MRS_SCORE"]) || 0;
  if (s <= 2) return { label: "功能良好", tone: "ok", score: s };
  if (s === 3) return { label: "中度依赖", tone: "warn", score: s };
  return { label: "重度依赖", tone: "danger", score: s };
}

export function scoreLife(a: Answers) {
  const keys = ["TASTE", "VEG", "REDMEAT", "WATER", "EX_FREQ", "EX_DUR", "SMOKE", "ALCOHOL", "SLEEP_H", "SLEEP_Q", "STRESS", "SOCIAL"];
  const total = keys.reduce((s, k) => s + (Number(a[k]) || 0), 0);
  const h = Number(a["HEIGHT"]);
  const w = Number(a["WEIGHT"]);
  const bmi = h && w ? +(w / (h / 100) ** 2).toFixed(1) : null;
  return { total, bmi };
}
export function lifeLevel(s: number): { label: string; tone: Tone } {
  if (s <= 6) return { label: "健康", tone: "ok" };
  if (s <= 14) return { label: "需改善", tone: "warn" };
  return { label: "高风险", tone: "danger" };
}
export function bmiLevel(b: number | null): { label: string; tone: Tone } | null {
  if (b == null) return null;
  if (b < 18.5) return { label: "偏瘦", tone: "warn" };
  if (b < 24) return { label: "正常", tone: "ok" };
  if (b < 28) return { label: "超重", tone: "warn" };
  return { label: "肥胖", tone: "danger" };
}

// combined
export function combineRisk(selfAns: Answers, lifeAns: Answers): { label: string; tone: Tone } {
  const essen = essenLevel(scoreEssen(selfAns)).tone;
  const bf = befastPositive(selfAns) >= 1;
  const phq = phq9Level(scorePHQ9(selfAns)).tone;
  const med = medLevel(scoreMed(selfAns)).tone;
  const life = lifeLevel(scoreLife(lifeAns).total).tone;
  const tones = [essen, phq, med, life] as Tone[];
  if (bf || tones.includes("danger")) return { label: "高风险", tone: "danger" };
  if (tones.filter((t) => t === "warn").length >= 2) return { label: "中风险", tone: "warn" };
  if (tones.every((t) => t === "ok")) return { label: "低风险", tone: "ok" };
  return { label: "中风险", tone: "warn" };
}

export const toneStyle: Record<Tone, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
};
export const toneRing: Record<Tone, string> = {
  ok: "ring-emerald-200",
  warn: "ring-amber-200",
  danger: "ring-rose-200",
};