import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useSurveys = () => {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: async () => {
      const q = query(collection(db, "surveys"), orderBy("created_at", "desc"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Record<string, any>),
      }));
    },
  });
};