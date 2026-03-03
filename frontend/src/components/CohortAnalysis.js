import React from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

const CohortAnalysis = () => {
    const cohorts = [
        { month: 'Jan', size: 1200, ret: [100, 85, 70, 65, 60, 58] },
        { month: 'Feb', size: 1450, ret: [100, 82, 75, 68, 62] },
        { month: 'Mar', size: 1100, ret: [100, 88, 72, 64] },
        { month: 'Apr', size: 1300, ret: [100, 80, 78] },
        { month: 'May', size: 1600, ret: [100, 84] },
        { month: 'Jun', size: 1550, ret: [100] },
    ];

    const getBgColor = (val) => {
        const opacity = val / 100;
        return `rgba(76, 175, 80, ${opacity})`;
    };

    return (
        <Card sx={{ p: 4, borderRadius: 5, background: 'rgba(20, 20, 30, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', overflowX: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#fff', letterSpacing: 1.5 }}>
                RETENTION COHORT ANALYSIS
            </Typography>
            <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>COHORT</TableCell>
                            <TableCell sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>SIZE</TableCell>
                            {[0, 1, 2, 3, 4, 5].map(m => (
                                <TableCell key={m} sx={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>M{m}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cohorts.map((c, idx) => (
                            <TableRow key={idx}>
                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: 700 }}>{c.month} 2024</TableCell>
                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>{c.size}</TableCell>
                                {c.ret.map((r, ridx) => (
                                    <TableCell key={ridx} sx={{
                                        textAlign: 'center',
                                        color: r > 70 ? '#000' : '#fff',
                                        fontWeight: 800,
                                        bgcolor: getBgColor(r),
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: '4px'
                                    }}>
                                        {r}%
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Card>
    );
};

export default CohortAnalysis;
