import React, { useState } from 'react';
import {
  Mail, Plus, Play, Pause, MoreVertical, X, Users, ArrowRight, CheckCircle2,
  Copy, Archive, Edit3, Eye, Clock, Calendar, Globe, Send, MousePointerClick,
  MessageSquare, AlertTriangle, ChevronDown, ChevronRight, Trash2, GripVertical,
  Linkedin, GitBranch, Timer, Zap, BarChart3, Activity, TrendingUp, Shield,
  Flame, ArrowDown, ExternalLink, Search, Sparkles, Loader2
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// ── Types ──────────────────────────────────────────────────────────────────────

type CampaignStatus = 'Active' | 'Draft' | 'Paused' | 'Completed';

interface SequenceStep {
  id: string;
  type: 'initial-email' | 'follow-up-email' | 'linkedin-connect' | 'linkedin-message' | 'delay' | 'condition';
  label: string;
  subject?: string;
  body?: string;
  delayDays?: number;
  delayHours?: number;
  conditionField?: string;
  conditionOp?: string;
  conditionValue?: string;
  abTestEnabled?: boolean;
  abSubjectB?: string;
}

interface Campaign {
  id: number;
  name: string;
  list: string;
  listSize: number;
  status: CampaignStatus;
  sender: string;
  startDate: string;
  sendWindow: string;
  timezone: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  steps: SequenceStep[];
  recentActivity: { time: string; text: string }[];
  dailySends: number[];
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: 'Q3 Tech M&A Outreach',
    list: 'Tech Founders (Saved)',
    listSize: 420,
    status: 'Active',
    sender: 'nodezilla88@gmail.com',
    startDate: '2026-03-10',
    sendWindow: '9:00 AM - 5:00 PM',
    timezone: 'America/New_York',
    sent: 312,
    delivered: 305,
    opened: 198,
    clicked: 74,
    replied: 38,
    bounced: 7,
    steps: [
      { id: 's1', type: 'initial-email', label: 'Initial Email', subject: 'Quick question regarding {{companyName}}', body: 'Hi {{firstName}},\n\nI noticed {{companyName}} in the {{industry}} space...' },
      { id: 's2', type: 'delay', label: 'Wait 3 days', delayDays: 3 },
      { id: 's3', type: 'condition', label: 'If opened', conditionField: 'email_opened', conditionOp: 'equals', conditionValue: 'true' },
      { id: 's4', type: 'follow-up-email', label: 'Follow-up Email', subject: '', body: 'Just circling back on my previous note...' },
      { id: 's5', type: 'delay', label: 'Wait 2 days', delayDays: 2 },
      { id: 's6', type: 'linkedin-connect', label: 'LinkedIn Connection Request' },
    ],
    recentActivity: [
      { time: '2 min ago', text: 'John Smith opened "Quick question regarding Acme Corp"' },
      { time: '15 min ago', text: 'Sarah Lee replied to follow-up email' },
      { time: '1 hr ago', text: 'Mike Chen clicked link in initial email' },
      { time: '2 hr ago', text: 'Email to jane@corp.io bounced (invalid address)' },
      { time: '3 hr ago', text: 'Lisa Park accepted LinkedIn connection request' },
    ],
    dailySends: [28, 35, 42, 38, 45, 40, 32, 48, 44, 30, 50, 38, 25, 42],
  },
  {
    id: 2,
    name: 'Renewable Energy LPs',
    list: 'Green Energy Investors',
    listSize: 185,
    status: 'Draft',
    sender: 'sales@wasaibi.com',
    startDate: '',
    sendWindow: '10:00 AM - 4:00 PM',
    timezone: 'America/Chicago',
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
    bounced: 0,
    steps: [
      { id: 's1', type: 'initial-email', label: 'Initial Email', subject: 'Exciting opportunity in {{industry}}', body: 'Dear {{firstName}},\n\nWe have identified {{companyName}} as a leader in...' },
    ],
    recentActivity: [],
    dailySends: [],
  },
  {
    id: 3,
    name: 'Series B Follow-ups',
    list: 'Series B Leads',
    listSize: 67,
    status: 'Completed',
    sender: 'nodezilla88@gmail.com',
    startDate: '2026-02-01',
    sendWindow: '8:00 AM - 6:00 PM',
    timezone: 'America/Los_Angeles',
    sent: 67,
    delivered: 65,
    opened: 52,
    clicked: 31,
    replied: 24,
    bounced: 2,
    steps: [
      { id: 's1', type: 'initial-email', label: 'Initial Email', subject: 'Following up - {{companyName}} Series B', body: 'Hi {{firstName}}, re: {{recentNews}}...' },
      { id: 's2', type: 'delay', label: 'Wait 5 days', delayDays: 5 },
      { id: 's3', type: 'follow-up-email', label: 'Follow-up Email', subject: '', body: 'Wanted to make sure you saw my last message...' },
    ],
    recentActivity: [
      { time: '3 days ago', text: 'Campaign completed - all contacts processed' },
      { time: '4 days ago', text: 'Final batch of 12 emails sent' },
    ],
    dailySends: [8, 10, 12, 9, 11, 7, 10],
  },
  {
    id: 4,
    name: 'AI/ML Decision Makers',
    list: 'AI Startup CTOs',
    listSize: 230,
    status: 'Paused',
    sender: 'sales@wasaibi.com',
    startDate: '2026-03-05',
    sendWindow: '9:00 AM - 5:00 PM',
    timezone: 'America/New_York',
    sent: 142,
    delivered: 138,
    opened: 89,
    clicked: 42,
    replied: 15,
    bounced: 4,
    steps: [
      { id: 's1', type: 'initial-email', label: 'Initial Email', subject: '{{firstName}}, quick thought on {{companyName}}\'s AI stack', body: 'Hi {{firstName}},\n\nGiven {{companyName}}\'s work in {{industry}}...' },
      { id: 's2', type: 'delay', label: 'Wait 2 days', delayDays: 2 },
      { id: 's3', type: 'linkedin-connect', label: 'LinkedIn Connection Request' },
      { id: 's4', type: 'delay', label: 'Wait 3 days', delayDays: 3 },
      { id: 's5', type: 'follow-up-email', label: 'Follow-up', subject: '', body: 'Hey {{firstName}}, circling back...' },
      { id: 's6', type: 'delay', label: 'Wait 4 days', delayDays: 4 },
      { id: 's7', type: 'linkedin-message', label: 'LinkedIn DM', body: 'Hi {{firstName}}, sent you an email earlier about...' },
    ],
    recentActivity: [
      { time: '1 day ago', text: 'Campaign paused by user' },
      { time: '1 day ago', text: 'Alex Rivera replied to initial email' },
      { time: '2 days ago', text: '18 emails sent in batch' },
    ],
    dailySends: [15, 22, 18, 25, 20, 19, 23],
  },
  {
    id: 5,
    name: 'Marketing Directors NY Metro',
    list: 'Marketing Directors NY',
    listSize: 340,
    status: 'Active',
    sender: 'nodezilla88@gmail.com',
    startDate: '2026-03-15',
    sendWindow: '10:00 AM - 3:00 PM',
    timezone: 'America/New_York',
    sent: 89,
    delivered: 87,
    opened: 61,
    clicked: 28,
    replied: 9,
    bounced: 2,
    steps: [
      { id: 's1', type: 'initial-email', label: 'Initial Email', subject: 'Helping {{companyName}} with GTM', body: 'Hi {{firstName}},\n\nAs {{companyName}} scales its marketing efforts...' , abTestEnabled: true, abSubjectB: '{{firstName}}, a new approach to GTM at {{companyName}}' },
      { id: 's2', type: 'delay', label: 'Wait 3 days', delayDays: 3 },
      { id: 's3', type: 'condition', label: 'If clicked', conditionField: 'email_clicked', conditionOp: 'equals', conditionValue: 'true' },
      { id: 's4', type: 'follow-up-email', label: 'Follow-up (clicked)', subject: '', body: 'Noticed you checked out what we do...' },
      { id: 's5', type: 'delay', label: 'Wait 4 days', delayDays: 4 },
      { id: 's6', type: 'follow-up-email', label: 'Final follow-up', subject: 'Last note from me', body: 'Hi {{firstName}}, I\'ll keep this brief...' },
    ],
    recentActivity: [
      { time: '30 min ago', text: 'Emily Watson opened initial email (variant B)' },
      { time: '1 hr ago', text: 'David Kim replied with interest' },
      { time: '3 hr ago', text: '14 emails delivered in batch' },
    ],
    dailySends: [22, 28, 39],
  },
];

