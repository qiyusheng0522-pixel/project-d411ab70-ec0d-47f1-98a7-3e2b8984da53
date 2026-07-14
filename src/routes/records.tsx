import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Camera, Upload, FileText, CheckCircle2, Loader2, Trash2, Plus,
  Pill, Activity, Droplets, Thermometer, HeartPulse, X, Bell, Pencil,
  Watch, Smartphone, Bluetooth, RefreshCw, Hand,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import avatar3d from "@/assets/health-avatar-3d.png";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/records")({ component: Records });

type FileRecord = {
  id: string;
  type: string;
  date: string;
  hospital: string;
  summary: string;
  imageUrl: string;
};

const sampleRecords: FileRecord[] = [
  {
    id: "r1",
    type: "出院小结",
    date: "2025-04-12",
    hospital: "复旦大学附属华山医院",
    summary: "急性脑梗死, rt-PA 静脉溶栓后,NIHSS 由 8 降至 3。",
    imageUrl: "",
  },
  {
    id: "r2",
    type: "检验报告",
    date: "2025-05-08",
    hospital: "社区卫生服务中心",
    summary: "LDL-C 2.1 mmol/L, HbA1c 6.4%,凝血功能正常。",
    imageUrl: "",
  },
];

type Med = { id: string; name: string; dose: string; freq: string; note?: string; reminder?: string };
type VitalSource = "manual" | "device";
type Vital = { id: string; kind: VitalKind; value: string; unit: string; date: string; source: VitalSource; device?: string };
type VitalKind = "bp" | "glucose" | "temp" | "hr";

const vitalMeta: Record<VitalKind, { label: string; unit: string; icon: typeof HeartPulse; tint: string; placeholder: string }> = {
  bp: { label: "血压", unit: "mmHg", icon: Activity, tint: "bg-rose-100 text-rose-700", placeholder: "如 135/85" },
  glucose: { label: "血糖", unit: "mmol/L", icon: Droplets, tint: "bg-amber-100 text-amber-700", placeholder: "如 6.4" },
  temp: { label: "体温", unit: "℃", icon: Thermometer, tint: "bg-orange-100 text-orange-700", placeholder: "如 36.7" },
  hr: { label: "心率", unit: "bpm", icon: HeartPulse, tint: "bg-sky-100 text-sky-700", placeholder: "如 78" },
};

type Tab = "files" | "meds" | "vitals";

const seedVitals: Vital[] = [
  { id: "v1", kind: "bp", value: "138/86", unit: "mmHg", date: "今天 07:20", source: "device", device: "欧姆龙 血压计" },
  { id: "v2", kind: "glucose", value: "6.2", unit: "mmol/L", date: "今天 07:05", source: "manual" },
  { id: "v3", kind: "hr", value: "76", unit: "bpm", date: "昨天 21:30", source: "device", device: "Apple Watch" },
];

// 7 天历史数据（用于趋势图）
const trends: Record<VitalKind, { day: string; value: number; extra?: number }[]> = {
  bp: [
    { day: "5/15", value: 142, extra: 90 },
    { day: "5/16", value: 138, extra: 86 },
    { day: "5/17", value: 145, extra: 92 },
    { day: "5/18", value: 136, extra: 84 },
    { day: "5/19", value: 140, extra: 88 },
    { day: "5/20", value: 134, extra: 82 },
    { day: "今天", value: 138, extra: 86 },
  ],
  glucose: [
    { day: "5/15", value: 6.8 }, { day: "5/16", value: 7.2 }, { day: "5/17", value: 6.5 },
    { day: "5/18", value: 6.1 }, { day: "5/19", value: 6.4 }, { day: "5/20", value: 5.9 },
    { day: "今天", value: 6.2 },
  ],
  temp: [
    { day: "5/15", value: 36.5 }, { day: "5/16", value: 36.7 }, { day: "5/17", value: 36.8 },
    { day: "5/18", value: 36.6 }, { day: "5/19", value: 36.9 }, { day: "5/20", value: 36.5 },
    { day: "今天", value: 36.7 },
  ],
  hr: [
    { day: "5/15", value: 78 }, { day: "5/16", value: 82 }, { day: "5/17", value: 75 },
    { day: "5/18", value: 80 }, { day: "5/19", value: 77 }, { day: "5/20", value: 74 },
    { day: "今天", value: 76 },
  ],
};

const trendColor: Record<VitalKind, string> = {
  bp: "#e11d48",
  glucose: "#f59e0b",
  temp: "#f97316",
  hr: "#0ea5e9",
};

