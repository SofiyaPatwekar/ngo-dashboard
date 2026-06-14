import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function getCommandCenterAlerts() {
  const q = query(
    collection(db, "command_center_alerts"),
    orderBy("created_at", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamp to ISO string to avoid serialization issues
      created_at: data.created_at?.toDate?.()?.toISOString() ?? null,
    };
  });
}