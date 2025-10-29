import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UsersTable from "../../features/users/UsersTable";
import { useUsers, useDeleteUser } from "../../hooks/useUsers";
import type { User } from "../../services/api/clients/userClient";

export function UsersPage() {
  const navigate = useNavigate();
  const [filters] = useState({}); // later sync with useUser hook.

  const { data, isLoading, isError } = useUsers(filters);
  const { mutate: deleteUser } = useDeleteUser();

  const handleEdit = (user: User) => {
    navigate(`/users/${user._id}/edit`);
  };

  const handleCall = (user: User) => {
    // Open phone dialer
    window.open(`tel:${user.phone}`, "_self");
  };

  const handleAddUser = () => {
    navigate("/users/add");
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users.</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-end mt-2">
        <Button
          variant="secondary"
          onClick={handleAddUser}
          className="d-flex align-items-center gap-2 px-3"
        >
          Add <i className="bi bi-plus-circle"></i>
        </Button>
      </div>

      {data && (
        <UsersTable
          users={data.data}
          onDelete={(userId) => deleteUser(userId)}
          onEdit={handleEdit}
          onCall={handleCall}
        />
      )}
    </div>
  );
}
