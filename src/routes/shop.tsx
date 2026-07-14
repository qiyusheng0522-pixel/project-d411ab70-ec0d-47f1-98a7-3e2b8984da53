import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShoppingCart, Star, Package, Utensils, HeartPulse, Plus, Truck, ShieldCheck } from "lucide-react";
import { MobileShell, PageHeader } from "@/components/MobileShell";

export const Route = createFileRoute("/shop")({ component: Shop });

type Category = "服务包" | "健康餐" | "健康商品";

type Product = {
  id: string;
  cat: Category;
  title: string;
  desc: string;
  price: number;
  unit: string;
  tag?: string;
  sales: number;
  rating: number;
  cover: string; // gradient classes
};

const products: Product[] = [
  // 服务包
  { id: "s1", cat: "服务包", title: "卒中康复月度套餐", desc: "康复师上门 4 次 + 24h 在线随访", price: 1980, unit: "月", tag: "热销", sales: 328, rating: 4.9, cover: "from-sky-300 to-blue-200" },
  { id: "s2", cat: "服务包", title: "居家护理季度包", desc: "护士上门测评 · 用药指导 · 血压监测", price: 3680, unit: "季", tag: "医护上门", sales: 156, rating: 4.8, cover: "from-emerald-300 to-teal-200" },
  { id: "s3", cat: "服务包", title: "AI 智能随访年卡", desc: "全年 AI 随访 + 医生月度复盘", price: 899, unit: "年", tag: "省心", sales: 512, rating: 4.7, cover: "from-violet-300 to-purple-200" },
  { id: "s4", cat: "服务包", title: "二级预防管理包", desc: "药事管理 · 复查提醒 · 报告解读", price: 1288, unit: "半年", sales: 214, rating: 4.8, cover: "from-rose-300 to-pink-200" },

  // 健康餐
  { id: "m1", cat: "健康餐", title: "低盐低脂周餐 (7 日)", desc: "地中海饮食 · 冷链配送到家", price: 268, unit: "周", tag: "营养师配", sales: 892, rating: 4.9, cover: "from-lime-300 to-emerald-200" },
  { id: "m2", cat: "健康餐", title: "吞咽障碍软食餐", desc: "糊状 / 软烂 · 便于吞咽安全", price: 328, unit: "周", tag: "康复期", sales: 261, rating: 4.7, cover: "from-orange-300 to-amber-200" },
  { id: "m3", cat: "健康餐", title: "糖尿病控糖套餐", desc: "低 GI 主食 · 精准控糖", price: 288, unit: "周", sales: 445, rating: 4.8, cover: "from-teal-300 to-cyan-200" },
  { id: "m4", cat: "健康餐", title: "高蛋白康复餐", desc: "术后 / 恢复期 · 补充优质蛋白", price: 348, unit: "周", sales: 178, rating: 4.7, cover: "from-yellow-300 to-orange-200" },

  // 健康商品
  { id: "g1", cat: "健康商品", title: "上臂式电子血压计", desc: "医用级精度 · 蓝牙同步", price: 399, unit: "台", tag: "同步档案", sales: 1204, rating: 4.9, cover: "from-blue-300 to-indigo-200" },
  { id: "g2", cat: "健康商品", title: "智能血糖仪套装", desc: "含 50 试纸 · 数据上传", price: 259, unit: "套", sales: 866, rating: 4.8, cover: "from-red-300 to-rose-200" },
  { id: "g3", cat: "健康商品", title: "康复训练握力球组", desc: "3 档硬度 · 手部康复训练", price: 89, unit: "套", tag: "康复训练", sales: 632, rating: 4.7, cover: "from-purple-300 to-fuchsia-200" },
  { id: "g4", cat: "健康商品", title: "防跌倒助行器", desc: "轻质铝合金 · 四轮带刹车", price: 599, unit: "件", sales: 342, rating: 4.8, cover: "from-slate-300 to-zinc-200" },
];

const cats: { key: Category; icon: typeof Package; tint: string }[] = [
  { key: "服务包", icon: Package, tint: "from-sky-500 to-blue-500" },
  { key: "健康餐", icon: Utensils, tint: "from-emerald-500 to-teal-500" },
  { key: "健康商品", icon: HeartPulse, tint: "from-rose-500 to-pink-500" },
];

function Shop() {
  const [cat, setCat] = useState<Category>("服务包");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  const list = products.filter(
    (p) => p.cat === cat && (q === "" || p.title.includes(q) || p.desc.includes(q)),
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const add = (p: Product) => {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
    setToast(`已加入购物车:${p.title}`);
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <MobileShell>
      <PageHeader title="健康服务商城" subtitle="精选服务包 · 健康餐 · 健康商品" />

      {/* Search */}
      <section className="mx-4 mt-1 flex items-center gap-2 rounded-full bg-card px-4 py-2.5 shadow-[var(--shadow-card)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索服务或商品"
          className="w-full bg-transparent text-sm outline-none"
        />
        <button className="relative grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
          <ShoppingCart className="size-4" />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </section>

      {/* Category tiles */}
      <section className="mx-4 mt-4 grid grid-cols-3 gap-2.5">
        {cats.map((c) => {
          const Icon = c.icon;
          const on = c.key === cat;
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={
                "flex flex-col items-center gap-1.5 rounded-2xl p-3 shadow-[var(--shadow-card)] active:scale-95 " +
                (on ? "bg-primary/5 ring-2 ring-primary" : "bg-card")
              }
            >
              <span className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${c.tint} text-white`}>
                <Icon className="size-5" />
              </span>
              <span className={"text-sm font-bold " + (on ? "text-primary" : "text-foreground")}>
                {c.key}
              </span>
            </button>
          );
        })}
      </section>

      {/* Trust bar */}
      <section className="mx-4 mt-3 flex items-center justify-around rounded-2xl bg-card px-3 py-2 text-[11px] text-muted-foreground shadow-[var(--shadow-card)]">
        <span className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-emerald-500" /> 医院合作</span>
        <span className="flex items-center gap-1"><Truck className="size-3.5 text-sky-500" /> 冷链配送</span>
        <span className="flex items-center gap-1"><Star className="size-3.5 text-amber-500" /> 好评保障</span>
      </section>

      {/* Product list */}
      <ul className="mx-4 mt-3 space-y-3">
        {list.map((p) => (
          <li
            key={p.id}
            className="flex gap-3 overflow-hidden rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
          >
            <div className={`grid h-28 w-28 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${p.cover}`}>
              {p.cat === "服务包" && <Package className="size-9 text-white/90" />}
              {p.cat === "健康餐" && <Utensils className="size-9 text-white/90" />}
              {p.cat === "健康商品" && <HeartPulse className="size-9 text-white/90" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <p className="line-clamp-2 text-sm font-bold leading-snug text-foreground">
                  {p.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{p.desc}</p>
                {p.tag && (
                  <span className="mt-1.5 inline-block rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-500">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-end justify-between">
                <div className="min-w-0">
                  <p className="whitespace-nowrap text-base font-bold text-rose-500">
                    ¥{p.price}
                    <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">/{p.unit}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Star className="size-3 text-amber-500" fill="currentColor" />{p.rating}</span>
                    <span>·</span>
                    <span>{p.sales} 售</span>
                  </p>
                </div>
                <button
                  onClick={() => add(p)}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground active:scale-95"
                >
                  <Plus className="size-3" /> 加购
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="h-6" />

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground/90 px-4 py-2 text-xs font-semibold text-background shadow-lg">
          {toast}
        </div>
      )}
    </MobileShell>
  );
}
