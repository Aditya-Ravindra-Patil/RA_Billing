import { useEffect, useState } from 'react'
import { userApi } from '../api/userApi'
import AppLayout from '../components/Layout/AppLayout'
import { Search, Plus, X, UserCheck, UserX, KeyRound, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = [
  { value: 'JR_ENGINEER',         label: 'Jr Engineer' },
  { value: 'JR_ENGINEER',           label: 'Jr Engineer' },
  { value: 'DEPUTY_ENGINEER',       label: 'Deputy Engineer' },
  { value: 'EXECUTIVE_ENGINEER',    label: 'Executive Engineer' },
  { value: 'ACCOUNTANT',            label: 'Accountant' },
  { value: 'ACCOUNT_OFFICER',       label: 'Account Officer' },
  { value: 'CHIEF_ACCOUNT_OFFICER', label: 'Chief Account Officer' },
  { value: 'ADMIN',                 label: 'Admin' },
]

const ROLE_COLORS = {
  JR_ENGINEER:           'bg-purple-50 text-purple-700 border-purple-100',
  DEPUTY_ENGINEER:       'bg-blue-50 text-blue-700 border-blue-100',
  EXECUTIVE_ENGINEER:    'bg-indigo-50 text-indigo-700 border-indigo-100',
  ACCOUNTANT:            'bg-yellow-50 text-yellow-700 border-yellow-100',
  ACCOUNT_OFFICER:       'bg-amber-50 text-amber-700 border-amber-100',
  CHIEF_ACCOUNT_OFFICER: 'bg-orange-50 text-orange-700 border-orange-100',
  ADMIN:                 'bg-red-50 text-red-700 border-red-100',
}

const emptyForm = { name: '', email: '', password: '', role: 'JR_ENGINEER' }

export default function Users() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser]   = useState(null)   // user being edited
  const [resetUser, setResetUser] = useState(null)   // user for password reset
  const [form, setForm]           = useState(emptyForm)
  const [editForm, setEditForm]   = useState({ name: '', role: '' })
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving]       = useState(false)

  const load = (q = '') => {
    userApi.getAll(q)
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const t = setTimeout(() => load(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userApi.create(form)
      toast.success('User created!')
      setShowCreate(false)
      setForm(emptyForm)
      load(search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
    } finally { setSaving(false) }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userApi.update(editUser.id, editForm)
      toast.success('User updated!')
      setEditUser(null)
      load(search)
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  const handleToggle = async (user) => {
    try {
      await userApi.toggleActive(user.id)
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`)
      load(search)
    } catch { toast.error('Failed to update status') }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setSaving(true)
    try {
      await userApi.resetPassword(resetUser.id, newPassword)
      toast.success('Password reset!')
      setResetUser(null)
      setNewPassword('')
    } catch { toast.error('Reset failed') }
    finally { setSaving(false) }
  }

  const openEdit = (u) => {
    setEditUser(u)
    setEditForm({ name: u.name, role: u.role })
  }

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User management</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add user
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-9 pr-9"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Users table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            {search ? `No users found for "${search}"` : 'No users yet.'}
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${!u.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${ROLE_COLORS[u.role] || 'bg-gray-50 text-gray-600'}`}>
                      {ROLES.find(r => r.value === u.role)?.label || u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {u.isActive
                      ? <span className="badge-approved">Active</span>
                      : <span className="badge-rejected">Inactive</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(u)}
                        title="Edit user"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => { setResetUser(u); setNewPassword('') }}
                        title="Reset password"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        <KeyRound size={14} />
                      </button>
                      <button
                        onClick={() => handleToggle(u)}
                        title={u.isActive ? 'Deactivate' : 'Activate'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.isActive
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create user modal ── */}
      {showCreate && (
        <Modal title="Add new user" onClose={() => { setShowCreate(false); setForm(emptyForm) }}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Full name <span className="text-red-500">*</span></label>
              <input required className="input" value={form.name}
                onChange={e => field('name', e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="label">Email address <span className="text-red-500">*</span></label>
              <input required type="email" className="input" value={form.email}
                onChange={e => field('email', e.target.value)} placeholder="john@example.com" />
            </div>
            <div>
              <label className="label">Role <span className="text-red-500">*</span></label>
              <select required className="input" value={form.role}
                onChange={e => field('role', e.target.value)}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Initial password <span className="text-red-500">*</span></label>
              <input required type="password" className="input" value={form.password}
                onChange={e => field('password', e.target.value)}
                placeholder="Min 6 characters" minLength={6} />
              <p className="text-xs text-gray-400 mt-1">User should change this after first login.</p>
            </div>
            <ModalFooter onCancel={() => { setShowCreate(false); setForm(emptyForm) }} saving={saving} label="Create user" />
          </form>
        </Modal>
      )}

      {/* ── Edit user modal ── */}
      {editUser && (
        <Modal title={`Edit — ${editUser.name}`} onClose={() => setEditUser(null)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={editForm.role}
                onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <ModalFooter onCancel={() => setEditUser(null)} saving={saving} label="Save changes" />
          </form>
        </Modal>
      )}

      {/* ── Reset password modal ── */}
      {resetUser && (
        <Modal title={`Reset password — ${resetUser.name}`} onClose={() => setResetUser(null)}>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-gray-500">Enter a new password for <strong>{resetUser.name}</strong>.</p>
            <div>
              <label className="label">New password</label>
              <input type="password" required className="input" minLength={6}
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 6 characters" />
            </div>
            <ModalFooter onCancel={() => setResetUser(null)} saving={saving} label="Reset password" />
          </form>
        </Modal>
      )}
    </AppLayout>
  )
}

// ── Shared modal wrapper ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ModalFooter({ onCancel, saving, label }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
      <button type="submit" disabled={saving} className="btn-primary flex-1">
        {saving ? 'Saving...' : label}
      </button>
    </div>
  )
}
