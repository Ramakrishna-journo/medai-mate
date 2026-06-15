'use client'

import { useState, useMemo } from 'react'
import { Story } from '@/components/StoryTable'
import { VideoStory } from '../video-production/VideoTrackerClient'
import { Printer, ArrowLeft, ArrowRight, Calendar, AlertCircle, FileCheck, FileText, CheckCircle2 } from 'lucide-react'

export function WeeklyReportClient({ stories, videoStories }: { stories: Story[], videoStories: VideoStory[] }) {
  // Logic for filtering by week could be implemented here
  // For the sake of this feature, we will use all fetched data and display it as the "Current Week"

  const plannedCount = stories.length
  const filedCount = stories.filter(s => s.Status?.includes('Filed')).length
  const delayedCount = stories.filter(s => s.Status?.includes('Hold') || s.Status?.includes('Backlog') || s.Status?.includes('Revision')).length
  const publishedCount = stories.filter(s => s.Status?.includes('Published')).length

  const handlePrint = () => {
    window.print()
  }

  // Format Breakdown
  const formatCounts: Record<string, number> = {}
  stories.forEach(s => {
    if (s.Format) formatCounts[s.Format] = (formatCounts[s.Format] || 0) + 1
  })
  const formatDist = Object.entries(formatCounts)
    .map(([name, count]) => ({ name, count, pct: ((count / plannedCount) * 100).toFixed(0) }))
    .sort((a, b) => b.count - a.count)

  // Filing Logs
  const getReporterLog = () => {
    // Group by Reporter
    const grouped: Record<string, Story[]> = {}
    stories.forEach(s => {
      const reporter = s.Reporter_Name || 'Unassigned'
      if (!grouped[reporter]) grouped[reporter] = []
      grouped[reporter].push(s)
    })
    return Object.entries(grouped)
  }

  const getShootLog = () => {
    const grouped: Record<string, VideoStory[]> = {}
    videoStories.forEach(s => {
      const shooter = s.Shoot_Edit_Name || 'Unassigned'
      if (!grouped[shooter]) grouped[shooter] = []
      grouped[shooter].push(s)
    })
    return Object.entries(grouped)
  }

  const getVideoEditLog = () => {
    const grouped: Record<string, VideoStory[]> = {}
    videoStories.forEach(s => {
      const editor = s.Video_Edit_Name || 'Unassigned'
      if (!grouped[editor]) grouped[editor] = []
      grouped[editor].push(s)
    })
    return Object.entries(grouped)
  }

  return (
    <div className="space-y-8 pb-20 print:p-0 print:m-0 print:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f1f1f4] pb-6 print:pb-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Weekly Editorial Report</h1>
          <p className="text-[15px] font-normal text-[#86868b] mt-1.5">Executive summary for chief editor and editorial analysis reviews.</p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <div className="flex items-center bg-[#f5f5f7] rounded-lg p-1 border border-[#e5e5ea]">
            <button className="px-3 py-1.5 text-[13px] font-medium text-[#424245] hover:bg-white rounded-md transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <div className="px-4 py-1.5 text-[13px] font-semibold text-[#1d1d1f] flex items-center gap-2 border-x border-[#d2d2d7]/50">
              <Calendar className="w-4 h-4 text-[#86868b]" />
              Current Week
            </div>
            <button className="px-3 py-1.5 text-[13px] font-medium text-[#424245] hover:bg-white rounded-md transition-colors flex items-center gap-1.5">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d2d2d7] text-[#1d1d1f] font-medium text-[13px] rounded-lg hover:bg-[#f5f5f7] transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Planned Stories" value={plannedCount} subtitle="Based on Created_Date" icon={FileText} color="text-blue-500" bg="bg-blue-50" />
        <MetricCard title="Filed Stories" value={filedCount} subtitle="Based on Status: Filed" icon={FileCheck} color="text-teal-500" bg="bg-teal-50" />
        <MetricCard title="Delayed Stories" value={delayedCount} subtitle="Past ETA, Incomplete" icon={AlertCircle} color="text-red-500" bg="bg-red-50" />
        <MetricCard title="Published Stories" value={publishedCount} subtitle="Based on Status: Published" icon={CheckCircle2} color="text-green-600" bg="bg-green-50" />
      </div>

      {/* Format Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f1f1f4]">
        <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-4">Format Breakdown</h3>
        <div className="flex flex-wrap gap-4">
          {formatDist.map(fmt => (
            <div key={fmt.name} className="flex-1 min-w-[120px] bg-[#f5f5f7] p-3 rounded-xl border border-[#e5e5ea] text-center">
              <div className="text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">{fmt.name}</div>
              <div className="text-xl font-medium text-[#1d1d1f] mt-1">{fmt.count}</div>
              <div className="text-[12px] text-[#424245]">({fmt.pct}%)</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filing Logs */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f] border-b border-[#f1f1f4] pb-2">Reporter Filing Log</h2>
        {getReporterLog().map(([reporter, reporterStories]) => (
          <div key={reporter} className="bg-white rounded-xl shadow-sm border border-[#f1f1f4] overflow-hidden">
            <div className="px-5 py-3 bg-[#fafafc] border-b border-[#f1f1f4]">
              <span className="text-[13px] font-medium text-[#86868b]">Reporter:</span>
              <span className="ml-2 text-[15px] font-semibold text-[#1d1d1f]">{reporter}</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f1f1f4]">
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[120px]">Story ID</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase">Title</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[120px]">Format</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[140px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f1f4]">
                {reporterStories.map(s => (
                  <tr key={s.Story_ID}>
                    <td className="px-5 py-2 text-[13px] text-[#86868b]">{s.Story_ID}</td>
                    <td className="px-5 py-2 text-[14px] text-[#1d1d1f]">{s.Story_Title}</td>
                    <td className="px-5 py-2 text-[13px] text-[#424245]">{s.Format}</td>
                    <td className="px-5 py-2 text-[13px] text-[#424245]">{s.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Shoot Filing Log */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f] border-b border-[#f1f1f4] pb-2 mt-8">Shoot & Edit Filing Log</h2>
        {getShootLog().map(([shooter, shootStories]) => (
          <div key={shooter} className="bg-white rounded-xl shadow-sm border border-[#f1f1f4] overflow-hidden">
            <div className="px-5 py-3 bg-[#fafafc] border-b border-[#f1f1f4]">
              <span className="text-[13px] font-medium text-[#86868b]">Shoot Name:</span>
              <span className="ml-2 text-[15px] font-semibold text-[#1d1d1f]">{shooter}</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f1f1f4]">
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[120px]">Story ID</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase">Title</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[160px]">Platform</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[140px]">Shoot Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f1f4]">
                {shootStories.map(s => (
                  <tr key={s.Story_ID}>
                    <td className="px-5 py-2 text-[13px] text-[#86868b]">{s.Story_ID}</td>
                    <td className="px-5 py-2 text-[14px] text-[#1d1d1f]">{s.Story_Title}</td>
                    <td className="px-5 py-2 text-[13px] text-[#424245]">{s.Platform}</td>
                    <td className="px-5 py-2 text-[13px] text-[#424245]">{s.Shoot_Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Video Edit Filing Log */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f] border-b border-[#f1f1f4] pb-2 mt-8">Video Editor Filing Log</h2>
        {getVideoEditLog().map(([editor, editStories]) => (
          <div key={editor} className="bg-white rounded-xl shadow-sm border border-[#f1f1f4] overflow-hidden">
            <div className="px-5 py-3 bg-[#fafafc] border-b border-[#f1f1f4]">
              <span className="text-[13px] font-medium text-[#86868b]">Video Editor:</span>
              <span className="ml-2 text-[15px] font-semibold text-[#1d1d1f]">{editor}</span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f1f1f4]">
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[120px]">Story ID</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase">Title</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[160px]">Platform</th>
                  <th className="px-5 py-2 text-[11px] font-semibold text-[#86868b] uppercase w-[140px]">Edit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f1f4]">
                {editStories.map(s => (
                  <tr key={s.Story_ID}>
                    <td className="px-5 py-2 text-[13px] text-[#86868b]">{s.Story_ID}</td>
                    <td className="px-5 py-2 text-[14px] text-[#1d1d1f]">{s.Story_Title}</td>
                    <td className="px-5 py-2 text-[13px] text-[#424245]">{s.Platform}</td>
                    <td className="px-5 py-2 text-[13px] text-[#424245]">{s.Editing_Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#f1f1f4] print:border-[#d2d2d7] print:shadow-none">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg} ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">{title}</div>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-1">{value}</div>
      <div className="text-[12px] text-[#86868b]">{subtitle}</div>
    </div>
  )
}
