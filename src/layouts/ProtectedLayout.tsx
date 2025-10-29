import { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/useAuth";
import { useNavigate, Outlet } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import UnAuthorizedPage from "../pages/error/unAuthorized";

interface DecodedToken {
  userId: string;
  role: string;
  status: string;
  exp: number;
}

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedLayout({ allowedRoles }: ProtectedRouteProps) {
  const role = useUserStore((s) => s.role);
  const status = useUserStore((s) => s.status);
  const setRole = useUserStore((s) => s.setRole);
  const setStatus = useUserStore((s) => s.setStatus);
  const token = Cookies.get("token");
  const { isAuthenticated, login, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Check expiry
        if (decoded.exp * 1000 < Date.now()) {
          Cookies.remove("token");
          logout();
          navigate("/login");
          return;
        }

        if (!isAuthenticated) {
          login(token, decoded.userId);
          setRole(decoded.role as any);
          setStatus(decoded.status as any);
        } else {
          if (!role) setRole(decoded.role as any);
          if (!status) setStatus(decoded.status as any);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        Cookies.remove("token");
        navigate("/login");
        return;
      }
    }
  }, [token, isAuthenticated, login, logout, navigate]);

  // Role-based rendering logic
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <UnAuthorizedPage />;
  }

  // If authorized, render the child routes
  return <Outlet />;
}
