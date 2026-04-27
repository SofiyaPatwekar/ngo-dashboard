import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useVolunteers = () => {
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "volunteers"));

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Record<string, any>),
      }));
    },
  });
};