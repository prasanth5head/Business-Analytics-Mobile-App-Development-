import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Avatar,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Assessment as AssessmentIcon,
    Logout as LogoutIcon,
    BarChart as DescriptiveIcon,
    Search as DiagnosticIcon,
    Timeline as PredictiveIcon,
    Lightbulb as PrescriptiveIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    Receipt as ReceiptIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import { useColorMode } from '../context/ThemeContext';

import ChatAssistantIcon from '@mui/icons-material/Chat';

const drawerWidth = 260;

const Layout = () => {
    const theme = useTheme();
    const colorMode = useColorMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { type: 'subheader', text: 'Actual World Business Analytics' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Descriptive', icon: <DescriptiveIcon />, path: '/descriptive' },
        { text: 'Diagnostic', icon: <DiagnosticIcon />, path: '/diagnostic' },
        { text: 'Predictive', icon: <PredictiveIcon />, path: '/predictive' },
        { text: 'Prescriptive', icon: <PrescriptiveIcon />, path: '/prescriptive' },
        { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },

        { type: 'subheader', text: 'My Business Analytics' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/my-business/dashboard' },
        { text: 'Descriptive', icon: <DescriptiveIcon />, path: '/my-business/descriptive' },
        { text: 'Diagnostic', icon: <DiagnosticIcon />, path: '/my-business/diagnostic' },
        { text: 'Predictive', icon: <PredictiveIcon />, path: '/my-business/predictive' },
        { text: 'Prescriptive', icon: <PrescriptiveIcon />, path: '/my-business/prescriptive' },
        { text: 'Reports', icon: <AssessmentIcon />, path: '/my-business/reports' },

        { type: 'subheader', text: 'Data Management' },
        { text: 'Revenue Entry', icon: <ReceiptIcon />, path: '/revenue' },
        { text: 'Entry History', icon: <HistoryIcon />, path: '/entry-history' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', py: 4, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1, // Square (minimal rounding)
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 8px 16px ${theme.palette.primary.main}40`
                    }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 900 }}>BA</Typography>
                    </Box>
                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 900, letterSpacing: '-0.04em' }}>
                        Analytics <span style={{ color: theme.palette.primary.main }}>Pro</span>
                    </Typography>
                </Box>
            </Toolbar>
            <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                <List>
                    {menuItems.map((item, index) => (
                        item.type === 'subheader' ? (
                            <Typography
                                key={`header-${index}`}
                                variant="caption"
                                sx={{
                                    px: 4,
                                    pt: 3,
                                    pb: 1,
                                    display: 'block',
                                    color: theme.palette.primary.main,
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontSize: '0.7rem'
                                }}
                            >
                                {item.text}
                            </Typography>
                        ) : (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    selected={location.pathname === item.path}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        mx: 2,
                                        my: 0.5,
                                        borderRadius: 3,
                                        py: 1, // Slightly reduced to fit more items
                                        '&.Mui-selected': {
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main}25 0%, transparent 100%)`,
                                            color: theme.palette.primary.main,
                                            '& .MuiListItemIcon-root': {
                                                color: theme.palette.primary.main,
                                            },
                                            '&:hover': {
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main}35 0%, transparent 100%)`,
                                            },
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.03)',
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? theme.palette.primary.main : 'text.secondary' }}>
                                        {React.cloneElement(item.icon, { sx: { fontSize: '1.2rem' } })}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} />
                                </ListItemButton>
                            </ListItem>
                        )
                    ))}
                </List>
            </Box>
            <List sx={{ pb: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={location.pathname === '/chat'}
                        onClick={() => navigate('/chat')}
                        sx={{
                            mx: 2,
                            borderRadius: 3,
                            bgcolor: location.pathname === '/chat' ? 'primary.main' : 'transparent',
                            color: location.pathname === '/chat' ? 'white' : 'inherit',
                            '&:hover': {
                                bgcolor: location.pathname === '/chat' ? 'primary.dark' : 'rgba(255,255,255,0.03)',
                            },
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '& .MuiListItemIcon-root': {
                                    color: 'white',
                                },
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: location.pathname === '/chat' ? 'white' : 'inherit' }}><ChatAssistantIcon /></ListItemIcon>
                        <ListItemText primary="AI Chatbot" primaryTypographyProps={{ fontWeight: 800 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            localStorage.removeItem('userInfo');
                            navigate('/login');
                        }}
                        sx={{ mx: 2, borderRadius: 3 }}
                    >
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    boxShadow: 'none',
                    bgcolor: 'background.default',
                    color: 'text.primary', // Ensure children inherit the correct theme color
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            mr: 2,
                            display: { sm: 'none' },
                            color: theme.palette.mode === 'light' ? 'black' : 'inherit' // Explicitly black for visibility
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                        <Typography variant="subtitle1" color="text.primary">
                            {JSON.parse(localStorage.getItem('userInfo'))?.name}
                        </Typography>
                        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                            {JSON.parse(localStorage.getItem('userInfo'))?.name?.charAt(0)}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', bgcolor: 'background.paper' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh' }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
