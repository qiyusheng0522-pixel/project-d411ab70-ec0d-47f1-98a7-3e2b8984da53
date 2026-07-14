import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Stethoscope, Star, HeartPulse, Salad } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/consult")({ component: Consult });

type Category = "doctor" | "nurse" | "manager";
type Provider = {
  name: string;
  title: string;
  years: number;
  rating: number;
  tag: string;
  category: Category;
  icon: LucideIcon;
  tint: string;
};

const HOSPITAL = "南京市鼓楼医院";
const DEPT = "神经内科";

const providers: Provider[] = [
  { name: "王建国", title: "主任医师", years: 25, rating: 4.9, tag: "卒中康复", category: "doctor", icon: Stethoscope, tint: "bg-sky-100 text-sky-600" },
  { name: "李丽华", title: "副主任医师", years: 18, rating: 4.8, tag: "脑血管病", category: "doctor", icon: Stethoscope, tint: "bg-sky-100 text-sky-600" },
  { name: "陈晓明", title: "主治医师", years: 12, rating: 4.8, tag: "介入治疗", category: "doctor", icon: Stethoscope, tint: "bg-sky-100 text-sky-600" },
  { name: "周敏", title: "主管护师", years: 15, rating: 4.9, tag: "卒中专科护理", category: "nurse", icon: HeartPulse, tint: "bg-rose-100 text-rose-500" },
  { name: "孙倩", title: "护师", years: 8, rating: 4.7, tag: "居家康复护理", category: "nurse", icon: HeartPulse, tint: "bg-rose-100 text-rose-500" },
  { name: "赵雅", title: "高级健康管理师", years: 10, rating: 4.9, tag: "慢病与饮食管理", category: "manager", icon: Salad, tint: "bg-emerald-100 text-emerald-600" },
  { name: "刘洋", title: "健康管理师", years: 6, rating: 4.8, tag: "运动与随访", category: "manager", icon: Salad, tint: "bg-emerald-100 text-emerald-600" },
];

const tabs: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "doctor", label: "医生" },
  { key: "nurse", label: "护理" },
  { key: "manager", label: "健康管理师" },
];

function Consult() {
  const [tab, setTab] = useState<Category | "all">("all");
  const list = tab === "all" ? providers : providers.filter((p) => p.category === tab);
  return (
    <MobileShell>
      <header className="flex items-center gap-2 px-4 pt-5">
        <Link to="/patient" className="grid size-9 place-items-center rounded-full bg-card shadow-[var(--shadow-card)]">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">在线咨询</h1>
      </header>

      <section className="mx-4 mt-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "flex-1 rounded-2xl py-2.5 text-sm font-semibold " +
              (tab === t.key ? "bg-primary text-primary-foreground" : "bg-card text-foreground shadow-[var(--shadow-card)]")
            }
          >
            {t.label}
          </button>
        ))}
      </section>

      <ul className="mx-4 mt-4 space-y-3">
        {list.map((d) => {
          const Icon = d.icon;
          return (
            <li key={d.name} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <div className={`grid size-14 shrink-0 place-items-center rounded-2xl ${d.tint}`}>
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-foreground">{d.name}</p>
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{d.title}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{DEPT} · {HOSPITAL}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Star className="size-3 fill-amber-400 text-amber-400" />{d.rating}</span>
                    <span>从业 {d.years} 年</span>
                    <span className="rounded bg-accent px-1.5 py-0.5 text-accent-foreground">{d.tag}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button className="w-full rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground">
                  去咨询
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="h-6" />
    </MobileShell>
  );
}