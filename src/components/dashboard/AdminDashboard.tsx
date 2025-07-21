'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Company, Project } from '@/types/database'

interface DashboardStats {
  totalCompanies: number
  activeProjects: number
  totalRevenue: number
  pendingTasks: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingTasks: 0
  })
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([])
  const [activeProjects, setActiveProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      // Carregar estatísticas
      const [companiesRes, projectsRes, paymentsRes, tasksRes] = await Promise.all([
        supabase.from('companies').select('*', { count: 'exact' }),
        supabase.from('projects').select('*').eq('status', 'active'),
        supabase.from('payments').select('amount').eq('status', 'completed'),
        supabase.from('tasks').select('*', { count: 'exact' }).eq('status', 'pending')
      ])

      // Calcular receita total
      const totalRevenue = paymentsRes.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0

      setStats({
        totalCompanies: companiesRes.count || 0,
        activeProjects: projectsRes.data?.length || 0,
        totalRevenue,
        pendingTasks: tasksRes.count || 0
      })

      // Empresas recentes
      const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      setRecentCompanies(companies || [])
      setActiveProjects(projectsRes.data || [])
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Empresas"
          value={stats.totalCompanies}
          icon="🏢"
          color="blue"
        />
        <StatCard
          title="Projetos Ativos"
          value={stats.activeProjects}
          icon="📊"
          color="green"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
          icon="💰"
          color="orange"
        />
        <StatCard
          title="Tarefas Pendentes"
          value={stats.pendingTasks}
          icon="📋"
          color="red"
        />
      </div>

      {/* Recent Companies & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🏢</span> Empresas Recentes
          </h3>
          <div className="space-y-3">
            {recentCompanies.map((company) => (
              <div key={company.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-sm text-gray-400">{company.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  company.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {company.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>📊</span> Projetos Ativos
          </h3>
          <div className="space-y-3">
            {activeProjects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-gray-400">{project.type}</p>
                </div>
                <span className="text-sm font-semibold text-blue-400">
                  R$ {project.budget?.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente StatCard
function StatCard({ title, value, icon, color }: {
  title: string
  value: string | number
  icon: string
  color: 'blue' | 'green' | 'orange' | 'red'
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    green: 'bg-green-500/20 border-green-500/30 text-green-400',
    orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
    red: 'bg-red-500/20 border-red-500/30 text-red-400'
  }

  return (
    <div className={`p-6 rounded-xl backdrop-blur-sm border ${colorClasses[color]} transition-all hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className={`text-sm font-medium ${colorClasses[color].split(' ')[2]}`}>
          {title}
        </span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
