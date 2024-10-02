import { Link, Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { OAuth } from "./OAuth";

export const SignupForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        // Assuming the backend returns an error message string containing multiple errors
        const errorMessages = data.message.split(", ");
        const newErrors = {};

        if (
          errorMessages.some((msg) => msg.includes("All fields are required"))
        ) {
          newErrors.general = "All fields are required";
        } else {
          errorMessages.forEach((msg) => {
            if (msg.includes("Username")) newErrors.username = msg;
            if (msg.includes("Email")) newErrors.email = msg;
            if (msg.includes("Phone number")) newErrors.phone = msg;
            if (msg.includes("You must be at least 18 years old"))
              newErrors.dateOfBirth = msg;
            if (msg.includes("Zipcode")) newErrors.zipcode = msg;
            if (msg.includes("Password")) newErrors.password = msg;
          });
        }
        setErrors(newErrors);
      } else {
        console.log("Signup successful:", data);
        navigate(
          `/sign-in?email=${encodeURIComponent(
            formData.email
          )}&password=${encodeURIComponent(formData.password)}`
        );
      }
    } catch (error) {
      console.error("Error during signup:", error);
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
            id="username"
            label="Username"
            type="text"
            autoComplete=""
            placeholder="username"
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
        </div>
        <div>
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete=""
            placeholder="email@company.com"
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </div>
        <div>
          <TextField
            id="phone"
            label="Phone"
            type="tel"
            autoComplete=""
            placeholder="123-456-7890"
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </div>
        <div>
          <TextField
            id="dateOfBirth"
            type="date"
            label="Birthday"
            autoComplete=""
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            onChange={handleChange}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
          />
        </div>
        <div>
          <TextField
            id="zipcode"
            label="Zipcode"
            type="number"
            autoComplete=""
            placeholder="12345"
            onChange={handleChange}
            error={!!errors.zipcode}
            helperText={errors.zipcode}
          />
        </div>
        <div>
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete=""
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
        </div>
        <div>
          <TextField
            id="confirm-password"
            label="Confirm Password"
            type="password"
            autoComplete=""
            onChange={handleChange}
            error={!!errors["confirm-password"]}
            helperText={errors["confirm-password"]}
          />
        </div>
        {errors.general && (
          <Box mt={2} color="error.main">
            {errors.general}
          </Box>
        )}
        <Button variant="contained" type="submit">
          Sign Up
        </Button>
        <OAuth />
        <Box mt={2}>
          <span>Have an account? </span>
          <Link component={RouterLink} to="/sign-in" underline="none">
            Sign In
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
