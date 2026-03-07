import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Alert, Snackbar, MenuItem, Chip, Divider, useTheme
} from '@mui/material';
import { AddCircleOutline, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMyBusiness } from '../context/MyBusinessContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PRODUCTS = [
    'Retail Clothing (<₹1k)', 'Retail Clothing (>₹1k)', 'Electronics (Mobiles)', 'Electronics (Laptops)',
    'Supermarket (Grocery)', 'Restaurant / Food Court', 'Cinema Theatre', 'Gaming Zone',
    'Salon / Spa', 'Jewellery Shop', 'Footwear', 'Parking (Mall Income)',
    'Mobile Accessories', 'Book Store', 'Toy Store', 'Optical Shop', 'Watch Store',
    'Gym / Fitness Center', 'Gift Shop', 'Ice Cream Shop', 'Pharmacy', 'ATM / Banking',
    'Tattoo Shop', 'Photo Studio', 'Pet Shop', 'Sweet Shop', 'Flower Shop'
];

export default function RevenueEntry() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { refreshData, totalRecords: currentTotal } = useMyBusiness();

    const [rows, setRows] = useState(
        MONTHS.map(m => ({ month: m, product: '', revenue: '', profit: '', loss: 0 }))
    );
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
    const [saving, setSaving] = useState(false);

    const handleChange = (index, field, value) => {
        setRows(prev => {
            const updated = [...prev];
            let newVal = value;

            // Auto-calculate loss if profit is changed
            let updatedRow = { ...updated[index], [field]: newVal };
            if (field === 'profit') {
                const profitVal = Number(value) || 0;
                updatedRow.loss = profitVal < 0 ? Math.abs(profitVal) : 0;
            }

            updated[index] = updatedRow;
            return updated;
        });
    };

    const handleSave = async () => {
        const toSave = rows.filter(r => r.revenue && r.month);
        if (toSave.length === 0) {
            setSnack({ open: true, msg: 'Please enter at least one month of revenue data.', severity: 'warning' });
            return;
        }

        setSaving(true);
        try {
            const formattedRecords = toSave.map(row => ({
                month: row.month,
                product: row.product || 'All',
                amount: Number(row.revenue),
                profit: Number(row.profit) || 0,
                loss: Number(row.profit) < 0 ? Math.abs(Number(row.profit)) : 0
            }));

            await api.post('/api/market/revenue-bulk', { records: formattedRecords });

            const newTotal = currentTotal + formattedRecords.length;

            if (newTotal >= 12 && currentTotal < 12) {
                setSnack({ open: true, msg: '🚀 Business Analytics Unlocked! Your insights are now ready.', severity: 'success' });
                setTimeout(() => {
                    navigate('/my-business/dashboard');
                }, 2000);
            } else {
                setSnack({ open: true, msg: `✅ ${toSave.length} records added successfully!`, severity: 'success' });
            }

            // Refresh context data
            await refreshData();

            // Clear the form fields after successful save
            setRows(MONTHS.map(m => ({ month: m, product: '', revenue: '', profit: '', loss: 0 })));
        } catch (err) {
            setSnack({ open: true, msg: '❌ Failed to add records. Please try again.', severity: 'error' });
        }
        setSaving(false);
    };

    // Totals
    const totalRevenue = rows.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
    const totalProfit = rows.reduce((s, r) => s + (Number(r.profit) || 0), 0);
    const totalLoss = rows.reduce((s, r) => s + (Number(r.loss) || 0), 0);
    const netProfit = totalProfit; // Since profit is net, netProfit is just sum of all profits (some might be negative)
    // Actually, based on User logic: Revenue - Profit = Expense. If Profit < 0 -> Loss.
    // If we show Loss as a separate column, it's just the absolute value of negative profit.

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
            {/* Header */}
            <Box mb={3}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
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
            <Paper sx={{
                borderRadius: 3,
                overflow: 'hidden',
                background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.9)' : theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`
            }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ background: theme.palette.mode === 'dark' ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.08)' }}>
                                {['Month', 'Product Category', 'Revenue (₹)', 'Profit (₹)', 'Loss (₹)'].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 800, color: 'text.primary', py: 1.5, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                                            bgcolor: 'rgba(14,165,233,0.15)', color: '#0EA5E9',
                                            fontWeight: 700, fontSize: '0.75rem'
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select size="small" fullWidth
                                            value={row.product}
                                            onChange={e => handleChange(i, 'product', e.target.value)}
                                            variant="standard"
                                            InputProps={{ disableUnderline: true, sx: { color: 'text.primary', fontSize: '0.85rem' } }}
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
                                                disabled={field === 'loss'}
                                                InputProps={{
                                                    readOnly: field === 'loss',
                                                    disableUnderline: true,
                                                    sx: {
                                                        color: field === 'loss' ? '#f44336' : field === 'profit' ? '#4caf50' : 'text.primary',
                                                        fontSize: '0.9rem', fontWeight: 700
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {/* Totals Row */}
                            <TableRow sx={{ background: 'rgba(14,165,233,0.08)' }}>
                                <TableCell colSpan={2} sx={{ fontWeight: 900, color: 'white' }}>TOTAL</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: '#4caf50' }}>₹{totalRevenue.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: '#2196f3' }}>₹{totalProfit.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: '#f44336' }}>₹{totalLoss.toLocaleString()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Action Buttons */}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                        background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                        borderRadius: 3, fontWeight: 800, px: 4,
                        '&:hover': { background: 'linear-gradient(135deg, #06B6D4, #0EA5E9)' }
                    }}
                >
                    {saving ? 'Processing...' : 'Save Records'}
                </Button>
            </Box>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
                <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
