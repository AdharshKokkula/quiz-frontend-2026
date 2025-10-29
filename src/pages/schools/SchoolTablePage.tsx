import SchoolsTable from "../../features/schools/SchoolsTable";
import { useNavigate } from "react-router-dom";
import { useSchools, useDeleteSchool } from "../../hooks/useSchools";

export function SchoolTablePage() {
  const navigate = useNavigate();

  const { data: schools, isLoading, isError } = useSchools();

  const { mutate: deleteSchool } = useDeleteSchool();

  if (isLoading) return <div>Loading schools...</div>;
  if (isError) return <div>Error loading schools.</div>;

  return (
    <div className="container-fluid">
      {/* Add School Button */}
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/schools/add")}
        >
          Add School <i className="bi bi-plus-circle"></i>
        </button>
      </div>

      {/* Schools Table */}
      {schools && (
        <SchoolsTable
          schools={schools}
          onDelete={(schoolId) => deleteSchool(schoolId)}
        />
      )}
    </div>
  );
}
