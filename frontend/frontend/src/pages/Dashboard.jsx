import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { raBillApi } from '../api/raBillApi'
import AppLayout from '../components/Layout/AppLayout'
import BillStatusBadge from '../components/Bills/BillStatusBadge'
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const STAGE_LABELS = {
  1: 'Deputy Engineer', 2: 'Executive Engineer', 3: 'Accountant',
  4: 'Account Officer', 5: 'Chief Account Officer',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [bills, setBills]     = useState([])
  const [stats, setStats]     = useState({})
  const [loading, setLoading] = useState(true)

  // isJrEng defined at component scope — accessible everywhere in this component
  const isJrEng = user?.role === 'JR_ENGINEER'

  useEffect(() => {
    if (!user) return
    const fetchFn = isJrEng ? raBillApi.getAll : raBillApi.getMyPending
    fetchFn()
      .then(res => {
        const data = res.data
        setBills(data)
        setStats({
          total:     data.length,
          pending:   data.filter(b => ['PENDING', 'IN_REVIEW'].includes(b.status)).length,
          approved:  data.filter(b => b.status === 'APPROVED').length,
          needsWork: data.filter(b => ['UNDER_SUGGESTION', 'REJECTED'].includes(b.status)).length,
        })
      })
      .catch(() => toast.error('Failed to load bills'))
      .finally(() => setLoading(false))
  }, [user])

  const statCards = [
    { label: 'Total bills',     value: stats.total,     icon: FileText,      color: 'text-blue-600 bg-blue-50' },
    { label: 'Awaiting action', value: stats.pending,   icon: Clock,         color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Approved',        value: stats.approved,  icon: CheckCircle,   color: 'text-green-600 bg-green-50' },
    { label: 'Needs revision',  value: stats.needsWork, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          {isJrEng ? 'All RA Bills' : 'Bills awaiting your action'}
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : bills.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No bills found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left">Bill #</th>
                  <th className="px-3 py-3 text-left">Project</th>
                  <th className="px-3 py-3 text-left">Uploaded by</th>
                  <th className="px-3 py-3 text-left">Stage</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left">Submitted</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bills.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-gray-600">#{bill.billNumber}</td>
                    <td className="px-3 py-3 font-medium text-gray-900">{bill.projectName}</td>
                    <td className="px-3 py-3 text-gray-600">{bill.uploadedByName}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">
                      {bill.currentStage > 0
                        ? `Stage ${bill.currentStage} — ${STAGE_LABELS[bill.currentStage]}`
                        : 'With Jr Eng'}
                    </td>
                    <td className="px-3 py-3"><BillStatusBadge status={bill.status} /></td>
                    <td className="px-3 py-3 text-gray-400 text-xs">
                      {bill.submittedAt ? new Date(bill.submittedAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <Link to={`/bills/${bill.id}`} className="text-primary text-xs font-medium hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
