import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Alert, Snackbar, MenuItem, Chip, useTheme
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMyBusiness } from '../context/MyBusinessContext';
import api from '../api';

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
            const updatedRow = { ...updated[index], [field]: value };

            // Calculate loss dynamically: Revenue - Profit
            const revVal = Number(field === 'revenue' ? value : updatedRow.revenue) || 0;
            const proVal = Number(field === 'profit' ? value : updatedRow.profit) || 0;
            updatedRow.loss = revVal - proVal;

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
                loss: Number(row.revenue) - (Number(row.profit) || 0)
            }));

            await api.post('/api/market/revenue-bulk', { records: formattedRecords });

            setSnack({ open: true, msg: `✅ ${toSave.length} records added successfully! Redirecting...`, severity: 'success' });

            // Refresh context data
            await refreshData();

            // Clear the form fields after successful save
            setRows(MONTHS.map(m => ({ month: m, product: '', revenue: '', profit: '', loss: 0 })));

            // Navigate to Dashboard after a short delay
            setTimeout(() => {
                navigate('/my-business/dashboard');
            }, 1500);
        } catch (err) {
            console.error("Save error:", err);
            setSnack({ open: true, msg: '❌ Failed to add records. Please try again.', severity: 'error' });
        }
        setSaving(false);
    };

    // Totals
    const totalRevenue = rows.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
    const totalProfit = rows.reduce((s, r) => s + (Number(r.profit) || 0), 0);
    const totalLoss = rows.reduce((s, r) => s + (Number(r.loss) || 0), 0);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: '-0.04em' }}>
                    Annual Profit / Loss Entry
                </Typography>
                <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 500 }}>
                    Populate your 12-month financial records. System reflects these in real-time analytics.
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Box display="flex" gap={2} flexWrap="wrap" mb={4}>
                {[
                    { label: 'Cumulative Revenue', value: totalRevenue, color: theme.palette.primary.main },
                    { label: 'Cumulative Profit', value: totalProfit, color: theme.palette.success.main },
                    { label: 'Computed Net Loss', value: totalLoss, color: theme.palette.error.main },
                ].map(card => (
                    <Paper key={card.label} sx={{
                        px: 3, py: 3, borderRadius: 4, minWidth: 200, flex: 1,
                        border: `1px solid ${theme.palette.divider}`,
                        borderLeft: `6px solid ${card.color}`,
                        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'white'
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {card.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: card.color }}>
                            ₹{card.value.toLocaleString()}
                        </Typography>
                    </Paper>
                ))}
            </Box>

            {/* Table */}
            <Paper sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.5)' : 'white',
                border: `1px solid ${theme.palette.divider}`
            }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                {['Month', 'Category', 'Revenue (₹)', 'Profit (₹)', 'Loss (₹)'].map(h => (
                                    <TableCell key={h} sx={{ fontWeight: 900, color: 'text.primary', py: 2.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, i) => (
                                <TableRow key={i} sx={{
                                    '&:hover': { background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
                                    borderBottom: `1px solid ${theme.palette.divider}`
                                }}>
                                    <TableCell>
                                        <Chip label={row.month} size="small" sx={{
                                            bgcolor: `${theme.palette.primary.main}15`, color: theme.palette.primary.main,
                                            fontWeight: 900, fontSize: '0.75rem', borderRadius: 1.5
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select size="small" fullWidth
                                            value={row.product}
                                            onChange={e => handleChange(i, 'product', e.target.value)}
                                            variant="standard"
                                            InputProps={{ disableUnderline: true, sx: { color: 'text.primary', fontSize: '0.85rem', fontWeight: 700 } }}
                                        >
                                            <MenuItem value=""><em>Select Product</em></MenuItem>
                                            {PRODUCTS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                        </TextField>
                                    </TableCell>
                                    {['revenue', 'profit', 'loss'].map(field => (
                                        <TableCell key={field}>
                                            <TextField
                                                type="number" size="small" fullWidth
                                                placeholder="0.00"
                                                value={row[field]}
                                                onChange={e => handleChange(i, field, e.target.value)}
                                                variant="standard"
                                                disabled={field === 'loss'}
                                                InputProps={{
                                                    readOnly: field === 'loss',
                                                    disableUnderline: true,
                                                    sx: {
                                                        color: field === 'loss' && Number(row.loss) > 0 ? theme.palette.error.main : field === 'profit' ? theme.palette.success.main : 'text.primary',
                                                        fontSize: '0.9rem', fontWeight: 900
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            <TableRow sx={{ background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                                <TableCell colSpan={2} sx={{ fontWeight: 900, color: 'text.primary', fontSize: '0.9rem' }}>AGGREGATE TOTAL</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: theme.palette.primary.main, fontSize: '1rem' }}>₹{totalRevenue.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: theme.palette.success.main, fontSize: '1rem' }}>₹{totalProfit.toLocaleString()}</TableCell>
                                <TableCell sx={{ fontWeight: 900, color: theme.palette.error.main, fontSize: '1rem' }}>₹{totalLoss.toLocaleString()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 10px 20px ${theme.palette.primary.main}40`,
                        borderRadius: 3, fontWeight: 900, px: 6, py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': { background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})` }
                    }}
                >
                    {saving ? 'Processing Audit...' : 'Commit Financial Data'}
                </Button>
            </Box>

            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
                <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 800 }}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}
