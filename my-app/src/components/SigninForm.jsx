import { Google } from "@mui/icons-material";
import { Link, Box, Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { OAuth } from "./OAuth";
import API_BASE_URL from "../config/config";

export const SigninForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    const password = params.get("password");
    if (email) setFormData((prev) => ({ ...prev, email }));
    if (password) setFormData((prev) => ({ ...prev, password }));
  }, [location.search]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        // Assuming the backend returns an error message string with multiple messages
        const errorMessages = data.message.split(", ");
        const newErrors = {};

        if (
          errorMessages.some((msg) => msg.includes("All fields are required"))
        ) {
          newErrors.general = "All fields are required";
        } else {
          errorMessages.forEach((msg) => {
            if (msg.includes("Email")) newErrors.email = msg;
            if (msg.includes("Password")) newErrors.password = msg;
          });
        }
        setErrors(newErrors);
      } else {
        dispatch(signInSuccess(data));
        navigate("/home"); // Redirect to home page
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <Box
      flex={3}
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "calc(100% - 20px)" },
          "& .MuiButton-root": { m: 1, width: "calc(100% - 20px)" },
          maxWidth: "600px",
          width: "100%",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div>
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete=""
            placeholder="email@company.com"
            value={formData.email || ""}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </div>
        <div>
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete=""
            value={formData.password || ""}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </div>
        {errors.general && (
          <Box mt={2} color="error.main">
            {errors.general}
          </Box>
        )}
        <Button variant="contained" type="submit">
          Sign In
        </Button>
        <OAuth />
        <Box mt={2}>
          <span>Don't have an account? </span>
          <Link component={RouterLink} to="/sign-up" underline="none">
            Sign Up
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
