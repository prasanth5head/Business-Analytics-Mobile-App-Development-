import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Skeleton,
    Button, Snackbar, Alert, useTheme, Grid, Card, CardContent
} from '@mui/material';
import { DeleteOutline, History as HistoryIcon, AccessTime, Assessment, TrendingUp, TrendingDown, AccountBalanceWallet, Restore } from '@mui/icons-material';
import api from '../api';

export default function EntryHistory() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [clearing, setClearing] = useState(false);
    const [restoring, setRestoring] = useState(false);
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
        if (!window.confirm("⚠️ This will clear your history globally from reports, but it will be preserved here. Are you sure?")) return;

        setClearing(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const headers = { Authorization: `Bearer ${userInfo?.token}` };
            await api.delete('/api/market/revenue', { headers });
            await fetchHistory();
            setSnack({ open: true, msg: '🗑️ History cleared from global reports.', severity: 'success' });
        } catch (err) {
            setSnack({ open: true, msg: '❌ Failed to clear history.', severity: 'error' });
        }
        setClearing(false);
    };

    const handleRestoreHistory = async () => {
        setRestoring(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const headers = { Authorization: `Bearer ${userInfo?.token}` };
            await api.put('/api/market/revenue/restore', {}, { headers });
            await fetchHistory();
            setSnack({ open: true, msg: '♻️ All history restored globally.', severity: 'success' });
        } catch (err) {
            setSnack({ open: true, msg: '❌ Failed to restore history.', severity: 'error' });
        }
        setRestoring(false);
    };

    const handleClearBatch = async (batch) => {
        if (!window.confirm("⚠️ This will clear this specific batch of entries globally from reports. Are you sure?")) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const headers = { Authorization: `Bearer ${userInfo?.token}` };
            const ids = batch.map(r => r._id);
            await api.put('/api/market/revenue/batch/clear', { ids }, { headers });
            await fetchHistory();
            setSnack({ open: true, msg: '🗑️ Batch cleared from global reports.', severity: 'success' });
        } catch (err) {
            setSnack({ open: true, msg: '❌ Failed to clear batch.', severity: 'error' });
        }
    };

    const handleRestoreBatch = async (batch) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const headers = { Authorization: `Bearer ${userInfo?.token}` };
            const ids = batch.map(r => r._id);
            await api.put('/api/market/revenue/batch/restore', { ids }, { headers });
            await fetchHistory();
            setSnack({ open: true, msg: '♻️ Batch restored globally.', severity: 'success' });
        } catch (err) {
            setSnack({ open: true, msg: '❌ Failed to restore batch.', severity: 'error' });
        }
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
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<Restore />}
                        onClick={handleRestoreHistory}
                        disabled={restoring || data.length === 0}
                        sx={{
                            borderRadius: 3, fontWeight: 800, px: 3, height: 48,
                            borderColor: '#4caf50', color: '#4caf50',
                            '&:hover': { borderColor: '#388e3c', bgcolor: 'rgba(76,175,80,0.05)' }
                        }}
                    >
                        {restoring ? 'Restoring...' : 'Restore History'}
                    </Button>
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
                        {clearing ? 'Deleting...' : 'Clear Global Data'}
                    </Button>
                </Box>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, borderBottom: `4px solid ${theme.palette.primary.main}`, paddingBottom: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 2, m: 0 }}>
                                Entry Batch {groupedData.length - index}
                                <Chip
                                    label={`Submitted: ${new Date(batch[0]?.createdAt).toLocaleString()}`}
                                    size="small"
                                    sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                                />
                            </Typography>
                            <Box display="flex" gap={1}>
                                <Button size="small" variant="outlined" startIcon={<Restore />} onClick={() => handleRestoreBatch(batch)} sx={{ borderRadius: 2, fontWeight: 700, color: '#4caf50', borderColor: '#4caf50', '&:hover': { bgcolor: 'rgba(76,175,80,0.05)' } }}>
                                    Restore Batch
                                </Button>
                                <Button size="small" variant="outlined" startIcon={<DeleteOutline />} onClick={() => handleClearBatch(batch)} sx={{ borderRadius: 2, fontWeight: 700, color: '#f44336', borderColor: '#f44336', '&:hover': { bgcolor: 'rgba(244,67,54,0.05)' } }}>
                                    Clear Batch
                                </Button>
                            </Box>
                        </Box>

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
                                        <TableRow key={row._id} sx={{ opacity: row.isDeleted ? 0.6 : 1, '&:hover': { bgcolor: theme.palette.action.hover } }}>
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Chip label={row.month} size="small" variant="outlined" sx={{ fontWeight: 800, color: 'text.primary', borderColor: 'divider' }} />
                                                    {row.isDeleted && <Chip label="Cleared" size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />}
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.primary', fontWeight: 700, textDecoration: row.isDeleted ? 'line-through' : 'none' }}>
                                                {row.product || 'All'}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: theme.palette.primary.main, textDecoration: row.isDeleted ? 'line-through' : 'none' }}>₹{(row.amount || 0).toLocaleString()}</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: row.profit >= 0 ? '#4caf50' : '#f44336', textDecoration: row.isDeleted ? 'line-through' : 'none' }}>₹{(row.profit || 0).toLocaleString()}</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#f44336', textDecoration: row.isDeleted ? 'line-through' : 'none' }}>₹{(row.loss || 0).toLocaleString()}</TableCell>
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
