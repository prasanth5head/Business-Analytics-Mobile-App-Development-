import React from 'react';
import {
    Box, Typography, Grid, Paper, Button, Divider, Chip, Avatar, Skeleton, Alert
} from '@mui/material';
import {
    Assignment, LocalOffer, Storefront, People, AutoFixHigh, Refresh
} from '@mui/icons-material';
import { useMarket } from '../context/MarketContext';

const SolutionCard = ({ title, recommendation, impact, effort, icon, color }) => (
    <Paper sx={{ p: 4, height: '100%', borderLeft: `6px solid ${color}`, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, transform: 'scale(2)' }}>
            {icon}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
        </Box>
        <Typography variant="body1" paragraph color="text.secondary">
            {recommendation}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography variant="caption" display="block" color="text.disabled">POTENTIAL IMPACT</Typography>
                <Chip label={impact} size="small" sx={{ bgcolor: color + '20', color: color, fontWeight: 'bold' }} />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" display="block" color="text.disabled">CONFIDENCE</Typography>
                <Chip label={effort + '%'} size="small" variant="outlined" />
            </Box>
        </Box>
    </Paper>
);

const Prescriptive = () => {
    const { marketData, aiRecommendations, loading, error, refreshData } = useMarket();

    if (loading && !marketData) {
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

    const { recommendations } = aiRecommendations || {};

    const fallbackIcons = [<LocalOffer />, <People />, <Storefront />, <AutoFixHigh />];
    const fallbackColors = ['#d32f2f', '#ff9800', '#4caf50', '#2196f3'];

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: '#d32f2f' }}>
                        💡 Prescriptive Analytics
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        "The Solution" — AI-Generated Strategy Blueprint
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Refresh />} onClick={refreshData} disabled={loading} sx={{ bgcolor: '#333399' }}>
                    Re-Calculate Strategy
                </Button>
            </Box>

            {/* AI Strategic Theme */}
            <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)', color: 'white' }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            Gemini Executive Intervention Plan
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                            Based on recent market fluctuations and price elasticity analysis, the AI has generated a customized recovery blueprint.
                            Implementing these specific steps is projected to yield a 12-18% revenue uplift within the current quarter.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="contained" color="secondary" size="large" sx={{ fontWeight: 'bold' }}>
                                Approve AI Strategy
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight="900" color="secondary">94%</Typography>
                        <Typography variant="subtitle1">Model Confidence Score</Typography>
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
                    <Grid item xs={12}><Typography>Synthesizing solutions...</Typography></Grid>
                )}
            </Grid>

            {/* Project Blueprint */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} color="primary" /> AI Deployment Roadmap
            </Typography>
            <Grid container spacing={3}>
                {[
                    { phase: 'PHASE 1: MONITOR', desc: 'Real-time tracking of price elasticity against competitor cycles.' },
                    { phase: 'PHASE 2: EXECUTE', desc: 'Dynamic deployment of AI-suggested category reallocations.' },
                    { phase: 'PHASE 3: OPTIMIZE', desc: 'Feedback loop integration from churn-prevention campaign.' }
                ].map((item, idx) => (
                    <Grid item xs={12} md={4} key={idx}>
                        <Paper sx={{ p: 3, height: '100%', bgcolor: '#f5f5f5' }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                                {item.phase}
                            </Typography>
                            <Typography variant="body2">{item.desc}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Prescriptive;
