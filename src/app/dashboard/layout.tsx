import { LogoutButton } from '@/components/ui/LogoutButton'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Database } from '@/types/database'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Buscar dados do usuário
  const { data: user } = await supabase
    .from('users')
    .select('full_name, role')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
                DynamicSolutions
              </Link>
              
              {user?.role === 'admin' && (
                <div className="flex gap-6">
                  <Link href="/dashboard/admin" className="text-gray-300 hover:text-white transition-colors">
                    Overview
                  </Link>
                  <Link href="/dashboard/companies" className="text-gray-300 hover:text-white transition-colors">
                    Empresas
                  </Link>
                  <Link href="/dashboard/projects" className="text-gray-300 hover:text-white transition-colors">
                    Projetos
                  </Link>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{user?.full_name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
