import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isFirebaseConfigured } from '../firebase.js';
import { subscribeToAuth, signUp, logIn, logInWithGoogle, logOut } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true until Firebase tells us whether a saved session exists
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isConfigured: isFirebaseConfigured,
      signup: signUp,
      login: logIn,
      loginWithGoogle: logInWithGoogle,
      logout: logOut,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
