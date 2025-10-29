import React, { useRef, useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DataTable from "../../components/table/DataTable";
import { type TableColumn } from "react-data-table-component";
import { useParticipantsBySchool } from "../../hooks/useParticipants";
import { useParams, useNavigate } from "react-router-dom";
import { useSchools } from "../../hooks/useSchools"; // <-- use all schools
import { slugify } from "../../utils/slugify"; // <-- import slugify

interface Participant {
  teamId: string;
  participantId: string;
  name: string;
  fatherName: string;
  classGrade: string;
  dob: string;
  verified?: boolean;
}

const ViewSchoolPage: React.FC = () => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>(); // <-- read slug
  const navigate = useNavigate();

  // fetch all schools (hook from your provided code)
  const { data: schools, isLoading: schoolsLoading, isError: schoolsError } =
    useSchools();

  // find the correct school by comparing slugified names
  const schoolData = useMemo(() => {
    if (!schools || !schoolSlug) return undefined;
    return (schools as any[]).find((s) => slugify(s.name) === schoolSlug);
  }, [schools, schoolSlug]);

  const schoolId = schoolData?._id as string | undefined;

  // fetch participants by resolved schoolId
  const { data: participants, isLoading, isError } =
    useParticipantsBySchool(schoolId || "");

  const tableRef = useRef<HTMLDivElement>(null);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!participants) return setAllParticipants([]);
    const arr: any[] = Array.isArray((participants as any).data)
      ? (participants as any).data
      : Array.isArray(participants)
      ? participants
      : [];
    const mapped: Participant[] = arr.map((p: any) => ({
      teamId: p.teamID ?? p.teamId ?? "-",
      participantId: p.participantId ?? "-",
      name: p.name ?? "-",
      fatherName: p.fatherName ?? "-",
      classGrade: p.class ?? p.classGrade ?? "-",
      dob: p.dob
        ? new Date(p.dob).toLocaleDateString()
        : p.registeredAt
        ? new Date(p.registeredAt).toLocaleDateString()
        : "-",
      verified: p.status === "verified" || p.verified === true,
    }));
    setAllParticipants(mapped);
  }, [participants]);

  const [searchTerm] = useState<string>("");
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);

  const filteredParticipants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allParticipants;
    return allParticipants.filter((p) =>
      Object.values(p)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [allParticipants, searchTerm]);

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    if (tableRef.current) {
      const canvas = await html2canvas(tableRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("participants.pdf");
    }
  };

  const columns: TableColumn<Participant>[] = [
    { name: "Team ID", selector: (row) => row.teamId, sortable: true },
    { name: "Participant ID", selector: (row) => row.participantId, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Father's Name", selector: (row) => row.fatherName, sortable: true },
    { name: "Class", selector: (row) => row.classGrade, sortable: true },
    { name: "DOB", selector: (row) => row.dob, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => navigate(`/participants/${row.participantId}`)}
        >
          <i className="bi bi-pencil-square"></i>
        </button>
      ),
    },
  ];

  // show loading while either schools or participants are loading
  if (isLoading || schoolsLoading)
    return <div className="text-center mt-5">Loading data...</div>;

  // error / not found handling
  if (isError || schoolsError || !schoolData)
    return (
      <div className="text-center mt-5 text-danger">
        Failed to load data or school not found
      </div>
    );

  // Extract school name and city safely
  const schoolName = schoolData?.name ?? "Unknown School";
  const schoolCity = schoolData?.city ?? "Unknown City";

  const total = filteredParticipants.length;
  const start = total === 0 ? 0 : 1;
  const end = Math.min(entriesPerPage, total);

  return (
    <div className="container-fluid mt-4" style={{ width: "100%", height: "auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-semibold mb-3">
          {schoolName}, {schoolCity}
        </h2>

        {/* navigate using the slug (page route uses slug) */}
        <button
          className="btn btn-secondary mt-5"
          onClick={() =>
            navigate(`/schools/${slugify(schoolName)}/view/registerparticipant`)
          }
        >
          Register Participants <i className="bi bi-plus-circle ms-1"></i>
        </button>
      </div>

      <div className="row mb-3 mt-4">
        <div className="col-md-6 d-flex justify-content-start gap-2">
          <button onClick={handlePrint} className="btn btn-secondary text-white">
            <i className="bi bi-printer me-2 text-white"></i>
            Print
          </button>
          <button onClick={handleDownload} className="btn btn-secondary text-white">
            <i className="bi bi-file-earmark-pdf me-2 text-white"></i>
            Download
          </button>
        </div>
      </div>

      <div ref={tableRef}>
        <div className="d-flex justify-content-center mt-4 mb-2">
          <div className="text-center">
            <p className="fw-bold fs-4 mb-1">Seniors: 0</p>
            <p className="fw-bold fs-4 mb-1">Juniors: 0</p>
            <p className="fw-bold fs-4 mb-1">Masters: {allParticipants.length}</p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            <label className="mb-0">Show</label>
            <select
              className="form-select form-select-sm w-auto"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            >
              {[5, 10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="ms-2">entries</span>
          </div>
        </div>

        <DataTable<Participant>
          title={"Participants"}
          data={filteredParticipants.slice(0, entriesPerPage)}
          columns={columns}
          searchKeys={["teamId", "participantId", "name", "fatherName", "classGrade", "dob"]}
          minHeight={"200px"}
        />

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="small text-muted">Showing {start} to {end} of {total} entries</div>

           <nav aria-label="Participant table pagination">
            <ul className="pagination mb-0">
              <li className={`page-item ${1 === 1 || total <= entriesPerPage ? "disabled" : ""}`}>
                <button className="page-link" tabIndex={-1} aria-disabled>
                  Previous
                </button>
              </li>

              <li className="page-item active" aria-current="page">
                <button className="page-link">1</button>
              </li>

              <li className={`page-item ${total <= entriesPerPage ? "disabled" : ""}`}>
                <button className="page-link" aria-disabled={total <= entriesPerPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>


      </div>
    </div>
  );
};

export default ViewSchoolPage;
