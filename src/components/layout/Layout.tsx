"use client";
import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import  { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  noLayout?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, noLayout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const getUserType = async () => {
    const session = await getSession();
    const userId = session?.user.id || ''; // Replace with the actual user ID
    if(!userId && (pathname !== '/login' && pathname !== '/register' && !pathname?.match(/^\/verification\/.*/))) {
      router.push('/login');
    }
  };

  getUserType();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuButton = (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
    >
      <Menu className="w-6 h-6" />
    </button>
  );

  if (noLayout) {
    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <div>{children}</div>
      </div>
      )// Return only the children without layout elements
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Header menuButton={menuButton} />
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpenAction={setIsMobileOpen} />
      <main className="lg:ml-64 pt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};