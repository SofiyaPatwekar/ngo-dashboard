import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getVolunteers = async () => {
  const snapshot = await getDocs(collection(db, "volunteers"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Record<string, any>),
  }));
};