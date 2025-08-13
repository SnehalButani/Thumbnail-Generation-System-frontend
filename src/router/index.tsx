import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUp from "@/views/auth/SignUp";
import SignIn from "@/views/auth/SignIn";
import Dashboard from "@/views/Dashboard";
import ProtectedRoute from "@/views/ProtectedRoute";
import PublicRoute from "@/views/PublicRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
