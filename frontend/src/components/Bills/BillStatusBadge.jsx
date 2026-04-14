const STATUS_MAP = {
  DRAFT:            { cls: 'badge-draft',      label: 'Draft' },
  PENDING:          { cls: 'badge-pending',    label: 'Pending' },
  IN_REVIEW:        { cls: 'badge-review',     label: 'In Review' },
  UNDER_SUGGESTION: { cls: 'badge-suggestion', label: 'Needs Revision' },
  REJECTED:         { cls: 'badge-rejected',   label: 'Rejected' },
  APPROVED:         { cls: 'badge-approved',   label: 'Approved' },
  READY_TO_PAY:     { cls: 'badge-approved',   label: 'Ready to Pay' },
  CHEQUE_ISSUED:    { cls: 'badge-pending',    label: 'Cheque Issued' },
  PAYMENT_DONE:     { cls: 'badge-approved',   label: 'Payment Done' },
}

export default function BillStatusBadge({ status }) {
  const { cls, label } = STATUS_MAP[status] || { cls: 'badge-draft', label: status }
  return <span className={cls}>{label}</span>
}
