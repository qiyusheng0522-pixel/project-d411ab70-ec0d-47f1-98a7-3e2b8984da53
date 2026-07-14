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
    title: "换种措辞",
    dept: "内分泌科",
    hospital: "鼓楼医院",
    disease: "糖尿病",
    time: "2026-04-02 18:44:18",
    status: "reviewing" as PlanStatus,
    tag: "需就诊",
    assessment:
      "根据中国糖尿病风险评分表(CDRS)评估,您为 31 岁男性,年龄得 1 分,体重指数 ≥30.0 得 11 分,腰围 ≥95.0cm 得 10 分,收缩压 140-149mmHg 得 7 分,无糖尿病家族史得 0 分,男性额外加 2 分,总分为 31 分,属于高风险人群(≥25 分)。您的糖尿病风险主要来源于超重(BMI≥30)、腹部肥胖(腰围≥95cm)和高血压,这些因素显著增加胰岛素抵抗和代谢紊乱风险。建议您立即前往医院进行口服葡萄糖耐量试验(OGTT)以明确是否患有糖尿病或前期糖代谢异常,并同步启动生活方式干预,包括减重、低糖低脂饮食、规律运动和血压管理。",
    plan:
      "基于您的健康数据,建议您立即启动糖尿病高风险干预计划:饮食上,每日饮水应增至 2000 毫升以上,减少辛辣饮食,规律进餐(每日三餐定时),奶制品每周摄入 ≥3 次(如低脂酸奶、牛奶),控制外卖频率至每周 ≤1 次,避免高糖高油加工食品,优先选择全谷物、蔬菜和优质蛋白。运动方面,从每日 10 分钟轻度活动开始(如室内原地踏步、伸展),逐步过渡至每周 5 天、每次 30 分钟中等强度运动(如快走、太极拳),避免长期卧床。睡眠上,保持 23 点前入睡,确保 7 小时以上连续睡眠,睡前 1 小时远离电子设备,可尝试温水泡脚助眠。情绪管理需关注长期\"疲乏\"\"气短\"倾向,建议每日进行 5 分钟深呼吸或冥想,减少焦虑。中医体质提示\"阳虚\"倾向(怕冷、畏寒),可适当食用生姜、红枣、山药温补,忌生冷。每周进行 OGTT 葡萄糖耐量试验明确诊断,同时监测腰围(目标降至 ≤90cm)与血压(目标 <130/80mmHg),并记录每日饮食与运动日志,每两周复评一次。建议社区健康管理师定期随访,联合营养师制定个性化餐单。",
  },
  {
    id: "pl2",
    patient: "李强",
    title: "换种措辞",
    dept: "内分泌科",
    hospital: "鼓楼医院",
    disease: "糖尿病",
    time: "2026-04-30 10:08:59",
    status: "reviewing" as PlanStatus,
    tag: "需就诊",
    assessment:
      "根据中国糖尿病风险评分表(CDRS)评估,您为 31 岁男性,年龄得 1 分,体重指数 ≥30.0 得 11 分,腰围 ≥95.0cm 得 10 分,收缩压 140-149mmHg 得 7 分,无糖尿病家族史得 0 分,男性额外加 2 分,总分为 31 分,属于高风险人群(≥25 分)。",
    plan:
      "建议启动糖尿病高风险干预计划,包括饮食结构调整、规律运动、体重管理与血压监测。每两周由内分泌科门诊复评一次,并联合营养师制定个性化餐单。",
  },
  {
    id: "pl3",
    patient: "王芳",
    title: "糖化血红蛋白复查方案",
    dept: "内分泌科",
    hospital: "鼓楼医院",
    disease: "2 型糖尿病",
    time: "2026-05-06 09:22:10",
    status: "pending" as PlanStatus,
    tag: "常规随访",
    assessment:
      "近三月 HbA1c 由 7.6% 上升至 8.1%,空腹血糖波动 7.0-8.5 mmol/L,提示血糖控制不佳,建议评估用药依从性与饮食因素。",
    plan:
      "增加二甲双胍至 1000 mg bid,联合 SGLT2 抑制剂;每周监测空腹与餐后 2 h 血糖,4 周后门诊复评 HbA1c。",
  },
  {
    id: "pl4",
    patient: "陈敏",
    title: "甲状腺结节随访",
    dept: "内分泌科",
    hospital: "鼓楼医院",
    disease: "甲状腺结节 TI-RADS 3 类",
    time: "2026-05-11 14:05:32",
    status: "pending" as PlanStatus,
    tag: "需就诊",
    assessment:
      "TI-RADS 3 类,恶性风险 <2%,建议 6-12 个月超声复查。TSH、FT3、FT4 在正常范围。",
    plan:
      "6 个月后甲状腺超声复查;保持碘摄入均衡,避免辐射暴露;若结节增大 >20% 或出现声嘶,及时门诊评估。",
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
            <div className="flex items-start gap-2">
              <p className="text-base font-bold text-foreground">{p.title}</p>
              <span className={
                "rounded-md px-1.5 py-0.5 text-[11px] font-semibold " +
                (p.status === "reviewing" ? "bg-sky-100 text-sky-600" : "bg-amber-100 text-amber-600")
              }>
                {p.status === "reviewing" ? "审核中" : "待审核"}
              </span>
              <span className="ml-auto rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                {p.tag}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{p.dept} · {p.time}</p>
            <p className="mt-1 text-[13px] font-semibold text-sky-600">{p.disease}</p>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-foreground/80">
              <span className="font-semibold text-foreground">普通评估: </span>{p.assessment}
            </p>
            <div className="mt-3 flex items-center justify-end border-t border-border/60 pt-2 text-xs font-semibold text-sky-600">
              查看详情 <ChevronRight className="size-4" />
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