import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Actions from './pages/Actions';
import Copilot from './pages/Copilot';
import ComplianceExplained from './pages/ComplianceExplained';
import History from './pages/History';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/onboarding"
              element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/actions"
              element={
                <PrivateRoute>
                  <Actions />
                </PrivateRoute>
              }
            />
            <Route
              path="/copilot"
              element={
                <PrivateRoute>
                  <Copilot />
                </PrivateRoute>
              }
            />
            <Route
              path="/compliance"
              element={
                <PrivateRoute>
                  <ComplianceExplained />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;








