import React from "react";
import ResultTable from "../../components/table/ResultTable";
import { sampleResults } from "../../tests/mocks/mockResults";


const FinalsPage: React.FC = () => {

  return (
    <div className="container mt-4">
      <h1 className="mb-4 fw-bold fs-3  text-black">Final Results</h1>    
      <ResultTable resultsData={sampleResults} />
    </div>
  );
};

export default FinalsPage;
