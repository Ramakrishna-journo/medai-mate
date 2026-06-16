import { getPlanningData } from '@/lib/api'
import { PipelineClient } from './PipelineClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Planning Pipeline | MedAI Mate',
}

export default async function PlanningPipelinePage() {
  const stories = await getPlanningData() || []

  return (
    <div className="max-w-[1600px] mx-auto p-8 animate-fade-in-up">
      <PipelineClient initialStories={stories} />
    </div>
  )
}
