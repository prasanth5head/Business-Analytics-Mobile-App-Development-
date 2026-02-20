import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    List,
    ListItem,
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

const ChatBot = ({ open, onClose }) => {
    const theme = useTheme();
    const [messages, setMessages] = useState([
        { text: "Hello! I am your Analytics Pro assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { text: input, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let response = "I'm analyzing your market data... Based on current trends, your revenue is showing a positive growth of 12.5% this month.";

            if (input.toLowerCase().includes('revenue')) {
                response = "Your total revenue currently stands at ₹1.2M with strongest performance in the Electronics category.";
            } else if (input.toLowerCase().includes('help')) {
                response = "I can help you analyze sales trends, predict future growth, or identify risks in your product categories. What would you like to know?";
            } else if (input.toLowerCase().includes('risk')) {
                response = "I've detected a slight increase in customer complaints in the Beauty category. You might want to check the Diagnostic section for details.";
            }

            setMessages(prev => [...prev, { text: response, isBot: true }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleClear = () => {
        setMessages([{ text: "Hello! I am your Analytics Pro assistant. How can I help you today?", isBot: true }]);
    };

    if (!open) return null;

    return (
        <Fade in={open}>
            <Paper
                elevation={24}
                sx={{
                    position: 'fixed',
                    bottom: { xs: 16, md: 32 },
                    right: { xs: 16, md: 32 },
                    width: { xs: 'calc(100% - 32px)', sm: 400 },
                    height: { xs: '60vh', md: 500 },
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    zIndex: 2000,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.95)' : '#ffffff',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    boxShadow: `0 20px 50px ${theme.palette.primary.main}30`,
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32 }}>
                            <BotIcon fontSize="small" />
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900">AI Assistant</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>Analytics Pro Intelligence</Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Tooltip title="Clear Chat">
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
                        '&::-webkit-scrollbar': { width: 6 },
                        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
                    }}
                >
                    {messages.map((msg, i) => (
                        <Box
                            key={i}
                            sx={{
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                maxWidth: '85%',
                                display: 'flex',
                                gap: 1,
                                flexDirection: msg.isBot ? 'row' : 'row-reverse'
                            }}
                        >
                            <Avatar sx={{
                                width: 28,
                                height: 28,
                                bgcolor: msg.isBot ? 'primary.main' : 'secondary.main',
                                display: { xs: 'none', sm: 'flex' }
                            }}>
                                {msg.isBot ? <BotIcon sx={{ fontSize: 16 }} /> : <UserIcon sx={{ fontSize: 16 }} />}
                            </Avatar>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 3,
                                    borderTopLeftRadius: msg.isBot ? 0 : 3,
                                    borderTopRightRadius: msg.isBot ? 3 : 0,
                                    bgcolor: msg.isBot
                                        ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5')
                                        : 'primary.main',
                                    color: msg.isBot ? 'text.primary' : 'white',
                                    boxShadow: msg.isBot ? 'none' : `0 4px 12px ${theme.palette.primary.main}30`
                                }}
                            >
                                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                    {msg.text}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                    {isTyping && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 4 }}>
                            <CircularProgress size={12} sx={{ color: 'primary.main' }} />
                            <Typography variant="caption" color="text.secondary">AI is thinking...</Typography>
                        </Box>
                    )}
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f9f9f9'
                                }
                            }}
                        />
                        <IconButton
                            onClick={handleSend}
                            disabled={!input.trim()}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' },
                                '&.Mui-disabled': { bgcolor: 'action.disabledBackground' }
                            }}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </Fade>
    );
};

export default ChatBot;
