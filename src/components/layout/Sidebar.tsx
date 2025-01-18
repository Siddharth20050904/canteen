"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, MessageSquare, Settings, Lightbulb, BookOpenText, CalendarSearch, PieChartIcon as ChartPie, BarChartBigIcon as ChartColumnBig, SquarePen } from 'lucide-react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  setIsOpenAction: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpenAction }) => {
  const [userType, setUserType] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUserType = async () => {
      const session = await getSession();
      const type = session?.user?.userType || '';
      setUserType(type);
    };

    fetchUserType();
  }, []);

  // All Routes
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Calendar, label: 'Attendance', href: '/attendance' },
    { icon: MessageSquare, label: 'Feedback', href: '/feedback' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Lightbulb, label: 'Suggestions', href: '/suggestions' },
    { icon: CalendarSearch, label: 'Weekly Menu', href: '/weekly-menu' },
    { icon: BookOpenText, label: 'Review Suggestions', href: '/review-suggestion' },
    { icon: ChartPie, label: 'Feedback Analysis', href: '/feedback-analysis' },
    { icon: ChartColumnBig, label: 'Attendance Stats', href: '/attendance-stats' },
  ];

  if (userType === 'admin') {
    menuItems.push({ icon: SquarePen, label: 'Menu Management', href: '/menu-management' });
  }

  const handleNavigation = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpenAction(false);
    router.push(href);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpenAction(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r
          transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg
                ${pathname === item.href
                  ? 'bg-gray-300 text-black'
                  : 'hover:bg-gray-100'
                }
              `}
              onClick={handleNavigation(item.href)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
