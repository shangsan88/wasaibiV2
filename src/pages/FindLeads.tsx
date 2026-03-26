import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Sparkles, Send, Building2, Users, Briefcase, Plus, HelpCircle, ChevronsUpDown, Database, Loader2, Globe, FileText, X, CheckSquare, Square, Settings2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Country, State } from 'country-state-city';

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export default function FindLeads({ type = 'companies' }: { type?: 'companies' | 'people' }) {
  const navigate = useNavigate();
  const [isAiOpen, setIsAiOpen] = useState(true);
  const [isContinueMenuOpen, setIsContinueMenuOpen] = useState(false);
  const [isSelectTableModalOpen, setIsSelectTableModalOpen] = useState(false);
  const [isEnrichmentViewOpen, setIsEnrichmentViewOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    'Company attributes': true,
    'Location': true,
    'Data Sources': true
  });
  
  const [filters, setFilters] = useState({
    includedIndustries: '',
    excludedIndustries: '',
    companySize: '',
    revenue: '',
    funding: '',
    employeeMin: '',
    employeeMax: '',
    companyType: '',
    includeKeywords: '',
    excludeKeywords: '',
    includedCountries: '',
    excludedCountries: '',
    includedLocations: '',
    excludedLocations: '',
    dataSources: ['Apollo.io', 'Clearbit', 'ZoomInfo', 'LinkedIn', 'Hunter.io', 'Dropcontact', 'Lusha']
  });

  const [customIntegrations, setCustomIntegrations] = useState<string[]>([]);
  const [isAddIntegrationModalOpen, setIsAddIntegrationModalOpen] = useState(false);
  const [newIntegrationName, setNewIntegrationName] = useState('');
  const [newIntegrationKey, setNewIntegrationKey] = useState('');

  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const [isGeneratingInclude, setIsGeneratingInclude] = useState(false);
  const [isGeneratingExclude, setIsGeneratingExclude] = useState(false);

  const [isPastSearchesOpen, setIsPastSearchesOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [isAdminWorkspaceOpen, setIsAdminWorkspaceOpen] = useState(false);
  const [isSaveSearchModalOpen, setIsSaveSearchModalOpen] = useState(false);
  const [isCreateTableModalOpen, setIsCreateTableModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');

  const handleAiSubmit = async (input?: string | React.MouseEvent | React.KeyboardEvent) => {
    const query = typeof input === 'string' ? input : aiInput;
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const prompt = `Based on the following user request, extract the relevant filter criteria for a B2B lead generation tool. 
      Return the result as a JSON object with the following possible keys:
      - includedIndustries (string, e.g., "Software Development")
      - companySize (string, e.g., "11-50 employees")
      - revenue (string, e.g., "$1M - $5M")
      - includedCountries (string, e.g., "United States")
      - includeKeywords (string, e.g., "AI, Machine Learning")
      
      User request: "${query}"
      
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
        try {
          const parsedFilters = JSON.parse(generatedText);
          setFilters(prev => ({ ...prev, ...parsedFilters }));
          
          // Expand the relevant filter sections
          setExpandedFilters(prev => ({
            ...prev,
            'Company attributes': !!(parsedFilters.includedIndustries || parsedFilters.companySize || parsedFilters.revenue),
            'Location': !!parsedFilters.includedCountries,
            'Keywords': !!parsedFilters.includeKeywords
          }));
        } catch (e) {
          console.error("Failed to parse AI response", e);
        }
      }
    } catch (error) {
      console.error('Error generating filters:', error);
    } finally {
      setIsLoading(false);
      setAiInput('');
    }
  };

  // Mock data generator
  useEffect(() => {
    const generateMockData = () => {
      setIsLoading(true);
      
      // Simulate network request
      const timer = setTimeout(() => {
        const newResults = [];
        const count = Math.floor(Math.random() * 50) + 20; // 20 to 70 results per page
        const total = Math.floor(Math.random() * 1000000) + 50000;
        
        for (let i = 0; i < count; i++) {
          const id = Math.random().toString(36).substring(7);
          if (type === 'companies') {
            newResults.push({
              id,
              name: `Company ${id.toUpperCase()}`,
              desc: `A leading provider of solutions in the ${filters.includedIndustries || 'technology'} sector, focusing on ${filters.includeKeywords || 'innovation'}.`,
              industry: filters.includedIndustries || 'Software Development',
              size: filters.companySize || '51-200 employees',
              revenue: filters.revenue || '$1M - $5M',
              location: filters.includedCountries || 'United States'
            });
          } else {
            newResults.push({
              id,
              name: `Person ${id.toUpperCase()}`,
              company: `Company ${Math.random().toString(36).substring(7).toUpperCase()}`,
              title: 'Senior Executive',
              location: filters.includedCountries || 'United States',
              industry: filters.includedIndustries || 'Software Development'
            });
          }
        }
        
        setResults(newResults);
        setTotalResults(total);
        setIsLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    };

    generateMockData();
  }, [filters, type]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleDataSource = (source: string) => {
    setFilters(prev => {
      const current = prev.dataSources;
      if (current.includes(source)) {
        return { ...prev, dataSources: current.filter(s => s !== source) };
      } else {
        return { ...prev, dataSources: [...current, source] };
      }
    });
  };

  const handleAddIntegration = () => {
    if (newIntegrationName.trim()) {
      setCustomIntegrations(prev => [...prev, newIntegrationName.trim()]);
      setFilters(prev => ({
        ...prev,
        dataSources: [...prev.dataSources, newIntegrationName.trim()]
      }));
      setNewIntegrationName('');
      setNewIntegrationKey('');
      setIsAddIntegrationModalOpen(false);
    }
  };

  const toggleFilter = (filter: string) => {
    setExpandedFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const generateKeywords = async (keywordType: 'include' | 'exclude') => {
    const currentText = keywordType === 'include' ? filters.includeKeywords : filters.excludeKeywords;
    const setGenerating = keywordType === 'include' ? setIsGeneratingInclude : setIsGeneratingExclude;

    if (!currentText.trim()) return;

    setGenerating(true);
    try {
      const prompt = `Generate a comma-separated list of 5-10 related business keywords or synonyms for a company description search based on the following input: "${currentText}". Return ONLY the comma-separated list, no other text.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const generatedText = response.text?.trim() || '';
      if (generatedText) {
        const existing = currentText.split(',').map(s => s.trim()).filter(Boolean);
        const newKeywords = generatedText.split(',').map(s => s.trim()).filter(Boolean);
        const combined = Array.from(new Set([...existing, ...newKeywords])).join(', ');
        handleFilterChange(keywordType === 'include' ? 'includeKeywords' : 'excludeKeywords', combined);
      }
    } catch (error) {
      console.error('Failed to generate keywords:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-gray-900 font-medium hover:bg-gray-50 px-2 py-1 rounded-md">
            {type === 'companies' ? <Building2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            Find {type === 'companies' ? 'Companies' : 'People'}
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-700 font-medium hover:bg-gray-50 px-2 py-1 rounded-md"
          >
            <Database className="w-4 h-4 text-gray-500" />
            Import / Upload Data
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCreditsModalOpen(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50 px-2 py-1 rounded-md"
          >
            <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px]">C</span>
            Credits
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsAdminWorkspaceOpen(!isAdminWorkspaceOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-md text-left"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">AD</div>
              <div className="text-sm">
                <div className="font-medium text-gray-900 leading-none">Admin</div>
                <div className="text-xs text-gray-500">Admin's Workspace</div>
              </div>
            </button>
            {isAdminWorkspaceOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAdminWorkspaceOpen(false)}></div>
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Profile</div>
                  <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Billing</div>
                  <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Team</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Filters */}
        <div className="w-[300px] border-r border-gray-200 bg-[#fbfbfa] flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-gray-900">Refine with filters</h2>
              <button 
                onClick={() => setFilters({
                  includedIndustries: '',
                  excludedIndustries: '',
                  companySize: '',
                  revenue: '',
                  funding: '',
                  employeeMin: '',
                  employeeMax: '',
                  companyType: '',
                  includeKeywords: '',
                  excludeKeywords: '',
                  includedCountries: '',
                  excludedCountries: '',
                  includedLocations: '',
                  excludedLocations: '',
                  dataSources: ['Apollo.io', 'Clearbit', 'ZoomInfo', 'LinkedIn', 'Hunter.io', 'Dropcontact', 'Lusha']
                })}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button 
                  onClick={() => setIsPastSearchesOpen(!isPastSearchesOpen)}
                  className="w-full bg-white border border-gray-200 text-gray-700 text-sm py-1.5 rounded-md flex items-center justify-center gap-1 hover:bg-gray-50"
                >
                  See past searches <ChevronDown className="w-3 h-3" />
                </button>
                {isPastSearchesOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsPastSearchesOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Saved Tables</div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        WASAIBI Starter Table
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Software Companies APAC
                      </button>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 border-t mt-1">Recent Searches</div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        "Software development" in "Singapore"
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button 
                onClick={() => setIsSaveSearchModalOpen(true)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 text-sm py-1.5 rounded-md hover:bg-gray-50"
              >
                Save search
              </button>
            </div>
          </div>

          <div className="p-2 space-y-1">
            {/* Accordion Item */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <button 
                onClick={() => toggleFilter('Company attributes')}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  Company attributes
                </div>
                {expandedFilters['Company attributes'] ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              
              {expandedFilters['Company attributes'] && (
                <div className="p-4 space-y-4 border-t border-gray-100">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Industries to include</label>
                    <div className="relative">
                      <select 
                        value={filters.includedIndustries}
                        onChange={(e) => handleFilterChange('includedIndustries', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. Software development</option>
                        <option value="Abrasives and Nonmetallic Minerals Manufacturing">Abrasives and Nonmetallic Minerals Manufacturing</option>
                        <option value="Accessible Architecture and Design">Accessible Architecture and Design</option>
                        <option value="Accommodation Services">Accommodation Services</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Administration of Justice">Administration of Justice</option>
                        <option value="Administrative and Support Services">Administrative and Support Services</option>
                        <option value="Advertising Services">Advertising Services</option>
                        <option value="Agricultural Chemical Manufacturing">Agricultural Chemical Manufacturing</option>
                        <option value="Agriculture, Construction, Mining Machinery Manufacturing">Agriculture, Construction, Mining Machinery Manufacturing</option>
                        <option value="Air, Water, and Waste Program Management">Air, Water, and Waste Program Management</option>
                        <option value="Airlines and Aviation">Airlines and Aviation</option>
                        <option value="Alternative Dispute Resolution">Alternative Dispute Resolution</option>
                        <option value="Alternative Medicine">Alternative Medicine</option>
                        <option value="Ambulance Services">Ambulance Services</option>
                        <option value="Amusement Parks and Arcades">Amusement Parks and Arcades</option>
                        <option value="Animal Feed Manufacturing">Animal Feed Manufacturing</option>
                        <option value="Animation">Animation</option>
                        <option value="Software Development">Software Development</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Industries to exclude</label>
                    <div className="relative">
                      <select 
                        value={filters.excludedIndustries}
                        onChange={(e) => handleFilterChange('excludedIndustries', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. Advertising services</option>
                        <option value="Abrasives and Nonmetallic Minerals Manufacturing">Abrasives and Nonmetallic Minerals Manufacturing</option>
                        <option value="Accessible Architecture and Design">Accessible Architecture and Design</option>
                        <option value="Accommodation Services">Accommodation Services</option>
                        <option value="Accounting">Accounting</option>
                        <option value="Administration of Justice">Administration of Justice</option>
                        <option value="Administrative and Support Services">Administrative and Support Services</option>
                        <option value="Advertising Services">Advertising Services</option>
                        <option value="Agricultural Chemical Manufacturing">Agricultural Chemical Manufacturing</option>
                        <option value="Agriculture, Construction, Mining Machinery Manufacturing">Agriculture, Construction, Mining Machinery Manufacturing</option>
                        <option value="Air, Water, and Waste Program Management">Air, Water, and Waste Program Management</option>
                        <option value="Airlines and Aviation">Airlines and Aviation</option>
                        <option value="Alternative Dispute Resolution">Alternative Dispute Resolution</option>
                        <option value="Alternative Medicine">Alternative Medicine</option>
                        <option value="Ambulance Services">Ambulance Services</option>
                        <option value="Amusement Parks and Arcades">Amusement Parks and Arcades</option>
                        <option value="Animal Feed Manufacturing">Animal Feed Manufacturing</option>
                        <option value="Animation">Animation</option>
                        <option value="Software Development">Software Development</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Company sizes</label>
                    <div className="relative">
                      <select 
                        value={filters.companySize}
                        onChange={(e) => handleFilterChange('companySize', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. 11-50 employees</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="2-10 employees">2-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="501-1,000 employees">501-1,000 employees</option>
                        <option value="1,001-5,000 employees">1,001-5,000 employees</option>
                        <option value="5,001-10,000 employees">5,001-10,000 employees</option>
                        <option value="10,001+ employees">10,001+ employees</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Annual revenue</label>
                    <div className="relative">
                      <select 
                        value={filters.revenue}
                        onChange={(e) => handleFilterChange('revenue', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. $1M - $5M</option>
                        <option value="$0 - $500K">$0 - $500K</option>
                        <option value="$500K - $1M">$500K - $1M</option>
                        <option value="$1M - $5M">$1M - $5M</option>
                        <option value="$5M - $10M">$5M - $10M</option>
                        <option value="$10M - $25M">$10M - $25M</option>
                        <option value="$25M - $75M">$25M - $75M</option>
                        <option value="$75M - $200M">$75M - $200M</option>
                        <option value="$200M - $500M">$200M - $500M</option>
                        <option value="$500M - $1B">$500M - $1B</option>
                        <option value="$1B - $10B">$1B - $10B</option>
                        <option value="$10B - $100B">$10B - $100B</option>
                        <option value="$100B+">$100B+</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Funding raised</label>
                    <div className="relative">
                      <select 
                        value={filters.funding}
                        onChange={(e) => handleFilterChange('funding', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. $5M - $10M</option>
                        <option value="Under $1M">Under $1M</option>
                        <option value="$1M - $5M">$1M - $5M</option>
                        <option value="$5M - $10M">$5M - $10M</option>
                        <option value="$10M - $25M">$10M - $25M</option>
                        <option value="$25M - $50M">$25M - $50M</option>
                        <option value="$50M - $100M">$50M - $100M</option>
                        <option value="$100M - $250M">$100M - $250M</option>
                        <option value="$250M+">$250M+</option>
                        <option value="Funding unknown">Funding unknown</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Estimated employee count</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          min="1" 
                          placeholder="Min" 
                          value={filters.employeeMin}
                          onChange={(e) => handleFilterChange('employeeMin', e.target.value)}
                          className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        />
                        <ChevronsUpDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="relative flex-1">
                        <input 
                          type="number" 
                          min="1" 
                          placeholder="Max" 
                          value={filters.employeeMax}
                          onChange={(e) => handleFilterChange('employeeMax', e.target.value)}
                          className="w-full border border-gray-300 rounded-md py-1.5 px-3 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                        />
                        <ChevronsUpDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Company types</label>
                    <div className="relative">
                      <select 
                        value={filters.companyType}
                        onChange={(e) => handleFilterChange('companyType', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. Privately held</option>
                        <option value="Privately Held">Privately Held</option>
                        <option value="Public Company">Public Company</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Self Employed">Self Employed</option>
                        <option value="Non Profit">Non Profit</option>
                        <option value="Educational">Educational</option>
                        <option value="Self Owned">Self Owned</option>
                        <option value="Government Agency">Government Agency</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Description keywords to include</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={filters.includeKeywords}
                        onChange={(e) => handleFilterChange('includeKeywords', e.target.value)}
                        placeholder="e.g. sales, data, outbound" 
                        className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                      <button 
                        onClick={() => generateKeywords('include')}
                        disabled={isGeneratingInclude || !filters.includeKeywords.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50" 
                        title="Generate with Gemini AI"
                      >
                        {isGeneratingInclude ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Description keywords to exclude</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={filters.excludeKeywords}
                        onChange={(e) => handleFilterChange('excludeKeywords', e.target.value)}
                        placeholder="e.g. agency, marketing" 
                        className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                      <button 
                        onClick={() => generateKeywords('exclude')}
                        disabled={isGeneratingExclude || !filters.excludeKeywords.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 disabled:opacity-50" 
                        title="Generate with Gemini AI"
                      >
                        {isGeneratingExclude ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location Accordion */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <button 
                onClick={() => toggleFilter('Location')}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  Location
                </div>
                {expandedFilters['Location'] ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              
              {expandedFilters['Location'] && (
                <div className="p-4 space-y-4 border-t border-gray-100">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Countries to include</label>
                    <div className="relative">
                      <select 
                        value={filters.includedCountries}
                        onChange={(e) => handleFilterChange('includedCountries', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. United States, Canada</option>
                        {Country.getAllCountries().map(c => (
                          <option key={`inc-${c.isoCode}`} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Countries to exclude</label>
                    <div className="relative">
                      <select 
                        value={filters.excludedCountries}
                        onChange={(e) => handleFilterChange('excludedCountries', e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled hidden>e.g. France, Spain</option>
                        {Country.getAllCountries().map(c => (
                          <option key={`exc-${c.isoCode}`} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Cities or states to include</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        list="states-list"
                        value={filters.includedLocations}
                        onChange={(e) => handleFilterChange('includedLocations', e.target.value)}
                        placeholder="e.g. New York" 
                        className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Cities or states to exclude</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        list="states-list"
                        value={filters.excludedLocations}
                        onChange={(e) => handleFilterChange('excludedLocations', e.target.value)}
                        placeholder="e.g. San Francisco" 
                        className="w-full border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                      />
                      <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <datalist id="states-list">
                    {State.getStatesOfCountry('US').map(s => (
                      <option key={`us-${s.isoCode}`} value={s.name} />
                    ))}
                    {State.getStatesOfCountry('CA').map(s => (
                      <option key={`ca-${s.isoCode}`} value={s.name} />
                    ))}
                    {State.getStatesOfCountry('GB').map(s => (
                      <option key={`gb-${s.isoCode}`} value={s.name} />
                    ))}
                    {State.getStatesOfCountry('AU').map(s => (
                      <option key={`au-${s.isoCode}`} value={s.name} />
                    ))}
                  </datalist>
                </div>
              )}
            </div>

            {/* Data Sources Accordion */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <button 
                onClick={() => toggleFilter('Data Sources')}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-500" />
                  Data Sources
                </div>
                {expandedFilters['Data Sources'] ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              
              {expandedFilters['Data Sources'] && (
                <div className="p-4 space-y-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Select sources to pull data from:</p>
                  {['Apollo.io', 'Clearbit', 'ZoomInfo', 'LinkedIn', 'Hunter.io', 'Dropcontact', 'Lusha', ...customIntegrations].map(source => (
                    <label key={source} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filters.dataSources.includes(source)}
                        onChange={() => toggleDataSource(source)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                      />
                      <span className="text-[13px] text-gray-700">{source}</span>
                    </label>
                  ))}
                  <button 
                    onClick={() => setIsAddIntegrationModalOpen(true)}
                    className="flex items-center gap-1.5 text-[13px] text-blue-600 font-medium hover:text-blue-700 mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    Add API Integration
                  </button>
                </div>
              )}
            </div>

            {/* Other Accordions (Collapsed) */}
            {['Exclude companies', 'Lookalike companies', 'Products & services', 'AI filters', 'Limit results'].map((filter) => (
              <button key={filter} className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  {filter}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Center - Table */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
            <span className="font-medium text-gray-900">Preview</span>
            <button 
              onClick={() => setIsAiOpen(!isAiOpen)}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100"
            >
              <Sparkles className="w-4 h-4" />
              Chat with WASAIBI
            </button>
          </div>
          <div className="flex-1 overflow-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-sm font-medium text-gray-700">Fetching live data...</p>
                </div>
              </div>
            )}
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 sticky top-0 border-b border-gray-200 z-0">
                <tr>
                  <th className="px-4 py-2 font-medium w-12 border-r border-gray-200">#</th>
                  <th className="px-4 py-2 font-medium border-r border-gray-200">
                    <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Name</div>
                  </th>
                  {type === 'companies' ? (
                    <>
                      <th className="px-4 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Description</div>
                      </th>
                      <th className="px-4 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Primary Industry</div>
                      </th>
                      <th className="px-4 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Size</div>
                      </th>
                      <th className="px-4 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Revenue</div>
                      </th>
                      <th className="px-4 py-2 font-medium">
                        <div className="flex items-center gap-1"><Globe className="w-4 h-4 text-gray-400" /> Location</div>
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-1"><Building2 className="w-4 h-4 text-gray-400" /> Company</div>
                      </th>
                      <th className="px-4 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-gray-400" /> Title</div>
                      </th>
                      <th className="px-4 py-2 font-medium border-r border-gray-200">
                        <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Industry</div>
                      </th>
                      <th className="px-4 py-2 font-medium">
                        <div className="flex items-center gap-1"><Globe className="w-4 h-4 text-gray-400" /> Location</div>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-500 border-r border-gray-100">{idx + 1}</td>
                    <td className="px-4 py-2 text-gray-900 border-r border-gray-100 font-medium">{item.name}</td>
                    {type === 'companies' ? (
                      <>
                        <td className="px-4 py-2 text-gray-600 border-r border-gray-100 truncate max-w-[300px]">{item.desc}</td>
                        <td className="px-4 py-2 text-gray-600 border-r border-gray-100">{item.industry}</td>
                        <td className="px-4 py-2 text-gray-600 border-r border-gray-100">{item.size}</td>
                        <td className="px-4 py-2 text-gray-600 border-r border-gray-100">{item.revenue}</td>
                        <td className="px-4 py-2 text-gray-600">{item.location}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 text-gray-600 border-r border-gray-100">{item.company}</td>
                        <td className="px-4 py-2 text-gray-600 border-r border-gray-100">{item.title}</td>
                        <td className="px-4 py-2 text-gray-600 border-r border-gray-100">{item.industry}</td>
                        <td className="px-4 py-2 text-gray-600">{item.location}</td>
                      </>
                    )}
                  </tr>
                ))}
                {results.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={type === 'companies' ? 7 : 5} className="px-4 py-12 text-center text-gray-500">
                      No results found matching your criteria. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="h-12 border-t border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
            <span className="text-sm text-gray-500">Showing {results.length} of {totalResults.toLocaleString()} results</span>
            <div className="relative">
              <button 
                onClick={() => setIsContinueMenuOpen(!isContinueMenuOpen)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                Continue <ChevronDown className="w-4 h-4" />
              </button>
              
              {isContinueMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsContinueMenuOpen(false)}></div>
                  <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <button 
                      onClick={() => {
                        setIsContinueMenuOpen(false);
                        setIsEnrichmentViewOpen(true);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex flex-col gap-1 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-2 font-medium text-gray-900 text-sm">
                        <Database className="w-4 h-4 text-gray-500" />
                        Save to new workbook and table
                      </div>
                      <span className="text-xs text-gray-500 pl-6">100 results will be imported based on your plan limit.</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsContinueMenuOpen(false);
                        setIsSelectTableModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-900 text-sm"
                    >
                      <FileText className="w-4 h-4 text-gray-500" />
                      Save to existing table
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - AI Assistant */}
        {isAiOpen && (
          <div className="w-[350px] border-l border-gray-200 bg-white flex flex-col shrink-0">
            <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2 font-medium text-gray-900">
                WASAIBI <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Beta</span>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="text-gray-400 hover:text-gray-600">
                <ChevronUp className="w-4 h-4 rotate-90" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end space-y-6">
              <div className="space-y-2">
                <p className="text-gray-800 font-medium">I'm WASAIBI, your AI assistant.</p>
                <p className="text-gray-600 text-sm">Tell me what you're looking for and I'll help configure your filters and pull data from Apollo, Clearbit, ZoomInfo, LinkedIn, Hunter, Dropcontact, and Lusha.</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Here are some examples of what I can do. Add your <button onClick={() => navigate('/ai-context')} className="text-blue-600 hover:underline">business context</button> to get personalized suggestions.
                </p>
                
                <button 
                  onClick={() => {
                    setAiInput("Find all software companies with 11-500 employees");
                    handleAiSubmit("Find all software companies with 11-500 employees");
                  }}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors flex gap-3 group"
                >
                  <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 mt-1">Find all software companies with 11-500 employees</span>
                </button>

                <button 
                  onClick={() => {
                    setAiInput("Find companies in APAC with over $1M in revenue");
                    handleAiSubmit("Find companies in APAC with over $1M in revenue");
                  }}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors flex gap-3 group"
                >
                  <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 mt-1">Find companies in APAC with over $1M in revenue</span>
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                  placeholder="What are you looking for?" 
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  onClick={handleAiSubmit}
                  disabled={!aiInput.trim() || isLoading}
                  className="absolute inset-y-1.5 right-1.5 w-7 h-7 bg-blue-400 text-white rounded flex items-center justify-center hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-bold">↑</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Select Table Modal */}
      {isSelectTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <FileText className="w-5 h-5" />
                Select table
              </div>
              <button 
                onClick={() => setIsSelectTableModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-200 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <button 
                onClick={() => setIsCreateTableModalOpen(true)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">WASAIBI Starter Table</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
              <button 
                onClick={() => {
                  setIsSelectTableModalOpen(false);
                  setIsCreateTableModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Select table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrichment View */}
      {isEnrichmentViewOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
              <span className="font-semibold text-gray-900">Enrich Companies</span>
            </div>
            <button 
              onClick={() => setIsEnrichmentViewOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-80 border-r border-gray-200 bg-white flex flex-col shrink-0">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-1">Select enrichments</h2>
                <p className="text-sm text-gray-500">Here you can begin to utilize AI and enrichments from WASAIBI's 100+ different providers.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Suggested</div>
                
                <div className="space-y-1">
                  <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-gray-300 group-hover:border-gray-400 rounded" />
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Enrich Company</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                      <Database className="w-3 h-3" /> 1 / row
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-gray-300 group-hover:border-gray-400 rounded" />
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-700">Research company ICP with AI</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                      <Database className="w-3 h-3" /> 0.1 / row
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-gray-300 group-hover:border-gray-400 rounded" />
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">News</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">+1</span>
                      <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                        <Database className="w-3 h-3" /> ~1 / row
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-gray-300 group-hover:border-gray-400 rounded" />
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Latest Funding</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">+2</span>
                      <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                        <Database className="w-3 h-3" /> ~5.7 / row
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-gray-300 group-hover:border-gray-400 rounded" />
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Job Openings</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">+2</span>
                      <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                        <Database className="w-3 h-3" /> ~1 / row
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-gray-300 group-hover:border-gray-400 rounded" />
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Competitors</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">+1</span>
                      <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                        <Database className="w-3 h-3" /> ~5 / row
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                <button 
                  onClick={() => {
                    setIsEnrichmentViewOpen(false);
                    setIsCreateTableModalOpen(true);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Create table
                </button>
              </div>
            </div>

            {/* Right Content - Preview Table */}
            <div className="flex-1 bg-gray-50 overflow-auto p-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <span className="font-medium text-gray-900">Preview</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2 font-medium w-12 border-r border-gray-200">#</th>
                        <th className="px-4 py-2 font-medium border-r border-gray-200">
                          <div className="flex items-center gap-1"><Building2 className="w-4 h-4 text-gray-400" /> Find companies</div>
                        </th>
                        <th className="px-4 py-2 font-medium border-r border-gray-200">
                          <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Name</div>
                        </th>
                        <th className="px-4 py-2 font-medium border-r border-gray-200">
                          <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Description</div>
                        </th>
                        <th className="px-4 py-2 font-medium border-r border-gray-200">
                          <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Primary Industry</div>
                        </th>
                        <th className="px-4 py-2 font-medium border-r border-gray-200">
                          <div className="flex items-center gap-1"><CheckSquare className="w-4 h-4 text-gray-400" /> Size</div>
                        </th>
                        <th className="px-4 py-2 font-medium">
                          <div className="flex items-center gap-1"><span className="text-gray-400">T</span> Type</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.slice(0, 5).map((company, idx) => (
                        <tr key={company.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-500 border-r border-gray-100">{idx + 1}</td>
                          <td className="px-4 py-2 border-r border-gray-100">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              {company.name}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-gray-900 border-r border-gray-100">{company.name}</td>
                          <td className="px-4 py-2 text-gray-600 border-r border-gray-100 truncate max-w-[200px]">{company.desc || '-'}</td>
                          <td className="px-4 py-2 text-gray-600 border-r border-gray-100">{company.industry || '-'}</td>
                          <td className="px-4 py-2 border-r border-gray-100">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                              {company.size || '-'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600">Privately Held</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add API Integration Modal */}
      {isAddIntegrationModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <Settings2 className="w-5 h-5" />
                Add API Integration
              </div>
              <button 
                onClick={() => setIsAddIntegrationModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Integration Name</label>
                <input 
                  type="text" 
                  value={newIntegrationName}
                  onChange={(e) => setNewIntegrationName(e.target.value)}
                  placeholder="e.g. Custom CRM, Internal DB" 
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input 
                  type="password" 
                  value={newIntegrationKey}
                  onChange={(e) => setNewIntegrationKey(e.target.value)}
                  placeholder="Enter your API key" 
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1.5">Your API key is encrypted and stored securely.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsAddIntegrationModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddIntegration}
                disabled={!newIntegrationName.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <Database className="w-5 h-5" />
                Import / Upload Data
              </div>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <Database className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">CSV, XLS, or XLSX (max 50MB)</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsImportModalOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {isCreditsModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">C</span>
                Credits Usage
              </div>
              <button 
                onClick={() => setIsCreditsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Available Credits</span>
                  <span className="text-lg font-bold text-gray-900">4,250</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Resets on Oct 1, 2026</p>
              </div>
              <button 
                onClick={() => {
                  setIsCreditsModalOpen(false);
                  navigate('/settings');
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Save Search Modal */}
      {isSaveSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <Search className="w-5 h-5" />
                Save Search
              </div>
              <button 
                onClick={() => setIsSaveSearchModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Q3 Tech Leads" 
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsSaveSearchModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsSaveSearchModalOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Table Modal */}
      {isCreateTableModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <Database className="w-5 h-5" />
                Table Created Successfully
              </div>
              <button 
                onClick={() => setIsCreateTableModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your table is ready!</h3>
              <p className="text-sm text-gray-500">The selected leads have been saved to your table.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-center shrink-0">
              <button 
                onClick={() => setIsCreateTableModalOpen(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
