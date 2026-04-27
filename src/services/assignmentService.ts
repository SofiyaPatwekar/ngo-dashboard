import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AssignmentItem } from "@/types";

export const getLatestAssignment = async (): Promise<AssignmentItem | null> => {
  const q = query(collection(db, "assignments"), orderBy("created_at", "desc"), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...(doc.data() as Record<string, any>) } as AssignmentItem;
};

export const getRecentAssignments = async (): Promise<AssignmentItem[]> => {
  const q = query(collection(db, "assignments"), orderBy("created_at", "desc"), limit(5));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Record<string, any>),
  })) as AssignmentItem[];
};