'use client'

import { useState } from 'react'
import { createPlanningStory } from '@/lib/api'
import { CheckCircle2, Loader2, CalendarPlus } from 'lucide-react'

// Options mapped from Google Sheets Validation
const REGIONS = ['Global', 'NA', 'Andhra Pradesh', 'Telangana', 'Rayalaseema', 'North Andhra', 'Hyderabad']
const FORMATS = ['Text', 'Video', 'Multimedia', 'Reel', 'Short', 'Live', 'Podcast']
const TYPES = ['Feature', 'Interview', 'Explainer', 'Perspective', 'Ground Report', 'Listicle', 'Breaking', 'TV/Video Package', 'Short', 'Educate Me']
const GENRES = ['Education', 'Entertainment', 'Crime', 'Politics', 'Health', 'Personal Finance', 'Business', 'Technology', 'Climate Change', 'Agriculture', 'Space', 'Travel', 'Spiritual', 'General']
const PLATFORMS = ['Website', 'App', 'YouTube', 'Facebook', 'Instagram', 'Twitter', 'Newsletter', 'TV', 'Social', 'Web']
const DEMOGRAPHICS = ['Youth', 'Women', 'Seniors', 'Rural', 'Urban', 'NRI', 'LGBTQ', 'General', 'Other']

export function PlanningForm({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    reporterName: '',
    reporterEmail: '',
    region: 'Global',
    format: 'Text',
    type: 'Feature',
    genre: 'General',
    platform: 'Website',
    demographics: 'General',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await createPlanningStory(formData)
      setSuccess(true)
      setFormData({ ...formData, title: '' })
      
      if (onSuccess) {
        onSuccess()
      }
      
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create story')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#f1f1f4] overflow-hidden w-full max-w-4xl relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="bg-gradient-to-r from-[#0071e3] to-[#42a1f5] px-8 py-6 flex items-center gap-3">
        <CalendarPlus className="w-6 h-6 text-white" />
        <h2 className="text-xl font-medium text-white">Create New Assignment</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Success Banner */}
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-medium">Story successfully pushed to live Google Sheet!</p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-4">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Primary Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-[13px] font-semibold text-[#86868b] mb-2 uppercase tracking-wider">Story Title</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Impact of AI on Modern Newsrooms..."
              className="w-full h-12 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all text-[15px] text-[#1d1d1f] placeholder:text-[#86868b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-semibold text-[#86868b] mb-2 uppercase tracking-wider">Reporter Name</label>
              <input 
                required
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full h-12 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all text-[15px] text-[#1d1d1f]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#86868b] mb-2 uppercase tracking-wider">Reporter Email</label>
              <input 
                required
                type="email"
                name="reporterEmail"
                value={formData.reporterEmail}
                onChange={handleChange}
                placeholder="john.doe@newsroom.com"
                className="w-full h-12 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all text-[15px] text-[#1d1d1f]"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#f1f1f4]" />

        {/* Metadata Grid */}
        <div className="grid grid-cols-3 gap-6">
          <SelectField label="Region" name="region" value={formData.region} onChange={handleChange} options={REGIONS} />
          <SelectField label="Format" name="format" value={formData.format} onChange={handleChange} options={FORMATS} />
          <SelectField label="Type" name="type" value={formData.type} onChange={handleChange} options={TYPES} />
          <SelectField label="Genre" name="genre" value={formData.genre} onChange={handleChange} options={GENRES} />
          <SelectField label="Platform" name="platform" value={formData.platform} onChange={handleChange} options={PLATFORMS} />
          <SelectField label="Demographics" name="demographics" value={formData.demographics} onChange={handleChange} options={DEMOGRAPHICS} />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 px-6 text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full font-medium transition-all"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="h-12 px-8 bg-[#0071e3] hover:bg-[#0077ED] text-white rounded-full font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Push to Live Sheet'
            )}
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}

function SelectField({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#86868b] mb-2 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select 
          name={name}
          value={value}
          onChange={onChange}
          className="w-full h-12 px-4 appearance-none rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 transition-all text-[15px] text-[#1d1d1f] cursor-pointer"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {/* Custom Caret */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
