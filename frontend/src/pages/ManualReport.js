import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Skeleton,
    Grid, Card, CardContent, Divider, useTheme
} from '@mui/material';
import {
    Assessment, TrendingUp, TrendingDown, AccountBalanceWallet,
    EventNote, AccessTime
} from '@mui/icons-material';
import api from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';

export default function ManualReport() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0
    });

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const headers = { Authorization: `Bearer ${userInfo?.token}` };
            const response = await api.get('/api/market/revenue', { headers });

            // Format data - group by month if duplicates exist, or just show list
            const sortedData = response.data.sort((a, b) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.indexOf(a.month) - months.indexOf(b.month);
            });

            setData(sortedData);

            // Aggregate data for charts (group by month)
            const chartsMap = sortedData.reduce((acc, curr) => {
                if (!acc[curr.month]) {
                    acc[curr.month] = { month: curr.month, amount: 0, profit: 0, loss: 0 };
                }
                acc[curr.month].amount += curr.amount;
                acc[curr.month].profit += (curr.profit || 0);
                acc[curr.month].loss += (curr.loss || 0);
                return acc;
            }, {});

            const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const aggregatedData = monthsOrder
                .filter(m => chartsMap[m])
                .map(m => chartsMap[m]);

            setChartData(aggregatedData);

            const totals = sortedData.reduce((acc, curr) => ({
                totalRevenue: acc.totalRevenue + curr.amount,
                totalProfit: acc.totalProfit + (curr.profit || 0),
                totalLoss: acc.totalLoss + (curr.loss || 0)
            }), { totalRevenue: 0, totalProfit: 0, totalLoss: 0 });

            setSummary({
                ...totals,
                netProfit: totals.totalProfit - totals.totalLoss
            });
        } catch (err) {
            console.error('Error fetching report:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="rectangular" height={100} sx={{ mb: 4, borderRadius: 4 }} />
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 4 }} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', letterSpacing: '-0.02em', mb: 1 }}>
                        Manual Revenue <span style={{ color: theme.palette.primary.main }}>Report</span>
                    </Typography>
                    <Typography color="text.secondary" variant="body1">
                        Comprehensive analysis of your manually entered financial data.
                    </Typography>
                </Box>
                <Chip icon={<Assessment />} label="Real-time Data" sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 700, p: 2 }} />
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
                {[
                    { label: 'Total Revenue', value: summary.totalRevenue, icon: <AccountBalanceWallet />, color: '#4caf50' },
                    { label: 'Total Profit', value: summary.totalProfit, icon: <TrendingUp />, color: '#2196f3' },
                    { label: 'Total Loss', value: summary.totalLoss, icon: <TrendingDown />, color: '#f44336' },
                    { label: 'Net Earnings', value: summary.netProfit, icon: <Assessment />, color: summary.netProfit >= 0 ? '#4caf50' : '#f44336' }
                ].map((stat, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{
                            background: 'rgba(20,20,20,0.6)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 4,
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: `${stat.color}15`,
                                        color: stat.color,
                                        mr: 2
                                    }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: 'white' }}>
                                    ₹{stat.value.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{
                        p: 3, borderRadius: 4, background: 'rgba(20,20,20,0.6)',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Revenue vs Profit Performance</Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} fontWeight={700} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} fontWeight={700} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: 8 }}
                                        itemStyle={{ fontWeight: 700 }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="amount" name="Revenue" stroke={theme.palette.primary.main} fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#4caf50" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 3, borderRadius: 4, background: 'rgba(20,20,20,0.6)',
                        border: '1px solid rgba(255,255,255,0.05)', height: '100%'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Loss Analysis</Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} fontWeight={700} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} fontWeight={700} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: 8 }}
                                    />
                                    <Bar dataKey="loss" name="Loss Amount" fill="#f44336" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Detailed Table */}
            <TableContainer component={Paper} sx={{
                borderRadius: 4, background: 'rgba(20,20,20,0.6)',
                border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: 'white', py: 2.5 }}>MONTH</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'white' }}>CATEGORY</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'white' }}>REVENUE (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'white' }}>PROFIT (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'white' }}>LOSS (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'white' }}>NET (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'white' }}>DATE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' } }}>
                                <TableCell>
                                    <Chip label={row.month} size="small" sx={{ bgcolor: 'primary.main', fontWeight: 800, color: 'white' }} />
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    {row.product || 'All'}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'white' }}>₹{(row.amount || 0).toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#4caf50' }}>₹{(row.profit || 0).toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#f44336' }}>₹{(row.loss || 0).toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: (row.profit - row.loss) >= 0 ? '#4caf50' : '#f44336' }}>
                                    ₹{((row.profit || 0) - (row.loss || 0)).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                    <Box display="flex" alignItems="center">
                                        <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                                        {new Date(row.createdAt).toLocaleDateString()}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
