import ParticipantTable from "../../features/participants/ParticipantTable";
import { useParticipantsData } from "../../hooks/useParticipants";

const InactivePage = () => {
  const { data, isLoading } = useParticipantsData();
  const participants = data?.data ?? [];
  const inactiveParticipants = participants.filter(
    (p) => p.status === "inactive"
  );

  if (isLoading) return <div>Loading...</div>;

  return <ParticipantTable participantsData={inactiveParticipants} />;
};

export default InactivePage;
