"use client";
import { useEffect, useState } from 'react';
import { Home, Calendar, MessageSquare, Settings, Lightbulb, BookOpenText, CalendarSearch, ChartPie, ChartColumnBig, SquarePen } from 'lucide-react';
import { getSession } from 'next-auth/react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpenAction: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpenAction }) => {
  const [userType, setUserType] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserType = async () => {
      const session = await getSession();
      const type = session?.user.userType || ' ';
      setUserType(type);
    };

    fetchUserType();
  }, []);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Attendance', href: '/attendance' },
    { icon: MessageSquare, label: 'Feedback', href: '/feedback' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Lightbulb, label: 'Suggestions', href: '/suggestions' }, // Added Suggestions option
    { icon: CalendarSearch, label: 'Weekly Menu', href: '/weekly-menu' },
    { icon: BookOpenText, label: 'Review Suggestions', href: '/review-suggestion' },
    { icon: ChartPie, label: 'Feedback Analysis', href: '/feedback-analysis' },
    { icon: ChartColumnBig, label: 'Attendance Stats', href: '/attendance-stats' },
  ];

  if (userType === 'admin') {
    menuItems.push({ icon: SquarePen, label: 'Menu Management', href: '/menu-management' });
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpenAction(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpenAction]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpenAction(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r
        transition-transform duration-300 ease-in-out z-50
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileOpenAction(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};
