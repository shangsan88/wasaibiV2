import React, { useState } from 'react';
import {
  User, Users, CreditCard, Link as LinkIcon, Bell, Mail, MessageSquare,
  Globe, Camera, Check, Plus, MoreHorizontal, Trash2, Shield, Crown,
  Eye, ChevronDown, ExternalLink, Key, Zap, Send, Search, BarChart3,
  RefreshCw, Settings as SettingsIcon, X, Copy, ArrowUpRight,
  Database, Plug, Cloud, Target, Megaphone, CheckCircle2, AlertCircle,
  Clock, Star, Sparkles
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────
type TabId = 'profile' | 'team' | 'billing' | 'integrations';
type Role = 'Admin' | 'Member' | 'Viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastActive: string;
  avatar: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  color: string;
  icon: React.ElementType;
  hasApiKey?: boolean;
  syncEnabled?: boolean;
  lastSync?: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Sankalp Shangari', email: 'sankalp@wasaibi.io', role: 'Admin', lastActive: 'Now', avatar: 'SS' },
  { id: '2', name: 'Priya Sharma', email: 'priya@wasaibi.io', role: 'Member', lastActive: '2 hours ago', avatar: 'PS' },
  { id: '3', name: 'Alex Chen', email: 'alex@wasaibi.io', role: 'Member', lastActive: '1 day ago', avatar: 'AC' },
  { id: '4', name: 'Jordan Lee', email: 'jordan@wasaibi.io', role: 'Viewer', lastActive: '3 days ago', avatar: 'JL' },
];

const INTEGRATIONS: Integration[] = [
  // CRM
  { id: 'salesforce', name: 'Salesforce', description: 'Sync contacts, accounts, and opportunities with Salesforce CRM', category: 'CRM', connected: true, color: '#00A1E0', icon: Cloud, syncEnabled: true, lastSync: '5 min ago' },
  { id: 'hubspot', name: 'HubSpot', description: 'Push enriched leads and company data to HubSpot CRM', category: 'CRM', connected: false, color: '#FF7A59', icon: Database },
  // Data Providers
  { id: 'apollo', name: 'Apollo.io', description: 'Access 270M+ contacts and 60M+ companies for prospecting', category: 'Data Providers', connected: true, color: '#6C5CE7', icon: Search, hasApiKey: true, lastSync: '12 min ago' },
  { id: 'clearbit', name: 'Clearbit', description: 'Real-time company and contact enrichment data', category: 'Data Providers', connected: true, color: '#3B82F6', icon: Zap, hasApiKey: true, lastSync: '1 hour ago' },
  { id: 'zoominfo', name: 'ZoomInfo', description: 'B2B contact and company intelligence platform', category: 'Data Providers', connected: false, color: '#22C55E', icon: Globe, hasApiKey: true },
  { id: 'linkedin-sales-nav', name: 'LinkedIn Sales Nav', description: 'Advanced lead search and relationship insights from LinkedIn', category: 'Data Providers', connected: false, color: '#0A66C2', icon: Users, hasApiKey: true },
  { id: 'hunter', name: 'Hunter.io', description: 'Find and verify professional email addresses', category: 'Data Providers', connected: true, color: '#F97316', icon: Mail, hasApiKey: true, lastSync: '30 min ago' },
  { id: 'lusha', name: 'Lusha', description: 'Accurate B2B contact and company data enrichment', category: 'Data Providers', connected: false, color: '#8B5CF6', icon: User, hasApiKey: true },
  // Communication
  { id: 'slack', name: 'Slack', description: 'Get real-time alerts and notifications in Slack channels', category: 'Communication', connected: true, color: '#4A154B', icon: MessageSquare, lastSync: 'Real-time' },
  { id: 'gmail', name: 'Gmail', description: 'Send outreach emails and track engagement via Gmail', category: 'Communication', connected: true, color: '#EA4335', icon: Mail, lastSync: 'Real-time' },
  { id: 'outlook', name: 'Outlook', description: 'Connect Microsoft Outlook for email campaigns and sync', category: 'Communication', connected: false, color: '#0078D4', icon: Mail },
  // Ad Platforms
  { id: 'linkedin-ads', name: 'LinkedIn Ads', description: 'Sync audiences and track campaign performance on LinkedIn', category: 'Ad Platforms', connected: false, color: '#0A66C2', icon: Megaphone },
  { id: 'google-ads', name: 'Google Ads', description: 'Push lead lists to Google Ads for targeted campaigns', category: 'Ad Platforms', connected: true, color: '#4285F4', icon: Target, lastSync: '2 hours ago' },
  { id: 'meta-ads', name: 'Meta Ads', description: 'Create custom audiences on Facebook and Instagram', category: 'Ad Platforms', connected: false, color: '#1877F2', icon: Megaphone },
];

