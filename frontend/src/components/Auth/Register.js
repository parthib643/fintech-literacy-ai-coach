import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register as registerApi } from '../../api/api';
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Box,
} from '@mui/material';

// Creative animated gradient background for Register page
const registerGradient = `
@keyframes registerGradientBG {
  0% { background-position: 0% 0%; }
  20% { background-position: 100% 0%; }
  40% { background-position: 100% 100%; }
  60% { background-position: 0% 100%; }
  80% { background-position: 0% 0%; }
  100% { background-position: 0% 0%; }
}
.register-bg {
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(120deg, #27187E 0%, #6c63ff 30%, #f96d00 60%, #3B1E9A 100%);
  background-size: 400% 400%;
  animation: registerGradientBG 18s ease-in-out infinite;
  filter: blur(2px) brightness(0.95);
  opacity: 0.95;
}
`;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await registerApi(registerData);
      await login(response);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{registerGradient}</style>
      <div className="register-bg" />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{
            mb: 3,
            color: '#fff',
            fontWeight: 700,
            letterSpacing: 1,
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            fontSize: '1.8rem',
          }}
        >
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(30, 30, 60, 0.85)',
            borderRadius: 3,
            p: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #f96d00 0%, #6c63ff 100%)',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: 1,
              boxShadow: '0 4px 16px rgba(108,99,255,0.25)',
              transition: 'transform 0.2s cubic-bezier(.4,2,.6,1), box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-6px) scale(1.04)',
                boxShadow: '0 12px 24px rgba(108,99,255,0.35)',
                background: 'linear-gradient(90deg, #6c63ff 0%, #f96d00 100%)',
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : 'Register'}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" sx={{ color: '#bbb', '&:hover': { color: '#fff' } }}>
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Register;