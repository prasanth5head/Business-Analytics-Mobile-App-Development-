import React from 'react';
import {
    Box, Typography, Grid, Paper, LinearProgress, Skeleton, Alert, Button
} from '@mui/material';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, Line
} from 'recharts';
import { Refresh } from '@mui/icons-material';
import { useMarket } from '../context/MarketContext';

const Predictive = () => {
    const { marketData, aiRecommendations, loading, error, refreshData } = useMarket();

    if (loading && !marketData) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} width="40%" />
                <Skeleton variant="rectangular" height={300} sx={{ my: 4 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={300} /></Grid>
                    <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={300} /></Grid>
                </Grid>
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;

    const { salesData } = marketData;
    const { aiAnalysis } = aiRecommendations || {};

    // Simulate scenario based on live data
    const lastSale = salesData[salesData.length - 1].sales;
    const scenarioData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({
        month: m,
        currentPath: Math.round(lastSale * (1 + (i * 0.05))),
        optimistic: Math.round(lastSale * (1 + (i * 0.15))),
        pessimistic: Math.round(lastSale * (1 - (i * 0.10))),
    }));

    const churnChartData = [
        { name: 'Low Risk', value: 750, fill: '#4caf50' },
        { name: 'Medium Risk', value: 240, fill: '#ff9800' },
        { name: 'High Risk', value: 110, fill: '#f44336' },
    ];

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: '#00C49F' }}>
                        🔮 Predictive Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "What will happen next?" — AI-Powered Sales Forecasting
                    </Typography>
                </Box>
                <Button startIcon={<Refresh />} onClick={refreshData} disabled={loading}>
                    Update Forecast
                </Button>
            </Box>

            {/* AI Sales Narrative */}
            {aiAnalysis && (
                <Paper sx={{ p: 3, mb: 4, bgcolor: '#e0f2f1', borderLeft: '6px solid #00c49f' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        Smart Forecast Narrative
                    </Typography>
                    <Typography variant="body1">{aiAnalysis}</Typography>
                </Paper>
            )}

            {/* Sales Forecast (FULL WIDTH) */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Projected Sales Growth (Next 6 Months)
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={scenarioData}>
                        <defs>
                            <linearGradient id="colorPath" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00c49f" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#00c49f" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="currentPath" stroke="#00c49f" fillOpacity={1} fill="url(#colorPath)" name="Predicted Baseline (₹)" />
                        <Line type="monotone" dataKey="optimistic" stroke="#4caf50" strokeDasharray="5 5" name="Optimistic Plan (₹)" />
                    </AreaChart>
                </ResponsiveContainer>
            </Paper>

            {/* Scenario Analysis Breakdown */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                        <Typography variant="subtitle2" color="success.main" fontWeight="bold">OPTIMISTIC Q2</Typography>
                        <Typography variant="h4" fontWeight="bold">₹{scenarioData[5].optimistic.toLocaleString()}</Typography>
                        <Typography variant="caption">Best case scenario (+15% MoM)</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                        <Typography variant="subtitle2" color="primary.main" fontWeight="bold">PROJECTED Q2</Typography>
                        <Typography variant="h4" fontWeight="bold">₹{scenarioData[5].currentPath.toLocaleString()}</Typography>
                        <Typography variant="caption">Standard growth trajectory (+5% MoM)</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ffebee' }}>
                        <Typography variant="subtitle2" color="error.main" fontWeight="bold">BEARISH Q2</Typography>
                        <Typography variant="h4" fontWeight="bold">₹{scenarioData[5].pessimistic.toLocaleString()}</Typography>
                        <Typography variant="caption">Market slowdown risk (-10% MoM)</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Churn Prediction */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Live Churn Risk Analysis</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={churnChartData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {churnChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">ML Risk Factor Importance</Typography>
                        {[
                            { factor: 'Price Sensitivity', weight: 88, color: '#f44336' },
                            { factor: 'Interaction Latency', weight: 65, color: '#ff9800' },
                            { factor: 'Competitor Switch Risk', weight: 52, color: '#2196f3' },
                            { factor: 'Ticket Frequency', weight: 40, color: '#4caf50' },
                        ].map(item => (
                            <Box key={item.factor} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">{item.factor}</Typography>
                                    <Typography variant="body2" fontWeight="bold">{item.weight}%</Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={item.weight}
                                    sx={{ height: 10, borderRadius: 5, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: item.color } }}
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Predictive;
