import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Skeleton,
    Grid, Card, CardContent, Divider, useTheme, Select, MenuItem, FormControl,
    Button as MuiButton
} from '@mui/material';
import {
    Assessment, TrendingUp, TrendingDown, AccountBalanceWallet,
    AccessTime, Print as PrintIcon
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { useMyBusiness } from '../../context/MyBusinessContext';

export default function MyReports() {
    const theme = useTheme();
    const { businessData, loading, refreshData } = useMyBusiness();
    const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);

    const handlePrint = () => {
        window.print();
    };

    if (loading && !businessData) {
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

    if (!businessData || businessData.salesData.filter(d => d.sales > 0).length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">No reports available yet. Add business data to generate your personalized reports.</Typography>
            </Box>
        );
    }

    const { salesData, productData, summary } = businessData;

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
                        Business Performance <span style={{ color: theme.palette.secondary.main }}>Report</span>
                    </Typography>
                    <Typography color="text.secondary" variant="body1">
                        Comprehensive audit of your personalized business entries.
                    </Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                    <MuiButton
                        variant="contained"
                        color="secondary"
                        startIcon={<PrintIcon />}
                        onClick={handlePrint}
                        className="no-print"
                        sx={{ borderRadius: 3, fontWeight: 800, px: 3 }}
                    >
                        Export PDF
                    </MuiButton>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
                {[
                    { label: 'Total Revenue', value: summary.totalSales, icon: <AccountBalanceWallet />, color: theme.palette.primary.main },
                    { label: 'Net Profit', value: summary.totalSales - summary.totalLoss, icon: <TrendingUp />, color: theme.palette.success.main },
                    { label: 'Total Loss', value: summary.totalLoss, icon: <TrendingDown />, color: theme.palette.error.main },
                    { label: 'Avg Monthly', value: summary.avgProfit, icon: <Assessment />, color: theme.palette.secondary.main }
                ].map((stat, i) => (
                    <Grid item xs={12} sm={6} md={3} key={i}>
                        <Card sx={{
                            background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 4,
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
                <Grid item xs={12}>
                    <Paper sx={{
                        p: 3, borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Growth Performance (Manual History)</Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer>
                                <AreaChart data={salesData.filter(d => d.sales > 0)}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                    <XAxis dataKey="p" stroke={theme.palette.text.secondary} fontSize={12} fontWeight={700} />
                                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} fontWeight={700} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
                                        itemStyle={{ fontWeight: 700 }}
                                    />
                                    <Legend />
                                    <Area type="monotone" dataKey="sales" name="Revenue" stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="profit" name="Profit" stroke={theme.palette.success.main} fillOpacity={0} strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{
                        p: 3, borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Loss Composition Analysis</Typography>
                        <Box sx={{ height: 400, width: '100%' }}>
                            <ResponsiveContainer>
                                <BarChart data={salesData.filter(d => d.sales > 0)} margin={{ bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                    <XAxis
                                        dataKey="p"
                                        stroke={theme.palette.text.secondary}
                                        fontSize={14}
                                        fontWeight={900}
                                        padding={{ left: 30, right: 30 }}
                                    />
                                    <YAxis stroke={theme.palette.text.secondary} fontSize={12} fontWeight={700} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
                                    />
                                    <Legend />
                                    <Bar dataKey="loss" name="Loss Amount (₹)" fill={theme.palette.error.main} radius={[6, 6, 0, 0]} barSize={60} />
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
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>REVENUE (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>PROFIT (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>LOSS (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'text.primary' }}>NET STATUS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {salesData.filter(row => row.sales > 0 || row.loss > 0).map((row, idx) => (
                            <TableRow key={idx} sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
                                <TableCell>
                                    <Chip label={row.p} size="small" sx={{ bgcolor: theme.palette.secondary.main, fontWeight: 800, color: 'white' }} />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>₹{row.sales.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: theme.palette.success.main }}>₹{row.profit.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: theme.palette.error.main }}>₹{row.loss.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={row.profit >= row.loss ? 'PROFITABLE' : 'LOSS'}
                                        size="small"
                                        sx={{
                                            fontWeight: 900,
                                            bgcolor: row.profit >= row.loss ? theme.palette.success.main + '20' : theme.palette.error.main + '20',
                                            color: row.profit >= row.loss ? theme.palette.success.main : theme.palette.error.main
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
