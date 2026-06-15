import { LoginForm } from '@/components/LoginForm'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/30 blur-[120px] animate-float" />
      </div>

      {/* Top Navigation Bar Mockup */}
      <nav className="absolute top-0 w-full h-16 bg-white/60 backdrop-blur-xl border-b border-[#f1f1f4] flex items-center px-10 z-50 transition-all duration-500">
        <div className="flex items-center gap-3">
          <Image src="/logo-copilot.png" alt="MedAI Mate Logo" width={28} height={28} className="object-contain" />
          <div className="font-medium text-lg tracking-normal text-[#1d1d1f]">
            Med<span className="text-[#0071e3] font-semibold">AI</span> Mate
          </div>
        </div>
        <div className="ml-auto flex gap-8 text-sm font-light text-[#1d1d1f] opacity-70">
          <span className="cursor-pointer hover:opacity-100 transition-opacity">Overview</span>
          <span className="cursor-pointer hover:opacity-100 transition-opacity">Capabilities</span>
          <span className="cursor-pointer hover:opacity-100 transition-opacity">Security</span>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="z-10 flex flex-col items-center w-full px-6 mt-16 animate-fade-in-up">
        
        {/* Floating Logo Presentation */}
        <div className="mb-10 w-24 h-24 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center justify-center animate-float p-3 border border-slate-50">
          <Image src="/logo-copilot.png" alt="MedAI Mate Logo" width={70} height={70} className="object-contain" />
        </div>

        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-[#1d1d1f] leading-tight">
            Seamless workflow.
            <br />
            <span className="text-[#86868b] font-normal">Intelligent design.</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-[#424245] mt-6 tracking-normal">
            A fluid workspace engineered for the modern newsroom.
          </p>
        </div>

        <div className="w-full max-w-[380px] opacity-0 animate-fade-in-up-delay">
          <LoginForm />
        </div>

        <p className="mt-12 text-[#86868b] text-[13px] font-light max-w-sm text-center">
          Enterprise-grade security. By continuing, you agree to the MedAI Mate Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  )
}
