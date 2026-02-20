import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Descriptive from './pages/Descriptive';
import Diagnostic from './pages/Diagnostic';
import Predictive from './pages/Predictive';
import Prescriptive from './pages/Prescriptive';
import Register from './pages/Register';
import Reports from './pages/Reports';

import Login from './pages/Login';
import ReactiveCursor from './components/ReactiveCursor';
import PWAUpdateHandler from './components/PWAUpdateHandler';

import ProtectedRoute from './components/ProtectedRoute';
import { MarketProvider } from './context/MarketContext';
import { CustomThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <CustomThemeProvider>
      <MarketProvider>
        <BrowserRouter>
          <ReactiveCursor />
          <PWAUpdateHandler />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="descriptive" element={<Descriptive />} />
                <Route path="diagnostic" element={<Diagnostic />} />
                <Route path="predictive" element={<Predictive />} />
                <Route path="prescriptive" element={<Prescriptive />} />
                <Route path="reports" element={<Reports />} />
                <Route path="*" element={<Dashboard />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </MarketProvider>
    </CustomThemeProvider>
  );
}

export default App;
