import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { articles } from "@/lib/education";

export const Route = createFileRoute("/education/$id")({ component: ArticleView });

function ArticleView() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <MobileShell>
        <div className="p-6 text-center text-muted-foreground">
          文章不存在 · <Link to="/education" className="text-primary">返回</Link>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <button onClick={() => navigate({ to: "/education" })} className="p-1">
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-sm font-semibold">{article.category}</span>
        <button className="p-1 text-muted-foreground">
          <Share2 className="size-5" />
        </button>
      </header>

      <div className={`mx-4 mt-4 aspect-[16/9] rounded-2xl bg-gradient-to-br ${article.cover}`} />

      <article className="mx-4 mt-4">
        <h1 className="text-2xl font-bold leading-tight text-foreground">{article.title}</h1>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" /> {article.readTime} · 健康团队
        </p>
        <p className="mt-4 rounded-2xl bg-accent p-3 text-sm text-accent-foreground">
          {article.summary}
        </p>
        <div className="mt-5 space-y-4">
          {article.body.map((p, i) => (
            <p key={i} className="text-[15px] leading-7 text-foreground/85">{p}</p>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-border p-4 text-xs text-muted-foreground">
          本内容由临床医师团队审核,仅作健康教育用途,不能替代专业医疗建议。如有不适请及时就医。
        </div>
      </article>
    </MobileShell>
  );
}