const PLANS = [
  { name: 'Free', price: '$0', period: '/mo', credits: '100', enrichments: '50', agents: '1', emails: '100', seats: '1', highlight: false },
  { name: 'Starter', price: '$49', period: '/mo', credits: '2,500', enrichments: '1,000', agents: '5', emails: '2,500', seats: '3', highlight: false },
  { name: 'Pro', price: '$149', period: '/mo', credits: '10,000', enrichments: '5,000', agents: 'Unlimited', emails: '10,000', seats: '10', highlight: true },
  { name: 'Enterprise', price: 'Custom', period: '', credits: 'Unlimited', enrichments: 'Unlimited', agents: 'Unlimited', emails: 'Unlimited', seats: 'Unlimited', highlight: false },
];

// ─── Sub-Components ─────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
    </button>
  );
}

function Badge({ variant, children }: { variant: 'green' | 'gray' | 'blue' | 'amber'; children: React.ReactNode }) {
  const styles = {
    green: 'bg-green-50 text-green-700 border-green-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${styles[variant]}`}>
      {children}
    </span>
  );
}

// ─── Profile Tab ────────────────────────────────────────────────

function ProfileTab({ onSave, isSaved }: { onSave: () => void; isSaved: boolean }) {
  const [notifications, setNotifications] = useState({
    email: true,
    slack: true,
    inApp: true,
    weeklyDigest: false,
    leadAlerts: true,
    teamUpdates: true,
  });

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Avatar & Name Header */}
      <div className="flex items-start gap-5">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-semibold shadow-sm">
            SS
          </div>
          <button className="absolute inset-0 w-20 h-20 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="pt-1">
          <h3 className="text-lg font-semibold text-gray-900">Sankalp Shangari</h3>
          <p className="text-sm text-gray-500">sankalp@wasaibi.io</p>
          <Badge variant="blue">Admin</Badge>
        </div>
      </div>

      {/* Profile Fields */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input type="text" defaultValue="Sankalp" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input type="text" defaultValue="Shangari" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input type="email" defaultValue="sankalp@wasaibi.io" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
            <input type="text" defaultValue="Founder & CEO" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
            <div className="relative">
              <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8">
                <option>(UTC+05:30) Asia/Kolkata - Indian Standard Time</option>
                <option>(UTC-08:00) America/Los_Angeles - Pacific Time</option>
                <option>(UTC-05:00) America/New_York - Eastern Time</option>
                <option>(UTC+00:00) Europe/London - GMT</option>
                <option>(UTC+01:00) Europe/Berlin - Central European Time</option>
                <option>(UTC+08:00) Asia/Singapore - Singapore Time</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Notification Preferences</h2>
        <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
          {[
            { key: 'email' as const, label: 'Email Notifications', desc: 'Receive updates and alerts via email', icon: Mail },
            { key: 'slack' as const, label: 'Slack Notifications', desc: 'Get notified in your connected Slack workspace', icon: MessageSquare },
            { key: 'inApp' as const, label: 'In-App Notifications', desc: 'Show notification badges and popups in the app', icon: Bell },
            { key: 'leadAlerts' as const, label: 'Lead Alerts', desc: 'Get notified when new leads match your criteria', icon: Zap },
            { key: 'teamUpdates' as const, label: 'Team Activity Updates', desc: 'Stay informed about your team members\' actions', icon: Users },
            { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Receive a weekly summary of activity and insights', icon: BarChart3 },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between px-4 py-3.5 bg-white hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <Toggle
                  enabled={notifications[item.key]}
                  onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Save Changes
        </button>
        {isSaved && (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Changes saved successfully
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Team Tab ───────────────────────────────────────────────────

function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Member');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleInvite = () => {
    if (!inviteEmail) return;
    const initials = inviteEmail.substring(0, 2).toUpperCase();
    setMembers(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        lastActive: 'Invited',
        avatar: initials,
      },
    ]);
    setInviteEmail('');
    setInviteRole('Member');
    setShowInvite(false);
  };

  const handleRemove = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setOpenMenu(null);
  };

  const handleRoleChange = (id: string, role: Role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    setOpenMenu(null);
  };

  const roleIcon = (role: Role) => {
    if (role === 'Admin') return <Crown className="w-3 h-3" />;
    if (role === 'Member') return <Shield className="w-3 h-3" />;
    return <Eye className="w-3 h-3" />;
  };

  const roleBadge = (role: Role) => {
    if (role === 'Admin') return 'blue' as const;
    if (role === 'Member') return 'green' as const;
    return 'gray' as const;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-500 mt-0.5">{members.length} members in your workspace</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Invite Team Member</h3>
              <button onClick={() => setShowInvite(false)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as Role)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
                  >
                    <option value="Admin">Admin - Full access</option>
                    <option value="Member">Member - Can create and edit</option>
                    <option value="Viewer">Viewer - Read only access</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button onClick={() => setShowInvite(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="w-4 h-4" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Member</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Role</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Last Active</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-semibold">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={roleBadge(member.role)}>
                    {roleIcon(member.role)}
                    {member.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {member.lastActive === 'Now' && <span className="w-2 h-2 rounded-full bg-green-500" />}
                    {member.lastActive === 'Invited' && <Clock className="w-3 h-3 text-amber-500" />}
                    <span className="text-sm text-gray-600">{member.lastActive}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === member.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                        {(['Admin', 'Member', 'Viewer'] as Role[]).filter(r => r !== member.role).map(r => (
                          <button
                            key={r}
                            onClick={() => handleRoleChange(member.id, r)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            {roleIcon(r)}
                            Change to {r}
                          </button>
                        ))}
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove Member
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Billing Tab ────────────────────────────────────────────────

function BillingTab() {
  const creditsUsed = 6847;
  const creditsTotal = 10000;
  const creditsPercent = Math.round((creditsUsed / creditsTotal) * 100);

  const breakdown = [
    { label: 'Enrichments', used: 3240, total: 5000, color: 'bg-blue-500', icon: Database },
    { label: 'AI Agent Runs', used: 1847, total: 3000, color: 'bg-purple-500', icon: Sparkles },
    { label: 'Email Sends', used: 1760, total: 2000, color: 'bg-green-500', icon: Send },
  ];

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <div className="flex items-start justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-medium text-blue-200 uppercase tracking-wider">Current Plan</span>
          </div>
          <h3 className="text-2xl font-bold">Pro Plan</h3>
          <p className="text-blue-100 text-sm mt-1">Billed monthly. Next renewal on April 19, 2026</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">$149<span className="text-lg font-normal text-blue-200">/mo</span></p>
          <button className="mt-2 text-sm text-blue-200 hover:text-white underline underline-offset-2 transition-colors">
            Manage subscription
          </button>
        </div>
      </div>

      {/* Credit Usage */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Credit Usage This Period</h2>
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">{creditsUsed.toLocaleString()}</p>
              <p className="text-sm text-gray-500">of {creditsTotal.toLocaleString()} credits used</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{(creditsTotal - creditsUsed).toLocaleString()}</p>
              <p className="text-xs text-gray-500">remaining</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${creditsPercent}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Resets on April 19, 2026</p>
        </div>
      </div>

      {/* Credit Breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Credit Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          {breakdown.map(item => {
            const Icon = item.icon;
            const pct = Math.round((item.used / item.total) * 100);
            return (
              <div key={item.label} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-md ${item.color.replace('bg-', 'bg-').replace('500', '100')}`}>
                    <Icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{item.used.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ {item.total.toLocaleString()}</span></p>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Compare Plans</h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Feature</th>
                {PLANS.map(p => (
                  <th key={p.name} className={`text-center text-xs font-semibold uppercase tracking-wider px-4 py-3 ${p.highlight ? 'text-blue-700 bg-blue-50/50' : 'text-gray-500'}`}>
                    {p.name}
                    {p.highlight && <span className="ml-1.5 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full normal-case font-medium">Current</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700 font-medium">Price</td>
                {PLANS.map(p => (
                  <td key={p.name} className={`px-4 py-3 text-sm text-center font-semibold ${p.highlight ? 'text-blue-700 bg-blue-50/30' : 'text-gray-900'}`}>
                    {p.price}{p.period}
                  </td>
                ))}
              </tr>
              {[
                { label: 'Monthly Credits', key: 'credits' as const },
                { label: 'Enrichments', key: 'enrichments' as const },
                { label: 'AI Agents', key: 'agents' as const },
                { label: 'Email Sends', key: 'emails' as const },
                { label: 'Team Seats', key: 'seats' as const },
              ].map(row => (
                <tr key={row.key}>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.label}</td>
                  {PLANS.map(p => (
                    <td key={p.name} className={`px-4 py-3 text-sm text-center ${p.highlight ? 'font-medium text-blue-700 bg-blue-50/30' : 'text-gray-600'}`}>
                      {p[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3" />
                {PLANS.map(p => (
                  <td key={p.name} className={`px-4 py-3 text-center ${p.highlight ? 'bg-blue-50/30' : ''}`}>
                    {p.highlight ? (
                      <span className="text-xs font-medium text-blue-600">Your plan</span>
                    ) : p.name === 'Enterprise' ? (
                      <button className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">Contact Sales</button>
                    ) : (
                      <button className="text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                        {p.price === '$0' ? 'Downgrade' : 'Upgrade'}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Payment Method</h2>
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-700 to-blue-900 rounded-md flex items-center justify-center">
                <span className="text-white text-[10px] font-bold tracking-wider">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Update</button>
              <button className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Integrations Tab ───────────────────────────────────────────

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [filter, setFilter] = useState<string>('all');
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const categories = ['all', ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))];

  const filtered = filter === 'all' ? integrations : integrations.filter(i => i.category === filter);

  const grouped = filtered.reduce<Record<string, Integration[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleConnect = (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (integration?.hasApiKey && !integration.connected) {
      setConfiguring(id);
      setApiKeyInput('');
      return;
    }
    setIntegrations(prev =>
      prev.map(i => i.id === id ? { ...i, connected: !i.connected, lastSync: !i.connected ? 'Just now' : undefined } : i)
    );
  };

  const handleSaveApiKey = (id: string) => {
    if (!apiKeyInput.trim()) return;
    setIntegrations(prev =>
      prev.map(i => i.id === id ? { ...i, connected: true, lastSync: 'Just now' } : i)
    );
    setConfiguring(null);
    setApiKeyInput('');
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev =>
      prev.map(i => i.id === id ? { ...i, connected: false, lastSync: undefined, syncEnabled: undefined } : i)
    );
  };

  const connectedCount = integrations.filter(i => i.connected).length;

  const categoryIcons: Record<string, React.ElementType> = {
    'CRM': Database,
    'Data Providers': Search,
    'Communication': MessageSquare,
    'Ad Platforms': Megaphone,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
          <p className="text-sm text-gray-500 mt-0.5">{connectedCount} of {integrations.length} integrations connected</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Last sync check: 2 min ago</span>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
            {cat !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                {integrations.filter(i => i.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Configure API Key Modal */}
      {configuring && (() => {
        const integration = integrations.find(i => i.id === configuring);
        if (!integration) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: integration.color + '15' }}>
                    <integration.icon className="w-4 h-4" style={{ color: integration.color }} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Connect {integration.name}</h3>
                </div>
                <button onClick={() => setConfiguring(null)} className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">{integration.description}</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={e => setApiKeyInput(e.target.value)}
                      placeholder={`Enter your ${integration.name} API key`}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Your API key is encrypted and stored securely
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button onClick={() => setConfiguring(null)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveApiKey(configuring)}
                  disabled={!apiKeyInput.trim()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  <Plug className="w-4 h-4" />
                  Connect
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Integration Cards by Category */}
      {(Object.entries(grouped) as [string, Integration[]][]).map(([category, items]) => {
        const CatIcon = categoryIcons[category] || Plug;
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <CatIcon className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{category}</h3>
              <span className="text-xs text-gray-400">({items.length})</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {items.map(integration => {
                const Icon = integration.icon;
                return (
                  <div
                    key={integration.id}
                    className={`border rounded-lg p-4 transition-all hover:shadow-sm ${
                      integration.connected ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: integration.color + '15' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: integration.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-gray-900">{integration.name}</h4>
                            {integration.connected ? (
                              <Badge variant="green">
                                <CheckCircle2 className="w-3 h-3" />
                                Connected
                              </Badge>
                            ) : (
                              <Badge variant="gray">Not Connected</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{integration.description}</p>
                          {integration.connected && integration.lastSync && (
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              Last sync: {integration.lastSync}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        {integration.connected ? (
                          <>
                            <button
                              onClick={() => handleConnect(integration.id)}
                              className="text-xs font-medium text-gray-600 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                            >
                              <SettingsIcon className="w-3 h-3" />
                              Configure
                            </button>
                            <button
                              onClick={() => handleDisconnect(integration.id)}
                              className="text-xs font-medium text-red-600 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleConnect(integration.id)}
                            className="text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                          >
                            <Plug className="w-3.5 h-3.5" />
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Settings Component ────────────────────────────────────

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'team', label: 'Team', icon: Users, count: TEAM_MEMBERS.length },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: LinkIcon, count: INTEGRATIONS.filter(i => i.connected).length },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account, team, billing, and integrations.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex min-h-[600px]">
        {/* Sidebar */}
        <div className="w-56 border-r border-gray-200 bg-gray-50/70 p-3 space-y-1 flex-shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'profile' && <ProfileTab onSave={handleSave} isSaved={isSaved} />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
        </div>
      </div>
    </div>
  );
}
