import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projectApi } from '../api/projectApi'
import { raBillApi } from '../api/raBillApi'
import { documentApi } from '../api/documentApi'
import AppLayout from '../components/Layout/AppLayout'
import BillStatusBadge from '../components/Bills/BillStatusBadge'
import DocumentPanel from '../components/Documents/DocumentPanel'
import { useAuth } from '../context/AuthContext'
import { Upload, ArrowLeft, FileText, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [bills, setBills]     = useState([])
  const [docs, setDocs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('bills')

  const loadDocs = () => documentApi.getAll(id).then(r => setDocs(r.data)).catch(() => {})

  useEffect(() => {
    Promise.all([projectApi.getById(id), raBillApi.getByProject(id), documentApi.getAll(id)])
      .then(([pRes, bRes, dRes]) => {
        setProject(pRes.data); setBills(bRes.data); setDocs(dRes.data)
      })
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <AppLayout><div className="text-center py-20 text-gray-400">Loading...</div></AppLayout>
  if (!project) return <AppLayout><div className="text-center py-20 text-gray-400">Project not found.</div></AppLayout>

  return (
    <AppLayout>
      <div className="mb-6">
        <Link to="/projects" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
          <ArrowLeft size={14} /> Back to projects
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {project.workKey}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{project.contractorName} &bull; {project.location}</p>
          </div>
          {user?.role === 'JR_ENGINEER' && (
            <Link to={`/bills/upload?projectId=${id}`} className="btn-primary flex items-center gap-2">
              <Upload size={16} /> Upload RA Bill
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Start date',       value: project.startDate || '—' },
          { label: 'End date',         value: project.endDate   || '—' },
          { label: 'Total RA bills',   value: bills.length },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {project.description && (
        <div className="card mb-6">
          <p className="text-sm text-gray-600">{project.description}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-100">
        {[
          { key: 'bills', label: 'RA Bills', count: bills.length },
          { key: 'docs',  label: 'Documents', count: docs.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 -mb-px
              ${tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === key ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Bills tab */}
      {tab === 'bills' && (
        <div className="card">
          {bills.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FileText size={36} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">No bills uploaded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-xs uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-3 py-3 text-left">Bill #</th>
                    <th className="px-3 py-3 text-left">File name</th>
                    <th className="px-3 py-3 text-left">Status</th>
                    <th className="px-3 py-3 text-left">Submitted</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bills.map(bill => (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 font-mono text-gray-600">#{bill.billNumber}</td>
                      <td className="px-3 py-3 text-gray-700">{bill.originalFilename}</td>
                      <td className="px-3 py-3"><BillStatusBadge status={bill.status} /></td>
                      <td className="px-3 py-3 text-gray-400 text-xs">
                        {bill.submittedAt ? new Date(bill.submittedAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-3 py-3">
                        <Link to={`/bills/${bill.id}`} className="text-primary text-xs font-medium hover:underline">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Documents tab */}
      {tab === 'docs' && (
        <DocumentPanel projectId={id} documents={docs} onRefresh={loadDocs} />
      )}
    </AppLayout>
  )
}
