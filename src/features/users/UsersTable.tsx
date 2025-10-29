import { useState } from "react";
import { Modal, Button, Badge, Row, Col } from "react-bootstrap";
import { type TableColumn } from "react-data-table-component";
import DataTable from "../../components/table/DataTable";
import { useUserStore } from "../../store/useUserStore";
import type { User } from "../../services/api/clients/userClient";

interface Props {
  users: User[];
  onDelete: (userId: string) => void;
  onEdit: (user: User) => void;
  onCall: (user: User) => void;
  onAdd?: () => void; // optional add handler
}

export default function UsersTable({ users, onDelete, onEdit, onCall, onAdd }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const userRole = useUserStore((state) => state.role);

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "danger",
      moderator: "warning",
      coordinator: "info",
      user: "secondary",
    };
    return (
      <Badge bg={variants[role as keyof typeof variants] || "secondary"} className="px-2 py-1 text-capitalize" style={{fontSize : "0.7rem"}}>
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "warning",
      verified: "success",
      deleted: "danger",
    };
    return (
      <Badge bg={variants[status as keyof typeof variants] || "secondary"} className="px-2 py-1 text-capitalize" style={{fontSize : "0.7rem"}}>
        {status}
      </Badge>
    );
  };

  const columns: TableColumn<User>[] = [
    {
      name: <span className="fw-bold fs-6 text-dark">Name</span>,
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
      grow: 1.5,
    },
    {
      name: <span className="fw-bold fs-6 text-dark">Email</span>,
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
      grow: 2,
    },
    {
      name: <span className="fw-bold fs-6 text-dark">Phone</span>,
      selector: (row) => row.phone,
      sortable: true,
      center: true,
      grow: 1,
    },
    {
      name: <span className="fw-bold fs-6 text-dark">Role</span>,
      cell: (row) => getRoleBadge(row.role),
      sortable: true,
      center: true,
      grow: 1,
    },
    {
      name: <span className="fw-bold fs-6 text-dark">Status</span>,
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
      center: true,
      grow: 1,
    },
    {
      name: <span className="fw-bold fs-6 text-dark">Action</span>,
      cell: (row) => (
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="info"
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
            onClick={() => onCall(row)}
            title="Call"
          >
            <i className="bi bi-telephone"></i>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
            onClick={() => onEdit(row)}
            title="Edit"
          >
            <i className="bi bi-pencil-square"></i>
          </Button>
          {userRole === "admin" && (
            <Button
              size="sm"
              variant="danger"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
              onClick={() => setDeleteTarget(row)}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </Button>
          )}
        </div>
      ),
      center: true,
      grow: 1.2,
      ignoreRowClick: true,
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <Row className="align-items-center">
        {onAdd && (
          <Col className="text-end">
            <Button
              variant="primary"
              size="sm"
              className="fw-semibold shadow-sm"
              onClick={onAdd}
            >
              <i className="bi bi-person-plus me-2"></i>Add User
            </Button>
          </Col>
        )}
      </Row>

      {/* Responsive Table */}
      <div className="table-responsive">
        <DataTable<User>
          title="All Users"
          data={users}
          columns={columns}
          searchKeys={["name", "email", "phone", "role", "status"]}
        />
      </div>

      {/* Delete confirmation modal */}
      <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete User - {deleteTarget?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleteTarget) onDelete(deleteTarget._id);
              setDeleteTarget(null);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