function Records() {
  const [tab, setTab] = useState<Tab>("files");
  const [records, setRecords] = useState<FileRecord[]>(sampleRecords);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [meds, setMeds] = useState<Med[]>([
    { id: "m1", name: "阿司匹林肠溶片", dose: "100 mg", freq: "每日 1 次 · 早餐后", note: "抗血小板", reminder: "08:00" },
    { id: "m2", name: "阿托伐他汀钙", dose: "20 mg", freq: "每晚睡前", note: "降脂", reminder: "21:30" },
    { id: "m3", name: "苯磺酸氨氯地平", dose: "5 mg", freq: "每日 1 次 · 早", note: "降压", reminder: "08:00" },
  ]);
  const [vitals, setVitals] = useState<Vital[]>(seedVitals);
  const [medForm, setMedForm] = useState<Med | null>(null);
  const [vitalForm, setVitalForm] = useState<{ kind: VitalKind; value: string } | null>(null);
  const [medScan, setMedScan] = useState(false);
  const medFileRef = useRef<HTMLInputElement>(null);
  const [confirmDel, setConfirmDel] = useState<
    | { kind: "record"; id: string; label: string }
    | { kind: "med"; id: string; label: string }
    | { kind: "vital"; id: string; label: string }
    | null
  >(null);

  const performDelete = () => {
    if (!confirmDel) return;
    if (confirmDel.kind === "record") setRecords((p) => p.filter((x) => x.id !== confirmDel.id));
    if (confirmDel.kind === "med") setMeds((p) => p.filter((x) => x.id !== confirmDel.id));
    if (confirmDel.kind === "vital") setVitals((p) => p.filter((x) => x.id !== confirmDel.id));
    toast.success("已删除", { description: confirmDel.label });
    setConfirmDel(null);
  };

  const handleMedOcr = (file: File) => {
    void file;
    setMedScan(true);
    setTimeout(() => {
      setMedScan(false);
      const newMed: Med = {
        id: crypto.randomUUID(),
        name: "氯吡格雷片",
        dose: "75 mg",
        freq: "每日 1 次 · 早餐后",
        note: "OCR 自动识别，请核对",
        reminder: "08:00",
      };
      setMeds((p) => [newMed, ...p]);
      toast.success("拍照识别成功 ✅", {
        description: `已添加"${newMed.name} ${newMed.dose}"，请核对剂量与频次`,
      });
    }, 1500);
  };


  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setRecords((prev) => [
        {
          id: crypto.randomUUID(),
          type: "门诊档案",
          date: new Date().toISOString().slice(0, 10),
          hospital: "OCR 识别 · 待补充",
          summary: "已自动识别字段:就诊日期、医院、诊断、用药。请核对后保存。",
          imageUrl: url,
        },
        ...prev,
      ]);
      toast.success("拍照识别成功 ✅", { description: "已为您建立一条新的档案，请核对内容" });
    }, 1600);
  };

  return (
    <MobileShell>
      <PageHeader title="健康档案" subtitle="您的卒中专病数据中心" />

      {/* 3D 健康画像 */}
      <section className="mx-4 mt-2 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 via-indigo-50 to-background p-4 shadow-[var(--shadow-card)] ring-1 ring-sky-100">
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
          {/* 健康评估 */}
          <div>
            <p className="mb-3 text-center text-sm font-bold text-slate-800">健康评估</p>
            <ul className="space-y-2">
              {[
                { label: "2 型糖尿病", tone: "bg-rose-50 text-rose-600 ring-rose-200" },
                { label: "高血压 2 级", tone: "bg-orange-50 text-orange-600 ring-orange-200" },
                { label: "高脂血症", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
                { label: "甲状腺结节", tone: "bg-violet-50 text-violet-600 ring-violet-200" },
              ].map((t) => (
                <li key={t.label} className={`rounded-full px-3 py-1 text-center text-xs font-semibold ring-1 ${t.tone}`}>
                  {t.label}
                </li>
              ))}
            </ul>
          </div>
          {/* 3D 人像 */}
          <div className="relative flex items-end justify-center">
            <div className="absolute inset-x-2 bottom-3 h-3 rounded-full bg-slate-300/40 blur-md" />
            <img
              src={avatar3d}
              alt="我的 3D 健康画像"
              width={160}
              height={220}
              loading="lazy"
              className="relative h-56 w-auto object-contain drop-shadow-xl"
            />
          </div>
          {/* 不良生活方式 */}
          <div>
            <p className="mb-3 text-center text-sm font-bold text-slate-800">不良生活方式</p>
            <ul className="space-y-2">
              {[
                { label: "久坐少动", tone: "bg-sky-50 text-sky-700 ring-sky-200" },
                { label: "高糖饮食", tone: "bg-rose-50 text-rose-600 ring-rose-200" },
                { label: "熬夜晚睡", tone: "bg-indigo-50 text-indigo-600 ring-indigo-200" },
                { label: "吸烟史", tone: "bg-stone-100 text-stone-700 ring-stone-200" },
              ].map((t) => (
                <li key={t.label} className={`rounded-full px-3 py-1 text-center text-xs font-semibold ring-1 ${t.tone}`}>
                  {t.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          画像由您的档案、量表与体征数据智能生成 · 仅供参考
        </p>
      </section>

      {/* Tabs */}
      <div className="mx-4 mt-4 grid grid-cols-3 rounded-2xl bg-muted p-1">
        {([
          { id: "files", label: "档案资料" },
          { id: "meds", label: "我的用药" },
          { id: "vitals", label: "我的数据" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-xl py-2.5 text-base font-medium transition",
              tab === t.id ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "files" && (
        <>
          <section className="mx-4 mt-4 overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-soft)]"
            style={{ background: "var(--gradient-primary)" }}>
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/20">
                <Camera className="size-7" />
              </div>
              <div>
                <p className="text-lg font-bold">智能录入档案</p>
                <p className="text-sm opacity-90">拍一拍即可自动识别</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white/15 py-3.5 text-base font-medium backdrop-blur active:bg-white/25">
                <Camera className="size-5" /> 拍照
              </button>
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-medium text-primary active:scale-95">
                <Upload className="size-5" /> 相册
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </section>

          {scanning && (
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-base text-accent-foreground">
              <Loader2 className="size-4 animate-spin" /> 正在识别中,请稍候...
            </div>
          )}

          <section className="mx-4 mt-5">
            <h3 className="mb-3 text-lg font-bold text-foreground">我的档案 ({records.length})</h3>
            <ul className="space-y-3">
              {records.map((r) => (
                <li key={r.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-foreground">{r.type}</span>
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <CheckCircle2 className="size-3" /> 已识别
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{r.date} · {r.hospital}</p>
                      <p className="mt-2 text-base text-foreground/80">{r.summary}</p>
                    </div>
                  </div>
                  {r.imageUrl && <img src={r.imageUrl} alt="档案" className="mt-3 max-h-40 w-full rounded-xl object-cover" />}
                  <div className="mt-3 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-muted-foreground"
                      onClick={() => setConfirmDel({ kind: "record", id: r.id, label: `${r.type} · ${r.date}` })}>
                      <Trash2 className="size-3.5" /> 删除
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/scales" className="mt-6 block text-center text-sm text-muted-foreground">
              完成档案录入后,前往进行专病评估 →
            </Link>
          </section>
        </>
      )}

      {tab === "meds" && (
        <section className="mx-4 mt-4">
          {/* OCR 拍照录入 */}
          <div className="overflow-hidden rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-soft)]"
            style={{ background: "var(--gradient-primary)" }}>
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-2xl bg-white/20">
                <Pill className="size-7" />
              </div>
              <div>
                <p className="text-lg font-bold">拍照识别药品</p>
                <p className="text-sm opacity-90">拍药盒或说明书，自动识别用药</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => medFileRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white/15 py-3.5 text-base font-medium backdrop-blur active:bg-white/25">
                <Camera className="size-5" /> 拍药盒
              </button>
              <button onClick={() => medFileRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-base font-medium text-primary active:scale-95">
                <Upload className="size-5" /> 从相册选
              </button>
            </div>
            <input ref={medFileRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleMedOcr(e.target.files[0])} />
          </div>

          {medScan && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-base text-accent-foreground">
              <Loader2 className="size-4 animate-spin" /> 正在识别药品名称与剂量...
            </div>
          )}

          <div className="mb-3 mt-5 flex items-center justify-between">
            <h3 className="text-lg font-bold">用药清单 ({meds.length})</h3>
            <Button size="sm" className="h-9"
              onClick={() => setMedForm({ id: "", name: "", dose: "", freq: "", note: "", reminder: "08:00" })}>
              <Plus className="size-4" /> 手动添加
            </Button>
          </div>
          <ul className="space-y-3">
            {meds.map((m) => (
              <li key={m.id} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Pill className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-foreground">{m.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{m.dose} · {m.freq}</p>
                    {m.note && <p className="mt-1 text-xs text-primary">{m.note}</p>}
                    {m.reminder && (
                      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                        <Bell className="size-3" /> 每日 {m.reminder} 提醒
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="text-muted-foreground"
                      onClick={() => setMedForm({ ...m })}
                      aria-label="编辑">
                      <Pencil className="size-4" />
                    </button>
                    <button className="text-muted-foreground"
                      onClick={() => setConfirmDel({ kind: "med", id: m.id, label: `${m.name} ${m.dose}` })}
                      aria-label="删除">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {medForm && (
            <Sheet title={medForm.id ? "编辑用药" : "添加用药"} onClose={() => setMedForm(null)} onSave={() => {
              if (!medForm.name.trim()) { toast.error("请填写药品名称"); return; }
              if (medForm.id) {
                setMeds((p) => p.map((x) => (x.id === medForm.id ? medForm : x)));
                toast.success("已更新用药", { description: `${medForm.name} ${medForm.dose} · 每日 ${medForm.reminder} 提醒` });
              } else {
                setMeds((p) => [{ ...medForm, id: crypto.randomUUID() }, ...p]);
                toast.success("已添加用药", { description: `${medForm.name} ${medForm.dose} · 每日 ${medForm.reminder} 提醒` });
              }
              setMedForm(null);
            }}>
              <Field label="药品名称">
                <Input value={medForm.name} maxLength={50}
                  onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                  placeholder="如 阿司匹林" className="h-11 text-base" />
              </Field>
              <Field label="剂量">
                <Input value={medForm.dose} maxLength={30}
                  onChange={(e) => setMedForm({ ...medForm, dose: e.target.value })}
                  placeholder="如 100 mg" className="h-11 text-base" />
              </Field>
              <Field label="服用频次">
                <Input value={medForm.freq} maxLength={50}
                  onChange={(e) => setMedForm({ ...medForm, freq: e.target.value })}
                  placeholder="如 每日 1 次 早餐后" className="h-11 text-base" />
              </Field>
              <Field label="提醒时间">
                <Input type="time" value={medForm.reminder ?? "08:00"}
                  onChange={(e) => setMedForm({ ...medForm, reminder: e.target.value })}
                  className="h-11 text-base" />
              </Field>
              <Field label="备注 (选填)">
                <Input value={medForm.note ?? ""} maxLength={100}
                  onChange={(e) => setMedForm({ ...medForm, note: e.target.value })}
                  placeholder="如 抗血小板" className="h-11 text-base" />
              </Field>
            </Sheet>
          )}
        </section>
      )}

      {tab === "vitals" && (
        <section className="mx-4 mt-4">
          {/* 手动录入 */}
          <div className="mb-2 flex items-center gap-2">
            <Hand className="size-4 text-primary" />
            <h3 className="text-base font-bold">手动录入</h3>
            <span className="text-xs text-muted-foreground">点击图标即可记录</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(vitalMeta) as VitalKind[]).map((k) => {
              const m = vitalMeta[k];
              const Icon = m.icon;
              return (
                <button key={k}
                  onClick={() => setVitalForm({ kind: k, value: "" })}
                  className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)] active:scale-95">
                  <div className={`grid size-11 place-items-center rounded-xl ${m.tint}`}>
                    <Icon className="size-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* 设备同步 */}
          <div className="mt-5 rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bluetooth className="size-4 text-sky-600" />
                <h3 className="text-base font-bold">设备同步</h3>
              </div>
              <button
                onClick={() => {
                  toast.loading("正在同步设备数据...", { id: "sync" });
                  setTimeout(() => {
                    setVitals((p) => [
                      { id: crypto.randomUUID(), kind: "bp", value: "132/84", unit: "mmHg", date: "刚刚", source: "device", device: "欧姆龙 血压计" },
                      { id: crypto.randomUUID(), kind: "hr", value: "72", unit: "bpm", date: "刚刚", source: "device", device: "Apple Watch" },
                      ...p,
                    ]);
                    toast.success("同步完成", { id: "sync", description: "已从 2 台设备获取 2 条新数据" });
                  }, 1200);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary active:scale-95">
                <RefreshCw className="size-3.5" /> 立即同步
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {[
                { name: "欧姆龙 血压计", desc: "蓝牙 · 血压", icon: Activity, last: "今天 07:20", online: true },
                { name: "Apple Watch", desc: "心率 · 睡眠", icon: Watch, last: "昨天 21:30", online: true },
                { name: "雅培 动态血糖仪", desc: "NFC · 血糖", icon: Smartphone, last: "未连接", online: false },
              ].map((d) => {
                const Icon = d.icon;
                return (
                  <li key={d.name} className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.desc} · 上次 {d.last}</p>
                    </div>
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      d.online ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground",
                    )}>{d.online ? "已连接" : "去连接"}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 趋势图表 */}
          <h3 className="mb-3 mt-5 text-lg font-bold">近 7 天趋势</h3>
          <div className="space-y-3">
            {(Object.keys(vitalMeta) as VitalKind[]).map((k) => {
              const m = vitalMeta[k];
              const data = trends[k];
              const latest = data[data.length - 1];
              const Icon = m.icon;
              return (
                <div key={k} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`grid size-8 place-items-center rounded-lg ${m.tint}`}>
                        <Icon className="size-4" />
                      </div>
                      <span className="text-base font-bold">{m.label}</span>
                    </div>
                    <span className="text-base">
                      <span className="font-bold text-primary">
                        {k === "bp" ? `${latest.value}/${latest.extra}` : latest.value}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">{m.unit}</span>
                    </span>
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
                          formatter={(v: number) => [`${v} ${m.unit}`, m.label]}
                        />
                        <Line type="monotone" dataKey="value" stroke={trendColor[k]} strokeWidth={2.5}
                          dot={{ r: 3, fill: trendColor[k] }} activeDot={{ r: 5 }} />
                        {k === "bp" && (
                          <Line type="monotone" dataKey="extra" stroke="#fb923c" strokeWidth={2.5}
                            dot={{ r: 3, fill: "#fb923c" }} activeDot={{ r: 5 }} />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 最新记录小列表 */}
          <h3 className="mb-3 mt-5 text-lg font-bold">最近记录</h3>
          <ul className="space-y-2">
            {vitals.slice(0, 5).map((v) => {
              const m = vitalMeta[v.kind];
              return (
                <li key={v.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
                  <div className={`size-2 shrink-0 rounded-full`} style={{ background: trendColor[v.kind] }} />
                  <div className="min-w-0 flex-1 text-sm">
                    <span className="font-medium">{m.label}</span>
                    <span className="ml-2 font-bold text-primary">{v.value}</span>
                    <span className="ml-1 text-xs text-muted-foreground">{v.unit}</span>
                    <span className={cn(
                      "ml-2 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                      v.source === "device"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-slate-100 text-slate-600",
                    )}>
                      {v.source === "device" ? <Bluetooth className="size-2.5" /> : <Hand className="size-2.5" />}
                      {v.source === "device" ? (v.device ?? "设备") : "手动"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{v.date}</span>
                  <button className="text-muted-foreground"
                    onClick={() => setConfirmDel({ kind: "vital", id: v.id, label: `${m.label} ${v.value} ${v.unit}` })}>
                    <Trash2 className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          {vitalForm && (
            <Sheet title={`记录${vitalMeta[vitalForm.kind].label}`} onClose={() => setVitalForm(null)}
              onSave={() => {
                if (!vitalForm.value.trim()) { toast.error("请输入数值"); return; }
                setVitals((p) => [{
                  id: crypto.randomUUID(), kind: vitalForm.kind,
                  value: vitalForm.value.slice(0, 20),
                  unit: vitalMeta[vitalForm.kind].unit,
                  date: "刚刚",
                  source: "manual",
                }, ...p]);
                setVitalForm(null);
                toast.success("已保存", { description: `${vitalMeta[vitalForm.kind].label} ${vitalForm.value} ${vitalMeta[vitalForm.kind].unit}` });
              }}>
              <Field label={`${vitalMeta[vitalForm.kind].label} (${vitalMeta[vitalForm.kind].unit})`}>
                <Input autoFocus value={vitalForm.value} maxLength={20}
                  onChange={(e) => setVitalForm({ ...vitalForm, value: e.target.value })}
                  placeholder={vitalMeta[vitalForm.kind].placeholder}
                  className="h-14 text-2xl font-bold" />
              </Field>
              <p className="text-sm text-muted-foreground">建议每天早晚各测量一次,数据将自动同步给您的主治医生。</p>
            </Sheet>
          )}
        </section>
      )}

      <div className="h-4" />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent className="max-w-sm rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">确认删除？</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              将删除：<span className="font-medium text-foreground">{confirmDel?.label}</span>
              <br />删除后无法恢复，请谨慎操作。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-11 rounded-2xl text-base">取消</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete}
              className="h-11 rounded-2xl bg-destructive text-base text-destructive-foreground hover:bg-destructive/90">
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-base">{label}</Label>
      {children}
    </div>
  );
}

function Sheet({ title, children, onClose, onSave }: {
  title: string; children: React.ReactNode; onClose: () => void; onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:absolute md:rounded-[2.4rem]"
      onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose}><X className="size-5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-4">{children}</div>
        <Button className="mt-5 h-12 w-full text-base" onClick={onSave}>保存</Button>
      </div>
    </div>
  );
}