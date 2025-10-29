import ParticipantTable from "../../features/participants/ParticipantTable";
import { useParticipantsData } from "../../hooks/useParticipants";

export default function ParticipantTablePage() {
  const { data, isLoading } = useParticipantsData();
  const participants = data?.data ?? [];

  if (isLoading) return <div>Loading...</div>;

  return <ParticipantTable participantsData={participants} />;
}
