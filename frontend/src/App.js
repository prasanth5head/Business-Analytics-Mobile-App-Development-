import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Descriptive from './pages/Descriptive';
import Diagnostic from './pages/Diagnostic';
import Predictive from './pages/Predictive';
import Prescriptive from './pages/Prescriptive';
import Register from './pages/Register';
import Reports from './pages/Reports';
import RevenueEntry from './pages/RevenueEntry';

import Login from './pages/Login';
import Chatai from './pages/Chatai';
import ManualReport from './pages/ManualReport';
import EntryHistory from './pages/EntryHistory';

// My Business Analytics Pages
import MyDashboard from './pages/MyBusiness/MyDashboard';
import MyDescriptive from './pages/MyBusiness/MyDescriptive';
import MyDiagnostic from './pages/MyBusiness/MyDiagnostic';
import MyPredictive from './pages/MyBusiness/MyPredictive';
import MyPrescriptive from './pages/MyBusiness/MyPrescriptive';
import MyReports from './pages/MyBusiness/MyReports';

import ReactiveCursor from './components/ReactiveCursor';
import PWAUpdateHandler from './components/PWAUpdateHandler';

import ProtectedRoute from './components/ProtectedRoute';
import { MarketProvider } from './context/MarketContext';
import { MyBusinessProvider } from './context/MyBusinessContext';
import { CustomThemeProvider } from './context/ThemeContext';

const RoleBasedRedirect = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const role = userInfo.businessRole || 'learner';

  if (role === 'manorwoman') {
    return <Navigate to="/my-business/dashboard" replace />;
  }
  return <Navigate to="/actual-world/dashboard" replace />;
};

function App() {
  return (
    <CustomThemeProvider>
      <MarketProvider>
        <MyBusinessProvider>
          <BrowserRouter>
            <ReactiveCursor />
            <PWAUpdateHandler />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
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

                  {/* My Business Sub-sections */}
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
          </BrowserRouter>
        </MyBusinessProvider>
      </MarketProvider>
    </CustomThemeProvider>
  );
}

export default App;
