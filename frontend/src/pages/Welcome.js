import React from 'react';
import { Box, Button, Typography, Stack, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000', // Fallback
        }}>
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
                    opacity: 0.7, // Slightly dim the video for better text readability
                }}
            >
                <source src="/Intro.mp4" type="video/mp4" />
            </video>

            {/* Premium Gradient Overlay */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                zIndex: 1,
            }} />

            {/* Main Content Container */}
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Box sx={{
                        textAlign: 'center',
                        color: '#fff',
                        p: { xs: 4, md: 8 },
                        borderRadius: '24px',
                        backdropFilter: 'blur(12px) saturate(180%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.125)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                            pointerEvents: 'none',
                        }
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Typography
                                variant="overline"
                                sx={{
                                    display: 'block',
                                    mb: 2,
                                    letterSpacing: 4,
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.7)',
                                    textTransform: 'uppercase'
                                }}
                            >
                                Reimagining Intelligence
                            </Typography>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: -1,
                                    background: 'linear-gradient(to right, #fff, #90caf9)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: { xs: '2.5rem', md: '4rem' },
                                    lineHeight: 1.1,
                                    mb: 3
                                }}
                            >
                                Business Analytics <br /> Mobile Studio
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 6,
                                    fontWeight: 300,
                                    color: 'rgba(255,255,255,0.8)',
                                    maxWidth: '600px',
                                    mx: 'auto',
                                    lineHeight: 1.6
                                }}
                            >
                                Deploy powerful AI-driven insights directly from your pocket.
                                Secure, real-time, and optimized for your growth.
                            </Typography>
                        </motion.div>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={3}
                            justifyContent="center"
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    px: 6,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    background: '#fff',
                                    color: '#000',
                                    '&:hover': {
                                        background: '#f0f0f0',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 10px 20px rgba(255,255,255,0.2)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/register')}
                                sx={{
                                    px: 6,
                                    py: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    color: '#fff',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    borderWidth: '1.5px',
                                    '&:hover': {
                                        borderColor: '#fff',
                                        background: 'rgba(255,255,255,0.1)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                Register
                            </Button>
                        </Stack>
                    </Box>
                </motion.div>
            </Container>

            {/* Bottom Blur Decorator */}
            <Box sx={{
                position: 'absolute',
                bottom: -100,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '300px',
                background: 'radial-gradient(ellipse at center, rgba(33, 150, 243, 0.3) 0%, rgba(33, 150, 243, 0) 70%)',
                filter: 'blur(80px)',
                zIndex: 1,
                pointerEvents: 'none'
            }} />
        </Box>
    );
};

export default Welcome;

