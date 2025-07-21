import AdminDashboard from '@/components/dashboard/AdminDashboard'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Verificar autenticação e role
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/')
  }

  // Verificar se é admin
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (user?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-400 mt-2">
            Visão geral da plataforma DynamicSolutions
          </p>
        </header>
        
        <AdminDashboard />
      </div>
    </div>
  )
}
