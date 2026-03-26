import React, { useState, useMemo } from 'react';
import {
  Radio,
  Plus,
  Search,
  X,
  ChevronDown,
  Briefcase,
  DollarSign,
  Cpu,
  Globe,
  Sparkles,
  Play,
  Pause,
  Trash2,
  Pencil,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Zap,
  Bell,
  Mail,
  MessageSquare,
  Clock,
  Filter,
  UserPlus,
  Award,
  Newspaper,
  Rocket,
  Building2,
  BarChart3,
  Activity,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type SignalCategory = 'All' | 'Job Changes' | 'Funding' | 'Technology' | 'Web Intent' | 'Custom';
type SignalStatus = 'Active' | 'Paused' | 'Draft';
type SignalType =
  | 'Job Change'
  | 'New Hire'
  | 'Promotion'
  | 'Funding Round'
  | 'Tech Stack Change'
  | 'Website Content Change'
  | 'News Mention'
  | 'Product Launch'
  | 'Company Expansion';
type ActionType = 'Auto-enrich' | 'Slack notification' | 'Email alert' | 'Add to campaign';
type Frequency = 'Real-time' | 'Hourly' | 'Daily' | 'Weekly';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Signal {
  id: number;
  name: string;
  type: SignalType;
  category: SignalCategory;
  status: SignalStatus;
  matches: number;
  matchesToday: number;
  matchesThisWeek: number;
  lastTriggered: string;
  sparkData: number[];
  actions: ActionType[];
  frequency: Frequency;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORIES: SignalCategory[] = ['All', 'Job Changes', 'Funding', 'Technology', 'Web Intent', 'Custom'];

const SIGNAL_TYPES: SignalType[] = [
  'Job Change',
  'New Hire',
  'Promotion',
  'Funding Round',
  'Tech Stack Change',
  'Website Content Change',
  'News Mention',
  'Product Launch',
  'Company Expansion',
];

const ACTION_OPTIONS: ActionType[] = ['Auto-enrich', 'Slack notification', 'Email alert', 'Add to campaign'];

const FREQUENCY_OPTIONS: Frequency[] = ['Real-time', 'Hourly', 'Daily', 'Weekly'];

const CONDITION_FIELDS = [
  'Company Name',
  'Company Size',
  'Industry',
  'Job Title',
  'Department',
  'Seniority',
  'Location',
  'Revenue',
  'Funding Amount',
  'Technology',
  'Keywords',
  'Domain',
];

const CONDITION_OPERATORS = ['equals', 'not equals', 'contains', 'not contains', 'greater than', 'less than', 'starts with', 'ends with'];

function typeToCategory(type: SignalType): SignalCategory {
  switch (type) {
    case 'Job Change':
    case 'New Hire':
    case 'Promotion':
      return 'Job Changes';
    case 'Funding Round':
      return 'Funding';
    case 'Tech Stack Change':
      return 'Technology';
    case 'Website Content Change':
    case 'News Mention':
      return 'Web Intent';
    case 'Product Launch':
    case 'Company Expansion':
      return 'Custom';
    default:
      return 'Custom';
  }
}

function typeIcon(type: SignalType) {
  switch (type) {
    case 'Job Change':
      return Briefcase;
    case 'New Hire':
      return UserPlus;
    case 'Promotion':
      return Award;
    case 'Funding Round':
      return DollarSign;
    case 'Tech Stack Change':
      return Cpu;
    case 'Website Content Change':
      return Globe;
    case 'News Mention':
      return Newspaper;
    case 'Product Launch':
      return Rocket;
    case 'Company Expansion':
      return Building2;
    default:
      return Radio;
  }
}

function typeColor(type: SignalType) {
  switch (type) {
    case 'Job Change':
    case 'New Hire':
    case 'Promotion':
      return { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' };
    case 'Funding Round':
      return { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100 text-green-700' };
    case 'Tech Stack Change':
      return { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' };
    case 'Website Content Change':
    case 'News Mention':
      return { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' };
    case 'Product Launch':
    case 'Company Expansion':
      return { bg: 'bg-pink-50', text: 'text-pink-600', badge: 'bg-pink-100 text-pink-700' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' };
  }
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_SIGNALS: Signal[] = [
  {
    id: 1,
    name: 'VP Sales Hired at Series B+',
    type: 'New Hire',
    category: 'Job Changes',
    status: 'Active',
    matches: 247,
    matchesToday: 12,
    matchesThisWeek: 47,
    lastTriggered: '5 min ago',
    sparkData: [3, 7, 4, 8, 6, 9, 5, 12, 8, 6, 10, 7],
    actions: ['Auto-enrich', 'Slack notification'],
    frequency: 'Real-time',
  },
  {
    id: 2,
    name: 'Series A Funding Announced',
    type: 'Funding Round',
    category: 'Funding',
    status: 'Active',
    matches: 89,
    matchesToday: 3,
    matchesThisWeek: 18,
    lastTriggered: '23 min ago',
    sparkData: [2, 5, 3, 6, 4, 3, 7, 5, 3, 6, 4, 3],
    actions: ['Auto-enrich', 'Email alert', 'Add to campaign'],
    frequency: 'Real-time',
  },
  {
    id: 3,
    name: 'Competitor Tech Stack Swap',
    type: 'Tech Stack Change',
    category: 'Technology',
    status: 'Active',
    matches: 156,
    matchesToday: 7,
    matchesThisWeek: 31,
    lastTriggered: '1 hr ago',
    sparkData: [4, 6, 5, 7, 8, 6, 9, 7, 5, 8, 7, 7],
    actions: ['Slack notification'],
    frequency: 'Hourly',
  },
  {
    id: 4,
    name: 'CTO / CIO Job Change',
    type: 'Job Change',
    category: 'Job Changes',
    status: 'Active',
    matches: 312,
    matchesToday: 9,
    matchesThisWeek: 52,
    lastTriggered: '12 min ago',
    sparkData: [5, 8, 6, 10, 7, 9, 11, 8, 9, 12, 10, 9],
    actions: ['Auto-enrich', 'Add to campaign'],
    frequency: 'Real-time',
  },
  {
    id: 5,
    name: 'Pricing Page Visited',
    type: 'Website Content Change',
    category: 'Web Intent',
    status: 'Paused',
    matches: 1034,
    matchesToday: 0,
    matchesThisWeek: 0,
    lastTriggered: '3 days ago',
    sparkData: [12, 15, 10, 18, 14, 0, 0, 0, 0, 0, 0, 0],
    actions: ['Email alert'],
    frequency: 'Real-time',
  },
  {
    id: 6,
    name: 'Director+ Promotion',
    type: 'Promotion',
    category: 'Job Changes',
    status: 'Active',
    matches: 178,
    matchesToday: 4,
    matchesThisWeek: 22,
    lastTriggered: '45 min ago',
    sparkData: [2, 4, 3, 5, 4, 6, 3, 4, 5, 3, 4, 4],
    actions: ['Auto-enrich', 'Slack notification'],
    frequency: 'Daily',
  },
  {
    id: 7,
    name: 'Competitor Mentioned in News',
    type: 'News Mention',
    category: 'Web Intent',
    status: 'Draft',
    matches: 0,
    matchesToday: 0,
    matchesThisWeek: 0,
    lastTriggered: 'Never',
    sparkData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    actions: ['Slack notification', 'Email alert'],
    frequency: 'Daily',
  },
  {
    id: 8,
    name: 'New Product Launch - ICP Match',
    type: 'Product Launch',
    category: 'Custom',
    status: 'Active',
    matches: 64,
    matchesToday: 2,
    matchesThisWeek: 11,
    lastTriggered: '2 hrs ago',
    sparkData: [1, 2, 3, 2, 1, 3, 2, 4, 2, 1, 2, 2],
    actions: ['Auto-enrich', 'Add to campaign'],
    frequency: 'Daily',
  },
  {
    id: 9,
    name: 'Series B+ Opens New Office',
    type: 'Company Expansion',
    category: 'Custom',
    status: 'Active',
    matches: 41,
    matchesToday: 1,
    matchesThisWeek: 8,
    lastTriggered: '4 hrs ago',
    sparkData: [0, 1, 2, 1, 0, 1, 2, 1, 1, 0, 1, 1],
    actions: ['Email alert'],
    frequency: 'Weekly',
  },
  {
    id: 10,
    name: 'Adopted Kubernetes / Docker',
    type: 'Tech Stack Change',
    category: 'Technology',
    status: 'Paused',
    matches: 203,
    matchesToday: 0,
    matchesThisWeek: 0,
    lastTriggered: '1 week ago',
    sparkData: [6, 8, 5, 9, 7, 4, 0, 0, 0, 0, 0, 0],
    actions: ['Slack notification'],
    frequency: 'Hourly',
  },
];

// ── Mini Spark Chart ───────────────────────────────────────────────────────────

function SparkChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const h = 28;
  const w = 80;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Signals() {
  // ── State ──
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [activeCategory, setActiveCategory] = useState<SignalCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<SignalType | ''>('');
  const [filterStatus, setFilterStatus] = useState<SignalStatus | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // ── Create-signal form state ──
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<SignalType>('Job Change');
  const [formConditions, setFormConditions] = useState<Condition[]>([
    { id: crypto.randomUUID(), field: 'Job Title', operator: 'contains', value: '' },
  ]);
  const [formActions, setFormActions] = useState<ActionType[]>(['Auto-enrich']);
  const [formFrequency, setFormFrequency] = useState<Frequency>('Real-time');

  // ── Filtering ──
  const filtered = useMemo(() => {
    return signals.filter((s) => {
      if (activeCategory !== 'All' && s.category !== activeCategory) return false;
      if (filterType && s.type !== filterType) return false;
      if (filterStatus && s.status !== filterStatus) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [signals, activeCategory, filterType, filterStatus, searchQuery]);

  // ── Stats ──
  const stats = useMemo(() => {
    return {
      total: signals.length,
      active: signals.filter((s) => s.status === 'Active').length,
      matchesToday: signals.reduce((a, s) => a + s.matchesToday, 0),
      matchesWeek: signals.reduce((a, s) => a + s.matchesThisWeek, 0),
    };
  }, [signals]);

  // ── Handlers ──
  function toggleStatus(id: number) {
    setSignals((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active', matchesToday: s.status === 'Active' ? 0 : s.matchesToday } : s,
      ),
    );
    setOpenMenuId(null);
  }

  function deleteSignal(id: number) {
    setSignals((prev) => prev.filter((s) => s.id !== id));
    setOpenMenuId(null);
  }

  function addCondition() {
    setFormConditions((prev) => [...prev, { id: crypto.randomUUID(), field: 'Company Name', operator: 'equals', value: '' }]);
  }

  function removeCondition(id: string) {
    setFormConditions((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.id !== id)));
  }

  function updateCondition(id: string, key: keyof Condition, value: string) {
    setFormConditions((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }

  function toggleAction(action: ActionType) {
    setFormActions((prev) => (prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]));
  }

  function resetForm() {
    setFormName('');
    setFormType('Job Change');
    setFormConditions([{ id: crypto.randomUUID(), field: 'Job Title', operator: 'contains', value: '' }]);
    setFormActions(['Auto-enrich']);
    setFormFrequency('Real-time');
  }

  function handleCreate() {
    if (!formName.trim()) return;
    const newSignal: Signal = {
      id: Date.now(),
      name: formName.trim(),
      type: formType,
      category: typeToCategory(formType),
      status: 'Draft',
      matches: 0,
      matchesToday: 0,
      matchesThisWeek: 0,
      lastTriggered: 'Never',
      sparkData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      actions: formActions,
      frequency: formFrequency,
    };
    setSignals((prev) => [newSignal, ...prev]);
    resetForm();
    setIsModalOpen(false);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Signals</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor intent signals and buying triggers across your market.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Signal
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Signals', value: stats.total, icon: Radio, color: 'text-gray-600', bgColor: 'bg-gray-100' },
          { label: 'Active Signals', value: stats.active, icon: Zap, color: 'text-green-600', bgColor: 'bg-green-100' },
          { label: 'Matches Today', value: stats.matchesToday, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { label: 'Matches This Week', value: stats.matchesWeek, icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</span>
                <div className={`p-1.5 rounded-md ${stat.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stat.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search signals..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as SignalType | '')}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Types</option>
            {SIGNAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as SignalStatus | '')}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Draft">Draft</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {(searchQuery || filterType || filterStatus) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('');
              setFilterStatus('');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} signal{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Signal Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Radio className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No signals found</h3>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or create a new signal.</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            + Create Signal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((signal) => {
            const Icon = typeIcon(signal.type);
            const colors = typeColor(signal.type);
            const sparkColor =
              signal.status === 'Active'
                ? signal.type.includes('Job') || signal.type === 'Promotion' || signal.type === 'New Hire'
                  ? '#2563eb'
                  : signal.type === 'Funding Round'
                    ? '#16a34a'
                    : signal.type === 'Tech Stack Change'
                      ? '#9333ea'
                      : signal.type.includes('Web') || signal.type === 'News Mention'
                        ? '#ea580c'
                        : '#db2777'
                : '#9ca3af';

            return (
              <div
                key={signal.id}
                className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight">{signal.name}</h3>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>{signal.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        signal.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : signal.status === 'Paused'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {signal.status}
                    </span>
                    {/* Actions menu */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === signal.id ? null : signal.id)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenuId === signal.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute right-0 top-8 z-20 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Pencil className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => toggleStatus(signal.id)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              {signal.status === 'Active' ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" />
                                  Resume
                                </>
                              )}
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={() => deleteSignal(signal.id)}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle row: stats + chart */}
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500">Total Matches</p>
                      <p className="text-lg font-semibold text-gray-900">{signal.matches.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Today</p>
                      <p className="text-sm font-medium text-gray-700">{signal.matchesToday}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">This Week</p>
                      <p className="text-sm font-medium text-gray-700">{signal.matchesThisWeek}</p>
                    </div>
                  </div>
                  <SparkChart data={signal.sparkData} color={sparkColor} />
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{signal.lastTriggered}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-500">{signal.frequency}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {signal.actions.map((action) => {
                      let ActionIcon = Zap;
                      if (action === 'Slack notification') ActionIcon = MessageSquare;
                      else if (action === 'Email alert') ActionIcon = Mail;
                      else if (action === 'Add to campaign') ActionIcon = ArrowUpRight;
                      return (
                        <div key={action} className="p-1 rounded bg-gray-50 text-gray-400" title={action}>
                          <ActionIcon className="w-3 h-3" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create Signal Modal ────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="font-semibold text-gray-900 text-lg">Create Signal</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Signal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Signal Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. VP Sales hired at target accounts"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Signal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Signal Type</label>
                <div className="relative">
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as SignalType)}
                    className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {SIGNAL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Conditions Builder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Conditions</label>
                <div className="space-y-2">
                  {formConditions.map((cond, idx) => (
                    <div key={cond.id} className="flex items-center gap-2">
                      {idx > 0 && <span className="text-xs text-gray-400 font-medium w-8 shrink-0 text-center">AND</span>}
                      {idx === 0 && <span className="w-8 shrink-0" />}
                      <div className="relative flex-1 min-w-0">
                        <select
                          value={cond.field}
                          onChange={(e) => updateCondition(cond.id, 'field', e.target.value)}
                          className="w-full appearance-none px-2.5 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          {CONDITION_FIELDS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative flex-1 min-w-0">
                        <select
                          value={cond.operator}
                          onChange={(e) => updateCondition(cond.id, 'operator', e.target.value)}
                          className="w-full appearance-none px-2.5 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          {CONDITION_OPERATORS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <input
                        type="text"
                        value={cond.value}
                        onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 min-w-0 px-2.5 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeCondition(cond.id)}
                        className={`p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0 ${formConditions.length <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addCondition}
                  className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add condition
                </button>
              </div>

              {/* Actions on Trigger */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Action on Trigger</label>
                <div className="flex flex-wrap gap-2">
                  {ACTION_OPTIONS.map((action) => {
                    const selected = formActions.includes(action);
                    let ActionIcon = Zap;
                    if (action === 'Slack notification') ActionIcon = MessageSquare;
                    else if (action === 'Email alert') ActionIcon = Mail;
                    else if (action === 'Add to campaign') ActionIcon = ArrowUpRight;
                    return (
                      <button
                        key={action}
                        onClick={() => toggleAction(action)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          selected
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <ActionIcon className="w-3 h-3" />
                        {action}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Frequency</label>
                <div className="flex gap-2">
                  {FREQUENCY_OPTIONS.map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFormFrequency(freq)}
                      className={`flex-1 px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                        formFrequency === freq
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!formName.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Signal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
