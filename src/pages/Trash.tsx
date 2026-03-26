import React, { useState } from 'react';
import { Trash2, FileText, X } from 'lucide-react';

export default function Trash() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trashItems = [
    { id: 1, name: 'Old Campaign Leads', type: 'Table', deletedAt: 'Oct 10, 2026' },
    { id: 2, name: 'Test Search', type: 'Search', deletedAt: 'Oct 05, 2026' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Trash</h1>
          <p className="text-sm text-gray-500 mt-1">Recover or permanently delete items.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Empty Trash
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Deleted At</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trashItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{item.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{item.type}</td>
                <td className="px-6 py-4 text-gray-600">{item.deletedAt}</td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                     Restore
                  </button>
                  <button className="text-red-600 hover:text-red-800 font-medium">
                     Delete Forever
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
                Empty Trash
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-center text-gray-500">
              Are you sure you want to permanently delete all items in the trash? This action cannot be undone.
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
