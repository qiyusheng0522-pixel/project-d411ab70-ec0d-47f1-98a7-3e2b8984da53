import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Info, RefreshCcw, Sparkles, ClipboardList, CheckCircle2, X,
  ShieldCheck, FileText, Activity, ChevronRight, AlertTriangle, Footprints, Wind, BookOpen,
  Play, Medal, Trophy, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import anatomyBody from "@/assets/anatomy-body.png";
import {
  loadSelf, loadLife,
  scoreEssen, essenLevel, scorePHQ9, phq9Level, scoreMed, medLevel,
  scoreLife, lifeLevel, bmiLevel, combineRisk, toneStyle,
  type Tone,
} from "@/lib/questionnaire";
import { readAllScaleResults } from "@/lib/scale-status";

export const Route = createFileRoute("/plan")({ component: Plan });

type Meal = { name: string; weight: string; emoji: string; herbal?: boolean };
type MealGroup = { id: string; label: string; kcal: number; items: Meal[] };
type SchemeKey = "nutrition" | "herbal";
type Scheme = {
  macros: { carb: number; fat: number; protein: number };
  grams: { carb: number; fat: number; protein: number };
  meals: MealGroup[];
};

const nutritionMeals: MealGroup[] = [
  {
    id: "b", label: "早餐", kcal: 443.96,
    items: [
      { name: "蒸鸡蛋", weight: "50克", emoji: "🥚" },
      { name: "蒸山药", weight: "125克", emoji: "🍠", herbal: true },
      { name: "芹菜木耳炒蛋", weight: "150克", emoji: "🥬" },
      { name: "牛奶", weight: "250克", emoji: "🥛" },
    ],
  },
  {
    id: "l", label: "午餐", kcal: 575.8,
    items: [
      { name: "韭菜炒牛肉", weight: "267.63克", emoji: "🥩" },
      { name: "海带拌腐竹", weight: "151.65克", emoji: "🥗", herbal: true },
      { name: "二米饭", weight: "71.36克", emoji: "🍚" },
    ],
  },
  {
    id: "d", label: "晚餐", kcal: 441.37,
    items: [
      { name: "青椒莴笋炒猪肝", weight: "149.61克", emoji: "🫑" },
      { name: "豆芽炒粉条", weight: "112.2克", emoji: "🍜" },
    ],
  },
];

const herbalMeals: MealGroup[] = [
  {
    id: "b", label: "早餐", kcal: 412.5,
    items: [
      { name: "山药百合粥", weight: "200克", emoji: "🥣", herbal: true },
      { name: "蒸南瓜", weight: "120克", emoji: "🎃", herbal: true },
      { name: "水煮蛋", weight: "50克", emoji: "🥚" },
    ],
  },
  {
    id: "l", label: "午餐", kcal: 548.2,
    items: [
      { name: "黄芪枸杞炖鸡", weight: "180克", emoji: "🍲", herbal: true },
      { name: "凉拌黑木耳", weight: "120克", emoji: "🥗", herbal: true },
      { name: "杂粮饭", weight: "80克", emoji: "🍚" },
    ],
  },
  {
    id: "d", label: "晚餐", kcal: 431.6,
    items: [
      { name: "茯苓莲子排骨汤", weight: "200克", emoji: "🍜", herbal: true },
      { name: "清炒西兰花", weight: "150克", emoji: "🥦" },
      { name: "红薯", weight: "100克", emoji: "🍠", herbal: true },
    ],
  },
];

const schemes: Record<SchemeKey, Scheme> = {
  nutrition: {
    macros: { carb: 53, fat: 16, protein: 31 },
    grams: { carb: 161.5, fat: 48.2, protein: 94.4 },
    meals: nutritionMeals,
  },
  herbal: {
    macros: { carb: 48, fat: 20, protein: 32 },
    grams: { carb: 142.3, fat: 56.8, protein: 88.1 },
    meals: herbalMeals,
  },
};

const dates = ["05/21", "05/22", "05/23", "05/24", "05/25", "05/26", "05/27"];

