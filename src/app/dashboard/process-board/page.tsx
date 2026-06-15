import { KanbanSquare } from 'lucide-react'

export const metadata = {
  title: 'Process Board | MedAI Mate',
}

export default function ProcessBoardPage() {
  return (
    <div className="max-w-[1600px] mx-auto p-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">Process Board</h1>
          <p className="text-[15px] font-normal text-[#86868b] mt-1.5">Kanban view of your editorial pipeline.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-[#f1f1f4] p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-4">
          <KanbanSquare className="w-8 h-8 text-[#86868b]" />
        </div>
        <h2 className="text-xl font-medium text-[#1d1d1f] mb-2">Process Board Coming Soon</h2>
        <p className="text-[#86868b] max-w-md">The drag-and-drop Kanban interface for the editorial pipeline is currently under construction. Stay tuned!</p>
      </div>
    </div>
  )
}
