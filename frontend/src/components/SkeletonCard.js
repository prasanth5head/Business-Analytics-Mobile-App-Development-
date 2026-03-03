import React from 'react';
import { Card, Box, Skeleton } from '@mui/material';

const SkeletonCard = () => (
    <Card sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
            </Box>
        </Box>
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
        <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="90%" />
        </Box>
    </Card>
);

export default SkeletonCard;
