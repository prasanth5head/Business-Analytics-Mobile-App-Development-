import React from 'react';
import { Box, Typography, Card, Badge, Stack, Chip } from '@mui/material';
import { AlertTriangle, TrendingDown, Target } from 'lucide-react';

const AIAnomalyDetector = ({ anomalies = [] }) => {
    // Mock anomaly data if none provided
    const displayAnomalies = anomalies.length > 0 ? anomalies : [
        { type: 'Loss Spike', month: 'Aug', amount: '+45%', severity: 'High', description: 'Sudden 45% increase in operational loss detected in Manufacturing.' },
        { type: 'Category Drop', month: 'Jul', amount: '-22%', severity: 'Medium', description: 'Seasonal deviation detected in Retail Apparel sales.' }
    ];

    return (
        <Card sx={{ p: 4, borderRadius: 5, background: 'rgba(255, 67, 54, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(244, 67, 54, 0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', color: '#f44336' }}>
                    <AlertTriangle size={24} style={{ marginRight: 12 }} />
                    AI ANOMALY DETECTOR
                </Typography>
                <Badge badgeContent={displayAnomalies.length} color="error" overlap="circular" />
            </Box>

            <Stack spacing={3}>
                {displayAnomalies.map((a, idx) => (
                    <Box key={idx} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: 4, bgcolor: a.severity === 'High' ? '#f44336' : '#ff9800' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#fff' }}>[{a.type}] {a.amount}</Typography>
                            <Chip label={a.severity} size="small" color={a.severity === 'High' ? 'error' : 'warning'} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>{a.description}</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)', mt: 1, display: 'block' }}>Detected {a.month} 2024</Typography>
                    </Box>
                ))}
            </Stack>
        </Card>
    );
};

export default AIAnomalyDetector;
