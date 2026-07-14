import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft, MessageSquare, ClipboardCheck, HeartPulse, AlertTriangle, Pill,
  Activity, Phone, MapPin, Users, FlaskConical,
  Droplet, BookOpen, Send, X, NotebookPen, Sparkles, Building2, Check, ArrowRightLeft,
} from "lucide-react";
import { useState } from "react";
import { nurseList } from "./nurse.patients.index";

export const Route = createFileRoute("/nurse/patients/$id")({ component: NursePatientDetail });

const communities = [
  { id: "c1", name: "鼓楼区湖南路社区卫生服务中心", tag: "距离 1.2km · 已签约" },
  { id: "c2", name: "玄武区新街口社区卫生服务中心", tag: "距离 2.6km" },
  { id: "c3", name: "秦淮区红花社区卫生服务中心", tag: "距离 3.4km" },
];

const quickMsgs = [
  "请按医嘱继续服药,勿自行停药",
  "今日请复测血压并上传记录",
  "康复训练每日 2 次,循序渐进",
  "如出现头晕、口齿不清立即联系我",
];

const seedNotes = [
  { id: "1", time: "今天 08:20", author: "李护士", text: "晨起血压 148/92,已提醒按时服药,情绪平稳。" },
  { id: "2", time: "今天 10:05", author: "李护士", text: "完成低盐饮食宣教,家属配合度良好。" },
  { id: "3", time: "昨天 20:10", author: "夜班", text: "睡前测量血压 138/86,夜间无不适。" },
];

