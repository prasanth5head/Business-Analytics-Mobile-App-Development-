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
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarColor: '#6b6b6b #2b2b2b',
                    '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                        backgroundColor: 'transparent',
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                        borderRadius: 8,
                        backgroundColor: '#3f445e',
                        minHeight: 24,
                        border: '2px solid transparent',
                        backgroundClip: 'padding-box',
                    },
                    '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
                        backgroundColor: '#4e5474',
                    },
                    '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
                        backgroundColor: '#4e5474',
                    },
                    '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#4e5474',
                    },
                    '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'none',
                    padding: '8px 20px',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(115, 103, 240, 0.4)',
                        transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #7367F0 30%, #9E94FF 90%)',
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
                        borderRadius: 12,
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                            borderColor: '#7367F0',
                        },
                        '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 16,
                },
            },
        },
    },
});

export default theme;
