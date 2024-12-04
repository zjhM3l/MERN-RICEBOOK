import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CheckIcon from "@mui/icons-material/Check";
import { updateProfileSuccess } from "../redux/user/userSlice"; // Adjust the import path as necessary
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { app } from "../firebase"; // Adjust the import path as necessary
import API_BASE_URL from "../config/config";

export const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    birth: "",
    zipcode: "",
    password: "",
    confirmPassword: "",
    photoURL: "",
  });

  const [editableFields, setEditableFields] = useState({
    username: false,
    email: false,
    phone: false,
    birth: false,
    zipcode: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({});
  const theme = useTheme();

  useEffect(() => {
    if (currentUser) {
      const formattedBirthDate = currentUser.dateOfBirth
        ? new Date(currentUser.dateOfBirth).toISOString().split("T")[0]
        : "";
      setFormData({
        username: currentUser.username || "",
        photoURL: currentUser.profilePicture || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        birth: formattedBirthDate,
        zipcode: currentUser.zipcode || "",
        password: currentUser.password || "",
        confirmPassword: currentUser.password || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (field) => {
    const dataToSubmit = { email: formData.email, [field]: formData[field] };
    if (
      field === "password" &&
      formData.password !== formData.confirmPassword
    ) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
      const data = await res.json();
      if (!res.ok) {
        // 错误处理
        const errorMessages = data.message.split(", ");
        const newErrors = {};
        errorMessages.forEach((msg) => {
          if (msg.includes("Username")) newErrors.username = msg;
          if (msg.includes("Phone number")) newErrors.phone = msg;
          if (msg.includes("Zipcode")) newErrors.zipcode = msg;
          if (msg.includes("Password")) newErrors.password = msg;
        });
        setErrors(newErrors);
      } else {
        // 清除错误
        setErrors({});
        // 更新 Redux 中的 currentUser 状态
        dispatch(updateProfileSuccess(data.user)); // 确保 data.user 是最新的数据
        // 禁用编辑状态
        setEditableFields((prev) => ({
          ...prev,
          [field]: false,
          confirmPassword: false,
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUpdateAll = async () => {
    const dataToSubmit = {};
    Object.keys(editableFields).forEach((field) => {
      if (editableFields[field]) {
        dataToSubmit[field] = formData[field];
      }
    });
    dataToSubmit.email = formData.email;
    try {
      const res = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMessages = data.message.split(", ");
        const newErrors = {};
        errorMessages.forEach((msg) => {
          if (msg.includes("Username")) newErrors.username = msg;
          if (msg.includes("Phone number")) newErrors.phone = msg;
          if (msg.includes("Zipcode")) newErrors.zipcode = msg;
          if (msg.includes("Password")) newErrors.password = msg;
        });
        setErrors(newErrors);
      } else {
        setErrors({});
        setEditableFields({
          username: false,
          email: false,
          phone: false,
          birth: false,
          zipcode: false,
          password: false,
          confirmPassword: false,
        });
        dispatch(updateProfileSuccess(data.user));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const toggleEditable = (field) => {
    if (field === "password") {
      if (editableFields.password) {
        handleSubmit("password");
      } else {
        setEditableFields((prev) => ({
          ...prev,
          password: !prev.password,
          confirmPassword: !prev.confirmPassword,
        }));
      }
    } else {
      if (editableFields[field]) {
        handleSubmit(field);
      } else {
        setEditableFields((prev) => ({
          ...prev,
          [field]: !prev[field],
        }));
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `avatars/${currentUser.email}/${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, photoURL: downloadURL }));

        // Send the new photoURL to the backend
        try {
          const res = await fetch(
            `${API_BASE_URL}/user/updateAvatar`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: currentUser,
                photoURL: downloadURL,
              }),
            }
          );
          const data = await res.json();
          if (res.ok) {
            dispatch(updateProfileSuccess(data.user));
          } else {
            console.error("Error updating avatar:", data.message);
          }
        } catch (error) {
          console.error("Error updating avatar:", error);
        }
      }
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
        borderRadius: "8px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 0 10px rgba(255, 255, 255, 0.1)"
            : "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box mb={2}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="avatar-upload"
          type="file"
          onChange={handleAvatarChange}
        />
        <label htmlFor="avatar-upload">
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: "0 auto",
              cursor: "pointer",
            }}
            src={formData.photoURL}
          />
        </label>
      </Box>
      <Box mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!editableFields.username}
            error={!!errors.username}
            helperText={errors.username}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, ...(errors.username && { mb: 3 }) }}
            onClick={() => toggleEditable("username")}
          >
            {editableFields.username ? "..." : <CheckIcon />}
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
            error={!!errors.email}
            helperText="Email cannot be changed"
          />
          <Button
            variant="contained"
            color="secondary"
            disabled
            sx={{ ml: 2, mb: 3 }}
          >
            &#10006;
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            type="tel"
            pattern="^\d{3}-\d{3}-\d{4}$"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={!editableFields.phone}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, ...(errors.phone && { mb: 3 }) }}
            onClick={() => toggleEditable("phone")}
          >
            {editableFields.phone ? "..." : <CheckIcon />}
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            id="birth"
            label="Date of Birth"
            name="birth"
            type="date"
            value={formData.birth}
            onChange={handleChange}
            disabled
            helperText="Date of birth cannot be changed"
          />
          <Button
            variant="contained"
            color="secondary"
            disabled
            sx={{ ml: 2, mb: 3 }}
          >
            &#10006;
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            id="zipcode"
            label="Zip Code"
            name="zipcode"
            pattern="^\d{5}$"
            value={formData.zipcode}
            onChange={handleChange}
            required
            disabled={!editableFields.zipcode}
            error={!!errors.zipcode}
            helperText={errors.zipcode}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, ...(errors.zipcode && { mb: 3 }) }}
            onClick={() => toggleEditable("zipcode")}
          >
            {editableFields.zipcode ? "..." : <CheckIcon />}
          </Button>
        </Box>
      </Box>
      <Box mb={2}>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={!editableFields.password}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2, ...(errors.password && { mb: 3 }) }}
            onClick={() => toggleEditable("password")}
          >
            {editableFields.password ? "..." : <CheckIcon />}
          </Button>
        </Box>
      </Box>
      {editableFields.password && (
        <Box mb={2} id="confirm-password-container">
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              id="confirm-password"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={!editableFields.confirmPassword}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Box>
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        id="update-button"
        onClick={handleUpdateAll}
      >
        Update All
      </Button>
    </Box>
  );
};
