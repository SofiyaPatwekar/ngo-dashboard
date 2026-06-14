import { useQuery } from "@tanstack/react-query";
import { getRecommendations } from "@/services/recommendationService";

export const useRecommendations = () => {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: getRecommendations,
  });
};