'use client'

import { useState, useMemo } from 'react'
import { Search, MonitorPlay, Settings2, PlayCircle, Clock, CheckCircle2, Video } from 'lucide-react'

export interface VideoStory {
  Story_ID: string
  Story_Title: string
  Platform: string
  Shoot_Status: string
  Editing_Status: string
  Shoot_Edit_Name: string
  Video_Edit_Name: string
}

export function VideoTrackerClient({ initialStories }: { initialStories: VideoStory[] }) {
  const [search, setSearch] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All')
  const [shootStatusFilter, setShootStatusFilter] = useState('All')
  const [editStatusFilter, setEditStatusFilter] = useState('All')
  const [shooterFilter, setShooterFilter] = useState('All')
  const [editorFilter, setEditorFilter] = useState('All')

  // Unique values for dropdowns
  const platforms = ['All', ...Array.from(new Set(initialStories.map(s => s.Platform).filter(Boolean)))]
  const shootStatuses = ['All', ...Array.from(new Set(initialStories.map(s => s.Shoot_Status).filter(Boolean)))]
  const editStatuses = ['All', ...Array.from(new Set(initialStories.map(s => s.Editing_Status).filter(Boolean)))]
  const shooters = ['All', ...Array.from(new Set(initialStories.map(s => s.Shoot_Edit_Name).filter(Boolean)))]
  const editors = ['All', ...Array.from(new Set(initialStories.map(s => s.Video_Edit_Name).filter(Boolean)))]

  // Filter Logic
  const filteredStories = useMemo(() => {
    return initialStories.filter(story => {
      const matchSearch = search === '' || 
        story.Story_Title?.toLowerCase().includes(search.toLowerCase()) ||
        story.Story_ID?.toLowerCase().includes(search.toLowerCase()) ||
        story.Shoot_Edit_Name?.toLowerCase().includes(search.toLowerCase()) ||
        story.Video_Edit_Name?.toLowerCase().includes(search.toLowerCase())
      
      const matchPlatform = platformFilter === 'All' || story.Platform === platformFilter
      const matchShootStatus = shootStatusFilter === 'All' || story.Shoot_Status === shootStatusFilter
      const matchEditStatus = editStatusFilter === 'All' || story.Editing_Status === editStatusFilter
      const matchShooter = shooterFilter === 'All' || story.Shoot_Edit_Name === shooterFilter
      const matchEditor = editorFilter === 'All' || story.Video_Edit_Name === editorFilter

      return matchSearch && matchPlatform && matchShootStatus && matchEditStatus && matchShooter && matchEditor
    })
  }, [initialStories, search, platformFilter, shootStatusFilter, editStatusFilter, shooterFilter, editorFilter])

  const getStatusBadge = (status: string) => {
    if (!status) return <span className="text-[#86868b]">-</span>
    
    if (status.includes('Completed') || status.includes('Published') || status.includes('Cleared') || status.includes('Filed')) {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#34c759]/10 text-[#248a3d] border border-[#34c759]/20"><CheckCircle2 className="w-3.5 h-3.5" /> {status}</span>
    }
    if (status.includes('Progress') || status.includes('Editing')) {
      return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#ff9f0a]/10 text-[#b56e00] border border-[#ff9f0a]/20"><PlayCircle className="w-3.5 h-3.5" /> {status}</span>
    }
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#f5f5f7] text-[#424245] border border-[#e5e5ea]"><Clock className="w-3.5 h-3.5" /> {status}</span>
  }

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Video Production Tracker</h1>
          <p className="text-[15px] font-normal text-[#86868b] mt-1.5">Track filming timelines, editor assignments, and audio-video status.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#f1f1f4] flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] min-w-[250px] flex-1 md:flex-none">
          <Search className="w-4 h-4 text-[#86868b]" />
          <input 
            placeholder="Quick Search ID, Title, Shooter..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[14px] w-full placeholder:text-[#86868b] text-[#1d1d1f]"
          />
        </div>
        
        <FilterSelect label="Platform" value={platformFilter} onChange={setPlatformFilter} options={platforms} />
        <FilterSelect label="Shoot Status" value={shootStatusFilter} onChange={setShootStatusFilter} options={shootStatuses} />
        <FilterSelect label="Edit Status" value={editStatusFilter} onChange={setEditStatusFilter} options={editStatuses} />
        <FilterSelect label="Shooter" value={shooterFilter} onChange={setShooterFilter} options={shooters} />
        <FilterSelect label="Video Editor" value={editorFilter} onChange={setEditorFilter} options={editors} />
      </div>

      {/* Video Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#f1f1f4] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f1f1f4] flex items-center justify-between bg-[#fafafc]">
          <h3 className="text-[14px] font-semibold text-[#86868b] uppercase tracking-wider">Filtered Video Assignments ({filteredStories.length})</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#424245] bg-white border border-[#d2d2d7] rounded-lg hover:bg-[#f5f5f7] transition-colors shadow-sm">
            <Settings2 className="w-3.5 h-3.5" />
            Manage View
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fbfbfd] border-b border-[#e5e5ea]">
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[120px]">Story ID</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Title & Platform</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[180px]">Shooter</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[160px]">Shoot Status</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[180px]">Editor</th>
                <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[160px]">Edit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f4]">
              {filteredStories.map((story) => (
                <tr key={story.Story_ID} className="hover:bg-[#f5f5f7]/50 transition-colors group">
                  <td className="px-6 py-4 text-[13px] font-medium text-[#86868b] group-hover:text-[#0071e3] transition-colors">
                    {story.Story_ID}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14.5px] font-medium text-[#1d1d1f] leading-tight mb-1">{story.Story_Title}</div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#86868b] font-light">
                      <MonitorPlay className="w-3.5 h-3.5" />
                      {story.Platform || 'Any Platform'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13.5px] text-[#1d1d1f] font-medium">{story.Shoot_Edit_Name || 'Unassigned'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(story.Shoot_Status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13.5px] text-[#1d1d1f] font-medium">{story.Video_Edit_Name || 'Unassigned'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(story.Editing_Status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1 px-1">{label}</span>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 px-3 py-0 bg-white border border-[#e5e5ea] rounded-xl text-[14px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] cursor-pointer"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt === 'All' ? `All ${label.includes('Status') ? 'Statuses' : label + 's'}` : opt}</option>
        ))}
      </select>
    </div>
  )
}
