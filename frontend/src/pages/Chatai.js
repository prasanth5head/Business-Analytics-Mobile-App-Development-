import React from "react";
import ReactMarkdown from "react-markdown";
import {
    Box, Paper, TextField, IconButton,
    Typography, Avatar, Fade
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api";

export default function Chatai() {
    const [prompt, setPrompt] = React.useState("");
    const [messages, setMessages] = React.useState([
        { role: "ai", text: "Hello! I'm your Business Bot 🤖 How can I help with your analytics today?" }
    ]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

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

            setMessages((prev) => [...prev, { role: "ai", text: res.data.response || "No reply" }]);
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
            p: { xs: 0, sm: 2 },
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <Fade in={true} timeout={500}>
                <Paper elevation={12} sx={{
                    width: { xs: '100%', sm: '95%', md: 650 },
                    height: { xs: '100vh', sm: 'calc(100vh - 32px)', md: '88vh' },
                    maxHeight: 900,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: { xs: 0, sm: 4, md: 6 },
                    overflow: 'hidden',
                    background: 'rgba(15, 15, 15, 0.97)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                }}>

                    {/* ── Header ── */}
                    <Box display="flex" alignItems="center" gap={2} px={2.5} py={2} sx={{
                        background: 'linear-gradient(135deg, rgba(255,94,0,0.15) 0%, rgba(255,184,0,0.05) 100%)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        flexShrink: 0
                    }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 42, boxShadow: '0 0 18px rgba(255,94,0,0.5)' }}>
                            <SmartToyIcon />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1rem', lineHeight: 1.2 }}>
                                Business Bot
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.6}>
                                <Box sx={{ width: 7, height: 7, bgcolor: '#4caf50', borderRadius: '50%' }} />
                                <Typography variant="caption" color="text.secondary">Online & Ready</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* ── Messages ── */}
                    <Box flex={1} p={2} sx={{
                        overflowY: "auto",
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: 4 },
                    }}>
                        {messages.map((msg, i) => (
                            <Box key={i} display="flex"
                                flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                                alignItems="flex-start" gap={1.2}>
                                <Avatar sx={{
                                    width: 28, height: 28, flexShrink: 0,
                                    bgcolor: msg.role === "user" ? 'secondary.main' : 'primary.dark'
                                }}>
                                    {msg.role === "user" ? <PersonIcon sx={{ fontSize: 16 }} /> : <SmartToyIcon sx={{ fontSize: 16 }} />}
                                </Avatar>
                                <Paper sx={{
                                    p: '10px 14px',
                                    maxWidth: "78%",
                                    background: msg.role === "user"
                                        ? 'linear-gradient(135deg, #FF5E00, #FF8A00)'
                                        : 'rgba(255,255,255,0.05)',
                                    color: "white",
                                    borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                                    border: msg.role === "user" ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: msg.role === "user" ? '0 3px 12px rgba(255,94,0,0.25)' : 'none',
                                    wordBreak: 'break-word'
                                }}>
                                    {msg.role === "ai" ? (
                                        <Box sx={{ '& p': { m: 0 }, '& ul': { mt: 0.5, mb: 0 }, fontSize: '0.88rem', lineHeight: 1.6 }}>
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </Box>
                                    ) : (
                                        <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{msg.text}</Typography>
                                    )}
                                </Paper>
                            </Box>
                        ))}
                        <div ref={chatEndRef} />
                    </Box>

                    {/* ── Input Bar ── */}
                    <Box component="form" onSubmit={handleSubmit} px={2} py={1.5} sx={{
                        background: 'rgba(0,0,0,0.35)',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        gap: 1.2,
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        <TextField
                            fullWidth
                            inputRef={inputRef}
                            placeholder="Type your message..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            variant="outlined"
                            autoComplete="off"
                            size="small"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                    background: 'rgba(255,255,255,0.04)',
                                    fontSize: '0.9rem',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255,94,0,0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: '#FF5E00' },
                                }
                            }}
                        />
                        <IconButton type="submit" disabled={!prompt.trim()} sx={{
                            width: 44, height: 44, flexShrink: 0,
                            background: prompt.trim()
                                ? 'linear-gradient(135deg, #FF5E00, #FF8A00)'
                                : 'rgba(255,255,255,0.06)',
                            color: prompt.trim() ? 'white' : 'rgba(255,255,255,0.25)',
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': { transform: 'scale(1.08)' }
                        }}>
                            <SendIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>

                </Paper>
            </Fade>
        </Box>
    );
}
