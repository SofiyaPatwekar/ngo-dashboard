import { useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRealtimeStore } from "@/store/useRealtimeStore";

export const useRealtimeReports = () => {
  const setReports = useRealtimeStore((s) => s.setReports);

  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Record<string, any>)
      }));

      setReports(data);
    });

    return () => unsubscribe();
  }, [setReports]);
};