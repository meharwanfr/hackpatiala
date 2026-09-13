/**
 * AuthContext.tsx — localStorage-only auth stub
 *
 * No external auth service needed. User profile stored in localStorage.
 * This keeps the hackathon demo self-contained with zero setup.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserType = 'learner' | 'experienced';

export interface SimpleUser {
  email: string;
  fullName: string;
  userType?: UserType;
  learningProgress?: {
    currentModule: number;
    completedLessons: string[];
    xp: number;
    streak: number;
  };
}

interface AuthContextType {
  user: SimpleUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null; user: SimpleUser | null }>;
  signOut: () => Promise<void>;
  setUserType: (type: UserType) => void;
  updateLearningProgress: (progress: Partial<SimpleUser['learningProgress']>) => void;
}

const AUTH_KEY = 'moneymind_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const persistUser = useCallback((u: SimpleUser) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const signIn = async (email: string, _password: string) => {
    const u: SimpleUser = { email, fullName: email.split('@')[0] };
    persistUser(u);
    return { error: null };
  };

  const signUp = async (email: string, _password: string, fullName?: string) => {
    const u: SimpleUser = { email, fullName: fullName || email.split('@')[0] };
    persistUser(u);
    return { error: null, user: u };
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const setUserType = useCallback((type: UserType) => {
    if (!user) return;
    const updated = {
      ...user,
      userType: type,
      ...(type === 'learner' && !user.learningProgress
        ? { learningProgress: { currentModule: 0, completedLessons: [], xp: 0, streak: 0 } }
        : {}),
    };
    persistUser(updated);
  }, [user, persistUser]);

  const updateLearningProgress = useCallback((progress: Partial<SimpleUser['learningProgress']>) => {
    if (!user) return;
    const updated = {
      ...user,
      learningProgress: {
        currentModule: 0,
        completedLessons: [],
        xp: 0,
        streak: 0,
        ...user.learningProgress,
        ...progress,
      },
    };
    persistUser(updated);
  }, [user, persistUser]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setUserType, updateLearningProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
