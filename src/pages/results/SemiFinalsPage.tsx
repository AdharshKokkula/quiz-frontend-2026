import React from "react";
import ResultTable from "../../components/table/ResultTable";


const SemiFinalsPage: React.FC = () => {

  return (
    <div className="container mt-4">
      <h1 className="mb-4 fw-bold fs-3  text-black">Semi Finals Results</h1>    
      <ResultTable  />
    </div>
  );
};

export default SemiFinalsPage;
