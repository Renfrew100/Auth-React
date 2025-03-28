import React from "react";
import { Navbar, Container, Nav, Image, Button } from "react-bootstrap";

function AppNavbar({ user, handleLogout }) {
  return (
    <Navbar bg="primary" variant="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">Bluestrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {user ? (
              <>
                <Image
                  src={user.profile_picture || "https://via.placeholder.com/40"}
                  roundedCircle
                  width="120"
                  height="120"
                  className="me-2"
                />
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : 
              <Button
                variant="dark"
                onClick={() => (window.location.href = "http://localhost:5000/auth/google")}
              >
                Authentication
              </Button>
              }
              <Button
                variant="dark"
                onClick={() => (window.location.href = "http://localhost:5000/auth/google")}
              >
                Login with Google
              </Button>
              
              <Button
                variant="dark"
                onClick={() => (window.location.href = "http://localhost:5000/auth/google")}
              >
                Logout with Google
              </Button>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
