import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronLeft, Search, MessageCircle, Heart, Share2, Plus,
  Users, Flame, Stethoscope, HandHeart, Brain, Activity,
} from "lucide-react";

export const Route = createFileRoute("/community")({
  component: Community,
  head: () => ({
    meta: [
      { title: "卒中康复社区 · 患者与家属互助" },
      { name: "description", content: "卒中患者与家属交流康复经验、问答医生、加入互助小组的社区。" },
    ],
  }),
});

type Tab = "推荐" | "康复日记" | "医生问答" | "家属互助";

const groups = [
  { icon: Brain, name: "卒中后认知训练", members: "2,384", tint: "bg-violet-50 text-violet-600" },
  { icon: Activity, name: "偏瘫肢体康复", members: "5,102", tint: "bg-sky-50 text-sky-600" },
  { icon: HandHeart, name: "家属陪护经验", members: "3,760", tint: "bg-rose-50 text-rose-500" },
  { icon: Stethoscope, name: "复发预防打卡", members: "4,215", tint: "bg-emerald-50 text-emerald-600" },
];

const posts = [
  {
    id: "p1",
    tab: "康复日记" as Tab,
    author: "老陈的女儿",
    avatar: "bg-gradient-to-br from-rose-300 to-orange-200",
    time: "2 小时前",
    tag: "康复 90 天",
    title: "父亲卒中三个月:从卧床到独立行走的康复清单",
    excerpt:
      "分享一下三个月的康复安排:每日两次 30 分钟站立训练、Bobath 上肢引导、语言复读练习。血压稳定在 130/80,坚持真的有用。",
    stats: { like: 328, comment: 76, share: 21 },
    cover: "from-sky-200 to-emerald-200",
  },
  {
    id: "p2",
    tab: "医生问答" as Tab,
    author: "神内 · 王主任",
    avatar: "bg-gradient-to-br from-sky-400 to-sky-300",
    time: "今天 09:12",
    tag: "医生答疑",
    title: "阿司匹林 + 他汀漏服一次,要不要补吃?",
    excerpt:
      "常见问题:发现漏服未超过 4 小时可立即补服;超过则跳过本次,下一次按时服用即可,切勿双倍。长期规律用药是预防卒中复发的关键。",
    stats: { like: 512, comment: 143, share: 88 },
    cover: "from-sky-300 to-indigo-200",
  },
  {
    id: "p3",
    tab: "家属互助" as Tab,
    author: "小美同学",
    avatar: "bg-gradient-to-br from-emerald-300 to-teal-200",
    time: "昨天",
    tag: "情绪支持",
    title: "照顾卒中的父亲两年,写给同路人的一封信",
    excerpt:
      "最难的不是身体上的疲惫,是看着他一点点找回自己。想告诉正在照顾家人的你:你已经做得很好了,记得也照顾自己。",
    stats: { like: 986, comment: 214, share: 156 },
    cover: "from-rose-200 to-pink-100",
  },
  {
    id: "p4",
    tab: "康复日记" as Tab,
    author: "康复中的老周",
    avatar: "bg-gradient-to-br from-amber-300 to-orange-200",
    time: "3 天前",
    tag: "打卡 Day 62",
    title: "吞咽训练小心得:冰刺激 + 空吞咽,呛咳明显减少",
    excerpt:
      "EAT-10 从 12 分降到 4 分,治疗师教的冷刺激真的管用。附上每天训练时长和食物质地调整表。",
    stats: { like: 174, comment: 42, share: 12 },
    cover: "from-amber-200 to-yellow-100",
  },
  {
    id: "p5",
    tab: "医生问答" as Tab,
    author: "康复科 · 李医生",
    avatar: "bg-gradient-to-br from-violet-400 to-indigo-300",
    time: "2 天前",
    tag: "视频讲解",
    title: "偏瘫侧手部僵硬怎么办?3 个居家训练动作",
    excerpt:
      "被动屈伸 → 主动握拳 → 抓握器物,循序渐进。每天 3 组,每组 10 次,坚持 4 周多数患者张力会下降。",
    stats: { like: 421, comment: 98, share: 64 },
    cover: "from-violet-200 to-purple-100",
  },
];

function Community() {
  const [tab, setTab] = useState<Tab | "推荐">("推荐");
  const tabs: (Tab | "推荐")[] = ["推荐", "康复日记", "医生问答", "家属互助"];
  const filtered = tab === "推荐" ? posts : posts.filter((p) => p.tab === tab);

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-background pb-16">
      {/* Top */}
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-card/95 px-4 py-3 backdrop-blur">
        <Link to="/patient" className="grid size-9 place-items-center rounded-full text-foreground/80 active:bg-muted">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="flex-1 text-base font-bold text-foreground">卒中康复社区</h1>
        <button className="grid size-9 place-items-center rounded-full text-foreground/80 active:bg-muted">
          <Search className="size-5" />
        </button>
      </header>

      {/* Hero banner */}
      <section
        className="mx-4 mt-4 flex items-center gap-3 rounded-3xl p-4 text-primary-foreground shadow-[var(--shadow-soft)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20">
          <Users className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold leading-tight">和 2 万 + 卒中家庭一起康复</p>
          <p className="mt-0.5 text-xs opacity-90">医生答疑 · 康复打卡 · 家属互助</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-primary">
          加入
        </span>
      </section>

      {/* Groups */}
      <section className="mx-4 mt-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-base font-bold text-foreground">
            <Flame className="mr-1 inline size-4 text-rose-500" /> 热门小组
          </h3>
          <span className="text-xs text-muted-foreground">按主题精准交流</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {groups.map((g) => {
            const Icon = g.icon;
            return (
              <button
                key={g.name}
                className="flex items-center gap-2.5 rounded-2xl bg-card p-3 text-left shadow-[var(--shadow-card)] active:scale-[0.99]"
              >
                <div className={`grid size-10 place-items-center rounded-xl ${g.tint}`}>
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{g.name}</p>
                  <p className="text-[11px] text-muted-foreground">{g.members} 成员</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-[57px] z-20 mt-5 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-4">
          {tabs.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "relative shrink-0 px-3 py-3 text-sm font-semibold transition-colors " +
                  (active ? "text-foreground" : "text-muted-foreground")
                }
              >
                {t}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Feed */}
      <ul className="mx-4 mt-3 space-y-3">
        {filtered.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-2.5">
              <div className={`size-9 shrink-0 rounded-full ${p.avatar}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{p.author}</p>
                <p className="text-[11px] text-muted-foreground">{p.time}</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {p.tag}
              </span>
            </div>
            <h4 className="mt-2.5 text-[15px] font-bold leading-snug text-foreground">
              {p.title}
            </h4>
            <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {p.excerpt}
            </p>
            <div className={`mt-3 h-32 w-full rounded-xl bg-gradient-to-br ${p.cover}`} />
            <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="size-4" /> {p.stats.like}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-4" /> {p.stats.comment}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="size-4" /> {p.stats.share}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Floating publish */}
      <button
        className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] active:scale-95"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Plus className="size-4" /> 发布康复日记
      </button>
    </div>
  );
}