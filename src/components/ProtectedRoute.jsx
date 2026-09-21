import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

// Wrap any route that requires a logged-in user with this. Redirects
// to /login (preserving where the person was headed) if there's no
// valid session, and shows a brief loading state while the very
// first token check (on page load / refresh) is still in flight.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}