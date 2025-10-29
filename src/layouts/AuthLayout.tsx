import { Outlet, useNavigate } from "react-router-dom";
import HomeNav from "../components/layout/HomeNav";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function AuthLayout() {
  const token = Cookies.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    
    if (
      token  &&
      (window.location.href.includes("/login") ||
        window.location.href.includes("/register"))
    ) {
      navigate("/");
    }
  }, [navigate, token]);

  return (
    <div>
      <HomeNav />
      <Outlet />
    </div>
  );
}
