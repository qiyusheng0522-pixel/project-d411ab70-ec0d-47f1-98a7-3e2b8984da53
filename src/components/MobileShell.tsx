import { Link, useLocation } from "@tanstack/react-router";
import { Home, ShieldCheck, Utensils, User, Sparkles, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnboardingPrompt } from "@/components/OnboardingPrompt";
import { RoleSwitcher } from "@/components/RoleSwitcher";

const tabs = [
  { to: "/patient", label: "首页", icon: Home },
  { to: "/questionnaire", label: "评估", icon: ShieldCheck },
  { to: "/ai", label: "AI助手", icon: Sparkles, highlight: true },
  { to: "/plan", label: "方案", icon: Utensils },
  { to: "/shop", label: "商城", icon: ShoppingBag },
  { to: "/me", label: "我的", icon: User },
] as const;

export function MobileShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-background pt-[env(safe-area-inset-top)] md:h-full md:pt-0">
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      <OnboardingPrompt />
      <nav className="sticky bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-5">
          {tabs.map((t) => {
            const active = t.to === "/patient" ? pathname === "/patient" : pathname.startsWith(t.to);
            const Icon = t.icon;
            const highlight = "highlight" in t && t.highlight;
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 text-xs transition-colors",
                    highlight
                      ? "text-primary"
                      : active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {highlight ? (
                    <span className="grid size-9 -mt-3 place-items-center rounded-full bg-gradient-to-br from-primary to-primary text-white shadow-[0_6px_16px_rgba(139,92,246,0.45)] ring-4 ring-card">
                      <Icon className="size-5" strokeWidth={2.2} />
                    </span>
                  ) : (
                    <Icon className="size-6" strokeWidth={active ? 2.5 : 1.8} />
                  )}
                  <span className={cn((active || highlight) && "font-semibold")}>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-5 pb-3 pt-6">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <RoleSwitcher />
      </div>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </header>
  );
}