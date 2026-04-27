import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useVolunteerRequests = () => {
  return useQuery({
    queryKey: ["volunteer-requests"],
    queryFn: async () => {
      // Try correct spelling first
      let snapshot = await getDocs(collection(db, "volunteer_users"));

      if (snapshot.empty) {
        console.warn("volunteer_users empty, trying voluteer_users...");
        snapshot = await getDocs(collection(db, "voluteer_users"));
      }

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Record<string, any>),
      }));

      console.log("Final volunteer request data:", data);

      return data;
    },
  });
};