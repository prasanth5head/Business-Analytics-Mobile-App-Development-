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
import { LockOutlined as LockIcon, BarChart as LogoIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useColorMode } from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';

const Login = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
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
                background: theme.palette.background.default,
                position: 'relative',
                overflow: 'hidden',
                p: 2
            }}
        >
            {/* Theme Toggle Button */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                <IconButton onClick={toggleColorMode} color="inherit">
                    {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </Box>

            {/* Creative Aurora Glows */}
            <Box sx={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: 600,
                height: 600,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
                filter: 'blur(120px)',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.secondary.main}10 0%, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 8,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${theme.palette.divider}`,
                            textAlign: 'center',
                            boxShadow: theme.palette.mode === 'dark' ? '0 20px 80px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                border: `1px solid ${theme.palette.primary.main}30`,
                            }
                        }}
                    >
                        <Box sx={{
                            mb: 4,
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: 2, // Square-ish
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
                        }}>
                            <LogoIcon fontSize="large" />
                        </Box>

                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 900, color: '#fff', mb: 1.5 }}>
                            Analytics Pro
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 5, color: '#8F9BB3', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Strategic Intelligence Platform
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
