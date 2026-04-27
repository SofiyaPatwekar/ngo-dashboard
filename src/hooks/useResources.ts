import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useResources = () => {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "resources"));

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Record<string, any>),
      }));
    },
  });
};