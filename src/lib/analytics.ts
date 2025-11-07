import {
  aggregateOptInHistory,
  employeeMealHistory,
  feedbackEntries,
  inventory,
  menus,
} from "@/data/sample-data";
import type {
  EmployeeMealHistory,
  MealSelectionRecord,
  MealType,
} from "@/lib/types";

export const getEmployeeHistory = (
  userId: string,
): EmployeeMealHistory | undefined =>
  employeeMealHistory.find((entry) => entry.userId === userId);

export const getEmployeeOptInOverview = (userId: string) => {
  const history = getEmployeeHistory(userId);

  if (!history) {
    return {
      lastSevenDays: 0,
      preferredMeals: [] as MealType[],
      participationRate: 0,
    };
  }

  const records = history.records;
  const slice = records.slice(-9); // roughly last 3 days worth (3 meals * 3 days)

  const participationRate =
    slice.reduce((acc, record) => acc + (record.optedIn ? 1 : 0), 0) /
    Math.max(slice.length, 1);

  const mealTypeCounts = slice.reduce<Record<MealType, number>>(
    (acc, record) => {
      if (record.optedIn) {
        acc[record.mealType] = (acc[record.mealType] ?? 0) + 1;
      }
      return acc;
    },
    {
      breakfast: 0,
      lunch: 0,
      snacks: 0,
    },
  );

  const preferredMeals = (Object.entries(mealTypeCounts) as [MealType, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([mealType]) => mealType);

  return {
    lastSevenDays: slice.length,
    preferredMeals,
    participationRate,
  };
};

export const buildTrendline = (records: MealSelectionRecord[]) => {
  const grouped = records.reduce<Record<string, { total: number; opted: number }>>(
    (acc, record) => {
      const day = record.date;
      const entry = acc[day] ?? { total: 0, opted: 0 };
      entry.total += 1;
      if (record.optedIn) entry.opted += 1;
      acc[day] = entry;
      return acc;
    },
    {},
  );

  return Object.entries(grouped)
    .map(([date, { total, opted }]) => ({
      date,
      optInRate: Number(((opted / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getAggregateTrendline = () => buildTrendline(aggregateOptInHistory);

export const getInventoryRisk = () =>
  inventory.map((item) => ({
    ...item,
    risk:
      item.current < item.parLevel * 0.75
        ? "high"
        : item.current < item.parLevel
          ? "medium"
          : "low",
    utilization:
      item.parLevel === 0 ? 0 : Number(((item.current / item.parLevel) * 100).toFixed(0)),
  }));

export const getWasteForecast = () => {
  const upcoming = menus.slice(0, 4);

  return upcoming.map((menu) => {
    const plannedInventory = menu.meals.reduce((acc, meal) => {
      return (
        acc +
        meal.items.reduce((total, item) => total + item.inventoryUsage, 0)
      );
    }, 0);

    const predictedOptIns = Math.round(plannedInventory / 3.5);
    const wasteAvoidedKg = Number((predictedOptIns * 0.12).toFixed(1));

    return {
      date: menu.date,
      predictedOptIns,
      wasteAvoidedKg,
      carbonOffset: Number((wasteAvoidedKg * 2.1).toFixed(1)),
    };
  });
};

export type WasteForecast = ReturnType<typeof getWasteForecast>;

export const getFeedbackSnapshot = () => {
  const recent = feedbackEntries.slice(0, 3);
  const average =
    recent.reduce((acc, item) => acc + item.rating, 0) / Math.max(recent.length, 1);

  return {
    average: Number(average.toFixed(1)),
    entries: recent,
  };
};

export type InventoryRisk = ReturnType<typeof getInventoryRisk>;
export type FeedbackSnapshot = ReturnType<typeof getFeedbackSnapshot>;
