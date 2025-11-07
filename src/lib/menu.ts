import { menus } from "@/data/sample-data";
import type { DayMenu } from "@/lib/types";

const sortByDate = (a: DayMenu, b: DayMenu) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

export const getUpcomingMenus = (limit = menus.length): DayMenu[] => {
  return [...menus].sort(sortByDate).slice(0, limit);
};

export const getMenuByDate = (date: string): DayMenu | undefined => {
  return menus.find((menu) => menu.date === date);
};

export const getNextMenu = (): DayMenu | undefined => {
  const now = new Date().toISOString().slice(0, 10);
  return getUpcomingMenus().find((menu) => menu.date >= now);
};
