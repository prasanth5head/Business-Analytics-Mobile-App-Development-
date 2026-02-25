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
    Snackbar
} from '@mui/material';
import {
    TrendingUp,
    PeopleAlt,
    AttachMoney,
    Refresh,
    ArrowUpward,
    ArrowDownward,
    NotificationsActive
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
import { useMyBusiness } from '../../context/MyBusinessContext';

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

const MyDashboard = () => {
    const theme = useTheme();
    const { businessData, aiRecommendations, loading, error, refreshData } = useMyBusiness();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    if (loading && !businessData) {
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
    if (!businessData) return <Alert severity="info">Please add some revenue entries to see your analytics.</Alert>;

    const { salesData, productData, summary } = businessData;
    const { recommendations, aiAnalysis } = aiRecommendations || {};

    return (
        <Box>
            {/* Header Area */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.03em' }}>My Business Center</Typography>
                    <Typography variant="body1" color="text.secondary">Your manual entries tracking & personalized AI intelligence.</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={refreshData}
                        disabled={loading}
                        sx={{ borderRadius: 3, px: 3, fontWeight: 900 }}
                    >
                        Refresh Analytics
                    </Button>
                </Box>
            </Box>


            {/* AI Top Alert Bar */}
            {aiAnalysis && (
                <Paper sx={{
                    p: 2.5, mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                    background: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 1)' : '#ffffff',
                    borderLeft: `6px solid ${theme.palette.secondary.main}`,
                    color: 'text.primary',
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: '0.01em', color: 'text.primary' }}>
                        <span style={{ color: theme.palette.secondary.main, fontWeight: 900 }}>BUSINESS AI:</span> {aiAnalysis.substring(0, 150)}...
                    </Typography>
                    <Chip label="PERSONALIZED" size="small" sx={{ bgcolor: theme.palette.secondary.main, color: 'white', fontWeight: 900, px: 1 }} />
                </Paper>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* KPI Section */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="My Revenue"
                        value={`₹${summary.totalSales.toLocaleString()}`}
                        percentage={summary.growthRate}
                        icon={<AttachMoney />}
                        color={theme.palette.primary.main}
                        up={true}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Entries"
                        value={summary.activeUsers.toLocaleString()}
                        percentage={summary.customerGrowth}
                        icon={<PeopleAlt />}
                        color={theme.palette.secondary.main}
                        up={true}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Total Profit"
                        value={`₹${(summary.totalSales - summary.totalLoss).toLocaleString()}`}
                        percentage={summary.profitGrowth}
                        icon={<TrendingUp />}
                        color={theme.palette.success.main}
                        up={true}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Loss Tracking"
                        value={`₹${summary.totalLoss.toLocaleString()}`}
                        percentage="Detailed"
                        icon={<NotificationsActive />}
                        color={theme.palette.error.main}
                        up={false}
                    />
                </Grid>
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'text.primary' }}>Revenue & Profit Trend (Monthly)</Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} axisLine={false} tickLine={false} />
                                <YAxis stroke={theme.palette.text.secondary} axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 16,
                                        border: `1px solid ${theme.palette.divider}`,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                        backgroundColor: theme.palette.background.paper,
                                        color: theme.palette.text.primary
                                    }}
                                />
                                <Area type="monotone" dataKey="sales" stroke={theme.palette.primary.main} strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" name="Revenue (₹)" />
                                <Area type="monotone" dataKey="profit" stroke={theme.palette.secondary.main} strokeWidth={3} fill="transparent" name="Profit (₹)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 4, height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: 'text.primary' }}>My AI Insights</Typography>
                        {recommendations ? (
                            recommendations.slice(0, 3).map((rec, idx) => (
                                <Box key={idx} sx={{
                                    mb: 2, p: 2,
                                    bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                                    borderRadius: 3,
                                    borderLeft: `4px solid ${rec.type === 'Critical' ? theme.palette.error.main : theme.palette.primary.main}`,
                                    transition: 'transform 0.2s ease',
                                    '&:hover': { transform: 'translateX(5px)' }
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="900" color="text.primary">
                                            {rec.title}
                                        </Typography>
                                        <Chip label={`${rec.confidence}%`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 900 }} />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {rec.recommendation}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <Typography color="text.secondary">Add more data for AI analysis</Typography>
                            </Box>
                        )}
                        <Button fullWidth variant="outlined" sx={{ mt: 1, borderRadius: 2, fontWeight: 700 }}>Full Diagnostic Report</Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* Category Split */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: 'text.primary' }}>Performance by Product Category</Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={productData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke={theme.palette.text.secondary} width={100} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="profitMargin" fill={theme.palette.secondary.main} radius={[0, 4, 4, 0]} name="Margin %" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: 'text.primary' }}>Recent Business Updates</Typography>
                        {[
                            { time: 'Live', msg: 'Data synchronization powered by Gemini AI', icon: <TrendingUp />, color: theme.palette.primary.main },
                            { time: 'System', msg: 'Your manual entries are being processed for predictive modeling', icon: <NotificationsActive />, color: theme.palette.warning.main },
                            { time: 'Active', msg: 'Analytics engine ready', icon: <Refresh />, color: theme.palette.success.main }
                        ].map((item, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, p: 1.5, borderRadius: 2, '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                                <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, width: 40, height: 40, borderRadius: 2 }}>
                                    {item.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold" color="text.primary">{item.msg}</Typography>
                                    <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>

            {/* ── Product Risk Analysis ── */}
            <Paper sx={{ p: 3, borderRadius: 4, mb: 4, border: `1px solid ${theme.palette.divider}` }}>
                <Box mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
                        ⚠️ Your Business Risk Profile
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {productData.map((prod, i) => {
                        const risk = prod.risk || {};
                        const riskColor = risk.level === 'High' ? '#f44336' : risk.level === 'Medium' ? '#FF9800' : '#4caf50';
                        const riskBg = risk.level === 'High' ? 'rgba(244,67,54,0.08)' : risk.level === 'Medium' ? 'rgba(255,152,0,0.08)' : 'rgba(76,175,80,0.08)';
                        return (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Paper sx={{
                                    p: 2.5, borderRadius: 3,
                                    border: `2px solid ${riskColor}`,
                                    background: riskBg,
                                    height: '100%'
                                }}>
                                    {/* Product Name & Level */}
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                        <Typography sx={{ fontWeight: 900, color: 'text.primary', fontSize: '1rem' }}>
                                            {prod.name}
                                        </Typography>
                                        <Chip
                                            label={risk.level || 'N/A'}
                                            size="small"
                                            sx={{ bgcolor: riskColor, color: 'white', fontWeight: 800, fontSize: '0.7rem' }}
                                        />
                                    </Box>

                                    {/* Risk Score */}
                                    <Box mb={1.5}>
                                        <Typography variant="h3" sx={{ fontWeight: 900, color: riskColor, lineHeight: 1 }}>
                                            {risk.score ?? '—'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">Risk Score / 100</Typography>
                                    </Box>

                                    {/* Key Metrics */}
                                    <Box display="flex" flexDirection="column" gap={0.5} mb={1.5}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="caption" color="text.secondary">Profit Margin</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4caf50' }}>{prod.profitMargin}%</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="caption" color="text.secondary">GST Rate</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>{prod.gst}%</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="caption" color="text.secondary">Loss Ratio</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#FF9800' }}>{prod.returnRate}%</Typography>
                                        </Box>
                                    </Box>

                                    {/* AI Reasoning */}
                                    <Box sx={{
                                        p: 1, borderRadius: 2,
                                        background: 'rgba(0,0,0,0.1)',
                                    }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block', mb: 0.3 }}>
                                            AI Assessment:
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: riskColor, fontSize: '0.68rem', fontWeight: 700 }}>
                                            {risk.level === 'Low' ? 'Safe and stable performance.' : 'Action required to optimize margins.'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>

        </Box>
    );
};

export default MyDashboard;
