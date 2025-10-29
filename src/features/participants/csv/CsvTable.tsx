import DataTable from "../../../components/table/DataTable";
import type { Participant } from "../../../services/api/clients/participantsClient";

interface CsvRow extends Participant {
  isValid: boolean;
  errorMsgs: Partial<Record<keyof Participant, string>>;
}

interface CsvTableProps {
  csvData: CsvRow[];
  selectedRows: number[];
  onSelectRow: (idx: number) => void;
  onSelectAll: () => void;
}

export default function CsvTable({
  csvData,
  selectedRows,
  onSelectRow,
  onSelectAll,
}: CsvTableProps) {
  const dataKeys = [
    "name",
    "fatherName",
    "dob",
    "class",
    "school",
    "homeTown",
    "email",
    "phone",
    "type",
  ] as (keyof Participant)[];

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={
            selectedRows.length === csvData.filter((r) => r.isValid).length &&
            csvData.length > 0
          }
          onChange={onSelectAll}
        />
      ),
      cell: (_row: CsvRow, idx: number) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(idx)}
          disabled={!csvData[idx].isValid}
          onChange={() => onSelectRow(idx)}
        />
      ),
      width: "60px",
    },
    ...dataKeys.map((key) => ({
      name: key.toUpperCase(),
      selector: (row: CsvRow) => row[key] ?? "",
      cell: (row: CsvRow) => {
        const error = row.errorMsgs[key];
        return (
          <div
            style={{
              color: error ? "red" : "inherit",
              fontWeight: error ? 600 : 400,
            }}
          >
            {row[key] || "-"}
            {error && <div className="small text-danger">{error}</div>}
          </div>
        );
      },
    })),
  ];

  return (
    <DataTable
      title=""
      data={csvData}
      columns={columns}
      searchKeys={["name", "fatherName", "school", "homeTown"]}
      minHeight="300px"
    />
  );
}
