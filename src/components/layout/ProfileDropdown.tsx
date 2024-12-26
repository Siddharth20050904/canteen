"use client";
import { User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <span>{session?.user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border">
          <div className="p-2">
            <a href="/profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </a>
            <a href="/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </a>
            <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-red-600" onClick={() => signOut()}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
