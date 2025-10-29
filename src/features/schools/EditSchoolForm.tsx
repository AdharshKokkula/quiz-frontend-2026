import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSchoolById, useUpdateSchool } from "../../hooks/useSchools";
import type { School } from "../../services/api/clients/schoolClient";
import { useUsersByRole } from "../../hooks/useUsers";

export default function EditSchoolForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch school data
  const { data: school, isLoading, isError } = useSchoolById(id || "");
  const updateSchool = useUpdateSchool();

  const [formData, setFormData] = useState<Partial<School>>({});
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch users by role
  const { data: coordinators = [] } = useUsersByRole("coordinator");
  const { data: moderators = [] } = useUsersByRole("moderator");

  // Prefill form once data is loaded
  useEffect(() => {
    if (school) setFormData(school);
  }, [school]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setErrorMsg("");

    try {
      await updateSchool.mutateAsync({
        id,
        data: {
          name: formData.name,
          city: formData.city,
          coordinatorEmail: formData.coordinatorEmail,
          moderatorEmail: formData.moderatorEmail,
        },
      });

      alert("School updated successfully!");
      navigate("/schools");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update school. Please try again.");
    }
  };

  if (isLoading) return <p className="p-3">Loading school details...</p>;
  if (isError)
    return <p className="p-3 text-danger">Failed to load school details.</p>;
  if (!formData._id) return <p className="p-3">No school found for this ID.</p>;

  return (
    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Edit School</h1>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

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
              value={formData.name || ""}
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
              value={formData.city || ""}
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
              value={formData.coordinatorEmail || ""}
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
              value={formData.moderatorEmail || ""}
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
              disabled={updateSchool.isPending}
            >
              {updateSchool.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
