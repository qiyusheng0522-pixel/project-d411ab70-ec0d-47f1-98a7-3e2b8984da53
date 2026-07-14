import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Search, Users2, ChevronRight } from "lucide-react";
import { PortalShell } from "@/components/PortalShell";
import { doctorTabs } from "./doctor.index";
import { useState } from "react";

export const Route = createFileRoute("/doctor/plans/")({ component: DoctorPlans });

export type PlanStatus = "pending" | "reviewing";

export const plansSeed = [
  {
    id: "pl1",
    patient: "张伟",
    title: "急性缺血性卒中二级预防方案",
    dept: "神经内科",
    hospital: "鼓楼医院",
    disease: "缺血性卒中",
    time: "2026-04-02 18:44:18",
    status: "reviewing" as PlanStatus,
    tag: "需就诊",
    assessment:
      "根据 Essen 卒中风险评分,患者 68 岁(1 分)、既往高血压(1 分)、颈动脉狭窄(1 分)、吸烟史(1 分),总分 4 分,属于卒中复发高风险人群(≥3 分)。头颅 MRI 提示左侧基底节区急性梗死灶,NIHSS 4 分,mRS 2 级;颈动脉超声示右侧颈内动脉起始段狭窄约 60%。建议启动强化二级预防:抗血小板 + 他汀 + 血压管理,并进行早期康复评估。",
    plan:
      "药物:阿司匹林 100 mg qd + 氯吡格雷 75 mg qd(短程双抗 21 天后转单抗)、阿托伐他汀 40 mg qn,目标 LDL-C <1.8 mmol/L;血压目标 <130/80 mmHg。饮食:低盐(每日 <5 g)低脂,增加深海鱼与蔬果,戒烟限酒。康复:每日肢体主动+被动训练 2 次,言语训练 20 分钟;吞咽功能评估后循序进食。监测:每日晨起血压、每周体重与步态;每 3 个月复查血脂、颈动脉超声。每两周神经内科随访。",
  },
  {
    id: "pl2",
    patient: "李强",
    title: "TIA 后复发预防方案",
    dept: "神经内科",
    hospital: "鼓楼医院",
    disease: "短暂性脑缺血发作 (TIA)",
    time: "2026-04-30 10:08:59",
    status: "reviewing" as PlanStatus,
    tag: "需就诊",
    assessment:
      "ABCD² 评分 5 分(年龄 ≥60、血压 ≥140/90、单侧肢体无力、症状持续 10-59 分钟),48 小时内卒中风险约 4%。头颅 MRA 未见明显大血管闭塞,颈动脉斑块负荷中等。",
    plan:
      "启动短程双联抗血小板(21 天)后转单药维持;强化他汀治疗;控制血压 <130/80 mmHg;戒烟并规律有氧运动;每 2 周门诊复评 NIHSS 与 mRS。",
  },
  {
    id: "pl3",
    patient: "王芳",
    title: "卒中后偏瘫康复方案",
    dept: "神经康复科",
    hospital: "鼓楼医院",
    disease: "缺血性卒中恢复期",
    time: "2026-05-06 09:22:10",
    status: "pending" as PlanStatus,
    tag: "常规随访",
    assessment:
      "发病 6 周,右侧上肢 Brunnstrom Ⅲ 期、下肢 Ⅳ 期,mRS 3 级,MMSE 26 分,轻度构音障碍。抗血小板依从性良好,LDL-C 2.1 mmol/L 需继续强化。",
    plan:
      "每日康复训练 2 次(PT+OT 各 30 分钟),配合言语训练 20 分钟;继续阿司匹林 100 mg qd + 阿托伐他汀 40 mg qn;4 周后门诊复评 mRS 与 Fugl-Meyer 评分。",
  },
  {
    id: "pl4",
    patient: "陈敏",
    title: "房颤合并卒中抗凝随访",
    dept: "神经内科",
    hospital: "鼓楼医院",
    disease: "心源性脑栓塞 · 非瓣膜性房颤",
    time: "2026-05-11 14:05:32",
    status: "pending" as PlanStatus,
    tag: "需就诊",
    assessment:
      "CHA₂DS₂-VASc 评分 5 分,HAS-BLED 2 分,启动 NOAC(利伐沙班 20 mg qd)已 3 月,INR 稳定,未见出血倾向。头颅 MRI 示左侧顶叶陈旧性梗死。",
    plan:
      "继续利伐沙班 20 mg qd,肌酐清除率每 6 月复查;控制血压 <130/80 mmHg;监测心率与心律,必要时动态心电图;若出现黑便、鼻衄或头痛加重立即就诊。",
  },
];


