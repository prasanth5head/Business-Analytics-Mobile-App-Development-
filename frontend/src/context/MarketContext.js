import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
    const [marketData, setMarketData] = useState(null);
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/market/data`);
            setMarketData(data);

            // Get AI recommendations based on the new market data
            const { data: aiData } = await api.post(`/api/market/recommendations`, {
                salesData: data.salesData,
                productData: data.productData,
                summary: data.summary
            });
            setAiRecommendations(aiData);
            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch real-time market data');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Set up an interval to refresh data every 5 minutes
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const addRevenue = async (amount, month) => {
        try {
            await api.post(`/api/market/revenue`, { amount, month });
            await fetchData(); // Refresh data after adding
            return { success: true };
        } catch (err) {
            console.error('Add revenue error:', err);
            return { success: false, error: 'Failed to add revenue' };
        }
    };

    return (
        <MarketContext.Provider value={{ marketData, aiRecommendations, loading, error, refreshData: fetchData, addRevenue }}>
            {children}
        </MarketContext.Provider>
    );
};

export const useMarket = () => useContext(MarketContext);
