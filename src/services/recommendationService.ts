import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export const getRecommendations = async () => {
  const q = query(
    collection(db, "ai_recommendations"),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Record<string, any>),
  }));
};