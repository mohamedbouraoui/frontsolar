import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../graphql/mutations';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Box,
  Grid2,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Signup({ setIsLogin }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const [signupUser] = useMutation(SIGNUP_USER, {
    onError: (error) => {
      setErrorMessage(error.message || 'Signup failed. Please try again.');
      setOpenSnackbar(true);
    },
    onCompleted: (data) => {
      const { authToken, user } = data.signup;

      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    },
  });

  const onSubmit = async (data) => {
    try {
      await signupUser({
        variables: { signupInput: data },
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                required
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                required
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                required
              />
            )}
          />
          <Box sx={{ marginTop: 2 }}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              Sign Up
            </Button>
          </Box>
        </form>
        <Grid2 container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid2>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => setIsLogin(true)}
              >
                Login
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Signup;