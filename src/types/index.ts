export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type CaseType  = 'medical' | 'food' | 'shelter' | 'rescue' | 'logistics'

export interface DashboardSummary {
  id: string;

  total_reports?: number;
  total_processed_reports?: number;
  priority_1_cases?: number;

  total_assignments?: number;
  total_decisions?: number;

  total_volunteers?: number;
  available_volunteers?: number;
  busy_volunteers?: number;

  medical_cases?: number;
  food_cases?: number;
  shelter_cases?: number;

  total_resources?: number;
  available_resources?: number;
  low_stock_resources?: number;
  out_of_stock_resources?: number;

  urgent_dispatch_pending?: number;
  overview?: number;
  last_updated?: any;
}

export interface ReportItem {
  id: string;
  title?: string;
  location?: string;
  category?: string;
  severity?: string | number;
  urgency?: string | number;
  created_at?: any;
}

export interface DecisionItem {
  id: string;
  priority?: string;
  priority_level?: string;
  urgency?: number;
  urgency_score?: number;
  reasoning?: string;
  explanation?: string;
  location?: string;
  category?: string;
  report_id?: string;
  created_at?: any;
}

export interface AssignmentItem {
  id: string;
  assigned_volunteer_id?: string;
  volunteer_name?: string;
  assignment_status?: string;
  coordination_explanation?: string;
  location?: string;
  category?: string;
  report_id?: string;
  created_at?: any;
}
// ─── Store Types ──────────────────────────────────────────────────────────────

export interface DashboardStore {
  currentPage: NavPage
  setCurrentPage: (page: NavPage) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  selectedReport: Report | null
  setSelectedReport: (report: Report | null) => void
  systemStatus: 'online' | 'degraded' | 'offline'
}
export interface Report {
  id: string
  title: string
  location: string
  type: CaseType
  priority: Priority
  // status: PipelineStatus
  timestamp: Date
  description: string
  reportedBy: string
  affectedCount: number
}

export type NavPage = 'dashboard' | 'map' | 'volunteers' | 'resources' | 'insights'
export interface Insights {
  id: string;

  average_urgency: number;
  average_final_score: number;

  priority_1_count: number;
  priority_2_count: number;
  priority_3_count: number;

  medical_case_count: number;
  food_case_count: number;
  shelter_case_count: number;
  general_case_count: number;

  urgent_assignments: number;
  pending_assignments: number;

  available_volunteer_count: number;
  busy_volunteer_count: number;

  available_resource_count: number;
  low_stock_resource_count: number;
  out_of_stock_resource_count: number;

  busiest_zone: string;
  top_category: string;

  last_updated: any;
}