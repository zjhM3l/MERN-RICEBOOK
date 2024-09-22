import { Google } from '@mui/icons-material';
import { Link, Box, Button, TextField } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';


export const SignupForm = () => {
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
      >
        <form>
          <div>
            <TextField
              id="username-input"
              label="Username"
              type='text'
              autoComplete=""
              placeholder='username'
            />
          </div>
          <div>
            <TextField
              id="email-input"
              label="Email"
              type='email'
              autoComplete=""
              placeholder='email@company.com'
            />
          </div>
          <div>
            <TextField
              id="password-input"
              label="Password"
              type='password'
              autoComplete=""
            />
          </div>
          <div>
            <TextField
              id="confirm-password-input"
              label="Confirm Password"
              type='password'
              autoComplete=""
            />
          </div>
          <Button variant='contained' type='submit'>Sign Up</Button>
          <Button variant='outlined' startIcon={<Google />}>Continue with Google</Button>
        </form>
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