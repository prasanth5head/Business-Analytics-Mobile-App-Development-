import React from "react";
import ReactMarkdown from "react-markdown";

import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    useTheme,
    Fade
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import api from "../api";

export default function Chatai() {
    const theme = useTheme();
    const [prompt, setPrompt] = React.useState("");
    const [messages, setMessages] = React.useState([
        { role: "ai", text: "Hello! I'm your friendly Business Bot. How can I help you with your analytics today?" }
    ]);
    const chatEndRef = React.useRef(null);

    // auto scroll
    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const userMsg = { role: "user", text: prompt };
        setMessages((prev) => [...prev, userMsg]);
        const currentPrompt = prompt;
        setPrompt("");

        try {
            // Get token from userInfo since that's how it's stored in this app
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;

            const res = await api.post("/chat",
                { prompt: currentPrompt },
                {
                    headers: {
                        "Authorization": token ? `Bearer ${token}` : "",
                    }
                }
            );

            const aiMsg = {
                role: "ai",
                text: res.data.response || "No reply",
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.error("Chat fetch error:", err);
            const errorMsg = err.response?.data?.message || "Connection error. Please check if the server is running.";

            const aiMsg = {
                role: "ai",
                text: `⚠️ **System Message:** ${errorMsg}`,
            };

            setMessages((prev) => [...prev, aiMsg]);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                minHeight: '80vh',
                py: 4
            }}
        >
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={12}
                    sx={{
                        width: { xs: '95%', sm: 600 },
                        height: 700,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 6,
                        overflow: 'hidden',
                        background: 'rgba(20, 20, 20, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative'
                    }}
                >
                    {/* Header */}
                    <Box
                        p={3}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 94, 0, 0.15) 0%, rgba(255, 184, 0, 0.05) 100%)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 48,
                                height: 48,
                                boxShadow: '0 0 20px rgba(255, 94, 0, 0.4)'
                            }}
                        >
                            <SmartToyIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
                                Business Bot
                            </Typography>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
                                <Typography variant="caption" color="text.secondary">
                                    Online & Ready to Help
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Messages Body */}
                    <Box
                        flex={1}
                        p={3}
                        sx={{
                            overflowY: "auto",
                            background: "transparent",
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        {messages.map((msg, i) => (
                            <Box
                                key={i}
                                display="flex"
                                flexDirection={msg.role === "user" ? "row-reverse" : "row"}
                                alignItems="flex-start"
                                gap={1.5}
                            >
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        fontSize: '1rem',
                                        bgcolor: msg.role === "user" ? 'secondary.main' : 'primary.dark'
                                    }}
                                >
                                    {msg.role === "user" ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                                </Avatar>
                                <Paper
                                    sx={{
                                        p: 2,
                                        maxWidth: "80%",
                                        background: msg.role === "user"
                                            ? 'linear-gradient(135deg, #FF5E00 0%, #FF8A00 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        color: msg.role === "user" ? "white" : "white",
                                        borderRadius: msg.role === "user" ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
                                        border: msg.role === "user" ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: msg.role === "user" ? '0 4px 15px rgba(255, 94, 0, 0.2)' : 'none'
                                    }}
                                >
                                    {msg.role === "ai" ? (
                                        <Box sx={{
                                            '& p': { m: 0 },
                                            '& ul': { mt: 1, mb: 0 },
                                            fontSize: '0.95rem',
                                            lineHeight: 1.6
                                        }}>
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                            {msg.text}
                                        </Typography>
                                    )}
                                </Paper>
                            </Box>
                        ))}
                        <div ref={chatEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        p={3}
                        sx={{
                            background: 'rgba(0,0,0,0.2)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Ask Business Bot something..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            variant="outlined"
                            autoComplete="off"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 4,
                                    background: 'rgba(255, 255, 255, 0.03)',
                                }
                            }}
                        />

                        <IconButton
                            color="primary"
                            type="submit"
                            disabled={!prompt.trim()}
                            sx={{
                                width: 56,
                                height: 56,
                                background: 'linear-gradient(135deg, #FF5E00 0%, #B88600 100%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #FF8A00 0%, #FF5E00 100%)',
                                    transform: 'scale(1.05)'
                                },
                                '&.Mui-disabled': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
}
