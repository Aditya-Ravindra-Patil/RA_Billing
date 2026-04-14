import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X } from 'lucide-react'

export default function BillUploader({ onFileSelect, disabled }) {
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const inputRef = useRef()

  const accept = '.xlsx,.xls'

  const handleFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls'].includes(ext)) {
      alert('Please upload an Excel file (.xlsx or .xls)')
      return
    }
    setFile(f)
    onFileSelect(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const clearFile = () => {
    setFile(null)
    onFileSelect(null)
    inputRef.current.value = ''
  }

  return (
    <div>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
            ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="mx-auto mb-3 text-gray-400" size={36} />
          <p className="text-sm font-medium text-gray-700">
            Drag & drop your RA Bill Excel file here
          </p>
          <p className="text-xs text-gray-500 mt-1">or click to browse — .xlsx / .xls only</p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 border border-green-200 bg-green-50 rounded-xl px-4 py-3">
          <FileSpreadsheet className="text-green-600 shrink-0" size={24} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">{file.name}</p>
            <p className="text-xs text-green-600">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={clearFile} className="text-green-500 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
