import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserById, useUpdateUser, useChangeUserRole, useUpdateUserStatus } from "../../hooks/useUsers";
import { useUserStore } from "../../store/useUserStore";
import type { User } from "../../services/api/clients/userClient";

export default function EditUserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserRole = useUserStore((state) => state.role);

  const { data: user, isLoading, isError } = useUserById(id || "");
  const updateUser = useUpdateUser();
  const changeRole = useChangeUserRole();
  const updateStatus = useUpdateUserStatus();

  const [formData, setFormData] = useState<Partial<User>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  // Permission checks
  const canEditRole = currentUserRole === "admin";
  const canEditStatus = ["admin", "moderator"].includes(currentUserRole ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Update basic info
      await updateUser.mutateAsync({
        id,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      });

      // Update role if changed and user has permission
      if (canEditRole && formData.role !== user.role) {
        await changeRole.mutateAsync({
          id,
          role: formData.role as User['role'],
        });
      }

      // Update status if changed and user has permission
      if (canEditStatus && formData.status !== user.status) {
        await updateStatus.mutateAsync({
          id,
          status: formData.status as User['status'],
        });
      }

      setSuccessMsg("User updated successfully!");
      navigate("/users");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update user. Please try again.");
    }
  };

  if (isLoading) return <p className="p-3">Loading user details...</p>;
  if (isError) return <p className="p-3 text-danger">Failed to load user details.</p>;
  if (!formData._id) return <p className="p-3">No user found for this ID.</p>;

  return (
    <main className="ms-sm-auto px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Edit User</h1>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <form className="container" onSubmit={handleSubmit}>
        <div className="row">
          {/* Name */}
          <div className="col-6 mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div className="col-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Phone */}
          <div className="col-6 mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit Indian phone number"
              required
            />
          </div>

          {/* Role - Editable for Admins */}
          <div className="col-6 mb-3">
            <label htmlFor="role" className="form-label">
              Role
              {!canEditRole && <small className="text-muted ms-2">(Admin only)</small>}
            </label>
            {canEditRole ? (
              <select
                className="form-control"
                id="role"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as User['role'] })
                }
                required
              >
                <option value="user">User</option>
                <option value="coordinator">Coordinator</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                id="role"
                value={formData.role || ""}
                readOnly
                style={{ backgroundColor: "#f8f9fa" }}
              />
            )}
          </div>

          {/* Status - Only Pending, Verified, Deleted */}
          <div className="col-6 mb-3">
            <label htmlFor="status" className="form-label">
              Status
              {!canEditStatus && <small className="text-muted ms-2">(Admin/Moderator only)</small>}
            </label>
            {canEditStatus ? (
              <select
                className="form-control"
                id="status"
                value={formData.status || ""}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as User['status'] })
                }
                required
              >
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="deleted">Deleted</option>
              </select>
            ) : (
              <input
                type="text"
                className="form-control"
                id="status"
                value={formData.status || ""}
                readOnly
                style={{ backgroundColor: "#f8f9fa" }}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="col-sm-12 my-5">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateUser.isPending || changeRole.isPending || updateStatus.isPending}
            >
              {(updateUser.isPending || changeRole.isPending || updateStatus.isPending) 
                ? "Updating..." 
                : "Update User"
              }
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
