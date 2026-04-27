import { useQuery } from "@tanstack/react-query";
import { getRecentAssignments } from "@/services/assignmentService";

export const useAssignments = () => {
  return useQuery({
    queryKey: ["recent-assignments"],
    queryFn: getRecentAssignments,
  });
};