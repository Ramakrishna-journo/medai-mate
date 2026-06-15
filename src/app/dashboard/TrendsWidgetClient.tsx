'use client'

import { useState, useMemo } from 'react'
import { Story } from '@/components/StoryTable'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Calendar as CalendarIcon } from 'lucide-react'

const COLORS = ['#0071e3', '#34c759', '#ff9f0a', '#ff3b30', '#af52de', '#ff2d55', '#5856d6', '#5ac8fa']

export function TrendsWidgetClient({ stories, externalTrends }: { stories: Story[], externalTrends?: any }) {
  const [parameter, setParameter] = useState('Type')
  const [activeRadarTab, setActiveRadarTab] = useState('google')
  
  // By default, last 14 days
  const today = new Date()
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(today.getDate() - 14)
  
  const [startDate, setStartDate] = useState(twoWeeksAgo.toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0])
  
  // State that actually triggers graph recalculation when "Apply" is clicked
  const [appliedDateRange, setAppliedDateRange] = useState({ start: startDate, end: endDate })

  const chartData = useMemo(() => {
    // 1. Filter by date range
    const start = new Date(appliedDateRange.start).getTime()
    const end = new Date(appliedDateRange.end).getTime() + 86400000 // include end day
    
    const validStories = stories.filter(s => {
      // Assuming we use Created_Date or ETA to track "when" the story happens. 
      // The prompt asks for a Trends graph. Usually Trends are based on Created_Date.
      const dVal = (s as any).Created_Date || s.ETA
      if (!dVal) return false
      const dTime = new Date(dVal).getTime()
      return dTime >= start && dTime <= end
    })

    // 2. Identify all unique dates in range
    const datesMap: Record<string, Record<string, number>> = {}
    const uniqueKeys = new Set<string>()

    validStories.forEach(s => {
      const dVal = (s as any).Created_Date || s.ETA
      const dateStr = new Date(dVal).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      
      // Determine the category key based on the selected parameter
      let catKey = 'Unknown'
      if (parameter === 'Type') catKey = s.Type || 'Other'
      if (parameter === 'Reporter Name') catKey = s.Reporter_Name || 'Unassigned'
      if (parameter === 'Format') catKey = s.Format || 'Other'
      if (parameter === 'Platform') catKey = (s as any).Platform || 'Other'
      if (parameter === 'Genre') catKey = (s as any).Genre || 'Other'
      if (parameter === 'Demographics') catKey = (s as any).Demographics || 'Other'

      uniqueKeys.add(catKey)

      if (!datesMap[dateStr]) datesMap[dateStr] = {}
      datesMap[dateStr][catKey] = (datesMap[dateStr][catKey] || 0) + 1
    })

    // Sort dates chronologically for X-axis
    const sortedDates = Object.keys(datesMap).sort((a, b) => new Date(`${a} 2026`).getTime() - new Date(`${b} 2026`).getTime())

    // 3. Format for Recharts
    const data = sortedDates.map(date => {
      const obj: any = { name: date }
      uniqueKeys.forEach(k => {
        obj[k] = datesMap[date][k] || 0
      })
      return obj
    })

    return { data, keys: Array.from(uniqueKeys).slice(0, 8) } // Limit to 8 lines max for visual clarity
  }, [stories, parameter, appliedDateRange])

  // Helper to render the active radar data
  const renderRadarContent = () => {
    let items: any[] = []
    
    if (activeRadarTab === 'google') {
      items = externalTrends?.googleTrends || []
    } else if (activeRadarTab === 'discover') {
      items = externalTrends?.discoverTrends || []
    } else if (activeRadarTab === 'twitter') {
      items = externalTrends?.twitterTrends || []
    } else if (activeRadarTab === 'youtube') {
      items = externalTrends?.youtubeTrends || []
    } else if (activeRadarTab === 'instagram') {
      items = externalTrends?.instagramTrends || []
    }

    if (!items || items.length === 0) {
      return <div className="text-[#86868b] italic p-4">No active trends available for this platform.</div>
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.map((item: any, idx: number) => {
          const title = item.title || item.name || item.hashtag
          const volume = item.volume || item.posts || '10K+'
          let link = item.link
          
          // Generate links for mocked platforms
          if (!link) {
            if (activeRadarTab === 'twitter') {
              link = `https://twitter.com/search?q=${encodeURIComponent(title)}`
            } else if (activeRadarTab === 'instagram') {
              link = `https://www.instagram.com/explore/tags/${title.replace('#', '')}/`
            } else {
              link = `https://www.google.com/search?q=${encodeURIComponent(title)}`
            }
          }

          return (
            <div key={idx} className="bg-[#fbfbfd] rounded-xl p-4 border border-[#e5e5ea] flex justify-between items-center hover:border-[#d2d2d7] hover:shadow-sm transition-all group">
              <a href={link} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 cursor-pointer block">
                <div className="text-[14px] font-semibold text-[#1d1d1f] truncate group-hover:text-[#0071e3] transition-colors">
                  {title}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-[#0071e3] font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {volume}
                </div>
              </a>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Real-Time Regional Trends Radar Widget (Moved to Top) */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5ea] p-6 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#34c759]/20 flex items-center justify-center relative">
              <div className="w-3 h-3 rounded-full bg-[#34c759] absolute"></div>
              <div className="w-3 h-3 rounded-full bg-[#34c759] animate-ping absolute"></div>
            </div>
            <h3 className="text-xl font-bold text-[#1d1d1f]">Real-Time Regional Trends Radar</h3>
          </div>
          
          <div className="flex flex-wrap gap-1 bg-[#f5f5f7] p-1 rounded-xl">
            <button 
              onClick={() => setActiveRadarTab('google')}
              className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${activeRadarTab === 'google' ? 'bg-white text-[#26a69a] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              Google Search
            </button>
            <button 
              onClick={() => setActiveRadarTab('discover')}
              className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${activeRadarTab === 'discover' ? 'bg-white text-[#0071e3] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              AP & TG Discover
            </button>
            <button 
              onClick={() => setActiveRadarTab('twitter')}
              className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${activeRadarTab === 'twitter' ? 'bg-white text-[#5c6bc0] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              Twitter (X)
            </button>
            <button 
              onClick={() => setActiveRadarTab('youtube')}
              className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${activeRadarTab === 'youtube' ? 'bg-white text-[#ff3b30] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              YouTube Trends
            </button>
            <button 
              onClick={() => setActiveRadarTab('instagram')}
              className={`px-4 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${activeRadarTab === 'instagram' ? 'bg-white text-[#ab47bc] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            >
              Instagram Trends
            </button>
          </div>
        </div>

        {/* Radar Tab Content Grid */}
        {renderRadarContent()}
      </div>

      {/* Trends Graph Widget (Moved to Bottom) */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e5ea] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1d1d1f]" />
            <h3 className="text-xl font-bold text-[#1d1d1f]">Trends</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="text-[#86868b]">Parameter:</span>
              <select 
                value={parameter}
                onChange={(e) => setParameter(e.target.value)}
                className="appearance-none bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] font-medium rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] shadow-sm relative cursor-pointer"
              >
                <option value="Type">Type</option>
                <option value="Reporter Name">Reporter Name</option>
                <option value="Format">Format</option>
                <option value="Platform">Platform</option>
                <option value="Genre">Genre</option>
                <option value="Demographics">Demographics</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[#86868b]">Range:</span>
              <div className="flex items-center gap-2 bg-[#f5f5f7] border border-[#d2d2d7] rounded-lg px-3 py-1 shadow-sm">
                <CalendarIcon className="w-3.5 h-3.5 text-[#0071e3]" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none text-[#1d1d1f] font-medium focus:outline-none w-28"
                />
              </div>
              <span className="text-[#86868b]">to</span>
              <div className="flex items-center gap-2 bg-[#f5f5f7] border border-[#d2d2d7] rounded-lg px-3 py-1 shadow-sm">
                <CalendarIcon className="w-3.5 h-3.5 text-[#0071e3]" />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none text-[#1d1d1f] font-medium focus:outline-none w-28"
                />
              </div>
              <button 
                onClick={() => setAppliedDateRange({ start: startDate, end: endDate })}
                className="px-4 py-1.5 bg-[#0071e3] text-white font-medium rounded-lg hover:bg-[#0077ED] transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {chartData.data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#86868b]">
              <TrendingUp className="w-10 h-10 opacity-20 mb-2" />
              <span>No trend data available for this range.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5ea" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#86868b', fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#86868b', fontSize: 12 }} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e5ea', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 500 }}
                  itemStyle={{ fontSize: '13px' }}
                  labelStyle={{ color: '#86868b', fontSize: '12px', marginBottom: '4px' }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} 
                />
                {chartData.keys.map((key, index) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
