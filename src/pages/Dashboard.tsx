import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, Plus, Star, FileText, ChevronUp, Users, Building2, Megaphone, Loader2, TrendingUp, Globe, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export default function Dashboard() {
  const navigate = useNavigate();
  const [aiInput, setAiInput] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [marketInsight, setMarketInsight] = useState<string | null>(null);

  const handleAiSearch = async () => {
    if (!aiInput.trim()) return;
    navigate(`/find-leads/companies?q=${encodeURIComponent(aiInput)}`);
  };

  const generateMarketInsight = async () => {
    if (!ai) return;
    setIsGeneratingInsight(true);
    try {
      const prompt = "Provide a brief, professional market insight for a B2B sales professional focusing on tech M&A and venture capital trends in 2026. Keep it under 100 words.";
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setMarketInsight(response.text || null);
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Hey Admin, ready to get started?</h1>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
          Show less <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Search / AI Prompt */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <input 
          type="text" 
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAiSearch();
            }
          }}
          placeholder="Ask me anything about WASAIBI or describe what you'd like to do..." 
          className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <button 
          onClick={handleAiSearch}
          className="absolute inset-y-2 right-2 px-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
        >
          <span className="text-lg font-medium">↑</span>
        </button>
      </div>

      {/* Market Insights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Market Intelligence</h2>
          </div>
          <button 
            onClick={generateMarketInsight}
            disabled={!ai || isGeneratingInsight}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {isGeneratingInsight ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Refresh Insights
          </button>
        </div>
        {marketInsight ? (
          <p className="text-sm text-gray-700 leading-relaxed italic">"{marketInsight}"</p>
        ) : (
          <p className="text-sm text-gray-500">Click refresh to generate real-time market insights powered by Gemini AI.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => navigate('/find-leads/companies')}
          className="p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">Deal Sourcing</h3>
          </div>
          <p className="text-sm text-gray-500">Identify high-potential companies and key decision makers.</p>
        </div>
        
        <div 
          onClick={() => navigate('/find-leads/companies')}
          className="p-5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">Intelligence Lab</h3>
          </div>
          <p className="text-sm text-gray-500">Enrich your data with deep firmographic and technographic insights.</p>
        </div>

        <div 
          onClick={() => navigate('/gtm/campaigns')}
          className="p-5 bg-white border border-gray-200 rounded-xl hover:border-yellow-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Megaphone className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900">Outreach Engine</h3>
          </div>
          <p className="text-sm text-gray-500">Orchestrate automated sales sequences across multiple channels.</p>
        </div>
      </div>

      {/* Files Section */}
      <div className="pt-8">
        <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
          <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">All files</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700">Recents</button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700">Favorites</button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Files</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => navigate('/find-leads/companies')}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-4 text-sm">
            <button className="flex items-center gap-1 text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded">
              Owner: All <ChevronUp className="w-3 h-3 rotate-180" />
            </button>
            <button className="flex items-center gap-1 text-gray-600">
              <Search className="w-3 h-3" /> Filters
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Favorite</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Created at</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 group">
                <td className="px-4 py-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">WASAIBI Starter Table</span>
                </td>
                <td className="px-4 py-3 text-gray-400 hover:text-yellow-400 cursor-pointer">
                  <Star className="w-4 h-4" />
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-gray-500">Mar 14, 2026</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                    AD
                  </div>
                  <span className="text-gray-600">Admin</span>
                </td>
                <td className="px-4 py-3 text-gray-500">Edit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
