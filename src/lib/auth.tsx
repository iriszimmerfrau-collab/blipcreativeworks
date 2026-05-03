import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, db, googleProvider } from "./firebase";
import type { Candidate, RoleLabel, Track, UserProfile } from "../types";

type AuthContextValue = {
  firebaseUser: User | null;
  profile: UserProfile | null;
  candidate: Candidate | null;
  loading: boolean;
  isAdmin: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  createEmailAccount: (email: string, password: string, displayName?: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveCandidateIntake: (input: CandidateIntakeInput) => Promise<void>;
};

export type CandidateIntakeInput = {
  fullName: string;
  phone?: string;
  location?: string;
  ageRange: Candidate["ageRange"];
  roleLabel: RoleLabel;
  selectedTracks: Track[];
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function syncUserProfile(user: User, displayNameOverride?: string) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const displayName = displayNameOverride || user.displayName || user.email?.split("@")[0] || "Candidate";
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || "",
      displayName,
      role: "candidate",
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    });
    return;
  }

  await updateDoc(ref, {
    email: user.email || snap.data().email || "",
    displayName: displayNameOverride || user.displayName || snap.data().displayName || "",
    lastLoginAt: serverTimestamp()
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cleanupSession: () => void = () => undefined;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      cleanupSession();
      cleanupSession = () => undefined;
      setLoading(true);
      setFirebaseUser(user);
      setProfile(null);
      setCandidate(null);

      if (!user) {
        setLoading(false);
        return;
      }

      let active = true;
      let profileReady = false;
      let candidateReady = false;
      let unsubUser: () => void = () => undefined;
      let unsubCandidate: () => void = () => undefined;
      cleanupSession = () => {
        active = false;
        unsubUser();
        unsubCandidate();
      };

      const markReady = () => {
        if (active && profileReady && candidateReady) {
          setLoading(false);
        }
      };

      try {
        await syncUserProfile(user);
      } catch {
        if (active) setLoading(false);
        return;
      }

      unsubUser = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists() && snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) return;
        setProfile(snapshot.exists() ? (snapshot.data() as UserProfile) : null);
        profileReady = true;
        markReady();
      }, () => {
        profileReady = true;
        markReady();
      });
      unsubCandidate = onSnapshot(doc(db, "candidates", user.uid), (snapshot) => {
        if (!snapshot.exists() && snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) return;
        setCandidate(snapshot.exists() ? (snapshot.data() as Candidate) : null);
        candidateReady = true;
        markReady();
      }, () => {
        candidateReady = true;
        markReady();
      });
    });

    return () => {
      unsubAuth();
      cleanupSession();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      profile,
      candidate,
      loading,
      isAdmin: profile?.role === "admin" || profile?.role === "manager",
      async signInEmail(email, password) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(credential.user);
      },
      async createEmailAccount(email, password, displayName) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserProfile(credential.user, displayName);
      },
      async signInGoogle() {
        const credential = await signInWithPopup(auth, googleProvider);
        await syncUserProfile(credential.user);
      },
      async logout() {
        await signOut(auth);
      },
      async saveCandidateIntake(input) {
        if (!firebaseUser) throw new Error("You must be signed in.");
        await setDoc(
          doc(db, "candidates", firebaseUser.uid),
          {
            uid: firebaseUser.uid,
            fullName: input.fullName,
            email: firebaseUser.email || profile?.email || "",
            phone: input.phone || "",
            location: input.location || "",
            ageRange: input.ageRange,
            roleLabel: input.roleLabel,
            selectedTracks: input.selectedTracks,
            status: "terms_pending",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      }
    }),
    [candidate, firebaseUser, loading, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
