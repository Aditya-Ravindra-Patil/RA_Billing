import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { raBillApi } from '../api/raBillApi'
import { approvalApi } from '../api/approvalApi'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/Layout/AppLayout'
import BillStatusBadge from '../components/Bills/BillStatusBadge'
import ApprovalPanel from '../components/Approval/ApprovalPanel'
import ApprovalTimeline from '../components/Approval/ApprovalTimeline'
import PaymentPanel from '../components/Bills/PaymentPanel'
import BillUploader from '../components/Bills/BillUploader'
import { ArrowLeft, Download, FileSpreadsheet, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const STAGE_ROLE_MAP = {
  1: 'DEPUTY_ENGINEER',
  2: 'EXECUTIVE_ENGINEER',
  3: 'ACCOUNTANT',
  4: 'ACCOUNT_OFFICER',
  5: 'CHIEF_ACCOUNT_OFFICER',
}

const STAGE_LABELS = {
  1: 'Deputy Engineer',
  2: 'Executive Engineer',
  3: 'Accountant',
  4: 'Account Officer',
  5: 'Chief Account Officer',
}

const PAYMENT_STATUSES = ['APPROVED', 'READY_TO_PAY', 'CHEQUE_ISSUED', 'PAYMENT_DONE']

export default function BillDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [bill, setBill]                   = useState(null)
  const [logs, setLogs]                   = useState([])
  const [loading, setLoading]             = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [reuploadFile, setReuploadFile]   = useState(null)
  const [reuploading, setReuploading]     = useState(false)

  const load = () => {
    Promise.all([raBillApi.getById(id), approvalApi.getLogs(id)])
      .then(([bRes, lRes]) => { setBill(bRes.data); setLogs(lRes.data) })
      .catch(() => toast.error('Failed to load bill'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const expectedRole   = STAGE_ROLE_MAP[bill?.currentStage]
  const canAct         = bill && user?.role === expectedRole &&
    ['IN_REVIEW', 'PENDING', 'UNDER_SUGGESTION'].includes(bill.status)
  const isJrEngOwner = user?.role === 'JR_ENGINEER' && bill?.uploadedById === user?.id
  const canReupload    = isJrEngOwner &&
    ['REJECTED', 'UNDER_SUGGESTION'].includes(bill?.status) && bill?.currentStage === 0
  const canPayment     = user?.role === 'CHIEF_ACCOUNT_OFFICER' &&
    PAYMENT_STATUSES.includes(bill?.status) && bill?.status !== 'PAYMENT_DONE'

  const handleAction = async ({ action, comments }) => {
    setActionLoading(true)
    try {
      await approvalApi.processAction(id, { action, comments })
      toast.success(
        action === 'APPROVE' ? 'Bill approved and forwarded!' :
        action === 'SUGGEST' ? 'Suggestion sent!' : 'Bill rejected.'
      )
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally { setActionLoading(false) }
  }

  const handlePaymentAction = async (data) => {
    setPaymentLoading(true)
    try {
      await raBillApi.paymentAction(id, data)
      toast.success('Payment status updated!')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment action failed')
    } finally { setPaymentLoading(false) }
  }

  const handleReupload = async () => {
    if (!reuploadFile) return
    setReuploading(true)
    try {
      await raBillApi.reupload(id, reuploadFile)
      await raBillApi.submit(id)
      toast.success('Re-uploaded and resubmitted!')
      setReuploadFile(null); load()
    } catch { toast.error('Re-upload failed.') }
    finally { setReuploading(false) }
  }

  const handleDownload = async () => {
    try {
      const res = await raBillApi.downloadFile(id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url; a.download = bill.originalFilename || 'ra-bill.xlsx'; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Download failed') }
  }

  if (loading) return <AppLayout><div className="text-center py-20 text-gray-400">Loading...</div></AppLayout>
  if (!bill)   return <AppLayout><div className="text-center py-20 text-gray-400">Bill not found.</div></AppLayout>

  return (
    <AppLayout>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">RA Bill #{bill.billNumber}</h1>
              <BillStatusBadge status={bill.status} />
            </div>
            <p className="text-gray-500 text-sm">{bill.projectName} &bull; {bill.contractorName}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Bill meta */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Bill details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                { label: 'Project',       value: bill.projectName },
                { label: 'Contractor',    value: bill.contractorName },
                { label: 'Uploaded by',   value: bill.uploadedByName },
                { label: 'Current stage', value: bill.currentStage > 0
                    ? `Stage ${bill.currentStage} — ${STAGE_LABELS[bill.currentStage]}`
                    : 'With Jr Engineer' },
                { label: 'Submitted',     value: bill.submittedAt ? new Date(bill.submittedAt).toLocaleDateString('en-IN') : '—' },
                { label: 'Last updated',  value: bill.updatedAt   ? new Date(bill.updatedAt).toLocaleDateString('en-IN')   : '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-medium text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {bill.rejectionReason && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs text-red-500 font-medium uppercase tracking-wide mb-1">Rejection reason</p>
                <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{bill.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* Payment info card (visible once payment flow starts) */}
          {PAYMENT_STATUSES.includes(bill.status) && (
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Payment details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Payment status</p>
                  <BillStatusBadge status={bill.status} />
                </div>
                {bill.chequeNumber && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Cheque number</p>
                    <p className="font-medium text-gray-900 mt-0.5">{bill.chequeNumber}</p>
                  </div>
                )}
                {bill.chequeBank && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Bank</p>
                    <p className="font-medium text-gray-900 mt-0.5">{bill.chequeBank}</p>
                  </div>
                )}
                {bill.paymentDate && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Payment date</p>
                    <p className="font-medium text-gray-900 mt-0.5">
                      {new Date(bill.paymentDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                {bill.paymentRemarks && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Remarks</p>
                    <p className="font-medium text-gray-900 mt-0.5">{bill.paymentRemarks}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Excel file card */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">RA Bill file</h2>
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileSpreadsheet size={22} className="text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{bill.originalFilename || 'ra-bill.xlsx'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Excel spreadsheet</p>
                </div>
              </div>
              <button onClick={handleDownload} className="btn-secondary flex items-center gap-2 text-sm shrink-0">
                <Download size={15} /> Download
              </button>
            </div>
          </div>

          {/* Re-upload section */}
          {canReupload && (
            <div className="card border-2 border-amber-200">
              <h2 className="text-base font-semibold text-amber-800 mb-2">Re-upload corrected file</h2>
              <p className="text-sm text-amber-700 mb-4">
                {bill.status === 'REJECTED'
                  ? 'This bill was rejected. Upload a corrected Excel file to resubmit.'
                  : 'A suggestion was sent. Address the comments and resubmit.'}
              </p>
              <BillUploader onFileSelect={setReuploadFile} />
              {reuploadFile && (
                <button onClick={handleReupload} disabled={reuploading}
                  className="btn-primary flex items-center gap-2 mt-4">
                  <Send size={16} />
                  {reuploading ? 'Submitting...' : 'Re-upload & resubmit'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Approval action panel */}
          {canAct && (
            <div className="card border-2 border-primary/20">
              <h2 className="text-base font-semibold text-gray-900 mb-2">Your action required</h2>
              <p className="text-xs text-gray-500 mb-4">
                You are reviewing as <span className="font-semibold">{STAGE_LABELS[bill.currentStage]}</span> — Stage {bill.currentStage} of 5.
                Download the Excel file to review before acting.
              </p>
              <ApprovalPanel onAction={handleAction} loading={actionLoading} />
            </div>
          )}

          {/* Payment panel — Chief Account Officer only */}
          {canPayment && (
            <div className="card border-2 border-green-200">
              <h2 className="text-base font-semibold text-gray-900 mb-2">Payment processing</h2>
              <p className="text-xs text-gray-500 mb-4">
                This bill has been fully approved. Proceed with payment steps below.
              </p>
              <PaymentPanel bill={bill} onAction={handlePaymentAction} loading={paymentLoading} />
            </div>
          )}

          {/* Approval progress */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Approval progress</h2>
            <div className="space-y-2">
              {Object.entries(STAGE_LABELS).map(([stage, label]) => {
                const s         = parseInt(stage)
                const isComplete = bill.status === 'APPROVED' ||
                  PAYMENT_STATUSES.includes(bill.status) || s < bill.currentStage
                const isCurrent = s === bill.currentStage && !PAYMENT_STATUSES.includes(bill.status)
                return (
                  <div key={stage} className="flex items-center gap-3 text-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                      ${isComplete ? 'bg-green-500 text-white' :
                        isCurrent  ? 'bg-primary text-white ring-2 ring-primary ring-offset-1' :
                                     'bg-gray-100 text-gray-400'}`}>
                      {isComplete ? '✓' : s}
                    </div>
                    <span className={
                      isComplete ? 'text-gray-400 line-through' :
                      isCurrent  ? 'font-semibold text-primary' : 'text-gray-400'
                    }>{label}</span>
                  </div>
                )
              })}
              {/* Payment steps */}
              {[
                { key: 'READY_TO_PAY',  label: 'Ready to pay' },
                { key: 'CHEQUE_ISSUED', label: 'Cheque issued' },
                { key: 'PAYMENT_DONE',  label: 'Payment done' },
              ].map(({ key, label }) => {
                const statuses = ['READY_TO_PAY', 'CHEQUE_ISSUED', 'PAYMENT_DONE']
                const idx      = statuses.indexOf(key)
                const billIdx  = statuses.indexOf(bill.status)
                const done     = billIdx >= idx && billIdx !== -1
                const current  = bill.status === key
                return (
                  <div key={key} className="flex items-center gap-3 text-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
                      ${done    ? 'bg-green-500 text-white text-xs font-bold' :
                        current ? 'bg-amber-500 text-white text-xs font-bold ring-2 ring-amber-400 ring-offset-1' :
                                  'bg-gray-100'}`}>
                      {done ? '✓' : <span className="w-2 h-2 rounded-full bg-gray-300 block" />}
                    </div>
                    <span className={done ? 'text-gray-400 line-through' : current ? 'font-semibold text-amber-600' : 'text-gray-400'}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Activity log */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Activity log</h2>
            <ApprovalTimeline logs={logs} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
