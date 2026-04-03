import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Building2, Users, Mail, Phone, MapPin, Star, ExternalLink, Plus } from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  company: string;
  role: string;
  location: string;
  email: string;
  deals: number;
  rating: number;
  type: 'origination' | 'advisor';
}

const originationPartners: Partner[] = [
  { id: 1, name: 'Richard Thornton', company: 'Thornton Capital Partners', role: 'Managing Partner', location: 'New York, NY', email: 'r.thornton@tcp.com', deals: 12, rating: 5, type: 'origination' },
  { id: 2, name: 'Lisa Wang', company: 'Pacific Bridge Advisors', role: 'Senior Partner', location: 'San Francisco, CA', email: 'l.wang@pacificbridge.com', deals: 9, rating: 4, type: 'origination' },
  { id: 3, name: 'Ahmed Hassan', company: 'MENA Capital Group', role: 'Founding Partner', location: 'Dubai, UAE', email: 'a.hassan@menacg.com', deals: 7, rating: 5, type: 'origination' },
  { id: 4, name: 'Sarah Mitchell', company: 'Vanguard Origination', role: 'Director', location: 'London, UK', email: 's.mitchell@vanguard.co.uk', deals: 15, rating: 4, type: 'origination' },
  { id: 5, name: 'Carlos Reyes', company: 'LatAm Deal Partners', role: 'Co-Founder', location: 'Miami, FL', email: 'c.reyes@latamdeals.com', deals: 6, rating: 3, type: 'origination' },
];

const financialAdvisors: Partner[] = [
  { id: 6, name: 'James Whitfield', company: 'Whitfield & Associates', role: 'Senior Financial Advisor', location: 'Chicago, IL', email: 'j.whitfield@wa.com', deals: 22, rating: 5, type: 'advisor' },
  { id: 7, name: 'Priya Sharma', company: 'Global Finance Advisory', role: 'Managing Director', location: 'Singapore', email: 'p.sharma@gfa.sg', deals: 18, rating: 5, type: 'advisor' },
  { id: 8, name: 'Michael O\'Brien', company: 'Atlantic Advisory Group', role: 'Partner', location: 'Boston, MA', email: 'm.obrien@aag.com', deals: 14, rating: 4, type: 'advisor' },
  { id: 9, name: 'Emma Fischer', company: 'European Capital Advisors', role: 'Head of M&A', location: 'Frankfurt, Germany', email: 'e.fischer@eca.de', deals: 11, rating: 4, type: 'advisor' },
  { id: 10, name: 'David Kim', company: 'Asia Pacific Advisors', role: 'VP Advisory', location: 'Hong Kong', email: 'd.kim@apadvise.hk', deals: 8, rating: 3, type: 'advisor' },
];

export default function Partners() {
  const location = useLocation();
  const isAdvisors = location.pathname.includes('advisors');
  const partners = isAdvisors ? financialAdvisors : originationPartners;
  const title = isAdvisors ? 'Financial Advisors' : 'Origination Partners';
  const subtitle = isAdvisors
    ? 'Manage your financial advisory relationships'
    : 'Track and manage your deal origination partners';
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search partners..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4 text-gray-400" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(partner => (
          <div key={partner.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                  {partner.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                  <p className="text-xs text-gray-500">{partner.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < partner.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-3.5 h-3.5 text-gray-400" />
                {partner.company}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {partner.location}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {partner.email}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">{partner.deals} deals completed</span>
              <button className="text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-all">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
