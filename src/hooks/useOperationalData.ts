import { useQuery } from "@tanstack/react-query";
import { getLatestReport } from "@/services/reportServide";
import { getLatestDecision } from "@/services/decisionService";
import { getLatestAssignment } from "@/services/assignmentService";

export const useOperationalData = () => {
  const reportQuery = useQuery({
    queryKey: ["latest-report"],
    queryFn: getLatestReport,
  });

  const decisionQuery = useQuery({
    queryKey: ["latest-decision"],
    queryFn: getLatestDecision,
  });

  const assignmentQuery = useQuery({
    queryKey: ["latest-assignment"],
    queryFn: getLatestAssignment,
  });

  return {
    latestReport: reportQuery.data,
    latestDecision: decisionQuery.data,
    latestAssignment: assignmentQuery.data,
    isLoading:
      reportQuery.isLoading || decisionQuery.isLoading || assignmentQuery.isLoading,
  };
};