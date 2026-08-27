import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DesignSystem from './pages/DesignSystem';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';

import DiscoverPage from './pages/DiscoverPage';

import CreatePlanPage from './pages/CreatePlanPage';

import PlanDetailsPage from './pages/PlanDetailsPage';

import NotificationsPage from './pages/NotificationsPage';

import ChatPage from './pages/ChatPage';

import SettingsPage from './pages/SettingsPage';

import { AuthProvider } from './lib/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-[100dvh] bg-background dark:bg-background-dark text-text dark:text-text-dark transition-colors duration-200">
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/create" element={<CreatePlanPage />} />
          <Route path="/plan/:id" element={<PlanDetailsPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/design" element={<DesignSystem />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>);

}

export default App;