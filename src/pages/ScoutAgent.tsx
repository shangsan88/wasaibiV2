import React, { useState } from 'react';
import {
  Globe, Table2, HelpCircle, Users, Activity, Lock,
  Plus, ChevronDown, ArrowUp, Upload, Search, Loader2,
  Building2, Mail, Phone, Linkedin, MapPin, Briefcase,
  ExternalLink, Star, Filter, Download
} from 'lucide-react';

type QuickStartTab = 'analyze' | 'grab' | 'possible' | 'lookalikes' | 'activities';
type SearchMode = 'lite' | 'deep';

interface LeadResult {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  email: string;
  linkedin: string;
  score: number;
}

const mockResults: LeadResult[] = [
  { id: 1, name: 'Sarah Chen', title: 'CMO', company: 'TechVision AI', location: 'San Francisco, CA', email: 's.chen@techvision.ai', linkedin: 'sarahchen', score: 95 },
  { id: 2, name: 'Marcus Johnson', title: 'VP Marketing', company: 'DataFlow Systems', location: 'New York, NY', email: 'm.johnson@dataflow.io', linkedin: 'marcusjohnson', score: 91 },
  { id: 3, name: 'Elena Rodriguez', title: 'Chief Marketing Officer', company: 'CloudScale Inc', location: 'Austin, TX', email: 'e.rodriguez@cloudscale.com', linkedin: 'elenarodriguez', score: 88 },
  { id: 4, name: 'James Park', title: 'Head of Marketing', company: 'Quantum Labs', location: 'Seattle, WA', email: 'j.park@quantumlabs.com', linkedin: 'jamespark', score: 85 },
  { id: 5, name: 'Amara Okafor', title: 'CMO', company: 'FinEdge Capital', location: 'Chicago, IL', email: 'a.okafor@finedge.com', linkedin: 'amaraokafor', score: 82 },
  { id: 6, name: 'David Liu', title: 'Marketing Director', company: 'NexGen Robotics', location: 'Boston, MA', email: 'd.liu@nexgenrobotics.com', linkedin: 'davidliu', score: 79 },
];

