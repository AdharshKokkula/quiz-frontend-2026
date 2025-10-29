import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UnAuthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUrl = `${window.location.origin}${location.pathname}${location.search}`;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center px-3">
      <h1 className="display-1 fw-bold text-warning mb-3">401</h1>
      <h4 className="mb-3 text-secondary">Unauthorized Access</h4>

      <p className="text-muted mb-4">
        You are not authorized to access this page:
        <br />
        <span className="text-danger fw-semibold">{currentUrl}</span>
      </p>

      <button
        className="btn btn-primary px-4 py-2"
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
};

export default UnAuthorizedPage;
