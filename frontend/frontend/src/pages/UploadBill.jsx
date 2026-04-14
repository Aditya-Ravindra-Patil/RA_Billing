import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { projectApi } from '../api/projectApi'
import { raBillApi } from '../api/raBillApi'
import AppLayout from '../components/Layout/AppLayout'
import BillUploader from '../components/Bills/BillUploader'
import { ArrowLeft, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UploadBill() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedProjectId = searchParams.get('projectId')

  const [projects, setProjects]   = useState([])
  const [projectId, setProjectId] = useState(preselectedProjectId || '')
  const [file, setFile]           = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    projectApi.getAll()
      .then(r => setProjects(r.data))
      .catch(() => toast.error('Failed to load projects'))
  }, [])

  const handleUploadAndSubmit = async () => {
    if (!projectId) { toast.error('Please select a project'); return }
    if (!file)      { toast.error('Please select a file');   return }

    setUploading(true)
    try {
      // Step 1: upload file
      const uploadRes = await raBillApi.upload(projectId, file)
      const billId = uploadRes.data.id

      // Step 2: immediately submit for approval
      await raBillApi.submit(billId)

      toast.success('Bill uploaded and submitted for approval!')
      navigate(`/bills/${billId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Upload RA Bill</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select a project, upload your Excel file, and submit directly for approval.
        </p>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* Step 1: Project */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">1. Select project</h2>
          <select
            className="input"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            disabled={uploading}
          >
            <option value="">— Choose a project —</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                [{p.workKey}] {p.projectName} — {p.contractorName}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: File */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-2">2. Upload Excel file</h2>
          <p className="text-xs text-gray-400 mb-4">
            Supported formats: .xlsx, .xls — file will be sent directly for approval without preview.
          </p>
          <BillUploader onFileSelect={setFile} disabled={uploading} />
        </div>

        {/* Submit */}
        <button
          onClick={handleUploadAndSubmit}
          disabled={!file || !projectId || uploading}
          className="btn-primary flex items-center gap-2 w-full justify-center py-3"
        >
          <Send size={16} />
          {uploading ? 'Uploading & submitting...' : 'Upload & submit for approval'}
        </button>
      </div>
    </AppLayout>
  )
}
