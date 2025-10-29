import { useNavigate, useLocation } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import clsx from "clsx";
import { useSchoolStats } from "../../hooks/useSchools";
import { useParticipantsData } from "../../hooks/useParticipants";
import { useUserStats, useDeletedUsers } from "../../hooks/useUsers";
import { useUserStore } from "../../store/useUserStore";
import { useAuthStore } from "../../store/useAuth";
import Cookies from "js-cookie";

type Counts = {
  schoolCount: number;
  participantsCount: number;
  verifiedCount: number;
  pendingCount: number;
  inactiveCount: number;
  usersCount: number;
  deletedUsersCount: number;
};

type Props = {
  show: boolean;
  onHide: () => void;
  onAuthOptionsClick: () => void;
  authOptions: boolean;
};

export default function Sidebar({
  show,
  onHide,
  onAuthOptionsClick,
  authOptions,
}: Props) {
  const { data: schoolData } = useSchoolStats();
  const schoolCount = schoolData?.total ?? 0;

  const { data: participantsData } = useParticipantsData();
  const totalParticipants = participantsData?.total ?? 0;
  const verifiedParticipants = participantsData?.data.filter(
    (p) => p.status === "verified"
  ).length;
  const pendingParticipants = participantsData?.data.filter(
    (p) => p.status === "pending"
  ).length;
  const inactiveParticipants = participantsData?.data.filter(
    (p) => p.status === "inactive"
  ).length;

  const { data: userStats } = useUserStats();
  const { data: deletedUsersData } = useDeletedUsers({ page: 1, limit: 1 });

  const counts: Counts = {
    schoolCount,
    participantsCount: totalParticipants,
    verifiedCount: verifiedParticipants,
    pendingCount: pendingParticipants,
    inactiveCount: inactiveParticipants,
    usersCount: userStats?.total || 0,
    deletedUsersCount: deletedUsersData?.pagination?.total || 0,
  };

  return (
    <>
      {/* Mobile Offcanvas */}
      <Offcanvas
        show={show}
        onHide={onHide}
        className="bg-light d-md-none"
        placement="start"
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <SidebarContent
            counts={counts}
            onItemClick={onHide}
            authOptions={authOptions}
            onAuthOptionsClick={onAuthOptionsClick}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
      <aside
        style={{
          position: "sticky",
          top: 0,
          height: "100%",
          overflowY: "auto",
        }}
        className="col-md-3 col-lg-2 bg-light sidebar d-none d-md-flex flex-column flex-shrink-0 p-3 border-end"
      >
        <SidebarContent
          counts={counts}
          authOptions={authOptions}
          onAuthOptionsClick={onAuthOptionsClick}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  counts,
  onItemClick,
  authOptions,
  onAuthOptionsClick,
}: {
  counts: Counts;
  onItemClick?: () => void;
  authOptions: boolean;
  onAuthOptionsClick: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore()
  const role = useUserStore((s) => s.role);
  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Guest";

  const closeIfMobile = () => onItemClick?.();
  const goTo = (path: string) => {
    navigate(path);
    closeIfMobile();
  };
  const isActive = (path: string) => location.pathname === path;

  const allowed = (allowedRoles?: string[]) => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return role && allowedRoles.includes(role);
  };

  const onLogout = () => {
    Cookies.remove("token");
    logout();
    onAuthOptionsClick()
    navigate("/login");
  }
  const onChangePass = () =>{
       onAuthOptionsClick()
      navigate("/admin/user/password")
  }

  return (
    <div className="flex-grow-1">
      {/* Header */}
      <div className="d-flex flex-row align-items-center justify-content-between mb-1 mt-2">
        <div className="d-flex justify-content-center align-items-center gap-1">
          <i className="bi bi-person-circle fs-5 text-dark" />
          <strong className="fs-5 text-dark">{roleLabel}</strong>
        </div>

        {/* auth-options Button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={onAuthOptionsClick} 
            className="btn btn-link text-dark bi bi-three-dots-vertical fs-5 p-0"
          />

          {/* ADD THE AUTH DROPDOWN MENU */}
          {authOptions && (
            <div
              className="card shadow-sm py-1"
              style={{
                position: "absolute",
                top: "100%", // Position below the button
                right: 0, // Align to the right
                width: "200px",
                minWidth: "180px",
                zIndex: 10,
                backgroundColor: "white",
              }}
            >
              <ul className="list-unstyled mb-0">
                <li>
                  <button
                  onClick={()=> onChangePass()}
                   className="btn btn-link text-dark d-flex align-items-center gap-2 w-100 text-decoration-none px-3 py-2">
                    <i className="bi bi-key" />
                    <span >Change Password</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onLogout()}
                    className="btn btn-link text-danger d-flex align-items-center gap-2 w-100 text-decoration-none px-3 py-2">
                    <i className="bi bi-box-arrow-right" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <hr />

      <ul className="nav flex-column text-dark">
        {allowed(["admin", "moderator", "coordinator", "user"]) && (
          <SidebarItem
            label="Home"
            icon="bi-house-door"
            active={isActive("/admin")}
            onClick={() => goTo("/admin")}
          />
        )}

        <hr />

        <strong className="ms-3 mt-2 mb-1 text-dark">Schools</strong>
        {allowed(["admin", "moderator", "coordinator", "user"]) && (
          <SidebarItem
            label="All Schools"
            icon="bi-bank2"
            active={isActive("/schools")}
            onClick={() => goTo("/schools")}
            badge={counts.schoolCount}
          />
        )}
        {allowed(["admin"]) && (
          <SidebarItem
            label="Import"
            icon="bi bi-upload"
            active={isActive("/admin/bulk")}
            onClick={() => goTo("/admin/bulk")}
          />
        )}
        {allowed(["admin"]) && (
          <SidebarItem
            label="Bulk Update"
            icon="bi-send"
            active={isActive("/bulk-update")}
            onClick={() => goTo("/bulk-update")}
          />
        )}

        <hr />

      {(role=="admin" || role==="moderator")&&
       (<strong className="ms-3 mt-2 mb-1 text-dark">Participants</strong>)}  
        {allowed(["admin", "moderator"]) && (
          <SidebarItem
            label="All Participants"
            icon="bi-person-circle"
            active={isActive("/participants/all")}
            onClick={() => goTo("/participants/all")}
            badge={counts.participantsCount}
          />
        )}
        {allowed(["admin", "moderator"]) && (
          <SidebarItem
            label="Verified"
            icon="bi-patch-check-fill text-success"
            active={isActive("/participants/verified")}
            onClick={() => goTo("/participants/verified")}
            badge={counts.verifiedCount}
          />
        )}
        {allowed(["admin", "moderator"]) && (
          <SidebarItem
            label="Pending"
            icon="bi-exclamation-triangle-fill text-warning"
            active={isActive("/participants/pending")}
            onClick={() => goTo("/participants/pending")}
            badge={counts.pendingCount}
          />
        )}
        {allowed(["admin", "moderator"]) && (
          <SidebarItem
            label="Inactive"
            icon="bi-x-octagon-fill text-danger"
            active={isActive("/participants/inactive")}
            onClick={() => goTo("/participants/inactive")}
            badge={counts.inactiveCount}
          />
        )}

        <hr />
        {(role=="admin" || role==="moderator")&&
        (<strong className="ms-3 mt-2 mb-1 text-dark">Results</strong>)}
        {allowed(["admin"]) && (
          <SidebarItem
            label="All Results"
            icon="bi-award-fill"
            active={isActive("/results")}
            onClick={() => goTo("/results")}
          />
        )}
        {allowed(["admin"]) && (
          <SidebarItem
            label="Add Result"
            icon="bi-patch-plus-fill"
            active={isActive("/results/add")}
            onClick={() => goTo("/results/add")}
          />
        )}

        <hr />
       {(role=="admin" || role==="moderator")&&
        (<strong className="ms-3 mt-2 mb-1 text-dark">Users</strong>)}
        {allowed(["admin"]) && (
          <SidebarItem
            label="All Users"
            icon="bi-people-fill"
            active={isActive("/users")}
            onClick={() => goTo("/users")}
            badge={counts.usersCount}
          />
        )}
        {allowed(["admin"]) && (
          <SidebarItem
            label="Change Passwords"
            icon="bi-key-fill"
            active={isActive("/users/change-passwords")}
            onClick={() => goTo("/users/change-passwords")}
          />
        )}
        {allowed(["admin"]) && (
          <SidebarItem
            label="Deleted Users"
            icon="bi-x-octagon-fill text-danger"
            active={isActive("/users/deleted")}
            onClick={() => goTo("/users/deleted")}
            badge={counts.deletedUsersCount}
          />
        )}

        <hr />

        <strong className="ms-3 mt-2 mb-1 text-dark">Website</strong>
        <SidebarItem
          label="QUIZ 2025"
          icon="bi-globe"
          active={false}
          onClick={() => window.open("https://quiz2025.com", "_blank")}
        />
      </ul>
    </div>
  );
}

function SidebarItem({
  label,
  icon,
  badge,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <li>
      <button
        className={clsx(
          "nav-link text-start w-100 d-flex align-items-center gap-2 py-2",
          active ? "text-primary fw-semibold" : "text-dark"
        )}
        onClick={onClick}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <i className={`bi ${icon}`} />
        <span>{label}</span>
        {badge !== undefined && (
          <span
            className={clsx(
              "ms-auto badge",
              active ? "bg-primary" : "bg-secondary"
            )}
          >
            {badge}
          </span>
        )}
      </button>
    </li>
  );
}