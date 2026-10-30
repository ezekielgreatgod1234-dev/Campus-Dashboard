import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";


function LoginRoute() {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Login
      onLogin={handleLogin}
      onRegister={() => navigate("/register")}
      loading={loading}
      error={error}
    />
  );
}

function RegisterRoute() {
  const { register, loading, error, clearError, setError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleRegister = async (payload) => {
    
    if (payload?.error) {
      setError(payload.error);
      return;
    }

    const result = await register(payload);
    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Register
      onRegister={handleRegister}
      onLogin={() => navigate("/login")}
      loading={loading}
      error={error}
    />
  );
}

function DashboardRoute() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return <Dashboard user={user} onLogout={handleLogout} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginRoute />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterRoute />
          </GuestRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}