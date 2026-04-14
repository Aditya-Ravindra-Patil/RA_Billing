import { useState } from 'react'
import { CreditCard, CheckCircle, Banknote } from 'lucide-react'

const PAYMENT_STEPS = [
  {
    action: 'READY_TO_PAY',
    label: 'Mark ready to pay',
    icon: CheckCircle,
    color: 'border-blue-300 bg-blue-50 text-blue-700',
    activeColor: 'border-blue-500 bg-blue-100 ring-2 ring-blue-400 text-blue-800',
    description: 'Confirm this bill is cleared for payment processing.',
    fields: [],
  },
  {
    action: 'CHEQUE_ISSUED',
    label: 'Issue cheque',
    icon: CreditCard,
    color: 'border-amber-300 bg-amber-50 text-amber-700',
    activeColor: 'border-amber-500 bg-amber-100 ring-2 ring-amber-400 text-amber-800',
    description: 'Record the cheque details for this bill.',
    fields: [
      { key: 'chequeNumber', label: 'Cheque number', required: true, placeholder: 'e.g. 012345' },
      { key: 'chequeBank',   label: 'Bank name',     required: true, placeholder: 'e.g. State Bank of India' },
    ],
  },
  {
    action: 'PAYMENT_DONE',
    label: 'Mark payment done',
    icon: Banknote,
    color: 'border-green-300 bg-green-50 text-green-700',
    activeColor: 'border-green-500 bg-green-100 ring-2 ring-green-400 text-green-800',
    description: 'Confirm payment has been completed.',
    fields: [
      { key: 'paymentRemarks', label: 'Payment remarks', required: false, placeholder: 'Any additional notes...' },
    ],
  },
]

const ALLOWED_ACTIONS = {
  APPROVED:      ['READY_TO_PAY'],
  READY_TO_PAY:  ['CHEQUE_ISSUED'],
  CHEQUE_ISSUED: ['PAYMENT_DONE'],
}

export default function PaymentPanel({ bill, onAction, loading }) {
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState({})

  const allowedActions = ALLOWED_ACTIONS[bill.status] || []
  const availableSteps = PAYMENT_STEPS.filter(s => allowedActions.includes(s.action))
  const step = PAYMENT_STEPS.find(s => s.action === selected)

  const canSubmit = selected && (
    !step?.fields?.some(f => f.required && !formData[f.key]?.trim())
  )

  const handleSubmit = () => {
    if (!canSubmit) return
    onAction({ action: selected, ...formData })
  }

  if (availableSteps.length === 0) return null

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-700">Payment actions:</p>

      <div className="flex flex-col gap-2">
        {availableSteps.map(({ action, label, icon: Icon, color, activeColor, description }) => (
          <button
            key={action}
            onClick={() => { setSelected(action); setFormData({}) }}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-sm font-medium text-left
              ${selected === action ? activeColor : color}`}
          >
            <Icon size={18} className="shrink-0" />
            <div>
              <p>{label}</p>
              <p className="text-xs font-normal opacity-70">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && step?.fields?.length > 0 && (
        <div className="space-y-3">
          {step.fields.map(f => (
            <div key={f.key}>
              <label className="label text-xs">{f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}</label>
              <input
                type="text"
                className="input"
                placeholder={f.placeholder}
                value={formData[f.key] || ''}
                onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      )}

      {selected && (
        <button onClick={handleSubmit} disabled={!canSubmit || loading} className="btn-primary w-full">
          {loading ? 'Processing...' : PAYMENT_STEPS.find(s => s.action === selected)?.label}
        </button>
      )}
    </div>
  )
}
