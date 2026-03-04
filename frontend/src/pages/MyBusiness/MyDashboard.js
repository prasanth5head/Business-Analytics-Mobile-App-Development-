import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Typography, useTheme, Alert, Button, Snackbar, Stack, Card
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useMyBusiness } from '../../context/MyBusinessContext';
import { useSocket } from '../../context/SocketContext';

// Scalability Components
import FinancialHealthScore from '../../components/FinancialHealthScore';
import ScenarioSimulator from '../../components/ScenarioSimulator';
import AIAnomalyDetector from '../../components/AIAnomalyDetector';
import KPICommandCenter from '../../components/KPICommandCenter';
import CohortAnalysis from '../../components/CohortAnalysis';
import SkeletonCard from '../../components/SkeletonCard';

const MyDashboard = () => {
    const theme = useTheme();
    const socket = useSocket();
    const { businessData, loading, error, refreshData } = useMyBusiness();
    const [aiInsights, setAiInsights] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Listen for AI results from background worker
    useEffect(() => {
        if (socket) {
            socket.on('recommendation_result', (data) => {
                setAiInsights(data);
                setSnackbar({ open: true, message: 'AI Analysis Complete!', severity: 'success' });
            });
            return () => socket.off('recommendation_result');
        }
    }, [socket]);

    if (loading && !businessData) {
        return (
            <Box sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid item xs={12} md={3} key={i}><SkeletonCard /></Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) return <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>;
    if (!businessData) return <Alert severity="info" sx={{ borderRadius: 3 }}>Please add some revenue entries to see your analytics.</Alert>;

    const { salesData = [], productData = [], summary = {} } = businessData || {};

    return (
        <Box sx={{ pb: 6 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.04em' }}>
                        Enterprise Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Real-time intelligence • Scalable architecture • Multi-tenant isolation
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={refreshData}
                    disabled={loading}
                    sx={{ borderRadius: 4, px: 4, py: 1.5, fontWeight: 900, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                >
                    Process New Data
                </Button>
            </Box>

            {/* Main Grid */}
            <Grid container spacing={4}>
                {/* Left Column: KPI & Anomalies */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={4}>
                        <KPICommandCenter />
                        <AIAnomalyDetector />
                        <CohortAnalysis />
                    </Stack>
                </Grid>

                {/* Right Column: Health & Simulator */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={4}>
                        <FinancialHealthScore score={82} />
                        <ScenarioSimulator initialSales={summary?.totalSales || 0} />

                        {/* Background Task Status */}
                        <Card sx={{ p: 3, borderRadius: 5, border: '1px solid rgba(255, 255, 255, 0.05)', bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'rgba(255, 255, 255, 0.5)' }}>
                                AI SYSTEM STATUS
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50', boxShadow: '0 0 10px #4caf50' }} />
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>Background worker active</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'rgba(255, 255, 255, 0.4)' }}>
                                Gemini-3 Flash Preview via BullMQ + Redis
                            </Typography>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 800 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyDashboard;
