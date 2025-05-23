import { create } from "zustand"

// Types
export interface User {
  id: string
  name: string
  email: string
  profileImage: string
  coverImage: string
  membershipType: string
  memberSince: string
  exerciseCount: number
  mealCount: number
  dietAdherence: number
  exerciseCompletion: number
  goalProgress: number
}

export interface Meal {
  id: string
  meal_name: string
  quantity: string
  recipe: string
  date: string
  label?: string
}

export interface Exercise {
  id: string
  exercise_name: string
  duration: string
  video_link: string
  date: string
}

export interface Appointment {
  id: string
  title: string
  date: string
  type: string
}

interface DialogState {
  mealSeprate: boolean
  mealDoc: boolean
  exercise: boolean
}

interface ProfileState {
  user: User
  meals: Meal[]
  exercises: Exercise[]
  appointments: Appointment[]
  dialogOpen: DialogState
  setDialogOpen: (type: keyof DialogState, isOpen: boolean) => void
  addMeal: (meal: Meal) => void
  addExercise: (exercise: Exercise) => void
}

// Initial mock data
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  profileImage: '/images/assets/profile_avtar.png',
  coverImage: "",
  membershipType: "Premium",
  memberSince: "Jan 2023",
  exerciseCount: 24,
  mealCount: 36,
  dietAdherence: 78,
  exerciseCompletion: 65,
  goalProgress: 42,
}

const mockMeals: Meal[] = [
  {
    id: "1",
    meal_name: "Protein Smoothie",
    quantity: "1 serving (300ml)",
    recipe: "Blend 1 banana, 1 scoop protein powder, 1 cup almond milk, and ice.",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "2",
    meal_name: "Grilled Chicken Salad",
    quantity: "1 bowl (350g)",
    recipe: "Mix grilled chicken breast, lettuce, tomatoes, cucumber with olive oil dressing.",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]

const mockExercises: Exercise[] = [
  {
    id: "1",
    exercise_name: "Running",
    duration: "30 minutes",
    video_link: "https://youtube.com/watch?v=example1",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "2",
    exercise_name: "Push-ups",
    duration: "15 minutes",
    video_link: "https://youtube.com/watch?v=example2",
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
]

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
]

// Create store
export const useProfileStore = create<ProfileState>((set) => ({
  user: mockUser,
  meals: mockMeals,
  exercises: mockExercises,
  appointments: mockAppointments,
  dialogOpen: {
    mealSeprate: false,
    mealDoc: false,
    exercise: false,
  },
  setDialogOpen: (type, isOpen) =>
    set((state) => ({
      dialogOpen: {
        ...state.dialogOpen,
        [type]: isOpen,
      },
    })),
  addMeal: (meal) =>
    set((state) => {
      const newMeals = [...state.meals, meal]
      return {
        meals: newMeals,
        user: {
          ...state.user,
          mealCount: state.user.mealCount + 1,
        },
      }
    }),
  addExercise: (exercise) =>
    set((state) => {
      const newExercises = [...state.exercises, exercise]
      return {
        exercises: newExercises,
        user: {
          ...state.user,
          exerciseCount: state.user.exerciseCount + 1,
        },
      }
    }),
}))
