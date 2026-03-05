import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#0EA5E9', // Sky Blue
            light: '#7DD3FC',
            dark: '#0369A1',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#06B6D4', // Vibrant Cyan
            light: '#67E8F9',
            dark: '#0891B2',
            contrastText: '#ffffff',
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
            main: '#EF4444', // Clean Red
        },
        warning: {
            main: '#06B6D4', // Vibrant Cyan (Replacing Orange Warning)
        },
        info: {
            main: '#38BDF8', // Light Sky Blue
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
                        backgroundColor: '#0EA5E9',
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
                        boxShadow: '0 12px 24px rgba(14, 165, 233, 0.3)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #7DD3FC 0%, #0EA5E9 100%)',
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
                            borderColor: 'rgba(14, 165, 233, 0.4)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#0EA5E9',
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
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.05) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.05) 0, transparent 50%)',
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
