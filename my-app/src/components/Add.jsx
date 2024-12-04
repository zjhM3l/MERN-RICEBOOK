import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Fab,
  Modal,
  Stack,
  styled,
  Tooltip,
  Typography,
  TextField,
  Alert,
} from "@mui/material"; // Importing Alert component
import AddIcon from "@mui/icons-material/Add";
import CropFree from "@mui/icons-material/CropFree";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { app } from "../firebase";
import API_BASE_URL from "../config/config";

// Styled modal for the post creation form
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

// Hidden file input for the cover image upload
const VisuallyHiddenInput = styled("input")({
  display: "none",
});

export const Add = ({ onPostSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null); // State to store cover image file
  const [uploading, setUploading] = useState(false); // Upload status
  const [error, setError] = useState(null); // State to store error messages
  const { currentUser } = useSelector((state) => state.user); // Get the current user

  // Toggles between expanded and normal view
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle changes in the text editor content
  const handleContentChange = (value) => {
    setContent(value);
  };

  // Handle file selection for cover image
  const handleFileChange = (e) => {
    setCover(e.target.files[0]); // Save the selected file
  };

  // Handle post creation logic
  const handlePost = async () => {
    if (!currentUser || !title || !content) return; // Ensure title and content are filled

    let coverUrl = null;

    // If a cover image is selected, upload it to Firebase Storage
    if (cover) {
      setUploading(true); // Set uploading state to true

      const storage = getStorage(app);
      const storageRef = ref(storage, `covers/${cover.name}-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, cover);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optionally add progress logic here
        },
        (error) => {
          console.error("Error uploading cover:", error);
          setUploading(false); // Set uploading state to false on failure
          setError("Failed to upload cover image.");
        },
        async () => {
          coverUrl = await getDownloadURL(uploadTask.snapshot.ref); // Get the download URL for the cover image
          setUploading(false); // Set uploading state to false on success
          createPostRequest(coverUrl); // Call the post creation logic with the uploaded cover URL
        }
      );
    } else {
      createPostRequest(null); // If no cover image, proceed with post creation without cover URL
    }
  };

  // Sends a request to create a post
  const createPostRequest = async (coverUrl) => {
    const postData = {
      title,
      content,
      author: currentUser._id, // Use current user's ID as the author
      cover: coverUrl, // Include cover URL if it exists
    };

    try {
      const res = await fetch(`${API_BASE_URL}/user/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData), // Send post data to the backend
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error("File too large. Please select a smaller file."); // Catch 413 file size error
        }
        throw new Error("Failed to create post");
      }

      const data = await res.json();
      console.log("Post created:", data);
      setOpen(false); // Close the modal
      setTitle(""); // Clear title input
      setContent(""); // Clear content input
      setCover(null); // Clear cover image
      setError(null); // Clear error message

      onPostSuccess(); // Call callback to refresh the feed
    } catch (error) {
      console.error("Failed to create post:", error);
      setError(error.message); // Display error message
    }
  };

  return (
    <>
      <Tooltip
        onClick={() => setOpen(true)}
        title="Add"
        sx={{
          position: "fixed",
          bottom: 20,
          left: { xs: "calc(50% - 25px)", md: 30 },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <StyledModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={isExpanded ? "80vw" : "400px"}
          maxWidth="90vw"
          maxHeight="90vh"
          height={isExpanded ? "80vh" : "auto"} // Dynamic height based on expanded state
          bgcolor={"background.default"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
          sx={{
            overflowY: "auto", // Enable scrolling if content overflows
            transition: "transform 0.4s ease, opacity 0.4s ease",
            transform: isExpanded ? "scale(1.05)" : "scale(1)",
            opacity: isExpanded ? 1 : 0.9,
            position: isExpanded ? "fixed" : "relative",
            top: isExpanded ? "10%" : "auto",
            left: isExpanded ? "10%" : "auto",
          }}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Create post
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}{" "}
          {/* Error alert box */}
          <UserBox>
            <Avatar
              src={
                currentUser?.profilePicture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              sx={{ width: 30, height: 30 }}
            />
            <Typography fontWeight={500} variant="span">
              {currentUser?.username || "Guest"}
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
          <Box
            sx={{
              maxHeight: isExpanded ? "65vh" : "200px", // Set max height of text editor
              overflowY: "auto", // Enable scrolling within the text editor
              marginBottom: "10px",
            }}
          >
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
              placeholder="What's on your mind?"
            />
          </Box>
          <Stack
            direction="row"
            gap={1}
            mt={2}
            mb={0}
            justifyContent="space-between"
          >
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ flex: 1 }}
              disabled={uploading} // Disable button while uploading
            >
              Cover
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Button
              disabled={!currentUser || !title || !content || uploading}
              onClick={handlePost}
              variant="contained"
              sx={{ flex: 2 }}
            >
              Post
            </Button>
            <Button
              onClick={handleExpand}
              variant="contained"
              sx={{ width: "50px" }}
            >
              <CropFree />
            </Button>
          </Stack>
        </Box>
      </StyledModal>
    </>
  );
};
