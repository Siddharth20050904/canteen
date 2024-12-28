import React from 'react';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  menuButton?: React.ReactNode;  // Make it optional
}

export const Header: React.FC<HeaderProps> = ({ menuButton }) => {

  return (
    <header className="fixed top-0 right-0 left-0 bg-white border-b h-16 z-50">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-2">
          {menuButton}  {/* Render menu button if provided */}
          <h1 className="text-xl font-semibold">Mess Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};