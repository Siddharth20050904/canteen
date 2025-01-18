"use client";
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  noLayout?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, noLayout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const getUserType = async () => {
      const session = await getSession();
      const userId = session?.user.id || '';
      if (!userId && (pathname !== '/login' && pathname !== '/register' && !pathname?.match(/^\/verification\/.*/) && pathname !== '/forgot-password' && !pathname?.match(/^\/reset-password\/.*/))) {
        router.push('/login');
      }
    };
    getUserType();
  }, [pathname, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuButton = (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-lg hover:bg-gray-100"
    >
      <Menu className="w-6 h-6" />
    </button>
  );

  if (noLayout) {
    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header menuButton={menuButton} />
      <Sidebar isOpen={isSidebarOpen} setIsOpenAction={setIsSidebarOpen} />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

