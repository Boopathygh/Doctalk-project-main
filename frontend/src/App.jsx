import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import SymptomChecker from './pages/SymptomChecker';
import ReportAnalyzer from './pages/ReportAnalyzer';
import Doctors from './pages/Doctors';
import HealthPlans from './pages/HealthPlans';
import Login from './pages/Login';
import Register from './pages/Register';

import ProtectedRoute from './components/ProtectedRoute';
import { RedirectRoot } from './components/RedirectRoot';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans text-gray-800">
          <Navbar />
          <main>
            <Routes>
              {/* If logged in -> Dashboard/Home. If not -> Login */}
              <Route path="/" element={<RedirectRoot />} />

              <Route path="/home" element={
                <ProtectedRoute><HomePage /></ProtectedRoute>
              } />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              <Route path="/symptoms" element={
                <ProtectedRoute><SymptomChecker /></ProtectedRoute>
              } />
              <Route path="/analyzer" element={
                <ProtectedRoute><ReportAnalyzer /></ProtectedRoute>
              } />
              <Route path="/doctors" element={
                <ProtectedRoute><Doctors /></ProtectedRoute>
              } />
              <Route path="/health-plans" element={
                <ProtectedRoute><HealthPlans /></ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute><HomePage /></ProtectedRoute> // Reuse HomePage as Dashboard for now
              } />
            </Routes>
          </main>
          <ChatWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
