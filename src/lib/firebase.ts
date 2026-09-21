import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  getDocFromServer,
  runTransaction,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserProfile,
  TriggerLog,
  InterventionLog,
  SlipReflection,
  DailyMission,
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const dbDatabaseId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;

// Initialize Firestore with experimentalForceLongPolling to eliminate WebChannel hanging in iframe/proxy environments
export const db = dbDatabaseId
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, dbDatabaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });

export const auth = getAuth(app);

// Standard Google Auth Provider for Firebase Authentication
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// In-memory token cache (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export function formatAuthError(error: unknown): string {
  if (!error) return 'تعذر تسجيل الدخول. حاول مرة أخرى.';
  const err = error as { code?: string; message?: string };
  const code = err.code || '';
  const message = err.message || '';

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'تم إلغاء تسجيل الدخول.';
  }
  if (
    code === 'auth/popup-blocked' ||
    message.includes('auth/popup-blocked')
  ) {
    return 'تم حظر النافذة المنبثقة بواسطة المتصفح. يُرجى السماح بالنوافذ المنبثقة والمحاولة مجدداً.';
  }
  if (
    code === 'auth/unauthorized-domain' ||
    code === 'auth/user-disabled' ||
    code === 'auth/access-denied' ||
    message.includes('403') ||
    message.includes('access_denied')
  ) {
    return 'هذا الحساب غير مسموح له حالياً بالدخول إلى النسخة التجريبية.';
  }
  if (code === 'auth/network-request-failed') {
    return 'حدث خطأ في الاتصال بالإنترنت. يرجى التحقق من الشبكة وإعادة المحاولة.';
  }
  return 'تعذر تسجيل الدخول. حاول مرة أخرى.';
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Boot connection check
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      console.warn('Firestore connection notice:', error.message);
    }
  }
}

// Check if current context is running inside an iframe
export const isInIframe = (): boolean => {
  try {
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch {
    return true;
  }
};

// Check if error is specifically popup-blocked
export const isPopupBlockedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const err = error as { code?: string; message?: string };
  return (
    err.code === 'auth/popup-blocked' ||
    (typeof err.message === 'string' && err.message.includes('auth/popup-blocked'))
  );
};

// Auth state listener with redirect recovery
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  // Check if returning from a Google redirect flow
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        cachedAccessToken = credential?.accessToken || null;
        if (onAuthSuccess) onAuthSuccess(result.user, cachedAccessToken);
      }
    })
    .catch((err) => {
      console.warn('Redirect auth check notice:', err?.message || err);
    });

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google Sign-In with popup & smart redirect fallback
export const googleSignIn = async (): Promise<{ user: User; accessToken: string | null } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };

    if (isPopupBlockedError(error)) {
      console.warn('Google Sign-In popup was blocked by browser. Showing recovery guidance.');
      // If running outside an iframe (e.g., standard browser tab), attempt redirect seamlessly
      if (!isInIframe()) {
        try {
          await signInWithRedirect(auth, provider);
          return null;
        } catch (redirectErr) {
          console.warn('Redirect sign-in fallback notice:', redirectErr);
        }
      }
      throw error;
    }

    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      console.warn('Google Sign-In was dismissed by user.');
      return null;
    }

    console.warn('Google Sign In notice:', err.message || error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Recursively cleans any object or array destined for Firestore:
 * - Drops any keys whose value is strictly `undefined`
 * - Recursively processes nested objects and arrays
 * - Preserves null, string, number, boolean
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    }
  }
  return result as unknown as T;
}

