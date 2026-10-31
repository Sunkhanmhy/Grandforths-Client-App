import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  clearStoredSession,
  readStoredSession,
  signInWithEmailPassword,
  signInWithOAuth,
  signOut as signOutSupabase,
  signUpWithEmailPassword,
  supabase,
  writeStoredSession,
} from '../lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>; 
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readStoredSession() as Session | null);
  const [user, setUser] = useState<User | null>(session?.user ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const nextSession = data.session;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession) {
        writeStoredSession({ email: nextSession.user.email, user: nextSession.user.id });
      } else {
        clearStoredSession();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailPassword({ email, password });
    if (result.data?.session) {
      const nextSession = result.data.session;
      setSession(nextSession);
      setUser(nextSession.user);
      writeStoredSession({ email: nextSession.user.email, user: nextSession.user.id });
      return { error: null };
    }
    return { error: result.error ?? new Error('Sign-in failed.') };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const result = await signUpWithEmailPassword({ email, password, fullName });
    if (result.data?.session) {
      const nextSession = result.data.session;
      setSession(nextSession);
      setUser(nextSession.user);
      writeStoredSession({ email: nextSession.user.email, user: nextSession.user.id });
      return { error: null };
    }
    return { error: result.error ?? new Error('Account creation failed.') };
  };

  const signOut = async () => {
    await signOutSupabase();
    setSession(null);
    setUser(null);
    clearStoredSession();
  };

  const signInWithGoogle = async () => {
    await signInWithOAuth('google');
  };

  const signInWithMicrosoft = async () => {
    await signInWithOAuth('microsoft');
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      signInWithMicrosoft,
    }),
    [session, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
