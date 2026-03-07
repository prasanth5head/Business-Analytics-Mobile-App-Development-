import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Skeleton,
    Button, Snackbar, Alert, useTheme, Grid, Card, CardContent
} from '@mui/material';
import { DeleteOutline, History as HistoryIcon, AccessTime, Assessment, TrendingUp, TrendingDown, AccountBalanceWallet } from '@mui/icons-material';
import api from '../api';

export default function EntryHistory() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [clearing, setClearing] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'info' });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const headers = { Authorization: `Bearer ${userInfo?.token}` };
            const response = await api.get('/api/market/revenue', { headers });

            // For history, keep the newest entries at the top
            setData(response.data);
        } catch (err) {
            setSnack({ open: true, msg: 'Error fetching history entries.', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (!window.confirm("⚠️ DANGER: This will permanently delete ALL manual revenue history across the entire system. Are you absolutely sure?")) return;

        setClearing(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const headers = { Authorization: `Bearer ${userInfo?.token}` };
            await api.delete('/api/market/revenue', { headers });
            setData([]);
            setSnack({ open: true, msg: '🗑️ All manual entry history permanently deleted.', severity: 'success' });
        } catch (err) {
            setSnack({ open: true, msg: '❌ Failed to clear history.', severity: 'error' });
        }
        setClearing(false);
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="rectangular" height={100} sx={{ mb: 4, borderRadius: 4 }} />
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
            </Box>
        );
    }

    const groupedData = [];
    for (let i = 0; i < data.length; i += 12) {
        groupedData.push(data.slice(i, i + 12));
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-end">
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', mb: 1 }}>
                        Entry <span style={{ color: theme.palette.primary.main }}>History</span>
                    </Typography>
                    <Typography color="text.secondary" variant="body1">
                        A raw chronological log of every single manual data entry.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<DeleteOutline />}
                    onClick={handleClearHistory}
                    disabled={clearing || data.length === 0}
                    sx={{
                        borderRadius: 3, fontWeight: 800, px: 3, height: 48,
                        borderColor: '#f44336', color: '#f44336',
                        '&:hover': { borderColor: '#d32f2f', bgcolor: 'rgba(244,67,54,0.05)' }
                    }}
                >
                    {clearing ? 'Deleting...' : 'Clear All History'}
                </Button>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip icon={<HistoryIcon />} label={`${data.length} Total Records Found`} sx={{ fontWeight: 800, p: 2, bgcolor: theme.palette.primary.main, color: 'white' }} />
                <Typography variant="body2" color="text.secondary">
                    All historical data is preserved appending from your Revenue Entry inputs. Clearing this logs will reset all predictive metrics.
                </Typography>
            </Paper>

            {groupedData.map((batch, index) => {
                const batchSummary = batch.reduce((acc, curr) => ({
                    totalRevenue: acc.totalRevenue + curr.amount,
                    totalProfit: acc.totalProfit + (curr.profit || 0),
                    totalLoss: acc.totalLoss + (curr.loss || 0)
                }), { totalRevenue: 0, totalProfit: 0, totalLoss: 0 });
                const netProfit = batchSummary.totalProfit - batchSummary.totalLoss;

                return (
                    <Box key={index} mb={6}>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2, borderBottom: `4px solid ${theme.palette.primary.main}`, paddingBottom: 1 }}>
                            Entry Batch {groupedData.length - index}
                            <Chip
                                label={`Submitted: ${new Date(batch[0]?.createdAt).toLocaleString()}`}
                                size="small"
                                sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                            />
                        </Typography>

                        {/* Stats Cards for the Batch */}
                        <Grid container spacing={2} mb={3}>
                            {[
                                { label: 'Total Revenue', value: batchSummary.totalRevenue, icon: <AccountBalanceWallet />, color: '#4caf50' },
                                { label: 'Total Profit', value: batchSummary.totalProfit, icon: <TrendingUp />, color: '#2196f3' },
                                { label: 'Total Loss', value: batchSummary.totalLoss, icon: <TrendingDown />, color: '#f44336' },
                                { label: 'Net Earnings', value: netProfit, icon: <Assessment />, color: netProfit >= 0 ? '#4caf50' : '#f44336' }
                            ].map((stat, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <Card sx={{
                                        background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 3,
                                    }}>
                                        <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    {stat.label}
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                                                    ₹{stat.value.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${stat.color}15`, color: stat.color }}>
                                                {stat.icon}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <TableContainer component={Paper} sx={{
                            borderRadius: 4, background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.6)' : theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`, overflow: 'hidden',
                            boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)'
                        }}>
                            <Table>
                                <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.primary', py: 2.5 }}>MONTH</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.primary' }}>CATEGORY</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.primary' }}>REVENUE</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.primary' }}>PROFIT</TableCell>
                                        <TableCell sx={{ fontWeight: 900, color: 'text.primary' }}>LOSS</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {batch.map((row) => (
                                        <TableRow key={row._id} sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
                                            <TableCell>
                                                <Chip label={row.month} size="small" variant="outlined" sx={{ fontWeight: 800, color: 'text.primary', borderColor: 'divider' }} />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>
                                                {row.product || 'All'}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: theme.palette.primary.main }}>₹{(row.amount || 0).toLocaleString()}</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: row.profit >= 0 ? '#4caf50' : '#f44336' }}>₹{(row.profit || 0).toLocaleString()}</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#f44336' }}>₹{(row.loss || 0).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );
            })}

            <Snackbar
                open={snack.open}
                autoHideDuration={6000}
                onClose={() => setSnack({ ...snack, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%', borderRadius: 3, fontWeight: 700 }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
}
