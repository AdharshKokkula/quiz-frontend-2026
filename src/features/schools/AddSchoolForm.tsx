import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSchool } from "../../hooks/useSchools";
import { useUsersByRole } from "../../hooks/useUsers";

export default function AddSchoolForm() {
  const navigate = useNavigate();
  const createSchool = useCreateSchool();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    coordinatorEmail: "",
    moderatorEmail: "",
  });

  // Fetch users by role
  const { data: coordinators = [] } = useUsersByRole("coordinator");
  const { data: moderators = [] } = useUsersByRole("moderator");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSchool.mutateAsync(formData);
      navigate("/schools");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Add School</h1>
      </div>

      <form className="container" onSubmit={handleSubmit}>
        <div className="row">
          {/* School Name */}
          <div className="col-6 mb-3">
            <label htmlFor="name" className="form-label">
              School Name
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

          {/* City */}
          <div className="col-6 mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              required
            />
          </div>

          {/* Coordinator */}
          <div className="col-6 mb-3">
            <label htmlFor="coordinatorEmail" className="form-label">
              Coordinator
            </label>
            <select
              className="form-control"
              id="coordinatorEmail"
              value={formData.coordinatorEmail}
              onChange={(e) =>
                setFormData({ ...formData, coordinatorEmail: e.target.value })
              }
              required
            >
              <option value="">Select Coordinator</option>
              {coordinators.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Moderator */}
          <div className="col-6 mb-3">
            <label htmlFor="moderatorEmail" className="form-label">
              Moderator
            </label>
            <select
              className="form-control"
              id="moderatorEmail"
              value={formData.moderatorEmail}
              onChange={(e) =>
                setFormData({ ...formData, moderatorEmail: e.target.value })
              }
              required
            >
              <option value="">Select Moderator</option>
              {moderators.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
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
              disabled={createSchool.isPending}
            >
              {createSchool.isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
