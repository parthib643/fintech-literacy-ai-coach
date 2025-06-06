import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Module from './components/modules/Module';
import ModuleList from './components/modules/ModuleList';          
import ModuleDetail from './components/modules/ModuleDetail';      
import Assessment from './components/modules/Assessment';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/modules" element={
            <ProtectedRoute>
              <ModuleList />
            </ProtectedRoute>
          } />
          <Route path="/modules/:id" element={
            <ProtectedRoute>
              <ModuleDetail />
            </ProtectedRoute>
          } />
          <Route path="/modules/:moduleId" element={
            <ProtectedRoute>
              <Module />
            </ProtectedRoute>
          } />
          <Route path="/assessment/:moduleId" element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
