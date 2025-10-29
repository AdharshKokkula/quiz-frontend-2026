interface CsvSummaryProps {
  validCount: number;
  invalidCount: number;
}

export default function CsvSummary({
  validCount,
  invalidCount,
}: CsvSummaryProps) {
  return (
    <div className="d-flex justify-content-between mb-2">
      <div>
        <h6>Validation Summary</h6>
        <p className="small text-secondary">
          Invalid fields are shown in red with error messages.
        </p>
      </div>
      <div className="text-end">
        <span className="text-success fw-bold">{validCount} Valid</span> |{" "}
        <span className="text-danger fw-bold">{invalidCount} Invalid</span>
      </div>
    </div>
  );
}
