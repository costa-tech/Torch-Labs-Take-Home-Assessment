import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import Header from '../components/layout/Header';
import {
  Users, UserPlus, UserCheck, Trophy, XCircle, DollarSign,
  TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatusBadge from '../components/ui/StatusBadge';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'New Leads', value: stats?.newLeads || 0, icon: UserPlus, color: 'from-indigo-500 to-indigo-600' },
    { label: 'Qualified', value: stats?.qualifiedLeads || 0, icon: UserCheck, color: 'from-amber-500 to-amber-600' },
    { label: 'Won Deals', value: stats?.wonLeads || 0, icon: Trophy, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Lost Deals', value: stats?.lostLeads || 0, icon: XCircle, color: 'from-red-500 to-red-600' },
    { label: 'Total Pipeline', value: formatCurrency(stats?.totalDealValue || 0), icon: DollarSign, color: 'from-purple-500 to-purple-600', isLarge: true },
    { label: 'Won Revenue', value: formatCurrency(stats?.wonDealValue || 0), icon: TrendingUp, color: 'from-emerald-500 to-teal-600', isLarge: true },
    { label: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, icon: BarChart3, color: 'from-cyan-500 to-blue-600' },
  ];

  const SOURCE_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#f97316'];

  const sourceData = stats?.sourceBreakdown
    ? Object.entries(stats.sourceBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Overview of your sales pipeline and performance"
      />

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="glass-light rounded-2xl p-5 hover:border-primary-500/20 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                <card.icon size={18} className="text-white" />
              </div>
            </div>
            <p className={`${card.isLarge ? 'text-xl' : 'text-2xl'} font-bold text-white tracking-tight`}>{card.value}</p>
            <p className="text-xs text-surface-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pipeline Bar Chart */}
        <div className="lg:col-span-2 glass-light rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-surface-200 mb-4">Sales Pipeline</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.pipeline || []} barRadius={[6, 6, 0, 0]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="stage" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Leads">
                  {(stats?.pipeline || []).map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Pie Chart */}
        <div className="glass-light rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-surface-200 mb-4">Lead Sources</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={index} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="glass-light rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-surface-200 mb-4">Recent Leads</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-surface-400 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Company</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Deal Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/50">
              {(stats?.recentLeads || []).map((lead, i) => (
                <tr key={i} className="hover:bg-surface-800/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-surface-200">{lead.name}</td>
                  <td className="py-3 px-4 text-surface-400">{lead.company}</td>
                  <td className="py-3 px-4"><StatusBadge status={lead.status} size="sm" /></td>
                  <td className="py-3 px-4 text-right text-surface-300">{formatCurrency(lead.dealValue || 0)}</td>
                </tr>
              ))}
              {(!stats?.recentLeads || stats.recentLeads.length === 0) && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-surface-500">No leads yet. Create your first lead!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
