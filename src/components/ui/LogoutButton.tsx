'use client'

import { signOut } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  
  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }
  
  return (
    <button 
      onClick={handleLogout}
      className="text-sm bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
    >
      Sair
    </button>
  )
}
