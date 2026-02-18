import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark', // Default to dark mode for a premium feel
        primary: {
            main: '#7367F0', // Vibrant Violet/Indigo
            light: '#9E94FF',
            dark: '#4839EB',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#00CFE8', // Cyan/Teal accent
            light: '#5EE6F6',
            dark: '#009DB0',
            contrastText: '#ffffff',
        },
        background: {
            default: '#232730', // Deep dark blue-grey
            paper: '#2F3349',   // Slightly lighter for cards
        },
        text: {
            primary: '#EAEFF4',
            secondary: '#B6BEC9',
        },
        success: {
            main: '#28C76F',
        },
        error: {
            main: '#EA5455',
        },
        warning: {
            main: '#FF9F43',
        },
        info: {
            main: '#00CFE8',
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 600, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.75rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 500, fontSize: '1.25rem' },
        h6: { fontWeight: 500, fontSize: '1rem' },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 2px 10px rgba(115, 103, 240, 0.3)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #7367F0 30%, #9E94FF 90%)',
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    backgroundImage: 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;
