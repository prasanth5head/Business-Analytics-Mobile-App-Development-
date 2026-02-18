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
    ListItemText
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
import { salesData, insights } from '../data/analyticsData';

const ReportSection = ({ title, children, icon }) => (
    <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: '2px solid #3f51b5', pb: 1 }}>
            <Box sx={{ color: 'primary.main', mr: 1, display: 'flex' }}>
                {icon}
            </Box>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
                {title}
            </Typography>
        </Box>
        {children}
    </Box>
);

const Reports = () => {
    const handlePrint = () => {
        window.print();
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', p: 2 }}>

            {/* Action Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, '@media print': { display: 'none' } }}>
                <Button
                    variant="contained"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    sx={{ bgcolor: '#333399' }}
                >
                    Print Executive Report
                </Button>
            </Box>

            {/* Report Container */}
            <Paper
                elevation={3}
                sx={{
                    p: 8,
                    '@media print': { boxShadow: 'none', p: 0 }
                }}
            >

                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ mb: 1, color: '#1a237e' }}>
                        BUSINESS ANALYTICS REPORT
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Strategic Analysis & Recommendations
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: 'text.disabled' }}>
                        Date: {currentDate} | Prepared by: Analytics Team
                    </Typography>
                </Box>

                <Divider sx={{ mb: 6 }} />

                {/* 1. Introduction */}
                <ReportSection title="1. Introduction" icon={<Description />}>
                    <Typography variant="body1" paragraph align="justify">
                        This report provides a comprehensive analysis of recent business performance, specifically focusing on sales volatility observed in Q1. Uses data-driven methodologies to identify root causes and proposes strategic interventions to restore growth trajectories.
                    </Typography>
                </ReportSection>

                {/* 2. Problem Statement */}
                <ReportSection title="2. Problem Statement" icon={<TrendingDown />}>
                    <Paper sx={{ p: 3, bgcolor: '#ffebee', borderLeft: '4px solid #d32f2f' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Core Issue: Unexplained Sales Decline
                        </Typography>
                        <Typography variant="body1">
                            Despite a positive start to the year, sales revenue dropped by <strong>33%</strong> in March.
                            Simultaneously, customer churn rates in the 'High Value' segment increased by <strong>12%</strong>.
                            The primary objective is to diagnose the drivers of this decline and forecast recovery paths.
                        </Typography>
                    </Paper>
                </ReportSection>

                {/* 3. Data Description */}
                <ReportSection title="3. Data Description" icon={<Storage />}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">Dataset Source</Typography>
                                <Typography variant="body2">Internal ERP & CRM Systems</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">Key Variables Analyzed</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                    {['Sales Volume', 'Unit Price', 'Customer Complaints', 'Competitor Offers', 'Profit Margin'].map((tag) => (
                                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </ReportSection>

                {/* 4. Methodology */}
                <ReportSection title="4. Methodology" icon={<Assignment />}>
                    <Typography variant="body1" paragraph>
                        We employed a three-tiered analytical approach:
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                            <ListItemText
                                primary="Descriptive Analytics"
                                secondary="Authorized historical trends to establish performance baselines."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                            <ListItemText
                                primary="Diagnostic Analytics"
                                secondary="Correlated price elasticity with sales volume and competitor activity."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                            <ListItemText
                                primary="Predictive Analytics"
                                secondary="Utilized regression modeling to forecast Q2 performance under various pricing scenarios."
                            />
                        </ListItem>
                    </List>
                </ReportSection>

                {/* 5. Analysis */}
                <ReportSection title="5. Analysis" icon={<TrendingUp />}>
                    <Typography variant="body1" paragraph>
                        <strong>Q1 Performance Visualization:</strong> The chart below illustrates the correlation between the sales dip and the strategic price increase in March.
                    </Typography>
                    <Box sx={{ height: 300, width: '100%', mb: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesData.slice(0, 6)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="p" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#3f51b5" name="Sales Volume" />
                                <Bar dataKey="profit" fill="#ff4081" name="Profit" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                    <Typography variant="caption" align="center" display="block" color="text.secondary">
                        Figure 1: Sales vs Profit Analysis (Jan - Jun)
                    </Typography>
                </ReportSection>

                {/* 6. Findings */}
                <ReportSection title="6. Findings" icon={<Psychology />}>
                    <Grid container spacing={2}>
                        {insights.map((item, idx) => (
                            <Grid item xs={12} key={idx}>
                                <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderLeft: '4px solid #ff9800' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{item.text}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Root Cause:</strong> {item.reason}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </ReportSection>

                {/* 7. Recommendations */}
                <ReportSection title="7. Recommendations" icon={<CheckCircleOutline />}>
                    <Box component="ul" sx={{ pl: 2 }}>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Price Adjustment Stratgey:</strong> Immediate reduction of unit price to <strong>₹110</strong> is recommended. Predictive models suggest this will recover sales volume by 20% within 30 days.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Competitor Counter-Strategy:</strong> Launch a targeted loyalty bonus program during known competitor discount windows to insulate high-value customers.
                        </Typography>
                        <Typography component="li" variant="body1" paragraph>
                            <strong>Inventory Optimization:</strong> Shift marketing budget towards the 'Beauty' category which currently yields the highest profit margin (60%).
                        </Typography>
                    </Box>
                </ReportSection>

                {/* 8. Conclusion */}
                <ReportSection title="8. Conclusion" icon={<Assignment />}>
                    <Typography variant="body1" align="justify">
                        The analysis confirms that the sales decline was a direct consequence of high price sensitivity which was exploited by competitor activity. The business remains fundamentally strong, with high demand potential. Implementing the recommended pricing adjustments and loyalty initiatives will likely reverse the negative trend and ensure Q2 targets are met.
                    </Typography>
                </ReportSection>

                <Divider sx={{ my: 4 }} />

                {/* Footer */}
                <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2">
                        generated by Analytics Pro System
                    </Typography>
                </Box>

            </Paper>
        </Box>
    );
};

export default Reports;
