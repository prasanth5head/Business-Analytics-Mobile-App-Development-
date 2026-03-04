import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const MyBusinessContext = createContext();

export const MyBusinessProvider = ({ children }) => {
    const [businessData, setBusinessData] = useState(null);
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) {
                setLoading(false);
                return;
            }

            const { data } = await api.get(`/api/market/my-data`);
            setBusinessData(data);

            const { data: aiData } = await api.post(`/api/market/recommendations`, {
                salesData: data.salesData,
                productData: data.productData,
                summary: data.summary
            });
            setAiRecommendations(aiData);
            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            if (err.response?.status === 401) {
                setError('Please login to view your business analytics');
            } else {
                setError('Failed to fetch your business analytics data');
            }
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addRevenue = async (amount, month, profit, loss, product) => {
        try {
            await api.post(`/api/market/revenue`, { amount, month, profit, loss, product });
            await fetchData(); // Refresh data after adding
            return { success: true };
        } catch (err) {
            console.error('Add revenue error:', err);
            return { success: false, error: 'Failed to add revenue' };
        }
    };

    return (
        <MyBusinessContext.Provider value={{ businessData, aiRecommendations, loading, error, refreshData: fetchData, addRevenue }}>
            {children}
        </MyBusinessContext.Provider>
    );
};

export const useMyBusiness = () => useContext(MyBusinessContext);
