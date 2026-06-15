'use client'

import { Search, Bell, UserCircle } from 'lucide-react'

export function Header() {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[#f1f1f4] flex items-center justify-between px-8 sticky top-0 z-30 transition-all">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] group-focus-within:text-[#0071e3] transition-colors" strokeWidth={2} />
        <input 
          type="text" 
          placeholder="Search stories, reporters, or insights..." 
          className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] border border-transparent rounded-full text-[14px] text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:bg-white focus:border-[#0071e3]/30 focus:ring-4 focus:ring-[#0071e3]/10 transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#86868b] bg-white border border-[#e5e5ea] rounded shadow-sm">⌘</kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-[#86868b] bg-white border border-[#e5e5ea] rounded shadow-sm">K</kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5 ml-4">
        <button className="relative p-2 text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-full transition-all">
          <Bell className="w-5 h-5" strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#ce0500] border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-[#e5e5ea]"></div>

        <button className="flex items-center gap-2 pl-2 p-1 pr-3 hover:bg-[#f5f5f7] rounded-full transition-all border border-transparent hover:border-[#e5e5ea]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0071e3] to-[#409cff] flex items-center justify-center text-white shadow-sm">
            <span className="text-sm font-medium">AM</span>
          </div>
          <span className="text-[14px] font-medium text-[#1d1d1f] hidden sm:block">Admin User</span>
        </button>
      </div>
    </header>
  )
}
