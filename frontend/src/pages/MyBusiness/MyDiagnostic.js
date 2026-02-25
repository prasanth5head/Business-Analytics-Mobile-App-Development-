import React from 'react';
import {
    Box, Typography, Grid, Paper, Chip, Divider, Skeleton, Alert, Button, useTheme
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, ComposedChart
} from 'recharts';
import { Refresh } from '@mui/icons-material';
import { useMyBusiness } from '../../context/MyBusinessContext';

const FindingCard = ({ title, observation, evidence, severity }) => {
    const theme = useTheme();
    return (
        <Paper sx={{
            p: 3, mb: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'background.paper',
            borderLeft: `4px solid ${severity === 'High' || severity === 'Critical'
                ? theme.palette.error.main
                : severity === 'Medium' || severity === 'Strategy'
                    ? theme.palette.warning.main
                    : theme.palette.success.main
                }`,
            borderRadius: 2
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="text.primary">{title}</Typography>
                <Chip label={severity.toUpperCase()} size="small"
                    color={severity === 'High' || severity === 'Critical' ? 'error' : severity === 'Medium' || severity === 'Strategy' ? 'warning' : 'success'} />
            </Box>
            <Typography variant="body1" paragraph color="text.primary">{observation}</Typography>
            <Typography variant="body2" color="text.secondary">
                <strong>Business Observation:</strong> {evidence || 'Based on your manual entries history.'}
            </Typography>
        </Paper>
    );
};

const MyDiagnostic = () => {
    const theme = useTheme();
    const { businessData, aiRecommendations, loading, error, refreshData } = useMyBusiness();

    if (loading && !businessData) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} width="40%" />
                <Skeleton variant="rectangular" height={300} sx={{ my: 4, borderRadius: 2 }} />
                <Grid container spacing={3}>
                    {[1, 2].map(i => (
                        <Grid item xs={12} md={6} key={i}><Skeleton variant="rectangular" height={250} /></Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!businessData) return <Alert severity="info">Add business data to generate diagnostic insights.</Alert>;

    const { salesData, productData } = businessData;
    const { recommendations } = aiRecommendations || {};

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: 'text.primary' }}>
                        🔍 My Diagnostic Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "Why is my business performing this way?" — Personal AI Analysis
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={refreshData}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                >
                    Update Analysis
                </Button>
            </Box>

            {/* AI Diagnostics Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mb: 1, borderLeft: `6px solid ${theme.palette.secondary.main}`, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                            AI-Generated Diagnostic Report for Your Business
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        {recommendations ? (
                            recommendations.map((rec, idx) => (
                                <FindingCard
                                    key={idx}
                                    title={rec.title}
                                    observation={rec.recommendation}
                                    evidence={rec.insight}
                                    severity={rec.type}
                                />
                            ))
                        ) : (
                            <Typography color="text.secondary">Processing your business diagnostics...</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Correlation Chart */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                    Revenue & Profit Correlation
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Identifying how your revenue translates to profit month-over-month.
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={salesData}>
                        <CartesianGrid stroke={theme.palette.divider} vertical={false} />
                        <XAxis dataKey="p" stroke={theme.palette.text.secondary} />
                        <YAxis stroke={theme.palette.primary.main} label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft', fill: theme.palette.text.secondary }} />
                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                        <Legend />
                        <Bar dataKey="sales" barSize={30} fill={theme.palette.primary.main} name="Revenue" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="profit" stroke={theme.palette.success.main} strokeWidth={3} name="Profit" dot={{ r: 4, fill: theme.palette.success.main }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </Paper>

            {/* Risk factors */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, height: '100%', borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h5" gutterBottom fontWeight="900" color="text.primary" mb={3}>Product Risk Assessment</Typography>
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={productData} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis type="number" stroke={theme.palette.text.secondary} fontWeight={700} />
                                <YAxis dataKey="name" type="category" width={120} stroke={theme.palette.text.secondary} fontWeight={700} />
                                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8, fontWeight: 700 }} />
                                <Legend wrapperStyle={{ fontWeight: 700, paddingTop: '20px' }} />
                                <Bar dataKey="profitMargin" fill={theme.palette.success.main} name="Profit Margin %" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="returnRate" fill={theme.palette.error.main} name="Loss Ratio %" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MyDiagnostic;
