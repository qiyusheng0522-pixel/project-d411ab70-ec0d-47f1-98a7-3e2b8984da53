import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "@/components/RoleSwitcher";

export type PortalTab = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

export type PortalRole = "doctor" | "nurse";

const roleConfig: Record<PortalRole, { label: string; avatarBg: string; avatarText: string; accent: string }> = {
  doctor: {
    label: "医生",
    avatarBg: "bg-sky-500",
    avatarText: "莫",
    accent: "text-sky-600",
  },
  nurse: {
    label: "护士",
    avatarBg: "bg-emerald-500",
    avatarText: "李",
    accent: "text-emerald-600",
  },
};

export function PortalShell({
  role,
  title,
  tabs,
  children,
}: {
  role: PortalRole;
  title: string;
  tabs: PortalTab[];
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const cfg = roleConfig[role];

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-muted/40 md:min-h-[820px]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-card/95 px-3 pb-2 pt-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-0.5 text-sm text-muted-foreground active:scale-95"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <RoleSwitcher />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-foreground">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <Wifi className="size-4 text-emerald-500" />
          <span className={cn("text-xs font-semibold", cfg.accent)}>{cfg.label}</span>
          <span className={cn("grid size-8 place-items-center rounded-full text-sm font-bold text-white", cfg.avatarBg)}>
            {cfg.avatarText}
          </span>
        </div>
      </header>

      <main className="flex-1 pb-2">{children}</main>

      {/* Bottom tab bar */}
      <nav className="sticky bottom-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-5">
          {tabs.map((t) => {
            const active =
              t.to === tabs[0].to
                ? pathname === t.to
                : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <li key={t.to}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={t.to as any}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors",
                    active ? cfg.accent : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-[22px]" strokeWidth={active ? 2.4 : 1.8} />
                  <span className={cn(active && "font-semibold")}>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function StatTriple({ items }: { items: { value: string | number; label: string; color: string }[] }) {
  return (
    <div className="mx-3 mt-3 grid grid-cols-3 divide-x divide-border rounded-2xl bg-card py-4 shadow-[var(--shadow-card)]">
      {items.map((it) => (
        <div key={it.label} className="text-center">
          <p className={cn("text-3xl font-bold", it.color)}>{it.value}</p>
          <p className="mt-1 text-[12px] text-muted-foreground">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

export function TileCard({
  icon: Icon,
  iconBg,
  iconColor,
  count,
  label,
  dot,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  count: string | number;
  label: string;
  dot?: boolean;
  to: string;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      className="relative flex flex-col rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] active:scale-[0.99]"
    >
      <div className={cn("relative grid size-11 place-items-center rounded-xl", iconBg)}>
        <Icon className={cn("size-5", iconColor)} />
        {dot && (
          <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-rose-500 ring-2 ring-card" />
        )}
      </div>
      <p className="mt-4 text-3xl font-bold text-foreground">{count}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{label}</p>
    </Link>
  );
}