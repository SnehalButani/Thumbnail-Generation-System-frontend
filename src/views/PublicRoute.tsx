import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "@/utils/authService";
import useAuthentication from "@/hooks/useAuthentication";

const PublicRoute = () => {
  const { isAuthenticated } = useAuthentication();
  const token = getToken();

  if (isAuthenticated || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
