import React from 'react';
import {
    Box, Typography, Grid, Paper, Chip, Divider, Skeleton, Alert, Button
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, ComposedChart
} from 'recharts';
import { Refresh } from '@mui/icons-material';
import { useMarket } from '../context/MarketContext';

const FindingCard = ({ title, observation, evidence, severity }) => (
    <Paper sx={{
        p: 3, mb: 2,
        borderLeft: `4px solid ${severity === 'High' || severity === 'Critical' ? '#d32f2f' : severity === 'Medium' || severity === 'Strategy' ? '#ff9800' : '#4caf50'}`
    }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
            <Chip label={severity.toUpperCase()} size="small"
                color={severity === 'High' || severity === 'Critical' ? 'error' : severity === 'Medium' || severity === 'Strategy' ? 'warning' : 'success'} />
        </Box>
        <Typography variant="body1" paragraph>{observation}</Typography>
        <Typography variant="body2" color="text.secondary">
            <strong>AI Observation:</strong> {evidence}
        </Typography>
    </Paper>
);

const Diagnostic = () => {
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
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: '#ff7300' }}>
                        🔍 Diagnostic Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "Why did it happen?" — Real-time AI Data Correlation
                    </Typography>
                </Box>
                <Button startIcon={<Refresh />} onClick={refreshData} disabled={loading}>
                    Update Analysis
                </Button>
            </Box>

            {/* AI Diagnostics Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, mb: 1, borderLeft: '6px solid #ff7300' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
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
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Live Correlation: Unit Price vs. Sales Volume
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Identifying price elasticity in real-time. Inverse trends indicate sensitivity.
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={priceSalesCorrelation}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="p" />
                        <YAxis yAxisId="left" orientation="left" stroke="#413ea0" label={{ value: 'Sales', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#ff7300" label={{ value: 'Price (₹)', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="sales" barSize={30} fill="#413ea0" name="Sales Volume" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="price" stroke="#ff7300" strokeWidth={3} name="Unit Price (₹)" dot={{ r: 4 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </Paper>

            {/* Risk Factors */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Complaint Trends</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="p" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="complaints" stroke="#d32f2f" strokeWidth={2} name="Complaints" dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Product Risk Profile</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={returnVsMargin} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="profitMargin" fill="#4caf50" name="Margin %" />
                                <Bar dataKey="returnRate" fill="#f44336" name="Returns %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Diagnostic;
