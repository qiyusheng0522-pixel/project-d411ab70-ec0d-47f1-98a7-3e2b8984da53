import { Signal, Wifi, BatteryFull } from "lucide-react";
import { RoleSwitcher } from "@/components/RoleSwitcher";

/**
 * Wraps children in a phone bezel on >= md screens; on small screens renders
 * children directly so the actual mobile UX is unchanged.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile: pass through */}
      <div className="md:hidden">{children}</div>

      {/* Desktop: phone mockup */}
      <div className="hidden min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 p-8 md:flex">
        <div className="relative flex items-start gap-6">
        <div className="relative h-[860px] w-[420px] rounded-[3rem] bg-neutral-900 p-3 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]">
          {/* Side buttons */}
          <span className="absolute -left-1 top-28 h-10 w-1 rounded-l bg-neutral-800" />
          <span className="absolute -left-1 top-44 h-16 w-1 rounded-l bg-neutral-800" />
          <span className="absolute -left-1 top-64 h-16 w-1 rounded-l bg-neutral-800" />
          <span className="absolute -right-1 top-40 h-24 w-1 rounded-r bg-neutral-800" />

          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2.4rem] bg-background">
            {/* Status bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex h-9 items-center justify-between bg-background/95 px-7 text-[13px] font-semibold text-foreground backdrop-blur">
              <span>9:41</span>
              <div className="absolute left-1/2 top-1.5 h-6 w-28 -translate-x-1/2 rounded-full bg-neutral-900" />
              <div className="flex items-center gap-1.5">
                <Signal className="size-3.5" />
                <Wifi className="size-3.5" />
                <BatteryFull className="size-4" />
              </div>
            </div>
            <div className="h-full overflow-y-auto pt-9">{children}</div>
          </div>
        </div>
        {/* External role switcher (outside phone) */}
        <div className="flex flex-col items-start gap-2 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">切换角色端</p>
          <RoleSwitcher alwaysShow />
        </div>
        </div>
      </div>
    </>
  );
}