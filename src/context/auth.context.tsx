"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { clearTokens, hasTokens } from "@/lib/token";

export type UserRole = "admin" | "professional" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && hasTokens()) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("[v0] Failed to parse stored user:", error);
        clearTokens();
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    clearTokens();
    localStorage.removeItem("user");
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
