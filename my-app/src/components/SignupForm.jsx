import { Google } from '@mui/icons-material';
import { Link, Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';


export const SignupForm = () => {
  const [formData, setFormData] = useState({});
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
    } catch (error) {
      
    }
  }

  return (
    <Box flex={3} p={2} display="flex" flexDirection="column" alignItems="center">
      <Box
        component="form"
        sx={{ 
          '& .MuiTextField-root': { m: 1, width: 'calc(100% - 20px)' }, 
          '& .MuiButton-root': { m: 1, width: 'calc(100% - 20px)' },
          maxWidth: '600px',
          width: '100%'
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
          <div>
            <TextField
              id="username"
              label="Username"
              type='text'
              autoComplete=""
              placeholder='username'
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="email"
              label="Email"
              type='email'
              autoComplete=""
              placeholder='email@company.com'
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="phone"
              label="Phone"
              type='tel'
              autoComplete=""
              placeholder='123-456-7890'
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="dateOfBirth"
              type='date'
              label="Birthday"
              autoComplete=""
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="zipcode"
              label="Zipcode"
              type='number'
              autoComplete=""
              placeholder='12345'
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="password"
              label="Password"
              type='password'
              autoComplete=""
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="confirm-password"
              label="Confirm Password"
              type='password'
              autoComplete=""
              onChange={handleChange}
            />
          </div>
          <Button variant='contained' type='submit'>Sign Up</Button>
          <Button variant='outlined' startIcon={<Google />}>Continue with Google</Button>
        <Box mt={2}>
          <span>Have an account? </span>
          <Link component={RouterLink} to='/sign-in' underline="none">
            Sign In
          </Link>
        </Box>
      </Box>
    </Box>
  );
};