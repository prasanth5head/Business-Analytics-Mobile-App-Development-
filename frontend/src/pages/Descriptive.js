import React from 'react';
import {
    Box, Typography, Grid, Paper, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Alert, Button
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { ArrowUpward, ArrowDownward, Refresh } from '@mui/icons-material';
import { useMarket } from '../context/MarketContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Descriptive = () => {
    const { marketData, aiRecommendations, loading, error, refreshData } = useMarket();

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

    const { salesData, productData, summary } = marketData;
    const { aiAnalysis } = aiRecommendations || {};

    const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0);
    const totalProfit = salesData.reduce((sum, d) => sum + d.profit, 0);
    const avgPrice = Math.round(salesData.reduce((sum, d) => sum + d.price, 0) / salesData.length);

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: '#8884d8' }}>
                        📊 Descriptive Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "What happened?" — Real-time market data insights
                    </Typography>
                </Box>
                <Button startIcon={<Refresh />} onClick={refreshData} disabled={loading}>
                    Refresh Data
                </Button>
            </Box>

            {/* AI Summary Section */}
            {aiAnalysis && (
                <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(90deg, #f3e5f5 0%, #e1f5fe 100%)', borderLeft: '6px solid #8e24aa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="#8e24aa">AI Executive Summary</Typography>
                    </Box>
                    <Typography variant="body1">{aiAnalysis}</Typography>
                </Paper>
            )}

            {/* KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'Total Sales (Live)', value: `₹${totalSales.toLocaleString()}`, change: summary.growthRate, up: true, color: '#4caf50' },
                    { label: 'Total Profit', value: `₹${totalProfit.toLocaleString()}`, change: '+8.4%', up: true, color: '#2196f3' },
                    { label: 'Avg Unit Price', value: `₹${avgPrice}`, change: '-2.1%', up: false, color: '#ff9800' },
                    { label: 'Active Users', value: summary.activeUsers.toLocaleString(), change: '+15.2%', up: true, color: '#f44336' },
                ].map((kpi, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Paper sx={{ p: 3, borderTop: `4px solid ${kpi.color}`, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                            <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>{kpi.value}</Typography>
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
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Live Sales & Profit Trend</Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="p" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#8884d8" name="Sales (₹)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" fill="#82ca9d" name="Profit (₹)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Category Contribution</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={productData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="profitMargin"
                                    label={({ name }) => name}>
                                    {productData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ mt: 2 }}>
                            {productData.map((item, i) => (
                                <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i] }} />
                                        <Typography variant="body2">{item.name}</Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold">{item.profitMargin.toFixed(1)}%</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Data Table */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">Raw Data (Live Ticker)</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: '#f5f5f5', textColor: '#000' }}>
                            <TableRow>
                                <TableCell><strong>Month</strong></TableCell>
                                <TableCell align="right"><strong>Sales (₹)</strong></TableCell>
                                <TableCell align="right"><strong>Profit (₹)</strong></TableCell>
                                <TableCell align="right"><strong>Price (₹)</strong></TableCell>
                                <TableCell align="right"><strong>Complaints</strong></TableCell>
                                <TableCell align="right"><strong>Market Status</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesData.map((row) => (
                                <TableRow key={row.p}>
                                    <TableCell>{row.p}</TableCell>
                                    <TableCell align="right">{row.sales.toLocaleString()}</TableCell>
                                    <TableCell align="right">{row.profit.toLocaleString()}</TableCell>
                                    <TableCell align="right">₹{row.price}</TableCell>
                                    <TableCell align="right">{row.complaints}</TableCell>
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
