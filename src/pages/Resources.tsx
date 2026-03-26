import React from 'react';
import { BookOpen, Video, Users, HelpCircle, ExternalLink } from 'lucide-react';

export default function Resources() {
  const resources = [
    {
      title: 'Documentation',
      description: 'Detailed guides and API references for WASAIBI.',
      icon: BookOpen,
      link: '#',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides to help you get started.',
      icon: Video,
      link: '#',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users, share tips, and get help.',
      icon: Users,
      link: '#',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Help Center',
      description: 'Browse FAQs and contact our support team.',
      icon: HelpCircle,
      link: '#',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Resources</h1>
          <p className="text-sm text-gray-500 mt-1">Access guides, documentation, and support.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <a 
              key={index}
              href={resource.link}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group flex items-start gap-4"
            >
              <div className={`p-3 rounded-lg shrink-0 ${resource.bgColor} ${resource.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  {resource.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-gray-500">{resource.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
