import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

function PostComposer({ user, onPostCreated }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); 
    setImages((prevImages) => [...prevImages, ...files]); 
};


  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return alert("Post cannot be empty!");

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("content", content);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    const response = await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      setContent("");
      setImages([]);
      onPostCreated(); // Refresh post feed
    } else {
      console.error("Failed to create post");
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Form onSubmit={handlePostSubmit}>
          <Form.Group controlId="postContent">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          {/* Image Upload */}
          <Form.Group controlId="postImages" className="mt-2">
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>
          <div className="image-preview">
    {images.map((file, index) => (
        <img
            key={index}
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="preview-image"
            style={{ width: "100px", height: "100px", margin: "5px" }}
        />
    ))}
</div>


          <Button type="submit" variant="primary" className="mt-2">
            Post
          </Button>
          
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PostComposer;