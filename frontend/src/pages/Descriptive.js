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
import { useMarket } from '../context/MarketContext';

const Descriptive = () => {
    const theme = useTheme();
    const { marketData, aiRecommendations, loading, error, refreshData } = useMarket();

    const COLORS = [
        '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399'
    ];

    if (loading && !marketData) {
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

    const { salesData = [], productData = [], summary = {} } = marketData || {};
    const { aiAnalysis } = aiRecommendations || {};

    const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
    const totalProfit = salesData.reduce((sum, d) => sum + d.profit, 0);
    const avgPrice = Math.round(salesData.reduce((sum, d) => sum + d.price, 0) / salesData.length);

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: 'text.primary' }}>
                        📊 Descriptive Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "What happened?" — Real-time market data insights
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
                        ? `linear-gradient(90deg, ${theme.palette.primary.dark}20 0%, ${theme.palette.background.paper} 100%)`
                        : `linear-gradient(90deg, ${theme.palette.primary.light}10 0%, ${theme.palette.background.paper} 100%)`,
                    borderLeft: `6px solid ${theme.palette.primary.main}`,
                    borderRadius: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">AI Executive Summary</Typography>
                    </Box>
                    <Typography variant="body1" color="text.primary">{aiAnalysis}</Typography>
                </Paper>
            )}

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Total Sales (Live)', value: `₹${totalSales.toLocaleString()}`, change: summary?.growthRate || '+5%', up: true, color: theme.palette.primary.main },
                    { label: 'Total Profit', value: `₹${totalProfit.toLocaleString()}`, change: '+8.4%', up: true, color: theme.palette.secondary.main },
                    { label: 'Avg Unit Price', value: `₹${avgPrice}`, change: '-2.1%', up: false, color: theme.palette.warning.main },
                    { label: 'Active Users', value: summary?.activeUsers?.toLocaleString() || Math.floor(totalSales / 500).toLocaleString() || '0', change: '+15.2%', up: true, color: theme.palette.success.main },
                ].map((kpi, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Paper sx={{ p: 3, borderTop: `4px solid ${kpi.color}`, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                            <Typography variant="h4" fontWeight="bold" sx={{ my: 1, color: 'text.primary' }}>{kpi.value}</Typography>
                            <Chip
                                icon={kpi.up ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                                label={kpi.change}
                                size="small"
                                color={kpi.label.includes('User') || kpi.up ? 'success' : 'warning'}
                            />
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, height: '100%', borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h5" gutterBottom fontWeight="900" color="text.primary" mb={3}>Live Sales & Profit Trend</Typography>
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} fontWeight={700} />
                                <YAxis stroke={theme.palette.text.secondary} fontWeight={700} />
                                <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8, fontWeight: 700 }} />
                                <Legend wrapperStyle={{ fontWeight: 700, paddingTop: '20px' }} />
                                <Bar dataKey="sales" fill={theme.palette.primary.main} name="Sales (₹)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" fill={theme.palette.secondary.main} name="Profit (₹)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Paper sx={{ p: 5, height: '100%', borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Category Contribution</Typography>
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
                                    <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ ml: 2 }}>{item.profitMargin.toFixed(1)}%</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Data Table */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">Raw Data (Live Ticker)</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                                <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>Month</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Sales (₹)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Profit (₹)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Price (₹)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Complaints</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Market Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesData.map((row) => (
                                <TableRow key={row.p}>
                                    <TableCell sx={{ color: 'text.primary' }}>{row.p}</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.primary' }}>{row.sales.toLocaleString()}</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.primary' }}>{row.profit.toLocaleString()}</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.primary' }}>₹{row.price}</TableCell>
                                    <TableCell align="right" sx={{ color: 'text.primary' }}>{row.complaints}</TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={row.sales > 4500 ? 'Bullish' : row.sales > 3500 ? 'Stable' : 'Bearish'}
                                            size="small"
                                            color={row.sales > 4500 ? 'success' : row.sales > 3500 ? 'primary' : 'error'}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Descriptive;
