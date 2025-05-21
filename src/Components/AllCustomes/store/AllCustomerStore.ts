import { create } from 'zustand';
import { Followup } from '../type';

interface DashboardState {
  sessions: number;
  orders: number;
  customers: number;
  followups: Followup[];
  setDashboardData: (data: Partial<DashboardState>) => void;
}

export const useCustomerStore = create<DashboardState>((set) => ({
  sessions: 0,
  orders: 0,
  customers: 0,
  followups: [],
  setDashboardData: (data) => set((state) => ({ ...state, ...data })),
}));
