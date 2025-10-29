import React from "react";
import ResultTable from "../../components/table/ResultTable";


const ScreeningTestPage: React.FC = () => {

  return (
    <div className="container mt-4">
      <h1 className="mb-4 fw-bold fs-3  text-black">Screening Tests Results</h1>    
      <ResultTable  />
    </div>
  );
};

export default ScreeningTestPage;
