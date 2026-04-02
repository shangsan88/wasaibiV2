import React, { useState } from 'react';
import {
  GitBranch, Star, Clock, Search, Play, ExternalLink,
  ChevronRight, Loader2, CheckCircle2, XCircle, GitFork,
  Code2, Filter, ArrowUpDown, Rocket
} from 'lucide-react';

type RepoStatus = 'ready' | 'launching' | 'running' | 'error';

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  status: RepoStatus;
  url: string;
  isPrivate: boolean;
  defaultBranch: string;
}

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-green-500',
  Rust: 'bg-orange-500',
  Go: 'bg-cyan-500',
  Java: 'bg-red-500',
  Ruby: 'bg-red-400',
  'C#': 'bg-purple-500',
};

const initialRepos: Repository[] = [
  {
    id: 1,
    name: 'wasaibi-analytics',
    fullName: 'wasaibi-org/wasaibi-analytics',
    description: 'Real-time analytics dashboard for deal flow tracking and portfolio performance.',
    language: 'TypeScript',
    stars: 128,
    forks: 24,
    updatedAt: '2 hours ago',
    status: 'ready',
    url: '#',
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    id: 2,
    name: 'market-signal-engine',
    fullName: 'wasaibi-org/market-signal-engine',
    description: 'ML-powered market signal detection and alerting microservice.',
    language: 'Python',
    stars: 87,
    forks: 15,
    updatedAt: '5 hours ago',
    status: 'ready',
    url: '#',
    isPrivate: true,
    defaultBranch: 'main',
  },
  {
    id: 3,
    name: 'enrichment-pipeline',
    fullName: 'wasaibi-org/enrichment-pipeline',
    description: 'Data enrichment pipeline for company and people intelligence.',
    language: 'Go',
    stars: 56,
    forks: 8,
    updatedAt: '1 day ago',
    status: 'ready',
    url: '#',
    isPrivate: true,
    defaultBranch: 'main',
  },
  {
    id: 4,
    name: 'outreach-orchestrator',
    fullName: 'wasaibi-org/outreach-orchestrator',
    description: 'Multi-channel outreach campaign orchestration and tracking.',
    language: 'TypeScript',
    stars: 42,
    forks: 6,
    updatedAt: '3 days ago',
    status: 'ready',
    url: '#',
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    id: 5,
    name: 'deal-scoring-api',
    fullName: 'wasaibi-org/deal-scoring-api',
    description: 'AI-powered deal scoring and prioritization REST API.',
    language: 'Python',
    stars: 93,
    forks: 19,
    updatedAt: '6 hours ago',
    status: 'ready',
    url: '#',
    isPrivate: true,
    defaultBranch: 'main',
  },
  {
    id: 6,
    name: 'portfolio-tracker',
    fullName: 'wasaibi-org/portfolio-tracker',
    description: 'Investment portfolio tracking with real-time valuations and alerts.',
    language: 'JavaScript',
    stars: 71,
    forks: 12,
    updatedAt: '12 hours ago',
    status: 'ready',
    url: '#',
    isPrivate: false,
    defaultBranch: 'main',
  },
  {
    id: 7,
    name: 'crm-sync-service',
    fullName: 'wasaibi-org/crm-sync-service',
    description: 'Bidirectional CRM synchronization service for Salesforce and HubSpot.',
    language: 'Java',
    stars: 34,
    forks: 5,
    updatedAt: '2 days ago',
    status: 'ready',
    url: '#',
    isPrivate: true,
    defaultBranch: 'develop',
  },
  {
    id: 8,
    name: 'compliance-checker',
    fullName: 'wasaibi-org/compliance-checker',
    description: 'Automated regulatory compliance checking for financial transactions.',
    language: 'Rust',
    stars: 112,
    forks: 21,
    updatedAt: '4 hours ago',
    status: 'ready',
    url: '#',
    isPrivate: false,
    defaultBranch: 'main',
  },
];

type SortField = 'name' | 'stars' | 'updatedAt';

