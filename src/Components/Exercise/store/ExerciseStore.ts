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

interface ExerciseState {
  weekDay: string;
  exercisesByDay: Record<string, Exercise[]>;
  setWeekDay: (day: string) => void;
  setExercisesByDay: (
    updater: (prev: Record<string, Exercise[]>) => Record<string, Exercise[]>
  ) => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  weekDay: "Monday",
  exercisesByDay: {},
  setWeekDay: (day) => set({ weekDay: day }),
  setExercisesByDay: (updater) =>
    set((state) => ({
      exercisesByDay: updater(state.exercisesByDay),
    })),
}));
