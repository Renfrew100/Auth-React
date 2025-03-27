import React from "react";
import { Card } from "react-bootstrap";

function UserInfo({ user }) {
  if (!user) {
    return (
      <Card className="p-3 text-center">
        <Card.Body>
          <Card.Title>Not Logged In</Card.Title>
          <Card.Text>Please log in to see your profile details.</Card.Text>
        </Card.Body>

        <Card.Body>
          <Card.Title>Logged In</Card.Title>
          <Card.Text>You are currently logged in</Card.Text>
        </Card.Body>
      </Card>
      
    );
  }

  return (
    <Card className="p-3 text-center">
      <Card.Img
        variant="top"
        src={user.profile_picture}
        alt="User Avatar"
        style={{ width: "100px", height: "100px", borderRadius: "50%", margin: "auto" }}
      />
      <Card.Body>
        <Card.Title>{user.name}</Card.Title>
        <Card.Text>{user.email}</Card.Text>
        <Card.Text>{user.phone}</Card.Text>
        <Card.Text>{user.address}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserInfo;
