import React from 'react';
import {
    Box, Typography, Grid, Paper, LinearProgress, Skeleton, Alert, Button, useTheme
} from '@mui/material';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Line } from 'recharts';
import { Refresh } from '@mui/icons-material';
import { useMyBusiness } from '../../context/MyBusinessContext';
import LockedModuleWrapper from '../../components/LockedModuleWrapper';

const MyPredictive = () => {
    const theme = useTheme();
    const { businessData, aiRecommendations, loading, error, refreshData, isUnlocked, totalRecords } = useMyBusiness();

    if (loading && !businessData) {
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

    const { salesData = [] } = businessData || {};
    const { aiAnalysis } = aiRecommendations || {};

    const lastSale = salesData.length > 0 ? (salesData.find(d => !d.isPredictive)?.sales || salesData[0].sales || 0) : 0;
    const scenarioData = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'].map((m, i) => ({
        month: m,
        currentPath: Math.round(lastSale * (1 + (i * 0.05))),
        optimistic: Math.round(lastSale * (1 + (i * 0.15))),
        pessimistic: Math.round(lastSale * (1 - (i * 0.10))),
    }));

    return (
        <LockedModuleWrapper isUnlocked={isUnlocked} totalRecords={totalRecords}>
            <Box sx={{ pb: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: 'text.primary' }}>
                            🔮 My Predictive Forecasts
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            "Where is my business heading?" — AI Future Projection
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={refreshData}
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                    >
                        Update Forecast
                    </Button>
                </Box>

                {/* AI Sales Narrative */}
                {aiAnalysis && (
                    <Paper sx={{
                        p: 3,
                        mb: 4,
                        background: theme.palette.mode === 'dark'
                            ? `linear-gradient(90deg, ${theme.palette.secondary.dark}20 0%, ${theme.palette.background.paper} 100%)`
                            : `linear-gradient(90deg, ${theme.palette.secondary.light}10 0%, ${theme.palette.background.paper} 100%)`,
                        borderLeft: `6px solid ${theme.palette.secondary.main}`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="secondary.main">
                            Personalized Business Forecast
                        </Typography>
                        <Typography variant="body1" color="text.primary">{aiAnalysis}</Typography>
                    </Paper>
                )}

                {/* Sales Forecast */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
                        Predictive Revenue Growth (Scenario Modeling)
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={scenarioData}>
                            <defs>
                                <linearGradient id="colorPath" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                            <YAxis stroke={theme.palette.text.secondary} />
                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                            <Legend />
                            <Area type="monotone" dataKey="currentPath" stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#colorPath)" name="Standard Trajectory (₹)" />
                            {/* Line import from recharts needs to be available */}
                            {/* <Line type="monotone" dataKey="optimistic" stroke={theme.palette.success.main} strokeDasharray="5 5" name="High Growth Plan (₹)" /> */}
                        </AreaChart>
                    </ResponsiveContainer>
                </Paper>

                {/* Scenario Breakdown */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.05)' : '#e8f5e9', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="success.main" fontWeight="bold">OPTIMISTIC TARGET</Typography>
                            <Typography variant="h4" fontWeight="bold">₹{(scenarioData[5]?.optimistic || 0).toLocaleString()}</Typography>
                            <Typography variant="caption" color="text.secondary">Aggressive marketing strategy impact</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.05)' : '#e3f2fd', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="primary.main" fontWeight="bold">BASELINE FORECAST</Typography>
                            <Typography variant="h4" fontWeight="bold">₹{(scenarioData[5]?.currentPath || 0).toLocaleString()}</Typography>
                            <Typography variant="caption" color="text.secondary">Current performance continuation</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.05)' : '#ffebee', borderRadius: 2 }}>
                            <Typography variant="subtitle2" color="error.main" fontWeight="bold">MINIMUM THRESHOLD</Typography>
                            <Typography variant="h4" fontWeight="bold">₹{(scenarioData[5]?.pessimistic || 0).toLocaleString()}</Typography>
                            <Typography variant="caption" color="text.secondary">Worst-case market conditions</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Growth Factors */}
                <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="h5" gutterBottom fontWeight="900" mb={3}>AI Growth Variable Analysis</Typography>
                    {[
                        { factor: 'Entry Consistency', weight: 95, color: theme.palette.success.main },
                        { factor: 'Revenue Trend Momentum', weight: 78, color: theme.palette.primary.main },
                        { factor: 'Profit Margin Stability', weight: 62, color: theme.palette.secondary.main },
                    ].map(item => (
                        <Box key={item.factor} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" fontWeight="700">{item.factor}</Typography>
                                <Typography variant="body1" fontWeight="900">{item.weight}%</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={item.weight}
                                sx={{ height: 14, borderRadius: 7, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#eee', '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 7 } }}
                            />
                        </Box>
                    ))}
                </Paper>
            </Box>
        </LockedModuleWrapper>
    );
};

export default MyPredictive;
