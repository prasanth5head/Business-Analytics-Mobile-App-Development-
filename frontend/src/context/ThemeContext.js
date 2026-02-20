import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode ? savedMode : 'dark'; // Default to dark as it's more immersive
    });

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#FF5E00', // Lava Orange
                        light: '#FF8A4D',
                        dark: '#CC4B00',
                        contrastText: '#ffffff',
                    },
                    secondary: {
                        main: '#FFB800', // Gold
                        light: '#FFD147',
                        dark: '#B88600',
                        contrastText: '#000000',
                    },
                    background: {
                        default: mode === 'light' ? '#F8F9FA' : '#080808', // Neutral dark, zero blue
                        paper: mode === 'light' ? '#FFFFFF' : '#121212',
                    },
                    text: {
                        primary: mode === 'light' ? '#1A1A1A' : '#FFFFFF',
                        secondary: mode === 'light' ? '#666666' : '#A0A0A0',
                    },
                    divider: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.1)',
                },
                typography: {
                    fontFamily: '"Outfit", "Inter", sans-serif',
                    h1: { fontWeight: 900 },
                    h2: { fontWeight: 800 },
                    h3: { fontWeight: 800 },
                    h4: { fontWeight: 700 },
                    h5: { fontWeight: 700 },
                    h6: { fontWeight: 700 },
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: {
                            body: {
                                scrollbarColor: mode === 'light' ? '#CCCCCC #F8F9FA' : '#333333 #080808',
                                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                                    backgroundColor: 'transparent',
                                    width: '6px',
                                    height: '6px',
                                },
                                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                                    borderRadius: 10,
                                    backgroundColor: mode === 'light' ? '#CCCCCC' : '#444444',
                                },
                                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                                    backgroundColor: '#FF5E00',
                                },
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 16,
                                textTransform: 'uppercase',
                                fontWeight: 900,
                                letterSpacing: '0.05em',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: mode === 'light'
                                        ? '0 6px 15px rgba(255, 94, 0, 0.2)'
                                        : '0 8px 20px rgba(0, 0, 0, 0.4)',
                                },
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 32,
                                backgroundImage: mode === 'light'
                                    ? 'none'
                                    : 'radial-gradient(at 0% 0%, rgba(255, 94, 0, 0.05) 0, transparent 50%)',
                                border: mode === 'light' ? '1px solid #EDEDED' : '1px solid rgba(255, 255, 255, 0.05)',
                                boxShadow: mode === 'light'
                                    ? '0 10px 30px rgba(0,0,0,0.05)'
                                    : '0 20px 50px rgba(0, 0, 0, 0.4)',
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                borderRadius: 24,
                                backgroundImage: 'none',
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 16,
                                    '& fieldset': {
                                        borderColor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderWidth: '2px',
                                    },
                                },
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};
