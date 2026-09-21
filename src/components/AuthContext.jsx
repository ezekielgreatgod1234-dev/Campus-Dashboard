import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { api, setAuthToken } from "../components/Api";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "campusmart_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );

  // "initializing" covers the one-time check on page load (do we have
  // a valid stored token?). "loading" covers an in-flight login /
  // register submission. Kept separate so ProtectedRoute only shows a
  // full-page spinner during the initial check, not on every submit.
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // On mount (and whenever the token changes), verify it against the
  // backend and rehydrate the logged-in user. This is what makes a
  // page refresh keep you logged in instead of bouncing to /login.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token) {
        setUser(null);
        setInitializing(false);
        return;
      }

      setAuthToken(token);

      try {
        const res = await api.get("/auth/me");
        if (!cancelled) {
          setUser(res.data.user);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setAuthToken(null);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: newToken, user: loggedInUser } = res.data;

      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      setAuthToken(newToken);
      setToken(newToken);
      setUser(loggedInUser);

      return { success: true };
    } catch (err) {
      const message =
        err?.data?.message || "Could not sign in. Please try again.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/register", payload);
      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      setAuthToken(newToken);
      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      const message =
        err?.data?.message || "Could not create account. Please try again.";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // JWTs are stateless — even if this call fails (e.g. offline),
      // we still clear the local session below.
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setAuthToken(null);
      setToken(null);
      setUser(null);
      setError("");
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    initializing,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}