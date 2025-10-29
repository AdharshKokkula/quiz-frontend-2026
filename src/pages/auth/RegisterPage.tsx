import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthClient } from "../../services/api";
import { message } from "antd";



interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

const RegisterPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()

    const onSubmit = async (data: FormData) => {
        try {
            const res = await AuthClient.register(data);
            if (!res || res.status !== 201) {
                console.log('Registration failed', res);
                message.error('Registration failed');
                return;
            }
            console.log('form res', res);
            message.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "status" in error) {
                const err = error as { status?: number; message?: string };
                if (err.status === 400) {
                    setError("email", {
                        type: "manual",
                        message: "User already exists. Please use a different email.",
                    });
                }
            } else {
                console.error('Error during registration', error);
                message.error('An error occurred during registration');
            }
        }

    };

    const onError = (errs: any) => {
        console.log('validation errors', errs);
    };

    return (
        <div>
            <div className="d-flex flex-column align-items-center p-4 mt-3 gap-3">
                <div className="mb-3">
                    <img
                        className="rounded"
                        width="100"
                        height="100"
                        src="/Quiz-2025-logo.png"
                        alt="Logo not found"
                    />
                </div>

                <h2 className="fw-bold text-center font-monospace">User Registration</h2>

                <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="d-flex flex-column align-items-center w-100"
                    style={{ maxWidth: "350px" }}
                >
                    <input
                        type="text"
                        className={`form-control border custom-input border-2 mt-2 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter your name"
                        {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">{errors.name.message}</div>
                    )}

                    <input
                        type="text"
                        className={`form-control mt-3 border custom-input border-2 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter your email"
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
                        <div className="invalid-feedback">{errors.email.message}</div>
                    )}

                    <input
                        type="text"
                        className={`form-control mt-3 border custom-input border-2 ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="Enter your mobile number"
                        {...register("phone", {
                            required: true,
                            pattern: {
                                value: /^\d{10}$/,
                                message: "Invalid phone number",
                            },
                        })}
                    />
                    {errors.phone && (
                        <div className="invalid-feedback">{errors.phone.message}</div>
                    )}

                    <div className="mt-3 w-100">
                        <div className="text-end mb-1">
                            <i className="fa-regular fa-eye"></i>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-0 border-0 bg-transparent fw-semibold align-self-end"

                                style={{ color: "#c2410c", fontSize: '0.8rem' }}
                            >
                                {showPassword ? <span><i className="bi bi-eye-slash"></i> Hide Password</span> : <span><i className="bi bi-eye"></i> Show Password</span>}
                            </button>
                        </div>

                        <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control border custom-input border-2 ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Enter your password"
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
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn text-white fw-semibold mt-4 "
                        style={{ backgroundColor: "#c2410c", width: '6rem' }}

                    >
                        Register
                    </button>
                </form>

                <div className="mt-3">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            <span className="text-primary" style={{ cursor: "pointer" }}>
                                Log In
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
