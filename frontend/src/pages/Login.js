import React, { useState, useEffect } from 'react';
import api from '../api';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    Typography,
    TextField,
    Button,
    Container,
    Alert,
    CircularProgress,
    Divider,
    Paper,
    Link,
    useTheme,
    Fade
} from '@mui/material';
import { LockOutlined as LockIcon, BarChart as LogoIcon } from '@mui/icons-material';

const Login = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post(`/api/users/login`, credentials);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email or password';
            const detail = err.response?.data?.detail ? ` (${err.response.data.detail})` : '';
            setError(msg + detail);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError('');
            const { credential } = credentialResponse;
            const res = await api.post(`/api/users/google-login`, {
                tokenId: credential,
            });

            localStorage.setItem('userInfo', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Google Login Failed';
            setError(msg);
        }
    };

    const handleError = () => {
        setError('Google Sign In was unsuccessful. Try again later');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.mode === 'dark'
                    ? 'radial-gradient(circle at top left, #1a237e 0%, #232730 40%, #000 100%)'
                    : 'radial-gradient(circle at top left, #e3f2fd 0%, #ffffff 40%, #f5f5f5 100%)',
                position: 'relative',
                overflow: 'hidden',
                p: 2
            }}
        >
            {/* Animated Background Elements */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(115, 103, 240, 0.1)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '20%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'rgba(0, 207, 232, 0.1)',
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: 4,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(47, 51, 73, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.palette.divider}`,
                            textAlign: 'center',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                        }}
                    >
                        <Box sx={{ mb: 3, display: 'inline-flex', p: 1.5, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
                            <LogoIcon fontSize="large" />
                        </Box>

                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                            Analytics Pro
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Sign in to unlock strategic business insights
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                variant="outlined"
                                margin="normal"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                            />
                            <Button
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    mb: 3
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                        </form>

                        <Divider sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                OR CONTINUE WITH
                            </Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleError}
                                theme={theme.palette.mode === 'dark' ? "filled_black" : "outline"}
                                shape="pill"
                                size="large"
                                width="100%"
                            />
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                            Don't have an account?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/register')}
                                sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Create Account
                            </Link>
                        </Typography>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default Login;
