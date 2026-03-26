import React, { useState } from 'react';
import { X, MessageCircleQuestion, ExternalLink, Home, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpSupportWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

export default function HelpSupportWidget({ isOpen, onClose, userName = "Natoshi" }: HelpSupportWidgetProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'messages'>('home');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          style={{ height: '600px', maxHeight: 'calc(100vh - 48px)' }}
        >
          {/* Header */}
          <div className="relative bg-[#0b3b60] text-white p-6 pb-8 shrink-0 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-400/20 to-transparent rounded-full blur-2xl transform translate-x-1/4 translate-y-1/4"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex -space-x-2 mb-6">
              <img className="w-10 h-10 rounded-full border-2 border-[#0b3b60]" src="https://i.pravatar.cc/150?u=1" alt="Team member" />
              <img className="w-10 h-10 rounded-full border-2 border-[#0b3b60]" src="https://i.pravatar.cc/150?u=2" alt="Team member" />
              <img className="w-10 h-10 rounded-full border-2 border-[#0b3b60]" src="https://i.pravatar.cc/150?u=3" alt="Team member" />
            </div>

            <h2 className="text-xl font-medium text-white/90 mb-1">Hi {userName} 👋</h2>
            <h1 className="text-3xl font-semibold">How can we help?</h1>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
            {activeTab === 'home' ? (
              <>
                <button className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left group flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Ask a question</div>
                    <div className="text-sm text-gray-500">AI Agent and team can help</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <MessageCircleQuestion className="w-5 h-5" />
                  </div>
                </button>

                <a href="#" className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left group flex items-center justify-between">
                  <div className="font-medium text-gray-900">Learn more at WASAIBI University</div>
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                </a>

                <a href="#" className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left group flex items-center justify-between">
                  <div className="font-medium text-gray-900">Join the Slack Community</div>
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                </a>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-sm text-gray-500">Messages from the team will appear here.</p>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="bg-white border-t border-gray-200 flex shrink-0">
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex-1 py-4 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Home className={`w-5 h-5 ${activeTab === 'home' ? 'fill-current' : ''}`} />
              Home
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-4 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${activeTab === 'messages' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <MessageSquare className={`w-5 h-5 ${activeTab === 'messages' ? 'fill-current' : ''}`} />
              Messages
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
