'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Demo bypass
    if (email === 'demo@medaimate.com' && password === 'password') {
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 800)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-[380px] p-8 bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
      <div className="text-center mb-8">
        <h2 className="text-[22px] font-medium text-[#1d1d1f] tracking-tight">Sign in</h2>
        <p className="text-[#86868b] text-[15px] font-light mt-1">to continue to your workspace</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#fff0f0] border border-[#ffd9d9] rounded-2xl text-[#ce0500] text-[13px] font-normal text-center transition-all animate-fade-in-up">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full px-4 py-3.5 bg-white/80 border border-[#e5e5ea] rounded-2xl text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all text-[15px] font-light shadow-sm"
            placeholder="Email Address (demo@medaimate.com)"
          />
        </div>

        <div className="space-y-1.5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full px-4 py-3.5 bg-white/80 border border-[#e5e5ea] rounded-2xl text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 focus:border-[#0071e3] transition-all text-[15px] font-light shadow-sm"
            placeholder="Password"
          />
        </div>

        <div className="flex items-center justify-between text-[13px] pt-2 px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="peer appearance-none w-4 h-4 rounded-full border border-[#d2d2d7] checked:bg-[#0071e3] checked:border-[#0071e3] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/20 transition-all cursor-pointer" />
              <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 14" fill="none">
                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
              </svg>
            </div>
            <span className="text-[#424245] font-light group-hover:text-[#1d1d1f] transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-[#0071e3] hover:text-[#0077ED] font-normal transition-colors">Forgot password?</a>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-[1.2rem] shadow-md text-[15px] font-medium text-white bg-gradient-to-b from-[#007aff] to-[#0060cc] hover:from-[#0077ED] hover:to-[#005bbd] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 text-white/80" />
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
