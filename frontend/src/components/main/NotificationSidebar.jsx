import React from 'react';
import { useNotifications } from './NotificationContext';
import { X, Bell } from 'lucide-react';

export default function NotificationSidebar({ open, onClose }) {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
          <Bell size={22} /> Notifications
        </div>
        <button onClick={onClose} className="hover:bg-gray-100 rounded p-1"><X size={22} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-gray-400">
            <Bell size={48} />
            <span className="mt-2">No notifications</span>
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map(n => (
              <li key={n.id} className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded shadow-sm">
                <div className="font-medium text-blue-800">{n.text}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(n.id).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {notifications.length > 0 && (
        <button onClick={clearNotifications} className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-b">Clear All</button>
      )}
    </div>
  );
} 