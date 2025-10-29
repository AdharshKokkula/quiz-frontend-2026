import { useState } from "react";
import DeletedUsersTable from "../../features/users/DeletedUsersTable";
import { useDeletedUsers } from "../../hooks/useUsers";

export function DeletedUsersPage() {
  const [filters] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError } = useDeletedUsers(filters);

  if (isLoading) return <div>Loading deleted users...</div>;
  if (isError) return <div>Error loading deleted users.</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <div className="text-muted">
          {data?.data.length || 0} deleted user(s) found
        </div>
      </div>

      {data && <DeletedUsersTable users={data.data} />}
    </div>
  );
}