import { useState } from 'react'
import { CheckCircle, MessageSquare, XCircle, Send } from 'lucide-react'

const ACTIONS = [
  {
    key: 'APPROVE',
    label: 'Approve',
    icon: CheckCircle,
    color: 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100',
    activeColor: 'border-green-500 bg-green-100 ring-2 ring-green-400 text-green-800',
    commentsRequired: false,
    commentsLabel: 'Approval note (optional)',
    placeholder: 'Add a note...',
  },
  {
    key: 'SUGGEST',
    label: 'Send suggestion',
    icon: MessageSquare,
    color: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100',
    activeColor: 'border-amber-500 bg-amber-100 ring-2 ring-amber-400 text-amber-800',
    commentsRequired: true,
    commentsLabel: 'Suggestion / correction needed (required)',
    placeholder: 'Describe what needs to be corrected before this bill can move forward...',
  },
  {
    key: 'REJECT',
    label: 'Hard reject',
    icon: XCircle,
    color: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100',
    activeColor: 'border-red-500 bg-red-100 ring-2 ring-red-400 text-red-800',
    commentsRequired: true,
    commentsLabel: 'Reason for rejection (required)',
    placeholder: 'State the reason for hard rejection. Jr Engineer will need to re-upload a corrected file.',
  },
]

export default function ApprovalPanel({ onAction, loading }) {
  const [selectedAction, setSelectedAction] = useState(null)
  const [comments, setComments] = useState('')

  const actionDef = ACTIONS.find(a => a.key === selectedAction)
  const canSubmit = selectedAction && (!actionDef?.commentsRequired || comments.trim().length > 0)

  const handleSubmit = () => {
    if (!canSubmit) return
    onAction({ action: selectedAction, comments: comments.trim() })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Take action on this bill:</p>

      <div className="grid grid-cols-3 gap-3">
        {ACTIONS.map(({ key, label, icon: Icon, color, activeColor }) => (
          <button
            key={key}
            onClick={() => { setSelectedAction(key); setComments('') }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium
              ${selectedAction === key ? activeColor : color}`}
          >
            <Icon size={22} />
            {label}
          </button>
        ))}
      </div>

      {selectedAction && (
        <div className="space-y-2 animate-in fade-in">
          <label className="label">
            {actionDef.commentsLabel}
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={actionDef.placeholder}
            rows={4}
            className="input resize-none"
          />
          {actionDef.commentsRequired && !comments.trim() && (
            <p className="text-xs text-red-500">Comments are required for this action.</p>
          )}
        </div>
      )}

      {selectedAction && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="btn-primary flex items-center gap-2"
        >
          <Send size={16} />
          {loading ? 'Submitting...' : `Confirm — ${ACTIONS.find(a => a.key === selectedAction)?.label}`}
        </button>
      )}
    </div>
  )
}
