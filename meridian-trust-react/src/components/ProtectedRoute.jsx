import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Blocks a module unless the signed-in user has the matching role.
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  }
  return children;
}
