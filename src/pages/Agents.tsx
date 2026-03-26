import React, { useState } from 'react';
import {
  Bot, Plus, X, Search, Mail, Globe, Building2, Newspaper, Cpu, Swords,
  Briefcase, Play, Pencil, Copy, Trash2, ChevronDown,
  CheckCircle2, AlertCircle, Pause, Calendar, FileText,
  Linkedin, LayoutGrid, List, MoreHorizontal, Timer,
  Hash, CreditCard, Sparkles, ChevronUp, RefreshCw, Eye, Loader2
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// ── Types ──────────────────────────────────────────────────────────────────────
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

type AgentStatus = 'Running' | 'Idle' | 'Error';
type ScheduleType = 'Manual' | 'Hourly' | 'Daily' | 'Weekly';

interface OutputColumn {
  id: string;
  name: string;
  type: string;
}

interface Agent {
  id: number;
  name: string;
  type: string;
  templateId: string;
  status: AgentStatus;
  lastRun: string;
  recordsProcessed: number;
  creditsUsed: number;
  instructions: string;
  inputConfig: string;
  outputColumns: OutputColumn[];
  schedule: ScheduleType;
}

interface RunLog {
  id: number;
  agentId: number;
  agentName: string;
  status: 'Success' | 'Failed' | 'Running';
  startedAt: string;
  duration: string;
  records: number;
  errors: number;
}

// ── Template Data ──────────────────────────────────────────────────────────────
const agentTemplates: AgentTemplate[] = [
  { id: 'web-scraper', name: 'Web Scraper', description: 'Extract structured data from any URL or website', icon: Globe, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 'company-researcher', name: 'Company Researcher', description: 'Research company details, funding, and key info', icon: Building2, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { id: 'email-finder', name: 'Email Finder', description: 'Find verified work emails via waterfall enrichment', icon: Mail, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { id: 'linkedin-profiler', name: 'LinkedIn Profiler', description: 'Extract and enrich LinkedIn profile data', icon: Linkedin, color: 'text-sky-600', bgColor: 'bg-sky-50' },
  { id: 'news-monitor', name: 'News Monitor', description: 'Track company mentions and industry news', icon: Newspaper, color: 'text-violet-600', bgColor: 'bg-violet-50' },
  { id: 'tech-stack-detector', name: 'Tech Stack Detector', description: 'Identify technologies used by any company', icon: Cpu, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { id: 'competitor-analyzer', name: 'Competitor Analyzer', description: 'Analyze competitors, positioning, and differentiators', icon: Swords, color: 'text-red-600', bgColor: 'bg-red-50' },
  { id: 'job-board-scanner', name: 'Job Board Scanner', description: 'Monitor job postings for hiring signals', icon: Briefcase, color: 'text-amber-600', bgColor: 'bg-amber-50' },
];

// ── Mock Agents ────────────────────────────────────────────────────────────────
const initialAgents: Agent[] = [
  {
    id: 1,
    name: 'SaaS Company Scraper',
    type: 'Web Scraper',
    templateId: 'web-scraper',
    status: 'Running',
    lastRun: '2 min ago',
    recordsProcessed: 1284,
    creditsUsed: 256,
    instructions: 'Visit each URL and extract the company name, tagline, pricing page link, and list of features from the homepage.',
    inputConfig: 'CSV column: website_url',
    outputColumns: [
      { id: '1', name: 'company_name', type: 'Text' },
      { id: '2', name: 'tagline', type: 'Text' },
      { id: '3', name: 'pricing_url', type: 'URL' },
      { id: '4', name: 'features', type: 'List' },
    ],
    schedule: 'Daily',
  },
  {
    id: 2,
    name: 'Lead Email Finder',
    type: 'Email Finder',
    templateId: 'email-finder',
    status: 'Idle',
    lastRun: '3 hours ago',
    recordsProcessed: 847,
    creditsUsed: 423,
    instructions: 'Find the work email for each person using their full name and company domain. Try multiple providers in waterfall order.',
    inputConfig: 'Table columns: full_name, company_domain',
    outputColumns: [
      { id: '1', name: 'email', type: 'Email' },
      { id: '2', name: 'email_confidence', type: 'Number' },
      { id: '3', name: 'source', type: 'Text' },
    ],
    schedule: 'Manual',
  },
  {
    id: 3,
    name: 'Competitor Intel Bot',
    type: 'Competitor Analyzer',
    templateId: 'competitor-analyzer',
    status: 'Idle',
    lastRun: '1 day ago',
    recordsProcessed: 52,
    creditsUsed: 104,
    instructions: 'For each competitor URL, analyze their positioning, key differentiators, target audience, and recent product updates.',
    inputConfig: 'CSV column: competitor_url',
    outputColumns: [
      { id: '1', name: 'positioning', type: 'Text' },
      { id: '2', name: 'differentiators', type: 'List' },
      { id: '3', name: 'target_audience', type: 'Text' },
      { id: '4', name: 'recent_updates', type: 'List' },
    ],
    schedule: 'Weekly',
  },
  {
    id: 4,
    name: 'LinkedIn Profile Enricher',
    type: 'LinkedIn Profiler',
    templateId: 'linkedin-profiler',
    status: 'Error',
    lastRun: '6 hours ago',
    recordsProcessed: 312,
    creditsUsed: 156,
    instructions: 'Extract job title, company, location, headline, and about section from each LinkedIn profile URL.',
    inputConfig: 'Table column: linkedin_url',
    outputColumns: [
      { id: '1', name: 'job_title', type: 'Text' },
      { id: '2', name: 'company', type: 'Text' },
      { id: '3', name: 'location', type: 'Text' },
      { id: '4', name: 'headline', type: 'Text' },
    ],
    schedule: 'Hourly',
  },
  {
    id: 5,
    name: 'Hiring Signal Tracker',
    type: 'Job Board Scanner',
    templateId: 'job-board-scanner',
    status: 'Running',
    lastRun: 'Just now',
    recordsProcessed: 2103,
    creditsUsed: 630,
    instructions: 'Scan job boards for new postings from target companies. Extract job title, department, seniority level, and posting date.',
    inputConfig: 'CSV column: company_name',
    outputColumns: [
      { id: '1', name: 'job_title', type: 'Text' },
      { id: '2', name: 'department', type: 'Text' },
      { id: '3', name: 'seniority', type: 'Text' },
      { id: '4', name: 'posted_date', type: 'Date' },
    ],
    schedule: 'Daily',
  },
];

// ── Mock Run Logs ──────────────────────────────────────────────────────────────
const initialRunLogs: RunLog[] = [
  { id: 1, agentId: 1, agentName: 'SaaS Company Scraper', status: 'Running', startedAt: '2 min ago', duration: '2m 14s', records: 38, errors: 0 },
  { id: 2, agentId: 5, agentName: 'Hiring Signal Tracker', status: 'Running', startedAt: '5 min ago', duration: '5m 01s', records: 124, errors: 2 },
  { id: 3, agentId: 2, agentName: 'Lead Email Finder', status: 'Success', startedAt: '3 hours ago', duration: '12m 33s', records: 250, errors: 5 },
  { id: 4, agentId: 4, agentName: 'LinkedIn Profile Enricher', status: 'Failed', startedAt: '6 hours ago', duration: '4m 12s', records: 89, errors: 23 },
  { id: 5, agentId: 3, agentName: 'Competitor Intel Bot', status: 'Success', startedAt: '1 day ago', duration: '8m 47s', records: 52, errors: 0 },
  { id: 6, agentId: 1, agentName: 'SaaS Company Scraper', status: 'Success', startedAt: '1 day ago', duration: '15m 22s', records: 500, errors: 3 },
  { id: 7, agentId: 2, agentName: 'Lead Email Finder', status: 'Success', startedAt: '2 days ago', duration: '10m 08s', records: 197, errors: 8 },
];

// ── Status badge helper ────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AgentStatus | RunLog['status'] }) {
  const config: Record<string, { bg: string; text: string; icon: React.ElementType; dot?: string }> = {
    Running: { bg: 'bg-blue-50', text: 'text-blue-700', icon: RefreshCw, dot: 'bg-blue-500' },
    Idle: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Pause },
    Error: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle, dot: 'bg-red-500' },
    Success: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    Failed: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
      {status === 'Running' && <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />}
      {status !== 'Running' && <Icon className="w-3 h-3" />}
      {status}
    </span>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════════════════════
export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [runLogs] = useState<RunLog[]>(initialRunLogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isRunLogOpen, setIsRunLogOpen] = useState(false);
  const [expandedTemplates, setExpandedTemplates] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  // ── Modal form state ───────────────────────────────────────────────────────
  const [formName, setFormName] = useState('');
  const [formTemplate, setFormTemplate] = useState('');
  const [formInputConfig, setFormInputConfig] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formOutputColumns, setFormOutputColumns] = useState<OutputColumn[]>([
    { id: '1', name: '', type: 'Text' },
  ]);
  const [formSchedule, setFormSchedule] = useState<ScheduleType>('Manual');
  const [isGeneratingInstructions, setIsGeneratingInstructions] = useState(false);

  const handleGenerateInstructions = async () => {
    if (!ai || !formName) return;
    
    setIsGeneratingInstructions(true);
    try {
      const template = agentTemplates.find(t => t.id === formTemplate);
      const prompt = `Generate detailed, step-by-step instructions for an AI agent named "${formName}" based on the template "${template?.name || 'General'}".
      The instructions should be clear, actionable, and focused on high-quality data extraction or analysis.
      
      Template description: ${template?.description || 'General purpose data agent'}
      
      Return ONLY the instructions text.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      const generatedText = response.text?.trim() || '';
      if (generatedText) {
        setFormInstructions(generatedText);
      }
    } catch (error) {
      console.error('Error generating instructions:', error);
    } finally {
      setIsGeneratingInstructions(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getTemplate = (templateId: string) => agentTemplates.find(t => t.id === templateId);

  const resetForm = () => {
    setFormName('');
    setFormTemplate('');
    setFormInputConfig('');
    setFormInstructions('');
    setFormOutputColumns([{ id: '1', name: '', type: 'Text' }]);
    setFormSchedule('Manual');
    setEditingAgent(null);
  };

  const openCreateModal = (templateId?: string) => {
    resetForm();
    if (templateId) {
      setFormTemplate(templateId);
      const tpl = getTemplate(templateId);
      if (tpl) setFormName(tpl.name);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setFormName(agent.name);
    setFormTemplate(agent.templateId);
    setFormInputConfig(agent.inputConfig);
    setFormInstructions(agent.instructions);
    setFormOutputColumns(agent.outputColumns.length > 0 ? agent.outputColumns : [{ id: '1', name: '', type: 'Text' }]);
    setFormSchedule(agent.schedule);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSave = () => {
    const tpl = getTemplate(formTemplate);
    if (!formName.trim() || !formTemplate) return;
    if (editingAgent) {
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? {
        ...a,
        name: formName,
        type: tpl?.name || a.type,
        templateId: formTemplate,
        inputConfig: formInputConfig,
        instructions: formInstructions,
        outputColumns: formOutputColumns.filter(c => c.name.trim()),
        schedule: formSchedule,
      } : a));
    } else {
      const newAgent: Agent = {
        id: Date.now(),
        name: formName,
        type: tpl?.name || formTemplate,
        templateId: formTemplate,
        status: 'Idle',
        lastRun: 'Never',
        recordsProcessed: 0,
        creditsUsed: 0,
        instructions: formInstructions,
        inputConfig: formInputConfig,
        outputColumns: formOutputColumns.filter(c => c.name.trim()),
        schedule: formSchedule,
      };
      setAgents(prev => [...prev, newAgent]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDuplicate = (agent: Agent) => {
    const dup: Agent = {
      ...agent,
      id: Date.now(),
      name: `${agent.name} (Copy)`,
      status: 'Idle',
      lastRun: 'Never',
      recordsProcessed: 0,
      creditsUsed: 0,
    };
    setAgents(prev => [...prev, dup]);
    setActiveDropdown(null);
  };

  const handleDelete = (id: number) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    setActiveDropdown(null);
  };

  const handleRun = (id: number) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'Running' as AgentStatus, lastRun: 'Just now' } : a));
    setActiveDropdown(null);
  };

  const addOutputColumn = () => {
    setFormOutputColumns(prev => [...prev, { id: String(Date.now()), name: '', type: 'Text' }]);
  };

  const removeOutputColumn = (id: string) => {
    setFormOutputColumns(prev => prev.length <= 1 ? prev : prev.filter(c => c.id !== id));
  };

  const updateOutputColumn = (id: string, field: 'name' | 'type', value: string) => {
    setFormOutputColumns(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Aggregate stats ────────────────────────────────────────────────────────
  const totalRecords = agents.reduce((s, a) => s + a.recordsProcessed, 0);
  const totalCredits = agents.reduce((s, a) => s + a.creditsUsed, 0);
  const runningCount = agents.filter(a => a.status === 'Running').length;

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">AI Analysts</h1>
              <p className="text-sm text-gray-500 mt-0.5">Build, manage, and run autonomous AI analysts to enrich your data.</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => openCreateModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create AI Analyst
        </button>
      </div>

      {/* ── Quick Stats ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: agents.length, icon: Bot, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Running Now', value: runningCount, icon: Play, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Records Processed', value: totalRecords.toLocaleString(), icon: Hash, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Credits Used', value: totalCredits.toLocaleString(), icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Agent Templates Gallery ──────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setExpandedTemplates(!expandedTemplates)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Agent Templates</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{agentTemplates.length} templates</span>
          </div>
          {expandedTemplates ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {expandedTemplates && (
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-gray-100 pt-5">
            {agentTemplates.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <button
                  key={tpl.id}
                  onClick={() => openCreateModal(tpl.id)}
                  className="text-left p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className={`inline-flex p-2.5 rounded-lg ${tpl.bgColor} mb-3`}>
                    <Icon className={`w-5 h-5 ${tpl.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{tpl.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{tpl.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── My Agents Section ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <List className="w-5 h-5 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">My Agents</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{agents.length}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Agent</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Schedule</th>
                <th className="px-6 py-3 font-medium">Last Run</th>
                <th className="px-6 py-3 font-medium text-right">Records</th>
                <th className="px-6 py-3 font-medium text-right">Credits</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    <Bot className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-500">No agents found</p>
                    <p className="text-sm mt-1">Create your first agent from a template above.</p>
                  </td>
                </tr>
              )}
              {filteredAgents.map((agent) => {
                const tpl = getTemplate(agent.templateId);
                const TplIcon = tpl?.icon || Bot;
                return (
                  <tr key={agent.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tpl?.bgColor || 'bg-gray-100'}`}>
                          <TplIcon className={`w-4 h-4 ${tpl?.color || 'text-gray-500'}`} />
                        </div>
                        <span className="font-medium text-gray-900">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{agent.type}</td>
                    <td className="px-6 py-4"><StatusBadge status={agent.status} /></td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {agent.schedule}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{agent.lastRun}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-right tabular-nums">{agent.recordsProcessed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-500 text-right tabular-nums">{agent.creditsUsed.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-flex items-center gap-1">
                        <button
                          onClick={() => handleRun(agent.id)}
                          disabled={agent.status === 'Running'}
                          className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Run"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(agent)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === agent.id ? null : agent.id)}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {activeDropdown === agent.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                              <button
                                onClick={() => openEditModal(agent)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Details
                              </button>
                              <button
                                onClick={() => handleDuplicate(agent)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Copy className="w-3.5 h-3.5" /> Duplicate
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button
                                onClick={() => handleDelete(agent.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Agent Run Log ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setIsRunLogOpen(!isRunLogOpen)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900">Run Log</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{runLogs.length} runs</span>
          </div>
          {isRunLogOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {isRunLogOpen && (
          <div className="border-t border-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Agent</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Started</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium text-right">Records</th>
                  <th className="px-6 py-3 font-medium text-right">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {runLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{log.agentName}</td>
                    <td className="px-6 py-3"><StatusBadge status={log.status} /></td>
                    <td className="px-6 py-3 text-gray-500">{log.startedAt}</td>
                    <td className="px-6 py-3 text-gray-500 flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-gray-400" />
                      {log.duration}
                    </td>
                    <td className="px-6 py-3 text-gray-900 font-medium text-right tabular-nums">{log.records.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {log.errors > 0
                        ? <span className="text-red-600 font-medium">{log.errors}</span>
                        : <span className="text-gray-400">0</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Agent Modal ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-12 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-12 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{editingAgent ? 'Edit Agent' : 'Create Agent'}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Configure your AI agent&apos;s behavior and outputs.</p>
                </div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
              {/* Agent Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Agent Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., My Lead Enricher"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Agent Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Agent Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {agentTemplates.map((tpl) => {
                    const Icon = tpl.icon;
                    const isSelected = formTemplate === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => setFormTemplate(tpl.id)}
                        className={`p-3 border rounded-lg text-left transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-blue-600' : tpl.color}`} />
                        <p className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{tpl.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Configuration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Input Configuration</label>
                <p className="text-xs text-gray-400 mb-2">Specify what data to feed this agent (e.g., a CSV column or table field).</p>
                <input
                  type="text"
                  value={formInputConfig}
                  onChange={(e) => setFormInputConfig(e.target.value)}
                  placeholder="e.g., CSV column: website_url  or  Table column: company_name"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Instructions */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Instructions
                    </span>
                  </label>
                  <button
                    onClick={handleGenerateInstructions}
                    disabled={!ai || !formName || isGeneratingInstructions}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingInstructions ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Generate with AI
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-2">Tell the agent what to do in plain English, just like Clay&apos;s Claygent.</p>
                <textarea
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  rows={4}
                  placeholder="e.g., Visit each URL and extract the company name, tagline, pricing information, and a list of their main product features. If the pricing page exists, include tier names and prices."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed"
                />
              </div>

              {/* Output Columns */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Output Columns</label>
                <p className="text-xs text-gray-400 mb-3">Define what data the agent should return for each input row.</p>
                <div className="space-y-2">
                  {formOutputColumns.map((col) => (
                    <div key={col.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => updateOutputColumn(col.id, 'name', e.target.value)}
                        placeholder="Column name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={col.type}
                        onChange={(e) => updateOutputColumn(col.id, 'type', e.target.value)}
                        className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="Text">Text</option>
                        <option value="Number">Number</option>
                        <option value="URL">URL</option>
                        <option value="Email">Email</option>
                        <option value="Date">Date</option>
                        <option value="Boolean">Boolean</option>
                        <option value="List">List</option>
                        <option value="JSON">JSON</option>
                      </select>
                      <button
                        onClick={() => removeOutputColumn(col.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addOutputColumn}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add column
                </button>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Schedule</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Manual', 'Hourly', 'Daily', 'Weekly'] as ScheduleType[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormSchedule(s)}
                      className={`py-2.5 px-3 border rounded-lg text-sm font-medium transition-all ${
                        formSchedule === s
                          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
              <button
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formName.trim() || !formTemplate}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
              >
                {editingAgent ? 'Save Changes' : 'Create Agent'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click-away listener for dropdown */}
      {activeDropdown !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
      )}
    </div>
  );
}
