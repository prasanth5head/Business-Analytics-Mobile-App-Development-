import React from 'react';
import {
    Box, Typography, Grid, Paper, Button, Divider, Chip, Avatar, Skeleton, Alert, useTheme,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
    Assignment, LocalOffer, Storefront, People, AutoFixHigh, Refresh
} from '@mui/icons-material';
import { useMyBusiness } from '../../context/MyBusinessContext';

const SolutionCard = ({ title, recommendation, impact, effort, icon, color }) => {
    const theme = useTheme();
    return (
        <Paper sx={{
            p: 4,
            height: '100%',
            borderLeft: `6px solid ${color}`,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: 'background.paper'
        }}>
            <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.05, transform: 'scale(2)', color: color }}>
                {icon}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
                <Typography variant="h6" fontWeight="bold" color="text.primary">{title}</Typography>
            </Box>
            <Typography variant="body1" paragraph color="text.secondary">
                {recommendation}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="caption" display="block" color="text.disabled" sx={{ fontWeight: 'bold', mb: 0.5 }}>POTENTIAL IMPACT</Typography>
                    <Chip label={impact} size="small" sx={{ bgcolor: color + '20', color: color, fontWeight: 'bold' }} />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" display="block" color="text.disabled" sx={{ fontWeight: 'bold', mb: 0.5 }}>AVAILABILITY</Typography>
                    <Chip label={effort + '%'} size="small" variant="outlined" sx={{ color: 'text.primary', borderColor: 'divider' }} />
                </Box>
            </Box>
        </Paper>
    );
};

const MyPrescriptive = () => {
    const theme = useTheme();
    const { businessData, aiRecommendations, loading, error, refreshData } = useMyBusiness();

    if (loading && !businessData) {
        return (
            <Box sx={{ p: 4 }}>
                <Skeleton variant="text" height={60} width="40%" />
                <Skeleton variant="rectangular" height={200} sx={{ my: 4 }} />
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid item xs={12} md={6} key={i}><Skeleton variant="rectangular" height={200} /></Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!businessData) return <Alert severity="info">Add business data to generate prescriptive strategies.</Alert>;

    const { recommendations } = aiRecommendations || {};
    const { productData } = businessData || { productData: [] };

    const fallbackIcons = [<LocalOffer />, <People />, <Storefront />, <AutoFixHigh />];
    const fallbackColors = [
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.success.main,
        theme.palette.primary.main
    ];

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: 'text.primary' }}>
                        💡 My Strategic Blueprint
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "The Solution" — AI Recommendations for Your Business
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={refreshData}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                >
                    Re-Calculate Strategy
                </Button>
            </Box>

            {/* AI Strategic Theme */}
            <Paper sx={{
                p: 4,
                mb: 4,
                background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                borderRadius: 4,
                boxShadow: `0 10px 40px ${theme.palette.secondary.main}30`
            }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            Your Custom Growth Intervention Plan
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                            Our Gemini AI has analyzed your manual revenue entries. By implementing these tailored strategies,
                            you can optimize your margins and reduce potential losses in your specific product categories.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                sx={{
                                    fontWeight: 'bold',
                                    borderRadius: 3,
                                    bgcolor: 'white',
                                    color: theme.palette.secondary.main,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                }}
                            >
                                Implementation Guide
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight="900" color="secondary" sx={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>AI-Gen</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', opacity: 0.8 }}>Tailored Insights</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Solutions Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {recommendations ? (
                    recommendations.map((rec, idx) => (
                        <Grid item xs={12} md={6} key={idx}>
                            <SolutionCard
                                title={rec.title}
                                recommendation={rec.recommendation}
                                impact={rec.type}
                                effort={rec.confidence}
                                icon={fallbackIcons[idx % 4]}
                                color={fallbackColors[idx % 4]}
                            />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}><Typography color="text.secondary">Analyzing your business patterns...</Typography></Grid>
                )}
            </Grid>

            {/* Category-Specific Directives */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, mt: 5, display: 'flex', alignItems: 'center', color: 'text.primary' }}>
                <Storefront sx={{ mr: 1 }} color="primary" /> Product Category Directives
            </Typography>
            <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5', color: 'text.primary' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5', color: 'text.primary' }}>Risk Assessment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5', color: 'text.primary' }}>Root Cause</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5', color: 'text.primary' }}>Action Target</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(productData || []).map((prod, idx) => {
                                const riskLevel = prod?.risk?.level || 'N/A';
                                const riskColor = riskLevel === 'High' ? theme.palette.error.main :
                                    riskLevel === 'Medium' ? theme.palette.warning.main :
                                        theme.palette.success.main;
                                return (
                                    <TableRow key={idx} hover>
                                        <TableCell sx={{ fontWeight: 'bold', color: 'text.primary' }}>{prod?.name || 'Category'}</TableCell>
                                        <TableCell>
                                            <Chip label={riskLevel} size="small" sx={{ bgcolor: riskColor + '20', color: riskColor, fontWeight: 'bold' }} />
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{(prod?.profitMargin || 0) < 20 ? 'Margin Compression' : 'Performing as Input'}</TableCell>
                                        <TableCell sx={{ color: 'text.primary' }}>Optimize for higher profitability based on {prod?.name || 'this category'} trends.</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default MyPrescriptive;
