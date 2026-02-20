import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF5E00', // Lava Orange - Bright & Attractive
            light: '#FF8A4D',
            dark: '#CC4B00',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#FFB800', // Radiant Gold
            light: '#FFD147',
            dark: '#B88600',
            contrastText: '#000000',
        },
        background: {
            default: '#080808', // Pure deep neutral dark
            paper: '#121212',   // Surface
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#A0A0A0',
        },
        success: {
            main: '#D4FF00', // Lime Yellow - Bright & Creative
        },
        error: {
            main: '#FF3D00', // Vivid Red-Orange
        },
        warning: {
            main: '#FFB800',
        },
        info: {
            main: '#FF8A00', // Deep Orange
        },
        divider: 'rgba(255, 255, 255, 0.1)',
    },
    typography: {
        fontFamily: [
            'Outfit',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 900, fontSize: '3.5rem', letterSpacing: '-0.03em' },
        h2: { fontWeight: 800, fontSize: '2.8rem', letterSpacing: '-0.02em' },
        h3: { fontWeight: 800, fontSize: '2.2rem' },
        h4: { fontWeight: 700, fontSize: '1.8rem' },
        h5: { fontWeight: 700, fontSize: '1.3rem' },
        h6: { fontWeight: 700, fontSize: '1.1rem' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#333333 #080808',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: 'transparent',
                        width: '6px',
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 10,
                        backgroundColor: '#444444',
                        border: '1px solid transparent',
                        backgroundClip: 'padding-box',
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
                    padding: '12px 28px',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: '0 12px 24px rgba(255, 94, 0, 0.3)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #FF5E00 0%, #FFB800 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #FF8A4D 0%, #FF5E00 100%)',
                    }
                }
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 16,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 94, 0, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FF5E00',
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 32,
                    backgroundColor: '#161616',
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(255, 94, 0, 0.05) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 184, 0, 0.05) 0, transparent 50%)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 24,
                },
            },
        },
    },
});

export default theme;
