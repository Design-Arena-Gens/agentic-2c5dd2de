"use client";

import type { Announcement, DayMenu } from "@/lib/types";
import { mealTypeLabels } from "@/data/sample-data";
import type {
  FeedbackSnapshot,
  InventoryRisk,
  WasteForecast,
} from "@/lib/analytics";
import { format } from "date-fns";
import {
  AlertTriangle,
  BarChart3,
  BellRing,
  ClipboardList,
  LogOut,
  PieChart,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AdminDashboardProps {
  user: {
    name?: string | null;
    department: string;
  };
  trendline: { date: string; optInRate: number }[];
  wasteForecast: WasteForecast;
  menus: DayMenu[];
  inventory: InventoryRisk;
  feedbackSnapshot: FeedbackSnapshot;
  announcements: Announcement[];
}

const formatDate = (date: string) =>
  format(new Date(date + "T00:00:00"), "EEE, MMM d");

export const AdminDashboard = ({
  user,
  trendline,
  wasteForecast,
  menus,
  inventory,
  feedbackSnapshot,
  announcements,
}: AdminDashboardProps) => {
  const [menuPlan, setMenuPlan] = useState(
    menus.map((menu) => ({
      date: menu.date,
      targetOptIns: 380,
      confirmed: false,
    })),
  );

  const totalPredictedOptIns = wasteForecast.reduce(
    (acc, item) => acc + item.predictedOptIns,
    0,
  );

  const highRiskInventory = inventory.filter((item) => item.risk !== "low");

  const participationTrend = useMemo(
    () =>
      trendline.map((point) => ({
        ...point,
        direction: point.optInRate >= 70 ? "up" : "down",
      })),
    [trendline],
  );

  return (
    <div className="flex min-h-screen flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-lg xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Operations Control
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Welcome back, {user.name}
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Align procurement, production, and donations. Every confirmed meal
            reduces the uncertainty buffer you need to keep on hand.
          </p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-sky-500/40 bg-sky-500/10 p-5">
          <div className="flex items-center justify-between text-xs text-sky-200">
            Participation health
            <BarChart3 className="h-4 w-4" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {trendline.at(-1)?.optInRate ?? 0}%
          </p>
          <p className="text-xs text-slate-300">
            Opt-in rate across all meals (24h trailing)
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-5">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            Avoided waste (forecast)
            <TrendingDown className="h-4 w-4" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {wasteForecast.reduce((acc, item) => acc + item.wasteAvoidedKg, 0).toFixed(1)}{" "}
            kg
          </p>
          <p className="text-xs text-slate-300">Projected over next 4 service days</p>
        </div>

        <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-5">
          <div className="flex items-center justify-between text-xs text-amber-200">
            Inventory alerts
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {highRiskInventory.length}
          </p>
          <p className="text-xs text-slate-300">Items below 75% utilisation threshold</p>
        </div>

        <div className="rounded-3xl border border-purple-500/40 bg-purple-500/10 p-5">
          <div className="flex items-center justify-between text-xs text-purple-200">
            Service coverage plan
            <PieChart className="h-4 w-4" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {totalPredictedOptIns}
          </p>
          <p className="text-xs text-slate-300">Covers forecast for next 4 days</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Confirmed opt-in trend
            </h2>
            <span className="rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-300">
              2-week window
            </span>
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={participationTrend}>
                <defs>
                  <linearGradient id="adminTrend" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="rgba(148,163,184,0.12)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                  stroke="rgba(148,163,184,0.6)"
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(148,163,184,0.6)"
                  tickFormatter={(value) => `${value}%`}
                  domain={[40, 100]}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    border: "1px solid rgba(192,132,252,0.4)",
                    color: "#e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Opt-in rate"]}
                  labelFormatter={(value) =>
                    format(new Date(value), "EEEE, MMM d yyyy")
                  }
                />
                <Area
                  type="monotone"
                  dataKey="optInRate"
                  stroke="#c084fc"
                  strokeWidth={2}
                  fill="url(#adminTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Waste outlook</h2>
            <TrendingUp className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={wasteForecast}>
                <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.1)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                  stroke="rgba(148,163,184,0.6)"
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(148,163,184,0.6)"
                  tickFormatter={(value) => `${value}kg`}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    border: "1px solid rgba(34,197,94,0.4)",
                    color: "#e2e8f0",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name) => {
                    if (name === "wasteAvoidedKg") {
                      return [`${value} kg`, "Waste avoided"];
                    }
                    if (name === "carbonOffset") {
                      return [`${value} kg`, "CO₂e offset"];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(value) =>
                    format(new Date(value), "EEEE, MMM d yyyy")
                  }
                />
                <Bar
                  dataKey="wasteAvoidedKg"
                  fill="rgba(34,197,94,0.65)"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Menu readiness</h2>
            <RefreshCcw className="h-5 w-5 text-sky-300" />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Adjust target covers and lock production for each upcoming service.
          </p>
          <div className="mt-5 space-y-4">
            {menus.map((menu, index) => (
              <div
                key={menu.date}
                className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {formatDate(menu.date)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {menu.guestChef ?? "Core canteen team"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs uppercase tracking-[0.35em] text-slate-500">
                      Target covers
                    </label>
                    <input
                      type="number"
                      value={menuPlan[index].targetOptIns}
                      onChange={(event) =>
                        setMenuPlan((prev) => {
                          const next = [...prev];
                          next[index] = {
                            ...next[index],
                            targetOptIns: Number(event.target.value),
                          };
                          return next;
                        })
                      }
                      className="w-24 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-300/30"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setMenuPlan((prev) => {
                          const next = [...prev];
                          next[index] = {
                            ...next[index],
                            confirmed: !next[index].confirmed,
                          };
                          return next;
                        })
                      }
                      className={`rounded-full border px-3 py-2 text-xs transition ${
                        menuPlan[index].confirmed
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                          : "border-slate-700/70 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      {menuPlan[index].confirmed ? "Locked" : "Mark ready"}
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {menu.meals.map((meal) => (
                    <div
                      key={meal.type}
                      className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4 text-xs text-slate-300"
                    >
                      <p className="mb-2 text-sm font-semibold text-white">
                        {mealTypeLabels[meal.type]}
                      </p>
                      <ul className="space-y-2">
                        {meal.items.map((item) => (
                          <li key={item.name} className="flex justify-between gap-4">
                            <span>{item.name}</span>
                            <span>{item.inventoryUsage} portions</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Inventory status</h2>
            <ClipboardList className="h-5 w-5 text-sky-300" />
          </div>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-white">{item.name}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] ${
                      item.risk === "high"
                        ? "bg-rose-500/10 text-rose-200"
                        : item.risk === "medium"
                          ? "bg-amber-500/10 text-amber-200"
                          : "bg-emerald-500/10 text-emerald-200"
                    }`}
                  >
                    {item.risk}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Vendor: {item.vendor}</p>
                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                  <span>{item.current} {item.unit} on-hand</span>
                  <span>Par {item.parLevel} {item.unit}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      item.risk === "high"
                        ? "bg-rose-500"
                        : item.risk === "medium"
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                    }`}
                    style={{ width: `${Math.min(item.utilization, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Feedback signals</h2>
            <span className="rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-300">
              Avg {feedbackSnapshot.average}/5
            </span>
          </div>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            {feedbackSnapshot.entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {formatDate(entry.occurredOn)}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  Rating {entry.rating}/5
                </p>
                <p className="mt-2 text-sm text-slate-300">{entry.highlight}</p>
                {entry.improvement && (
                  <p className="mt-2 rounded-xl border border-slate-800/70 bg-slate-900/60 p-3 text-xs text-slate-400">
                    Improve: {entry.improvement}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Ops bulletins</h2>
            <BellRing className="h-5 w-5 text-sky-300" />
          </div>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {formatDate(item.createdAt)}
                </p>
                <p className="mt-1 text-base font-semibold text-white">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-slate-300">{item.message}</p>
                {item.cta && (
                  <a
                    href={item.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-sky-400/40 px-4 py-2 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/10"
                  >
                    {item.cta.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
};
