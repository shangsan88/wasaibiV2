import React, { useState } from 'react';
import {
  Database, Plus, Upload, History, GripVertical, ChevronDown, ChevronRight,
  Mail, Phone, Building2, User, Sparkles, Check, AlertCircle, X,
  ArrowDown, Zap, TrendingUp, Target, BarChart3, Settings, Search,
  Globe, Linkedin, Shield, Star, SlidersHorizontal
} from 'lucide-react';

// --- Types ---
type EnrichmentTab = 'work-email' | 'phone' | 'company' | 'person' | 'custom';
type ProviderStatus = 'active' | 'paused' | 'error';
type EnrichmentStatus = 'found' | 'partial' | 'not-found' | 'pending';

interface Provider {
  id: string;
  name: string;
  coverage: number;
  costPerLookup: number;
  status: ProviderStatus;
  color: string;
}

interface EnrichmentResult {
  id: number;
  contact: string;
  company: string;
  originalData: string;
  enrichedFields: string[];
  providerUsed: string;
  confidence: number;
  credits: number;
  status: EnrichmentStatus;
}

interface ScoredLead {
  id: number;
  name: string;
  company: string;
  score: number;
  companySize: string;
  revenue: string;
  industry: string;
  signals: string;
}

// --- Mock Data ---
const providers: Provider[] = [
  { id: 'apollo', name: 'Apollo.io', coverage: 87, costPerLookup: 0.03, status: 'active', color: 'bg-blue-500' },
  { id: 'clearbit', name: 'Clearbit', coverage: 78, costPerLookup: 0.05, status: 'active', color: 'bg-indigo-500' },
  { id: 'zoominfo', name: 'ZoomInfo', coverage: 82, costPerLookup: 0.08, status: 'active', color: 'bg-green-500' },
  { id: 'hunter', name: 'Hunter.io', coverage: 71, costPerLookup: 0.02, status: 'active', color: 'bg-orange-500' },
  { id: 'lusha', name: 'Lusha', coverage: 74, costPerLookup: 0.04, status: 'paused', color: 'bg-purple-500' },
  { id: 'dropcontact', name: 'Dropcontact', coverage: 65, costPerLookup: 0.01, status: 'active', color: 'bg-teal-500' },
  { id: 'rocketreach', name: 'RocketReach', coverage: 76, costPerLookup: 0.06, status: 'active', color: 'bg-red-500' },
  { id: 'snov', name: 'Snov.io', coverage: 68, costPerLookup: 0.02, status: 'error', color: 'bg-yellow-500' },
];

const enrichmentResults: EnrichmentResult[] = [
  { id: 1, contact: 'Sarah Chen', company: 'Stripe', originalData: 'sarah@stripe.com', enrichedFields: ['Work Email', 'Phone', 'LinkedIn'], providerUsed: 'Apollo.io', confidence: 97, credits: 1, status: 'found' },
  { id: 2, contact: 'James Rodriguez', company: 'Notion', originalData: 'james.r@notion.so', enrichedFields: ['Work Email', 'Title'], providerUsed: 'Clearbit', confidence: 92, credits: 1, status: 'found' },
  { id: 3, contact: 'Emily Park', company: 'Figma', originalData: 'emily.park@figma.com', enrichedFields: ['Work Email'], providerUsed: 'Hunter.io', confidence: 78, credits: 1, status: 'partial' },
  { id: 4, contact: 'Michael Torres', company: 'Datadog', originalData: 'mtorres@datadog.com', enrichedFields: ['Work Email', 'Phone', 'Company Data'], providerUsed: 'ZoomInfo', confidence: 95, credits: 2, status: 'found' },
  { id: 5, contact: 'Priya Sharma', company: 'Confluent', originalData: 'priya@confluent.io', enrichedFields: [], providerUsed: '—', confidence: 0, credits: 3, status: 'not-found' },
  { id: 6, contact: 'David Kim', company: 'Snowflake', originalData: 'dkim@snowflake.com', enrichedFields: ['Work Email', 'Phone', 'LinkedIn', 'Title'], providerUsed: 'Apollo.io', confidence: 99, credits: 1, status: 'found' },
  { id: 7, contact: 'Lisa Wang', company: 'Vercel', originalData: 'lwang@vercel.com', enrichedFields: ['Work Email', 'Title'], providerUsed: 'Dropcontact', confidence: 84, credits: 1, status: 'partial' },
  { id: 8, contact: 'Alex Johnson', company: 'HashiCorp', originalData: 'alex.j@hashicorp.com', enrichedFields: ['Work Email', 'Phone', 'LinkedIn'], providerUsed: 'RocketReach', confidence: 91, credits: 2, status: 'found' },
  { id: 9, contact: 'Maria Garcia', company: 'MongoDB', originalData: 'mgarcia@mongodb.com', enrichedFields: ['Work Email'], providerUsed: 'Clearbit', confidence: 73, credits: 1, status: 'partial' },
  { id: 10, contact: 'Thomas Lee', company: 'Elastic', originalData: 'tlee@elastic.co', enrichedFields: ['Work Email', 'Phone', 'Company Data', 'LinkedIn'], providerUsed: 'Apollo.io', confidence: 96, credits: 1, status: 'found' },
  { id: 11, contact: 'Rachel Adams', company: 'PlanetScale', originalData: 'radams@planetscale.com', enrichedFields: [], providerUsed: '—', confidence: 0, credits: 4, status: 'not-found' },
  { id: 12, contact: 'Kevin Wu', company: 'Supabase', originalData: 'kevin@supabase.io', enrichedFields: ['Work Email', 'Phone', 'Title', 'LinkedIn'], providerUsed: 'ZoomInfo', confidence: 94, credits: 2, status: 'found' },
];