export default function Repositories() {
  const [repos, setRepos] = useState<Repository[]>(initialRepos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [launchBranch, setLaunchBranch] = useState('');
  const [launchEnv, setLaunchEnv] = useState<'development' | 'staging' | 'production'>('development');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');

  const languages = ['all', ...Array.from(new Set(repos.map(r => r.language)))];

  const filteredRepos = repos
    .filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLanguage = filterLanguage === 'all' || r.language === filterLanguage;
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortField === 'name') return a.name.localeCompare(b.name);
      if (sortField === 'stars') return b.stars - a.stars;
      return 0;
    });

  const openLaunchModal = (repo: Repository) => {
    setSelectedRepo(repo);
    setLaunchBranch(repo.defaultBranch);
    setLaunchEnv('development');
    setIsLaunchModalOpen(true);
  };

  const handleLaunch = () => {
    if (!selectedRepo) return;
    setRepos(prev =>
      prev.map(r => r.id === selectedRepo.id ? { ...r, status: 'launching' as RepoStatus } : r)
    );
    setIsLaunchModalOpen(false);

    // Simulate launch process
    setTimeout(() => {
      setRepos(prev =>
        prev.map(r => r.id === selectedRepo.id ? { ...r, status: 'running' as RepoStatus } : r)
      );
    }, 3000);
  };

  const getStatusBadge = (status: RepoStatus) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            Ready
          </span>
        );
      case 'launching':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">
            <Loader2 className="w-3 h-3 animate-spin" /> Launching
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700">
            <CheckCircle2 className="w-3 h-3" /> Running
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-700">
            <XCircle className="w-3 h-3" /> Error
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Repositories</h1>
          <p className="text-sm text-gray-500 mt-1">Select a repository to launch as an application</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Code2 className="w-4 h-4" />
          <span>{repos.length} repositories</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search repositories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterLanguage}
              onChange={e => setFilterLanguage(e.target.value)}
              className="bg-transparent text-gray-700 focus:outline-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as SortField)}
              className="bg-transparent text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="name">Name</option>
              <option value="stars">Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repository List */}
      <div className="space-y-2">
        {filteredRepos.map(repo => (
          <div
            key={repo.id}
            className="group border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-gray-400" />
                    <h3 className="text-base font-semibold text-blue-600 hover:underline cursor-pointer truncate">
                      {repo.fullName}
                    </h3>
                  </div>
                  {repo.isPrivate && (
                    <span className="px-2 py-0.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-full">
                      Private
                    </span>
                  )}
                  {getStatusBadge(repo.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{repo.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`} />
                    {repo.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" /> {repo.forks}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Updated {repo.updatedAt}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                {repo.status === 'running' ? (
                  <a
                    href={repo.url}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Open App
                  </a>
                ) : repo.status === 'launching' ? (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg opacity-75 cursor-not-allowed"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" /> Launching...
                  </button>
                ) : (
                  <button
                    onClick={() => openLaunchModal(repo)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Rocket className="w-4 h-4" /> Launch
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredRepos.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Code2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No repositories found matching your search.</p>
          </div>
        )}
      </div>

      {/* Launch Modal */}
      {isLaunchModalOpen && selectedRepo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Launch Application</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Configure and launch <span className="font-medium text-gray-700">{selectedRepo.name}</span>
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Branch Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch</label>
                <div className="relative">
                  <GitBranch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={launchBranch}
                    onChange={e => setLaunchBranch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Environment Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Environment</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['development', 'staging', 'production'] as const).map(env => (
                    <button
                      key={env}
                      onClick={() => setLaunchEnv(env)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors capitalize ${
                        launchEnv === env
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Repository</span>
                  <span className="font-medium text-gray-900">{selectedRepo.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Branch</span>
                  <span className="font-medium text-gray-900">{launchBranch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Environment</span>
                  <span className="font-medium text-gray-900 capitalize">{launchEnv}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsLaunchModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunch}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" /> Launch App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
