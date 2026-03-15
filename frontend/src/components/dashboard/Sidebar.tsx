import { NavLink, useNavigate } from 'react-router-dom';
import { X, LayoutDashboard, Receipt, Users, Package, Truck, Wallet, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { useDashboardStore } from '../../state/dashboardStore';

interface SidebarProps {
  onClose?: () => void;
}

const NAV = [
  { name: 'Dashboard',  href: '/dashboard',   icon: LayoutDashboard },
  { name: 'Billing',    href: '/billing',      icon: Receipt },
  { name: 'Customers',  href: '/customers',    icon: Users },
  { name: 'Inventory',  href: '/inventory',    icon: Package },
  { name: 'Vendors',    href: '/vendors',      icon: Truck },
  { name: 'Expenses',   href: '/expenses',     icon: Wallet },
  { name: 'Reports',    href: '/reports',      icon: BarChart3 },
  { name: 'Settings',   href: '/settings',     icon: Settings },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { lowStockCount } = useDashboardStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-navy-700 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red flex items-center justify-center font-extrabold text-white text-xs tracking-wider shadow-md shadow-red/25">
            CA
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white leading-none block">CAR ADDA</span>
            <span className="text-[10px] text-muted leading-none">Management System</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-muted hover:text-white hover:bg-navy-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-muted/60 uppercase tracking-widest px-3 mb-3">
          Main Menu
        </p>
        {NAV.map(({ name, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            onClick={onClose}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150 group
               ${isActive
                 ? 'bg-red/10 text-red border border-red/20'
                 : 'text-muted hover:bg-navy-700 hover:text-white border border-transparent'
               }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-red' : 'text-muted group-hover:text-white transition-colors'}`} />
                <span>{name}</span>
                {/* Low stock badge on Inventory */}
                {name === 'Inventory' && lowStockCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                                   rounded-full bg-warning/20 text-warning text-[10px] font-bold">
                    {lowStockCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-navy-700 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-navy-900/60 border border-navy-700/60">
          <div className="w-8 h-8 rounded-full bg-red/10 border border-red/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-red">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-tight truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-muted text-xs leading-tight truncate capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-muted hover:text-red hover:bg-red/10 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
