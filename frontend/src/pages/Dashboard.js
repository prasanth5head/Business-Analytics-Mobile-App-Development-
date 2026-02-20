import React, { useState } from 'react';
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
    TextField,
    MenuItem,
    InputAdornment,
    Snackbar
} from '@mui/material';
import {
    TrendingUp,
    PeopleAlt,
    AttachMoney,
    Refresh,
    ArrowUpward,
    ArrowDownward,
    NotificationsActive,
    AddCircleOutline
} from '@mui/icons-material';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import { useMarket } from '../context/MarketContext';

const KPICard = ({ title, value, percentage, icon, color, up }) => {
    const theme = useTheme();
    return (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden', borderBottom: `4px solid ${color}` }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
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
                            borderRadius: '50%',
                            bgcolor: `${color}15`,
                            color: color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
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
    const { marketData, aiRecommendations, loading, error, refreshData, addRevenue } = useMarket();
    const [revAmount, setRevAmount] = useState('');
    const [revMonth, setRevMonth] = useState('Jan');
    const [submitting, setSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleAddRevenue = async (e) => {
        e.preventDefault();
        if (!revAmount || isNaN(revAmount)) {
            setSnackbar({ open: true, message: 'Please enter a valid amount', severity: 'error' });
            return;
        }

        setSubmitting(true);
        const result = await addRevenue(Number(revAmount), revMonth);
        setSubmitting(false);

        if (result.success) {
            setSnackbar({ open: true, message: 'Revenue added successfully!', severity: 'success' });
            setRevAmount('');
        } else {
            setSnackbar({ open: true, message: result.error, severity: 'error' });
        }
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

    const { salesData, productData, summary } = marketData;
    const { recommendations, aiAnalysis } = aiRecommendations || {};

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <Box>
            {/* Header Area */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>Global Operations Center</Typography>
                    <Typography variant="body1" color="text.secondary">Real-time market tracking & AI-driven strategic intelligence.</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={refreshData}
                        disabled={loading}
                        sx={{ borderRadius: 3, px: 3 }}
                    >
                        Update Feed
                    </Button>
                </Box>
            </Box>

            {/* Quick Action Bar / Input Revenue */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 6, border: `1px solid rgba(255,255,255,0.05)`, background: 'rgba(225, 255, 1, 0.02)' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
                    <AddCircleOutline /> Manual Revenue Entry
                </Typography>
                <Box component="form" onSubmit={handleAddRevenue} sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        size="medium"
                        label="Revenue Amount"
                        variant="outlined"
                        value={revAmount}
                        onChange={(e) => setRevAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        InputProps={{
                            startAdornment: <InputAdornment position="start" sx={{ color: 'primary.main' }}>₹</InputAdornment>,
                        }}
                        sx={{ flexGrow: 1, minWidth: '240px' }}
                    />
                    <TextField
                        select
                        size="medium"
                        label="Month"
                        value={revMonth}
                        onChange={(e) => setRevMonth(e.target.value)}
                        sx={{ width: '180px' }}
                    >
                        {months.map((m) => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                    </TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{ height: '56px', px: 5, borderRadius: 3, fontWeight: 800, fontSize: '1rem' }}
                    >
                        {submitting ? 'Adding...' : 'Add Data'}
                    </Button>
                </Box>
            </Paper>

            {/* AI Top Alert Bar */}
            {aiAnalysis && (
                <Paper sx={{
                    p: 2.5, mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, #161B22 0%, #0F131A 100%)',
                    borderLeft: `6px solid ${theme.palette.primary.main}`,
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}>
                    <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: '0.01em' }}>
                        <span style={{ color: theme.palette.primary.main }}>STRATEGIC AI:</span> {aiAnalysis.substring(0, 150)}...
                    </Typography>
                    <Chip label="LIVE ANALYSIS" size="small" sx={{ bgcolor: theme.palette.primary.main, color: 'black', fontWeight: 900, px: 1 }} />
                </Paper>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* KPI Section */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Live Revenue"
                        value={`₹${summary.totalSales.toLocaleString()}`}
                        percentage={summary.growthRate}
                        icon={<AttachMoney />}
                        color={theme.palette.primary.main}
                        up={true}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Active Users"
                        value={summary.activeUsers.toLocaleString()}
                        percentage={summary.customerGrowth}
                        icon={<PeopleAlt />}
                        color={theme.palette.secondary.main}
                        up={true}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Avg. Profit"
                        value={`₹${summary.avgProfit.toLocaleString()}`}
                        percentage={summary.profitGrowth}
                        icon={<TrendingUp />}
                        color={theme.palette.success.main} // Bright Lime
                        up={true}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Volatility"
                        value="Stable"
                        percentage="Low"
                        icon={<NotificationsActive />}
                        color="#FF3D00" // Bright Red-Orange
                        up={false}
                    />
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%', position: 'relative' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Sales vs. Profit Performance</Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} />
                                <YAxis stroke={theme.palette.text.secondary} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 16,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                        backgroundColor: '#121212',
                                        color: '#fff'
                                    }}
                                />
                                <Area type="monotone" dataKey="sales" stroke={theme.palette.primary.main} strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" name="Sales (₹)" />
                                <Area type="monotone" dataKey="profit" stroke={theme.palette.secondary.main} strokeWidth={3} fill="transparent" name="Profit (₹)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>AI Strategic Priorities</Typography>
                        {recommendations ? (
                            recommendations.slice(0, 3).map((rec, idx) => (
                                <Box key={idx} sx={{
                                    mb: 2.5, p: 2,
                                    bgcolor: theme.palette.mode === 'light' ? '#f8f9fa' : 'rgba(255,255,255,0.05)',
                                    borderRadius: 2,
                                    borderLeft: `4px solid ${rec.type === 'Critical' ? theme.palette.error.main : theme.palette.primary.main}`
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {rec.title}
                                        </Typography>
                                        <Chip label={`${rec.confidence}%`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {rec.recommendation}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <Typography color="text.secondary">No active alerts</Typography>
                            </Box>
                        )}
                        <Button fullWidth variant="outlined" sx={{ mt: 1 }}>View All Diagnostics</Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Category Split */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Profit Margin by Category</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={productData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} width={100} />
                                <Tooltip cursor={{ fill: theme.palette.mode === 'light' ? '#f1f1f1' : 'rgba(255,255,255,0.1)' }} />
                                <Bar dataKey="profitMargin" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} name="Margin %" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Recent Activity Feed</Typography>
                        {[
                            { time: '2 mins ago', msg: 'Gemini AI recalculated Q2 forecast (+15% uplift projected)', icon: <TrendingUp />, color: theme.palette.primary.main },
                            { time: '15 mins ago', msg: 'Market volatility detected in Electronics category', icon: <TrendingUp />, color: theme.palette.warning.main },
                            { time: '1 hour ago', msg: 'System refresh: Live market raw data synchronized', icon: <Refresh />, color: theme.palette.success.main }
                        ].map((item, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, width: 32, height: 32 }}>
                                    {item.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">{item.msg}</Typography>
                                    <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
