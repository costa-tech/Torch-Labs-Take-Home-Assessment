import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-surface-950">
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