const scoredLeads: ScoredLead[] = [
  { id: 1, name: 'Stripe', company: 'Stripe Inc.', score: 95, companySize: '5000+', revenue: '$14B+', industry: 'Fintech', signals: 'Hiring, Fundraise' },
  { id: 2, name: 'Datadog', company: 'Datadog Inc.', score: 91, companySize: '5000+', revenue: '$2.1B', industry: 'DevOps', signals: 'Product Launch' },
  { id: 3, name: 'Snowflake', company: 'Snowflake Inc.', score: 88, companySize: '5000+', revenue: '$2.8B', industry: 'Data/Cloud', signals: 'Expansion' },
  { id: 4, name: 'Vercel', company: 'Vercel Inc.', score: 82, companySize: '500-1000', revenue: '$100M+', industry: 'Developer Tools', signals: 'Hiring' },
  { id: 5, name: 'Notion', company: 'Notion Labs', score: 79, companySize: '500-1000', revenue: '$250M+', industry: 'Productivity', signals: 'None detected' },
  { id: 6, name: 'PlanetScale', company: 'PlanetScale Inc.', score: 64, companySize: '100-500', revenue: '$30M', industry: 'Database', signals: 'Layoffs' },
  { id: 7, name: 'Supabase', company: 'Supabase Inc.', score: 76, companySize: '100-500', revenue: '$50M', industry: 'Developer Tools', signals: 'Fundraise' },
];

const scoreDistribution = [
  { bucket: '0-20', count: 12 },
  { bucket: '21-40', count: 34 },
  { bucket: '41-60', count: 67 },
  { bucket: '61-80', count: 145 },
  { bucket: '81-100', count: 89 },
];

