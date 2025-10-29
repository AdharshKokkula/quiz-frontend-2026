import logo from "../../assets/KEl.png";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Props {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: Props) {
  return (
    <header>
      <nav
        className="navbar navbar-dark bg-dark shadow p-2 flex-md-nowrap"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          boxSizing: "border-box",
          zIndex: 1030,
          overflow: "hidden",
        }}
      >
        <div className="container-fluid d-flex align-items-center justify-content-between px-2">
          <a className="navbar-brand d-flex align-items-center me-2">
            <img src={logo} height="40" className="me-2" alt="Logo" />
            <span className="d-none d-sm-inline">QUIZ 2025 Admin Panel</span>
          </a>

          <button
            type="button"
            className="text-white fs-2 border-0 bg-transparent d-md-none"
            aria-label="Toggle navigation"
            onClick={onToggleSidebar}
            style={{ marginLeft: "auto" }}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </nav>
      <div style={{ height: "56px" }} />
    </header>
  );
}
