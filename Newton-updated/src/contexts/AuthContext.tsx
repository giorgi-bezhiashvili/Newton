import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { loginRequest, logoutRequest } from "../api";

interface AuthState {
  userName: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  auth: AuthState | null;
  isAuthenticated: boolean;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
  setAccessToken: (token: string) => void;
}

const STORAGE_KEY = "newton-auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(loadStoredAuth);

  const login = useCallback(async (userName: string, password: string) => {
    const data = await loginRequest(userName, password);
    const nextAuth: AuthState = {
      userName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  }, []);

  const logout = useCallback(() => {
    if (auth) {
      logoutRequest(auth.refreshToken);
    }
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, [auth]);

  const setAccessToken = useCallback((token: string) => {
    setAuth((prev) => {
      if (!prev) return prev;
      const next = { ...prev, accessToken: token };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated: !!auth, login, logout, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}