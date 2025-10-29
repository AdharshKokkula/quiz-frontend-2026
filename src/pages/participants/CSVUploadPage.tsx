import { useState } from "react";
import { useBulkInsertParticipants } from "../../hooks/useParticipants";
import { type Participant } from "../../services/api/clients/participantsClient";
import {
  normalizeDate,
  normalizeHeader,
  parseCsvLine,
} from "../../utils/csvParser";
import CsvTable from "../../features/participants/csv/CsvTable";
import CsvSummary from "../../features/participants/csv/CsvSummary";
import { validateRow } from "../../utils/csvValidator";

interface CsvRow extends Participant {
  isValid: boolean;
  errorMsgs: Partial<Record<keyof Participant, string>>;
}

export default function CSVUploadPage() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const bulkInsertMutation = useBulkInsertParticipants();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const text = await file.text();
    const rawLines = text.split(/\r?\n/).map((l) => l.trim());
    const lines = rawLines.filter((l) => l.length > 0);
    if (lines.length <= 1) {
      alert("CSV must have header and data rows");
      return;
    }

    const headerCells = parseCsvLine(lines[0]).map(normalizeHeader);
    const headerIndex: Record<string, number> = {};
    headerCells.forEach((h, idx) => (headerIndex[h] = idx));

    const existingEmails: string[] = [];
    const existingPhones: string[] = [];
    const parsed: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      const get = (key: string) => {
        const idx = headerIndex[key];
        if (idx === undefined) return "";
        const raw = cols[idx] ?? "";
        return raw.trim().toUpperCase() === "NULL" ? "" : raw.trim();
      };

      const dob = normalizeDate(get("dob"));
      const row: Participant = {
        participantId: `AUTO${1000 + i}`,
        name: get("name"),
        fatherName: get("fathername"),
        school: get("school"),
        homeTown: get("hometown"),
        email: get("email"),
        phone: get("phone"),
        dob,
        class: get("class"),
        type: (get("type") || "individual").toLowerCase(),
        status: "pending",
      } as Participant;

      const { isValid, errorMsgs } = validateRow(
        row,
        existingEmails,
        existingPhones
      );
      if (row.email) existingEmails.push(row.email.toLowerCase());
      if (row.phone) existingPhones.push(row.phone);
      parsed.push({ ...row, isValid, errorMsgs });
    }

    setCsvData(parsed);
    const validIndexes = parsed
      .map((r, i) => (r.isValid ? i : -1))
      .filter((i) => i !== -1);
    setSelectedRows(validIndexes);
    setValidCount(validIndexes.length);
    setInvalidCount(parsed.length - validIndexes.length);
  };

  const handleSelectRow = (idx: number) => {
    if (!csvData[idx].isValid) return;
    setSelectedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAll = () => {
    const validIndexes = csvData
      .map((r, i) => (r.isValid ? i : -1))
      .filter((i) => i !== -1);
    setSelectedRows(
      selectedRows.length === validIndexes.length ? [] : validIndexes
    );
  };

  const handleBulkInsert = () => {
    const dataToInsert = selectedRows.map((idx) => csvData[idx]);
    if (!dataToInsert.length) return alert("0 records selected!");
    bulkInsertMutation.mutate(dataToInsert, {
      onSuccess: () => {
        alert("Bulk insert successful!");
        setCsvData([]);
        setSelectedRows([]);
      },
      onError: () => alert("Bulk insert failed!"),
    });
  };

  return (
    <main className="p-5">
      <h1 className="h2 mb-3">CSV Participant Import</h1>

      <form className="mb-3">
        <div className="mb-3 col-6">
          <label htmlFor="file" className="form-label">
            CSV File
            (name,email,phone,dob,class,school,hometown,fathername,type)
          </label>
          <input
            type="file"
            id="file"
            accept=".csv"
            className="form-control"
            onChange={handleFileUpload}
          />
        </div>
      </form>

      {csvData.length > 0 && (
        <>
          <div className="d-flex justify-content-end mb-2">
            <button className="btn btn-primary" onClick={handleBulkInsert}>
              Import
            </button>
          </div>

          <CsvSummary validCount={validCount} invalidCount={invalidCount} />

          <CsvTable
            csvData={csvData}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
          />
        </>
      )}
    </main>
  );
}
