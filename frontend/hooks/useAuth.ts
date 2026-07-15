import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

export interface User {
  id: string;
  email: string;
  role: string;
  full_name: string;
  avatar_url?: string;
  enrolled_courses?: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, accessToken) => {
        // Set axios default header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        set({ user, accessToken, isAuthenticated: true, isLoading: false });
      },

      clearAuth: () => {
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          get().clearAuth();
        }
      },

      checkAuth: async () => {
        const { accessToken, isAuthenticated } = get();

        if (!isAuthenticated) {
          set({ isLoading: false });
          return;
        }

        if (!accessToken) {
          // Try to refresh token if we don't have access token but might have HttpOnly cookie
          try {
            // Use axios directly to avoid interceptor loop if we change it later
            const { data } = await api.post("/auth/refresh");
            get().setAuth(data.user, data.access_token);
          } catch (error) {
            get().clearAuth();
          }
          return;
        }

        try {
          // Verify current access token by getting profile
          const { data } = await api.get("/protected/me");
          set({ isLoading: false });
          // If we want to sync user data from /me, we can do it here
        } catch (error) {
          // If it fails, axios interceptor will try to refresh. 
          // If refresh also fails, interceptor dispatches 'auth:logout'
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // Save these to localStorage for UX, but NOT accessToken
    }
  )
);

// Listen to interceptor logout event
if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuth.getState().clearAuth();
  });
}
