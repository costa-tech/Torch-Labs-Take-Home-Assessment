const statusConfig = {
  'New': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
  },
  'Contacted': {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/20',
    dot: 'bg-violet-400',
  },
  'Qualified': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  'Proposal Sent': {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    dot: 'bg-orange-400',
  },
  'Won': {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  'Lost': {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
};

const StatusBadge = ({ status, size = 'md', onChange, disabled }) => {
  const config = statusConfig[status] || statusConfig['New'];

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const selectSizes = {
    sm: 'pl-5 pr-6 py-0.5 text-[10px]',
    md: 'pl-6 pr-7 py-1 text-xs',
    lg: 'pl-7 pr-8 py-1.5 text-sm',
  };

  if (onChange) {
    return (
      <div className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
        <span className={`absolute left-2 w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-dot pointer-events-none`} />
        <select
          value={status}
          onChange={onChange}
          disabled={disabled}
          className={`appearance-none font-medium rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors ${config.bg} ${config.text} ${config.border} ${selectSizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {Object.keys(statusConfig).map((s) => (
            <option key={s} value={s} className="bg-surface-800 text-surface-200">
              {s}
            </option>
          ))}
        </select>
        <svg className={`absolute right-2 w-3 h-3 ${config.text} pointer-events-none`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizes[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-dot`} />
      {status}
    </span>
  );
};

export default StatusBadge;
