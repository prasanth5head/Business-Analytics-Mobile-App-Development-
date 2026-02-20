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
import { PersonAdd as RegisterIcon } from '@mui/icons-material';

const Register = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                background: theme.palette.mode === 'dark'
                    ? 'radial-gradient(circle at bottom right, #1a237e 0%, #232730 40%, #000 100%)'
                    : 'radial-gradient(circle at bottom right, #f3e5f5 0%, #ffffff 40%, #f5f5f5 100%)',
                position: 'relative',
                overflow: 'hidden',
                p: 2
            }}
        >
            {/* Background Brushes */}
            <Box sx={{
                position: 'absolute',
                top: '15%',
                right: '15%',
                width: 350,
                height: 350,
                borderRadius: '50%',
                background: 'rgba(234, 84, 85, 0.1)',
                filter: 'blur(90px)',
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
                        <Box sx={{ mb: 3, display: 'inline-flex', p: 1.5, borderRadius: 2, bgcolor: 'secondary.main', color: 'white' }}>
                            <RegisterIcon fontSize="large" />
                        </Box>

                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                            Create Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Join Analytics Pro and start growing your business
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
