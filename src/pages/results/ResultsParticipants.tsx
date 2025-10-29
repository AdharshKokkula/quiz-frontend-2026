import React from "react";
import ResultTable from "../../components/table/ResultTable";
import { sampleResults } from "../../tests/mocks/mockResults";


const ResultsParticipants: React.FC = () => {

  return (
    <div className="container mt-4">
      <h1 className="mb-4 fw-bold fs-3  text-black">Results- Participants</h1>    
      <ResultTable resultsData={sampleResults} participantData={true} />
    </div>
  );
};

export default ResultsParticipants;
