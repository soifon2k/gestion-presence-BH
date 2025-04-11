
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useState } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      {title && (
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
      )}
      {children}
    </div>
  );
};

export default MainLayout;
