import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { FloatingAIWidget } from '@/components/FloatingAIWidget'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#fafafc] font-sans flex text-[#1d1d1f]">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
          <FloatingAIWidget />
        </main>
      </div>
    </div>
  )
}
