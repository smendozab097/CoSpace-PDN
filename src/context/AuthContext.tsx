"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshSession: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.success && data.user ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setUser(data.success && data.user ? data.user : null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setUser(null);
          setLoading(false);
        }
      });

    const handleAuthChange = () => {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.success && data.user ? data.user : null);
        })
        .catch(() => {
          setUser(null);
        });
    };

    window.addEventListener("cospace-auth-change", handleAuthChange);
    return () => {
      ignore = true;
      window.removeEventListener("cospace-auth-change", handleAuthChange);
    };
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignorar error en llamada de red
    } finally {
      setUser(null);
      window.dispatchEvent(new Event("cospace-auth-change"));
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
