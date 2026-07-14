import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, MessageSquare, ClipboardCheck, HeartPulse, AlertTriangle, Pill, Activity, Phone, MapPin, Users, FlaskConical, Utensils, Moon, Cigarette, Droplet } from "lucide-react";
import { patients } from "./doctor.patients.index";

export const Route = createFileRoute("/doctor/patients/$id")({ component: PatientDetail });

function PatientDetail() {
  const { id } = Route.useParams();
  const p = patients.find((x) => x.id === id) ?? patients[0];

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card px-3 py-3">
        <Link to="/doctor/patients" className="grid size-9 place-items-center rounded-full active:scale-95">
          <ChevronLeft className="size-5" />
        </Link>
        <p className="text-base font-bold">患者详情</p>
      </header>

      <section className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-400 p-4 text-white shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-full bg-white/20 text-xl font-bold">
            {p.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">{p.name}</p>
            <p className="text-xs opacity-90">{p.gender} · {p.age} 岁 · 编号 {p.id.toUpperCase()}</p>
            <p className="mt-1 text-xs opacity-90">{p.tag}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-lg font-bold">158/96</p><p className="text-[10px] opacity-90">最近血压</p>
          </div>
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-lg font-bold">6.4</p><p className="text-[10px] opacity-90">空腹血糖</p>
          </div>
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-lg font-bold">2 级</p><p className="text-[10px] opacity-90">mRS</p>
          </div>
        </div>
      </section>

      <section className="mx-3 mt-3 grid grid-cols-4 gap-2">
        {[
          { icon: MessageSquare, label: "沟通", to: "/doctor/chat" },
          { icon: ClipboardCheck, label: "开方案", to: "/doctor/plans" },
          { icon: HeartPulse, label: "档案", to: "/doctor/patients" },
          { icon: AlertTriangle, label: "预警", to: "/doctor/patients" },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={a.to as any}
              className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 text-xs shadow-[var(--shadow-card)] active:scale-95"
            >
              <Icon className="size-5 text-sky-600" />
              {a.label}
            </Link>
          );
        })}
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">基本信息</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <InfoCell icon={Phone} label="联系电话" value="138****6821" />
          <InfoCell icon={MapPin} label="居住地" value="南京市鼓楼区" />
          <InfoCell icon={Users} label="家属" value="女儿 张女士" />
          <InfoCell icon={ClipboardCheck} label="医保类型" value="城镇职工" />
          <InfoCell icon={HeartPulse} label="身高体重" value="172cm / 78kg" />
          <InfoCell icon={Activity} label="BMI" value="26.4 · 超重" />
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">诊断与既往史</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["缺血性卒中 (2025)", "原发性高血压 2 级", "2 型糖尿病", "高脂血症", "颈动脉粥样硬化"].map((t) => (
            <span key={t} className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700">{t}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          家族史:父亲高血压、母亲糖尿病;过敏史:青霉素过敏;吸烟史 30 年,已戒 6 月。
        </p>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">当前用药</p>
        <ul className="mt-2 divide-y divide-border">
          {[
            { n: "缬沙坦氨氯地平片", d: "80/5 mg qd 晨", tag: "降压", c: "text-rose-500" },
            { n: "阿托伐他汀钙片", d: "20 mg qn 睡前", tag: "调脂", c: "text-amber-500" },
            { n: "阿司匹林肠溶片", d: "100 mg qd 餐后", tag: "抗血小板", c: "text-sky-500" },
            { n: "二甲双胍缓释片", d: "500 mg bid", tag: "降糖", c: "text-emerald-500" },
          ].map((m) => (
            <li key={m.n} className="flex items-center gap-2 py-2">
              <Pill className={"size-4 " + m.c} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">{m.n}</p>
                <p className="text-[11px] text-muted-foreground">{m.d}</p>
              </div>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{m.tag}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <FlaskConical className="size-4 text-sky-600" /> 最近化验(2026-07-01)
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
          <LabCell k="HbA1c" v="7.2%" note="偏高" bad />
          <LabCell k="LDL-C" v="2.1 mmol/L" note="达标" />
          <LabCell k="TG" v="1.9 mmol/L" note="偏高" bad />
          <LabCell k="肌酐" v="82 μmol/L" note="正常" />
          <LabCell k="尿酸" v="426 μmol/L" note="临界" bad />
          <LabCell k="ALT" v="28 U/L" note="正常" />
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">生活方式</p>
        <div className="mt-2 grid grid-cols-4 gap-2 text-center text-[11px]">
          {[
            { i: Utensils, l: "偏咸饮食", c: "text-amber-500 bg-amber-50" },
            { i: Moon, l: "睡眠 5.5h", c: "text-rose-500 bg-rose-50" },
            { i: Activity, l: "步数 3500", c: "text-amber-500 bg-amber-50" },
            { i: Cigarette, l: "已戒烟", c: "text-emerald-600 bg-emerald-50" },
          ].map((x) => {
            const Icon = x.i;
            return (
              <div key={x.l} className={"rounded-xl py-3 " + x.c}>
                <Icon className="mx-auto size-4" />
                <p className="mt-1 text-foreground/80">{x.l}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <Droplet className="size-4 text-sky-600" /> 近 7 日血压趋势
        </p>
        <div className="mt-3 flex h-24 items-end gap-1.5">
          {[142, 148, 155, 150, 158, 152, 158].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={"w-full rounded-t " + (v >= 155 ? "bg-rose-400" : v >= 145 ? "bg-amber-400" : "bg-emerald-400")}
                style={{ height: `${(v - 120) * 1.6}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">目标 &lt;140/90 mmHg · 近 3 天持续偏高</p>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">近期风险</p>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 text-rose-500 shrink-0" />{p.note}</li>
          <li className="flex gap-2"><Pill className="mt-0.5 size-4 text-amber-500 shrink-0" />用药依从性下降,需提醒复诊</li>
          <li className="flex gap-2"><Activity className="mt-0.5 size-4 text-sky-500 shrink-0" />PHQ-9 结果显示情绪偏低</li>
        </ul>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">最近随访记录</p>
        <ul className="mt-3 space-y-3 text-xs text-muted-foreground">
          {[
            { d: "2026-07-08", t: "视频随访 · 血压控制反馈" },
            { d: "2026-06-24", t: "线上问诊 · 调整降压方案" },
            { d: "2026-06-10", t: "复诊 · 颈动脉超声复查" },
          ].map((r) => (
            <li key={r.d} className="flex justify-between">
              <span>{r.t}</span>
              <span>{r.d}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-3 mt-4 flex gap-3 pb-8">
        <Link to="/doctor/plans" className="flex-1 rounded-full bg-card py-3 text-center text-sm font-bold text-sky-600 shadow-[var(--shadow-card)] active:scale-[0.99]">
          查看方案
        </Link>
        <Link to="/doctor/plans" className="flex-1 rounded-full bg-sky-500 py-3 text-center text-sm font-bold text-white shadow-[var(--shadow-soft)] active:scale-[0.99]">
          确认方案
        </Link>
      </div>
    </div>
  );
}

function InfoCell({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2.5">
      <Icon className="size-4 shrink-0 text-sky-600" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="truncate text-[12px] font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function LabCell({ k, v, note, bad }: { k: string; v: string; note: string; bad?: boolean }) {
  return (
    <div className="rounded-xl bg-muted/50 p-2.5">
      <p className="text-[10px] text-muted-foreground">{k}</p>
      <p className="mt-0.5 flex items-baseline gap-1">
        <span className={"text-[13px] font-bold " + (bad ? "text-rose-500" : "text-foreground")}>{v}</span>
        <span className={"text-[10px] " + (bad ? "text-rose-500" : "text-emerald-600")}>{note}</span>
      </p>
    </div>
  );
}