import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#E1FF01', // Electric Lime - Unconventional & Creative
            light: '#EFFF8C',
            dark: '#A6BC00',
            contrastText: '#000000',
        },
        secondary: {
            main: '#9D50FF', // Vivid Purple
            light: '#C294FF',
            dark: '#6F20DB',
            contrastText: '#ffffff',
        },
        background: {
            default: '#05070A', // Deep Midnight (Almost black)
            paper: '#0F131A',   // Darker surface
        },
        text: {
            primary: '#F0F5FF',
            secondary: '#8F9BB3',
        },
        success: {
            main: '#00E676',
        },
        error: {
            main: '#FF3D71', // Vibrant Red-Pink
        },
        warning: {
            main: '#FFAA00',
        },
        info: {
            main: '#00BFFF',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
    },
    typography: {
        fontFamily: [
            'Outfit', // More modern/creative than Inter
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 800, fontSize: '3rem', letterSpacing: '-0.02em' },
        h2: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.01em' },
        h3: { fontWeight: 700, fontSize: '2rem' },
        h4: { fontWeight: 600, fontSize: '1.75rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 600, fontSize: '1.1rem' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#2E3A59 #05070A',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: 'transparent',
                        width: '6px',
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 10,
                        backgroundColor: '#2E3A59',
                        border: '1px solid transparent',
                        backgroundClip: 'padding-box',
                    },
                    '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#E1FF01',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    padding: '10px 24px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: '0 8px 16px rgba(225, 255, 1, 0.2)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #E1FF01 0%, #A6BC00 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #EFFF8C 0%, #E1FF01 100%)',
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
                        borderRadius: 14,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(225, 255, 1, 0.3)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#E1FF01',
                            borderWidth: '1px',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    backgroundColor: '#10141D',
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(225, 255, 1, 0.03) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(157, 80, 255, 0.03) 0, transparent 50%)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 20,
                },
            },
        },
    },
});

export default theme;
