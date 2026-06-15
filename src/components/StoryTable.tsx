'use client'

import { MoreHorizontal, FileText, Video, Radio, Type, Filter, ChevronDown, CheckCircle2, Clock, PlayCircle } from 'lucide-react'

export interface Story {
  Story_ID: string
  Story_Title: string
  Reporter_Name: string
  Format: string
  Type: string
  ETA: string
  Status: string
}

interface StoryTableProps {
  stories: Story[]
}

export function StoryTable({ stories }: StoryTableProps) {
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Published':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#34c759]/10 text-[#248a3d] border border-[#34c759]/20"><CheckCircle2 className="w-3.5 h-3.5" /> Published</span>
      case 'Cleared':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#34c759]/10 text-[#248a3d] border border-[#34c759]/20">Cleared</span>
      case 'Filed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20">Filed</span>
      case 'In Progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#ff9f0a]/10 text-[#b56e00] border border-[#ff9f0a]/20"><PlayCircle className="w-3.5 h-3.5" /> In Progress</span>
      case 'Assigned':
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#f5f5f7] text-[#424245] border border-[#e5e5ea]"><Clock className="w-3.5 h-3.5" /> Assigned</span>
    }
  }

  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'Video':
      case 'Multimedia':
      case 'TV/Video Package':
        return <Video className="w-4 h-4 text-[#86868b]" />
      case 'Live':
        return <Radio className="w-4 h-4 text-[#ce0500]" />
      case 'Short':
      case 'Reel':
        return <Type className="w-4 h-4 text-[#0071e3]" />
      case 'Text':
      default:
        return <FileText className="w-4 h-4 text-[#86868b]" />
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#e5e5ea] overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-[#e5e5ea] flex items-center justify-between bg-white/50 backdrop-blur-md">
        <h2 className="text-[17px] font-medium text-[#1d1d1f]">Active Assignments</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#424245] bg-white border border-[#d2d2d7] rounded-lg hover:bg-[#f5f5f7] transition-colors shadow-sm">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-[#424245] bg-white border border-[#d2d2d7] rounded-lg hover:bg-[#f5f5f7] transition-colors shadow-sm">
            Sort by: ETA
            <ChevronDown className="w-3.5 h-3.5 text-[#86868b]" />
          </button>
          <button className="px-4 py-1.5 text-[13px] font-medium text-white bg-[#0071e3] rounded-lg hover:bg-[#0077ED] transition-colors shadow-sm active:scale-95">
            + New Story
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fbfbfd] border-b border-[#e5e5ea]">
              <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[120px]">Story ID</th>
              <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Title</th>
              <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[160px]">Format</th>
              <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[160px]">Reporter</th>
              <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[140px]">ETA</th>
              <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[160px]">Status</th>
              <th className="px-6 py-3.5 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider w-[60px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f1f4]">
            {(stories || []).map((story) => (
              <tr key={story.Story_ID} className="hover:bg-[#f5f5f7]/50 transition-colors group cursor-pointer">
                <td className="px-6 py-4 text-[13px] font-medium text-[#86868b] group-hover:text-[#0071e3] transition-colors">
                  {story.Story_ID}
                </td>
                <td className="px-6 py-4">
                  <div className="text-[14.5px] font-medium text-[#1d1d1f] leading-tight mb-1">{story.Story_Title}</div>
                  <div className="text-[12px] text-[#86868b] font-light">{story.Type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-[13px] text-[#424245]">
                    {getFormatIcon(story.Format)}
                    {story.Format}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e5e5ea] to-[#d2d2d7] flex items-center justify-center text-[#424245] text-[10px] font-semibold uppercase">
                      {story.Reporter_Name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-[13.5px] text-[#1d1d1f] font-medium">{story.Reporter_Name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[13.5px] text-[#424245] font-light">
                  {(() => {
                    if (!story.ETA) return '-';
                    // Check if it's in DD/MM/YY format
                    const parts = story.ETA.split('/');
                    if (parts.length === 3) {
                      const day = parseInt(parts[0], 10);
                      const month = parseInt(parts[1], 10) - 1;
                      const year = parseInt(parts[2], 10) + (parts[2].length === 2 ? 2000 : 0);
                      return new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                    // Fallback for standard ISO formats
                    const date = new Date(story.ETA);
                    return isNaN(date.getTime()) ? story.ETA : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  })()}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(story.Status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#e5e5ea] rounded-md transition-all opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-[#e5e5ea] flex items-center justify-between bg-[#fbfbfd]">
        <div className="text-[13px] text-[#86868b] font-light">Showing <span className="font-medium text-[#424245]">1-7</span> of <span className="font-medium text-[#424245]">30</span> stories</div>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 text-[13px] font-medium text-[#86868b] border border-[#e5e5ea] rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1.5 text-[13px] font-medium text-[#1d1d1f] border border-[#d2d2d7] bg-white rounded-md hover:bg-[#f5f5f7] transition-colors shadow-sm">Next</button>
        </div>
      </div>
    </div>
  )
}
