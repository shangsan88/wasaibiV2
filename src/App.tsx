import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FindLeads from './pages/FindLeads';
import ReachOutSales from './pages/ReachOutSales';
import Agents from './pages/Agents';
import Enrichment from './pages/Enrichment';
import Signals from './pages/Signals';
import Portfolio from './pages/Portfolio';
import Exports from './pages/Exports';
import Trash from './pages/Trash';
import Settings from './pages/Settings';
import AiContext from './pages/AiContext';
import Resources from './pages/Resources';
import Repositories from './pages/Repositories';
import ScoutAgent from './pages/ScoutAgent';
import Login from './pages/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for preview

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="find-leads">
            <Route index element={<Navigate to="companies" replace />} />
            <Route path="companies" element={<FindLeads type="companies" />} />
            <Route path="people" element={<FindLeads type="people" />} />
          </Route>

          <Route path="enrichment" element={<Enrichment />} />
          <Route path="signals" element={<Signals />} />
          
          <Route path="gtm">
            <Route index element={<Navigate to="campaigns" replace />} />
            <Route path="campaigns" element={<ReachOutSales />} />
            <Route path="accounts" element={<ReachOutSales />} />
          </Route>

          <Route path="portfolio" element={<Portfolio />} />
          <Route path="agents" element={<Agents />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="scout" element={<ScoutAgent />} />
          <Route path="exports" element={<Exports />} />
          <Route path="trash" element={<Trash />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-context" element={<AiContext />} />
          <Route path="resources" element={<Resources />} />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