type TabKey = "all" | "pending" | "reviewing";

function DoctorPlans() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<TabKey>("all");
  const pending = plansSeed.filter((p) => p.status === "pending").length;
  const reviewing = plansSeed.filter((p) => p.status === "reviewing").length;
  const list = plansSeed.filter((p) => {
    if (tab !== "all" && p.status !== tab) return false;
    if (!q) return true;
    return p.patient.includes(q) || p.disease.includes(q);
  });

  return (
    <PortalShell role="doctor" title="方案审核" tabs={doctorTabs}>
      <section className="mx-3 mt-3 grid grid-cols-3 divide-x divide-border rounded-2xl bg-card py-4 shadow-[var(--shadow-card)]">
        <div className="text-center">
          <p className="text-3xl font-bold text-amber-500">{pending}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">待审核</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-sky-600">{reviewing}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">审核中</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{plansSeed.length}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">总计</p>
        </div>
      </section>

      <section className="mx-3 mt-3">
        <div className="flex items-center gap-2 rounded-full bg-card px-3 py-2 shadow-[var(--shadow-card)]">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索患者姓名"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <section className="mx-3 mt-3 flex gap-2">
        {([
          { key: "all", label: "全部" },
          { key: "pending", label: "待审核" },
          { key: "reviewing", label: "审核中" },
        ] as { key: TabKey; label: string }[]).map((c) => (
          <button
            key={c.key}
            onClick={() => setTab(c.key)}
            className={
              "rounded-full px-4 py-1.5 text-xs font-semibold " +
              (tab === c.key ? "bg-sky-500 text-white" : "bg-card text-muted-foreground shadow-[var(--shadow-card)]")
            }
          >
            {c.label}
          </button>
        ))}
      </section>

      <ul className="mx-3 mt-3 space-y-3">
        {list.map((p) => (
          <li key={p.id}>
          <Link
            to="/doctor/plans/$id"
            params={{ id: p.id }}
            className="block rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600 text-sm font-bold">
                {p.patient.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-foreground">{p.patient}</p>
                <p className="truncate text-[11px] text-muted-foreground">{p.disease}</p>
              </div>
              <span className={
                "rounded-md px-1.5 py-0.5 text-[11px] font-semibold " +
                (p.status === "reviewing" ? "bg-sky-100 text-sky-600" : "bg-amber-100 text-amber-600")
              }>
                {p.status === "reviewing" ? "审核中" : "待审核"}
              </span>
            </div>
            <p className="mt-2 text-[13px] font-semibold text-foreground">{p.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.dept} · {p.time}</p>
            <div className="mt-3 flex items-center justify-end border-t border-border/60 pt-2 text-xs font-semibold text-sky-600">
              查看方案详情 <ChevronRight className="size-4" />
            </div>
          </Link>
          </li>
        ))}
        {list.length === 0 && (
          <li className="rounded-2xl bg-card p-6 text-center text-xs text-muted-foreground shadow-[var(--shadow-card)]">
            暂无符合条件的方案
          </li>
        )}
      </ul>


      <div className="mx-3 mt-3 flex items-center gap-2 rounded-2xl bg-sky-50 px-3 py-2 text-[11px] text-sky-700">
        <Users2 className="size-3.5" /> 会诊查看功能:多学科医生可协同批注方案
      </div>

      <div className="h-6" />
    </PortalShell>
  );
}