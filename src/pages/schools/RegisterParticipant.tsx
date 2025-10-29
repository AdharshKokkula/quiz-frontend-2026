import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateParticipant } from "../../hooks/useParticipants";
import { useSchools } from "../../hooks/useSchools";
import { slugify } from "../../utils/slugify";
import type { School } from "../../services/api/clients/schoolClient";

type FormData = {
  name: string;
  dob: string;
  classGrade: string;
  fatherName: string;
  email: string;
  phone: string;
};

const RegisterParticipant: React.FC = () => {
  const navigate = useNavigate();
  const { schoolSlug } = useParams<{ schoolSlug: string }>(); // <-- read slug
  const { data: schools, isLoading: isSchoolsLoading, isError: isSchoolsError } =
    useSchools(); // <-- fetch all schools to resolve slug -> _id

  // Find school by slugified name
  const school: School | undefined = React.useMemo(() => {
    if (!schools || !schoolSlug) return undefined;
    return (schools as School[]).find((s) => slugify(s.name) === schoolSlug);
  }, [schools, schoolSlug]);

  const resolvedSchoolId = school?._id ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const { mutate: createParticipant, isPending } = useCreateParticipant();

  const onSubmit = (data: FormData) => {
    // block submit if we couldn't resolve the school
    if (!resolvedSchoolId) {
      alert(
        "❌ Could not determine the school from the URL. Please open the registration from the school's page or contact admin."
      );
      return;
    }

    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;

    const payload = {
      name: data.name.trim(),
      dob: data.dob,
      fatherName: data.fatherName.trim(),
      class: data.classGrade,
      school: resolvedSchoolId, // <-- send resolved _id here
      homeTown: (school?.city ?? "").trim() || "Unknown",
      type: "individual",
      email: data.email.trim(),
      phone: data.phone.trim(),
      verifiedBy: user?.id || "",
    };

    console.log("Final payload to send:", payload);

    createParticipant(payload, {
      onSuccess: () => {
        alert("✅ Participant registered successfully!");
        reset();
        navigate(-1);
      },
      onError: (err: any) => {
        console.error("❌ Error registering participant:", err);
        if (err?.response?.data?.message) {
          alert(`❌ ${err.response.data.message}`);
        } else {
          alert("❌ Failed to register participant. Please try again.");
        }
      },
    });
  };

  if (isSchoolsLoading) return <p className="text-center mt-5">Loading school info...</p>;
  if (isSchoolsError)
    return <p className="text-center text-danger mt-5">❌ Failed to load school list.</p>;
  if (!school)
    return (
      <p className="text-center text-danger mt-5">
        ❌ School not found for the provided URL. Make sure you navigated from the school's page.
      </p>
    );

  return (
    <div className="container-fluid p-0 min-vh-70">
      <div className="px-4">
        <h2 className="display-6 fw-semibold mb-2">School Wise Registration</h2>
        <h5 className="fw-semibold text-dark mb-4">Register Participant</h5>

        <form onSubmit={handleSubmit(onSubmit)} className="p-3 mt-2 container-fluid">
          {/* Row 1 - School Info */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-bold">School</label>
              <input
                type="text"
                className="form-control"
                value={school?.name ?? ""}
                disabled
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">City</label>
              <input
                type="text"
                className="form-control"
                value={school?.city ?? ""}
                disabled
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              />
            </div>
          </div>

          {/* Row 2 - Name + DOB */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-bold">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                {...register("name", {
                  required: "Name can't be empty",
                  minLength: {
                    value: 6,
                    message: "Name can't be less than 6 characters",
                  },
                })}
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Date of Birth</label>
              <input
                type="date"
                className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                {...register("dob", {
                  required: "DOB can't be empty",
                  validate: (val: string) => {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return "Invalid date format (yyyy-mm-dd)";
                    const year = parseInt(val.split("-")[0], 10);
                    if (isNaN(year)) return "Invalid date format (yyyy-mm-dd)";
                    if (year < 2005 || year > 2015) return "Birth year must be between 2005–2015";
                    return true;
                  },
                })}
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              />
              {errors.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
            </div>
          </div>

          {/* Row 3 - Class + Father's Name */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-bold">Class</label>
              <select
                className={`form-select ${errors.classGrade ? "is-invalid" : ""}`}
                {...register("classGrade", {
                  validate: (val: string) => {
                    const num = parseInt(val as any, 10);
                    if (isNaN(num)) return "Class must be a number";
                    if (num < 5 || num > 10) return "Class not allowed (5–10 only)";
                    return true;
                  },
                })}
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              >
                <option value="">Select your Class/Grade</option>
                {[5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={`${n}`}>
                    {n}
                  </option>
                ))}
              </select>
              {errors.classGrade && <div className="invalid-feedback">{errors.classGrade.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Father's Name</label>
              <input
                type="text"
                className={`form-control ${errors.fatherName ? "is-invalid" : ""}`}
                {...register("fatherName", {
                  required: "Father Name can't be empty",
                  minLength: {
                    value: 6,
                    message: "Father Name can't be less than 6 characters",
                  },
                })}
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              />
              {errors.fatherName && <div className="invalid-feedback">{errors.fatherName.message}</div>}
            </div>
          </div>

          {/* Row 4 - Email + Phone */}
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-bold">Participant Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email", {
                  required: "Email can't be empty",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                {...register("phone", {
                  required: "Phone can't be empty",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number",
                  },
                })}
                style={{ height: "48px", fontSize: "1rem", width: "100%" }}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-start gap-3 mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              style={{ fontSize: "1rem", height: "44px", padding: "0 18px" }}
            >
              Back
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
              style={{ fontSize: "1rem", height: "44px", padding: "0 22px" }}
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterParticipant;
