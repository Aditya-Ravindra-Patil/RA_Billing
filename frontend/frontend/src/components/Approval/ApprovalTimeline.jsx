import { CheckCircle, MessageSquare, XCircle, Clock } from 'lucide-react'

const ACTION_CONFIG = {
  APPROVE:  { icon: CheckCircle,   color: 'text-green-600', bg: 'bg-green-100',  label: 'Approved' },
  SUGGEST:  { icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100',  label: 'Suggestion sent' },
  REJECT:   { icon: XCircle,       color: 'text-red-600',   bg: 'bg-red-100',    label: 'Hard rejected' },
}

const STAGE_LABELS = {
  1: 'Jr Engineer',
  2: 'Jr Engineer',
  3: 'Dept Engineer',
  4: 'Exec Engineer',
  5: 'Account Officer',
  6: 'Chief Account Officer',
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function ApprovalTimeline({ logs = [] }) {
  if (!logs.length) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
        <Clock size={16} /> No approval activity yet.
      </div>
    )
  }

  return (
    <ol className="relative border-l border-gray-200 ml-3 space-y-6">
      {logs.map((log, idx) => {
        const cfg = ACTION_CONFIG[log.action] || ACTION_CONFIG.APPROVE
        const Icon = cfg.icon
        return (
          <li key={idx} className="ml-6">
            <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${cfg.bg}`}>
              <Icon size={13} className={cfg.color} />
            </span>
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm font-semibold text-gray-900">{cfg.label}</span>
                <span className="text-xs text-gray-400">{formatDate(log.actionAt)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Stage {log.stage} — {STAGE_LABELS[log.stage] || 'Unknown'} &bull; {log.approverName}
              </p>
              {log.comments && (
                <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border-l-4 border-gray-300">
                  {log.comments}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
