import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/MobileShell";
import { articles } from "@/lib/education";

export const Route = createFileRoute("/education")({ component: Education });

const categories = ["全部", "康复训练", "营养支持", "用药管理", "预警识别", "心理支持"];

function Education() {
  return (
    <MobileShell>
      <PageHeader title="健康宣教" subtitle="卒中专病科普知识库" />
      <div className="no-scrollbar mx-4 mt-2 flex gap-2 overflow-x-auto pb-2">
        {categories.map((c, i) => (
          <button
            key={c}
            className={
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition " +
              (i === 0
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground")
            }
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mx-4 mt-2 space-y-3">
        {articles.map((a) => (
          <li key={a.id}>
            <Link
              to="/education/$id"
              params={{ id: a.id }}
              className="flex gap-3 overflow-hidden rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <div className={`h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br ${a.cover}`} />
              <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                <div>
                  <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
                    {a.category}
                  </span>
                  <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-foreground">
                    {a.title}
                  </p>
                </div>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3" /> {a.readTime}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </MobileShell>
  );
}