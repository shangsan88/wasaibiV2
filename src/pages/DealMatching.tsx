import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Building2, TrendingUp, DollarSign, Calendar, Star, ChevronDown, ExternalLink } from 'lucide-react';

interface Deal {
  id: number;
  name: string;
  sector: string;
  value: string;
  status: string;
  matchScore: number;
  type: string;
  date: string;
}

const spacDeals: Deal[] = [
  { id: 1, name: 'Atlas Crest II × TechVision AI', sector: 'Technology', value: '$450M', status: 'Active', matchScore: 94, type: 'SPAC', date: 'Mar 2026' },
  { id: 2, name: 'Churchill VIII × MedCore Health', sector: 'Healthcare', value: '$350M', status: 'Under Review', matchScore: 89, type: 'SPAC', date: 'Feb 2026' },
  { id: 3, name: 'Gores IX × CloudScale Inc', sector: 'Technology', value: '$400M', status: 'Active', matchScore: 86, type: 'SPAC', date: 'Mar 2026' },
  { id: 4, name: 'Ajax Financial × FinEdge', sector: 'Fintech', value: '$300M', status: 'LOI Signed', matchScore: 92, type: 'SPAC', date: 'Jan 2026' },
];

const maDeals: Deal[] = [
  { id: 5, name: 'DataFlow Systems Acquisition', sector: 'Enterprise SaaS', value: '$220M', status: 'Due Diligence', matchScore: 91, type: 'M&A', date: 'Mar 2026' },
  { id: 6, name: 'NexGen Robotics Strategic Sale', sector: 'Industrial Tech', value: '$180M', status: 'Active', matchScore: 87, type: 'M&A', date: 'Feb 2026' },
  { id: 7, name: 'Quantum Labs Merger', sector: 'Quantum Computing', value: '$500M', status: 'Origination', matchScore: 78, type: 'M&A', date: 'Mar 2026' },
];

const fundraiseDeals: Deal[] = [
  { id: 8, name: 'TechVision AI Series C', sector: 'AI/ML', value: '$150M', status: 'Active', matchScore: 95, type: 'Fund Raise', date: 'Mar 2026' },
  { id: 9, name: 'CloudScale Growth Round', sector: 'Cloud Infrastructure', value: '$80M', status: 'Term Sheet', matchScore: 90, type: 'Fund Raise', date: 'Feb 2026' },
  { id: 10, name: 'FinEdge Capital Series B', sector: 'Fintech', value: '$60M', status: 'Active', matchScore: 84, type: 'Fund Raise', date: 'Mar 2026' },
];

export default function DealMatching() {
  const location = useLocation();
  const path = location.pathname;
  const [searchQuery, setSearchQuery] = useState('');

  let activeTab = 'spac';
  let deals = spacDeals;
  let title = 'SPAC Matching';
  let subtitle = 'AI-powered SPAC to target company matching';

  if (path.includes('ma')) {
    activeTab = 'ma';
    deals = maDeals;
    title = 'M&A Matching';
    subtitle = 'Find the best M&A opportunities and strategic matches';
  } else if (path.includes('fundraise')) {
    activeTab = 'fundraise';
    deals = fundraiseDeals;
    title = 'Fund Raise Matching';
    subtitle = 'Match companies with the right investors and funding sources';
  }

  const filteredDeals = deals.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-50';
    if (score >= 80) return 'text-blue-700 bg-blue-50';
    return 'text-gray-700 bg-gray-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-50';
      case 'LOI Signed': case 'Term Sheet': return 'text-purple-700 bg-purple-50';
      case 'Due Diligence': case 'Under Review': return 'text-yellow-700 bg-yellow-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Matches', value: deals.length.toString(), icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
          { label: 'Avg Score', value: Math.round(deals.reduce((a, d) => a + d.matchScore, 0) / deals.length).toString(), icon: Star, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Total Value', value: `$${(deals.reduce((a, d) => a + parseInt(d.value.replace(/\$|M/g, '')), 0))}M`, icon: DollarSign, color: 'text-green-600 bg-green-50' },
          { label: 'Active', value: deals.filter(d => d.status === 'Active').length.toString(), icon: Building2, color: 'text-purple-600 bg-purple-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${stat.color}`}><Icon className="w-4 h-4" /></div>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4 text-gray-400" /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Deal Name</th>
              <th className="px-4 py-3 font-medium text-gray-500">Sector</th>
              <th className="px-4 py-3 font-medium text-gray-500">Value</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Match Score</th>
              <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDeals.map(deal => (
              <tr key={deal.id} className="hover:bg-gray-50 group">
                <td className="px-4 py-3 font-medium text-gray-900">{deal.name}</td>
                <td className="px-4 py-3 text-gray-600">{deal.sector}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{deal.value}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getScoreColor(deal.matchScore)}`}>
                    {deal.matchScore}%
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{deal.date}</td>
                <td className="px-4 py-3">
                  <button className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-700 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
