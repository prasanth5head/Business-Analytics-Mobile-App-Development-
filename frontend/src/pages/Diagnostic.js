import React, { useState, useMemo } from 'react';
import {
    Box, Typography, Grid, Paper, Chip, Divider, Skeleton, Alert, Button, useTheme, Menu, MenuItem, Pagination
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, ComposedChart
} from 'recharts';
import { Refresh, CalendarToday, Search } from '@mui/icons-material';
import { useMarket } from '../context/MarketContext';

const FindingCard = ({ title, recommendation, year, type, confidence }) => {
    const theme = useTheme();
    return (
        <Paper sx={{
            p: 3, mb: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'background.paper',
            borderLeft: `6px solid ${type === 'Critical' ? theme.palette.error.main : type === 'Growth' ? theme.palette.success.main : theme.palette.primary.main}`,
            borderRadius: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateX(5px)', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.01)' }
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                    <Typography variant="h6" fontWeight="900" color="text.primary" sx={{ letterSpacing: '-0.02em' }}>{title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>FISCAL YEAR: {year}</Typography>
                </Box>
                <Chip label={`${confidence}% AI Confidence`} size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
            </Box>
            <Typography variant="body1" paragraph color="text.primary" sx={{ lineHeight: 1.7 }}>{recommendation}</Typography>
            <Chip label={type.toUpperCase()} size="small" sx={{ fontWeight: 900, bgcolor: 'divider', px: 1 }} />
        </Paper>
    );
};

const Diagnostic = () => {
    const theme = useTheme();
    const { marketData, loading, error, refreshData } = useMarket();
    const [selectedYear, setSelectedYear] = useState('All');
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const itemsPerPage = 5;

    const handleYearClick = (e) => setAnchorEl(e.currentTarget);
    const handleYearClose = (year) => {
        setAnchorEl(null);
        if (year) setSelectedYear(year);
        setPage(1);
    };

    if (loading && !marketData) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} width="40%" />
                <Skeleton variant="rectangular" height={300} sx={{ my: 4, borderRadius: 2 }} />
                <Grid container spacing={3}>
                    {[1, 2].map(i => (
                        <Grid item xs={12} md={6} key={i}><Skeleton variant="rectangular" height={250} /></Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;

    const { salesData = [], productData = [], strategicPriorities = [] } = marketData || {};

    const years = [...new Set(strategicPriorities.map(p => p.year))].sort((a, b) => b - a);

    const filteredPriorities = useMemo(() => {
        if (selectedYear === 'All') return strategicPriorities;
        return strategicPriorities.filter(p => p.year === parseInt(selectedYear) || p.year === selectedYear);
    }, [selectedYear, strategicPriorities]);

    const paginatedPriorities = filteredPriorities.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const filteredSalesData = useMemo(() => {
        if (selectedYear === 'All') return salesData.slice(-24);
        return salesData.filter(s => s.year === selectedYear);
    }, [selectedYear, salesData]);

    return (
        <Box sx={{ pb: 6 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Search sx={{ fontSize: 40, color: theme.palette.primary.main }} /> Diagnostic Intelligence
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Determining causal relationships and operational risks via Gemini AI.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                        icon={<CalendarToday />}
                        label={`Filtering: ${selectedYear}`}
                        onClick={handleYearClick}
                        onDelete={selectedYear !== 'All' ? () => handleYearClose('All') : undefined}
                        sx={{ pl: 1.5, pr: 1, py: 3, borderRadius: 3, fontWeight: 900, bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}` }}
                    />
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleYearClose()}>
                        <MenuItem onClick={() => handleYearClose('All')}>All Data</MenuItem>
                        {years.map(y => <MenuItem key={y} onClick={() => handleYearClose(y)}>{y}</MenuItem>)}
                    </Menu>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={refreshData}
                        disabled={loading}
                        sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 900 }}
                    >
                        Update Analysis
                    </Button>
                </Box>
            </Box>

            {/* AI Strategic Priorities (200 Records) */}
            <Grid container spacing={4} sx={{ mb: 5 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderLeft: `8px solid ${theme.palette.primary.main}`, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'white', border: `1px solid ${theme.palette.divider}` }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>
                                Primary AI Observations ({selectedYear})
                            </Typography>
                            <Chip label={`${filteredPriorities.length} ANALYSES`} color="primary" sx={{ fontWeight: 900 }} />
                        </Box>

                        {paginatedPriorities.map((rec, idx) => (
                            <FindingCard
                                key={idx}
                                title={rec.title}
                                recommendation={rec.recommendation}
                                year={rec.year}
                                type={rec.type}
                                confidence={rec.confidence}
                            />
                        ))}

                        {filteredPriorities.length > itemsPerPage && (
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    count={Math.ceil(filteredPriorities.length / itemsPerPage)}
                                    page={page}
                                    onChange={(e, v) => setPage(v)}
                                    color="primary"
                                    sx={{ '& .MuiPaginationItem-root': { fontWeight: 900, borderRadius: 2 } }}
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Correlation Chart */}
            <Paper sx={{ p: 4, mb: 5, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 900, color: 'text.primary' }}>Price Elasticity vs. Market Volume</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>Identifying performance shifts across fiscal cycles.</Typography>
                <ResponsiveContainer width="100%" height={450}>
                    <ComposedChart data={filteredSalesData}>
                        <CartesianGrid stroke={theme.palette.divider} vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="p" stroke={theme.palette.text.secondary} fontWeight={700} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} fontWeight={700} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} fontWeight={700} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                        <Legend wrapperStyle={{ fontWeight: 800, paddingTop: '20px' }} />
                        <Bar yAxisId="left" dataKey="sales" barSize={40} fill={theme.palette.primary.main} name="Sales Volume" radius={[6, 6, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="price" stroke={theme.palette.secondary.main} strokeWidth={4} name="Market Price (₹)" dot={{ r: 6, fill: theme.palette.secondary.main }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </Paper>

            {/* Risk Profiles */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 900, color: 'text.primary' }}>Complaint Density (Monthly)</Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={filteredSalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} fontWeight={700} axisLine={false} tickLine={false} />
                                <YAxis stroke={theme.palette.text.secondary} fontWeight={700} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }} />
                                <Line type="monotone" dataKey="complaints" stroke={theme.palette.error.main} strokeWidth={4} name="Complaints" dot={{ r: 6, fill: theme.palette.error.main }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 900, color: 'text.primary' }}>Category Margin vs. Returns</Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={productData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal={false} />
                                <XAxis type="number" stroke={theme.palette.text.secondary} fontWeight={700} axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" width={100} stroke={theme.palette.text.secondary} fontWeight={700} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper }} />
                                <Bar dataKey="profitMargin" fill={theme.palette.success.main} name="Margin %" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="returnRate" fill={theme.palette.error.main} name="Returns %" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Product Risk Cards */}
            <Box mt={6}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 900, color: 'text.primary' }}>Detailed Risk Stratification</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>Multi-factor assessment based on real operational telemetry.</Typography>
                <Grid container spacing={3}>
                    {productData.map((prod, i) => {
                        const risk = prod.risk || {};
                        const riskColor = risk.level === 'High Risk' ? theme.palette.error.main : risk.level === 'Moderate' ? theme.palette.warning.main : theme.palette.success.main;
                        const riskBg = risk.level === 'High Risk' ? `${theme.palette.error.main}08` : risk.level === 'Moderate' ? `${theme.palette.warning.main}08` : `${theme.palette.success.main}08`;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Paper sx={{
                                    p: 3, borderRadius: 4,
                                    border: `2px solid ${riskColor}`,
                                    background: riskBg,
                                    height: '100%',
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'scale(1.02)', boxShadow: `0 20px 40px ${riskColor}15` }
                                }}>
                                    <Box display="flex" justifyContent="space-between" mb={3}>
                                        <Typography sx={{ fontWeight: 900, fontSize: '1.1rem' }}>{prod.name}</Typography>
                                        <Chip label={risk.level} size="small" sx={{ bgcolor: riskColor, color: 'white', fontWeight: 900 }} />
                                    </Box>

                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Typography variant="h3" sx={{ fontWeight: 900, color: riskColor }}>{risk.score}</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Index Score</Typography>
                                    </Box>

                                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 3, mb: 3 }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}><Typography variant="caption" color="text.secondary" fontWeight="700">Margin:</Typography></Grid>
                                            <Grid item xs={6} textAlign="right"><Typography variant="caption" fontWeight="900" color="success.main">{prod.profitMargin}%</Typography></Grid>
                                            <Grid item xs={6}><Typography variant="caption" color="text.secondary" fontWeight="700">GST:</Typography></Grid>
                                            <Grid item xs={6} textAlign="right"><Typography variant="caption" fontWeight="900">{prod.gst}%</Typography></Grid>
                                        </Grid>
                                    </Box>

                                    <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)', border: `1px dashed ${riskColor}50` }}>
                                        <Typography variant="caption" sx={{ color: riskColor, fontFamily: 'monospace', fontWeight: 900, wordBreak: 'break-all', display: 'block', textAlign: 'center' }}>
                                            {risk.calculation}
                                        </Typography>
                                    </Paper>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
};

export default Diagnostic;
