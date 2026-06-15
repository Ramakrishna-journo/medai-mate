'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  CalendarDays, 
  Video, 
  Settings, 
  LogOut,
  HelpCircle,
  KanbanSquare,
  PieChart,
  FileText
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Planning Pipeline', href: '/dashboard/planning-pipeline', icon: CalendarDays },
    { name: 'Process Board', href: '/dashboard/process-board', icon: KanbanSquare },
    { name: 'Video Production', href: '/dashboard/video-production', icon: Video },
    { name: 'Story Matrix', href: '/dashboard/story-matrix', icon: PieChart },
    { name: 'Weekly Report', href: '/dashboard/weekly-report', icon: FileText },
  ]

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-[#f1f1f4] h-screen flex flex-col fixed left-0 top-0 z-40 transition-all">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-[#f1f1f4]">
        <div className="flex items-center gap-3">
          <Image src="/logo-copilot.png" alt="MedAI Mate Logo" width={26} height={26} className="object-contain" />
          <div className="font-medium text-lg tracking-normal text-[#1d1d1f]">
            Med<span className="text-[#0071e3] font-semibold">AI</span> Mate
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-3 px-2">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#0071e3]/10 text-[#0071e3] font-medium' 
                  : 'text-[#424245] hover:bg-[#f5f5f7] font-normal hover:text-[#1d1d1f]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#0071e3]' : 'text-[#86868b] group-hover:text-[#1d1d1f]'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[14.5px]">{item.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-[#f1f1f4] space-y-1">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#424245] hover:bg-[#f5f5f7] transition-all duration-200 group">
          <Settings className="w-5 h-5 text-[#86868b] group-hover:text-[#1d1d1f]" strokeWidth={2} />
          <span className="text-[14.5px] font-normal group-hover:text-[#1d1d1f]">Settings</span>
        </Link>
        <Link href="/dashboard/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#424245] hover:bg-[#f5f5f7] transition-all duration-200 group">
          <HelpCircle className="w-5 h-5 text-[#86868b] group-hover:text-[#1d1d1f]" strokeWidth={2} />
          <span className="text-[14.5px] font-normal group-hover:text-[#1d1d1f]">Help Center</span>
        </Link>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#ce0500]/80 hover:bg-[#fff0f0] transition-all duration-200 group mt-2">
          <LogOut className="w-5 h-5 group-hover:text-[#ce0500]" strokeWidth={2} />
          <span className="text-[14.5px] font-normal group-hover:text-[#ce0500]">Log out</span>
        </Link>
      </div>
    </aside>
  )
}
