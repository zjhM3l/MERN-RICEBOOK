import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

export const UpdateProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    birth: '',
    zipcode: '',
    password: '',
    confirmPassword: ''
  });

  const [editableFields, setEditableFields] = useState({
    username: false,
    email: false,
    phone: false,
    birth: false,
    zipcode: false,
    password: false,
    confirmPassword: false
  });

  const theme = useTheme();

  useEffect(() => {
    if (currentUser) {
      const formattedBirthDate = currentUser.dateOfBirth
        ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0]
        : '';
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        birth: formattedBirthDate,
        zipcode: currentUser.zipcode || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleEditable = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Box sx={{
      maxWidth: '600px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
      borderRadius: '8px',
      boxShadow: theme.palette.mode === 'dark' ? '0 0 10px rgba(255, 255, 255, 0.1)' : '0 0 10px rgba(0, 0, 0, 0.1)',
    }}>
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
            helperText="Username must start with a letter and contain only letters and numbers."
          />
          <Button variant="contained" color="primary" sx={{ ml: 2, mb: 3 }} onClick={() => toggleEditable('username')}>
            {editableFields.username ? '...' : '✔️'}
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
            disabled={!editableFields.email}
            helperText="Email must be a valid email address."
          />
          <Button variant="contained" color="primary" sx={{ ml: 2, mb: 3 }} onClick={() => toggleEditable('email')}>
            {editableFields.email ? '...' : '✔️'}
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
            helperText="Phone number format: XXX-XXX-XXXX or XXX.XXX.XXXX or (XXX) XXX-XXXX."
          />
          <Button variant="contained" color="primary" sx={{ ml: 2, mb: 3 }} onClick={() => toggleEditable('phone')}>
            {editableFields.phone ? '...' : '✔️'}
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
            disabled={!editableFields.birth}
            helperText="Date of Birth cannot be edited."
          />
          <Button variant="contained" color="secondary" disabled sx={{ ml: 2, mb: 3 }}>
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
            helperText="Zip code should be 5 digits."
          />
          <Button variant="contained" color="primary" sx={{ ml: 2, mb: 3 }} onClick={() => toggleEditable('zipcode')}>
            {editableFields.zipcode ? '...' : '✔️'}
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
            helperText="Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, and one number."
          />
          <Button variant="contained" color="primary" sx={{ ml: 2, mb: 5 }} onClick={() => toggleEditable('password')}>
            {editableFields.password ? '...' : '✔️'}
          </Button>
        </Box>
      </Box>
      <Box mb={2} id="confirm-password-container" sx={{ display: 'none' }}>
        <Typography variant="h6">Confirm Password:</Typography>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            id="confirm-password"
            name="confirmPassword"
            type="password"
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={!editableFields.confirmPassword}
            helperText="Confirm password must match the new password."
          />
        </Box>
      </Box>
      <Button variant="contained" color="primary" id="update-button">
        Update All
      </Button>
    </Box>
  );
};