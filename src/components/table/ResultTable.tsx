import React, { useMemo, useState } from "react";
import DataTable, {type TableColumn } from "react-data-table-component";

interface Result {
  teamId: string;
  participants: string;
  category: string;
  school: string;
  type: string;
  rank: string;
}

interface ResultTableProps {
  resultsData?: Result[];
  onDelete?: (teamId: string) => void;
  participantData?: boolean;
}

const ResultTable: React.FC<ResultTableProps> = ({
  resultsData = [],
  onDelete,
  participantData = false,
}) => {
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  // Filtered data
 let filteredData =  resultsData.length > 0 ? resultsData : [{ teamId: "", participants: "", category: "", school: "", type: "", rank: "" }];
   filteredData = useMemo(() => {
    return resultsData.filter((data) =>
      Object.values(data)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [resultsData, search]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage);

  // Table columns
  const columns: TableColumn<Result>[] = [
    {
    name: "", 
    cell: (row: Result) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/certificate?id=${row.teamId}&name=${encodeURIComponent(
          row.participants
        )}&round=Screening Test&rank=${encodeURIComponent(row.rank)}`}
        className="btn bg-transparent btn-sm"
      >
        <i className="bi bi-download"></i>
      </a>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "70px", 
  },
    { name: "TeamID", selector: (row) => row.teamId, sortable: true },
    { name: "Participants", selector: (row) => row.participants, sortable: true },
    { name: "Category", selector: (row) => row.category, sortable: true },
    { name: "School", selector: (row) => row.school },
    { name: "Type", selector: (row) => row.type },
    { name: "Rank", selector: (row) => row.rank },
    ...(participantData
    ? []
    : [
        {
          name: "Action",
          cell: (row: Result) => (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete && onDelete(row.teamId)}
            >
              <i className="bi bi-trash"></i>
            </button>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        } as TableColumn<Result>,
      ]),
  ];

  // Pagination logic
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (page <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (page > totalPages - 4) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }
    return pages;
  };

  

  return (
    <div className="container mt-4">
      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <span>Show</span>
          <select
            className="form-select form-select-sm w-auto"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
          <span>entries</span>
        </div>

        <div className="input-group w-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        highlightOnHover
        pointerOnHover
        striped
        responsive
        noDataComponent={<div className="text-center py-3">No results found</div>}
        customStyles={{
          rows: {
            style: {
              minHeight: "60px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
            },
            stripedStyle: { backgroundColor: "#f8f9fa" },
          },
          headCells: {
            style: {
              fontWeight: "bold",
              fontSize: "1rem",
              minHeight: "72px",
            },
          },
        }}
      />

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted small">
          Showing <b>{(page - 1) * perPage + 1}</b> to{" "}
          <b>{Math.min(page * perPage, filteredData.length)}</b> of{" "}
          <b>{filteredData.length}</b> entries
        </div>

        <ul className="pagination mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link bg-transparent fw-normal text-blue"
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
          </li>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <li key={i} className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            ) : (
              <li key={i} className={`page-item ${page === p ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(p as number)}>
                  {p}
                </button>
              </li>
            )
          )}

          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link bg-transparent fw-normal text-blue"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResultTable;
