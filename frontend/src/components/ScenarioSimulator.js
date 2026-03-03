import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, Slider, Stack, Divider, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const ScenarioSimulator = ({ initialSales = 10000 }) => {
    const [revenueChange, setRevenueChange] = useState(0);
    const [expenseChange, setExpenseChange] = useState(0);
    const [projectedSales, setProjectedSales] = useState(initialSales);
    const [projectedProfit, setProjectedProfit] = useState(initialSales * 0.3);

    useEffect(() => {
        const newSales = initialSales * (1 + revenueChange / 100);
        const currentExpenses = initialSales * 0.7;
        const newExpenses = currentExpenses * (1 + expenseChange / 100);
        setProjectedSales(Math.round(newSales));
        setProjectedProfit(Math.round(newSales - newExpenses));
    }, [revenueChange, expenseChange, initialSales]);

    return (
        <Card sx={{ p: 4, borderRadius: 5, background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(15, 15, 30, 0.9))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', color: '#fff' }}>
                <TrendingUp size={24} style={{ marginRight: 12, color: '#4caf50' }} />
                SCENARIO SIMULATOR
            </Typography>

            <Stack spacing={4}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>REVENUE CHANGE</Typography>
                        <Chip label={`${revenueChange}%`} color={revenueChange >= 0 ? 'success' : 'error'} size="small" variant="outlined" />
                    </Box>
                    <Slider
                        value={revenueChange}
                        onChange={(e, val) => setRevenueChange(val)}
                        min={-50}
                        max={100}
                        marks
                        sx={{ color: '#4caf50' }}
                    />
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>EXPENSE ADJUSTMENT</Typography>
                        <Chip label={`${expenseChange > 0 ? '+' : ''}${expenseChange}%`} color={expenseChange <= 0 ? 'success' : 'error'} size="small" variant="outlined" />
                    </Box>
                    <Slider
                        value={expenseChange}
                        onChange={(e, val) => setExpenseChange(val)}
                        min={-50}
                        max={100}
                        marks
                        sx={{ color: '#f44336' }}
                    />
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Typography variant="caption" display="block" color="rgba(255, 255, 255, 0.5)">PROJECTED SALES</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>₹{projectedSales.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Typography variant="caption" display="block" color="rgba(255, 255, 255, 0.5)">PROJECTED PROFIT</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: projectedProfit >= 0 ? '#4caf50' : '#f44336' }}>
                            ₹{projectedProfit.toLocaleString()}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Card>
    );
};

export default ScenarioSimulator;
