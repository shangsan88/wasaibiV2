import React, { useState } from 'react';
import { Search, Filter, Building2, MapPin, DollarSign, TrendingUp, ExternalLink, Globe, Plus, ArrowUpDown } from 'lucide-react';

interface Investor {
  id: number;
  name: string;
  type: string;
  aum: string;
  focus: string[];
  location: string;
  recentDeals: number;
  checkSize: string;
  website: string;
}

const investors: Investor[] = [
  { id: 1, name: 'Sequoia Capital', type: 'Venture Capital', aum: '$85B', focus: ['Technology', 'Healthcare', 'Fintech'], location: 'Menlo Park, CA', recentDeals: 45, checkSize: '$1M - $100M', website: '#' },
  { id: 2, name: 'KKR & Co', type: 'Private Equity', aum: '$510B', focus: ['Infrastructure', 'Technology', 'Healthcare'], location: 'New York, NY', recentDeals: 28, checkSize: '$100M - $5B', website: '#' },
  { id: 3, name: 'Tiger Global', type: 'Hedge Fund / VC', aum: '$95B', focus: ['Technology', 'Consumer', 'SaaS'], location: 'New York, NY', recentDeals: 52, checkSize: '$10M - $500M', website: '#' },
  { id: 4, name: 'Blackstone Inc', type: 'Private Equity', aum: '$1T', focus: ['Real Estate', 'Private Equity', 'Credit'], location: 'New York, NY', recentDeals: 35, checkSize: '$500M - $10B', website: '#' },
  { id: 5, name: 'a16z (Andreessen Horowitz)', type: 'Venture Capital', aum: '$35B', focus: ['AI/ML', 'Crypto', 'Enterprise'], location: 'Menlo Park, CA', recentDeals: 60, checkSize: '$500K - $150M', website: '#' },
  { id: 6, name: 'Warburg Pincus', type: 'Private Equity', aum: '$83B', focus: ['Healthcare', 'Technology', 'Financial Services'], location: 'New York, NY', recentDeals: 22, checkSize: '$50M - $2B', website: '#' },
  { id: 7, name: 'SoftBank Vision Fund', type: 'Growth Equity', aum: '$100B', focus: ['AI', 'Robotics', 'Transportation'], location: 'Tokyo, Japan', recentDeals: 38, checkSize: '$100M - $5B', website: '#' },
  { id: 8, name: 'General Atlantic', type: 'Growth Equity', aum: '$84B', focus: ['Technology', 'Healthcare', 'Consumer'], location: 'New York, NY', recentDeals: 30, checkSize: '$50M - $1B', website: '#' },
  { id: 9, name: 'Accel Partners', type: 'Venture Capital', aum: '$50B', focus: ['SaaS', 'Fintech', 'Security'], location: 'Palo Alto, CA', recentDeals: 40, checkSize: '$1M - $100M', website: '#' },
  { id: 10, name: 'Carlyle Group', type: 'Private Equity', aum: '$376B', focus: ['Aerospace', 'Technology', 'Energy'], location: 'Washington, DC', recentDeals: 25, checkSize: '$200M - $5B', website: '#' },
];

export default function InvestorsDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const types = ['all', ...Array.from(new Set(investors.map(i => i.type)))];

  const filtered = investors.filter(inv => {
    const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.focus.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || inv.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Investors Database</h1>
          <p className="text-sm text-gray-500 mt-1">Browse and search institutional investors, VCs, and private equity firms</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Investor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Investors', value: investors.length.toString(), icon: Building2, color: 'text-blue-600 bg-blue-50' },
          { label: 'Combined AUM', value: '$2.4T+', icon: DollarSign, color: 'text-green-600 bg-green-50' },
          { label: 'Recent Deals', value: investors.reduce((a, i) => a + i.recentDeals, 0).toString(), icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
          { label: 'Global Reach', value: '15+ countries', icon: Globe, color: 'text-orange-600 bg-orange-50' },
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

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or sector focus..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="bg-transparent text-gray-700 focus:outline-none cursor-pointer">
            {types.map(t => (
              <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Investor</th>
              <th className="px-4 py-3 font-medium text-gray-500">Type</th>
              <th className="px-4 py-3 font-medium text-gray-500">AUM</th>
              <th className="px-4 py-3 font-medium text-gray-500">Focus Areas</th>
              <th className="px-4 py-3 font-medium text-gray-500">Check Size</th>
              <th className="px-4 py-3 font-medium text-gray-500">Location</th>
              <th className="px-4 py-3 font-medium text-gray-500">Deals</th>
              <th className="px-4 py-3 font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50 group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                      {inv.name.split(' ')[0][0]}{inv.name.split(' ').length > 1 ? inv.name.split(' ')[1][0] : ''}
                    </div>
                    <span className="font-medium text-gray-900">{inv.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{inv.type}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">{inv.aum}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {inv.focus.slice(0, 2).map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 text-xs rounded bg-blue-50 text-blue-700">{f}</span>
                    ))}
                    {inv.focus.length > 2 && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-gray-50 text-gray-500">+{inv.focus.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{inv.checkSize}</td>
                <td className="px-4 py-3 text-gray-500">
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{inv.location}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{inv.recentDeals}</td>
                <td className="px-4 py-3">
                  <button className="opacity-0 group-hover:opacity-100 text-blue-600"><ExternalLink className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
