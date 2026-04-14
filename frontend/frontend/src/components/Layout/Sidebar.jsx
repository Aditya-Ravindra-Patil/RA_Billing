import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, FolderOpen, Upload, LogOut, FileText, Users
} from 'lucide-react'

const ROLE_LABELS = {
  JR_ENGINEER:           'Jr Engineer',
  DEPUTY_ENGINEER:       'Deputy Engineer',
  EXECUTIVE_ENGINEER:    'Executive Engineer',
  ACCOUNTANT:            'Accountant',
  ACCOUNT_OFFICER:       'Account Officer',
  CHIEF_ACCOUNT_OFFICER: 'Chief Account Officer',
  ADMIN:                 'Admin',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const isJrEng = user?.role === 'JR_ENGINEER'

  const links = [
    { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/projects',  icon: FolderOpen,      label: 'Projects' },
    ...(isJrEng ? [{ to: '/bills/upload', icon: Upload, label: 'Upload Bill' }] : []),
    ...(user?.role === 'ADMIN' ? [{ to: '/users', icon: Users, label: 'Users' }] : []),
  ]

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-lg font-semibold text-primary">RA Bill App</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{ROLE_LABELS[user?.role]}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full px-2 py-1.5 rounded-lg hover:bg-red-50">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
