import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
    Alert,
    CircularProgress,
    Paper,
    Link,
    useTheme,
    Fade
} from '@mui/material';
import { PersonAdd as RegisterIcon, Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useColorMode } from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';

const Register = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [businessRole, setBusinessRole] = useState('learner');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post(`/api/users`, {
                name,
                email,
                password,
                businessRole
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed');
        } finally {
            setLoading(false);
        }
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
                                border: `1px solid ${theme.palette.secondary.main}30`,
                            }
                        }}
                    >
                        <Box sx={{
                            mb: 4,
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: 2,
                            bgcolor: theme.palette.secondary.main,
                            color: theme.palette.secondary.contrastText,
                            boxShadow: `0 0 20px ${theme.palette.secondary.main}40`,
                        }}>
                            <RegisterIcon fontSize="large" />
                        </Box>

                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 900, color: 'text.primary', mb: 1.5 }}>
                            Register
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 5, color: 'text.secondary', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Join Analytics Pro Network
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                variant="outlined"
                                margin="normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                            />

                            <Typography variant="subtitle2" sx={{ textAlign: 'left', mb: 1, fontWeight: 'bold', color: 'text.secondary' }}>
                                I am a...
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                <Button
                                    fullWidth
                                    variant={businessRole === 'manorwoman' ? 'contained' : 'outlined'}
                                    color="secondary"
                                    onClick={() => setBusinessRole('manorwoman')}
                                    sx={{ borderRadius: 2, py: 1 }}
                                >
                                    Business Manor/Woman
                                </Button>
                                <Button
                                    fullWidth
                                    variant={businessRole === 'learner' ? 'contained' : 'outlined'}
                                    color="secondary"
                                    onClick={() => setBusinessRole('learner')}
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
                                color="secondary"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1rem',
                                    mb: 3
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                            </Button>
                        </form>

                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/login')}
                                sx={{ fontWeight: 700, color: 'secondary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default Register;
