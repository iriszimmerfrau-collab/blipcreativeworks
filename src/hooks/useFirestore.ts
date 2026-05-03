import {
  collection,
  doc,
  onSnapshot,
  query,
  type DocumentData,
  type QueryConstraint
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

export function useDocument<T = DocumentData>(collectionName: string, id?: string | null) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    return onSnapshot(doc(db, collectionName, id), (snapshot) => {
      setData(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as T & { id: string }) : null);
      setLoading(false);
    });
  }, [collectionName, id]);

  return { data, loading };
}

export function useCollectionData<T = DocumentData>(collectionName: string, constraints: QueryConstraint[] = [], enabled = true) {
  const [data, setData] = useState<Array<T & { id: string }>>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as T & { id: string })));
      setLoading(false);
    });
  }, [collectionName, enabled, constraints.length]);

  return { data, loading };
}