function NursePatientDetail() {
  const { id } = Route.useParams();
  const p = nurseList.find((x) => x.id === id) ?? nurseList[0];

  const [chatOpen, setChatOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [notes, setNotes] = useState(seedNotes);
  const [noteDraft, setNoteDraft] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const [community, setCommunity] = useState(communities[0].id);
  const [handover, setHandover] = useState(
    "术后恢复平稳,mRS 2 级。华法林 3mg qd,INR 目标 2-3。血压近 3 天偏高,建议社区继续监测。",
  );
  const [followupPlan, setFollowupPlan] = useState("首次上门 3 天内 · 之后每 2 周随访 1 次,持续 3 个月");

  const isDischargeReady = p.stage === "待出院";

  const send = (raw?: string) => {
    const text = (raw ?? draft).trim();
    if (!text) return;
    setChatOpen(false);
    setDraft("");
    setToast(`已发送给 ${p.name}:${text.length > 14 ? text.slice(0, 14) + "…" : text}`);
    setTimeout(() => setToast(null), 2200);
  };

  const confirmTransfer = () => {
    const c = communities.find((x) => x.id === community);
    setTransferred(true);
    setTransferOpen(false);
    setToast(`已将 ${p.name} 下转至${c?.name ?? "社区"}`);
    setTimeout(() => setToast(null), 2400);
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    const now = new Date();
    const time = `今天 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setNotes((n) => [{ id: crypto.randomUUID(), time, author: "李护士", text }, ...n]);
    setNoteDraft("");
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-muted/40 pb-8">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card px-3 py-3">
        <Link to="/nurse/patients" className="grid size-9 place-items-center rounded-full active:scale-95">
          <ChevronLeft className="size-5" />
        </Link>
        <p className="text-base font-bold">患者详情</p>
      </header>

      <section className="mx-3 mt-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 p-4 text-white shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-white/20 text-xl font-bold">
            {p.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">{p.name}</p>
            <p className="text-xs opacity-90">{p.age} 岁 · {p.stage} · 编号 {p.id.toUpperCase()}</p>
            <p className="mt-1 text-xs opacity-90">{p.conds.join(" / ")}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-lg font-bold">158/96</p><p className="text-[10px] opacity-90">最近血压</p>
          </div>
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-lg font-bold">2.1</p><p className="text-[10px] opacity-90">INR</p>
          </div>
          <div className="rounded-xl bg-white/15 py-2">
            <p className="text-lg font-bold">2 级</p><p className="text-[10px] opacity-90">mRS</p>
          </div>
        </div>
      </section>

      <section className={"mx-3 mt-3 grid gap-2 " + ((p.stage === "院外" || p.stage === "待出院") ? "grid-cols-4" : "grid-cols-3")}>
        <button
          onClick={() => setChatOpen(true)}
          className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 text-xs shadow-[var(--shadow-card)] active:scale-95"
        >
          <MessageSquare className="size-5 text-emerald-600" /> 沟通
        </button>
        <Link to="/nurse/education" className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 text-xs shadow-[var(--shadow-card)] active:scale-95">
          <BookOpen className="size-5 text-amber-600" /> 宣教
        </Link>
        {(p.stage === "院外" || p.stage === "待出院") && (
          <Link to="/nurse/followup" className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 text-xs shadow-[var(--shadow-card)] active:scale-95">
            <ClipboardCheck className="size-5 text-sky-600" /> 随访
          </Link>
        )}
        <button
          onClick={() => setTransferOpen(true)}
          className="flex flex-col items-center gap-1 rounded-2xl bg-card py-3 text-xs shadow-[var(--shadow-card)] active:scale-95"
        >
          <ArrowRightLeft className="size-5 text-indigo-600" /> 下转社区
        </button>
      </section>

      {isDischargeReady && (
        <section className="mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sky-500 text-white">
            <Building2 className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-sky-800">
              {transferred ? "已下转至社区,持续随访中" : "该患者符合出院条件,可下转社区继续管理"}
            </p>
            <p className="mt-0.5 text-[11px] text-sky-700/80">
              {transferred ? "社区已接收档案与随访计划" : "生成下转单 · 同步近期用药、随访计划与预警"}
            </p>
          </div>
          <button
            onClick={() => setTransferOpen(true)}
            className={
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold active:scale-95 " +
              (transferred ? "bg-white text-sky-700" : "bg-sky-500 text-white")
            }
          >
            {transferred ? "查看" : "下转"}
          </button>
        </section>
      )}

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">基本信息</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <InfoCell icon={Phone} label="联系电话" value="138****6821" />
          <InfoCell icon={MapPin} label="居住地" value="南京市鼓楼区" />
          <InfoCell icon={Users} label="家属" value="女儿 陈女士" />
          <InfoCell icon={ClipboardCheck} label="医保类型" value="城镇职工" />
          <InfoCell icon={HeartPulse} label="身高体重" value="172cm / 78kg" />
          <InfoCell icon={Activity} label="BMI" value="26.4 · 超重" />
        </div>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">诊断与既往史</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["缺血性卒中 (2025)", ...p.conds, "颈动脉粥样硬化", "高脂血症"].map((t) => (
            <span key={t} className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">{t}</span>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          家族史:父亲脑梗死、母亲高血压;过敏史:青霉素过敏;吸烟史 30 年,已戒 6 月。
        </p>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">当前用药</p>
        <ul className="mt-2 divide-y divide-border">
          {[
            { n: "华法林钠片", d: "3 mg qd 晚 · INR 2-3", tag: "抗凝", c: "text-rose-500" },
            { n: "缬沙坦氨氯地平片", d: "80/5 mg qd 晨", tag: "降压", c: "text-amber-500" },
            { n: "阿托伐他汀钙片", d: "20 mg qn 睡前", tag: "调脂", c: "text-sky-500" },
            { n: "阿司匹林肠溶片", d: "100 mg qd 餐后", tag: "抗血小板", c: "text-emerald-500" },
          ].map((m) => (
            <li key={m.n} className="flex items-center gap-2 py-2">
              <Pill className={"size-4 shrink-0 " + m.c} />
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
          <FlaskConical className="size-4 text-emerald-600" /> 最近化验(2026-07-01)
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
          <LabCell k="INR" v="2.1" note="达标" />
          <LabCell k="LDL-C" v="2.1 mmol/L" note="达标" />
          <LabCell k="HbA1c" v="6.4%" note="正常" />
          <LabCell k="肌酐" v="82 μmol/L" note="正常" />
          <LabCell k="尿酸" v="426 μmol/L" note="临界" bad />
          <LabCell k="ALT" v="28 U/L" note="正常" />
        </div>
      </section>


      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <Droplet className="size-4 text-emerald-600" /> 近 7 日血压趋势
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
          <li className="flex gap-2"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-500" />抗凝药漏服 · 需 10:00 补服并复测 INR</li>
          <li className="flex gap-2"><Pill className="mt-0.5 size-4 shrink-0 text-amber-500" />用药依从性下降,需提醒复诊</li>
          <li className="flex gap-2"><Activity className="mt-0.5 size-4 shrink-0 text-sky-500" />PHQ-9 结果显示情绪偏低</li>
        </ul>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <NotebookPen className="size-4 text-emerald-600" /> 护理备注
        </p>
        <textarea
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          rows={2}
          placeholder="记录患者今日状态、饮食、情绪、依从性等…"
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-3 text-[13px] leading-relaxed text-foreground outline-none focus:border-emerald-400"
        />
        <button
          onClick={addNote}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 py-2 text-sm font-bold text-white active:scale-[0.99]"
        >
          保存备注
        </button>
        <ul className="mt-3 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-border/60 p-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-semibold text-emerald-700">{n.author}</span>
                <span>{n.time}</span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{n.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-3 mt-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <p className="text-sm font-bold text-foreground">最近随访记录</p>
        <ul className="mt-3 space-y-3 text-xs text-muted-foreground">
          {[
            { d: "2026-07-08", t: "视频随访 · 血压控制反馈" },
            { d: "2026-06-24", t: "线上问诊 · 调整抗凝方案" },
            { d: "2026-06-10", t: "复诊 · 颈动脉超声复查" },
          ].map((r) => (
            <li key={r.d} className="flex justify-between">
              <span>{r.t}</span>
              <span>{r.d}</span>
            </li>
          ))}
        </ul>
      </section>


      {/* Quick-send bottom sheet */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setChatOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-card p-4 shadow-[var(--shadow-card)] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                {p.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">发送给 {p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.stage} · {p.conds.join(" / ")}</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="grid size-8 place-items-center rounded-full active:scale-95" aria-label="关闭">
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
              <Sparkles className="size-3" /> 常用话术
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {quickMsgs.map((m) => (
                <button
                  key={m}
                  onClick={() => setDraft(m)}
                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700 active:scale-95"
                >
                  {m}
                </button>
              ))}
            </div>

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="输入要发送的消息…"
              className="mt-3 w-full resize-y rounded-xl border border-border bg-background p-3 text-[13px] leading-relaxed text-foreground outline-none focus:border-emerald-400"
            />

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setChatOpen(false)}
                className="flex-1 rounded-full bg-muted py-2.5 text-sm font-semibold text-muted-foreground active:scale-95"
              >
                取消
              </button>
              <button
                onClick={() => send()}
                disabled={!draft.trim()}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-emerald-500 py-2.5 text-sm font-bold text-white active:scale-95 disabled:opacity-50"
              >
                <Send className="size-4" /> 发送
              </button>
            </div>
          </div>
        </div>
      )}

      {transferOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
          onClick={() => setTransferOpen(false)}
        >
          <div
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-4 shadow-[var(--shadow-card)] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-full bg-indigo-100 text-indigo-600">
                <ArrowRightLeft className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">下转社区 · {p.name}</p>
                <p className="text-[11px] text-muted-foreground">选择接收社区并同步随访计划</p>
              </div>
              <button onClick={() => setTransferOpen(false)} className="grid size-8 place-items-center rounded-full active:scale-95" aria-label="关闭">
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-3 text-[11px] font-semibold text-muted-foreground">接收社区</p>
            <ul className="mt-1.5 space-y-1.5">
              {communities.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setCommunity(c.id)}
                    className={
                      "flex w-full items-center gap-2 rounded-xl border p-2.5 text-left active:scale-[0.99] " +
                      (community === c.id
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-border bg-background")
                    }
                  >
                    <Building2 className="size-4 shrink-0 text-indigo-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-foreground">{c.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{c.tag}</p>
                    </div>
                    {community === c.id && <Check className="size-4 text-indigo-500" />}
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[11px] font-semibold text-muted-foreground">交接摘要</p>
            <textarea
              value={handover}
              onChange={(e) => setHandover(e.target.value)}
              rows={3}
              className="mt-1.5 w-full resize-y rounded-xl border border-border bg-background p-3 text-[12px] leading-relaxed text-foreground outline-none focus:border-indigo-400"
            />

            <p className="mt-3 text-[11px] font-semibold text-muted-foreground">随访计划</p>
            <input
              value={followupPlan}
              onChange={(e) => setFollowupPlan(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-[12px] text-foreground outline-none focus:border-indigo-400"
            />

            <div className="mt-3 rounded-xl bg-muted/50 p-2.5 text-[11px] text-muted-foreground">
              同步资料:近 7 日血压趋势 · 当前用药 · 化验结果 · 护理备注 · 预警提示
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setTransferOpen(false)}
                className="flex-1 rounded-full bg-muted py-2.5 text-sm font-semibold text-muted-foreground active:scale-95"
              >
                取消
              </button>
              <button
                onClick={confirmTransfer}
                className="flex flex-1 items-center justify-center gap-1 rounded-full bg-indigo-500 py-2.5 text-sm font-bold text-white active:scale-95"
              >
                <Check className="size-4" /> 确认下转
              </button>
            </div>
          </div>
        </div>
      )}


      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function InfoCell({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-2.5">
      <Icon className="size-4 shrink-0 text-emerald-600" />
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
