import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DecisionItem } from "@/types";

export const getLatestDecision = async (): Promise<DecisionItem | null> => {
  const q = query(
    collection(db, "decisions"),
    orderBy("created_at", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...(doc.data() as Record<string, any>),
  } as DecisionItem;
};