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
    const [credentials, setCredentials] = useState({ email: '', password: '', businessRole: 'learner' });
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
                businessRole: credentials.businessRole
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
                background: 'transparent',
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

            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'cover',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                    opacity: 0.65,
                }}
            >
                <source src="/Intro.mp4" type="video/mp4" />
            </video>

            {/* Premium Overlay */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                zIndex: 1,
            }} />

            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 8,
                            bgcolor: 'transparent',
                            backdropFilter: 'blur(30px) saturate(160%)',
                            border: `1px solid rgba(255, 255, 255, 0.1)`,
                            textAlign: 'center',
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
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

                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 900, color: 'text.primary', mb: 1.5 }}>
                            Analytics Pro
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 5, color: 'text.secondary', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
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

                            <Typography variant="subtitle2" sx={{ textAlign: 'left', mb: 1, fontWeight: 'bold', color: 'text.secondary' }}>
                                Sign in as...
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                <Button
                                    fullWidth
                                    variant={credentials.businessRole === 'manorwoman' ? 'contained' : 'outlined'}
                                    color="primary"
                                    onClick={() => setCredentials({ ...credentials, businessRole: 'manorwoman' })}
                                    sx={{ borderRadius: 2, py: 1 }}
                                >
                                    Business Man or Woman
                                </Button>
                                <Button
                                    fullWidth
                                    variant={credentials.businessRole === 'learner' ? 'contained' : 'outlined'}
                                    color="primary"
                                    onClick={() => setCredentials({ ...credentials, businessRole: 'learner' })}
                                    sx={{ borderRadius: 2, py: 1 }}
                                >
                                    Business Learner
                                </Button>
                            </Box>

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
