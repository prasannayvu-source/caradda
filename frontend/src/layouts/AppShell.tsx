import { Outlet } from 'react-router-dom';
import { Menu, RefreshCw } from 'lucide-react';
import { useUIStore } from '../state/uiStore';
import Sidebar from '../components/dashboard/Sidebar';
import { useDashboardStore } from '../state/dashboardStore';

export default function AppShell() {
  const { sidebarOpen, toggleSidebar, closeSidebar } = useUIStore();
  const { fetchDashboard, isLoading } = useDashboardStore();

  return (
    <div className="flex h-screen bg-navy text-white overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="w-64 bg-navy-800 border-r border-navy-700 hidden md:flex md:flex-col shrink-0">
        <Sidebar />
      </aside>

      {/* ── Mobile Drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={closeSidebar}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-navy-800 border-r border-navy-700 flex flex-col z-10 shadow-2xl">
            <Sidebar onClose={closeSidebar} />
          </aside>
        </div>
      )}

      {/* ── Right Panel ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Topbar */}
        <header className="h-16 bg-navy-800 border-b border-navy-700 flex items-center px-4 sm:px-6 shrink-0 z-10">
          {/* Mobile hamburger */}
          <button
            className="md:hidden mr-3 -ml-1 p-2 rounded-lg text-muted hover:text-white hover:bg-navy-700 transition-colors"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Page title slot — auto-filled by Outlet pages via context if needed */}
          <div className="flex-1" />

          {/* Refresh data */}
          <button
            onClick={fetchDashboard}
            disabled={isLoading}
            title="Refresh dashboard data"
            className="p-2 rounded-lg text-muted hover:text-white hover:bg-navy-700 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-navy">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
