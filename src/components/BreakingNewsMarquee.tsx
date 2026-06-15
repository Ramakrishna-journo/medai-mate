'use client'

import { useState, useEffect } from 'react'
import { Zap, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

export function BreakingNewsMarquee({ news }: { news: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Auto scroll marquee
  useEffect(() => {
    if (news.length === 0 || isModalOpen) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [news.length, isModalOpen])

  if (!news || news.length === 0) return null

  const currentNews = news[currentIndex]

  const nextNews = () => setCurrentIndex((prev) => (prev + 1) % news.length)
  const prevNews = () => setCurrentIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1))

  return (
    <>
      {/* Marquee Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e5ea] p-2 grid grid-cols-[auto_1fr_auto] items-center gap-4 mb-6 w-full">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ff3b30] hover:bg-[#d70015] transition-colors text-white px-4 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-[12px] font-bold tracking-widest uppercase">Breaking</span>
        </button>

        <div className="overflow-hidden">
          <div className="text-[14px] font-semibold text-[#1d1d1f] truncate animate-fade-in" key={currentIndex}>
            {currentNews?.title}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a 
            href={currentNews?.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#fbfbfd] border border-[#d2d2d7] text-[#424245] text-[12px] font-semibold rounded-lg hover:bg-[#f5f5f7] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Read
          </a>
          <div className="flex items-center border border-[#d2d2d7] rounded-lg overflow-hidden bg-[#fbfbfd]">
            <button onClick={prevNews} className="p-1.5 hover:bg-[#e5e5ea] transition-colors border-r border-[#d2d2d7]">
              <ChevronLeft className="w-4 h-4 text-[#424245]" />
            </button>
            <button onClick={nextNews} className="p-1.5 hover:bg-[#e5e5ea] transition-colors">
              <ChevronRight className="w-4 h-4 text-[#424245]" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Breaking News Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 pb-4 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="bg-[#ff3b30]/10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#ff3b30] fill-current" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#1d1d1f]">Live Breaking News Tracker</h2>
                  <p className="text-[13px] text-[#86868b] mt-0.5">Aggregated from English, Telugu, and Hindi feeds across India, AP, and TS.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrolling List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar relative">
              <div className="flex flex-col gap-3 mt-2">
                {news.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-xl border border-[#e5e5ea] hover:border-[#d2d2d7] hover:shadow-sm transition-all group flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#ff3b30]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[13px] font-bold text-[#ff3b30]">{idx + 1}</span>
                    </div>
                    <div className="flex-1 mt-0.5">
                      <h4 className="text-[14px] font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2.5 text-[11px] font-medium text-[#86868b]">
                        <span className="bg-[#f5f5f7] px-2 py-1 rounded border border-[#e5e5ea]">{item.source || 'News Source'}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
