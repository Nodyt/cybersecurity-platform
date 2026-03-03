import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ModulePlayerPage from './pages/ModulePlayerPage';
import ProgressPage from './pages/ProgressPage';
import SimulationPage from './pages/SimulationPage';
import QuizPage from './pages/QuizPage';

import CertificatePage from './pages/CertificatePage';

// Simple Route Guard
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { token } = useAuth();
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/certificate"
            element={
              <PrivateRoute>
                <CertificatePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/training/:moduleId"
            element={
              <PrivateRoute>
                <ModulePlayerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <PrivateRoute>
                <ProgressPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <PrivateRoute>
                <SimulationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
