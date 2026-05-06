import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { leadsAPI, notesAPI } from '../services/api';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import LeadForm from '../components/leads/LeadForm';
import {
  ArrowLeft, Edit3, Mail, Phone, Building2, Globe, User,
  DollarSign, Calendar, Clock, MessageSquare, Send, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statusLoading, setStatusLoading] = useState('');

  useEffect(() => {
    fetchLead();
    fetchNotes();
  }, [id]);

  const fetchLead = async () => {
    try {
      const { data } = await leadsAPI.getOne(id);
      setLead(data);
    } catch (error) {
      toast.error('Failed to load lead');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await notesAPI.getAll(id);
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(newStatus);
    try {
      const { data } = await leadsAPI.updateStatus(id, newStatus);
      setLead(data);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setStatusLoading('');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setNoteLoading(true);
    try {
      await notesAPI.create(id, noteContent.trim());
      setNoteContent('');
      fetchNotes();
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setNoteLoading(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      await leadsAPI.update(id, formData);
      toast.success('Lead updated');
      setShowEditModal(false);
      fetchLead();
    } catch (error) {
      toast.error('Failed to update lead');
      throw error;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) return null;

  const infoItems = [
    { icon: Mail, label: 'Email', value: lead.email },
    { icon: Phone, label: 'Phone', value: lead.phone || '—' },
    { icon: Building2, label: 'Company', value: lead.company },
    { icon: Globe, label: 'Source', value: lead.source },
    { icon: User, label: 'Assigned To', value: lead.assignedTo || '—' },
    { icon: DollarSign, label: 'Deal Value', value: formatCurrency(lead.dealValue || 0) },
    { icon: Calendar, label: 'Created', value: formatDate(lead.createdAt) },
    { icon: Clock, label: 'Last Updated', value: formatDate(lead.updatedAt) },
  ];

  return (
    <div>
      {/* Back navigation */}
      <button
        onClick={() => navigate('/leads')}
        className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-200 mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </button>

      <Header
        title={lead.name}
        subtitle={lead.company}
        actions={
          <Button variant="secondary" size="sm" icon={Edit3} onClick={() => setShowEditModal(true)}>
            Edit Lead
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Lead Info + Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Pipeline */}
          <div className="glass-light rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-4">Pipeline Stage</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {STATUSES.map((status, i) => {
                const isActive = lead.status === status;
                const isPast = STATUSES.indexOf(lead.status) > i;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={statusLoading === status}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                        : isPast
                        ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20'
                        : 'bg-surface-800/50 text-surface-400 border border-surface-700 hover:border-surface-600 hover:text-surface-300'
                    }`}
                  >
                    {statusLoading === status ? (
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : null}
                    {status}
                    {i < STATUSES.length - 1 && <ChevronRight size={12} className="ml-1 text-surface-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lead Information Grid */}
          <div className="glass-light rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-surface-200 mb-4">Lead Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-800/30">
                  <div className="p-2 rounded-lg bg-surface-700/50">
                    <item.icon size={14} className="text-surface-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-surface-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-surface-200 font-medium mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Notes */}
        <div className="space-y-6">
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-primary-400" />
              <h3 className="text-sm font-semibold text-surface-200">Notes ({notes.length})</h3>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-4">
              <div className="relative">
                <textarea
                  id="note-content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Add a note about this lead..."
                  rows={3}
                  className="w-full bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200 resize-none"
                />
                <button
                  type="submit"
                  disabled={!noteContent.trim() || noteLoading}
                  className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {noteLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-center text-surface-500 text-sm py-6">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-surface-800/30 border border-surface-700/50 animate-fade-in"
                  >
                    <p className="text-sm text-surface-200 leading-relaxed">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-surface-500">
                      <span>{note.createdBy}</span>
                      <span>·</span>
                      <span>{formatDateTime(note.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Lead"
        size="lg"
      >
        <LeadForm
          initialData={lead}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default LeadDetailPage;
