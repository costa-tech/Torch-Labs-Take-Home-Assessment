import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
  ];

  return (
    <aside className="fixed bottom-0 md:top-0 left-0 w-full md:w-64 h-[72px] md:h-screen bg-surface-900/95 md:bg-surface-900/80 backdrop-blur-xl border-t md:border-t-0 md:border-r border-surface-800 flex md:flex-col z-40">
      {/* Logo */}
      <div className="hidden md:block px-6 py-5 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 shadow-lg shadow-primary-600/20">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">TorchCRM</h1>
            <p className="text-[10px] text-surface-500 uppercase tracking-widest">Lead Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex md:flex-col justify-around md:justify-start px-2 md:px-3 py-2 md:py-4 space-x-2 md:space-x-0 md:space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 flex-1 md:flex-none px-2 md:px-4 py-2 md:py-2.5 rounded-xl text-[10px] md:text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600/15 text-primary-400 border border-primary-500/20'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 border border-transparent'
              }`
            }
          >
            <item.icon size={20} className="md:w-[18px] md:h-[18px] transition-transform group-hover:scale-110" />
            <span className="mt-0.5 md:mt-0">{item.label}</span>
          </NavLink>
        ))}
        {/* Mobile Logout */}
        <button
          onClick={logout}
          className="md:hidden flex flex-col items-center justify-center gap-1 flex-1 px-2 py-2 rounded-xl text-[10px] font-medium text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer border border-transparent"
        >
          <LogOut size={20} />
          <span className="mt-0.5">Sign Out</span>
        </button>
      </nav>

      {/* Desktop Logout */}
      <div className="hidden md:block px-3 pb-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
