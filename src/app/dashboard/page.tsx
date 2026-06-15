import { StoryTable, Story } from '@/components/StoryTable'
import { getPlanningData, getDashboardExtraData } from '@/lib/api'
import { fetchIndependentTrends, fetchBreakingNews } from '@/lib/trends'
import { DashboardWidgetsClient } from './DashboardWidgetsClient'
import { TrendsWidgetClient } from './TrendsWidgetClient'
import { BreakingNewsMarquee } from '@/components/BreakingNewsMarquee'
import { 
  FileText, 
  ClipboardList, 
  Hourglass, 
  MessageSquareWarning, 
  ShieldCheck, 
  Rocket, 
  Monitor, 
  CheckCheck, 
  CheckSquare,
  Flag,
  MessageSquare,
  CheckCircle2
} from 'lucide-react'

export const metadata = {
  title: 'Dashboard | MedAI Mate',
}

export const dynamic = 'force-dynamic' // Bypass aggressive Next.js caching

export default async function DashboardPage() {
  const stories: Story[] = await getPlanningData() || []
  const extraData = await getDashboardExtraData() || {}
  
  // Fetch independent real-time feeds concurrently
  const [externalTrends, breakingNews] = await Promise.all([
    fetchIndependentTrends(),
    fetchBreakingNews()
  ])

  // Dynamic calculations for Command Center
  const totalStories = stories.length
  const totalAssigned = stories.filter(s => s.Status?.includes('Assigned')).length
  const totalFiled = stories.filter(s => s.Status?.includes('Filed')).length
  const totalFeedback = stories.filter(s => s.Status?.includes('Revision') || s.Status?.includes('Feedback')).length
  const totalCleared = stories.filter(s => s.Status?.includes('Cleared') || s.Status?.includes('Approved')).length
  const readyToPublish = stories.filter(s => s.Status?.includes('Ready')).length
  const totalAtDesk = stories.filter(s => s.Status?.includes('Desk') || s.Status?.includes('Polishing')).length
  const totalPublished = stories.filter(s => s.Status?.includes('Published')).length

  const commandCenterStats = [
    { label: 'Total Stories', value: totalStories, icon: FileText, color: 'text-[#42a5f5]', borderTop: 'border-t-[#42a5f5]', subIcon: CheckSquare, subText: 'Overall Database' },
    { label: 'Total Assigned', value: totalAssigned, icon: ClipboardList, color: 'text-[#5c6bc0]', borderTop: 'border-t-[#5c6bc0]', subIcon: ClipboardList, subText: 'Backlog Queue' },
    { label: 'Total Filed', value: totalFiled, icon: Hourglass, color: 'text-[#ffa726]', borderTop: 'border-t-[#ffa726]', subIcon: Flag, subText: 'Pending Review' },
    { label: 'Total Feedback', value: totalFeedback, icon: MessageSquareWarning, color: 'text-[#ec407a]', borderTop: 'border-t-[#ec407a]', subIcon: MessageSquare, subText: 'Needs Revisions' },
    { label: 'Total Cleared', value: totalCleared, icon: ShieldCheck, color: 'text-[#26a69a]', borderTop: 'border-t-[#26a69a]', subIcon: ShieldCheck, subText: 'Copy Approved' },
    { label: 'Ready to Publish', value: readyToPublish, icon: Rocket, color: 'text-[#26c6da]', borderTop: 'border-t-[#26c6da]', subIcon: CheckCircle2, subText: 'Cleared for Launch' },
    { label: 'Total At Desk', value: totalAtDesk, icon: Monitor, color: 'text-[#ab47bc]', borderTop: 'border-t-[#ab47bc]', subIcon: Monitor, subText: 'Final Polishing' },
    { label: 'Total Published', value: totalPublished, icon: CheckCheck, color: 'text-[#66bb6a]', borderTop: 'border-t-[#66bb6a]', subIcon: CheckCircle2, subText: 'Live Online' },
  ]

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8 bg-[#fbfbfd] min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Editorial Command Center</h1>
          <p className="text-[15px] font-normal text-[#86868b] mt-1.5">Real-time analytical performance & metrics</p>
        </div>
      </div>

      {/* Breaking News Marquee */}
      <BreakingNewsMarquee news={breakingNews} />

      {/* Command Center Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {commandCenterStats.map((stat, i) => (
          <div key={i} className={`bg-white p-5 rounded-xl shadow-sm border border-[#e5e5ea] border-t-[4px] ${stat.borderTop} flex flex-col justify-between hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-medium text-[#424245]">{stat.label}</div>
              <div className={`${stat.color}`}>
                <stat.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <div className="text-[36px] font-bold tracking-tight text-[#1d1d1f] leading-none mb-3">{stat.value}</div>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#86868b]">
                <stat.subIcon className="w-3.5 h-3.5" />
                <span>{stat.subText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Layout Grid */}
      <DashboardWidgetsClient stories={stories} events={extraData.calendarEvents || []} />

      {/* Trends & Radar */}
      <TrendsWidgetClient stories={stories} externalTrends={externalTrends} />
    </div>
  )
}
