import { getPlanningData, getVideoData } from '@/lib/api'
import { WeeklyReportClient } from './WeeklyReportClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Weekly Report | MedAI Mate',
}

export default async function WeeklyReportPage() {
  const stories = await getPlanningData() || []
  const videoStories = await getVideoData() || []

  return (
    <div className="max-w-[1200px] mx-auto p-8 animate-fade-in-up">
      <WeeklyReportClient stories={stories} videoStories={videoStories} />
    </div>
  )
}
