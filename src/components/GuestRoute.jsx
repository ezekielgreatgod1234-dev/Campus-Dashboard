import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

// Wrap /login and /register with this so an already-logged-in person
// gets bounced straight to /dashboard instead of seeing the auth
// forms again.
export default function GuestRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="small-spinner" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}