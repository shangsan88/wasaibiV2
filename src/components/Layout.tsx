import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Search, Send, Bot,
  Download, Trash2, Settings, BrainCircuit, BookOpen,
  ChevronRight, ChevronDown, Building2, Users, HelpCircle, Sparkles, X,
  Bird, Rocket, MessageCircle, Briefcase, Handshake, FlaskConical,
  Scale, Landmark, GitCompare, DollarSign, UserCheck, GraduationCap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import HelpSupportWidget from './HelpSupportWidget';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    '/deal-matching': location.pathname.includes('/deal-matching'),
    '/partners': location.pathname.includes('/partners'),
    '/research': location.pathname.includes('/research'),
    '/gtm': location.pathname.includes('/gtm'),
  });
  const [isHelpWidgetOpen, setIsHelpWidgetOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const topNavItems = [
    { path: '/ask-wasaibi', label: 'Ask WASAIBI AI', icon: MessageCircle },
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/scout', label: 'Scout Agent', icon: Bird },
    {
      path: '/gtm',
      label: 'Outreach Agent',
      icon: Send,
      hasSub: true,
      subItems: [
        { path: '/gtm/campaigns', label: 'Campaign Orchestrator', icon: Send },
      ]
    },
    { path: '/my-deals', label: 'My Deals', icon: Briefcase },
    {
      path: '/deal-matching',
      label: 'Deal Matching',
      icon: GitCompare,
      hasSub: true,
      subItems: [
        { path: '/deal-matching/spac', label: 'SPAC Matching', icon: Landmark },
        { path: '/deal-matching/ma', label: 'M&A', icon: Building2 },
        { path: '/deal-matching/fundraise', label: 'Fund Raise', icon: DollarSign },
      ]
    },
    {
      path: '/partners',
      label: 'Partners',
      icon: Handshake,
      hasSub: true,
      subItems: [
        { path: '/partners/origination', label: 'Origination Partners', icon: UserCheck },
        { path: '/partners/advisors', label: 'Financial Advisors', icon: GraduationCap },
      ]
    },
    {
      path: '/research',
      label: 'Research',
      icon: FlaskConical,
      hasSub: true,
      subItems: [
        { path: '/research/spac', label: 'SPAC Research', icon: Landmark },
        { path: '/research/company', label: 'Company Research', icon: Building2 },
      ]
    },
    { path: '/service-providers', label: 'Service Providers', icon: Scale },
    { path: '/investors', label: 'Investors Database', icon: Landmark },
  ];

  const bottomNavItems = [
    { path: '/agents', label: 'AI Agents', icon: Bot },
    { path: '/exports', label: 'Data Exports', icon: Download },
    { path: '/trash', label: 'Archive', icon: Trash2 },
    { path: '/settings', label: 'Configuration', icon: Settings },
    { path: '/ai-context', label: 'Knowledge Base', icon: BrainCircuit },
    { path: '/resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#fbfbfa] border-r border-gray-200 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white">
              W
            </div>
            <span className="font-semibold text-gray-900 tracking-wide">WASAIBI</span>
          </div>

          <nav className="space-y-0.5 px-3 mt-4">
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.hasSub && location.pathname.startsWith(item.path));
              const isExpanded = expandedMenus[item.path];
              const isAskWasaibi = item.path === '/ask-wasaibi';

              return (
                <div key={item.path}>
                  <div
                    onClick={() => {
                      if (item.hasSub) {
                        toggleMenu(item.path);
                      } else {
                        navigate(item.path);
                      }
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group cursor-pointer",
                      isAskWasaibi && isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : isAskWasaibi
                        ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        : isActive && !item.hasSub
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-4 h-4",
                        isAskWasaibi ? "text-blue-500" :
                        isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                      )} />
                      <span className={cn(isActive && item.hasSub ? "font-medium text-gray-900" : "")}>{item.label}</span>
                    </div>
                    {item.hasSub && (
                      isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {item.hasSub && isExpanded && item.subItems && (
                    <div className="mt-0.5 ml-4 space-y-0.5 border-l border-gray-200 pl-2">
                      {item.subItems.map(subItem => {
                        const SubIcon = subItem.icon;
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group",
                              isSubActive
                                ? "bg-gray-100 text-gray-900 font-medium"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                          >
                            <SubIcon className={cn("w-4 h-4", isSubActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900")} />
                            {subItem.label}
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="pb-4">
          <nav className="space-y-0.5 px-3">
            <div className="border-t border-gray-200 pt-3 mb-2" />
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors group",
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900")} />
                    {item.label}
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => setIsHelpWidgetOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group mt-4 border-t border-gray-200 pt-4"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                Help & support
              </div>
            </button>
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
                Changelog
              </div>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors group mt-4 border-t border-gray-200 pt-4"
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                AD
              </div>
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
          <HelpSupportWidget
            isOpen={isHelpWidgetOpen}
            onClose={() => setIsHelpWidgetOpen(false)}
          />
        </main>
      </div>

      {/* Changelog Modal */}
      {isChangelogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Changelog
              </div>
              <button
                onClick={() => setIsChangelogOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">NEW</span>
                  <span className="text-sm font-medium text-gray-900">v2.4.0 - Custom Integrations</span>
                </div>
                <p className="text-sm text-gray-600">You can now add your own custom API integrations directly from the Data Sources panel.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">IMPROVEMENT</span>
                  <span className="text-sm font-medium text-gray-900">v2.3.5 - Faster Search</span>
                </div>
                <p className="text-sm text-gray-600">We've optimized our search engine to deliver results up to 40% faster across all data sources.</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
              <button
                onClick={() => setIsChangelogOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
