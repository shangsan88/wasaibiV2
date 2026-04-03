import React, { useState } from 'react';
import { Search, Filter, Building2, MapPin, Star, ExternalLink, Plus, Briefcase, Shield, Scale, FileText } from 'lucide-react';

interface Provider {
  id: number;
  name: string;
  type: string;
  specialty: string;
  location: string;
  rating: number;
  deals: number;
  icon: React.ElementType;
}

const providers: Provider[] = [
  { id: 1, name: 'Baker McKenzie LLP', type: 'Legal', specialty: 'M&A / Securities Law', location: 'New York, NY', rating: 5, deals: 34, icon: Scale },
  { id: 2, name: 'Deloitte Advisory', type: 'Accounting', specialty: 'Due Diligence / Audit', location: 'Chicago, IL', rating: 5, deals: 28, icon: FileText },
  { id: 3, name: 'Marsh McLennan', type: 'Insurance', specialty: 'D&O / Transaction Insurance', location: 'New York, NY', rating: 4, deals: 19, icon: Shield },
  { id: 4, name: 'Latham & Watkins', type: 'Legal', specialty: 'SPAC / Capital Markets', location: 'Washington, DC', rating: 5, deals: 41, icon: Scale },
  { id: 5, name: 'PwC Advisory', type: 'Accounting', specialty: 'Valuation / Tax', location: 'San Francisco, CA', rating: 4, deals: 22, icon: FileText },
  { id: 6, name: 'Skadden Arps', type: 'Legal', specialty: 'Corporate / Regulatory', location: 'New York, NY', rating: 5, deals: 37, icon: Scale },
  { id: 7, name: 'Aon Risk Solutions', type: 'Insurance', specialty: 'Reps & Warranties', location: 'London, UK', rating: 4, deals: 15, icon: Shield },
  { id: 8, name: 'KPMG Deal Advisory', type: 'Accounting', specialty: 'Financial Due Diligence', location: 'Boston, MA', rating: 4, deals: 25, icon: FileText },
];

export default function ServiceProviders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const types = ['all', ...Array.from(new Set(providers.map(p => p.type)))];

  const filtered = providers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Providers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your legal, accounting, and insurance service providers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Provider
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search providers..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(provider => {
          const Icon = provider.icon;
          return (
            <div key={provider.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{provider.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < provider.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  {provider.specialty}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {provider.location}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">{provider.deals} deals supported</span>
                <button className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
