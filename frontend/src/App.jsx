import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import SymptomChecker from './pages/SymptomChecker';
import ReportAnalyzer from './pages/ReportAnalyzer';
import Doctors from './pages/Doctors';
import HealthPlans from './pages/HealthPlans';

function App() {
  return (
  <BrowserRouter>
    <div className="min-h-screen bg-background font-sans text-gray-800">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/symptoms" element={<SymptomChecker />} />
          <Route path="/analyzer" element={<ReportAnalyzer />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/health-plans" element={<HealthPlans />} />
          <Route path="/dashboard" element={<HomePage />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
   </BrowserRouter>
  );
}

export default App;

