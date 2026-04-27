import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Insights } from "@/types";

export const useInsights = () => {
  return useQuery<Insights[]>({
    queryKey: ["insights"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "insights"));

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Insights, "id">),
      }));
    },
  });
};