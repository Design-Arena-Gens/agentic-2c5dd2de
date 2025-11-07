"use client";

import type {
  Announcement,
  DayMenu,
  EmployeeMealHistory,
  MealType,
} from "@/lib/types";
import { mealTypeLabels } from "@/data/sample-data";
import { useMealSelections, type MealSelections } from "@/hooks/useMealSelections";
import type { WasteForecast } from "@/lib/analytics";
import { format } from "date-fns";
import {
  Bell,
  Check,
  Leaf,
  LogOut,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EmployeeDashboardProps {
  user: {
    name?: string | null;
    department: string;
    dietaryNotes?: string;
    defaultOptIn: {
      breakfast: boolean;
      lunch: boolean;
      snacks: boolean;
    };
  };
  userId: string;
  upcomingMenus: DayMenu[];
  nextMenu?: DayMenu;
  optInSummary: {
    lastSevenDays: number;
    preferredMeals: MealType[];
    participationRate: number;
  };
  trendline: { date: string; optInRate: number }[];
  history?: EmployeeMealHistory;
  announcements: Announcement[];
  wasteForecast: WasteForecast;
}

const formatDate = (date: string) =>
  format(new Date(date + "T00:00:00"), "EEE, MMM d");

const formatPercent = (value: number) => `${Math.round(value)}%`;

export const EmployeeDashboard = ({
  user,
  userId,
  upcomingMenus,
  nextMenu,
  optInSummary,
  trendline,
  history,
  announcements,
  wasteForecast,
}: EmployeeDashboardProps) => {
  const defaults: MealSelections = useMemo(
    () =>
      upcomingMenus.reduce<MealSelections>((acc, menu) => {
        acc[menu.date] = {
          breakfast: user.defaultOptIn.breakfast,
          lunch: user.defaultOptIn.lunch,
          snacks: user.defaultOptIn.snacks,
        };
        return acc;
      }, {}),
    [upcomingMenus, user.defaultOptIn],
  );

  const { getSelection, toggleSelection, summary } = useMealSelections(
    userId,
    defaults,
  );

  const preferredMeals =
    optInSummary.preferredMeals?.map((meal) => mealTypeLabels[meal]) ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-8 p-6 md:p-10">
      <header className="flex flex-col gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 backdrop-blur-lg lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
            Karmic Canteen
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Hello, {user.name}
          </h1>
          <p className="max-w-xl text-sm text-slate-300 md:text-base">
            Finalise tomorrow’s meals before 17:00 to lock in procurement.
            You’re helping the team eliminate surplus ingredients in{" "}
            <span className="font-semibold text-sky-300">real time.</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user.dietaryNotes && (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-200">
              <Sparkles className="h-4 w-4" />
              {user.dietaryNotes}
            </span>
          )}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <UtensilsCrossed className="h-5 w-5 text-sky-300" />
            Tomorrow&apos;s Menu
          </h2>
          {nextMenu ? (
            <div className="mt-4 space-y-5">
              <div className="rounded-2xl border border-sky-500/30 bg-slate-950/50 p-4 text-sm">
                <p className="text-slate-300">Serving on {formatDate(nextMenu.date)}</p>
                {nextMenu.guestChef && (
                  <p className="mt-2 text-xs text-slate-400">
                    Guest chef: {nextMenu.guestChef}
                  </p>
                )}
                {nextMenu.sustainabilityNote && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {nextMenu.sustainabilityNote}
                  </p>
                )}
              </div>
              <div className="space-y-4">
                {nextMenu.meals.map((meal) => (
                  <div
                    key={meal.type}
                    className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">
                        {mealTypeLabels[meal.type]}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleSelection(nextMenu.date, meal.type)}
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition ${
                          getSelection(nextMenu.date, meal.type)
                            ? "bg-sky-400/20 text-sky-200"
                            : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        {getSelection(nextMenu.date, meal.type)
                          ? "Opted in"
                          : "Opt in"}
                      </button>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-300">
                      {meal.items.map((item) => (
                        <li
                          key={item.name}
                          className="flex items-start justify-between gap-3 rounded-xl bg-slate-900/60 px-3 py-2"
                        >
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-xs text-slate-400">
                              {item.tags.join(" · ")}
                            </p>
                          </div>
                          <div className="text-right text-xs text-slate-400">
                            <p>{item.calories} kcal</p>
                            {item.allergens.length > 0 && (
                              <p className="text-amber-200">
                                Contains {item.allergens.join(", ")}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-300">
              The next menu hasn’t been published yet. You’ll get an alert as soon
              as it drops.
            </p>
          )}
        </article>

        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/50 p-6 lg:col-span-2">
          <header className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">Plan your week</h2>
            <p className="text-xs text-slate-400">
              {summary.totalOpted} meals locked | {summary.upcomingDays} days scheduled
            </p>
          </header>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {upcomingMenus.map((menu) => (
              <div
                key={menu.date}
                className="rounded-2xl border border-slate-800/60 bg-slate-950/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    {formatDate(menu.date)}
                  </p>
                  <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    {menu.meals.length} meals
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {menu.meals.map((meal) => (
                    <li key={meal.type} className="rounded-xl bg-slate-900/60 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <p className="font-semibold text-slate-200">
                          {mealTypeLabels[meal.type]}
                        </p>
                        <button
                          type="button"
                          onClick={() => toggleSelection(menu.date, meal.type)}
                          className={`rounded-full border px-3 py-1 transition ${
                            getSelection(menu.date, meal.type)
                              ? "border-sky-400/60 bg-sky-400/10 text-sky-200"
                              : "border-slate-700/70 text-slate-400 hover:border-slate-500"
                          }`}
                        >
                          {getSelection(menu.date, meal.type) ? "Opt-out" : "Opt-in"}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {meal.items[0]?.name}
                        {meal.items.length > 1 && ` + ${meal.items.length - 1} more`}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/50 p-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Your participation pulse
              </h2>
              <p className="text-xs text-slate-400">
                Preferred meals: {preferredMeals.join(" • ") || "Collecting data…"}
              </p>
            </div>
            <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {formatPercent(optInSummary.participationRate * 100)} participation
              rate
            </div>
          </header>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={trendline}>
                <defs>
                  <linearGradient id="optInGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="rgba(148,163,184,0.15)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                  stroke="rgba(148,163,184,0.6)"
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(148,163,184,0.6)"
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    border: "1px solid rgba(56,189,248,0.3)",
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
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#optInGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Waste forecast</h2>
            <Leaf className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Predictive model showing compost avoided when you confirm meals early.
          </p>
          <ul className="mt-5 space-y-4">
            {wasteForecast.map((forecast) => (
              <li
                key={forecast.date}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-100"
              >
                <p className="text-sm font-semibold text-emerald-200">
                  {formatDate(forecast.date)}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span>
                    {forecast.predictedOptIns} planned opt-ins •{" "}
                    {forecast.wasteAvoidedKg}kg waste avoided
                  </span>
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.35em] text-emerald-200">
                    {forecast.carbonOffset} kg co₂e
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <header className="flex items-center gap-2 text-lg font-semibold text-white">
            <Bell className="h-5 w-5 text-sky-300" />
            Announcements
          </header>
          <ul className="mt-4 space-y-4">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 text-sm text-slate-300"
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

        <article className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
          <header className="flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">Recent choices</h2>
            <span className="rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-300">
              Past 4 days
            </span>
          </header>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {history?.records.slice(-12).map((record) => (
              <div
                key={`${record.date}-${record.mealType}`}
                className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-950/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {mealTypeLabels[record.mealType]}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(record.date)}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    record.optedIn
                      ? "bg-sky-400/10 text-sky-200"
                      : "bg-slate-800/80 text-slate-400"
                  }`}
                >
                  {record.optedIn ? "Opted in" : "Skipped"}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};
