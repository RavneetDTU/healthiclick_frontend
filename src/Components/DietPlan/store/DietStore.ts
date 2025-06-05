import { create } from 'zustand';

export interface MealItem {
  id: number;
  meal_name: string;
  quantity: string;
  recipe: string;
  weekday?: string;
  category?: string;
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
          { id:1,  meal_name: 'fruit Salad', quantity: '100g' , recipe: 'Mix of seasonal fruits'},
          { id:2 , meal_name: 'pineapple', quantity: '1' , recipe: 'Fresh pineapple slices'},
          {id:3,  meal_name: 'fruit Salad', quantity: '100g', recipe: 'Mix of seasonal fruits'},
        ],
        'Meal 2': [
          { id:1 , meal_name: 'pineapple', quantity: '50g', recipe: 'Fresh pineapple slices'},
          { id:2, meal_name: 'chicken', quantity: '150g', recipe: 'Grilled chicken breast' },
        ],
        'Meal 3': [
          {id:1,  meal_name: 'mix veg', quantity: '50g', recipe: 'Mixed vegetables stir-fry'},
          {id:2 ,  meal_name: 'vegetable and roti', quantity: '200g', recipe: 'Mixed vegetables with roti' },
        ],
      },
    }),
}));
