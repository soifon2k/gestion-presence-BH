
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  Calendar,
  Hotel,
  Utensils,
  Settings,
  Presentation,
  Droplet,
  LayoutDashboard,
  MenuIcon,
  LogOut
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
    // Fermeture de l'application
    setTimeout(() => window.close(), 1500);
  };

  const menuItems = [
    { title: 'Tableau de Bord', path: '/', icon: LayoutDashboard },
    { title: 'Employés', path: '/employees', icon: Users },
    { title: 'Clients', path: '/clients', icon: Calendar },
    { title: 'Présence', path: '/attendance', icon: Users },
    { 
      title: 'Services', 
      icon: Hotel,
      submenu: [
        { title: 'Hôtel', path: '/services/hotel', icon: Hotel },
        { title: 'Restaurant', path: '/services/restaurant', icon: Utensils },
        { title: 'Conférences', path: '/services/conferences', icon: Presentation },
        { title: 'Évènements', path: '/services/events', icon: Calendar },
        { title: 'Production d\'eau', path: '/services/water', icon: Droplet },
      ]
    },
    { title: 'Paramètres', path: '/settings', icon: Settings },
  ];

  const sidebarClass = `fixed inset-y-0 left-0 z-50 flex flex-col w-64 
                       ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                       transition-transform duration-300 ease-in-out 
                       bg-white shadow-lg md:translate-x-0 md:static md:shadow-none`;

  const overlayClass = `fixed inset-0 z-40 bg-black/50 md:hidden 
                       ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                       transition-opacity duration-300 ease-in-out`;

  return (
    <>
      <button 
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
      >
        <MenuIcon size={24} />
      </button>
      
      <div className={overlayClass} onClick={toggleSidebar}></div>
      
      <aside className={sidebarClass}>
        <div className="p-4 flex items-center border-b bg-white">
          <div className="flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-100 p-2 rounded-full h-10 w-10">
            GP
          </div>
          <span className="ml-2 text-xl font-semibold">GestiPrésence</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={index} className="mb-2">
                {item.submenu ? (
                  <div>
                    <div className="flex items-center px-3 py-2 text-gray-700 rounded-md font-medium bg-white">
                      <item.icon size={20} className="mr-2" />
                      <span>{item.title}</span>
                    </div>
                    <div className="ml-6 mt-1 space-y-1 bg-white">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={`flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 bg-white
                                     ${isActive(subItem.path) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'}`}
                        >
                          <subItem.icon size={16} className="mr-2" />
                          <span>{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 bg-white
                               ${isActive(item.path) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'}`}
                  >
                    <item.icon size={20} className="mr-2" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t bg-white">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md bg-white"
          >
            <LogOut size={20} className="mr-2" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
