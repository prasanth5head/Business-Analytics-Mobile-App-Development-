import React from 'react';
import {
    Box, Typography, Grid, Paper, Chip, Divider, Skeleton, Alert, Button, useTheme
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, ComposedChart
} from 'recharts';
import { Refresh } from '@mui/icons-material';
import { useMarket } from '../context/MarketContext';

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
                <strong>AI Observation:</strong> {evidence}
            </Typography>
        </Paper>
    );
};

const Diagnostic = () => {
    const theme = useTheme();
    const { marketData, aiRecommendations, loading, error, refreshData } = useMarket();

    if (loading && !marketData) {
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

    const { salesData, productData } = marketData;
    const { recommendations } = aiRecommendations || {};

    const priceSalesCorrelation = salesData.map(d => ({
        ...d,
        priceImpact: d.price > 130 ? 'High Price Zone' : 'Normal'
    }));

    const returnVsMargin = productData.map(d => ({
        ...d,
        risk: d.returnRate > 10 ? 'High Risk' : 'Low Risk'
    }));

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: 'text.primary' }}>
                        🔍 Diagnostic Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "Why did it happen?" — Real-time AI Data Correlation
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
                    <Paper sx={{ p: 3, mb: 1, borderLeft: `6px solid ${theme.palette.primary.main}`, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="text.primary">
                            AI-Generated Diagnostic Report
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
                            <Typography color="text.secondary">Processing AI diagnostics...</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Correlation Chart */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                    Live Correlation: Unit Price vs. Sales Volume
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Identifying price elasticity in real-time. Inverse trends indicate sensitivity.
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={priceSalesCorrelation}>
                        <CartesianGrid stroke={theme.palette.divider} vertical={false} />
                        <XAxis dataKey="p" stroke={theme.palette.text.secondary} />
                        <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fill: theme.palette.text.secondary }} />
                        <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} label={{ value: 'Price (₹)', angle: 90, position: 'insideRight', fill: theme.palette.text.secondary }} />
                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="sales" barSize={30} fill={theme.palette.primary.main} name="Sales Volume" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="price" stroke={theme.palette.secondary.main} strokeWidth={3} name="Unit Price (₹)" dot={{ r: 4, fill: theme.palette.secondary.main }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </Paper>

            {/* Risk Factors */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Complaint Trends</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} />
                                <YAxis stroke={theme.palette.text.secondary} />
                                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                                <Line type="monotone" dataKey="complaints" stroke={theme.palette.error.main} strokeWidth={2} name="Complaints" dot={{ r: 4, fill: theme.palette.error.main }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Product Risk Profile</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={returnVsMargin} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis type="number" stroke={theme.palette.text.secondary} />
                                <YAxis dataKey="name" type="category" width={80} stroke={theme.palette.text.secondary} />
                                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                                <Legend />
                                <Bar dataKey="profitMargin" fill={theme.palette.success.main} name="Margin %" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="returnRate" fill={theme.palette.error.main} name="Returns %" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Diagnostic;
