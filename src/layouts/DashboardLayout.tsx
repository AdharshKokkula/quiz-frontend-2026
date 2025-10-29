import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOptions, setAuthOptions] = useState(false);

  const onAuthOptionsClick = () => {
    setAuthOptions(!authOptions);
  };

  // This will close the mobile sidebar AND the auth menu
  const handleSidebarHide = () => {
    setSidebarOpen(false);
    setAuthOptions(false);
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <Header onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          show={sidebarOpen}
          authOptions={authOptions} // <-- PASS THE STATE DOWN
          onAuthOptionsClick={onAuthOptionsClick}
          onHide={handleSidebarHide} // <-- USE THE NEW HANDLER
        />

        {/* Main content */}
        <main
          className="flex-grow-1 p-3 overflow-auto"
          style={{ minHeight: 0 }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}