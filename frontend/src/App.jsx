import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import LogCycle from './pages/LogCycle'
import Calendar from './pages/Calendar'
import SymptomLog from './pages/SymptomLog'
import Insights from './pages/Insights'
import Profile from './pages/Profile'
import PersonalSettings from './pages/PersonalSettings'
import PrivacySettings from './pages/PrivacySettings'
import HelpSupport from './pages/HelpSupport'
import Reminders from './pages/Reminders'
import BottomNav from './components/BottomNav'
import './index.css'

// Routes are managed below using full components

const PrivateRoute = ({ children }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) return null;
    if (!token) return <Navigate to="/login" />;

    // Enforce onboarding if not completed
    if (user && !user.is_onboarded && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" />;
    }

    // Prevent accessing onboarding if already done
    if (user && user.is_onboarded && location.pathname === '/onboarding') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

const AppContent = () => {
    const { user, token } = useAuth();
    const location = useLocation();
    const showNav = token && user?.is_onboarded && !['/login', '/register', '/onboarding'].includes(location.pathname);

    return (
        <div className="app-container">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
                <Route path="/log" element={<PrivateRoute><LogCycle /></PrivateRoute>} />
                <Route path="/symptoms" element={<PrivateRoute><SymptomLog /></PrivateRoute>} />
                <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/profile/personal" element={<PrivateRoute><PersonalSettings /></PrivateRoute>} />
                <Route path="/profile/privacy" element={<PrivateRoute><PrivacySettings /></PrivateRoute>} />
                <Route path="/profile/help" element={<PrivateRoute><HelpSupport /></PrivateRoute>} />
                <Route path="/reminders" element={<PrivateRoute><Reminders /></PrivateRoute>} />

                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>

            {showNav && <BottomNav />}
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;
