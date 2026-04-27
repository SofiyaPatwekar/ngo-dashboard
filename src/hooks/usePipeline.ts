import { useQuery } from "@tanstack/react-query";
import { getLatestDecision } from "@/services/decisionService";
import { getLatestAssignment } from "@/services/assignmentService";

export const usePipeline = () => {
  const decisionQuery = useQuery({
    queryKey: ["decision"],
    queryFn: getLatestDecision,
  });

  const assignmentQuery = useQuery({
    queryKey: ["assignment"],
    queryFn: getLatestAssignment,
  });

  return {
    decision: decisionQuery.data,
    assignment: assignmentQuery.data,
    isLoading: decisionQuery.isLoading || assignmentQuery.isLoading,
  };
};