"use client"
import { Bell } from 'lucide-react';
import { useState } from 'react';

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {/* Notification items */}
            <div className="p-4 border-b hover:bg-gray-50">
              <p className="text-sm">New menu uploaded for next week</p>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};