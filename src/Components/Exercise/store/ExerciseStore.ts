import { create } from 'zustand';

export interface Exercise {
  name: string;
  duration: string;
  videoUrl: string;
}

interface ExerciseState {
  weekDay: string;
  exercisesByDay: Record<string, Exercise[]>;
  setWeekDay: (day: string) => void;
  loadMockExercises: () => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  weekDay: 'Monday',
  exercisesByDay: {},
  setWeekDay: (day) => set({ weekDay: day }),
  loadMockExercises: () =>
    set({
      exercisesByDay: {
        Monday: [
          { name: 'Push-ups', duration: '15 mins', videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
          { name: 'Squats', duration: '20 mins', videoUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ' },
          { name: 'Plank', duration: '10 mins', videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw' },
          { name: 'Jumping Jacks', duration: '10 mins', videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8' },
        ],
        Tuesday: [
          { name: 'Lunges', duration: '15 mins', videoUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U' },
        ],
        // Add other weekdays similarly if needed
      },
    }),
}));