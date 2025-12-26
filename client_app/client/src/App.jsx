import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BrowseStartups from './pages/BrowseStartups';
import ApplicationForm from './pages/ApplicationForm';
import Analytics from './pages/Analytics';
import Membership from './pages/Membership';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Investments from './pages/Investments';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import StartupDetails from './pages/StartupDetails';
import PostStartup from './pages/PostStartup';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// ... existing imports ...

// Wrapper to conditionally render Layout or Navbar
const AppContent = () => {
  const location = useLocation();
  const noLayoutRoutes = ['/', '/login', '/register', '/forgot-password'];

  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  if (isNoLayout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ... existing protected routes ... */}
        <Route path="/browse" element={<BrowseStartups />} />
        <Route path="/startup/:id" element={<StartupDetails />} />
        <Route path="/post-startup" element={<PostStartup />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