export default function ScoutAgent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<QuickStartTab>('analyze');
  const [searchMode, setSearchMode] = useState<SearchMode>('lite');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<LeadResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [grabUrl, setGrabUrl] = useState('');
  const [lookalikeCompany, setLookalikeCompany] = useState('');

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setResults(mockResults);
      setShowResults(true);
      setIsSearching(false);
    }, 2000);
  };

  const handleAnalyze = () => {
    if (!domainInput.trim()) return;
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setResults(mockResults.slice(0, 4));
      setShowResults(true);
      setIsSearching(false);
    }, 2500);
  };

  const handleGrab = () => {
    if (!grabUrl.trim()) return;
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setResults(mockResults.slice(1, 5));
      setShowResults(true);
      setIsSearching(false);
    }, 2000);
  };

  const handleLookalike = () => {
    if (!lookalikeCompany.trim()) return;
    setIsSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setResults(mockResults.slice(2, 6));
      setShowResults(true);
      setIsSearching(false);
    }, 2000);
  };

  const tabs: { id: QuickStartTab; label: string; icon: React.ElementType; locked?: boolean }[] = [
    { id: 'analyze', label: 'Analyze Website', icon: Globe },
    { id: 'grab', label: 'Grab Website Data', icon: Table2 },
    { id: 'possible', label: "What's Possible?", icon: HelpCircle },
    { id: 'lookalikes', label: 'Find Lookalikes', icon: Users },
    { id: 'activities', label: 'Based on Your Activities', icon: Lock, locked: true },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-full bg-[#fafafa]">
      {/* Hero Section with background illustrations */}
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left temple illustration */}
          <svg className="absolute left-0 top-0 w-64 h-80 text-gray-200 opacity-40" viewBox="0 0 200 300" fill="none">
            <path d="M40 280 L40 180 L20 180 L60 120 L30 120 L70 60 L50 60 L80 10 L110 60 L90 60 L130 120 L100 120 L140 180 L120 180 L120 280Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="40" y1="280" x2="120" y2="280" stroke="currentColor" strokeWidth="1" />
            <line x1="30" y1="285" x2="130" y2="285" stroke="currentColor" strokeWidth="1" />
            <rect x="65" y="220" width="30" height="40" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          {/* Right temple */}
          <svg className="absolute right-0 top-0 w-64 h-80 text-gray-200 opacity-40" viewBox="0 0 200 300" fill="none">
            <path d="M60 280 L60 180 L40 180 L80 120 L50 120 L90 60 L70 60 L100 10 L130 60 L110 60 L150 120 L120 120 L160 180 L140 180 L140 280Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="60" y1="280" x2="140" y2="280" stroke="currentColor" strokeWidth="1" />
            <line x1="50" y1="285" x2="150" y2="285" stroke="currentColor" strokeWidth="1" />
            <rect x="85" y="220" width="30" height="40" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          {/* Bridge */}
          <svg className="absolute left-1/2 -translate-x-1/2 bottom-0 w-96 h-32 text-gray-200 opacity-30" viewBox="0 0 400 120" fill="none">
            <path d="M50 100 Q120 40 200 100 Q280 40 350 100" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="50" y1="100" x2="350" y2="100" stroke="currentColor" strokeWidth="1" />
            <line x1="120" y1="70" x2="120" y2="100" stroke="currentColor" strokeWidth="0.5" />
            <line x1="200" y1="100" x2="200" y2="60" stroke="currentColor" strokeWidth="0.5" />
            <line x1="280" y1="70" x2="280" y2="100" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-8 pt-16 pb-12 text-center">
          {/* Credits indicator */}
          <div className="absolute top-4 right-8 flex items-center gap-2 text-sm text-gray-500">
            <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xs font-bold">$</span>
            </div>
            Credits
          </div>

          {/* Origami crane */}
          <div className="inline-block mb-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-pink-400">
              <path d="M16 4 L28 16 L16 12 L4 16 L16 4Z" fill="currentColor" opacity="0.6" />
              <path d="M16 12 L28 16 L20 28 L16 12Z" fill="currentColor" opacity="0.4" />
              <path d="M16 12 L4 16 L12 28 L16 12Z" fill="currentColor" opacity="0.8" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            How can I find your perfect customers?
          </h1>
          <p className="text-gray-500 text-base mb-8">
            Provide as much information as possible on your ideal customer profile for best results.
          </p>

          {/* Main Search Box */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-left">
            <textarea
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Find CMO"
              rows={2}
              className="w-full resize-none text-gray-900 placeholder-gray-400 text-base focus:outline-none"
            />
            <div className="flex items-center justify-between mt-2">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {/* Mode selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {searchMode === 'lite' ? 'Lite' : 'Deep'}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showModeDropdown && (
                    <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32 z-20">
                      <button
                        onClick={() => { setSearchMode('lite'); setShowModeDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${searchMode === 'lite' ? 'text-pink-600 font-medium' : 'text-gray-700'}`}
                      >
                        Lite
                      </button>
                      <button
                        onClick={() => { setSearchMode('deep'); setShowModeDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${searchMode === 'deep' ? 'text-pink-600 font-medium' : 'text-gray-700'}`}
                      >
                        Deep
                      </button>
                    </div>
                  )}
                </div>
                {/* Submit button */}
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="w-9 h-9 rounded-lg border border-pink-300 bg-white text-pink-500 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* OR Divider + Enrich */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-sm text-gray-400 uppercase tracking-wider">or</span>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Upload className="w-4 h-4" />
              Enrich Your Data
            </button>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="max-w-4xl mx-auto px-8 pb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick start</h2>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                } ${tab.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'analyze' && (
            <div>
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-semibold text-gray-900">Enter your domain</span> — our agent will identify your perfect customers
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={domainInput}
                    onChange={e => setDomainInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                    placeholder="yourdomain.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isSearching || !domainInput.trim()}
                  className="px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                    </span>
                  ) : (
                    'Analyze my website'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'grab' && (
            <div>
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-semibold text-gray-900">Paste a URL</span> — we'll extract structured data from any website
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Table2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={grabUrl}
                    onChange={e => setGrabUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleGrab()}
                    placeholder="https://example.com/team"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleGrab}
                  disabled={isSearching || !grabUrl.trim()}
                  className="px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Grabbing...
                    </span>
                  ) : (
                    'Grab data'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'possible' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">Here's what Scout can do for you:</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: Search, title: 'Find Decision Makers', desc: 'Search for CMOs, VPs, and C-suite executives at target companies' },
                  { icon: Building2, title: 'Company Research', desc: 'Get deep insights into company tech stack, funding, and headcount' },
                  { icon: Mail, title: 'Email Discovery', desc: 'Find verified business email addresses for your prospects' },
                  { icon: Activity, title: 'Intent Signals', desc: 'Identify companies actively researching solutions like yours' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="p-2 bg-green-50 rounded-lg shrink-0">
                        <Icon className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'lookalikes' && (
            <div>
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-semibold text-gray-900">Enter a company name</span> — we'll find similar companies that match your ICP
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={lookalikeCompany}
                    onChange={e => setLookalikeCompany(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLookalike()}
                    placeholder="e.g. Stripe, Figma, Notion"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleLookalike}
                  disabled={isSearching || !lookalikeCompany.trim()}
                  className="px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                    </span>
                  ) : (
                    'Find lookalikes'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="text-center py-8">
              <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">This feature is coming soon. We'll analyze your past activities to suggest leads.</p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="mt-8 text-center py-12">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600">Scout is searching for your perfect customers...</p>
            <p className="text-xs text-gray-400 mt-1">This may take a moment</p>
          </div>
        )}

        {/* Results Table */}
        {showResults && results.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Results</h2>
                <span className="text-sm text-gray-500">{results.length} leads found</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500 w-8">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Company</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Location</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Score</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50 group">
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-xs font-semibold text-purple-600">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-gray-900">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.title}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-700">{lead.company}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <MapPin className="w-3.5 h-3.5" />
                          {lead.location}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getScoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Email">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="LinkedIn">
                            <Linkedin className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Save">
                            <Star className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
