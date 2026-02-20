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
                background: `radial-gradient(circle at bottom right, ${theme.palette.secondary.main}15 0%, ${theme.palette.background.default} 60%, ${theme.palette.primary.main}10 100%)`,
                position: 'relative',
                overflow: 'hidden',
                p: 2
            }}
        >
            {/* Creative Aurora Glows */}
            <Box sx={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.secondary.main}20 0%, transparent 70%)`,
                filter: 'blur(100px)',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                top: '15%',
                left: '5%',
                width: 350,
                height: 350,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}10 0%, transparent 70%)`,
                filter: 'blur(90px)',
                zIndex: 0
            }} />

            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, md: 6 },
                            borderRadius: 8,
                            bgcolor: 'rgba(15, 19, 26, 0.7)',
                            backdropFilter: 'blur(20px)',
                            border: `1px solid rgba(255, 255, 255, 0.05)`,
                            textAlign: 'center',
                            boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
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
                            borderRadius: '24px',
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            boxShadow: `0 0 20px ${theme.palette.secondary.main}40`,
                        }}>
                            <RegisterIcon fontSize="large" />
                        </Box>

                        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 900, color: '#fff', mb: 1.5 }}>
                            Register
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 5, color: '#8F9BB3', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Join the Strategic Network
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
