import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Briefcase, Settings, X } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/leads', icon: UserPlus, label: 'Leads' },
  { to: '/deals', icon: Briefcase, label: 'Deals' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebarCRM({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-sidebar flex flex-col border-r border-sidebar-border transition-transform duration-200 
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div className="flex items-center justify-between h-14 px-5 border-b border-sidebar-border">
        <span className="text-lg font-bold text-sidebar-primary">CRM Pro</span>
        <button onClick={onClose} className="lg:hidden text-sidebar-foreground hover:text-sidebar-accent-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
