import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, SIGNUP_USER } from '../graphql/mutations';
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

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  
  const {
    control,
    handleSubmit,
    formState: { errors }
    } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    onError: (error) => {
      // Handle GraphQL errors
      if (error.message === 'Invalid credentials') {
        setErrorMessage('Invalid email or password. Please try again.'); 
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
      setOpenSnackbar(true); 
    },
    onCompleted: (data) => {
      localStorage.setItem('authToken', data.login.authToken);
      navigate('/'); 
    },
  });

  const [signupUser] = useMutation(SIGNUP_USER, {
    onError: (error) => {
      // Handle GraphQL errors
      setErrorMessage(error.message || 'Signup failed. Please try again.');
      setOpenSnackbar(true); 
    },
    onCompleted: (data) => {
      localStorage.setItem('authToken', data.signup.authToken);
      navigate('/') 
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        await loginUser({
          variables: { loginUserInput: { email: data.email, password: data.password } },
        });
      } else {
        await signupUser({
          variables: { signupInput: data },
        });
      }
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
          {isLogin ? 'Login' : 'Sign Up'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
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
          )}
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
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </Box>
        </form>
        <Grid2 container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid2>
            <Typography variant="body2">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Link
                component="button"
                variant="body2"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </Link>
            </Typography>
          </Grid2>
        </Grid2>
      </Paper>

      {/* Snackbar for displaying error messages */}
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

export default Auth;