import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { type TableColumn } from "react-data-table-component";
import DataTable from "../../components/table/DataTable";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import type { School } from "../../services/api/clients/schoolClient";
import { slugify } from "../../utils/slugify";
interface Props {
  schools: School[];
  onDelete: (schoolId: string) => void;
}

export default function SchoolsTable({ schools, onDelete }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null);
  const navigate = useNavigate();
  const userRole = useUserStore((state) => state.role);

  const columns: TableColumn<School>[] = [
    {
      name: "School ID",
      selector: (row) => row.schoolId,
      sortable: true,
      wrap: true,
    },
    { name: "Name", selector: (row) => row.name, sortable: true, wrap: true },
    { name: "City/Town", selector: (row) => row.city, sortable: true },
    {
      name: "Coordinator Email",
      selector: (row) => row.coordinatorEmail,
      sortable: true,
      wrap: true,
      omit: userRole !== "admin",
    },
    {
      name: "Moderator Email",
      selector: (row) => row.moderatorEmail,
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        const coordinatorPhone = row.coordinator?.phone ?? "";
        const coordinatorName = row.coordinator?.name ?? "";
        const isInternal = row.coordinatorEmail.includes("yuvajanasamiti.org");

        const whatsappLink = isInternal
          ? `https://api.whatsapp.com/send/?phone=+91${coordinatorPhone}&text=Namaste *${coordinatorName}* garu%0A%0APlease%20join%20Vivekananda%20QUIZ%202025%20Whatsapp%20group%0A%0AWhatsapp%20group%20link:%20https://chat.whatsapp.com/DyHRcVkLUTYIlL7eoZMDqe`
          : `https://api.whatsapp.com/send/?phone=+91${coordinatorPhone}&text=నమస్తే *${coordinatorName}* గారు 🙏%0A%0Aమా ప్రతిష్టాత్మక *Vivekananda QUIZ 2025* కి మిమ్మల్ని హృదయపూర్వకంగా స్వాగతిస్తున్నాము! 🎉%0A%0Aమా moderator ముందే మిమ్మల్ని సంప్రదించారు, మరియు *${row.name}, ${row.city}* ను మా contest లో భాగం చేసుకోవడం పట్ల మేము చాలా సంతోషిస్తున్నాము!%0A%0Aమీ విద్యార్థులను ఈ క్విజ్ లో పాల్గొనమని ప్రోత్సహించండి...`;

        return (
          <div className="d-flex gap-1">
            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(`/schools/${slugify(row.name ?? row._id)}/view`)}
            >
              <i className="bi bi-eye"></i>
            </Button>

            <Button
              size="sm"
              variant="info"
              onClick={() => (window.location.href = `tel:${coordinatorPhone}`)}
            >
              <i className="bi bi-telephone"></i>
            </Button>

            {(userRole === "admin" || userRole === "moderator") && (
              <Button
                size="sm"
                variant="success"
                onClick={() => window.open(whatsappLink, "_blank")}
              >
                <i className="bi bi-whatsapp"></i>
              </Button>
            )}

            {(userRole === "admin" || userRole === "moderator") && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/admin/schools/${row._id}/edit`)}
              >
                <i className="bi bi-pencil-square"></i>
              </Button>
            )}

            {userRole === "admin" && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => setDeleteTarget(row)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            )}
          </div>
        );
      },
      width: "250px",
    },
  ];

  return (
    <>
      <DataTable<School>
        title="All Schools"
        data={schools}
        columns={columns}
        searchKeys={[
          "_id",
          "name",
          "city",
          "coordinatorEmail",
          "moderatorEmail",
        ]}
      />

      <Modal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete school - {deleteTarget?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Are you sure you want to delete this school?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleteTarget) onDelete(deleteTarget._id);
              setDeleteTarget(null);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
