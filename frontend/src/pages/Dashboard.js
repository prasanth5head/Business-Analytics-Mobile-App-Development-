import React, { useState, useMemo } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    useTheme,
    Skeleton,
    Alert,
    Button,
    Chip,
    Avatar,
    Snackbar,
    Pagination,
    Menu,
    MenuItem
} from '@mui/material';
import {
    TrendingUp,
    PeopleAlt,
    AttachMoney,
    Refresh,
    ArrowUpward,
    ArrowDownward,
    NotificationsActive,
    CalendarToday
} from '@mui/icons-material';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useMarket } from '../context/MarketContext';

const KPICard = ({ title, value, percentage, icon, color, up }) => {
    const theme = useTheme();
    return (
        <Card sx={{
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: `4px solid ${color}`,
            borderRadius: 4,
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 10px 30px ${color}20`
            }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography color="text.secondary" variant="subtitle2" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                            {value}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {up ? <ArrowUpward fontSize="small" sx={{ color: theme.palette.success.main, mr: 0.5 }} /> : <ArrowDownward fontSize="small" sx={{ color: theme.palette.error.main, mr: 0.5 }} />}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: up ? theme.palette.success.main : theme.palette.error.main,
                                    fontWeight: 'bold'
                                }}
                            >
                                {percentage}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: `${color}15`,
                            color: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 4px 10px ${color}20`
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const Dashboard = () => {
    const theme = useTheme();
    const { marketData, loading, error, refreshData } = useMarket();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [selectedYear, setSelectedYear] = useState('All');
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const itemsPerPage = 6;

    const handleYearClick = (event) => setAnchorEl(event.currentTarget);
    const handleYearClose = (year) => {
        setAnchorEl(null);
        if (year) setSelectedYear(year);
        setPage(1);
    };

    if (loading && !marketData) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} width="30%" />
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid item xs={12} sm={3} key={i}><Skeleton variant="rectangular" height={120} /></Grid>
                    ))}
                </Grid>
                <Skeleton variant="rectangular" height={400} sx={{ mt: 4 }} />
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;

    const { salesData = [], productData = [], summary = {}, strategicPriorities = [] } = marketData || {};

    const years = [...new Set(strategicPriorities.map(p => p.year))].sort((a, b) => b - a);

    const filteredPriorities = useMemo(() => {
        if (selectedYear === 'All') return strategicPriorities;
        return strategicPriorities.filter(p => p.year === parseInt(selectedYear) || p.year === selectedYear);
    }, [selectedYear, strategicPriorities]);

    const paginatedPriorities = filteredPriorities.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const filteredSalesData = useMemo(() => {
        if (selectedYear === 'All') return salesData.slice(-12);
        return salesData.filter(s => s.year === selectedYear);
    }, [selectedYear, salesData]);

    return (
        <Box>
            {/* Header Area */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>Global Operations Center</Typography>
                    <Typography variant="body1" color="text.secondary">Real-time market tracking & AI-driven strategic intelligence.</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                        icon={<CalendarToday />}
                        label={`Year: ${selectedYear}`}
                        onClick={handleYearClick}
                        onDelete={selectedYear !== 'All' ? () => handleYearClose('All') : undefined}
                        sx={{ pl: 1, pr: 0.5, py: 2.5, borderRadius: 3, fontWeight: 800, bgcolor: 'background.paper', border: `1px solid ${theme.palette.divider}` }}
                    />
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleYearClose()}>
                        <MenuItem onClick={() => handleYearClose('All')}>All Years</MenuItem>
                        {years.map(y => <MenuItem key={y} onClick={() => handleYearClose(y)}>{y}</MenuItem>)}
                    </Menu>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={() => {
                            refreshData();
                            setSnackbar({ open: true, message: 'Data Synced Successfully!', severity: 'success' });
                        }}
                        disabled={loading}
                        sx={{ borderRadius: 3, px: 3, fontWeight: 900 }}
                    >
                        Sync
                    </Button>
                </Box>
            </Box>

            {/* KPI Section */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Live Revenue" value={`₹${summary?.totalSales?.toLocaleString() || '0'}`} percentage={summary?.growthRate || '0%'} icon={<AttachMoney />} color={theme.palette.primary.main} up={true} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Active Users" value={summary?.activeUsers?.toLocaleString() || '0'} percentage={summary?.customerGrowth || '0%'} icon={<PeopleAlt />} color={theme.palette.secondary.main} up={true} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Avg. Profit" value={`₹${summary?.avgProfit?.toLocaleString() || '0'}`} percentage={summary?.profitGrowth || '0%'} icon={<TrendingUp />} color={theme.palette.success.main} up={true} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard title="Volatility" value="Stable" percentage="Low" icon={<NotificationsActive />} color={theme.palette.error.main} up={false} />
                </Grid>
            </Grid>

            {/* AI Strategic Priorities Section */}
            <Paper sx={{ p: 4, borderRadius: 4, mb: 4, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>AI Strategic Priorities</Typography>
                        <Typography variant="body2" color="text.secondary">Deep-learning derived initiatives for {selectedYear === 'All' ? 'historical & future' : selectedYear} operations.</Typography>
                    </Box>
                    <Chip label={`${filteredPriorities.length} RECORDS`} color="primary" sx={{ fontWeight: 900 }} />
                </Box>

                <Grid container spacing={3}>
                    {paginatedPriorities.map((item, idx) => (
                        <Grid item xs={12} md={selectedYear === 'All' ? 4 : 12} key={item.id}>
                            <Box sx={{
                                p: 3, borderRadius: 3,
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                borderLeft: `6px solid ${item.type === 'Critical' ? theme.palette.error.main : item.type === 'Growth' ? theme.palette.success.main : theme.palette.primary.main}`,
                                height: '100%',
                                transition: 'all 0.3s',
                                '&:hover': { transform: 'translateY(-5px)', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="900" color="text.primary">{item.title}</Typography>
                                    <Chip label={`${item.confidence}% AI Confidence`} size="small" variant="outlined" sx={{ fontWeight: 900, fontSize: '0.7rem' }} />
                                </Box>
                                <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>{item.recommendation}</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Chip label={item.type.toUpperCase()} size="small" sx={{ fontWeight: 900, bgcolor: 'divider', px: 1 }} />
                                    <Chip label={`FISCAL YEAR: ${item.year}`} size="small" sx={{ fontWeight: 900, bgcolor: 'divider', px: 1 }} />
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {filteredPriorities.length > itemsPerPage && (
                    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={Math.ceil(filteredPriorities.length / itemsPerPage)}
                            page={page}
                            onChange={(e, v) => setPage(v)}
                            color="primary"
                            size="large"
                            sx={{ '& .MuiPaginationItem-root': { fontWeight: 900, borderRadius: 2 } }}
                        />
                    </Box>
                )}
            </Paper>

            {/* Performance Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 900, color: 'text.primary' }}>
                            {selectedYear === 'All' ? 'Recent Revenue Performance (Last 12 Months)' : `Revenue Performance for ${selectedYear}`}
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={filteredSalesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} axisLine={false} tickLine={false} />
                                <YAxis stroke={theme.palette.text.secondary} axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="sales" stroke={theme.palette.primary.main} strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" name="Sales (₹)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* ── Product Risk Analysis ── */}
            <Paper sx={{ p: 4, borderRadius: 4, mb: 4, border: `1px solid ${theme.palette.divider}` }}>
                <Box mb={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>⚠️ Multi-Point Risk Analysis</Typography>
                        <Typography variant="body1" color="text.secondary">Calculated from dynamic financial ratios, GST liabilities, and operational loss data.</Typography>
                    </Box>
                </Box>
                <Grid container spacing={4}>
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
                                    '&:hover': { boxShadow: `0 15px 40px ${riskColor}25`, transform: 'scale(1.02)' }
                                }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                        <Typography sx={{ fontWeight: 900, fontSize: '1.2rem' }}>{prod.name}</Typography>
                                        <Chip label={risk.level} size="small" sx={{ bgcolor: riskColor, color: 'white', fontWeight: 900, px: 1 }} />
                                    </Box>

                                    <Box sx={{ textAlign: 'center', mb: 3, p: 2.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Typography variant="h2" sx={{ fontWeight: 900, color: riskColor, letterSpacing: '-0.05em' }}>{risk.score}</Typography>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Risk Score</Typography>
                                    </Box>

                                    <Grid container spacing={2} sx={{ mb: 4 }}>
                                        {[
                                            { label: 'Market Price', val: `₹${prod.price.toLocaleString()}`, color: 'text.primary' },
                                            { label: 'Unit Profit', val: `₹${prod.profit.toLocaleString()}`, color: theme.palette.success.main },
                                            { label: 'Gross Loss', val: `₹${prod.loss.toLocaleString()}`, color: theme.palette.error.main },
                                            { label: 'GST Applied', val: `${prod.gst}%`, color: theme.palette.info.main }
                                        ].map(item => (
                                            <Grid item xs={6} key={item.label}>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>{item.label}</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: item.color }}>{item.val}</Typography>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)', border: '1px dashed rgba(0,0,0,0.1)' }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, display: 'block', mb: 1, textTransform: 'uppercase' }}>Formula Logic:</Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: riskColor, wordBreak: 'break-all', fontSize: '0.75rem' }}>{risk.calculation}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 900 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard;


