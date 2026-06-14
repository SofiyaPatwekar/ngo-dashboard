import { useQuery } from "@tanstack/react-query";

import { getCommandCenterAlerts } from "@/services/commandCenterAlertService";

export const useCommandCenterAlerts = () => {
  return useQuery({
    queryKey: ["command-center-alerts"],
    queryFn: getCommandCenterAlerts,
  });
};