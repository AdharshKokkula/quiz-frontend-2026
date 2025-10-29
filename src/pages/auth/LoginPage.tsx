import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthClient } from "../../services/api";
import { message } from "antd";
import { useUserStore } from "../../store/useUserStore";
import Cookies from "js-cookie";
import { useAuthStore } from "../../store/useAuth";
import axiosInstance from "../../services/api/axiosInstance";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setRole ,setStatus } = useUserStore();
  const { login } = useAuthStore()
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {

      const res = await AuthClient.login(data);
      const token = res?.data?.data?.token;
      const { role, userId ,status} = res?.data?.data?.user
      login(token, userId); // Update auth store
      message.success("Login successful!");
      // Store token as raw JWT in cookie 
      Cookies.set("token", token, { path: "/" });
      // Set default Authorization header for axios instance so subsequent requests include it
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Set user role in the store
      message.success(`Logged in as ${role}`);
      setRole(role);                           //set default role for testing [setRole("")]
      setStatus(status);
      navigate('/admin')

    } catch (error) {
      message.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    }
  };

  return (
    <div>

      <div className="d-flex flex-column justify-content-center align-items-center mt-5 gap-3">
        <div style={{ width: "100px", height: "100px" }}>
          <img
            src="/Quiz-2025-logo.png"
            alt="Logo"
            className="img-fluid rounded-3"
          />
        </div>

        <h2 className="fw-bold font-monospace">
          Log In
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column align-items-center w-100"
        >

          <input
            type="text"
            className={`form-control custom-input border border-2 mt-2 ${errors.password ? 'is-invalid' : ''}`}
            style={{ width: "16rem", borderColor: "#d1d5db" }}

            placeholder="Enter your Email"
            {...register("email", {
              required: true,
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <div className="invalid-feedback text-center">{errors.email.message as string}</div>
          )}

          <div className="d-flex flex-column  mt-3" style={{ width: '16rem' }}>
            <i className="fa-regular fa-eye"></i>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-0 border-0 bg-transparent fw-semibold align-self-end"

              style={{ color: "#c2410c", fontSize: '0.8rem' }}
            >
              {showPassword ? <span><i className="bi bi-eye-slash"></i> Hide Password</span> : <span><i className="bi bi-eye"></i> Show Password</span>}
            </button>

            <input
              type={showPassword ? "text" : "password"}
              className={`form-control border custom-input border-2 mt-2 ${errors.password ? 'is-invalid' : ''}`}
              style={{ width: "16rem", borderColor: "#d1d5db" }}
              placeholder="Enter your Password"
              {...register("password", {
                required: true,
                validate: {
                  minLength: (value) =>
                    value.length >= 8 ||
                    "Password must be at least 8 characters long",
                  hasUpper: (value) =>
                    /[A-Z]/.test(value) ||
                    "Must contain at least one uppercase letter",
                  hasLower: (value) =>
                    /[a-z]/.test(value) ||
                    "Must contain at least one lowercase letter",
                  hasNumber: (value) =>
                    /\d/.test(value) || "Must contain at least one number",
                  hasSpecial: (value) =>
                    /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]/.test(value) ||
                    "Must contain at least one special character",
                },
              })}
            />
          </div>

          {errors.password && (
            <div className="invalid-feedback text-center">{errors.password.message as string}</div>
          )}

          <button
            type="submit"
            className="btn text-white fw-semibold mt-4 "
            style={{ backgroundColor: "#c2410c", width: "6rem" }}
          >
            Sign In
          </button>
        </form>

        <p className="mt-3">
          Don’t have an account?{" "}
          <Link to="/register">
            <span style={{ color: "#c2410c", cursor: "pointer" }}>Register</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
