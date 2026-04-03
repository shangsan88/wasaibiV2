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
import AskWasaibiAI from './pages/AskWasaibiAI';
import DealMatching from './pages/DealMatching';
import Partners from './pages/Partners';
import Research from './pages/Research';
import ServiceProviders from './pages/ServiceProviders';
import InvestorsDatabase from './pages/InvestorsDatabase';
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
          <Route path="ask-wasaibi" element={<AskWasaibiAI />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scout" element={<ScoutAgent />} />

          <Route path="gtm">
            <Route index element={<Navigate to="campaigns" replace />} />
            <Route path="campaigns" element={<ReachOutSales />} />
            <Route path="accounts" element={<ReachOutSales />} />
          </Route>

          <Route path="my-deals" element={<FindLeads type="companies" />} />

          <Route path="deal-matching">
            <Route index element={<Navigate to="spac" replace />} />
            <Route path="spac" element={<DealMatching />} />
            <Route path="ma" element={<DealMatching />} />
            <Route path="fundraise" element={<DealMatching />} />
          </Route>

          <Route path="partners">
            <Route index element={<Navigate to="origination" replace />} />
            <Route path="origination" element={<Partners />} />
            <Route path="advisors" element={<Partners />} />
          </Route>

          <Route path="research">
            <Route index element={<Navigate to="spac" replace />} />
            <Route path="spac" element={<Research />} />
            <Route path="company" element={<Research />} />
          </Route>

          <Route path="service-providers" element={<ServiceProviders />} />
          <Route path="investors" element={<InvestorsDatabase />} />

          <Route path="agents" element={<Agents />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="exports" element={<Exports />} />
          <Route path="trash" element={<Trash />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-context" element={<AiContext />} />
          <Route path="resources" element={<Resources />} />

          {/* Legacy routes */}
          <Route path="find-leads">
            <Route index element={<Navigate to="/my-deals" replace />} />
            <Route path="companies" element={<FindLeads type="companies" />} />
            <Route path="people" element={<FindLeads type="people" />} />
          </Route>
          <Route path="enrichment" element={<Enrichment />} />
          <Route path="signals" element={<Signals />} />
          <Route path="portfolio" element={<Portfolio />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
