import { Navbar, Container, } from "react-bootstrap";

function HomeNav() {
  return (
    <Navbar expand="lg" bg="light" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center fw-bold text-dark">
          <img
            src="/Quiz-2025-logo.png"
            alt="Logo"
            width="40"
            height="40"
            className="me-2 rounded-circle"
          />
          Vivekananda Quiz 2025
        </Navbar.Brand>

      </Container>
    </Navbar>
  );
}

export default HomeNav;
