import React from "react";
import { useNavigate } from "react-router-dom";

const ResultsIndex: React.FC = () => {
  const navigate = useNavigate();

  // List of result categories
  const buttons = [
    { label: "Participants", link: "/results/participants" },
    { label: "Screening Test", link: "/results/screening-test" },
    { label: "Preliminary", link: "/results/preliminary" },
    { label: "Semi Finals", link: "/results/semi-finals" },
    { label: "Finals", link: "/results/finals" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4">Results</h2>

      <div className="d-flex flex-column gap-3">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className="btn btn-primary fw-semibold px-4 py-2 text-white"
            onClick={() => navigate(btn.link)}
            style={{ width: "180px", textAlign: "left" }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResultsIndex;
