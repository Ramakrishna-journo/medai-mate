import { getPlanningData, getVideoData } from '@/lib/api'
import { Story } from '@/components/StoryTable'
import { VideoStory } from '../video-production/VideoTrackerClient'

export const metadata = {
  title: 'Story Matrix | MedAI Mate',
}

export default async function StoryMatrixPage() {
  const stories: Story[] = await getPlanningData() || []
  const videoStories: VideoStory[] = await getVideoData() || []

  const totalStories = stories.length

  // Aggregation Helper
  const getDistribution = (data: any[], key: string) => {
    const counts: Record<string, number> = {}
    data.forEach(item => {
      const val = item[key]
      if (val) counts[val] = (counts[val] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalStories > 0 ? ((count / totalStories) * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => b.count - a.count)
  }

  // Calculate Distributions
  const formatDist = getDistribution(stories, 'Format')
  const genreDist = getDistribution(stories, 'Genre')
  const typeDist = getDistribution(stories, 'Type')
  const platformDist = getDistribution(stories, 'Platform')
  const regionDist = getDistribution(stories, 'Region')
  const reporterDist = getDistribution(stories, 'Reporter_Name')
  const demoDist = getDistribution(stories, 'Demographics')
  
  // Video specific distributions (percentage relative to total video stories)
  const totalVideo = videoStories.length
  const getVideoDist = (key: string) => {
    const counts: Record<string, number> = {}
    videoStories.forEach(item => {
      const val = (item as any)[key]
      if (val) counts[val] = (counts[val] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalVideo > 0 ? ((count / totalVideo) * 100).toFixed(1) : '0.0'
      }))
      .sort((a, b) => b.count - a.count)
  }
  
  const shootDist = getVideoDist('Shoot_Edit_Name')
  const editDist = getVideoDist('Video_Edit_Name')

  return (
    <div className="max-w-[1600px] mx-auto p-8 space-y-8 animate-fade-in-up">
      {/* Header Area */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Story Matrix Analytics</h1>
        <p className="text-[15px] font-normal text-[#86868b] mt-1.5">Detailed story metrics and format-wise percentage distributions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <DistributionCard title="Story Format Breakdown" data={formatDist} total={totalStories} />
        <DistributionCard title="Story Genre Breakdown" data={genreDist} total={totalStories} />
        <DistributionCard title="Story Type Breakdown" data={typeDist} total={totalStories} />
        <DistributionCard title="Platform Distribution" data={platformDist} total={totalStories} />
        <DistributionCard title="Region Distribution" data={regionDist} total={totalStories} />
        <DistributionCard title="Reporter Contribution" data={reporterDist} total={totalStories} />
        <DistributionCard title="Target Demographics" data={demoDist} total={totalStories} />
        <DistributionCard title="Shoot Editor Contribution" data={shootDist} total={totalVideo} subtitle="(Video Only)" />
        <DistributionCard title="Video Editor Contribution" data={editDist} total={totalVideo} subtitle="(Video Only)" />
      </div>
    </div>
  )
}

function DistributionCard({ title, subtitle, data, total }: { title: string, subtitle?: string, data: any[], total: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#f1f1f4] flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-[#f1f1f4] bg-[#fafafc]">
        <h3 className="text-[16px] font-semibold text-[#1d1d1f] leading-tight">{title}</h3>
        {subtitle && <p className="text-[13px] text-[#86868b]">{subtitle}</p>}
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto max-h-[300px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#86868b] text-[14px]">No data available</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#f1f1f4]">
                <th className="pb-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Category</th>
                <th className="pb-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider text-right">Stories</th>
                <th className="pb-3 text-[12px] font-semibold text-[#86868b] uppercase tracking-wider text-right w-[80px]">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f4]">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-[#f5f5f7]/50 transition-colors">
                  <td className="py-3 text-[14px] font-medium text-[#1d1d1f]">{row.name}</td>
                  <td className="py-3 text-[14px] font-light text-[#424245] text-right">{row.count}</td>
                  <td className="py-3 text-[13px] font-semibold text-[#0071e3] text-right">{row.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
