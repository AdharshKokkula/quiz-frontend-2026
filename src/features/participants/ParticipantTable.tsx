import React, { useMemo } from "react";
import { type TableColumn } from "react-data-table-component";
import type { Participant } from "../../services/api/clients/participantsClient";
import DataTable from "../../components/table/DataTable";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSchools } from "../../hooks/useSchools";
import type { School } from "../../services/api/clients/schoolClient";

interface ParticipantTableProps {
  allParticipants?: boolean;
  participantsData?: Participant[];
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  participantsData = [],
}) => {
  const navigate = useNavigate();

  // Fetch schools so we can map id -> name
  const { data: schools } = useSchools();

  // Build a lookup map for fast resolution
  const schoolMap = useMemo(() => {
    const m: Record<string, string> = {};
    (schools ?? []).forEach((s: School) => {
      if (s._id) m[s._id] = s.name;
      if ((s as any).schoolId) m[(s as any).schoolId] = s.name;
    });
    return m;
  }, [schools]);

  // Helper: given participant.school (string id or object), return display name
  const getSchoolDisplay = (schoolField: any) => {
    if (!schoolField) return "";
    // if participant.school is an object (populated)
    if (typeof schoolField === "object") {
      return (schoolField.name ?? schoolField._id ?? "").toString();
    }
    // if participant.school is a string id
    if (typeof schoolField === "string") {
      return schoolMap[schoolField] ?? schoolField;
    }
    return String(schoolField);
  };

  const columns: TableColumn<Participant>[] = [
    { name: "Team ID", selector: (row) => row.teamId, sortable: true },
    {
      name: "Participant ID",
      selector: (row) => row.participantId,
      sortable: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true, wrap: true },
    {
      name: "Father's Name",
      selector: (row) => row.fatherName,
      sortable: true,
      wrap: true,
    },
    { name: "Class", selector: (row) => row.class, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true, wrap: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    {
      name: "DOB",
      selector: (row) => (row.dob ? row.dob.split("T")[0] : ""),
      sortable: true,
      wrap: true,
    },
    {
      name: "School/College",
      selector: (row) => getSchoolDisplay((row as any).school),
      wrap: true,
      sortable: true,
    },
    { name: "Home Town", selector: (row) => row.homeTown, sortable: true },
    { name: "Type", selector: (row) => row.type, sortable: true },
    {
      name: "Action",
      cell: (row) => {
        const whatsappLink = `https://api.whatsapp.com/send/?phone=+91${row.phone}&text=Hello *${row.name}*!%0A%0APlease check your mail to verify your email ID for *QUIZ 2025* %0A%0AYou won't be considered for the event if you don't verify your mail ID.%0A%0AThanks for participating in *QUIZ 2025* %0ALet's meet soon! 😉`;

        return (
          <div className="d-flex align-items-center gap-2">
            <Button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/participants/${row.participantId}`)}
            >
              <i className="bi bi-pencil-square"></i>
            </Button>

            <>
              <Button
                className="btn btn-info btn-sm"
                onClick={() => (window.location.href = `tel:${row.phone}`)}
              >
                <i className="bi bi-telephone"></i>
              </Button>

              <Button
                className="btn btn-success btn-sm"
                onClick={() => window.open(whatsappLink, "_blank")}
              >
                <i className="bi bi-whatsapp"></i>
              </Button>
            </>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Optionally, you can precompute participantsData with schoolName if you want sorting/search to use it.
  // For now we keep data unchanged and resolve names in the selector above.

  return (
    <div className="container mt-4">
      <DataTable
        title="All Participants"
        columns={columns}
        data={participantsData}
        searchKeys={[
          "class",
          "dob",
          "email",
          "fatherName",
          "participantId",
          "school",
          "name",
          "teamId",
          "homeTown",
        ]}
      />
    </div>
  );
};

export default ParticipantTable;


