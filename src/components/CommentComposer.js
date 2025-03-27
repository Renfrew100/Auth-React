import React, { useState, useEffect } from "react";
import { Image, Form, Button } from "react-bootstrap";

function CommentComposer({ postId, user }) { 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://127.0.0.1:5000/comments/post/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch comments");

        const data = await response.json();
        setComments(data);

        data.forEach((comment) => {
          if (comment.id) {
            fetchLikeCount(comment.id);
          }
        });

      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();
  }, [postId]);

  const fetchLikeCount = async (commentId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/comments/${commentId}/count`);
      if (!res.ok) throw new Error("Failed to fetch like count");
      const data = await res.json(); 
      setLikeCounts((prev) => ({ ...prev, [commentId]: data.likeCount }));
    } catch (error) {
      console.error("Failed to fetch like count:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (!newComment.trim() || !user) return; 

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://127.0.0.1:5000/comments/post/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          content: newComment, 
          userId: user.id, 
        }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const newCommentData = await response.json();

      setComments([...comments, { 
        ...newCommentData, 
        User: { name: user.name, profile_picture: user.profile_picture }
      }]); 

      if (newCommentData.id) {
        setLikeCounts((prev) => ({ ...prev, [newCommentData.id]: 0 }));
      }

      setNewComment("");

    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error("Failed to like comment");
      fetchLikeCount(commentId);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {/* Comment Input */}
      <Form className="mt-3 mb-3 d-flex" onSubmit={handleSubmit}>
        <Form.Control
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="me-2 flex-grow-1"
          style={{ height: "45px" }}
        />
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      {/* Comment List */}
      {comments.map((comment) => {
  const profileUrl = comment.User?.profile_picture || "/default-avatar.png";
  const userName = comment.User?.name || "Unknown";
  
  // Format timestamp
  const formattedTime = new Date(comment.createdAt).toLocaleString();

  return (
    <div key={comment.id}
      style={{
        border: "1px solid #ccc",
        marginBottom: "8px",
        padding: "8px",
        borderRadius: "5px",
      }}
    >
      {/* User Info */}
      <div className="d-flex align-items-center">
        <Image
          src={profileUrl}
          roundedCircle
          width={30}
          height={30}
          className="me-2"
          alt="comment profile"
        />
        <strong>{userName}</strong>
      </div>

      {/* Comment Content & Timestamp */}
      <div className="d-flex align-items-center justify-content-between" style={{ marginLeft: "35px" }}>
        <p className="mb-0" style={{ marginRight: "10px" }}>{comment.content}</p>
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleLike(comment.id)}
            style={{marginRight:"10px"}}
          >
            👍 Like{" "}
            {likeCounts[comment.id] !== undefined ? likeCounts[comment.id] : ""}
          </Button>
          <small className="text-muted me-2">
            {formattedTime}
          </small>
        </div>
      </div>
    </div>
  );
})}

    </div>
  );
}

export default CommentComposer;
