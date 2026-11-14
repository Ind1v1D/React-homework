import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

// Renders children only for signed-in users; everyone else goes to /login.
function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <Loader text="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}

export default ProtectedRoute;
