// Comprehensive Mock Data for Business Analytics
export const salesData = [
    { p: 'Jan', sales: 4000, profit: 2400, price: 100, complaints: 5, competitorCheck: 0 },
    { p: 'Feb', sales: 3000, profit: 1398, price: 120, complaints: 10, competitorCheck: 0 },
    { p: 'Mar', sales: 2000, profit: 980, price: 150, complaints: 25, competitorCheck: 1 }, // Diagnostic: High price + Competitor offer
    { p: 'Apr', sales: 2780, profit: 3908, price: 110, complaints: 8, competitorCheck: 0 },
    { p: 'May', sales: 1890, profit: 4800, price: 115, complaints: 12, competitorCheck: 0 },
    { p: 'Jun', sales: 2390, profit: 3800, price: 112, complaints: 9, competitorCheck: 0 },
    { p: 'Jul', sales: 3490, profit: 4300, price: 105, complaints: 6, competitorCheck: 0 },
    { p: 'Aug', sales: 4200, profit: 5100, price: 100, complaints: 4, competitorCheck: 0 },
    { p: 'Sep', sales: 3800, profit: 4600, price: 105, complaints: 5, competitorCheck: 0 },
    { p: 'Oct', sales: 3100, profit: 3200, price: 125, complaints: 15, competitorCheck: 1 },
    { p: 'Nov', sales: 2500, profit: 2100, price: 140, complaints: 20, competitorCheck: 1 },
    { p: 'Dec', sales: 5000, profit: 6000, price: 95, complaints: 3, competitorCheck: 0 },
];


export const insights = [
    {
        type: 'critical',
        text: 'Sales dropped 33% in March compared to January.',
        reason: 'Price increase of 50% (₹100 -> ₹150) directly correlated with drop.',
        action: 'Reduce price to ₹110 to recover volume.'
    },
    {
        type: 'warning',
        text: 'Customer complaints spiked in March and November.',
        reason: 'Competitor launched offers during these high-price periods.',
        action: 'Launch counter-offers or loyalty bonuses during competitor campaigns.'
    },
    {
        type: 'success',
        text: 'Beauty products have the highest profit margin (60%).',
        reason: 'Low return rate (3%) and high markup.',
        action: 'Increase marketing spend on Beauty category by 20%.'
    }
];
