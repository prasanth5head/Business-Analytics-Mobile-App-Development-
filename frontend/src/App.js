import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ReactiveCursor from './components/ReactiveCursor';
import PWAUpdateHandler from './components/PWAUpdateHandler';
import ProtectedRoute from './components/ProtectedRoute';
import { MarketProvider } from './context/MarketContext';
import { MyBusinessProvider } from './context/MyBusinessContext';
import { CustomThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { Skeleton } from '@mui/material';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Descriptive = lazy(() => import('./pages/Descriptive'));
const Diagnostic = lazy(() => import('./pages/Diagnostic'));
const Predictive = lazy(() => import('./pages/Predictive'));
const Prescriptive = lazy(() => import('./pages/Prescriptive'));
const Register = lazy(() => import('./pages/Register'));
const Reports = lazy(() => import('./pages/Reports'));
const RevenueEntry = lazy(() => import('./pages/RevenueEntry'));
const Login = lazy(() => import('./pages/Login'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Chatai = lazy(() => import('./pages/Chatai'));
const ManualReport = lazy(() => import('./pages/ManualReport'));
const EntryHistory = lazy(() => import('./pages/EntryHistory'));

const MyDashboard = lazy(() => import('./pages/MyBusiness/MyDashboard'));
const MyDescriptive = lazy(() => import('./pages/MyBusiness/MyDescriptive'));
const MyDiagnostic = lazy(() => import('./pages/MyBusiness/MyDiagnostic'));
const MyPredictive = lazy(() => import('./pages/MyBusiness/MyPredictive'));
const MyPrescriptive = lazy(() => import('./pages/MyBusiness/MyPrescriptive'));
const MyReports = lazy(() => import('./pages/MyBusiness/MyReports'));

const PageLoader = () => (
  <div style={{ padding: '20px' }}>
    <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
    <Skeleton variant="rectangular" height={400} sx={{ mt: 2, borderRadius: 2 }} />
  </div>
);

const RoleBasedRedirect = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const role = userInfo.businessRole || 'learner';
  return (role === 'manorwoman')
    ? <Navigate to="/my-business/dashboard" replace />
    : <Navigate to="/actual-world/dashboard" replace />;
};

function App() {
  return (
    <CustomThemeProvider>
      <SocketProvider>
        <MarketProvider>
          <MyBusinessProvider>
            <BrowserRouter>
              <ReactiveCursor />
              <PWAUpdateHandler />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<RoleBasedRedirect />} />
                      <Route path="actual-world/dashboard" element={<Dashboard />} />
                      <Route path="descriptive" element={<Descriptive />} />
                      <Route path="diagnostic" element={<Diagnostic />} />
                      <Route path="predictive" element={<Predictive />} />
                      <Route path="prescriptive" element={<Prescriptive />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="revenue" element={<RevenueEntry />} />
                      <Route path="entry-history" element={<EntryHistory />} />
                      <Route path="manual-report" element={<ManualReport />} />
                      <Route path="chat" element={<Chatai />} />
                      <Route path="my-business/dashboard" element={<MyDashboard />} />
                      <Route path="my-business/descriptive" element={<MyDescriptive />} />
                      <Route path="my-business/diagnostic" element={<MyDiagnostic />} />
                      <Route path="my-business/predictive" element={<MyPredictive />} />
                      <Route path="my-business/prescriptive" element={<MyPrescriptive />} />
                      <Route path="my-business/reports" element={<MyReports />} />
                      <Route path="*" element={<Dashboard />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </MyBusinessProvider>
        </MarketProvider>
      </SocketProvider>
    </CustomThemeProvider>
  );
}

export default App;
