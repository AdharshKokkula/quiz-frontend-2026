import React from "react";
import ResultTable from "../../components/table/ResultTable";


const PreliminaryPage: React.FC = () => {

  return (
    <div className="container mt-4">
      <h1 className="mb-4 fw-bold fs-3  text-black">Preliminary Results</h1>    
      <ResultTable  />
    </div>
  );
};

export default PreliminaryPage;
