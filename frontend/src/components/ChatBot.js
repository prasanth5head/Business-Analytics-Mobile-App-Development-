import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    Fade,
    useTheme,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    Send as SendIcon,
    Close as CloseIcon,
    SmartToy as BotIcon,
    Person as UserIcon,
    DeleteSweep as ClearIcon
} from '@mui/icons-material';
import api from '../api';
import { useMarket } from '../context/MarketContext';

const ChatBot = ({ open, onClose }) => {
    const theme = useTheme();
    const { marketData } = useMarket();
    const [messages, setMessages] = useState([
        { text: "Hello! I am your Analytics Pro AI assistant. I have live access to your market data. How can I help you analyze your business today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userText = input;
        const userMessage = { text: userText, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Prepare chat history for Gemini (excluding the first greeting)
            const history = messages.slice(1).map(msg => ({
                role: msg.isBot ? "model" : "user",
                parts: [{ text: msg.text }]
            }));

            const { data } = await api.post('/api/chat', {
                message: userText,
                history: history,
                marketContext: marketData?.summary || "No data available yet"
            });

            setMessages(prev => [...prev, { text: data.text, isBot: true }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                text: "I'm having trouble connecting to my neural network. Please verify the Gemini API key or server status.",
                isBot: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleClear = () => {
        setMessages([{ text: "Got it! I've cleared our history. How can I help you start fresh?", isBot: true }]);
    };

    if (!open) return null;

    return (
        <Fade in={open}>
            <Paper
                elevation={24}
                sx={{
                    position: 'fixed',
                    bottom: { xs: 16, sm: 32 },
                    right: { xs: 16, sm: 32 },
                    width: { xs: 'calc(100% - 32px)', sm: 400 },
                    height: { xs: '65vh', sm: 500, md: 550 },
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    zIndex: 2000,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(12, 12, 12, 0.98)' : '#ffffff',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    boxShadow: theme.palette.mode === 'dark'
                        ? `0 20px 50px rgba(0,0,0,1), 0 0 20px ${theme.palette.primary.main}20`
                        : `0 20px 50px ${theme.palette.primary.main}30`,
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32, border: '2px solid white' }}>
                            <BotIcon fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900">Analytics Pro AI</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 8, height: 8, bgcolor: '#00ff00', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>Powered by Gemini 1.5</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <Tooltip title="Reset Conversation">
                            <IconButton size="small" onClick={handleClear} sx={{ color: 'white', mr: 1 }}>
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Messages Area */}
                <Box
                    ref={scrollRef}
                    sx={{
                        flexGrow: 1,
                        p: 2,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        bgcolor: theme.palette.mode === 'dark' ? 'transparent' : 'rgba(0,0,0,0.01)',
                        '&::-webkit-scrollbar': { width: 4 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'primary.main', borderRadius: 2 }
                    }}
                >
                    {messages.map((msg, i) => (
                        <Box
                            key={i}
                            sx={{
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                maxWidth: '88%',
                                display: 'flex',
                                gap: 1,
                                flexDirection: msg.isBot ? 'row' : 'row-reverse'
                            }}
                        >
                            <Avatar sx={{
                                width: 28,
                                height: 28,
                                bgcolor: msg.isBot ? 'primary.main' : 'secondary.main',
                                display: { xs: 'none', sm: 'flex' },
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {msg.isBot ? "A" : "U"}
                            </Avatar>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    borderTopLeftRadius: msg.isBot ? 0 : 3,
                                    borderTopRightRadius: msg.isBot ? 3 : 0,
                                    bgcolor: msg.isBot
                                        ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f2f5')
                                        : 'primary.main',
                                    color: msg.isBot ? 'text.primary' : 'white',
                                    boxShadow: msg.isBot ? 'none' : `0 4px 12px ${theme.palette.primary.main}40`,
                                    border: msg.isBot ? `1px solid ${theme.palette.divider}` : 'none'
                                }}
                            >
                                <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {msg.text}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    {isTyping && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
                            <CircularProgress size={12} thickness={5} sx={{ color: 'primary.main' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Thinking...</Typography>
                        </Box>
                    )}
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type your question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isTyping}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f9f9f9',
                                    fontSize: '0.9rem'
                                }
                            }}
                        />
                        <IconButton
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' },
                                '&.Mui-disabled': { bgcolor: 'action.disabledBackground', opacity: 0.5 }
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <style>
                    {`
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.2); opacity: 0.5; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                    `}
                </style>
            </Paper>
        </Fade>
    );
};

export default ChatBot;