// Sync User Profile to Firestore
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== profile.uid) return;
  const path = `users/${profile.uid}`;
  try {
    const rawPayload = {
      ...profile,
      email: profile.email ?? auth.currentUser.email ?? null,
      displayName: profile.displayName ?? auth.currentUser.displayName ?? null,
      photoURL: profile.photoURL ?? auth.currentUser.photoURL ?? null,
      updatedAt: new Date().toISOString(),
    };
    const sanitized = sanitizeForFirestore(rawPayload);
    await setDoc(doc(db, 'users', profile.uid), sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Sync Trigger to Firestore
export async function saveTriggerToFirestore(userId: string, trigger: TriggerLog): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/triggers/${trigger.id}`;
  try {
    const sanitized = sanitizeForFirestore(trigger);
    await setDoc(doc(db, 'users', userId, 'triggers', trigger.id), sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Sync Intervention to Firestore
export async function saveInterventionToFirestore(userId: string, item: InterventionLog): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/interventions/${item.id}`;
  try {
    const sanitized = sanitizeForFirestore(item);
    await setDoc(doc(db, 'users', userId, 'interventions', item.id), sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Sync Slip Reflection to Firestore
export async function saveSlipToFirestore(userId: string, slip: SlipReflection): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/slips/${slip.id}`;
  try {
    const sanitized = sanitizeForFirestore(slip);
    await setDoc(doc(db, 'users', userId, 'slips', slip.id), sanitized);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch all user data from Firestore on login
export async function fetchUserDataFromFirestore(userId: string): Promise<{
  profile?: UserProfile;
  triggers: TriggerLog[];
  interventions: InterventionLog[];
  slips: SlipReflection[];
} | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    const profile = userSnap.exists() ? (userSnap.data() as UserProfile) : undefined;

    const triggersSnap = await getDocs(collection(db, 'users', userId, 'triggers'));
    const triggers = triggersSnap.docs.map((d) => d.data() as TriggerLog);

    const intSnap = await getDocs(collection(db, 'users', userId, 'interventions'));
    const interventions = intSnap.docs.map((d) => d.data() as InterventionLog);

    const slipsSnap = await getDocs(collection(db, 'users', userId, 'slips'));
    const slips = slipsSnap.docs.map((d) => d.data() as SlipReflection);

    return { profile, triggers, interventions, slips };
  } catch (error) {
    console.warn('Failed to fetch from Firestore, falling back to local storage:', error);
    return null;
  }
}

export interface AtomicAwardResult {
  awarded: boolean;
  alreadyAwarded: boolean;
  newXp: number;
  newLevel: number;
  newLevelTitle: string;
  updatedLedger: string[];
}

/**
 * Executes an atomic Firestore transaction to guarantee that a reward key is granted exactly once
 * across multiple concurrent tabs, devices, or rapid requests.
 */
export async function awardXpAtomicallyFirestore(
  userId: string,
  rewardKey: string,
  xpAmount: number,
  extraProfileUpdates: Partial<UserProfile> = {}
): Promise<AtomicAwardResult> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error('User not authenticated for Firestore transaction');
  }

  const userDocRef = doc(db, 'users', userId);
  const rewardDocRef = doc(db, 'users', userId, 'rewards', rewardKey);

  return await runTransaction(db, async (transaction) => {
    const [userSnap, rewardSnap] = await Promise.all([
      transaction.get(userDocRef),
      transaction.get(rewardDocRef),
    ]);

    const userData = userSnap.exists() ? (userSnap.data() as UserProfile) : null;
    const existingLedger: string[] = Array.isArray(userData?.rewardLedger) ? userData.rewardLedger : [];

    // Idempotency check: Document exists in rewards subcollection OR key is in rewardLedger
    if (rewardSnap.exists() || existingLedger.includes(rewardKey)) {
      const currentXp = userData?.xp ?? 0;
      const currentLevel = userData?.level ?? 1;
      const currentTitle = userData?.levelTitle || 'إعادة الضبط';
      return {
        awarded: false,
        alreadyAwarded: true,
        newXp: currentXp,
        newLevel: currentLevel,
        newLevelTitle: currentTitle,
        updatedLedger: existingLedger,
      };
    }

    // Compute new XP and Level
    const prevXp = userData?.xp ?? 0;
    const newXp = Math.max(0, prevXp + xpAmount);
    
    // Level calculation (Levels 1 to 6)
    let newLevel = 1;
    let newLevelTitle = 'إعادة الضبط';
    if (newXp >= 2200) {
      newLevel = 6;
      newLevelTitle = 'نمط الصفر';
    } else if (newXp >= 1400) {
      newLevel = 5;
      newLevelTitle = 'صلب';
    } else if (newXp >= 800) {
      newLevel = 4;
      newLevelTitle = 'ثابت';
    } else if (newXp >= 400) {
      newLevel = 3;
      newLevelTitle = 'متحكم';
    } else if (newXp >= 100) {
      newLevel = 2;
      newLevelTitle = 'واعي';
    }

    const nowIso = new Date().toISOString();
    const updatedLedger = [...existingLedger, rewardKey];

    // 1. Write the atomic reward receipt
    transaction.set(rewardDocRef, sanitizeForFirestore({
      rewardKey,
      userId,
      xp: xpAmount,
      awardedAt: nowIso,
    }));

    // 2. Update user profile document atomically with merged ledger & calculated metrics
    const userPayload: Partial<UserProfile> & Record<string, unknown> = sanitizeForFirestore({
      ...extraProfileUpdates,
      xp: newXp,
      level: newLevel,
      levelTitle: newLevelTitle,
      rewardLedger: updatedLedger,
      updatedAt: nowIso,
    });

    if (!userSnap.exists()) {
      transaction.set(userDocRef, sanitizeForFirestore({
        uid: userId,
        ...userPayload,
      }));
    } else {
      transaction.set(userDocRef, userPayload, { merge: true });
    }

    return {
      awarded: true,
      alreadyAwarded: false,
      newXp,
      newLevel,
      newLevelTitle,
      updatedLedger,
    };
  });
}

