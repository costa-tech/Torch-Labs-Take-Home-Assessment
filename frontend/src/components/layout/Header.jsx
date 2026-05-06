import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';

const Header = ({ title, subtitle, actions }) => {
  const { user } = useAuth();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-surface-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {actions}
        <div className="flex items-center gap-3 sm:pl-4 sm:border-l border-surface-700 pt-4 sm:pt-0 border-t sm:border-t-0">
          <div className="p-2 rounded-full bg-primary-600/20">
            <User size={16} className="text-primary-400" />
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm font-medium text-surface-200">{user?.displayName}</p>
            <p className="text-xs text-surface-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
