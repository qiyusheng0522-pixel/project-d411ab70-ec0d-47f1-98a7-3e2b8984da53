import { Link, useLocation } from "@tanstack/react-router";
import { Repeat, User, Stethoscope, Syringe, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const roles = [
  { to: "/patient", label: "患者端", icon: User, tint: "bg-sky-100 text-sky-600", match: (p: string) => p === "/patient" || p.startsWith("/patient/") || p === "/questionnaire" || p.startsWith("/questionnaire") || p === "/plan" || p === "/me" || p.startsWith("/scales") || p.startsWith("/records") || p.startsWith("/reports") || p.startsWith("/tasks") || p.startsWith("/community") || p.startsWith("/consult") || p.startsWith("/messages") || p.startsWith("/education") },
  { to: "/doctor", label: "医生端", icon: Stethoscope, tint: "bg-violet-100 text-violet-600", match: (p: string) => p.startsWith("/doctor") },
  { to: "/nurse", label: "护理端", icon: Syringe, tint: "bg-emerald-100 text-emerald-600", match: (p: string) => p.startsWith("/nurse") },
] as const;

export function RoleSwitcher({ compact = false, alwaysShow = false }: { compact?: boolean; alwaysShow?: boolean }) {
  const { pathname } = useLocation();
  const active = roles.find((r) => r.match(pathname)) ?? roles[0];
  const ActiveIcon = active.icon;
  return (
    <div className={cn(!alwaysShow && "md:hidden")}>
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm active:scale-95",
            compact && "px-2",
          )}
          aria-label="切换角色端"
        >
          <ActiveIcon className="size-3.5" />
          <span>{active.label}</span>
          <Repeat className="size-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-1.5">
        <p className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">切换角色端</p>
        <ul className="space-y-1">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = r.to === active.to;
            return (
              <li key={r.to}>
                <Link
                  to={r.to}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium",
                    isActive ? "bg-muted" : "hover:bg-muted/60",
                  )}
                >
                  <span className={cn("grid size-7 place-items-center rounded-lg", r.tint)}>
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1 text-foreground">{r.label}</span>
                  {isActive && <Check className="size-4 text-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
    </div>
  );
}