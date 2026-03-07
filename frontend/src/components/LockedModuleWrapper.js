import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const LockedModuleWrapper = ({ children, isUnlocked, totalRecords }) => {
    const theme = useTheme();

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <Box sx={{ position: 'relative', width: '100%', minHeight: '400px' }}>
            {/* Blurred Background Content */}
            <Box sx={{
                filter: 'blur(8px)',
                opacity: 0.4,
                pointerEvents: 'none',
                userSelect: 'none'
            }}>
                {children}
            </Box>

            {/* Overlay Message */}
            <Paper
                elevation={6}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 4,
                    maxWidth: 400,
                    width: '90%',
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(30, 41, 59, 0.9)'
                        : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    zIndex: 10
                }}
            >
                <Box sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: `0 0 20px ${theme.palette.primary.main}40`
                }}>
                    <LockIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Analytics Locked
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Complete 12 months of business data to unlock Business Analytics.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" fontWeight="bold" color="primary.main">
                        Current Progress: {totalRecords} / 12 Months
                    </Typography>
                    <Box sx={{
                        width: '100%',
                        height: 6,
                        bgcolor: 'divider',
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            width: `${Math.min((totalRecords / 12) * 100, 100)}%`,
                            height: '100%',
                            bgcolor: 'primary.main',
                            transition: 'width 0.5s ease'
                        }} />
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default LockedModuleWrapper;
