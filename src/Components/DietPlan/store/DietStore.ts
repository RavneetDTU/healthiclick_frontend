import { create } from 'zustand';

export interface MealItem {
  meal_name: string;
  quantity: string;
}

export interface DietPlanState {
  weekDay: string;
  meals: Record<string, MealItem[]>; // Meals for one selected day
  setWeekDay: (day: string) => void;
  setMeals: (data: Record<string, MealItem[]>) => void;
  loadMockMeals: () => void; // ✅ move useEffect logic here
}

export const useDietPlanStore = create<DietPlanState>((set) => ({
  weekDay: 'Monday',
  meals: {},
  setWeekDay: (day) => set({ weekDay: day }),
  setMeals: (data) => set({ meals: data }),
  loadMockMeals: () =>
    set({
      meals: {
        'Meal 1': [
          { meal_name: 'fruit Salad', quantity: '100g' },
          { meal_name: 'pineapple', quantity: '1' },
          { meal_name: 'fruit Salad', quantity: '100g' },
        ],
        'Meal 2': [
          { meal_name: 'pineapple', quantity: '50g' },
          { meal_name: 'chicken', quantity: '150g' },
        ],
        'Meal 3': [
          { meal_name: 'mix veg', quantity: '50g' },
          { meal_name: 'vegetable and roti', quantity: '200g' },
        ],
      },
    }),
}));
