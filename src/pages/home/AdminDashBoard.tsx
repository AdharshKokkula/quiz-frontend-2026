import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUsers,
  FaSchool,
  FaUserCheck,
  FaExclamationTriangle,
  FaUserTimes,
  FaUser,
  FaMedal,
} from "react-icons/fa";
import Clock from "./Clock";
import { useUserStore } from "../../store/useUserStore";
import { Alert } from "react-bootstrap"; // ✅ Import Bootstrap Alert

const AdminDashboard: React.FC = () => {
  const { role, status } = useUserStore();

  if (status === "pending") {
    return (
      <div className="container d-flex flex-column align-items-center mt-5">
        <h2 className="fw-bold mb-4 text-dark">Account Under Review</h2>
        <Alert variant="warning" className="w-75 text-center">
          <FaExclamationTriangle className="me-2" />
          Please wait for a while for your account to be approved.
        </Alert>
      </div>
    );
  }


  const verifiedData = [
    { name: "Pending", value: 1608 },
    { name: "Verified", value: 1 },
  ];

  const individualData = [
    { name: "Individual", value: 1373 },
    { name: "School", value: 236 },
  ];

  const categoryData = [
    { name: "Seniors", value: 109 },
    { name: "Juniors", value: 81 },
    { name: "Masters", value: 198 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const stats = [
    {
      label: "ALL USERS",
      value: "",
      icon: <FaUsers size={28} />,
      borderColor: "black",
      color: "text-dark",
    },
    {
      label: "ALL SCHOOLS",
      value: "39",
      icon: <FaSchool size={28} />,
      borderColor: "gray",
      color: "text-secondary",
    },
    {
      label: "ALL PARTICIPANTS",
      value: "1609",
      icon: <FaUser size={28} />,
      borderColor: "#007bff",
      color: "text-primary",
    },
    {
      label: "VERIFIED PARTICIPANTS",
      value: "1",
      icon: <FaUserCheck size={28} />,
      borderColor: "green",
      color: "text-success",
    },
    {
      label: "PENDING PARTICIPANTS",
      value: "1608",
      icon: <FaExclamationTriangle size={28} />,
      borderColor: "#ffc107",
      color: "text-warning",
    },
    {
      label: "INACTIVE",
      value: "1",
      icon: <FaUserTimes size={28} />,
      borderColor: "red",
      color: "text-danger",
    },
    {
      label: "RESULTS",
      value: "",
      icon: <FaMedal size={28} />,
      borderColor: "gray",
      color: "text-secondary",
    },
  ];

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-center mb-4">
        <Clock />
      </h2>

      {/* Charts Section */}
      {(role === "admin" || role === "moderator") && (
        <div className="row mb-5">
          <div className="col-md-4 d-flex flex-column align-items-center">
            <h5 className="fw-bold mb-3">Verified Vs Pending</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={verifiedData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                  dataKey="value"
                >
                  {verifiedData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="col-md-4 d-flex flex-column align-items-center">
            <h5 className="fw-bold mb-3">Categories</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#9c27b0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-md-4 d-flex flex-column align-items-center">
            <h5 className="fw-bold mb-3">Individual Vs School</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={individualData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                  dataKey="value"
                >
                  {individualData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="row g-3 mt-5 justify-content-center">
        {stats.map((item, index) => (
          (role === "admin" ||
            (role === "moderator" && item.label !== "ALL USERS") ||
            (role === "user" && item.label === "ALL SCHOOLS") ||
            (role === "coordinator" && item.label === "ALL SCHOOLS")) && (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <div
                className="card shadow-sm border-1 p-3 d-flex flex-column justify-content-between"
                style={{
                  borderLeft: `5px solid ${item.borderColor}`,
                  borderRadius: "10px",
                  minHeight: "130px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className={`fw-bold ${item.color} mb-0`}>
                    {item.label}
                  </h6>
                  <span className={`${item.color}`}>{item.icon}</span>
                </div>
                <h3 className="fw-bold text-dark mt-2">{item.value || "-"}</h3>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
