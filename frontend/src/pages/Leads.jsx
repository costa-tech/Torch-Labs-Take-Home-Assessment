import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import StatusBadge from '../components/ui/StatusBadge';
import LeadForm from '../components/leads/LeadForm';
import {
  Plus, Search, Filter, Trash2, Edit3, Eye, Download,
  ChevronDown, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', source: '', assignedTo: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLead, setDeletingLead] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (filters.assignedTo) params.assignedTo = filters.assignedTo;
      if (searchTerm) params.search = searchTerm;

      const { data } = await leadsAPI.getAll(params);
      setLeads(data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchLeads(), 300);
    return () => clearTimeout(debounce);
  }, [fetchLeads]);

  const handleDelete = async () => {
    if (!deletingLead) return;
    setDeleteLoading(true);
    try {
      await leadsAPI.delete(deletingLead.id);
      toast.success('Lead deleted successfully');
      setDeletingLead(null);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to delete lead');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      setStatusLoading(leadId);
      await leadsAPI.updateStatus(leadId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusLoading(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingLead) {
        await leadsAPI.update(editingLead.id, formData);
        toast.success('Lead updated successfully');
        setEditingLead(null);
      } else {
        await leadsAPI.create(formData);
        toast.success('Lead created successfully');
        setShowCreateModal(false);
      }
      fetchLeads();
    } catch (error) {
      toast.error(editingLead ? 'Failed to update lead' : 'Failed to create lead');
      throw error;
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error('No leads to export');
      return;
    }

    const headers = ['Name', 'Company', 'Email', 'Phone', 'Source', 'Assigned To', 'Status', 'Deal Value', 'Created'];
    const csvContent = [
      headers.join(','),
      ...leads.map((lead) =>
        [
          `"${lead.name}"`,
          `"${lead.company}"`,
          `"${lead.email}"`,
          `"${lead.phone}"`,
          `"${lead.source}"`,
          `"${lead.assignedTo}"`,
          `"${lead.status}"`,
          lead.dealValue,
          `"${new Date(lead.createdAt).toLocaleDateString()}"`,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Leads exported to CSV');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <Header
        title="Leads"
        subtitle={`${leads.length} lead${leads.length !== 1 ? 's' : ''} in your pipeline`}
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV} className="w-full sm:w-auto">
              Export CSV
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Search & Filter Bar */}
      <div className="glass-light rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
            <input
              id="lead-search"
              type="text"
              placeholder="Search by name, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-800/50 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            size="md"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-3 pt-3 border-t border-surface-700/50 animate-fade-in">
            {/* Status Filter */}
            <div className="relative flex-1">
              <select
                id="filter-status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full appearance-none bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
            </div>

            {/* Source Filter */}
            <div className="relative flex-1">
              <select
                id="filter-source"
                value={filters.source}
                onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                className="w-full appearance-none bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
              >
                <option value="">All Sources</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ status: '', source: '', assignedTo: '' })}
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Leads Table */}
      <div className="glass-light rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
              <Search size={24} className="text-surface-500" />
            </div>
            <h3 className="text-surface-300 font-medium mb-1">No leads found</h3>
            <p className="text-surface-500 text-sm mb-4">
              {searchTerm || activeFilterCount > 0
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first lead'}
            </p>
            {!searchTerm && activeFilterCount === 0 && (
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setShowCreateModal(true)}>
                Add Lead
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-800/30 text-surface-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-3.5 px-5">Lead</th>
                  <th className="text-left py-3.5 px-5">Source</th>
                  <th className="text-left py-3.5 px-5">Status</th>
                  <th className="text-left py-3.5 px-5">Assigned To</th>
                  <th className="text-right py-3.5 px-5">Deal Value</th>
                  <th className="text-left py-3.5 px-5">Created</th>
                  <th className="text-right py-3.5 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/50">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-surface-800/30 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    <td className="py-3.5 px-5">
                      <div>
                        <p className="font-medium text-surface-200 group-hover:text-primary-400 transition-colors">{lead.name}</p>
                        <p className="text-xs text-surface-500">{lead.company} · {lead.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-surface-400 text-xs">{lead.source}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge
                        status={lead.status}
                        size="sm"
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={statusLoading === lead.id}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-surface-400 text-xs">{lead.assignedTo || '—'}</td>
                    <td className="py-3.5 px-5 text-right font-medium text-surface-200">
                      {formatCurrency(lead.dealValue || 0)}
                    </td>
                    <td className="py-3.5 px-5 text-surface-500 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/leads/${lead.id}`); }}
                          className="p-1.5 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-primary-400 transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingLead(lead); }}
                          className="p-1.5 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-amber-400 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeletingLead(lead); }}
                          className="p-1.5 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Lead Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Lead"
        size="lg"
      >
        <LeadForm onSubmit={handleFormSubmit} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
        size="lg"
      >
        {editingLead && (
          <LeadForm
            initialData={editingLead}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditingLead(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Leads;
