import { useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  position?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      const response = await axios.get("/api/auth/me");

      if (response.data.success) {
        setAuth({
          user: response.data.user,
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      setAuth({
        user: null,
        loading: false,
        error: error.response?.data?.error || "Authentication failed",
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuth((prev) => ({ ...prev, loading: true, error: null }));

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setAuth({
          user: response.data.user,
          loading: false,
          error: null,
        });
        return { success: true };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed";
      setAuth((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setAuth({
        user: null,
        loading: false,
        error: null,
      });
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Clear state anyway
      setAuth({
        user: null,
        loading: false,
        error: null,
      });
      window.location.href = "/login";
    }
  };

  return {
    ...auth,
    login,
    logout,
    checkAuth,
  };
}
