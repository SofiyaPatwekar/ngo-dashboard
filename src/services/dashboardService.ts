import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardSummary } from "@/types";

export const getDashboardSummary = async (): Promise<DashboardSummary[]> => {
  const snapshot = await getDocs(collection(db, "dashboard_summary"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Record<string, any>)
  })) as DashboardSummary[];
};