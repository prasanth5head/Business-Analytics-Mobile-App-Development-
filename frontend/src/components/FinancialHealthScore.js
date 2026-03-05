import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const FinancialHealthScore = ({ score = 75 }) => {
    const data = [
        { value: score },
        { value: 100 - score },
    ];

    const COLORS = [
        score > 70 ? '#10B981' : score > 40 ? '#0EA5E9' : '#EF4444',
        'rgba(255, 255, 255, 0.1)'
    ];

    return (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 5, background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(10, 10, 20, 0.9))', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#fff', letterSpacing: 1.5 }}>
                FINANCIAL HEALTH SCORE
            </Typography>
            <Box sx={{ height: 250, width: '100%', position: 'relative' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={100}
                            startAngle={225}
                            endAngle={-45}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="cell-0" fill={COLORS[0]} />
                            <Cell key="cell-1" fill={COLORS[1]} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, color: COLORS[0], textShadow: `0 0 20px ${COLORS[0]}55` }}>
                        {score}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>
                        {score > 70 ? 'STABLE' : score > 40 ? 'CAUTION' : 'AT RISK'}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                    "Your business resilience is {score > 70 ? 'high' : 'medium'}. Maintain current growth while monitoring profit margins."
                </Typography>
            </Box>
        </Card>
    );
};

export default FinancialHealthScore;
