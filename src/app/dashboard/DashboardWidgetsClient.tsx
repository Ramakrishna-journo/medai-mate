'use client'

import { useState, useMemo } from 'react'
import { Story } from '@/components/StoryTable'
import { Bell, Calendar, ExternalLink, ChevronDown, BarChart2 } from 'lucide-react'

export function DashboardWidgetsClient({ stories, events }: { stories: Story[], events: any[] }) {
  // --- 1. Publishing Deadlines Logic ---
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const getDayCategory = (eta: string) => {
    if (!eta) return 'other'
    const d = new Date(eta)
    d.setHours(0,0,0,0)
    if (d.getTime() === today.getTime()) return 'today'
    if (d.getTime() === tomorrow.getTime()) return 'tomorrow'
    return 'other'
  }

  const todayStories = stories.filter(s => getDayCategory(s.ETA) === 'today').slice(0, 5)
  const tomorrowStories = stories.filter(s => getDayCategory(s.ETA) === 'tomorrow').slice(0, 5)

  // --- 2. Event Planning Alerts Logic ---
  const [activeEventTab, setActiveEventTab] = useState('All')
  const eventTabs = ['All', 'Intl', 'Natl', 'Telugu']
  
  // Group events by tabs based on their type/name
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return []
    return events.filter(e => {
      if (activeEventTab === 'All') return true
      const type = (e.type || e.category || e.calendar || '').toLowerCase()
      const name = (e.name || '').toLowerCase()
      
      if (activeEventTab === 'Intl') {
        return type.includes('un observance') || type.includes('international') || name.includes('world') || name.includes('international')
      }
      if (activeEventTab === 'Natl') {
        return type.includes('national') || type.includes('public holiday') || type.includes('historical') || type.includes('festival')
      }
      if (activeEventTab === 'Telugu') {
        return type.includes('telugu') || name.includes('telangana') || name.includes('andhra')
      }
      return false
    }).slice(0, 5) // Take top 5
  }, [events, activeEventTab])


  // --- 3. Content Breakdown Logic ---
  const [breakdownFilter, setBreakdownFilter] = useState('Format')
  
  const breakdownData = useMemo(() => {
    const counts: Record<string, number> = {}
    stories.forEach(s => {
      const key = (s as any)[breakdownFilter] || 'Unassigned'
      counts[key] = (counts[key] || 0) + 1
    })
    
    const total = stories.length || 1
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        pct: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Show top 5
  }, [stories, breakdownFilter])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Widget 1: Publishing Deadlines */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e5ea] border-t-[4px] border-t-[#42a5f5] p-6 h-[420px] flex flex-col hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-[#42a5f5]" strokeWidth={2.5} />
          <h3 className="text-lg font-bold text-[#1d1d1f]">Publishing Deadlines</h3>
        </div>
        <p className="text-[13px] text-[#86868b] mb-5">Stories scheduled for publication today and tomorrow</p>
        
        <div className="flex gap-4 h-full overflow-hidden">
          {/* Today Column */}
          <div className="flex-1 flex flex-col min-w-0">
            <h4 className="text-[11px] font-bold text-[#424245] uppercase tracking-wider mb-3">Today</h4>
            <div className="space-y-3 overflow-y-auto pr-1 pb-4">
              {todayStories.length === 0 ? (
                <div className="text-[13px] text-[#86868b] italic">No deadlines today</div>
              ) : (
                todayStories.map((story, i) => (
                  <div key={story.Story_ID} className="bg-[#f5f5f7] border-l-4 border-l-[#0071e3] p-3 rounded-r-xl rounded-l-sm relative group hover:bg-[#ebebf0] transition-colors">
                    <div className="flex gap-3">
                      <span className="text-[#0071e3] font-semibold text-[14px]">{i + 1}</span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#1d1d1f] truncate pr-4">{story.Story_Title}</div>
                        <div className="text-[11px] text-[#86868b] truncate mt-0.5">{story.Reporter_Name || 'Unassigned'} • {story.Format}</div>
                      </div>
                    </div>
                    <button className="absolute right-2 top-3 text-[#86868b] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#0071e3]">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tomorrow Column */}
          <div className="flex-1 flex flex-col min-w-0">
            <h4 className="text-[11px] font-bold text-[#424245] uppercase tracking-wider mb-3">Tomorrow</h4>
            <div className="space-y-3 overflow-y-auto pr-1 pb-4">
              {tomorrowStories.length === 0 ? (
                <div className="text-[13px] text-[#86868b] italic">No deadlines tomorrow</div>
              ) : (
                tomorrowStories.map((story, i) => (
                  <div key={story.Story_ID} className="bg-white border border-[#e5e5ea] border-l-4 border-l-[#42a5f5] p-3 rounded-r-xl rounded-l-sm relative group hover:bg-[#f5f5f7] transition-colors shadow-sm">
                    <div className="flex gap-3">
                      <span className="text-[#42a5f5] font-semibold text-[14px]">{i + 1}</span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#1d1d1f] truncate pr-4">{story.Story_Title}</div>
                        <div className="text-[11px] text-[#86868b] truncate mt-0.5">{story.Reporter_Name || 'Unassigned'} • {story.Format}</div>
                      </div>
                    </div>
                    <button className="absolute right-2 top-3 text-[#86868b] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#0071e3]">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widget 2: Event Planning Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e5ea] border-t-[4px] border-t-[#5c6bc0] p-6 h-[420px] flex flex-col hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex gap-3 items-center">
            <Calendar className="w-5 h-5 text-[#5c6bc0]" strokeWidth={2.5} />
            <div>
              <h3 className="text-[16px] font-bold text-[#1d1d1f] leading-tight">Event Planning<br/>Alerts</h3>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex bg-[#f5f5f7] p-1 rounded-lg">
            {eventTabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveEventTab(tab)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  activeEventTab === tab ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[12px] text-[#86868b] mb-4 mt-2">Anniversaries in the next 14 days and planning alerts</p>
        
        <div className="space-y-3 overflow-y-auto pr-1 pb-4 flex-1">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#86868b]">
              <Calendar className="w-8 h-8 opacity-20 mb-2" />
              <div className="text-[13px]">No events found for "{activeEventTab}"</div>
            </div>
          ) : (
            filteredEvents.map((evt, i) => {
              // Extract date, title, cat
              const dateStr = evt.date || evt.start?.date || evt.start?.dateTime || new Date().toISOString()
              const d = new Date(dateStr)
              const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
              const day = d.getDate()
              const title = evt.name || evt.title || evt.summary || 'Unknown Event'
              const cat = evt.type || evt.category || evt.calendar || 'General'

              // Find stories mapped to this date
              const plannedStories = stories.filter(s => {
                if (!s.ETA) return false
                const storyD = new Date(s.ETA)
                return storyD.getFullYear() === d.getFullYear() && 
                       storyD.getMonth() === d.getMonth() && 
                       storyD.getDate() === d.getDate()
              })

              return (
                <div key={i} className="bg-white border border-[#e5e5ea] p-3 rounded-xl shadow-sm flex gap-3 relative overflow-hidden group flex-col">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center justify-center min-w-[40px]">
                      <span className="text-[16px] font-bold text-[#0071e3] leading-none">{day}</span>
                      <span className="text-[10px] font-semibold text-[#86868b] uppercase mt-0.5">{month}</span>
                    </div>
                    <div className="min-w-0 border-l border-[#e5e5ea] pl-3 py-0.5 flex-1">
                      <div className="text-[13px] font-semibold text-[#1d1d1f] pr-4 leading-tight">{title}</div>
                      <div className="text-[10px] font-medium text-[#0071e3] bg-[#0071e3]/10 px-1.5 py-0.5 rounded inline-block mt-1.5">{cat}</div>
                    </div>
                  </div>
                  
                  {plannedStories.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#f1f1f4] space-y-1.5">
                      {plannedStories.map((ps, idx) => (
                        <div key={idx} className="flex gap-1.5 items-start text-[11px] text-[#424245] bg-[#e8f5e9] p-1.5 rounded-lg border border-[#c8e6c9]">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#4caf50] text-white flex items-center justify-center mt-0.5 flex-shrink-0">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                          <div>
                            <span className="font-semibold text-[#2e7d32]">Planned: </span>
                            "{ps.Story_Title}" by {ps.Reporter_Name || 'Unassigned'} [ETA: {ps.ETA}]
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Widget 3: Content Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e5ea] border-t-[4px] border-t-[#26c6da] p-6 h-[420px] flex flex-col hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex gap-2 items-center">
            <BarChart2 className="w-5 h-5 text-[#26c6da]" strokeWidth={2.5} />
            <h3 className="text-lg font-bold text-[#1d1d1f] leading-tight">Content<br/>Breakdown</h3>
          </div>
          {/* Dropdown */}
          <div className="relative">
            <select 
              value={breakdownFilter}
              onChange={(e) => setBreakdownFilter(e.target.value)}
              className="appearance-none bg-white border border-[#d2d2d7] text-[#1d1d1f] text-[12px] font-medium rounded-lg px-3 py-1.5 pr-8 focus:outline-none hover:bg-[#f5f5f7] cursor-pointer shadow-sm"
            >
              <option value="Format">By Format</option>
              <option value="Type">By Type</option>
              <option value="Platform">By Platform</option>
              <option value="Genre">By Genre</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#86868b] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <p className="text-[12px] text-[#86868b] mb-6 mt-1">Live distribution metrics of planning stories</p>
        
        <div className="space-y-4 overflow-y-auto pr-1 pb-4 flex-1">
          {breakdownData.map((item, i) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="font-semibold text-[#1d1d1f] truncate pr-2">{item.name}</span>
                <span className="text-[#86868b] whitespace-nowrap">
                  <span className="font-medium text-[#424245]">{item.count}</span> ({item.pct}%)
                </span>
              </div>
              <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-[#26c6da] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
