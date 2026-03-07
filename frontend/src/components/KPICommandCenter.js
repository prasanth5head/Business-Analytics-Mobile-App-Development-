import React, { useState } from 'react';
import { Box, Typography, Card, IconButton } from '@mui/material';
import { Reorder } from 'framer-motion';
import { GripVertical, MoreVertical, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useMyBusiness } from '../context/MyBusinessContext';
import { useMarket } from '../context/MarketContext';

const KPICard = ({ item }) => (
    <Reorder.Item
        value={item}
        style={{ listStyle: 'none', marginBottom: '16px' }}
        whileDrag={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 100 }}
    >
        <Card sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' }
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GripVertical size={20} color="rgba(255, 255, 255, 0.3)" style={{ marginRight: 16 }} />
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${item.color}22`, mr: 2 }}>
                    {item.icon}
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', letterSpacing: 1, fontWeight: 700 }}>
                        {item.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                        {item.value}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: (typeof item.trend === 'string' && item.trend.includes('▼')) ? '#f44336' : '#4caf50', fontWeight: 900 }}>
                    {item.trend}
                </Typography>
                <IconButton size="small" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.3)' }}>
                    <MoreVertical size={16} />
                </IconButton>
            </Box>
        </Card>
    </Reorder.Item>
);

const KPICommandCenter = () => {
    // Determine which context to use
    const myBusiness = useMyBusiness();
    const market = useMarket();

    // Default to myBusiness data if available (active), else fallback to market (learner)
    const context = myBusiness?.businessData ? myBusiness : market;
    const data = context?.businessData || context?.marketData || {};
    const { summary = {} } = data;

    const [items, setItems] = useState([
        { id: 1, title: 'TOTAL REVENUE', value: `₹${(summary.totalSales || 0).toLocaleString()}`, trend: summary.growthRate || '+1.2%', color: '#4caf50', icon: <DollarSign color="#4caf50" size={24} /> },
        { id: 2, title: 'ACTIVE CUSTOMERS', value: (summary.activeUsers || 0).toLocaleString(), trend: summary.customerGrowth || '+5.0%', color: '#2196f3', icon: <Users color="#2196f3" size={24} /> },
        { id: 3, title: 'PROFIT MARGIN', value: `${summary.totalSales > 0 ? Math.round((summary.totalProfit / summary.totalSales) * 100) : 0}%`, trend: summary.profitGrowth || '+3.4%', color: '#06B6D4', icon: <TrendingUp color="#06B6D4" size={24} /> },
        { id: 4, title: 'OPERATIONAL EFFICIENCY', value: '92%', trend: '+0.8%', color: '#9c27b0', icon: <Activity color="#9c27b0" size={24} /> },
    ]);

    // Update items when summary changes
    React.useEffect(() => {
        if (summary && summary.totalSales !== undefined) {
            setItems([
                { id: 1, title: 'TOTAL REVENUE', value: `₹${(summary.totalSales || 0).toLocaleString()}`, trend: summary.growthRate || '+1.2%', color: '#4caf50', icon: <DollarSign color="#4caf50" size={24} /> },
                { id: 2, title: 'ACTIVE CUSTOMERS', value: (summary.activeUsers || 0).toLocaleString(), trend: summary.customerGrowth || '+5.0%', color: '#2196f3', icon: <Users color="#2196f3" size={24} /> },
                { id: 3, title: 'PROFIT MARGIN', value: `${summary.totalSales > 0 ? Math.round((summary.totalProfit / summary.totalSales) * 100) : 0}%`, trend: summary.profitGrowth || '+3.4%', color: '#06B6D4', icon: <TrendingUp color="#06B6D4" size={24} /> },
                { id: 4, title: 'OPERATIONAL EFFICIENCY', value: '92%', trend: '+0.8%', color: '#9c27b0', icon: <Activity color="#9c27b0" size={24} /> },
            ]);
        }
    }, [summary]);

    return (
        <Box sx={{ width: '100%', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, color: '#fff', letterSpacing: 2 }}>
                KPI COMMAND CENTER
            </Typography>
            <Reorder.Group axis="y" values={items} onReorder={setItems}>
                {items.map((item) => (
                    <KPICard key={item.id} item={item} />
                ))}
            </Reorder.Group>
        </Box>
    );
};

export default KPICommandCenter;
