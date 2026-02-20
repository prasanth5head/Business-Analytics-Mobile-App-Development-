import React from "react";
import ReactMarkdown from "react-markdown";

import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// Use the backend URL from environment or default to 5000
const API = "http://localhost:5000/chat";

export default function Chatai() {
    const [prompt, setPrompt] = React.useState("");
    const [messages, setMessages] = React.useState([]);
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

        try {
            // Get token from userInfo since that's how it's stored in this app
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const token = userInfo?.token;

            const res = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            const aiMsg = {
                role: "ai",
                text: data.response || "No reply",
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch {
            alert("Chat error");
        }

        setPrompt("");
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '80vh' }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: { xs: '95%', sm: 500 },
                    height: 600,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                }}
            >
                {/* Title */}
                <Typography
                    variant="h6"
                    textAlign="center"
                    p={2}
                    borderBottom="1px solid #ddd"
                >
                    AI Chat
                </Typography>

                {/* Messages */}
                <Box
                    flex={1}
                    p={2}
                    sx={{ overflowY: "auto", background: "#f5f5f5" }}
                >
                    {messages.map((msg, i) => (
                        <Box
                            key={i}
                            display="flex"
                            justifyContent={
                                msg.role === "user" ? "flex-end" : "flex-start"
                            }
                            mb={1}
                        >
                            <Paper
                                sx={{
                                    p: 1.5,
                                    maxWidth: "70%",
                                    bgcolor:
                                        msg.role === "user"
                                            ? "primary.main"
                                            : "grey.300",
                                    color:
                                        msg.role === "user" ? "white" : "black",
                                    borderRadius: 3,
                                    ml: msg.role === "ai" ? 1 : "auto",
                                    mr: msg.role === "user" ? 1 : "auto",
                                    textAlign: msg.role === "user" ? "right" : "left",
                                }}
                            >
                                {msg.role === "ai" ? (
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                ) : (
                                    msg.text
                                )}
                            </Paper>
                        </Box>
                    ))}
                    <div ref={chatEndRef} />
                </Box>


                {/* Input */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display="flex"
                    p={1.5}
                    borderTop="1px solid #ddd"
                    gap={1}
                >
                    <TextField
                        fullWidth
                        placeholder="Type a message..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}

                        variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "30px",
                                background: "#f9f9f9",
                                paddingRight: "8px"
                            }
                        }}
                    />

                    <IconButton color="primary" type="submit">
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
}
