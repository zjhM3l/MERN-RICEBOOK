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
  Snackbar,
} from "@mui/material"; // Add Snackbar for success notification
import DeleteIcon from "@mui/icons-material/Delete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import API_BASE_URL from "../config/config";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});

export const Edit = ({ post, onClose, onEditSuccess }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success notification

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleEdit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }

    const postData = { title, content };

    try {
      setUploading(true);
      const res = await fetch(`${API_BASE_URL}/user/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      const data = await res.json();
      setSuccessMessage("Post updated successfully!"); // Show success message
      onEditSuccess(data); // Pass updated post to parent
      setTimeout(() => {
        onClose(); // Close the modal after a short delay
      }, 1500);
    } catch (error) {
      console.error("Failed to update post:", error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
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
              onChange={handleContentChange}
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
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              disabled={!title || !content || uploading}
              onClick={handleEdit}
              variant="contained"
              sx={{ flex: 2 }}
            >
              Edit
            </Button>
          </Stack>
        </Box>
      </StyledModal>
      {/* Snackbar for success message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />
    </>
  );
};
