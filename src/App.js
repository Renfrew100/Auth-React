import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import PostComposer from "./components/PostComposer";
import PostFeed from "./components/PostFeed";
import UserInfo from "./components/UserInfo";
import { Container, Row, Col } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [refreshPosts, setRefreshPosts] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      fetchUser(token);
      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) fetchUser(storedToken);
    }
  }, [location]);

  const fetchUser = (token) => {
    fetch("http://localhost:5000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div>
      <AppNavbar user={user} handleLogout={handleLogout} />
      <Container className="mt-4">
        <Row>
          <Col md={8}>
            {user && <PostComposer user={user} onPostCreated={() => setRefreshPosts(!refreshPosts)} />}
            <PostFeed user={user} refresh={refreshPosts} />
          </Col>
          <Col md={4}>
            <UserInfo user={user} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