const SAVED_LISTS = [
  'Tech Founders (Saved)',
  'Green Energy Investors',
  'Series B Leads',
  'AI Startup CTOs',
  'Marketing Directors NY',
  'Healthcare VPs',
];

const EMAIL_ACCOUNTS = [
  {
    id: 1,
    email: 'nodezilla88@gmail.com',
    provider: 'Google',
    status: 'Connected' as const,
    dailyLimit: 500,
    sentToday: 145,
    warmupStatus: 'Warmed up' as const,
    warmupProgress: 100,
    deliverabilityScore: 96,
    domainHealth: 'Excellent' as const,
    spfPass: true,
    dkimPass: true,
    dmarcPass: true,
  },
  {
    id: 2,
    email: 'sales@wasaibi.com',
    provider: 'Outlook',
    status: 'Connected' as const,
    dailyLimit: 1000,
    sentToday: 42,
    warmupStatus: 'Warming' as const,
    warmupProgress: 68,
    deliverabilityScore: 82,
    domainHealth: 'Good' as const,
    spfPass: true,
    dkimPass: true,
    dmarcPass: false,
  },
  {
    id: 3,
    email: 'outreach@wasaibi.com',
    provider: 'Google',
    status: 'Connected' as const,
    dailyLimit: 750,
    sentToday: 0,
    warmupStatus: 'Not started' as const,
    warmupProgress: 0,
    deliverabilityScore: 74,
    domainHealth: 'Needs attention' as const,
    spfPass: true,
    dkimPass: false,
    dmarcPass: false,
  },
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Australia/Sydney',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Helper components ──────────────────────────────────────────────────────────

function MetricBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-gray-500 text-right shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-0">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-gray-700 font-medium shrink-0">{value.toLocaleString()} <span className="text-gray-400 font-normal">({pct}%)</span></span>
    </div>
  );
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const styles: Record<CampaignStatus, string> = {
    Active: 'bg-green-50 text-green-700 border-green-200',
    Draft: 'bg-gray-50 text-gray-600 border-gray-200',
    Paused: 'bg-amber-50 text-amber-700 border-amber-200',
    Completed: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  const icons: Record<CampaignStatus, React.ReactNode> = {
    Active: <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />,
    Draft: <Edit3 className="w-3 h-3" />,
    Paused: <Pause className="w-3 h-3" />,
    Completed: <CheckCircle2 className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
}

function StepIcon({ type }: { type: SequenceStep['type'] }) {
  const map: Record<string, { icon: React.ReactNode; bg: string }> = {
    'initial-email': { icon: <Mail className="w-3.5 h-3.5 text-blue-600" />, bg: 'bg-blue-50 border-blue-200' },
    'follow-up-email': { icon: <Send className="w-3.5 h-3.5 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-200' },
    'linkedin-connect': { icon: <Linkedin className="w-3.5 h-3.5 text-sky-600" />, bg: 'bg-sky-50 border-sky-200' },
    'linkedin-message': { icon: <MessageSquare className="w-3.5 h-3.5 text-sky-600" />, bg: 'bg-sky-50 border-sky-200' },
    'delay': { icon: <Timer className="w-3.5 h-3.5 text-gray-500" />, bg: 'bg-gray-50 border-gray-200' },
    'condition': { icon: <GitBranch className="w-3.5 h-3.5 text-amber-600" />, bg: 'bg-amber-50 border-amber-200' },
  };
  const m = map[type] || map['delay'];
  return (
    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${m.bg}`}>
      {m.icon}
    </div>
  );
}

function StepTypeLabel({ type }: { type: SequenceStep['type'] }) {
  const labels: Record<string, string> = {
    'initial-email': 'Email',
    'follow-up-email': 'Follow-up Email',
    'linkedin-connect': 'LinkedIn Connect',
    'linkedin-message': 'LinkedIn Message',
    'delay': 'Delay',
    'condition': 'If / Else',
  };
  return <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{labels[type] || type}</span>;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ReachOutSales() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'accounts'>('campaigns');
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [viewingCampaignId, setViewingCampaignId] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'All'>('All');

  // ── Create Campaign modal state
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newTargetList, setNewTargetList] = useState('');
  const [newSenderAccount, setNewSenderAccount] = useState(EMAIL_ACCOUNTS[0].email);
  const [newStartDate, setNewStartDate] = useState('');
  const [newSendWindowStart, setNewSendWindowStart] = useState('09:00');
  const [newSendWindowEnd, setNewSendWindowEnd] = useState('17:00');
  const [newTimezone, setNewTimezone] = useState('America/New_York');
  const [newActiveDays, setNewActiveDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [isGeneratingAi, setIsGeneratingAi] = useState<string | null>(null);

  const handleGenerateAiContent = async (stepId: string, type: string) => {
    if (!ai) return;
    
    setIsGeneratingAi(stepId);
    try {
      const step = newSteps.find(s => s.id === stepId);
      const prompt = `Generate a professional ${type} for a sales outreach campaign. 
      The goal is to be concise, personalized, and high-converting.
      Use these tokens where appropriate: {{firstName}}, {{companyName}}, {{industry}}, {{recentNews}}.
      
      ${type === 'email' ? 'Provide both a Subject Line and a Body.' : 'Provide only the message body.'}
      
      Return the result as a JSON object with keys: "subject" (if email) and "body".
      Return ONLY valid JSON.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const generatedText = response.text?.trim() || '';
      if (generatedText) {
        const parsed = JSON.parse(generatedText);
        updateStep(stepId, { 
          subject: parsed.subject || step?.subject, 
          body: parsed.body || step?.body 
        });
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
    } finally {
      setIsGeneratingAi(null);
    }
  };
  const [newSteps, setNewSteps] = useState<SequenceStep[]>([
    { id: 'new-1', type: 'initial-email', label: 'Initial Email', subject: '', body: '' },
  ]);
  const [addStepMenuOpen, setAddStepMenuOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'setup' | 'sequence'>('setup');

  const viewingCampaign = campaigns.find(c => c.id === viewingCampaignId) || null;

  // ── Actions
  const toggleCampaignStatus = (id: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== id) return c;
      if (c.status === 'Active') return { ...c, status: 'Paused' as CampaignStatus };
      if (c.status === 'Paused' || c.status === 'Draft') return { ...c, status: 'Active' as CampaignStatus };
      return c;
    }));
    setActionMenuId(null);
  };

  const duplicateCampaign = (id: number) => {
    const source = campaigns.find(c => c.id === id);
    if (!source) return;
    const newId = Math.max(...campaigns.map(c => c.id)) + 1;
    setCampaigns(prev => [...prev, {
      ...source,
      id: newId,
      name: `${source.name} (Copy)`,
      status: 'Draft' as CampaignStatus,
      sent: 0, delivered: 0, opened: 0, clicked: 0, replied: 0, bounced: 0,
      startDate: '',
      recentActivity: [],
      dailySends: [],
    }]);
    setActionMenuId(null);
  };

  const archiveCampaign = (id: number) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    setActionMenuId(null);
  };

  const addSequenceStep = (type: SequenceStep['type']) => {
    const labels: Record<string, string> = {
      'initial-email': 'Email',
      'follow-up-email': 'Follow-up Email',
      'linkedin-connect': 'LinkedIn Connection Request',
      'linkedin-message': 'LinkedIn Message',
      'delay': 'Wait 3 days',
      'condition': 'If/Else Condition',
    };
    setNewSteps(prev => [...prev, {
      id: `new-${Date.now()}`,
      type,
      label: labels[type],
      subject: '',
      body: '',
      delayDays: type === 'delay' ? 3 : undefined,
      delayHours: undefined,
      conditionField: type === 'condition' ? 'email_opened' : undefined,
      conditionOp: type === 'condition' ? 'equals' : undefined,
      conditionValue: type === 'condition' ? 'true' : undefined,
    }]);
    setAddStepMenuOpen(false);
  };

  const removeStep = (stepId: string) => {
    setNewSteps(prev => prev.filter(s => s.id !== stepId));
  };

  const updateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    setNewSteps(prev => prev.map(s => s.id === stepId ? { ...s, ...updates } : s));
  };

  const resetCreateModal = () => {
    setNewCampaignName('');
    setNewTargetList('');
    setNewSenderAccount(EMAIL_ACCOUNTS[0].email);
    setNewStartDate('');
    setNewSendWindowStart('09:00');
    setNewSendWindowEnd('17:00');
    setNewTimezone('America/New_York');
    setNewActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setNewSteps([{ id: 'new-1', type: 'initial-email', label: 'Initial Email', subject: '', body: '' }]);
    setModalTab('setup');
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">GTM Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Build multi-step sequences across Email and LinkedIn to engage your leads.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'campaigns' ? (
            <button
              onClick={() => { resetCreateModal(); setIsNewCampaignModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          ) : (
            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Email Account
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => { setActiveTab('campaigns'); setViewingCampaignId(null); }}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'campaigns'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Email Campaigns
          </button>
          <button
            onClick={() => { setActiveTab('accounts'); setViewingCampaignId(null); }}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'accounts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sender Accounts
          </button>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          CAMPAIGNS TAB
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'campaigns' && !viewingCampaign && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {(['All', 'Active', 'Draft', 'Paused', 'Completed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-500 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Cards */}
          <div className="space-y-4">
            {filteredCampaigns.length === 0 && (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
                <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No campaigns found.</p>
              </div>
            )}
            {filteredCampaigns.map(campaign => {
              const baseTotal = campaign.sent || 1;
              return (
                <div
                  key={campaign.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => setViewingCampaignId(campaign.id)}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate block"
                          >
                            {campaign.name}
                          </button>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{campaign.list} ({campaign.listSize})</span>
                            <span className="flex items-center gap-1">{campaign.steps.length} steps</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <StatusBadge status={campaign.status} />
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === campaign.id ? null : campaign.id)}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {actionMenuId === campaign.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
                              {(campaign.status === 'Active' || campaign.status === 'Paused' || campaign.status === 'Draft') && (
                                <button
                                  onClick={() => toggleCampaignStatus(campaign.id)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  {campaign.status === 'Active' ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
                                </button>
                              )}
                              <button
                                onClick={() => { setViewingCampaignId(campaign.id); setActionMenuId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="w-4 h-4" /> View Analytics
                              </button>
                              <button
                                onClick={() => duplicateCampaign(campaign.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Copy className="w-4 h-4" /> Duplicate
                              </button>
                              <button
                                onClick={() => archiveCampaign(campaign.id)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Archive className="w-4 h-4" /> Archive
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Schedule row */}
                    {campaign.startDate && (
                      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Started {campaign.startDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {campaign.sendWindow}</span>
                        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {campaign.timezone.replace('America/', '').replace('_', ' ')}</span>
                      </div>
                    )}

                    {/* Metrics */}
                    {campaign.sent > 0 && (
                      <div className="space-y-1.5">
                        <MetricBar label="Sent" value={campaign.sent} total={campaign.listSize} color="bg-gray-500" />
                        <MetricBar label="Delivered" value={campaign.delivered} total={baseTotal} color="bg-blue-500" />
                        <MetricBar label="Opened" value={campaign.opened} total={baseTotal} color="bg-green-500" />
                        <MetricBar label="Clicked" value={campaign.clicked} total={baseTotal} color="bg-indigo-500" />
                        <MetricBar label="Replied" value={campaign.replied} total={baseTotal} color="bg-purple-500" />
                        <MetricBar label="Bounced" value={campaign.bounced} total={baseTotal} color="bg-red-400" />
                      </div>
                    )}

                    {campaign.sent === 0 && (
                      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-400">No sends yet. Start the campaign to begin sequencing.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          CAMPAIGN ANALYTICS VIEW
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'campaigns' && viewingCampaign && (
        <div className="space-y-6">
          {/* Back + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewingCampaignId(null)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back
            </button>
            <h2 className="text-lg font-semibold text-gray-900">{viewingCampaign.name}</h2>
            <StatusBadge status={viewingCampaign.status} />
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {([
              { label: 'Sent', value: viewingCampaign.sent, icon: Send, color: 'text-gray-600' },
              { label: 'Delivered', value: viewingCampaign.delivered, icon: CheckCircle2, color: 'text-blue-600' },
              { label: 'Opened', value: viewingCampaign.opened, icon: Eye, color: 'text-green-600' },
              { label: 'Clicked', value: viewingCampaign.clicked, icon: MousePointerClick, color: 'text-indigo-600' },
              { label: 'Replied', value: viewingCampaign.replied, icon: MessageSquare, color: 'text-purple-600' },
              { label: 'Bounced', value: viewingCampaign.bounced, icon: AlertTriangle, color: 'text-red-500' },
            ] as const).map(stat => {
              const pct = viewingCampaign.sent > 0 ? Math.round((stat.value / viewingCampaign.sent) * 100) : 0;
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <div className="text-xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                  <div className="text-[11px] text-gray-500">{stat.label} {stat.label !== 'Sent' && `(${pct}%)`}</div>
                </div>
              );
            })}
          </div>

          {/* Funnel + Daily chart side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" /> Conversion Funnel
              </h3>
              <div className="space-y-2">
                {([
                  { label: 'Sent', value: viewingCampaign.sent, color: 'bg-gray-500' },
                  { label: 'Delivered', value: viewingCampaign.delivered, color: 'bg-blue-500' },
                  { label: 'Opened', value: viewingCampaign.opened, color: 'bg-green-500' },
                  { label: 'Clicked', value: viewingCampaign.clicked, color: 'bg-indigo-500' },
                  { label: 'Replied', value: viewingCampaign.replied, color: 'bg-purple-500' },
                ] as const).map((step, i) => {
                  const widthPct = viewingCampaign.sent > 0 ? Math.max(8, (step.value / viewingCampaign.sent) * 100) : 0;
                  const pct = viewingCampaign.sent > 0 ? Math.round((step.value / viewingCampaign.sent) * 100) : 0;
                  return (
                    <div key={step.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{step.label}</span>
                        <span className="text-gray-900 font-semibold">{step.value.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded h-6 flex items-center overflow-hidden" style={{ maxWidth: `${widthPct}%` }}>
                        <div className={`${step.color} h-full w-full rounded opacity-80`} />
                      </div>
                      {i < 4 && (
                        <div className="flex justify-center py-0.5">
                          <ArrowDown className="w-3 h-3 text-gray-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily sends chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-400" /> Daily Sends
              </h3>
              {viewingCampaign.dailySends.length > 0 ? (
                <div className="flex items-end gap-1.5 h-40">
                  {viewingCampaign.dailySends.map((val, i) => {
                    const maxVal = Math.max(...viewingCampaign.dailySends);
                    const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                        <span className="text-[9px] text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                        <div
                          className="w-full bg-blue-400 hover:bg-blue-500 rounded-t transition-colors min-h-[2px]"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-[9px] text-gray-400 mt-1">D{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                  No data yet
                </div>
              )}
            </div>
          </div>

          {/* Sequence steps mini-view */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" /> Sequence Steps
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {viewingCampaign.steps.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <StepIcon type={step.type} />
                    <span className="text-xs font-medium text-gray-700">{step.label}</span>
                  </div>
                  {i < viewingCampaign.steps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" /> Recent Activity
            </h3>
            {viewingCampaign.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {viewingCampaign.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-xs text-gray-400 w-24 shrink-0 pt-0.5 text-right">{item.time}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">No activity yet.</p>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SENDER ACCOUNTS TAB
         ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EMAIL_ACCOUNTS.map(account => (
            <div key={account.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{account.email}</h3>
                    <p className="text-xs text-gray-500">{account.provider}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  {account.status}
                </span>
              </div>

              {/* Warmup status */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    Warmup
                  </span>
                  <span className={`font-semibold ${
                    account.warmupStatus === 'Warmed up' ? 'text-green-600' :
                    account.warmupStatus === 'Warming' ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    {account.warmupStatus}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      account.warmupProgress === 100 ? 'bg-green-500' :
                      account.warmupProgress > 0 ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                    style={{ width: `${account.warmupProgress}%` }}
                  />
                </div>
              </div>

              {/* Deliverability score */}
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Deliverability
                </span>
                <span className={`font-bold text-lg ${
                  account.deliverabilityScore >= 90 ? 'text-green-600' :
                  account.deliverabilityScore >= 75 ? 'text-amber-600' : 'text-red-500'
                }`}>
                  {account.deliverabilityScore}%
                </span>
              </div>

              {/* Domain health */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Domain Health</span>
                  <span className={`font-semibold ${
                    account.domainHealth === 'Excellent' ? 'text-green-600' :
                    account.domainHealth === 'Good' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {account.domainHealth}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className={`flex items-center gap-1 ${account.spfPass ? 'text-green-600' : 'text-red-500'}`}>
                    {account.spfPass ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} SPF
                  </span>
                  <span className={`flex items-center gap-1 ${account.dkimPass ? 'text-green-600' : 'text-red-500'}`}>
                    {account.dkimPass ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} DKIM
                  </span>
                  <span className={`flex items-center gap-1 ${account.dmarcPass ? 'text-green-600' : 'text-red-500'}`}>
                    {account.dmarcPass ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} DMARC
                  </span>
                </div>
              </div>

              {/* Daily usage */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Daily Limit</span>
                  <span className="text-gray-900 font-medium">{account.sentToday} / {account.dailyLimit}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${(account.sentToday / account.dailyLimit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Settings
                </button>
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          CREATE CAMPAIGN MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      {isNewCampaignModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsNewCampaignModalOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Create New Campaign</h2>
                <p className="text-xs text-gray-500 mt-0.5">Set up your multi-step outreach sequence</p>
              </div>
              <button onClick={() => setIsNewCampaignModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal tabs */}
            <div className="px-6 border-b border-gray-200 shrink-0">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setModalTab('setup')}
                  className={`whitespace-nowrap pb-3 pt-3 border-b-2 text-sm font-medium ${
                    modalTab === 'setup' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Campaign Setup
                </button>
                <button
                  onClick={() => setModalTab('sequence')}
                  className={`whitespace-nowrap pb-3 pt-3 border-b-2 text-sm font-medium ${
                    modalTab === 'sequence' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sequence Builder
                </button>
              </nav>
            </div>

            {/* Modal body */}
            <div className="p-6 overflow-y-auto flex-1">
              {modalTab === 'setup' && (
                <div className="space-y-5 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Q4 Enterprise Outreach"
                      value={newCampaignName}
                      onChange={e => setNewCampaignName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target List (from Leads)</label>
                    <select
                      value={newTargetList}
                      onChange={e => setNewTargetList(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a saved list...</option>
                      {SAVED_LISTS.map(list => (
                        <option key={list} value={list}>{list}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sender Account</label>
                    <select
                      value={newSenderAccount}
                      onChange={e => setNewSenderAccount(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {EMAIL_ACCOUNTS.map(acc => (
                        <option key={acc.id} value={acc.email}>{acc.email} ({acc.provider})</option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" /> Schedule
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newStartDate}
                          onChange={e => setNewStartDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Timezone</label>
                        <select
                          value={newTimezone}
                          onChange={e => setNewTimezone(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {TIMEZONES.map(tz => (
                            <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Send Window Start</label>
                        <input
                          type="time"
                          value={newSendWindowStart}
                          onChange={e => setNewSendWindowStart(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Send Window End</label>
                        <input
                          type="time"
                          value={newSendWindowEnd}
                          onChange={e => setNewSendWindowEnd(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-medium text-gray-600 mb-2">Active Days</label>
                      <div className="flex gap-2">
                        {WEEKDAYS.map(day => (
                          <button
                            key={day}
                            onClick={() => {
                              setNewActiveDays(prev =>
                                prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                              newActiveDays.includes(day)
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'sequence' && (
                <div className="space-y-4">
                  {/* Personalization tokens info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-800">
                    <span className="font-semibold">AI Personalization Tokens:</span>{' '}
                    <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">{'{{firstName}}'}</code>{' '}
                    <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">{'{{companyName}}'}</code>{' '}
                    <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">{'{{industry}}'}</code>{' '}
                    <code className="bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">{'{{recentNews}}'}</code>
                  </div>

                  {/* Steps pipeline */}
                  <div className="space-y-0">
                    {newSteps.map((step, idx) => (
                      <div key={step.id}>
                        {/* Connector line */}
                        {idx > 0 && (
                          <div className="flex items-center justify-center py-1">
                            <div className="w-px h-4 bg-gray-300" />
                          </div>
                        )}

                        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
                          {/* Step header */}
                          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                            <div className="flex items-center gap-2.5">
                              <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                              <StepIcon type={step.type} />
                              <div>
                                <span className="text-sm font-medium text-gray-800">Step {idx + 1}</span>
                                <span className="text-gray-400 mx-1.5">-</span>
                                <StepTypeLabel type={step.type} />
                              </div>
                            </div>
                            <button
                              onClick={() => removeStep(step.id)}
                              className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Remove step"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Step body */}
                          <div className="p-4">
                            {(step.type === 'initial-email' || step.type === 'follow-up-email') && (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Subject {step.type === 'follow-up-email' && <span className="text-gray-400 font-normal">(leave blank to reply in thread)</span>}
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Quick question regarding {{companyName}}"
                                    value={step.subject || ''}
                                    onChange={e => updateStep(step.id, { subject: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>

                                {/* A/B test toggle */}
                                {step.type === 'initial-email' && (
                                  <div>
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={step.abTestEnabled || false}
                                        onChange={e => updateStep(step.id, { abTestEnabled: e.target.checked })}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="font-medium text-gray-600">A/B test subject line</span>
                                    </label>
                                    {step.abTestEnabled && (
                                      <div className="mt-2">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Subject B (variant)</label>
                                        <input
                                          type="text"
                                          placeholder="Alternate subject line..."
                                          value={step.abSubjectB || ''}
                                          onChange={e => updateStep(step.id, { abSubjectB: e.target.value })}
                                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-xs font-medium text-gray-600">Body</label>
                                  <button
                                    onClick={() => handleGenerateAiContent(step.id, 'email')}
                                    disabled={!ai || !!isGeneratingAi}
                                    className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isGeneratingAi === step.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3 h-3" />
                                    )}
                                    Generate with AI
                                  </button>
                                </div>
                                <textarea
                                  rows={4}
                                  placeholder={`Hi {{firstName}},\n\nI noticed that {{companyName}}...`}
                                  value={step.body || ''}
                                  onChange={e => updateStep(step.id, { body: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 font-mono"
                                />
                              </div>
                            )}

                            {step.type === 'linkedin-connect' && (
                              <div className="text-sm text-gray-500 flex items-center gap-2 py-1">
                                <Linkedin className="w-4 h-4 text-sky-500" />
                                Send a LinkedIn connection request to the contact. A note can be added after connecting.
                              </div>
                            )}

                            {step.type === 'linkedin-message' && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-xs font-medium text-gray-600">Message</label>
                                  <button
                                    onClick={() => handleGenerateAiContent(step.id, 'LinkedIn message')}
                                    disabled={!ai || !!isGeneratingAi}
                                    className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isGeneratingAi === step.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3 h-3" />
                                    )}
                                    Generate with AI
                                  </button>
                                </div>
                                <textarea
                                  rows={3}
                                  placeholder={`Hi {{firstName}}, reaching out about...`}
                                  value={step.body || ''}
                                  onChange={e => updateStep(step.id, { body: e.target.value })}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            )}

                            {step.type === 'delay' && (
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Wait</span>
                                <input
                                  type="number"
                                  min={1}
                                  value={step.delayDays || 3}
                                  onChange={e => updateStep(step.id, { delayDays: parseInt(e.target.value) || 1, label: `Wait ${e.target.value} days` })}
                                  className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                <span className="text-sm text-gray-600">days before next step</span>
                              </div>
                            )}

                            {step.type === 'condition' && (
                              <div className="space-y-3">
                                <p className="text-xs text-gray-500">Split the sequence based on a condition. Contacts matching the condition proceed; others skip to the next non-conditional step.</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm text-gray-700 font-medium">If</span>
                                  <select
                                    value={step.conditionField || 'email_opened'}
                                    onChange={e => updateStep(step.id, { conditionField: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="email_opened">Email Opened</option>
                                    <option value="email_clicked">Email Clicked</option>
                                    <option value="email_replied">Email Replied</option>
                                    <option value="linkedin_accepted">LinkedIn Accepted</option>
                                  </select>
                                  <select
                                    value={step.conditionOp || 'equals'}
                                    onChange={e => updateStep(step.id, { conditionOp: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="equals">equals</option>
                                    <option value="not_equals">does not equal</option>
                                  </select>
                                  <select
                                    value={step.conditionValue || 'true'}
                                    onChange={e => updateStep(step.id, { conditionValue: e.target.value })}
                                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add step button */}
                  <div className="relative">
                    <div className="flex justify-center py-1">
                      <div className="w-px h-4 bg-gray-300" />
                    </div>
                    <button
                      onClick={() => setAddStepMenuOpen(!addStepMenuOpen)}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Step
                    </button>
                    {addStepMenuOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                        {([
                          { type: 'follow-up-email' as const, label: 'Follow-up Email', icon: <Send className="w-4 h-4 text-indigo-500" /> },
                          { type: 'linkedin-connect' as const, label: 'LinkedIn Connection', icon: <Linkedin className="w-4 h-4 text-sky-500" /> },
                          { type: 'linkedin-message' as const, label: 'LinkedIn Message', icon: <MessageSquare className="w-4 h-4 text-sky-500" /> },
                          { type: 'delay' as const, label: 'Delay / Wait', icon: <Timer className="w-4 h-4 text-gray-500" /> },
                          { type: 'condition' as const, label: 'If / Else Condition', icon: <GitBranch className="w-4 h-4 text-amber-500" /> },
                        ]).map(opt => (
                          <button
                            key={opt.type}
                            onClick={() => addSequenceStep(opt.type)}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {opt.icon}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Visual flow mini-map */}
                  {newSteps.length > 1 && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sequence Flow</h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {newSteps.map((step, i) => (
                          <React.Fragment key={step.id}>
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-2 py-1">
                              <StepIcon type={step.type} />
                              <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap">{step.label}</span>
                            </div>
                            {i < newSteps.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
              <div className="text-xs text-gray-500">
                {newSteps.length} step{newSteps.length !== 1 && 's'} configured
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsNewCampaignModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsNewCampaignModalOpen(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => setIsNewCampaignModalOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Save & Start Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          ADD ACCOUNT MODAL
         ═══════════════════════════════════════════════════════════════════════ */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsAddAccountModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Connect Email Account</h2>
              <button onClick={() => setIsAddAccountModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">Connect your email provider to start sending campaigns.</p>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Google Workspace</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.4 24L0 22.2V1.8L11.4 0V24Z" fill="#00A4EF"/>
                      <path d="M24 22.8L12.6 24V0L24 1.2V22.8Z" fill="#00A4EF"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Microsoft Outlook</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">SMTP / IMAP</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
