import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Modal,
  Stack,
  styled,
  Typography,
  TextField,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CropFree from "@mui/icons-material/CropFree";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import API_BASE_URL from "../config/config";

// Styled modal for the post editing form
const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Box that displays the current user information
const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

export const Edit = ({ post, onClose, onEditSuccess }) => {
  const [title, setTitle] = useState(post.title); // Pre-fill with existing title
  const [content, setContent] = useState(post.content); // Pre-fill with existing content
  const [error, setError] = useState(null); // State to store error messages

  // Handle post editing logic
  const handleEdit = async () => {
    if (!title || !content) return; // Ensure title and content are filled

    const postData = { title, content };

    try {
      const res = await fetch(`${API_BASE_URL}/user/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      const data = await res.json();
      console.log("Post updated:", data);
      onEditSuccess(); // Notify success
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update post:", error);
      setError(error.message); // Display error message
    }
  };

  // Handle deleting the post
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/posts/${post._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete post");
      }

      console.log("Post deleted");
      onEditSuccess(); // Notify success
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to delete post:", error);
      setError(error.message); // Display error message
    }
  };

  return (
    <StyledModal
      open
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        width="80vw"
        maxWidth="90vw"
        maxHeight="90vh"
        bgcolor="background.default"
        color="text.primary"
        p={3}
        borderRadius={5}
        sx={{ overflowY: "auto" }}
      >
        <Typography variant="h6" color="gray" textAlign="center">
          Edit post
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <UserBox>
          <Avatar
            src={post.author?.profilePicture || ""}
            sx={{ width: 30, height: 30 }}
          />
          <Typography fontWeight={500} variant="span">
            {post.author?.username}
          </Typography>
        </UserBox>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ maxHeight: "65vh", overflowY: "auto", marginBottom: "10px" }}>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["image", "video"],
              ],
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "image",
              "video",
            ]}
            placeholder="Edit your post content..."
          />
        </Box>
        <Stack direction="row" gap={1} mt={2} justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{ flex: 1 }}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button
            disabled={!title || !content}
            onClick={handleEdit}
            variant="contained"
            sx={{ flex: 2 }}
          >
            Edit
          </Button>
        </Stack>
      </Box>
    </StyledModal>
  );
};