import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../hooks/useUsers";
import type { CreateUserData } from "../../services/api/clients/userClient";

export default function AddUserForm() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(formData);
      navigate("/users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Add User</h1>
      </div>

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
              value={formData.name}
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
              value={formData.email}
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
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit Indian phone number"
              required
            />
          </div>

          {/* Password */}
          <div className="col-6 mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              minLength={6}
              required
            />
          </div>

          {/* Role */}
          <div className="col-6 mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              className="form-control"
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as CreateUserData['role'] })
              }
              required
            >
              <option value="user">User</option>
              <option value="coordinator">Coordinator</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
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
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
