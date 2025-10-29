import { Badge } from "react-bootstrap";
import { type TableColumn } from "react-data-table-component";
import DataTable from "../../components/table/DataTable";
import type { User } from "../../services/api/clients/userClient";

interface Props {
  users: User[];
}

export default function DeletedUsersTable({ users }: Props) {
  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "danger",
      moderator: "warning", 
      coordinator: "info",
      user: "secondary",
    };
    return (
      <Badge bg={variants[role as keyof typeof variants] || "secondary"}>
        {role}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns: TableColumn<User>[] = [
    { 
      name:<span className="fw-bold fs-6 text-dark">Name</span>,
      selector: (row) => row.name, 
      sortable: true,
      width: "200px",
      style: {
        paddingLeft: '16px',
      }
    },
    { 
      name: <span className="fw-bold fs-6 text-dark">Email</span>,
      selector: (row) => row.email, 
      sortable: true,
      width: "300px",
      wrap: true,
      style: {
        paddingLeft: '16px',
      }
    },
    { 
      name: <span className="fw-bold fs-6 text-dark">Phone</span>, 
      selector: (row) => row.phone, 
      sortable: true,
      width: "140px",
      center: true,
    },
    {
      name: <span className="fw-bold fs-6 text-dark">Role</span>,
      cell: (row) => (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {getRoleBadge(row.role)}
        </div>
      ),
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: <span className="fw-bold fs-6 text-dark">Deleted Date</span>,
      cell: (row) => (
        <span className="text-muted small">
          {formatDate(row.updatedAt)}
        </span>
      ),
      sortable: true,
      width: "160px",
      center: true,
    },
  ];

  return (
    <DataTable<User>
      title="Deleted Users"
      data={users}
      columns={columns}
      searchKeys={["name", "email", "phone", "role"]}
    />
  );
}