/* ============ 生活方式 mini 量表 ============ */
const LS_KEY = "plan-lifestyle-v1";
type LifestyleAnswers = Record<string, boolean>;
type LifestyleQ = { id: string; text: string; risk: string };
const lifestyleQs: LifestyleQ[] = [
  { id: "salt", text: "您平时口味是否偏咸或喜欢腌制食品？", risk: "口味偏重" },
  { id: "oil", text: "每周吃油炸/红烧/肥肉类是否 ≥ 3 次？", risk: "高油饮食" },
  { id: "sugar", text: "您是否爱喝含糖饮料或常吃甜点？", risk: "高糖摄入" },
  { id: "water", text: "每天饮水量是否少于 1500 毫升？", risk: "饮水不足" },
  { id: "move", text: "每周中等强度运动是否少于 3 次？", risk: "缺乏运动" },
  { id: "smoke", text: "是否仍在吸烟或近一年内戒烟？", risk: "吸烟史" },
];

function loadLifestyle(): LifestyleAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as LifestyleAnswers) : null;
  } catch { return null; }
}

function Plan() {
  const [tab, setTab] = useState<SchemeKey>("nutrition");
  const [activeDate, setActiveDate] = useState(dates[0]);
  const [lifestyle, setLifestyle] = useState<LifestyleAnswers | null>(null);
  const [scaleOpen, setScaleOpen] = useState(false);
  const [confirmSwapAll, setConfirmSwapAll] = useState(false);

  useEffect(() => { setLifestyle(loadLifestyle()); }, []);

  const filled = !!lifestyle;
  const riskTags = useMemo(
    () => lifestyle ? lifestyleQs.filter((q) => lifestyle[q.id]).map((q) => q.risk) : [],
    [lifestyle],
  );

  const baseScheme = schemes[tab];
  const kcalAdjust = filled ? riskTags.length * -30 : 0;
  const baseKcal = baseScheme.meals.reduce((s, m) => s + m.kcal, 0);
  const totalKcal = baseKcal + kcalAdjust;
  const macros = baseScheme.macros;
  const grams = baseScheme.grams;

  const handleSwitchScheme = (next: SchemeKey) => {
    if (next === tab) return;
    setTab(next);
    toast.success(`已切换为${next === "nutrition" ? "营养方案" : "药食同源"}`, {
      description: "营养结构与今日推荐已同步更新",
    });
  };

  const handleSwapAll = () => {
    setConfirmSwapAll(false);
    toast.success("已为您重新搭配", { description: `${activeDate} 全天食谱已更换` });
  };

  return (
    <MobileShell>
      <PageHeader title="健康方案" subtitle="为您量身定制的卒中专病饮食与生活方式" />

      {/* 量表提示 / 精准模式徽标 */}
      {!filled ? (
        <section className="mx-4 mt-1 overflow-hidden rounded-3xl border-2 border-amber-300 bg-amber-50 p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-400 text-white">
              <ClipboardList className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-amber-900">还差一步即可获得"精准方案"</p>
              <p className="mt-1 text-sm text-amber-800">
                花 1 分钟填写一份简短的生活方式量表，我们将根据您的饮食习惯、运动情况个性化推荐食谱。
              </p>
              <Button onClick={() => setScaleOpen(true)}
                className="mt-3 h-11 rounded-2xl bg-amber-500 px-5 text-base font-bold text-white hover:bg-amber-600">
                <Sparkles className="size-4" /> 立即填写（约 1 分钟）
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <div className="mx-4 mt-1 flex items-center justify-between rounded-full bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700 ring-1 ring-emerald-200">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3.5" />
            <span className="font-semibold">精准模式已开启</span>
          </span>
          <button onClick={() => setScaleOpen(true)}
            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100">
            重新评估
          </button>
        </div>
      )}

      {/* 健康摘要：疾病 & 生活风险标签 */}
      <section className="mx-4 mt-3 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 via-sky-50/60 to-white p-4 pb-5 shadow-[var(--shadow-card)]">
        <p className="text-center text-[13px] font-semibold text-sky-700/80">
          您当前的疾病与生活风险画像
        </p>

        {/* 图例 */}
        <div className="mt-2 flex items-center justify-center gap-5 text-[12px] font-medium">
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="inline-block size-2 rounded-full bg-rose-500" />
            疾病风险
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            生活风险
          </span>
        </div>

        {/* 人体图 + 左右分类标签 */}
        <div className="relative mx-auto mt-3 h-[360px] w-full max-w-[360px]">
          <img
            src={anatomyBody}
            alt="人体解剖示意"
            width={640}
            height={1024}
            loading="lazy"
            className="absolute left-1/2 top-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
          />

          {/* 左：疾病 */}
          <div className="absolute left-0 top-2 flex flex-col items-start gap-2.5">
            {["缺血性卒中", "高血压", "2型糖尿病"].map((t) => (
              <span
                key={"d-" + t}
                className="inline-flex items-center rounded-md bg-rose-500 px-2.5 py-1 text-[13px] font-semibold text-white shadow-md"
              >
                {t}
              </span>
            ))}
          </div>

          {/* 右：生活方式 */}
          <div className="absolute right-0 top-2 flex flex-col items-end gap-2.5">
            {filled ? (
              riskTags.length > 0 ? (
                riskTags.slice(0, 4).map((r) => (
                  <span
                    key={"l-" + r}
                    className="inline-flex items-center rounded-md bg-emerald-500 px-2.5 py-1 text-[13px] font-semibold text-white shadow-md"
                  >
                    {r}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center rounded-md bg-emerald-500 px-2.5 py-1 text-[13px] font-semibold text-white shadow-md">
                  习惯良好
                </span>
              )
            ) : (
              <>
                <span className="inline-flex items-center rounded-md bg-emerald-300 px-2.5 py-1 text-[13px] font-semibold text-white shadow-md">
                  待评估
                </span>
                <button
                  onClick={() => setScaleOpen(true)}
                  className="inline-flex items-center rounded-md bg-amber-500 px-2.5 py-1 text-[13px] font-semibold text-white shadow-md active:scale-95"
                >
                  去填写量表
                </button>
              </>
            )}
          </div>
        </div>

        {filled && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-emerald-700">
            <Sparkles className="size-3.5" /> 已根据量表识别您的健康画像
          </p>
        )}
      </section>

      {/* 饮食方案 */}
      <section className="mx-4 mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 to-sky-50 shadow-[var(--shadow-card)]">
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xl font-bold text-foreground">
              {filled ? "专属饮食方案" : "通用推荐方案"}
            </p>
            {filled && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                精准推荐
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {filled ? "已根据量表规避不良习惯所致风险" : "填写量表后可获得个性化方案"}
          </p>


          <div className="mt-4 flex gap-2">
            {([
              { id: "nutrition", label: "营养方案" },
              { id: "herbal", label: "药食同源" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => handleSwitchScheme(t.id)}
                className={cn(
                  "rounded-2xl px-5 py-2 text-base font-bold transition",
                  tab === t.id
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-white/70 text-muted-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-center text-base text-muted-foreground">
            当前您执行的是
            <span className="ml-1 font-bold text-amber-600">
              {tab === "nutrition" ? "营养方案" : "药食同源"}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="whitespace-nowrap text-base text-foreground">
              用餐时间：<span className="font-medium">07:30 – 18:00</span>
            </p>
            <span className="whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              已选该方案
            </span>
          </div>

          {/* Macro ring */}
          <div className="mt-5 flex items-center gap-4">
            <MacroRing macros={macros} kcal={totalKcal} />
            <div className="min-w-0 flex-1 space-y-2 text-sm">
              <Legend color="bg-amber-400" label="碳水化合物" value={`${grams.carb} g`} pct={macros.carb} />
              <Legend color="bg-blue-500" label="脂肪" value={`${grams.fat} g`} pct={macros.fat} />
              <Legend color="bg-cyan-400" label="蛋白质" value={`${grams.protein} g`} pct={macros.protein} />
            </div>
          </div>

          {/* Date strip */}
          <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto border-t border-border/60 pt-3">
            {dates.map((d) => {
              const active = d === activeDate;
              return (
                <button key={d} onClick={() => setActiveDate(d)} className="flex flex-col items-center">
                  <span className={cn("text-base", active ? "font-bold text-primary" : "text-muted-foreground")}>{d}</span>
                  {active && <span className="mt-1 h-1 w-6 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            带 <Info className="size-3.5 text-rose-500" /> 食谱包含卫健委公布的药食同源药材
          </p>
        </div>
      </section>

      {/* 每餐明细 */}
      <section className="mx-4 mt-5 space-y-5">
        <div className="text-base text-muted-foreground">
          今日总热量 <span className="text-lg font-bold text-foreground">{totalKcal.toFixed(0)}</span> 千卡
          {filled && kcalAdjust !== 0 && (
            <span className="ml-2 text-xs text-emerald-600">已根据您的生活方式调整 {kcalAdjust} 千卡</span>
          )}
        </div>
        {baseScheme.meals.map((g) => (
          <div key={g.id}>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-lg font-bold text-foreground">
                {g.label} <span className="ml-1 text-sm font-normal text-muted-foreground">{g.kcal} 千卡</span>
              </p>
            </div>
            <ul className="space-y-2.5 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
              {g.items.map((it) => (
                <li key={it.name} className="flex items-center gap-3 rounded-xl p-2">
                  <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-accent text-3xl">
                    {it.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-lg font-bold text-foreground">
                      {it.name}
                      {it.herbal && <Info className="size-4 text-rose-500" />}
                    </p>
                    <p className="mt-0.5 text-base text-muted-foreground">{it.weight}</p>
                  </div>
                  <button
                    onClick={() => toast.success(`已为您更换"${it.name}"`, { description: "新食材保持营养均衡" })}
                    className="rounded-full border border-primary/40 px-4 py-1.5 text-sm font-medium text-primary active:scale-95">
                    换一换
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* 底部：全部换 */}
      <div className="mx-4 mt-6">
        <button
          onClick={() => setConfirmSwapAll(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-white py-3.5 text-base font-bold text-primary shadow-sm active:scale-95">
          <RefreshCcw className="size-5" /> 不想吃，全部换
        </button>
      </div>

      {/* 运动方案 */}
      <ExercisePlan riskCount={riskTags.length} />

      <div className="h-6" />

      {scaleOpen && (
        <LifestyleScaleSheet
          initial={lifestyle ?? {}}
          onClose={() => setScaleOpen(false)}
          onSubmit={(ans) => {
            try { localStorage.setItem(LS_KEY, JSON.stringify(ans)); } catch { /* ignore */ }
            setLifestyle(ans);
            setScaleOpen(false);
            const count = lifestyleQs.filter((q) => ans[q.id]).length;
            toast.success("量表已完成，方案已升级为精准模式 ✨", {
              description: count > 0 ? `识别出 ${count} 项可改善的生活习惯` : "未发现明显不良习惯，请继续保持",
            });
          }}
        />
      )}

      <AlertDialog open={confirmSwapAll} onOpenChange={setConfirmSwapAll}>
        <AlertDialogContent className="max-w-sm rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">确定要更换全天食谱吗？</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              系统会根据您的疾病和{filled ? "生活方式" : "通用建议"}重新搭配 {activeDate} 的三餐。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-11 rounded-2xl text-base">再想想</AlertDialogCancel>
            <AlertDialogAction onClick={handleSwapAll} className="h-11 rounded-2xl text-base">
              全部换
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}

function Legend({ color, label, value, pct }: { color: string; label: string; value: string; pct?: number }) {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className={`size-2.5 shrink-0 rounded-full ${color}`} />
      <span className="text-foreground">{label}</span>
      <span className="ml-auto text-muted-foreground">{value}</span>
      {pct !== undefined && <span className="text-xs text-muted-foreground">· {pct}%</span>}
    </div>
  );
}

/* ============ 运动方案 ============ */
type Exercise = {
  id: string;
  name: string;
  level: string;         // 入门 / 进阶
  tags: string[];        // #糖尿病前期
  timeSlot: string;      // 午餐后 13:00
  duration: string;      // 8-10 分钟
  coach: string;         // 刘虹
  coachTitle: string;    // 奥运竞走冠军
  coachTime: string;     // 08:12
  learners: string;      // 12.6 万
  courseTitle: string;   // 8 分钟控糖快走法 · 餐后激活
  goal: string;          // 800 步 · 配速 6km/h
  streak: number;        // 连续 12 天
  done: boolean;
  emoji: string;         // 封面表情
  gradient: string;      // 封面渐变
  icon: typeof Footprints;
  intensity: string;
  frequency: string;
  target: string;
  steps: string[];
  guide: { title: string; source: string };
};

const exercises: Exercise[] = [
  {
    id: "walk",
    name: "餐后控糖快走",
    level: "入门",
    tags: ["糖尿病前期", "餐后血糖偏高", "久坐办公"],
    timeSlot: "午餐后 13:00",
    coach: "刘虹",
    coachTitle: "奥运竞走冠军",
    coachTime: "08:12",
    learners: "12.6 万",
    courseTitle: "8 分钟控糖快走法 · 餐后激活",
    goal: "800 步 · 配速 6km/h",
    streak: 12,
    done: true,
    emoji: "🚶‍♀️",
    gradient: "from-amber-300 via-orange-300 to-yellow-200",
    icon: Footprints,
    intensity: "中低强度 · 40–60% 最大心率",
    frequency: "每周 3–5 次",
    duration: "8-10 分钟",
    target: "改善心肺功能、辅助降压降糖、降低卒中复发风险",
    steps: [
      "热身 5 分钟:原地踏步 + 关节活动",
      "主活动 20–30 分钟:平坦路面匀速快走,能说话不能唱歌为宜",
      "放松 5 分钟:慢走 + 小腿拉伸",
      "记录:走完测量心率与血压,异常及时上报医生",
    ],
    guide: {
      title: "AHA/ASA《卒中幸存者体力活动与运动建议》(2014)",
      source: "美国心脏协会/卒中协会",
    },
  },
  {
    id: "taichi",
    name: "护膝静力训练",
    level: "入门",
    tags: ["高血压", "膝关节不适", "肌少风险"],
    timeSlot: "今晚 19:30",
    coach: "邹凯",
    coachTitle: "体操奥运冠军",
    coachTime: "12:30",
    learners: "8.3 万",
    courseTitle: "护膝静力训练 · 高血压人群友好",
    goal: "3 组 × 每侧 30 秒",
    streak: 5,
    done: false,
    emoji: "🧘‍♂️",
    gradient: "from-sky-300 via-cyan-200 to-blue-200",
    icon: Wind,
    intensity: "低强度 · 自感轻松略吃力",
    frequency: "每周 3 次",
    duration: "12 分钟",
    target: "提升平衡能力、下肢力量,降低跌倒风险,改善睡眠情绪",
    steps: [
      "预备式:两脚开立与肩同宽,呼吸自然",
      "循序练习起势 → 野马分鬃 → 白鹤亮翅 等 8 组基础动作",
      "动作缓慢圆活,身体重心过渡平稳,不闭气",
      "初期建议在他人陪同或扶稳条件下练习",
    ],
    guide: {
      title: "《中国脑卒中康复治疗指南》太极运动推荐 (2022)",
      source: "国家卫健委脑卒中防治工程委员会",
    },
  },
];

function ExercisePlan({ riskCount }: { riskCount: number }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [items, setItems] = useState(exercises);
  const [authed, setAuthed] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);

  return (
    <section className="mx-4 mt-6">
      {/* 微信步数授权 */}
      {!authed && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)]">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Footprints className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">授权微信步数</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">同步每日步数,自动计入运动量</p>
          </div>
          <button
            onClick={() => { setAuthed(true); toast.success("已授权微信步数"); }}
            className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white active:scale-95"
          >
            立即授权
          </button>
        </div>
      )}

      {/* 今日运动清单 */}
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-lg font-bold text-foreground">
          <Activity className="size-4 text-sky-500" /> 今日运动清单
          <span className="rounded-md bg-sky-100 px-1.5 py-0.5 text-[11px] font-semibold text-sky-600">
            {items.length} 项
          </span>
        </p>
        <button className="flex items-center gap-0.5 text-xs font-semibold text-sky-600">
          打卡记录 <ChevronRight className="size-3.5" />
        </button>
      </div>

      {/* 风险提示（默认收起） */}
      <div className="mb-3 overflow-hidden rounded-2xl border border-rose-200 bg-rose-50">
        <button
          type="button"
          onClick={() => setRiskOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 p-3.5 text-left"
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-rose-500 text-white">
            <AlertTriangle className="size-4" />
          </div>
          <p className="flex-1 text-sm font-bold text-rose-800">运动风险提示 · 请务必阅读</p>
          <ChevronRight className={cn("size-4 text-rose-500 transition-transform", riskOpen && "rotate-90")} />
        </button>
        {riskOpen && (
          <div className="px-3.5 pb-3.5 pl-[3.75rem]">
            <ul className="space-y-1 text-[12px] leading-relaxed text-rose-800/90">
              <li>· 运动前测量血压,静息 &gt; 160/100 mmHg 或未控糖时暂缓;</li>
              <li>· 出现胸痛、头晕、心悸、单侧无力、言语不清立即停止并就医(BE-FAST);</li>
              <li>· 建议家属或康复师在旁陪同,佩戴防跌倒鞋具;</li>
              <li>· 抗凝、抗血小板治疗期间避免对抗性或高跌倒风险运动。</li>
            </ul>
            {riskCount > 0 && (
              <p className="mt-2 rounded-lg bg-white/70 px-2 py-1 text-[11px] text-rose-700">
                检测到 {riskCount} 项不良生活方式,已为您选择低强度起始方案。
              </p>
            )}
          </div>
        )}
      </div>

      <ul className="space-y-4">
        {items.map((e) => {
          const open = openId === e.id;
          return (
            <li key={e.id} className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] ring-1 ring-border/40">
              {/* 顶部:海报 + 标题 + 标签 */}
              <div className="flex gap-3 p-3">
                {/* 左侧封面 */}
                <div className={cn(
                  "relative flex aspect-[3/4] w-[112px] shrink-0 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-2",
                  e.gradient,
                )}>
                  <span className="w-fit rounded-md bg-amber-500/95 px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                    🏅 奥运冠军陪练
                  </span>
                  <div className="grid grow place-items-center">
                    <div className="relative">
                      <span className="text-4xl drop-shadow">{e.emoji}</span>
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid size-7 place-items-center rounded-full bg-white/90 shadow">
                          <Play className="size-3.5 fill-sky-600 text-sky-600" />
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="w-fit rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {e.coach} · {e.coachTime}
                  </span>
                </div>

                {/* 右侧信息 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-base font-bold text-foreground">{e.name}</p>
                    <span className="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-semibold text-sky-600">
                      {e.level}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {e.tags.map((t) => (
                      <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Clock className="size-3" />{e.timeSlot}</span>
                    <span className="flex items-center gap-0.5"><Activity className="size-3" />{e.duration}</span>
                  </div>
                </div>
              </div>

              {/* 中部:课程条 + 跟练 */}
              <div className="mx-3 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 p-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
                  <Medal className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">{e.courseTitle}</p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    {e.coach} · {e.coachTitle} · {e.learners} 次学习
                  </p>
                </div>
                <button className="flex shrink-0 items-center gap-0.5 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white active:scale-95">
                  <Play className="size-3 fill-white" /> 跟练
                </button>
              </div>

              {/* 底部:目标 + 打卡 */}
              <div className="mx-3 mt-2 flex items-center gap-2 rounded-xl bg-muted/50 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground">今日目标</p>
                  <p className="mt-0.5 text-sm font-bold text-foreground">{e.goal}</p>
                  <p className="mt-1 flex items-center gap-0.5 text-[10px] text-amber-600">
                    <Trophy className="size-3" /> 已连续 {e.streak} 天
                  </p>
                </div>
                <button
                  onClick={() => {
                    setItems((prev) => prev.map((x) => x.id === e.id ? { ...x, done: !x.done, streak: !x.done ? x.streak + 1 : x.streak } : x));
                    if (!e.done) toast.success("已打卡", { description: e.name });
                  }}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-bold active:scale-95",
                    e.done
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-sky-500 text-white shadow-[var(--shadow-soft)]",
                  )}
                >
                  {e.done ? "✓ 已打卡" : "○ 去打卡"}
                </button>
              </div>

              <button
                onClick={() => setOpenId(open ? null : e.id)}
                className="mt-1 flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-primary active:opacity-70"
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5" /> 查看运动指南与循证来源
                </span>
                <ChevronRight className={cn("size-4 transition", open && "rotate-90")} />
              </button>
              {open && (
                <div className="space-y-3 border-t border-border/60 px-4 pb-4 pt-3">
                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2 text-[11px]">
                    <div><p className="text-muted-foreground">强度</p><p className="mt-0.5 font-semibold text-foreground">{e.intensity.split(" · ")[0]}</p></div>
                    <div><p className="text-muted-foreground">频率</p><p className="mt-0.5 font-semibold text-foreground">{e.frequency}</p></div>
                    <div><p className="text-muted-foreground">时长</p><p className="mt-0.5 font-semibold text-foreground">{e.duration}</p></div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">目标</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{e.target}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">动作要点</p>
                    <ol className="mt-1 space-y-1 text-[13px] leading-relaxed text-foreground/80">
                      {e.steps.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="rounded-xl bg-sky-50 p-2.5 ring-1 ring-sky-100">
                    <p className="flex items-center gap-1 text-[11px] font-bold text-sky-800">
                      <FileText className="size-3.5" /> 循证来源
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-sky-900/80">{e.guide.title}</p>
                    <p className="mt-0.5 text-[11px] text-sky-700/80">{e.guide.source}</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SCALE_IDS = ["essen", "mrs", "barthel", "eat10", "phq9", "gad7", "mnasf", "medadh", "fall"];

function RiskAssessmentCard() {
  const [selfAns, setSelfAns] = useState<Record<string, number> | null>(null);
  const [lifeAns, setLifeAns] = useState<Record<string, number> | null>(null);
  const [scaleCount, setScaleCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setSelfAns(loadSelf()?.answers ?? null);
      setLifeAns(loadLife()?.answers ?? null);
      const s = readAllScaleResults(SCALE_IDS);
      setScaleCount(Object.values(s).filter(Boolean).length);
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const hasSelf = !!selfAns;
  const hasLife = !!lifeAns;
  const overall = hasSelf && hasLife ? combineRisk(selfAns!, lifeAns!) : null;

  const factors: { label: string; value: string; tone: Tone }[] = [];
  if (hasSelf) {
    const es = scoreEssen(selfAns!); const el = essenLevel(es);
    factors.push({ label: "卒中复发风险", value: `${el.label} · ${es}分`, tone: el.tone });
    const pq = scorePHQ9(selfAns!); const pl = phq9Level(pq);
    factors.push({ label: "情绪状态", value: `${pl.label} · ${pq}分`, tone: pl.tone });
    const md = scoreMed(selfAns!); const ml = medLevel(md);
    factors.push({ label: "用药依从", value: ml.label, tone: ml.tone });
  }
  if (hasLife) {
    const { total, bmi } = scoreLife(lifeAns!);
    const ll = lifeLevel(total);
    factors.push({ label: "生活方式", value: ll.label, tone: ll.tone });
    const bl = bmiLevel(bmi);
    if (bl && bmi != null) factors.push({ label: "体重(BMI)", value: `${bl.label} · ${bmi}`, tone: bl.tone });
  }

  const missing = !hasSelf || !hasLife;
  const targetTo = missing ? "/questionnaire" : "/questionnaire_/result";

  return (
    <Link
      to={targetTo}
      className="mx-4 mt-5 block overflow-hidden rounded-3xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "grid size-11 shrink-0 place-items-center rounded-2xl",
          overall ? toneStyle[overall.tone] : "bg-muted text-muted-foreground",
        )}>
          <ShieldCheck className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-foreground">个人风险评估</p>
            {overall && (
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", toneStyle[overall.tone])}>
                总体 · {overall.label}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">基于健康档案、问卷量表与日常打卡综合评估</p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </div>

      {/* 数据来源 */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <SourceChip icon={FileText} label="健康档案" ok={hasSelf || hasLife} detail="已同步" />
        <SourceChip icon={ClipboardList} label="问卷量表" ok={hasSelf && hasLife} detail={`${(hasSelf ? 1 : 0) + (hasLife ? 1 : 0)}/2`} />
        <SourceChip icon={Activity} label="打卡记录" ok={scaleCount > 0} detail={`${scaleCount} 项`} />
      </div>

      {/* 因子明细 */}
      {factors.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {factors.map((f) => (
            <li key={f.label} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
              <span className="text-sm text-foreground">{f.label}</span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", toneStyle[f.tone])}>
                {f.value}
              </span>
            </li>
          ))}
        </ul>
      )}

      {missing ? (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
          <span>完成问卷生成完整评估</span>
          <ChevronRight className="size-4" />
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-muted px-4 py-2.5 text-sm font-semibold text-foreground">
          <span>查看完整风险评估报告</span>
          <ChevronRight className="size-4" />
        </div>
      )}
    </Link>
  );
}

function SourceChip({ icon: Icon, label, ok, detail }: { icon: typeof FileText; label: string; ok: boolean; detail: string }) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-1 rounded-2xl border p-2 text-center",
      ok ? "border-emerald-200 bg-emerald-50" : "border-border bg-muted/40",
    )}>
      <Icon className={cn("size-4", ok ? "text-emerald-600" : "text-muted-foreground")} />
      <span className="text-[11px] font-semibold text-foreground">{label}</span>
      <span className={cn("text-[10px]", ok ? "text-emerald-700" : "text-muted-foreground")}>
        {ok ? detail : "待完善"}
      </span>
    </div>
  );
}

function Tag({ children, tone, size = "md" }: { children: ReactNode; tone: "rose" | "amber" | "emerald" | "muted"; size?: "md" | "lg" }) {
  const styles: Record<string, string> = {
    rose: "bg-rose-50 text-rose-600 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    muted: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn(
      "block w-full whitespace-nowrap rounded-full border text-center font-bold shadow-sm",
      size === "lg" ? "px-3 py-2.5 text-base" : "px-2 py-1.5 text-sm",
      styles[tone],
    )}>
      {children}
    </span>
  );
}

function MacroRing({ macros, kcal }: { macros: { carb: number; fat: number; protein: number }; kcal: number }) {
  const C = 2 * Math.PI * 42;
  const segs = [
    { color: "#fbbf24", pct: macros.carb / 100 },
    { color: "#3b82f6", pct: macros.fat / 100 },
    { color: "#22d3ee", pct: macros.protein / 100 },
  ];
  let offset = 0;
  return (
    <div className="relative size-32 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        {segs.map((s, i) => {
          const len = C * s.pct;
          const el = (
            <circle key={i} cx="50" cy="50" r="42" fill="none" stroke={s.color} strokeWidth="10"
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} strokeLinecap="butt"
              style={{ transition: "stroke-dasharray 500ms ease, stroke-dashoffset 500ms ease" }} />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">{Math.round(kcal)}</span>
        <span className="text-xs text-muted-foreground">Kcal</span>
      </div>
    </div>
  );
}

function LifestyleScaleSheet({ initial, onClose, onSubmit }: {
  initial: LifestyleAnswers;
  onClose: () => void;
  onSubmit: (a: LifestyleAnswers) => void;
}) {
  const [answers, setAnswers] = useState<LifestyleAnswers>(initial);
  const answered = lifestyleQs.filter((q) => answers[q.id] !== undefined).length;
  const progress = Math.round((answered / lifestyleQs.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:absolute md:rounded-[2.4rem]"
      onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">生活方式简评</h3>
            <p className="text-sm text-muted-foreground">共 {lifestyleQs.length} 题 · 约 1 分钟</p>
          </div>
          <button onClick={onClose} className="p-1"><X className="size-5 text-muted-foreground" /></button>
        </div>
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <ol className="space-y-3">
          {lifestyleQs.map((q, i) => (
            <li key={q.id} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-base font-semibold text-foreground">
                <span className="mr-1.5 text-primary">{i + 1}.</span>{q.text}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[{ label: "是", val: true }, { label: "否", val: false }].map((opt) => {
                  const selected = answers[q.id] === opt.val;
                  return (
                    <button key={opt.label}
                      onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt.val }))}
                      className={cn(
                        "flex h-12 items-center justify-center gap-1.5 rounded-2xl border-2 text-base font-bold transition",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground/80 active:bg-accent",
                      )}
                    >
                      {selected && <CheckCircle2 className="size-4" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        <Button
          disabled={answered < lifestyleQs.length}
          onClick={() => onSubmit(answers)}
          className="mt-5 h-12 w-full rounded-2xl text-base">
          {answered < lifestyleQs.length ? `还有 ${lifestyleQs.length - answered} 题未完成` : "提交并生成精准方案"}
        </Button>
      </div>
    </div>
  );
}