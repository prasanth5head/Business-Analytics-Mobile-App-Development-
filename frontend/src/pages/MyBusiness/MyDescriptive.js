import React from 'react';
import {
    Box, Typography, Grid, Paper, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Alert, Button, useTheme
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { ArrowUpward, ArrowDownward, Refresh } from '@mui/icons-material';
import { useMyBusiness } from '../../context/MyBusinessContext';

const COLORS = [
    '#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'
];

const MyDescriptive = () => {
    const theme = useTheme();
    const { businessData, aiRecommendations, loading, error, refreshData } = useMyBusiness();

    if (loading && !businessData) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} width="40%" />
                <Skeleton variant="rectangular" height={200} sx={{ my: 4, borderRadius: 2 }} />
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid item xs={12} sm={3} key={i}><Skeleton variant="rectangular" height={120} /></Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!businessData) return <Alert severity="info">Add revenue records to see descriptive analytics.</Alert>;

    const { salesData, productData, summary } = businessData;
    const { aiAnalysis } = aiRecommendations || {};

    const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
    const totalProfit = salesData.reduce((sum, d) => sum + d.profit, 0);

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: 'text.primary' }}>
                        📊 Business Descriptive Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "What happened in my business?" — History of manual entries
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={refreshData}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                >
                    Refresh Data
                </Button>
            </Box>

            {/* AI Summary Section */}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">AI Business Review</Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary">{aiAnalysis}</Typography>
                </Paper>
            )}

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Total Business Revenue', value: `₹${totalSales.toLocaleString()}`, change: summary.growthRate, up: true, color: theme.palette.primary.main },
                    { label: 'Total Net Profit', value: `₹${totalProfit.toLocaleString()}`, change: '+0%', up: true, color: theme.palette.success.main },
                    { label: 'Number of Entries', value: summary.activeUsers.toLocaleString(), change: 'Manual', up: true, color: theme.palette.secondary.main },
                    { label: 'Total Loss Tracking', value: `₹${summary.totalLoss.toLocaleString()}`, change: 'Audit', up: false, color: theme.palette.error.main },
                ].map((kpi, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Paper sx={{ p: 3, borderTop: `4px solid ${kpi.color}`, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                            <Typography variant="h4" fontWeight="bold" sx={{ my: 1, color: 'text.primary' }}>{kpi.value}</Typography>
                            <Chip
                                label={kpi.change}
                                size="small"
                                color={kpi.up ? 'success' : 'error'}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, height: '100%', borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h5" gutterBottom fontWeight="900" color="text.primary" mb={3}>Business Revenue & Profit History</Typography>
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} fontWeight={700} />
                                <YAxis stroke={theme.palette.text.secondary} fontWeight={700} />
                                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8, fontWeight: 700 }} />
                                <Legend wrapperStyle={{ fontWeight: 700, paddingTop: '20px' }} />
                                <Bar dataKey="sales" fill={theme.palette.primary.main} name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" fill={theme.palette.success.main} name="Profit (₹)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 5, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Revenue Distribution by Product</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={productData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="profitMargin"
                                    label={({ name }) => name}>
                                    {productData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                            {productData.map((item, i) => (
                                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 0.5, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                                        <Typography variant="body2" color="text.primary">{item.name}</Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ ml: 2 }}>{item.profitMargin}% Margin</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MyDescriptive;
