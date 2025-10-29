import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPassword, useUsers } from "../../hooks/useUsers";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const { data: usersData } = useUsers({ limit: 1000 }); // Get all users to search by email

  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    try {
      // Find user by email
      const user = usersData?.data.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      if (!user) {
        setErrorMsg("User not found with this email address");
        return;
      }

      const result = await resetPassword.mutateAsync({
        userId: user._id,
        newPassword: formData.newPassword,
      });
      setSuccessMsg(result.message || "Password reset successfully!");
      setFormData({ email: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h2">Change User Password</h1>
      </div>

      {successMsg && (
        <div className="alert alert-success" role="alert">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
      )}

      <form className="container" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">
              Select User
            </label>
            <select
              className="form-control"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            >
              <option value="">-- Select a user --</option>
              {usersData?.data.map((user) => (
                <option key={user._id} value={user.email}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              minLength={6}
              required
              placeholder="Enter new password"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              minLength={6}
              required
              placeholder="Confirm new password"
            />
          </div>

          <div className="col-sm-12 my-4">
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
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}