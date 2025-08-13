import { create } from "zustand";

export interface Exercise {
  exercise_name: string;
  duration: string;
  video_link: string;
  id: number;
  user_id: number;
  weekday: string;
  created_at: string;
}

export const ExerciseWeekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface ExerciseState {
  ExerciseWeekDay: string;
  exercisesByDay: Record<string, Exercise[]>;
  setExerciseWeekDay: (day: string) => void;
  setExercisesByDay: (
    updater: (prev: Record<string, Exercise[]>) => Record<string, Exercise[]>
  ) => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  ExerciseWeekDay: "monday",
  exercisesByDay: {},
  setExerciseWeekDay: (day) => set({ ExerciseWeekDay: day }),
  setExercisesByDay: (updater) =>
    set((state) => ({
      exercisesByDay: updater(state.exercisesByDay),
    })),
}));
