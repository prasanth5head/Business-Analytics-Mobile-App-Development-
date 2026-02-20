import React, { useState, useEffect } from 'react';
import { Snackbar, Button, IconButton, Typography, Box, Paper } from '@mui/material';
import { Close as CloseIcon, SystemUpdate as UpdateIcon } from '@mui/icons-material';

const PWAUpdateHandler = () => {
    const [show, setShow] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState(null);

    useEffect(() => {
        const handleUpdate = (event) => {
            setWaitingWorker(event.detail.waiting);
            setShow(true);
        };

        window.addEventListener('pwa-update', handleUpdate);
        return () => window.removeEventListener('pwa-update', handleUpdate);
    }, []);

    const updateApp = () => {
        if (waitingWorker) {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
            waitingWorker.addEventListener('statechange', (e) => {
                if (e.target.state === 'activated') {
                    window.location.reload();
                }
            });
        }
        setShow(false);
    };

    return (
        <Snackbar
            open={show}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            onClose={() => setShow(false)}
            sx={{ mb: { xs: 8, sm: 2 } }} // Lift it up a bit on mobile to clear nav bars if any
        >
            <Paper
                elevation={10}
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    border: '1px solid',
                    borderColor: 'primary.main',
                    minWidth: 300,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.contrastText',
                    }}
                >
                    <UpdateIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        New Version Available
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Update to access the latest features.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="small"
                    onClick={updateApp}
                    sx={{
                        borderRadius: 2,
                        fontWeight: 900,
                        px: 3,
                    }}
                >
                    UPDATE
                </Button>
                <IconButton size="small" onClick={() => setShow(false)} sx={{ ml: 1 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Paper>
        </Snackbar>
    );
};

export default PWAUpdateHandler;
