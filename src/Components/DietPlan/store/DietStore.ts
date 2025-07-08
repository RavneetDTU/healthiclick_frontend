import { create } from 'zustand';

export interface MealItem {
  id: number;
  meal_name: string;
  quantity: string;
  recipe: string;
  weekday?: string;
  category?: string;
  [key: string]: unknown;
}

export interface DietSection {
  name: string;
  time: string;
  weekday: string;
  elements: {
    mealname: string;
    quantity: string;
    recipe: string;
  }[];
}

export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export interface DietPlanState {
  weekDay: string;
  meals: Record<string, MealItem[]>;
  setWeekDay: (day: string) => void;
  setMeals: (data: Record<string, MealItem[]>) => void;
  loadMockMeals: () => void;
}

export const useDietPlanStore = create<DietPlanState>((set) => ({
  weekDay: 'Monday',
  meals: {},
  setWeekDay: (day) => set({ weekDay: day }),
  setMeals: (data) => set({ meals: data }),
  loadMockMeals: () =>
    set({}),
}));
