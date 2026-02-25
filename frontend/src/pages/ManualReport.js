import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Skeleton,
    Grid, Card, CardContent, Divider, useTheme
} from '@mui/material';
import {
    Assessment, TrendingUp, TrendingDown, AccountBalanceWallet,
    EventNote, AccessTime, Print as PrintIcon
} from '@mui/icons-material';
import { Button as MuiButton } from '@mui/material';
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

    const handlePrint = () => {
        window.print();
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
        <Box sx={{
            p: { xs: 2, md: 4 },
            maxWidth: 1200,
            mx: 'auto',
            '@media print': {
                p: 0,
                m: 0,
                maxWidth: '100%',
                '& .no-print': { display: 'none' },
                'header, .MuiAppBar-root, .MuiDrawer-root, nav': { display: 'none' },
                main: { p: 0, m: 0 },
                '.MuiToolbar-root': { display: 'none' },
                color: 'black !important',
                background: 'white !important',
                '.MuiPaper-root': { boxShadow: 'none', border: '1px solid #eee', background: 'white !important' },
                '.MuiTypography-root': { color: 'black !important' },
                '.MuiChip-root': { border: '1px solid #ccc', background: 'none !important', color: 'black !important' }
            }
        }}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', mb: 1 }}>
                        Manual Revenue <span style={{ color: theme.palette.primary.main }}>Report</span>
                    </Typography>
                    <Typography color="text.secondary" variant="body1">
                        Comprehensive analysis of your manually entered financial data.
                    </Typography>
                </Box>
                <MuiButton
                    variant="contained"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                    className="no-print"
                    sx={{ borderRadius: 3, fontWeight: 800, px: 3 }}
                >
                    Print Report
                </MuiButton>
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
                            background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.palette.divider}`,
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
                                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
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
                        p: 3, borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`
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
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} fontWeight={700} />
                                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} fontWeight={700} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
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
                        p: 3, borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`, height: '100%'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Loss Analysis</Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} fontWeight={700} />
                                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} fontWeight={700} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
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
                borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`, overflow: 'hidden'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary', py: 2.5 }}>MONTH</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>CATEGORY</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>REVENUE (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>PROFIT (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>LOSS (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>NET (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>DATE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row._id} sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
                                <TableCell>
                                    <Chip label={row.month} size="small" sx={{ bgcolor: 'primary.main', fontWeight: 800, color: 'white' }} />
                                </TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    {row.product || 'All'}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>₹{(row.amount || 0).toLocaleString()}</TableCell>
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
