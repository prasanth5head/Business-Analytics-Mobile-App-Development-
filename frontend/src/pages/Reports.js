import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme
} from '@mui/material';
import {
    Description,
    Print,
    CheckCircleOutline,
    TrendingDown,
    TrendingUp,
    Storage,
    Psychology,
    Assignment
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarket } from '../context/MarketContext';
import { Skeleton, Alert } from '@mui/material';

const ReportSection = ({ title, children, icon }) => {
    const theme = useTheme();
    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 1
            }}>
                <Box sx={{ color: 'primary.main', mr: 1, display: 'flex' }}>
                    {icon}
                </Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {title}
                </Typography>
            </Box>
            {children}
        </Box>
    );
};

const Reports = () => {
    const theme = useTheme();
    const { marketData, aiRecommendations, loading, error } = useMarket();

    if (loading && !marketData) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="rectangular" height={800} sx={{ borderRadius: 4 }} />
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;

    const { salesData, summary } = marketData;
    const { aiAnalysis, recommendations } = aiRecommendations || {};

    const handlePrint = () => {
        window.print();
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    // Derive actual performance metrics
    const totalSales = salesData.reduce((acc, d) => acc + d.sales, 0);
    const activeMonths = salesData.filter(d => d.sales > 0).length;
    const avgMonthlySales = totalSales / (activeMonths || 1);

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', p: 2 }}>

            {/* Action Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, '@media print': { display: 'none' } }}>
                <Button
                    variant="contained"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    sx={{ borderRadius: 2 }}
                >
                    Print Executive Report
                </Button>
            </Box>

            {/* Report Container */}
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 4, md: 8 },
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    '@media print': { boxShadow: 'none', p: 0, border: 'none' }
                }}
            >

                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ mb: 1, color: 'text.primary', letterSpacing: '-0.02em' }}>
                        BUSINESS <span style={{ color: theme.palette.primary.main }}>PRO</span> REPORT
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Comprehensive Operational Analysis & Financial Recommendations
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        Date: {currentDate} | Prepared by: Strategic Intelligence Module
                    </Typography>
                </Box>

                <Divider sx={{ mb: 6 }} />

                {/* 1. Introduction */}
                <ReportSection title="1. Introduction" icon={<Description />}>
                    <Typography variant="body1" paragraph align="justify" color="text.primary">
                        This report serves as a formal audit of recent business operations based on manual ledger entries and integrated market intelligence. The analysis focuses on performance trends, operational risk factors, and strategic maneuvers required to optimize professional growth.
                    </Typography>
                </ReportSection>

                {/* 2. Operational Health Summary */}
                <ReportSection title="2. Operational Health" icon={<TrendingUp />}>
                    <Paper sx={{
                        p: 3,
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.05)' : '#e8f5e9',
                        borderLeft: `4px solid ${theme.palette.success.main}`,
                        borderRadius: 2
                    }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                            Status: Live Data Integrated
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            Current aggregate revenue stands at <strong>₹{totalSales.toLocaleString()}</strong>.
                            Average monthly performance is tracked at <strong>₹{Math.round(avgMonthlySales).toLocaleString()}</strong>.
                            {summary.totalLoss > 0 ? (
                                <Box component="span"> Total tracked losses/returns sum to ₹{summary.totalLoss.toLocaleString()}.</Box>
                            ) : (
                                <Box component="span"> No significant losses or returns have been logged in the current cycle.</Box>
                            )}
                        </Typography>
                    </Paper>
                </ReportSection>

                {/* 3. Data Integrity & Variables */}
                <ReportSection title="3. Data Description" icon={<Storage />}>
                    <Typography variant="body1" paragraph color="text.primary">
                        Analyzed parameters are derived 100% from verified business inputs:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        {['Manual Revenue', 'Profit Tracking', 'Loss Validation', 'Product-Specific Performance', 'Yearly Trend Mapping'].map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ color: 'text.primary', borderColor: 'divider', fontWeight: 700 }} />
                        ))}
                    </Box>
                </ReportSection>

                {/* 4. Methodology */}
                <ReportSection title="4. Strategic Framework" icon={<Assignment />}>
                    <List dense>
                        <ListItem>
                            <ListItemIcon><CheckCircleOutline sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                            <ListItemText
                                primary={<Typography fontWeight="700" color="text.primary">Performance Descriptives</Typography>}
                                secondary={<Typography variant="body2" color="text.secondary">Mapping raw financial entries to time-series trends.</Typography>}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleOutline sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                            <ListItemText
                                primary={<Typography fontWeight="700" color="text.primary">Diagnostic Correlates</Typography>}
                                secondary={<Typography variant="body2" color="text.secondary">Identifying the relationship between product categories and return rates.</Typography>}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleOutline sx={{ color: theme.palette.primary.main }} /></ListItemIcon>
                            <ListItemText
                                primary={<Typography fontWeight="700" color="text.primary">Predictive Modeling</Typography>}
                                secondary={<Typography variant="body2" color="text.secondary">Extrapolating current growth rates into prospective fiscal scenarios.</Typography>}
                            />
                        </ListItem>
                    </List>
                </ReportSection>

                {/* 5. Analysis & Trends */}
                <ReportSection title="5. Visual Trend Analysis" icon={<TrendingUp />}>
                    <Typography variant="body1" paragraph color="text.primary">
                        <strong>Yearly Revenue Progression:</strong> The visualization below maps exactly how business inputs have scaled over the current fiscal year.
                    </Typography>
                    <Box sx={{ height: 350, width: '100%', mb: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                                <XAxis dataKey="p" stroke={theme.palette.text.secondary} fontWeight={700} />
                                <YAxis stroke={theme.palette.text.secondary} fontWeight={700} />
                                <Tooltip
                                    contentStyle={{
                                        bgcolor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`,
                                        borderRadius: 8,
                                        fontWeight: 700
                                    }}
                                />
                                <Bar dataKey="sales" fill={theme.palette.primary.main} name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="profit" fill={theme.palette.success.main} name="Profit (₹)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </ReportSection>

                {/* 6. Strategic Intelligence (AI) */}
                <ReportSection title="6. AI Strategic Recommendations" icon={<Psychology />}>
                    <Grid container spacing={2}>
                        {recommendations && recommendations.length > 0 ? (
                            recommendations.map((rec, idx) => (
                                <Grid item xs={12} key={idx}>
                                    <Paper sx={{
                                        p: 2.5,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(7, 131, 255, 0.05)' : '#f8f9fa',
                                        borderLeft: `5px solid ${theme.palette.primary.main}`,
                                        borderRadius: 3
                                    }}>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="subtitle1" fontWeight="900" color="text.primary">{rec.title}</Typography>
                                            <Chip label={rec.type} size="small" sx={{ fontWeight: 800 }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            {rec.recommendation}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Typography color="text.secondary">AI processing queued...</Typography>
                        )}
                    </Grid>
                </ReportSection>

                {/* 7. Conclusion */}
                <ReportSection title="7. Conclusion" icon={<Assignment />}>
                    <Typography variant="body1" align="justify" color="text.primary">
                        The integrity of this report relies on the high-fidelity manual inputs provided. Based on current trajectories, total yearly revenue is accurately tracked and mapped. Operational efficiency remains high as long as return rates (loss) are kept minimal relative to aggregate sales.
                    </Typography>
                </ReportSection>

                <Divider sx={{ my: 4 }} />

                {/* Footer */}
                <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2" fontWeight="700">
                        OFFICIAL CONSOLIDATED BUSINESS AUDIT
                    </Typography>
                    <Typography variant="caption">
                        Powered by Analytics Pro Intelligence Engine
                    </Typography>
                </Box>

            </Paper>
        </Box>
    );
};

export default Reports;
