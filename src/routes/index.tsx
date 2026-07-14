import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartPulse, Stethoscope, Syringe, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "卒中健康 · 三端聚合入口" },
      { name: "description", content: "卒中专病管理平台 · 患者端 / 医生端 / 护理端 快捷入口" },
    ],
  }),
});

const portals = [
  {
    to: "/patient" as const,
    role: "患者端",
    desc: "档案 · 量表 · 康复方案 · 咨询医生",
    icon: HeartPulse,
    gradient: "from-sky-500 to-cyan-400",
    tag: "本人使用",
  },
  {
    to: "/doctor" as const,
    role: "医生端",
    desc: "工作台 · 患者管理 · 方案审核 · 统计",
    icon: Stethoscope,
    gradient: "from-indigo-500 to-sky-500",
    tag: "医师登录",
  },
  {
    to: "/nurse" as const,
    role: "护理端",
    desc: "任务 · 在管患者 · 沟通 · 排班",
    icon: Syringe,
    gradient: "from-emerald-500 to-teal-400",
    tag: "护士登录",
  },
];

function Landing() {
  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-background md:h-[820px]">
      <header className="px-6 pb-3 pt-6">
        <p className="text-xs font-semibold tracking-widest text-primary">STROKE CARE</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          卒中健康管理平台
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          选择您的身份进入对应工作端 · 三端数据实时互通
        </p>
      </header>

      <ul className="flex-1 space-y-3 px-4">
        {portals.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.to}>
              <Link
                to={p.to}
                className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br ${p.gradient} p-4 text-white shadow-[var(--shadow-soft)] active:scale-[0.99]`}
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30">
                  <Icon className="size-6" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold">{p.role}</p>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium">
                      {p.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] opacity-90">{p.desc}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 opacity-90" />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="px-6 pb-4 pt-3 text-center text-[11px] text-muted-foreground">
        卒中专病管理 v1.0 · 三端聚合入口
      </p>
    </div>
  );
}