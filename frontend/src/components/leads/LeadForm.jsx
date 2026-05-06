import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ChevronDown } from 'lucide-react';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCES = ['Website', 'LinkedIn', 'Referral', 'Cold Email', 'Event'];

const LeadForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    source: initialData?.source || 'Website',
    assignedTo: initialData?.assignedTo || '',
    status: initialData?.status || 'New',
    dealValue: initialData?.dealValue || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        dealValue: Number(formData.dealValue) || 0,
      });
    } catch (err) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Lead Name *"
          id="lead-name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. John Smith"
          error={errors.name}
        />
        <Input
          label="Company Name *"
          id="lead-company"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="e.g. Acme Corp"
          error={errors.company}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email Address *"
          id="lead-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="e.g. john@acme.com"
          error={errors.email}
        />
        <Input
          label="Phone Number"
          id="lead-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="e.g. +1 (555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-300">Lead Source</label>
          <div className="relative">
            <select
              id="lead-source"
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              className="w-full appearance-none bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-300">Status</label>
          <div className="relative">
            <select
              id="lead-status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full appearance-none bg-surface-800/50 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Assigned Salesperson"
          id="lead-assigned"
          value={formData.assignedTo}
          onChange={(e) => handleChange('assignedTo', e.target.value)}
          placeholder="e.g. Admin User"
        />
        <Input
          label="Estimated Deal Value ($)"
          id="lead-deal-value"
          type="number"
          value={formData.dealValue}
          onChange={(e) => handleChange('dealValue', e.target.value)}
          placeholder="e.g. 50000"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-700/50">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
