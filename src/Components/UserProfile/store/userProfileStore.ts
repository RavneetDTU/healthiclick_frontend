import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface User {
  userid: string;
  name: string;
  email: string;
  phone?: string;
  profileImage: string;
  coverImage: string;
  avatar?: string | null;
  membershipType: string;
  memberSince: string;
  exerciseCount: number;
  mealCount: number;
  dietAdherence: number;
  exerciseCompletion: number;
  goalProgress: number;
}

export interface Meal {
  id: string;
  meal_name: string;
  quantity: string;
  recipe: string;
  date: string;
  label?: string;
  weekday?: string;
}

export interface Exercise {
  id: string;
  exercise_name: string;
  duration: string;
  video_link: string;
  date: string;
  label?: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface DialogState {
  mealSeprate: boolean;
  mealDoc: boolean;
  exercise: boolean;
}

interface ProfileState {
  user: User;
  meals: Meal[];
  exercises: Exercise[];
  appointments: Appointment[];
  dialogOpen: DialogState;
  setUser: (newUser: Partial<User>) => void;
  setDialogOpen: (type: keyof DialogState, isOpen: boolean) => void;
  addMeal: (meal: Meal) => void;
  addExercise: (exercise: Exercise) => void;
}

// Initial mock data
const mockUser: User = {
  userid: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  profileImage: "/images/assets/profile_avtar.png",
  coverImage: "",
  avatar: null,
  membershipType: "Premium",
  memberSince: "Jan 2023",
  exerciseCount: 24,
  mealCount: 36,
  dietAdherence: 78,
  exerciseCompletion: 65,
  goalProgress: 42,
};

const mockMeals: Meal[] = [
  {
    id: "1",
    meal_name: "Protein Smoothie",
    quantity: "1 serving (300ml)",
    recipe: "Blend 1 banana, 1 scoop protein powder, 1 cup almond milk, and ice.",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    meal_name: "Grilled Chicken Salad",
    quantity: "1 bowl (350g)",
    recipe: "Mix grilled chicken breast, lettuce, tomatoes, cucumber with olive oil dressing.",
    date: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockExercises: Exercise[] = [
  {
    id: "1",
    exercise_name: "Running",
    duration: "30 minutes",
    video_link: "https://youtube.com/watch?v=example1",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    exercise_name: "Push-ups",
    duration: "15 minutes",
    video_link: "https://youtube.com/watch?v=example2",
    date: new Date(Date.now() - 259200000).toISOString(),
  },
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Fitness Assessment",
    date: "Tomorrow, 10:00 AM",
    type: "assessment",
  },
  {
    id: "2",
    title: "Nutrition Consultation",
    date: "May 20, 2:30 PM",
    type: "nutrition",
  },
  {
    id: "3",
    title: "Personal Training",
    date: "May 22, 4:00 PM",
    type: "training",
  },
];

// Persisted Zustand Store
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      user: mockUser,
      meals: mockMeals,
      exercises: mockExercises,
      appointments: mockAppointments,
      dialogOpen: {
        mealSeprate: false,
        mealDoc: false,
        exercise: false,
      },
      setUser: (newUser) =>
        set((state) => ({
          user: {
            ...state.user,
            ...newUser,
          },
        })),
      setDialogOpen: (type, isOpen) =>
        set((state) => ({
          dialogOpen: {
            ...state.dialogOpen,
            [type]: isOpen,
          },
        })),
      addMeal: (meal) =>
        set((state) => ({
          meals: [...state.meals, meal],
          user: {
            ...state.user,
            mealCount: state.user.mealCount + 1,
          },
        })),
      addExercise: (exercise) =>
        set((state) => ({
          exercises: [...state.exercises, exercise],
          user: {
            ...state.user,
            exerciseCount: state.user.exerciseCount + 1,
          },
        })),
    }),
    {
      name: "profile-storage", // Key in localStorage
      partialize: (state) => ({ user: state.user }), // Only persist user
    }
  )
);
