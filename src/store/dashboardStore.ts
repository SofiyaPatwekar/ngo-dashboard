import { create } from 'zustand'
import type { DashboardStore, NavPage, Report } from '@/types'

export const useDashboardStore = create<DashboardStore>((set) => ({
  currentPage: 'dashboard',
  setCurrentPage: (page: NavPage) => set({ currentPage: page }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  selectedReport: null,
  setSelectedReport: (report: Report | null) => set({ selectedReport: report }),
  systemStatus: 'online',
}))
