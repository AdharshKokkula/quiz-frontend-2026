import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  useParticipantById,
  useUpdateParticipant,
} from "../../hooks/useParticipants";

interface ParticipantForm {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  class?: string;
  school?: string;
  homeTown?: string;
  fatherName?: string;
  type?: "individual" | "school";
  status?: "pending" | "verified" | "inactive";
}

const EditParticipant: React.FC = () => {
  const { participantId } = useParams<{ participantId: string }>();
  const navigate = useNavigate();

  const { data: participant, isLoading } = useParticipantById(participantId);
  const { mutate: updateParticipant, isPending } = useUpdateParticipant();

  const { handleSubmit, control, reset } = useForm<ParticipantForm>();

  useEffect(() => {
    if (participant) {
      reset({
        name: participant.name ?? "",
        email: participant.email ?? "",
        phone: participant.phone ?? "",
        dob: participant.dob
          ? new Date(participant.dob).toISOString().split("T")[0]
          : "",
        class: participant.class ?? "",
        school: participant.school ?? "",
        homeTown: participant.homeTown ?? "",
        fatherName: participant.fatherName ?? "",
        type: participant.type as "individual" | "school",
        status: participant.status as "pending" | "verified" | "inactive",
      });
    }
  }, [participant, reset]);

  const onSubmit = (data: ParticipantForm) => {
    if (!participantId) return;

    // Only include fields that are not empty
    const filteredData: Partial<ParticipantForm> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        filteredData[key as keyof ParticipantForm] = value;
      }
    });

    updateParticipant(
      { participantId, data: filteredData },
      {
        onSuccess: () => {
          alert("Participant updated successfully!");
          navigate("/participants/all");
        },
      }
    );
  };

  if (isLoading) return <div className="p-4">Loading participant info...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">Edit Participant - {participant?.participantId}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input className="form-control" {...field} />
            )}
          />
        </div>

        {/* Email */}
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input className="form-control" {...field} />
            )}
          />
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input className="form-control" {...field} />
            )}
          />
        </div>

        {/* Date of Birth */}
        <div className="col-md-6">
          <label className="form-label">Date of Birth</label>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <input type="date" className="form-control" {...field} />
            )}
          />
        </div>

        {/* Class */}
        <div className="col-md-6">
          <label className="form-label">Class</label>
          <Controller
            name="class"
            control={control}
            render={({ field }) => (
              <input className="form-control" {...field} />
            )}
          />
        </div>

        {/* School */}
        <div className="col-md-6">
          <label className="form-label">School</label>
          <Controller
            name="school"
            control={control}
            render={({ field }) => (
              <input className="form-control" {...field} />
            )}
          />
        </div>

        {/* Home Town */}
        <div className="col-md-6">
          <label className="form-label">Home Town</label>
          <Controller
            name="homeTown"
            control={control}
            render={({ field }) => (
              <input className="form-control" {...field} />
            )}
          />
        </div>

        {/* Father's Name */}
        <div className="col-md-6">
          <label className="form-label">Father's Name</label>
          <Controller
            name="fatherName"
            control={control}
            render={({ field }) => (
              <input className="form-control" {...field} />
            )}
          />
        </div>

        {/* Type */}
        <div className="col-md-6">
          <label className="form-label">Type</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select className="form-select" {...field}>
                <option value="individual">Individual</option>
                <option value="school">School</option>
              </select>
            )}
          />
        </div>

        {/* Status */}
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <select className="form-select" {...field}>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          />
        </div>

        <div className="col-12 mt-3">
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
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditParticipant;
