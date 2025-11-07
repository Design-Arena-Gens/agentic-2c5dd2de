'use client';

import { useEffect, useMemo, useState } from "react";
import type { MealType } from "@/lib/types";

export type MealSelections = Record<string, Record<MealType, boolean>>;

const STORAGE_PREFIX = "karmic-canteen::meal-selections::";

const emptySelection: Record<MealType, boolean> = {
  breakfast: false,
  lunch: false,
  snacks: false,
};

export const useMealSelections = (
  userId: string,
  defaults?: MealSelections,
) => {
  const storageKey = `${STORAGE_PREFIX}${userId}`;
  const [selections, setSelections] = useState<MealSelections>({});

  useEffect(() => {
    try {
      const payload =
        typeof window !== "undefined"
          ? window.localStorage.getItem(storageKey)
          : null;
      if (payload) {
        setSelections(JSON.parse(payload));
      } else if (defaults) {
        setSelections(defaults);
      }
    } catch (error) {
      console.error("Failed to hydrate meal selections", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(selections));
      }
    } catch (error) {
      console.error("Unable to persist meal selections", error);
    }
  }, [storageKey, selections]);

  const toggleSelection = (date: string, mealType: MealType) => {
    setSelections((prev) => {
      const daily = prev[date] ?? { ...emptySelection };
      return {
        ...prev,
        [date]: {
          ...daily,
          [mealType]: !daily[mealType],
        },
      };
    });
  };

  const overrideSelections = (date: string, mealType: MealType, value: boolean) => {
    setSelections((prev) => {
      const daily = prev[date] ?? { ...emptySelection };
      return {
        ...prev,
        [date]: {
          ...daily,
          [mealType]: value,
        },
      };
    });
  };

  const getSelection = (date: string, mealType: MealType) =>
    selections[date]?.[mealType] ?? false;

  const summary = useMemo(() => {
    const entries = Object.entries(selections);
    const totalOpted = entries.reduce((acc, [, meals]) => {
      return acc + Object.values(meals).filter(Boolean).length;
    }, 0);
    return {
      totalOpted,
      upcomingDays: entries.length,
    };
  }, [selections]);

  return {
    selections,
    summary,
    toggleSelection,
    overrideSelections,
    getSelection,
  };
};
