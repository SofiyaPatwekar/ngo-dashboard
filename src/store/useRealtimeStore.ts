import { create } from "zustand";

interface State {
  reports: any[];
  setReports: (reports: any[]) => void;
}

export const useRealtimeStore = create<State>((set) => ({
  reports: [],
  setReports: (reports) => set({ reports }),
}));