import { useState } from "react";
import DataTableBase, { type TableColumn } from "react-data-table-component";
import { Form } from "react-bootstrap";

interface DataTableProps<T> {
  title: string;
  data: T[] | undefined;
  columns: TableColumn<T>[];
  searchKeys?: (keyof T)[];
  minHeight?: string;
}

export default function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  searchKeys = [],
  minHeight = "500px",
}: DataTableProps<T>) {
  const [searchText, setSearchText] = useState("");

  const safeData = Array.isArray(data) ? data : [];

  const filteredData =
    searchKeys.length > 0
      ? safeData.filter((row) =>
          searchKeys.some((key) =>
            String(row[key] ?? "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          )
        )
      : safeData;

  return (
    <div className="py-4 container-fluid">
      {/* Header row */}
      <div className="row mb-3">
        <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <h2 className="mb-0">{title}</h2>
        </div>
      </div>

      {/* Search bar row */}
      {searchKeys.length > 0 && (
        <div className="row mb-3">
          <div className="col d-flex flex-column flex-md-row justify-content-md-end gap-2">
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ maxWidth: "250px" }}
            />
          </div>
        </div>
      )}

      {/* Table row */}
      <div className="row">
        <div className="col">
          <div className="border rounded bg-white" style={{ minHeight }}>
            <DataTableBase
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              responsive
              persistTableHead
              noDataComponent={
                <div className="text-center py-3 w-100">No results found</div>
              }
              customStyles={{
                headCells: { style: { fontWeight: "bold" } },
                cells: {
                  style: { whiteSpace: "normal", wordBreak: "break-word" },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
