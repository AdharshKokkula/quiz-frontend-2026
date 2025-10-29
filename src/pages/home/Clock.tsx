import React, { useEffect, useState } from "react";

const Clock: React.FC = () => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // convert to 12-hour format

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
      setTime(formattedTime);
    };

    updateClock(); // show immediately
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center my-3">
      <i className="bi bi-clock fs-2 me-2 text-dark"></i>
      <h3 className="fw-bold mb-0 text-dark">{time}</h3>
    </div>
  );
};

export default Clock;
