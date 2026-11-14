import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, persistenceReady } from '../firebase.js';

function requireAuth() {
  if (!auth) throw new Error('Firebase is not configured. Add your keys to .env.local.');
  return auth;
}

export async function signUp(email, password) {
  const a = requireAuth();
  await persistenceReady;
  const { user } = await createUserWithEmailAndPassword(a, email, password);
  return user;
}

export async function logIn(email, password) {
  const a = requireAuth();
  await persistenceReady;
  const { user } = await signInWithEmailAndPassword(a, email, password);
  return user;
}

export async function logInWithGoogle() {
  const a = requireAuth();
  await persistenceReady;
  const { user } = await signInWithPopup(a, googleProvider);
  return user;
}

export function logOut() {
  return signOut(requireAuth());
}

// Calls back with the current user (or null) now and on every change.
export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

const MESSAGES = {
  'auth/invalid-email': 'That email address is not valid.',
  'auth/missing-password': 'Enter your password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Google sign-in was cancelled.',
  'auth/popup-blocked': 'The browser blocked the Google sign-in popup.',
  'auth/unauthorized-domain': 'This domain is not authorized in Firebase.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase.',
};

// Turns a Firebase error into a message we can show to the user.
export function authErrorMessage(err) {
  return MESSAGES[err?.code] || err?.message || 'Something went wrong. Please try again.';
}
