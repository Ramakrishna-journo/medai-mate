import { getVideoData } from '@/lib/api'
import { VideoTrackerClient } from './VideoTrackerClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Video Production Tracker | MedAI Mate',
}

export default async function VideoProductionPage() {
  const videoStories = await getVideoData() || []

  return (
    <div className="max-w-[1600px] mx-auto p-8 animate-fade-in-up">
      <VideoTrackerClient initialStories={videoStories} />
    </div>
  )
}
