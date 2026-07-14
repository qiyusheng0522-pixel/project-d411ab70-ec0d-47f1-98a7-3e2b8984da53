import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock, ClipboardList } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { scaleList } from "@/lib/scales";

export const Route = createFileRoute("/scales")({ component: Scales });

const REQUIRED_IDS = new Set(["essen", "mrs", "phq9", "medadh"]);

function Scales() {
  const sorted = [...scaleList].sort((a, b) => {
    const ar = REQUIRED_IDS.has(a.id) ? 0 : 1;
    const br = REQUIRED_IDS.has(b.id) ? 0 : 1;
    return ar - br;
  });
  return (
    <MobileShell>
      <PageHeader title="量表评估" subtitle="国际通用卒中专病评估工具" />
      <p className="mx-4 mt-1 text-xs text-muted-foreground">
        <span className="mr-1 rounded-full bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">必填</span>
        为医生随访核心项,其余为
        <span className="mx-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">选填</span>
        进阶自查
      </p>
      <ul className="mx-4 mt-2 space-y-3">
        {sorted.map((s) => {
          const required = REQUIRED_IDS.has(s.id);
          return (
          <li key={s.id}>
            <Link
              to="/scales/$id"
              params={{ id: s.id }}
              className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}>
                <ClipboardList className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-foreground">{s.name}</span>
                  {required ? (
                    <span className="rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">必填</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">选填</span>
                  )}
                  <span className="truncate text-xs text-muted-foreground">{s.fullName}</span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{s.description}</p>
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-primary">
                  <Clock className="size-3" /> {s.duration} · 共 {s.questions.length} 题
                </p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </Link>
          </li>
          );
        })}
      </ul>
      <p className="mx-4 mt-6 text-center text-[11px] text-muted-foreground">
        本量表仅供患者自评参考,不能替代专业医师诊断
      </p>
    </MobileShell>
  );
}