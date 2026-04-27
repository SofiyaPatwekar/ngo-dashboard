import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/services/dashboardService";
export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardSummary,
  });
};