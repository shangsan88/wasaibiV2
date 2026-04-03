import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, TrendingUp, Calendar, DollarSign, Building2, ExternalLink, Clock, BarChart3, Globe } from 'lucide-react';

interface SpacEntry {
  id: number;
  name: string;
  ticker: string;
  trustValue: string;
  deadline: string;
  sector: string;
  status: string;
  sponsor: string;
}

interface CompanyEntry {
  id: number;
  name: string;
  sector: string;
  revenue: string;
  employees: string;
  founded: string;
  hq: string;
  funding: string;
  stage: string;
}

const spacData: SpacEntry[] = [
  { id: 1, name: 'Atlas Crest Acquisition II', ticker: 'ACAQ', trustValue: '$450M', deadline: 'Jun 2026', sector: 'Technology', status: 'Searching', sponsor: 'Atlas Crest Capital' },
  { id: 2, name: 'Churchill Capital Corp VIII', ticker: 'CHUR', trustValue: '$350M', deadline: 'Aug 2026', sector: 'Healthcare', status: 'Searching', sponsor: 'Churchill Sponsor' },
  { id: 3, name: 'Gores Holdings IX', ticker: 'GHIX', trustValue: '$400M', deadline: 'Jul 2026', sector: 'Multi-sector', status: 'In Talks', sponsor: 'The Gores Group' },
  { id: 4, name: 'Ajax Financial Alternatives', ticker: 'ALIT', trustValue: '$300M', deadline: 'Sep 2026', sector: 'Fintech', status: 'Searching', sponsor: 'Ajax Partners' },
  { id: 5, name: 'Replay Acquisition Corp', ticker: 'RPLA', trustValue: '$275M', deadline: 'May 2026', sector: 'Media', status: 'LOI Signed', sponsor: 'Replay Capital' },
  { id: 6, name: 'Hennessy Capital IV', ticker: 'HCIV', trustValue: '$320M', deadline: 'Oct 2026', sector: 'Industrial', status: 'Searching', sponsor: 'Hennessy Capital' },
];

const companyData: CompanyEntry[] = [
  { id: 1, name: 'TechVision AI', sector: 'Artificial Intelligence', revenue: '$45M ARR', employees: '320', founded: '2019', hq: 'San Francisco, CA', funding: '$120M', stage: 'Series C' },
  { id: 2, name: 'CloudScale Inc', sector: 'Cloud Infrastructure', revenue: '$78M ARR', employees: '520', founded: '2017', hq: 'Austin, TX', funding: '$200M', stage: 'Growth' },
  { id: 3, name: 'DataFlow Systems', sector: 'Enterprise SaaS', revenue: '$32M ARR', employees: '180', founded: '2020', hq: 'New York, NY', funding: '$65M', stage: 'Series B' },
  { id: 4, name: 'FinEdge Capital', sector: 'Fintech', revenue: '$28M ARR', employees: '150', founded: '2018', hq: 'Chicago, IL', funding: '$90M', stage: 'Series B' },
  { id: 5, name: 'Quantum Labs', sector: 'Quantum Computing', revenue: '$12M ARR', employees: '95', founded: '2021', hq: 'Seattle, WA', funding: '$45M', stage: 'Series A' },
  { id: 6, name: 'NexGen Robotics', sector: 'Industrial Tech', revenue: '$55M ARR', employees: '280', founded: '2016', hq: 'Boston, MA', funding: '$150M', stage: 'Growth' },
];

export default function Research() {
  const location = useLocation();
  const isCompany = location.pathname.includes('company');
  const [searchQuery, setSearchQuery] = useState('');

  if (isCompany) {
    const filtered = companyData.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Company Research</h1>
          <p className="text-sm text-gray-500 mt-1">Deep-dive research on target companies and prospects</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search companies..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-400" /> Filters
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Company</th>
                <th className="px-4 py-3 font-medium text-gray-500">Sector</th>
                <th className="px-4 py-3 font-medium text-gray-500">Revenue</th>
                <th className="px-4 py-3 font-medium text-gray-500">Employees</th>
                <th className="px-4 py-3 font-medium text-gray-500">Total Funding</th>
                <th className="px-4 py-3 font-medium text-gray-500">Stage</th>
                <th className="px-4 py-3 font-medium text-gray-500">HQ</th>
                <th className="px-4 py-3 font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(company => (
                <tr key={company.id} className="hover:bg-gray-50 group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{company.sector}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{company.revenue}</td>
                  <td className="px-4 py-3 text-gray-600">{company.employees}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{company.funding}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">{company.stage}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{company.hq}</td>
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

  // SPAC Research
  const filtered = spacData.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">SPAC Research</h1>
        <p className="text-sm text-gray-500 mt-1">Track and analyze active SPACs and their characteristics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active SPACs', value: spacData.length.toString(), icon: BarChart3, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Trust Value', value: '$2.1B', icon: DollarSign, color: 'text-green-600 bg-green-50' },
          { label: 'Avg Trust Size', value: '$349M', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
          { label: 'Nearing Deadline', value: '2', icon: Clock, color: 'text-orange-600 bg-orange-50' },
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
            placeholder="Search SPACs by name, ticker, or sector..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4 text-gray-400" /> Filters
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">SPAC Name</th>
              <th className="px-4 py-3 font-medium text-gray-500">Ticker</th>
              <th className="px-4 py-3 font-medium text-gray-500">Trust Value</th>
              <th className="px-4 py-3 font-medium text-gray-500">Sector Focus</th>
              <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 font-medium text-gray-500">Deadline</th>
              <th className="px-4 py-3 font-medium text-gray-500">Sponsor</th>
              <th className="px-4 py-3 font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(spac => (
              <tr key={spac.id} className="hover:bg-gray-50 group">
                <td className="px-4 py-3 font-medium text-gray-900">{spac.name}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs font-mono font-bold bg-gray-100 text-gray-700 rounded">{spac.ticker}</span></td>
                <td className="px-4 py-3 font-semibold text-gray-900">{spac.trustValue}</td>
                <td className="px-4 py-3 text-gray-600">{spac.sector}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    spac.status === 'LOI Signed' ? 'bg-green-50 text-green-700' :
                    spac.status === 'In Talks' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>{spac.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{spac.deadline}</td>
                <td className="px-4 py-3 text-gray-600">{spac.sponsor}</td>
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
