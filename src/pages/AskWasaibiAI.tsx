import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

interface PromptItem {
  emoji: string;
  text: string;
}

interface PromptSection {
  category: string;
  items: PromptItem[];
}

const promptLibrary: PromptSection[] = [
  {
    category: 'DEALS',
    items: [
      { emoji: '\uD83D\uDCCA', text: 'Summarize my pipeline' },
      { emoji: '\uD83D\uDCCB', text: 'Show me all my deals' },
      { emoji: '\uD83D\uDDC2\uFE0F', text: 'Deals by sector' },
      { emoji: '\uD83C\uDF0E', text: 'Deals by geography' },
      { emoji: '\uD83D\uDD52', text: 'Recent deals' },
    ],
  },
  {
    category: 'PRIORITIES & URGENCY',
    items: [
      { emoji: '\u26A0\uFE0F', text: 'What needs my attention?' },
      { emoji: '\uD83D\uDEA8', text: 'Which deals are urgent?' },
      { emoji: '\uD83D\uDD25', text: 'Hot deals - high priority only' },
      { emoji: '\uD83C\uDFC1', text: 'Deals expiring soon' },
      { emoji: '\uD83D\uDCDD', text: 'EL signing pending' },
    ],
  },
  {
    category: 'SPACS',
    items: [
      { emoji: '\uD83D\uDCC8', text: 'Best SPACs by volume' },
      { emoji: '\uD83D\uDCB0', text: 'SPACs with most cash in hand' },
      { emoji: '\uD83C\uDFAF', text: 'Top SPAC matches for my deals' },
      { emoji: '\uD83C\uDFDB\uFE0F', text: 'SPACs by sector' },
      { emoji: '\u23F3', text: 'SPACs nearing deadline' },
    ],
  },
  {
    category: 'REVENUE & FEES',
    items: [
      { emoji: '\uD83D\uDCB5', text: 'Revenue forecast' },
      { emoji: '\uD83D\uDCC9', text: 'Fee summary by deal' },
      { emoji: '\uD83D\uDCB3', text: 'Outstanding invoices' },
    ],
  },
];

export default function AskWasaibiAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'Summarize my pipeline': 'You currently have 24 active deals in your pipeline worth a combined $1.2B. 8 deals are in the origination phase, 10 are under due diligence, and 6 are in closing. Top sectors include Technology (40%), Healthcare (25%), and Financial Services (20%).',
        'Show me all my deals': 'Here are your active deals:\n\n1. **TechVision AI** - Series C - $150M - Due Diligence\n2. **CloudScale Inc** - M&A Advisory - $320M - Closing\n3. **FinEdge Capital** - SPAC Merger - $500M - Origination\n4. **DataFlow Systems** - Series B - $80M - Due Diligence\n5. **Quantum Labs** - Strategic Sale - $200M - Under LOI\n\n...and 19 more deals.',
        'What needs my attention?': 'Three items need your immediate attention:\n\n1. **CloudScale Inc** - Client response overdue by 3 days on revised terms\n2. **FinEdge Capital** - Board meeting scheduled tomorrow, deck not finalized\n3. **DataFlow Systems** - Due diligence documents expiring in 48 hours',
        'Which deals are urgent?': 'Two deals are flagged as urgent:\n\n1. **CloudScale Inc** (M&A) - Exclusivity period expires in 5 days\n2. **FinEdge Capital** (SPAC) - SPAC deadline approaching in 2 weeks, shareholder vote pending',
        'Best SPACs by volume': 'Top SPACs by trust value:\n\n1. **Atlas Crest II** - $450M trust - Technology focused\n2. **Gores Holdings IX** - $400M trust - Multi-sector\n3. **Churchill Capital VIII** - $350M trust - Healthcare\n4. **Ajax Financial** - $300M trust - Fintech\n5. **Replay Acquisition** - $275M trust - Media & Entertainment',
      };

      const aiContent = responses[text] || `I can help you with that! Based on your query "${text}", let me analyze your current deal pipeline and provide relevant insights. Your portfolio shows strong activity across multiple sectors with several high-priority opportunities that warrant attention.`;

      const aiMsg: Message = { id: Date.now() + 1, role: 'assistant', content: aiContent };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Ask WASAIBI</h1>
          <p className="text-sm text-gray-500 mt-0.5">Get insights on your deals, pipeline, and more. Ask in plain English.</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h2>
              <p className="text-sm text-gray-500 max-w-md">
                Ask anything about deals, SPACs, pipeline analytics, and priorities.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">
              {/* Chat header bar */}
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Wasabi AI</span>
                </div>
                <span className="text-xs text-gray-400">Powered by Wasabi</span>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-800 border border-gray-100'
                    }`}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line.split('**').map((part, j) =>
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 px-8 py-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your deals..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Prompt Library Sidebar */}
      <div className="w-80 border-l border-gray-200 bg-[#fbfbfa] overflow-y-auto hidden lg:block">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Prompt Library</h3>
          </div>
          <p className="text-xs text-gray-500 mb-6">Click any prompt to start a conversation.</p>

          <div className="space-y-6">
            {promptLibrary.map(section => (
              <div key={section.category}>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.category}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(item.text)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-white hover:shadow-sm transition-all text-left group"
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span className="group-hover:text-gray-900">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
