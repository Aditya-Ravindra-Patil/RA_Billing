import { useState, useRef } from 'react'
import { documentApi } from '../../api/documentApi'
import { useAuth } from '../../context/AuthContext'
import { Upload, Download, Trash2, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const DOC_TYPES = [
  { value: 'INSURANCE',               label: 'Insurance' },
  { value: 'WORK_ORDER',              label: 'Work Order' },
  { value: 'TECHNICAL_SANCTION',      label: 'Technical Sanction' },
  { value: 'EXTENSION_OF_TIME',       label: 'Extension of Time' },
  { value: 'GENERAL_BODY_RESOLUTION', label: 'General Body Resolution' },
  { value: 'ADMINISTRATIVE_APPROVAL', label: 'Administrative Approval' },
]

const UPLOAD_ROLES = ['JR_ENGINEER', 'ADMIN']

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DocumentPanel({ projectId, documents, onRefresh }) {
  const { user } = useAuth()
  const canUpload = UPLOAD_ROLES.includes(user?.role)

  const [uploading, setUploading]       = useState(false)
  const [selectedType, setSelectedType] = useState('INSURANCE')
  const [file, setFile]                 = useState(null)
  const [remarks, setRemarks]           = useState('')
  const [expanded, setExpanded]         = useState({})
  const inputRef = useRef()

  const grouped = DOC_TYPES.map(t => ({
    ...t,
    docs: documents.filter(d => d.documentType === t.value),
  }))

  const toggleExpand = (type) => setExpanded(e => ({ ...e, [type]: !e[type] }))

  const handleUpload = async () => {
    if (!file) { toast.error('Please select a file'); return }
    setUploading(true)
    try {
      await documentApi.upload(projectId, selectedType, file, remarks)
      toast.success('Document uploaded!')
      setFile(null); setRemarks('')
      if (inputRef.current) inputRef.current.value = ''
      onRefresh()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleDownload = async (doc) => {
    try {
      const res = await documentApi.download(projectId, doc.id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url; a.download = doc.originalFilename; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Download failed') }
  }

  const handleDelete = async (doc) => {
    if (!window.confirm('Delete "' + doc.originalFilename + '"?')) return
    try {
      await documentApi.delete(projectId, doc.id)
      toast.success('Deleted'); onRefresh()
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-4">
      {canUpload && (
        <div className="card border-2 border-dashed border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload document</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="label text-xs">Document type</label>
              <select className="input text-sm" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                {DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs">File</label>
              <input ref={inputRef} type="file" className="input text-sm py-1.5" onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>
          <div className="mb-3">
            <label className="label text-xs">Remarks (optional)</label>
            <input type="text" className="input text-sm" placeholder="Any notes..." value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>
          <button onClick={handleUpload} disabled={!file || uploading} className="btn-primary flex items-center gap-2 text-sm">
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Upload document'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {grouped.map(({ value, label, docs }) => (
          <div key={value} className="border border-gray-100 rounded-xl overflow-hidden">
            <button onClick={() => toggleExpand(value)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
              <div className="flex items-center gap-2">
                {expanded[value] ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                <span className="text-sm font-medium text-gray-800">{label}</span>
                {docs.length > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{docs.length}</span>
                )}
              </div>
              {docs.length === 0 && <span className="text-xs text-gray-400">No files</span>}
            </button>
            {expanded[value] && (
              <div className="divide-y divide-gray-50">
                {docs.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-gray-400">No documents uploaded yet.</p>
                ) : docs.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <div className="p-1.5 bg-gray-100 rounded-lg shrink-0">
                      <FileText size={14} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate font-medium">{doc.originalFilename}</p>
                      <p className="text-xs text-gray-400">
                        {doc.uploadedByName} &bull; {formatDate(doc.uploadedAt)}
                        {doc.remarks && ' — ' + doc.remarks}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleDownload(doc)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Download size={13} />
                      </button>
                      {(user?.id === doc.uploadedById || user?.role === 'ADMIN') && (
                        <button onClick={() => handleDelete(doc)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
