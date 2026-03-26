import React, { useState } from 'react';
import { BrainCircuit, Save, Check } from 'lucide-react';

export default function AiContext() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">AI Context</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the context and instructions for your AI agents.</p>
        </div>
        <div className="flex items-center gap-4">
          {isSaved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Check className="w-4 h-4" />
              Context saved
            </span>
          )}
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Context
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Company Description</label>
              <p className="text-sm text-gray-500 mb-2">What does your company do? What products or services do you offer?</p>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="e.g., We provide AI-powered sales automation tools for B2B SaaS companies..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Value Proposition</label>
              <p className="text-sm text-gray-500 mb-2">What makes your offering unique? Why should customers choose you?</p>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="e.g., Our platform reduces manual data entry by 80% and increases meeting booking rates by 2x..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Target Audience</label>
              <p className="text-sm text-gray-500 mb-2">Who are your ideal customers? What are their pain points?</p>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="e.g., VP of Sales and RevOps leaders at mid-market B2B software companies struggling with pipeline generation..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
