// stores/checkinStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CheckInData = {
  steps: number;
  weight: number;
  calories: number;
  sleepHours: number;
  date: string;
};

type CheckInStore = {
  checkIns: Record<string, CheckInData>;
  addCheckIn: (data: CheckInData) => void;
  getCheckIn: (date: string) => CheckInData | undefined;
};

export const useCheckInStore = create<CheckInStore>()(
  persist(
    (set, get) => ({
      checkIns: {},
      addCheckIn: (data) => {
        set((state) => ({
          checkIns: {
            ...state.checkIns,
            [data.date]: data,
          },
        }));
      },
      getCheckIn: (date) => {
        return get().checkIns[date];
      },
    }),
    {
      name: 'check-in-storage',
    }
  )
);