// --- Components ---

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ElementType }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
      <div className="p-2.5 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function ProviderCard({ provider, index }: { provider: Provider; index: number; key?: React.Key }) {
  const statusStyles: Record<ProviderStatus, string> = {
    active: 'bg-green-50 text-green-700',
    paused: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
  };

  return (
    <div className="relative">
      {index > 0 && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <ArrowDown className="w-4 h-4 text-gray-300" />
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
        <div className="flex items-center gap-3 mb-3">
          <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className={`w-8 h-8 ${provider.color} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{provider.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{provider.name}</p>
            <p className="text-xs text-gray-400">Priority #{index + 1}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[provider.status]}`}>
            {provider.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-400">Coverage</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${provider.coverage}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-700">{provider.coverage}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400">Cost / lookup</p>
            <p className="text-sm font-medium text-gray-700 mt-1">${provider.costPerLookup.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnrichmentTabButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-semibold ${score >= 80 ? 'text-green-700' : score >= 60 ? 'text-yellow-700' : 'text-red-600'}`}>
        {score}
      </span>
    </div>
  );
}

// --- Main Component ---
export default function Enrichment() {
  const [activeTab, setActiveTab] = useState<EnrichmentTab>('work-email');
  const [scoringWeights, setScoringWeights] = useState({
    companySize: 75,
    revenueRange: 60,
    industryMatch: 85,
    technologyFit: 70,
    engagement: 50,
    custom: 30,
  });

  const statusColor = (s: EnrichmentStatus) => {
    switch (s) {
      case 'found': return 'bg-green-50 text-green-700 border-green-200';
      case 'partial': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'not-found': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const statusIcon = (s: EnrichmentStatus) => {
    switch (s) {
      case 'found': return <Check className="w-3.5 h-3.5" />;
      case 'partial': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'not-found': return <X className="w-3.5 h-3.5" />;
      case 'pending': return <ArrowDown className="w-3.5 h-3.5" />;
    }
  };

  const maxBarCount = Math.max(...scoreDistribution.map(d => d.count));

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Enrichment</h1>
          <p className="text-sm text-gray-500 mt-1">Waterfall enrichment across multiple data providers</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <History className="w-4 h-4" />
            View History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Bulk Enrich
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Enrichment
          </button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Database} label="Total Records Enriched" value="24,847" sub="+1,240 this week" />
        <StatCard icon={Target} label="Coverage Rate" value="87.3%" sub="Up 2.1% from last month" />
        <StatCard icon={Zap} label="Credits Used" value="18,392" sub="6,608 remaining" />
        <StatCard icon={Globe} label="Providers Active" value="6 / 8" sub="2 paused or errored" />
      </div>

      {/* Enrichment Types Tabs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrichment Types</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <EnrichmentTabButton active={activeTab === 'work-email'} icon={Mail} label="Work Email" onClick={() => setActiveTab('work-email')} />
          <EnrichmentTabButton active={activeTab === 'phone'} icon={Phone} label="Phone Number" onClick={() => setActiveTab('phone')} />
          <EnrichmentTabButton active={activeTab === 'company'} icon={Building2} label="Company Data" onClick={() => setActiveTab('company')} />
          <EnrichmentTabButton active={activeTab === 'person'} icon={User} label="Person Data" onClick={() => setActiveTab('person')} />
          <EnrichmentTabButton active={activeTab === 'custom'} icon={Sparkles} label="Custom (AI)" onClick={() => setActiveTab('custom')} />
        </div>
      </div>

      {/* Waterfall Configuration */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Waterfall Pipeline</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {activeTab === 'work-email' && 'Cascade through email providers — first match wins'}
              {activeTab === 'phone' && 'Cascade through phone providers — mobile + direct lines'}
              {activeTab === 'company' && 'Cascade through firmographic & tech-stack providers'}
              {activeTab === 'person' && 'Cascade through contact intelligence providers'}
              {activeTab === 'custom' && 'AI-powered research pipeline for custom data points'}
            </p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-4 h-4" />
            Add Provider
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
          {providers.map((provider, idx) => (
            <ProviderCard key={provider.id} provider={provider} index={idx} />
          ))}
        </div>
      </div>

      {/* Enrichment Results Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Enrichment Results</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search results..."
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Contact / Company</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Original Data</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Enriched Fields</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Provider Used</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Confidence</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Credits</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrichmentResults.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.contact}</p>
                      <p className="text-xs text-gray-400">{row.company}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{row.originalData}</td>
                    <td className="px-4 py-3">
                      {row.enrichedFields.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.enrichedFields.map((field) => (
                            <span key={field} className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                              {field}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No data returned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium text-xs">{row.providerUsed}</td>
                    <td className="px-4 py-3">
                      {row.confidence > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${row.confidence >= 90 ? 'bg-green-500' : row.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-400'}`}
                              style={{ width: `${row.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{row.confidence}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.credits}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${statusColor(row.status)}`}>
                        {statusIcon(row.status)}
                        {row.status === 'not-found' ? 'Not Found' : row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lead Scoring Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lead Scoring</h2>
            <p className="text-sm text-gray-500 mt-0.5">Configure scoring criteria and weights to prioritize your leads</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4" />
            Save Model
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scoring Criteria */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Scoring Criteria</h3>

            {[
              { key: 'companySize' as const, label: 'Company Size', icon: Building2 },
              { key: 'revenueRange' as const, label: 'Revenue Range', icon: TrendingUp },
              { key: 'industryMatch' as const, label: 'Industry Match', icon: Target },
              { key: 'technologyFit' as const, label: 'Technology Fit', icon: Zap },
              { key: 'engagement' as const, label: 'Engagement Signals', icon: BarChart3 },
              { key: 'custom' as const, label: 'Custom Criteria', icon: Star },
            ].map(({ key, label, icon: CriterionIcon }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CriterionIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{scoringWeights[key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scoringWeights[key]}
                  onChange={(e) => setScoringWeights(prev => ({ ...prev, [key]: parseInt(e.target.value, 10) }))}
                  className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            ))}
          </div>

          {/* Score Distribution Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Score Distribution</h3>
            <div className="flex items-end gap-3 h-48">
              {scoreDistribution.map((bucket) => {
                const heightPct = (bucket.count / maxBarCount) * 100;
                const barColor =
                  bucket.bucket === '81-100' ? 'bg-green-500' :
                  bucket.bucket === '61-80' ? 'bg-blue-500' :
                  bucket.bucket === '41-60' ? 'bg-yellow-500' :
                  bucket.bucket === '21-40' ? 'bg-orange-400' :
                  'bg-red-400';

                return (
                  <div key={bucket.bucket} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">{bucket.count}</span>
                    <div className="w-full relative" style={{ height: `${heightPct}%` }}>
                      <div className={`absolute inset-0 ${barColor} rounded-t-md`} />
                    </div>
                    <span className="text-xs text-gray-400">{bucket.bucket}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">Lead score ranges</p>
          </div>
        </div>

        {/* Scored Leads Table */}
        <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Scored Leads</h3>
            <span className="text-xs text-gray-400">{scoredLeads.length} leads scored</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Company</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Score</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Company Size</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Revenue</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Industry</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Signals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {scoredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.company}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBar score={lead.score} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.companySize}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.revenue}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">{lead.industry}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{lead.signals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
