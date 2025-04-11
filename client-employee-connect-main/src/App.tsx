
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Clients from "./pages/Clients";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
// Import des pages de services
import Hotel from "./pages/services/Hotel";
import Restaurant from "./pages/services/Restaurant";
import Conferences from "./pages/services/Conferences";
import Events from "./pages/services/Events";
import Water from "./pages/services/Water";
import { Sidebar } from "./components/Sidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(
    // Par défaut, le sidebar est fermé sur mobile et ouvert sur desktop
    window.innerWidth > 768
  );

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-auto p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/index" element={<Navigate to="/" replace />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/attendance" element={<Attendance />} />
                {/* Routes pour les services */}
                <Route path="/services/hotel" element={<Hotel />} />
                <Route path="/services/restaurant" element={<Restaurant />} />
                <Route path="/services/conferences" element={<Conferences />} />
                <Route path="/services/events" element={<Events />} />
                <Route path="/services/water" element={<Water />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
