import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ReportItem } from "@/types";


export const getLatestReport = async (): Promise<ReportItem | null> => {
      const q = query(
    collection(db, "reports"),
    orderBy("created_at", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  return {
  id: doc.id,
  ...(doc.data() as Record<string, any>),
} as ReportItem;
};


export async function getReportTrend() {
  const snapshot = await getDocs(collection(db, "reports"));

  const reports = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const trendMap: Record<string, number> = {};

  const today = new Date();

  // initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);

    const key = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    trendMap[key] = 0;
  }

  reports.forEach((report: any) => {
    if (!report.created_at?.toDate) return;

    const date = report.created_at.toDate();

    const key = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (trendMap[key] !== undefined) {
      trendMap[key]++;
    }
  });

  return Object.entries(trendMap).map(([label, value]) => ({
    label,
    value,
  }));
}