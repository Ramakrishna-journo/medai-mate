'use client'

import { useState, useMemo } from 'react'
import { StoryTable, Story } from '@/components/StoryTable'
import { PlanningForm } from '@/components/PlanningForm'
import { Plus, Search, Filter } from 'lucide-react'

export function PipelineClient({ initialStories }: { initialStories: Story[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filter States
  const [search, setSearch] = useState('')
  const [formatFilter, setFormatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [reporterFilter, setReporterFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [regionFilter, setRegionFilter] = useState('All')

  // Extract unique values for filter dropdowns dynamically
  const formats = ['All', ...Array.from(new Set(initialStories.map(s => s.Format).filter(Boolean)))]
  const statuses = ['All', ...Array.from(new Set(initialStories.map(s => s.Status).filter(Boolean)))]
  const reporters = ['All', ...Array.from(new Set(initialStories.map(s => s.Reporter_Name).filter(Boolean)))]
  const types = ['All', ...Array.from(new Set(initialStories.map(s => s.Type).filter(Boolean)))]
  const regions = ['All', ...Array.from(new Set(initialStories.map(s => s.Region).filter(Boolean)))]

  // Filter Logic
  const filteredStories = useMemo(() => {
    return initialStories.filter(story => {
      const matchSearch = search === '' || 
        story.Story_Title?.toLowerCase().includes(search.toLowerCase()) ||
        story.Story_ID?.toLowerCase().includes(search.toLowerCase()) ||
        story.Reporter_Name?.toLowerCase().includes(search.toLowerCase())
      
      const matchFormat = formatFilter === 'All' || story.Format === formatFilter
      const matchStatus = statusFilter === 'All' || story.Status === statusFilter
      const matchReporter = reporterFilter === 'All' || story.Reporter_Name === reporterFilter
      const matchType = typeFilter === 'All' || story.Type === typeFilter
      const matchRegion = regionFilter === 'All' || story.Region === regionFilter

      return matchSearch && matchFormat && matchStatus && matchReporter && matchType && matchRegion
    })
  }, [initialStories, search, formatFilter, statusFilter, reporterFilter, typeFilter, regionFilter])

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Planning Pipeline</h1>
          <p className="text-[15px] font-normal text-[#86868b] mt-1.5">Track, filter, and manage story assignments.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 bg-[#0071e3] hover:bg-[#0077ED] text-white rounded-full font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Story
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#f1f1f4] flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f5f5f7] rounded-xl border border-[#e5e5ea] min-w-[250px] flex-1 md:flex-none">
          <Search className="w-4 h-4 text-[#86868b]" />
          <input 
            placeholder="Quick Search ID, Title, Reporter..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[14px] w-full placeholder:text-[#86868b] text-[#1d1d1f]"
          />
        </div>
        
        <FilterSelect label="Format" value={formatFilter} onChange={setFormatFilter} options={formats} />
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={statuses} />
        <FilterSelect label="Reporter" value={reporterFilter} onChange={setReporterFilter} options={reporters} />
        <FilterSelect label="Type" value={typeFilter} onChange={setTypeFilter} options={types} />
        <FilterSelect label="Region" value={regionFilter} onChange={setRegionFilter} options={regions} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#f1f1f4] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#f1f1f4] flex justify-between items-center bg-[#fafafc]">
          <h3 className="text-[14px] font-semibold text-[#86868b] uppercase tracking-wider">Filtered Results ({filteredStories.length})</h3>
        </div>
        <StoryTable stories={filteredStories} />
      </div>

      {/* Modal Popup */}
      <PlanningForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          // You might want to trigger a router.refresh() here to pull new data
          window.location.reload()
        }}
      />
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
          <option key={opt} value={opt}>{opt === 'All' ? `All ${label}s` : opt}</option>
        ))}
      </select>
    </div>
  )
}
