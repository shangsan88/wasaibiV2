import React, { useState } from 'react';
import { Download, FileText, X } from 'lucide-react';

export default function Exports() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exports = [
    { id: 1, name: 'Q3 Leads.csv', date: 'Oct 12, 2026', size: '2.4 MB', status: 'Completed' },
    { id: 2, name: 'Tech Companies.xlsx', date: 'Oct 10, 2026', size: '1.1 MB', status: 'Completed' },
    { id: 3, name: 'Recent Signups.csv', date: 'Oct 08, 2026', size: '450 KB', status: 'Failed' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Exports</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your data exports and downloads.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          New Export
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">File Name</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Size</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exports.map(exp => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{exp.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{exp.date}</td>
                <td className="px-6 py-4 text-gray-600">{exp.size}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    exp.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    disabled={exp.status !== 'Completed'}
                    className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                New Export
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center text-gray-500">
              Export functionality is coming soon.
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
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
