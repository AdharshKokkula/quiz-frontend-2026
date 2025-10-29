import React, { useMemo, useState } from "react";
import Select, { type MultiValue } from "react-select";
import {
  useBulkUpdateParticipants,
  useParticipantsData,
} from "../../hooks/useParticipants";
import { useSchools } from "../../hooks/useSchools";
import { type Participant } from "../../services/api/clients/participantsClient";

type Option = { value: string; label: string };

export default function BulkUpdate() {
  const [selectedSchools, setSelectedSchools] = useState<MultiValue<Option>>(
    []
  );
  const [selectedClasses, setSelectedClasses] = useState<MultiValue<Option>>(
    []
  );
  const [selectedParticipants, setSelectedParticipants] = useState<
    MultiValue<Option>
  >([]);
  const [status, setStatus] = useState<string>("");

  const { data: participantsResponse, isLoading: loadingParticipants } =
    useParticipantsData();
  const { data: schoolsResponse, isLoading: loadingSchools } = useSchools();
  const { mutateAsync: bulkUpdate, isPending: updating } =
    useBulkUpdateParticipants();

  const schoolOptions: Option[] = useMemo(() => {
    if (!schoolsResponse) return [];
    return schoolsResponse.map((s) => ({
      value: s.name.trim(),
      label: `${s.name}, ${s.city}`,
    }));
  }, [schoolsResponse]);

  // Fixed: Only show classes 5-10
  const classOptions: Option[] = useMemo(() => {
    return [5, 6, 7, 8, 9, 10].map((c) => ({
      value: String(c),
      label: `Class ${c}`,
    }));
  }, []);

  const filteredParticipants: Participant[] = useMemo(() => {
    if (!participantsResponse?.data) return [];
    return participantsResponse.data.filter((p) => {
      const schoolMatch =
        selectedSchools.length === 0 ||
        selectedSchools.some(
          (s) => s.value.toLowerCase() === (p.school ?? "").trim().toLowerCase()
        );
      const classMatch =
        selectedClasses.length === 0 ||
        selectedClasses.some((c) => c.value === String(p.class));
      return schoolMatch && classMatch;
    });
  }, [participantsResponse, selectedSchools, selectedClasses]);

  const participantOptions: Option[] = useMemo(
    () =>
      filteredParticipants.map((p) => ({
        value: p.participantId,
        label: `${p.participantId} (${p.name}) - ${p.status}`,
      })),
    [filteredParticipants]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!status) return alert("Please select a status");
    if (!selectedParticipants.length)
      return alert("Please select at least one participant");

    const payload = {
      participants: selectedParticipants.map((p) => ({
        participantId: p.value,
        status,
      })),
    };

    try {
      console.log("Sending payload:", payload);
      await bulkUpdate(payload);
      alert("Participants updated successfully!");
      setSelectedParticipants([]);
      setStatus("");
    } catch (err) {
      console.error("Bulk update error:", err);
      alert("Failed to update participants");
    }
  }

  if (loadingParticipants || loadingSchools)
    return <div className="p-4 text-center">Loading data...</div>;

  return (
    <div className="px-md-4">
      <h1 className="h2 mb-4">Bulk Update Participants</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-4 mb-3">
            <label className="form-label">Select School</label>
            <Select
              isMulti
              options={schoolOptions}
              value={selectedSchools}
              onChange={setSelectedSchools}
              placeholder="Select schools..."
              closeMenuOnSelect={false}
            />
          </div>
          <div className="col-sm-4 mb-3">
            <label className="form-label">Select Class</label>
            <Select
              isMulti
              options={classOptions}
              value={selectedClasses}
              onChange={setSelectedClasses}
              placeholder="Select classes..."
              closeMenuOnSelect={false}
            />
          </div>
          <div className="col-sm-4 mb-3">
            <label className="form-label">Select Participants</label>
            <Select
              isMulti
              options={participantOptions}
              value={selectedParticipants}
              onChange={setSelectedParticipants}
              placeholder="Select participants..."
              closeMenuOnSelect={false}
            />
          </div>
          <div className="col-sm-4 mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="col-sm-12 mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updating}
            >
              {updating ? "Updating..." : "Bulk Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
