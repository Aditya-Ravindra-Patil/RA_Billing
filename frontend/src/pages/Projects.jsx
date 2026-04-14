import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { projectApi } from '../api/projectApi'
import AppLayout from '../components/Layout/AppLayout'
import { FolderOpen, Plus, X, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyForm = {
  workKey: '', projectName: '', contractorName: '',
  location: '', startDate: '', endDate: '', description: '',
}

export default function Projects() {
  const { user } = useAuth()
  const isJrEng = user?.role === 'JR_ENGINEER'

  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [saving, setSaving]         = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching]   = useState(false)

  const load = (q = '') => {
    setSearching(!!q)
    projectApi.getAll(q)
      .then(r => setProjects(r.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => { setLoading(false); setSearching(false) })
  }

  useEffect(() => { load() }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => load(searchQuery), 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await projectApi.create(form)
      toast.success('Project created!')
      setShowModal(false)
      setForm(emptyForm)
      load(searchQuery)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  const field = (key, value) => setForm(f => ({ ...f, [key]: value }))

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} found</p>
        </div>
        {isJrEng && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New project
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          className="input pl-9 pr-4"
          placeholder="Search by work key, project name, contractor, or location..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FolderOpen size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-sm">{searchQuery ? `No projects found for "${searchQuery}"` : 'No projects yet.'}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="card hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <FolderOpen size={18} className="text-primary" />
                  </div>
                  {/* Work key badge */}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {p.workKey}
                  </span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {p.billCount ?? 0} bill{p.billCount !== 1 ? 's' : ''}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                {p.projectName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{p.contractorName}</p>
              <p className="text-xs text-gray-400 mt-1">{p.location}</p>
              <div className="flex gap-3 mt-3 text-xs text-gray-400 border-t border-gray-50 pt-3">
                <span>{p.startDate || '—'}</span>
                <span>→</span>
                <span>{p.endDate || '—'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create project modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 my-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Create new project</h2>
              <button onClick={() => { setShowModal(false); setForm(emptyForm) }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">

              {/* Work Key — highlighted as important */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <label className="label text-blue-800">
                  Work key / Project key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input font-mono uppercase mt-1"
                  placeholder="e.g. PWD-2024-001"
                  value={form.workKey}
                  onChange={e => field('workKey', e.target.value.toUpperCase())}
                />
                <p className="text-xs text-blue-600 mt-1.5">
                  Unique identifier for this project. Used for quick search. Cannot be changed later.
                </p>
              </div>

              {[
                { key: 'projectName',    label: 'Project name',    type: 'text', required: true },
                { key: 'contractorName', label: 'Contractor name', type: 'text', required: true },
                { key: 'location',       label: 'Location',        type: 'text', required: true },
                { key: 'startDate',      label: 'Start date',      type: 'date', required: false },
                { key: 'endDate',        label: 'End date',        type: 'date', required: false },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
                  <input
                    type={type}
                    required={required}
                    className="input"
                    value={form[key]}
                    onChange={e => field(key, e.target.value)}
                  />
                </div>
              ))}

              <div>
                <label className="label">Description (optional)</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  value={form.description}
                  onChange={e => field('description', e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setForm(emptyForm) }} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Creating...' : 'Create project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
