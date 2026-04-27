import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const listenToReports = (callback: any) => {
  const q = query(
    collection(db, "reports"),
    orderBy("created_at", "desc"),
    limit(10)
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};