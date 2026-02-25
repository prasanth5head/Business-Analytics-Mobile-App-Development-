import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Alert, Snackbar, MenuItem, Chip, Divider
} from '@mui/material';
import { AddCircleOutline, Save } from '@mui/icons-material';
import api from '../api';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PRODUCTS = ['Electronics', 'Clothing', 'Home', 'Beauty'];

const emptyRow = () => ({
    month: '', product: '', revenue: '', profit: '', loss: ''
});

export default function RevenueEntry() {
    const [rows, setRows] = useState(
        MONTHS.map(m => ({ month: m, product: '', revenue: '', profit: '', loss: '' }))
    );
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    const [saving, setSaving] = useState(false);

    const handleChange = (index, field, value) => {
        setRows(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token;
            const headers = { Authorization: `Bearer ${token}` };

            const toSave = rows.filter(r => r.revenue && r.month);
            for (const row of toSave) {
                await api.post('/api/market/revenue', {
                    month: row.month,
                    product: row.product || 'All',
                    amount: Number(row.revenue),
                    profit: Number(row.profit) || 0,
                    loss: Number(row.loss) || 0
                }, { headers });
            }
            setSnack({ open: true, msg: `✅ ${toSave.length} months saved successfully!`, severity: 'success' });
        } catch (err) {
            setSnack({ open: true, msg: '❌ Failed to save data. Please try again.', severity: 'error' });
        }
        setSaving(false);
    };

    // Totals
    const totalRevenue = rows.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
    const totalProfit = rows.reduce((s, r) => s + (Number(r.profit) || 0), 0);
    const totalLoss = rows.reduce((s, r) => s + (Number(r.loss) || 0), 0);
    const netProfit = totalProfit - totalLoss;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
            {/* Header */}
            <Box mb={3}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'white', mb: 0.5 }}>
                    📊 Annual Revenue Entry
                </Typography>
                <Typography color="text.secondary" variant="body2">
                    Enter your 12-month revenue, profit, and loss data. Saved data is reflected on the Dashboard.
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
                {[
                    { label: 'Total Revenue', value: totalRevenue, color: '#4caf50' },
                    { label: 'Total Profit', value: totalProfit, color: '#2196f3' },
                    { label: 'Total Loss', value: totalLoss, color: '#f44336' },
                    { label: 'Net Profit', value: netProfit, color: netProfit >= 0 ? '#4caf50' : '#f44336' },
                ].map(card => (
                    <Paper key={card.label} sx={{
                        px: 3, py: 2, borderRadius: 3, minWidth: 160, flex: 1,
                        borderLeft: `4px solid ${card.color}`,
                        background: 'rgba(255,255,255,0.04)'
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                            {card.label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: card.color }}>
                            ₹{card.value.toLocaleString()}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            {/* Table */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ background: 'rgba(255,94,0,0.12)' }}>
                                {['Month', 'Product Category', 'Revenue (₹)', 'Profit (₹)', 'Loss (₹)'].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 800, color: 'white', py: 1.5, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => (
                                <TableRow key={i} sx={{
                                    '&:hover': { background: 'rgba(255,255,255,0.03)' },
                                    borderBottom: '1px solid rgba(255,255,255,0.04)'
                                }}>
                                    <TableCell>
                                        <Chip label={row.month} size="small" sx={{
                                            bgcolor: 'rgba(255,94,0,0.15)', color: '#FF8A00',
                                            fontWeight: 700, fontSize: '0.75rem'
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select size="small" fullWidth
                                            value={row.product}
                                            onChange={e => handleChange(i, 'product', e.target.value)}
                                            variant="standard"
                                            InputProps={{ disableUnderline: true, sx: { color: 'white', fontSize: '0.85rem' } }}
                                        >
                                            <MenuItem value=""><em>All</em></MenuItem>
                                            {PRODUCTS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                        </TextField>
                                    </TableCell>
                                    {['revenue', 'profit', 'loss'].map(field => (
                                        <TableCell key={field}>
                                            <TextField
                                                type="number" size="small" fullWidth
                                                placeholder="0"
                                                value={row[field]}
                                                onChange={e => handleChange(i, field, e.target.value)}
                                                variant="standard"
                                                InputProps={{
                                                    disableUnderline: true,
                                                    sx: {
                                                        color: field === 'loss' ? '#f44336' : field === 'profit' ? '#4caf50' : 'white',
                                                        fontSize: '0.9rem', fontWeight: 700
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {/* Totals Row */}
                            <TableRow sx={{ background: 'rgba(255,94,0,0.08)' }}>
                                <TableCell colSpan={2} sx={{ fontWeight: 900, color: 'white' }}>TOTAL</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: '#4caf50' }}>₹{totalRevenue.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: '#2196f3' }}>₹{totalProfit.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: '#f44336' }}>₹{totalLoss.toLocaleString()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Save Button */}
            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                        background: 'linear-gradient(135deg, #FF5E00, #FF8A00)',
                        borderRadius: 3, fontWeight: 800, px: 4,
                        '&:hover': { background: 'linear-gradient(135deg, #FF8A00, #FF5E00)' }
                    }}
                >
                    {saving ? 'Saving...' : 'Save to Dashboard'}
                </Button>
            </Box>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
                <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
