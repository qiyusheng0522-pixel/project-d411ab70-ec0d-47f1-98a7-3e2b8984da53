import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  User, FileSignature, Tag, HeartPulse, ChevronRight,
  Edit3, Check, ShieldCheck, Camera, BadgeCheck,
} from "lucide-react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/me")({ component: Me });

const tags = [
  "缺血性卒中", "高血压", "颈动脉狭窄", "高脂血症",
  "右侧偏瘫", "言语障碍", "吸烟史", "非瓣膜性房颤",
];


function Me() {
  const [section, setSection] = useState<"home" | "profile" | "consent" | "tags">("home");
  const [verified, setVerified] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhoto(url);
    setVerified(true);
    toast.success("实名认证已提交", { description: "我们将在 24 小时内完成审核" });
  };

  if (section === "profile") return <Profile back={() => setSection("home")} />;
  if (section === "consent") return <Consent back={() => setSection("home")} />;
  if (section === "tags") return <Tags back={() => setSection("home")} />;

  return (
    <MobileShell>
      {/* Profile header */}
      <div
        className="px-5 pb-8 pt-8 text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white/25 text-2xl font-bold ring-2 ring-white/40 active:scale-95"
            aria-label="上传实名照片"
          >
            {photo ? (
              <img src={photo} alt="头像" className="size-full object-cover" />
            ) : "张"}
            <span className="absolute bottom-0 right-0 grid size-5 place-items-center rounded-full bg-white text-primary shadow">
              <Camera className="size-3" />
            </span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onPick} />
          <div>
            <p className="flex items-center gap-1.5 text-xl font-bold">
              张大伯
              {verified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-white/25 px-2 py-0.5 text-xs font-medium">
                  <BadgeCheck className="size-3" /> 已实名
                </span>
              )}
            </p>
            <p className="mt-0.5 text-base opacity-90">男 · 68 岁 · 患者编号 P10086</p>
          </div>
        </div>
      </div>

      <div className="-mt-6 space-y-3 px-4">
        {!verified && (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-4 text-left active:scale-[0.99]"
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Camera className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-foreground">拍照实名认证</p>
              <p className="mt-0.5 text-sm text-muted-foreground">拍摄身份证照片即可完成认证，便于医生确认身份</p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        )}
        <Card icon={User} title="基本信息" desc="姓名、年龄、联系方式、紧急联系人"
          onClick={() => setSection("profile")} />
        <Card icon={FileSignature} title="知情同意书" desc="数据采集与隐私授权"
          onClick={() => setSection("consent")} badge="已签署" />
        <Card icon={Tag} title="我的标签" desc={`${tags.length} 个专病标签`}
          onClick={() => setSection("tags")} />
        <Link to="/records" className="block">
          <Card icon={HeartPulse} title="我的数据" desc="血压、血糖、心率、体温、用药" onClick={() => {}} />
        </Link>
      </div>

      <p className="mx-4 mt-6 text-center text-xs text-muted-foreground">卒中专病管理 v1.0</p>
    </MobileShell>
  );
}

function Card({ icon: Icon, title, desc, onClick, badge }: {
  icon: React.ComponentType<{ className?: string }>; title: string; desc: string;
  onClick: () => void; badge?: string;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.99]">
      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
      </div>
      {badge && (
        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
          <Check className="size-3" /> {badge}
        </span>
      )}
      <ChevronRight className="size-5 text-muted-foreground" />
    </button>
  );
}

/* ---------- 基本信息 ---------- */
function Profile({ back }: { back: () => void }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({
    name: "张大伯", gender: "男", age: "68", phone: "138 0000 0000",
    idNo: "3101**********1234", emergencyName: "张小华(子)", emergencyPhone: "139 1111 1111",
    address: "上海市黄浦区某街道 1 号",
  });

  return (
    <MobileShell>
      <PageHeader title="基本信息" subtitle="请确保信息真实,便于医生联系" />
      <button onClick={back} className="mx-5 text-sm text-primary">← 返回</button>
      <div className="mx-4 mt-3 space-y-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        {Object.entries({
          姓名: "name", 性别: "gender", 年龄: "age", 手机号: "phone", 身份证: "idNo",
          紧急联系人: "emergencyName", 紧急电话: "emergencyPhone", 居住地址: "address",
        }).map(([label, key]) => (
          <div key={key} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
            <span className="text-base text-muted-foreground">{label}</span>
            {editing ? (
              <input
                value={(data as Record<string, string>)[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                className="w-44 rounded-md border border-input bg-background px-2 py-1 text-right text-base"
                maxLength={50}
              />
            ) : (
              <span className="text-base font-medium text-foreground">{(data as Record<string, string>)[key]}</span>
            )}
          </div>
        ))}
      </div>
      <div className="mx-4 mt-4">
        <Button className="h-12 w-full text-base" onClick={() => setEditing((v) => !v)}>
          {editing ? <><Check className="size-4" /> 保存</> : <><Edit3 className="size-4" /> 编辑信息</>}
        </Button>
      </div>
    </MobileShell>
  );
}

/* ---------- 知情同意书 ---------- */
function Consent({ back }: { back: () => void }) {
  return (
    <MobileShell>
      <PageHeader title="知情同意书" />
      <button onClick={back} className="mx-5 text-sm text-primary">← 返回</button>
      <div className="mx-4 mt-3 space-y-3 rounded-2xl bg-card p-5 text-base leading-relaxed text-foreground/85 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="size-5" /> <span className="font-bold">您已于 2025-05-12 签署</span>
        </div>
        <p><b>一、数据采集范围</b><br />本平台将采集您的基本信息、档案资料、量表评分、体征数据(血压/血糖/心率/体温)及用药记录,用于辅助医生进行卒中专病随访与康复指导。</p>
        <p><b>二、数据使用</b><br />数据仅用于您的诊疗、随访和经脱敏后的科研统计,不会用于商业用途。</p>
        <p><b>三、隐私保护</b><br />所有数据传输与存储均采用加密方式,严格遵守《个人信息保护法》及《数据安全法》。</p>
        <p><b>四、您的权利</b><br />您可随时查阅、更正、导出或撤回授权;撤回授权后将停止数据采集,既往数据将进行匿名化处理。</p>
      </div>
      <div className="mx-4 mt-4">
        <Button variant="outline" className="h-12 w-full text-base">查看完整文本</Button>
      </div>
    </MobileShell>
  );
}

/* ---------- 我的标签 ---------- */
function Tags({ back }: { back: () => void }) {
  return (
    <MobileShell>
      <PageHeader title="我的标签" subtitle="医生根据您的档案自动生成" />
      <button onClick={back} className="mx-5 text-sm text-primary">← 返回</button>
      <div className="mx-4 mt-3 space-y-4">
        <Section title="疾病诊断">
          {tags.slice(0, 4).map((t) => <Chip key={t} label={t} tone="primary" />)}
        </Section>
        <Section title="症状 / 体征">
          {tags.slice(4, 6).map((t) => <Chip key={t} label={t} tone="accent" />)}
        </Section>
        <Section title="危险因素">
          {tags.slice(6).map((t) => <Chip key={t} label={t} tone="muted" />)}
        </Section>
      </div>
    </MobileShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
      <p className="mb-3 text-base font-bold text-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ label, tone }: { label: string; tone: "primary" | "accent" | "muted" }) {
  const cls = tone === "primary" ? "bg-primary/10 text-primary"
    : tone === "accent" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${cls}`}>{label}</span>;
}