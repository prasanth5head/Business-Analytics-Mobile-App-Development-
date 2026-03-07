import React from "react";
import ReactMarkdown from "react-markdown";
import {
    Box, Paper, TextField, IconButton,
    Typography, Avatar, Fade
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const SUGGESTIONS = [
    "What is my revenue trend?",
    "Which products are at high risk?",
    "Analyze my profit margins",
    "Predict next month's sales"
];

export default function Chatai() {
    const [prompt, setPrompt] = React.useState("");
    const [messages, setMessages] = React.useState([]);
    const [hasStarted, setHasStarted] = React.useState(false);
    const chatEndRef = React.useRef(null);
    const inputRef = React.useRef(null);

    // Auto-scroll to bottom after every new message
    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-focus and scroll input into view on page load
    React.useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 400);
    }, []);

    const handleSuggestionClick = (text) => {
        setPrompt(text);
        inputRef.current?.focus();
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!prompt.trim()) return;

        if (!hasStarted) setHasStarted(true);

        const userMsg = { role: "user", text: prompt };
        setMessages((prev) => [...prev, userMsg]);
        const currentPrompt = prompt;
        setPrompt("");

        // Re-focus input immediately after sending
        setTimeout(() => inputRef.current?.focus(), 100);

        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;

            const res = await api.post("/api/chat",
                { prompt: currentPrompt },
                { headers: { "Authorization": token ? `Bearer ${token}` : "" } }
            );

            setMessages((prev) => [...prev, { role: "ai", text: res.data.reply || "Sorry, I couldn't generate a response. Please try again." }]);
        } catch (err) {
            console.error("Chat fetch error:", err);
            const errorMsg = err.response?.data?.message || "Connection error. Please check server.";
            setMessages((prev) => [...prev, { role: "ai", text: `⚠️ **System Message:** ${errorMsg}` }]);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0b 0%, #111114 100%)',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <Container maxWidth="md" sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: hasStarted ? 'flex-start' : 'center',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                pt: hasStarted ? 4 : 0,
                pb: 4
            }}>
                {/* ── Initial State Content ── */}
                <AnimatePresence>
                    {!hasStarted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            style={{ textAlign: 'center', marginBottom: '40px' }}
                        >
                            <Avatar sx={{
                                bgcolor: 'primary.main',
                                width: 80, height: 80,
                                margin: '0 auto 24px',
                                boxShadow: '0 0 40px rgba(14,165,233,0.4)',
                                border: '2px solid rgba(255,255,255,0.1)'
                            }}>
                                <SmartToyIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                            <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mb: 1, letterSpacing: '-0.04em' }}>
                                How can I help you?
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 450, mx: 'auto' }}>
                                Ask me about your business analytics, sales trends, or product risks. I'm here to analyze your data.
                            </Typography>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Chat Messages ── */}
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mb: 3,
                    overflowY: 'auto',
                    opacity: hasStarted ? 1 : 0,
                    visibility: hasStarted ? 'visible' : 'hidden',
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.05)', borderRadius: 4 },
                }}>
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                    gap: '16px',
                                    padding: '0 8px'
                                }}
                            >
                                <Avatar sx={{
                                    width: 32, height: 32,
                                    bgcolor: msg.role === "user" ? 'rgba(255,255,255,0.1)' : 'primary.main'
                                }}>
                                    {msg.role === "user" ? <PersonIcon sx={{ fontSize: 18 }} /> : <SmartToyIcon sx={{ fontSize: 18 }} />}
                                </Avatar>
                                <Box sx={{
                                    maxWidth: '80%',
                                    bgcolor: msg.role === "user" ? 'transparent' : 'rgba(255,255,255,0.03)',
                                    p: 1.5,
                                    borderRadius: 3,
                                    border: msg.role === "user" ? 'none' : '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <ReactMarkdown components={{
                                        p: ({ node, ...props }) => <Typography color="white" sx={{ fontSize: '0.95rem', lineHeight: 1.7 }} {...props} />,
                                        strong: ({ node, ...props }) => <span style={{ fontWeight: 800, color: '#0EA5E9' }} {...props} />,
                                        li: ({ node, ...props }) => <li style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }} {...props} />
                                    }}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </Box>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                </Box>

                {/* ── Suggestions Row ── */}
                {!hasStarted && (
                    <Box sx={{
                        display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mb: 4
                    }}>
                        {SUGGESTIONS.map((s, i) => (
                            <Button
                                key={i}
                                component={motion.button}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSuggestionClick(s)}
                                variant="outlined"
                                sx={{
                                    borderRadius: 3,
                                    px: 2.5,
                                    py: 1.2,
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.7)',
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        bgcolor: 'rgba(14,165,233,0.05)',
                                        color: 'white'
                                    }
                                }}
                            >
                                {s}
                            </Button>
                        ))}
                    </Box>
                )}

                {/* ── Floating Input Bar ── */}
                <Box
                    component={motion.form}
                    layout
                    onSubmit={handleSubmit}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '750px',
                        mx: 'auto'
                    }}
                >
                    <TextField
                        fullWidth
                        inputRef={inputRef}
                        placeholder="Message Business Bot..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        autoComplete="off"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                p: 1.5,
                                pr: 7,
                                borderRadius: 4,
                                background: 'rgba(255,255,255,0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: '1rem',
                                '& fieldset': { border: 'none' },
                                '&:hover': { background: 'rgba(255,255,255,0.04)' },
                                '&.Mui-focused': {
                                    background: 'rgba(255,255,255,0.05)',
                                    boxShadow: '0 0 30px rgba(14,165,233,0.15)',
                                    border: '1px solid rgba(14,165,233,0.3)'
                                }
                            }
                        }}
                    />
                    <IconButton
                        type="submit"
                        disabled={!prompt.trim()}
                        sx={{
                            position: 'absolute',
                            right: 12,
                            bottom: 12,
                            bgcolor: prompt.trim() ? 'primary.main' : 'rgba(255,255,255,0.05)',
                            color: prompt.trim() ? 'white' : 'rgba(255,255,255,0.2)',
                            borderRadius: 3,
                            width: 44,
                            height: 44,
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        <SendIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    {!hasStarted && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: 'center' }}>
                            <AutoFixHighIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                Business Bot can analyze your market trends & inventory efficiency
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    );
}
