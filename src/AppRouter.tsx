import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes, type AppRoute } from "./routes";
import ProtectedLayout from "./layouts/ProtectedLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import UnAuthorizedPage from "./pages/error/unAuthorized";

const AppRouter: React.FC = () => {
  const renderRoute = (route: AppRoute) => {
    // Protected routes (require auth)
    if (route.protected) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={<ProtectedLayout allowedRoles={route.role} />}
        >
          <Route element={<DashboardLayout />}>
            <Route index element={route.element} />
            {route.children?.map((child) => (
              <Route
                key={`${route.path}-${child.path}`}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        </Route>
      );
    }

    // Public routes (Login/Register/Unauthorized)
    if (route.path === "/login" || route.path === "/register") {
      return (
        <Route key={route.path} path={route.path} element={<AuthLayout />}>
          <Route index element={route.element} />
        </Route>
      );
    }

    // Other public routes
    return <Route key={route.path} path={route.path} element={route.element} />;
  };

  return (
    <Routes>
      {routes.map((route) => renderRoute(route))}

      {/* 401 Unauthorized fallback */}
      <Route path="/unauthorized" element={<UnAuthorizedPage />} />

      {/* 404 fallback */}
     <Route
        path="*"
        element={
          <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
            <h1 className="display-1 fw-bold text-danger">404</h1>
            <p className="fs-4 text-secondary mb-4">Page Not Found</p>
            <a href="/" className="btn btn-primary px-4 py-2">
              Go to Home
            </a>
          </div>
        }
      />
    </Routes> 
  );
};

export default AppRouter;
