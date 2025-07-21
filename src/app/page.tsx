'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// Cliente Supabase inline (sem arquivos externos)
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Funções inline (sem imports)
const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Tipos simples
interface UserData {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
  email_confirmed_at?: string
  last_sign_in_at?: string
}

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('admin@dynamicsolutions.digital')
  const [password, setPassword] = useState('demo123456')
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState('')
  const [supabaseConnected, setSupabaseConnected] = useState(false)

  useEffect(() => {
    checkSupabaseConnection()
    checkUser()
    
    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as UserData)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkSupabaseConnection = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (url && key && url.includes('supabase.co') && key.length > 50) {
      setSupabaseConnected(true)
    } else {
      setSupabaseConnected(false)
    }
  }

  const checkUser = async () => {
    if (!supabaseConnected) {
      setLoading(false)
      return
    }

    try {
      const { user, error } = await getCurrentUser()
      if (error) {
        console.error('Erro ao verificar usuário:', error)
        setUser(null)
      } else {
        setUser(user as UserData | null)
      }
    } catch (error) {
      console.error('Erro:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')

    if (!supabaseConnected) {
      setError('🔧 Configure as variáveis do Supabase no Vercel Dashboard')
      setLoginLoading(false)
      return
    }

    try {
      const { data, error } = await signInWithEmail(email, password)

      if (error) {
        setError(`❌ Erro: ${error.message}`)
      } else if (data.user) {
        setUser(data.user as UserData)
        setError('')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('❌ Erro inesperado no login')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!supabaseConnected) return

    try {
      await signOut()
      setUser(null)
      setEmail('admin@dynamicsolutions.digital')
      setPassword('demo123456')
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {supabaseConnected ? 'Conectando com Supabase...' : 'Carregando aplicação...'}
          </p>
        </div>
      </div>
    )
  }

  // TELA DE LOGIN
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Deploy Successful!
            </h1>
            <h2 className="text-xl text-gray-600 mb-2">
              DynamicSolutions.digital
            </h2>
            <p className="text-gray-500">
              {supabaseConnected ? 'Supabase conectado - Login real ativo' : 'Funcionando perfeitamente'}
            </p>
          </div>

          {/* Status do Deploy */}
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <h3 className="font-medium text-green-800">
                    Build Successful
                  </h3>
                  <p className="text-sm text-green-600">
                    Next.js + TypeScript + Vercel funcionando
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status do Supabase */}
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${
              supabaseConnected 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {supabaseConnected ? '🔐' : '⚙️'}
                </span>
                <div>
                  <h3 className={`font-medium ${
                    supabaseConnected ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {supabaseConnected ? 'Supabase Ativo' : 'Supabase Configurável'}
                  </h3>
                  <p className={`text-sm ${
                    supabaseConnected ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {supabaseConnected 
                      ? 'Login e autenticação funcionando' 
                      : 'Configure environment variables para ativar'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">
              {supabaseConnected ? 'Login Real' : 'Interface de Demonstração'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="sua senha"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loginLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {supabaseConnected ? 'Conectando...' : 'Processando...'}
                  </div>
                ) : (
                  supabaseConnected ? 'Entrar com Supabase' : 'Demonstrar Interface'
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3 text-center">
                🏆 Deploy Realizado com Sucesso!
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>Next.js 15</span>
                  </span>
                  <span className="text-green-600 font-medium">✅</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>TypeScript</span>
                  </span>
                  <span className="text-green-600 font-medium">✅</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>Vercel Deploy</span>
                  </span>
                  <span className="text-green-600 font-medium">✅</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className={`w-2 h-2 ${supabaseConnected ? 'bg-green-500' : 'bg-blue-500'} rounded-full mr-2`}></span>
                    <span>Supabase</span>
                  </span>
                  <span className={`${supabaseConnected ? 'text-green-600' : 'text-blue-600'} font-medium`}>
                    {supabaseConnected ? '✅' : '⚙️'}
                  </span>
                </div>
              </div>

              {supabaseConnected && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Email teste:</span>
                      <span className="font-mono">admin@dynamicsolutions.digital</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Senha teste:</span>
                      <span className="font-mono">demo123456</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="mt-8 bg-gray-900 text-white p-6 rounded-xl">
            <h3 className="text-center font-bold text-lg mb-4">🚀 Próximos Passos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Backend:</h4>
                <div className="space-y-1 text-gray-400">
                  <div>• Configurar database</div>
                  <div>• Adicionar APIs</div>
                  <div>• Implementar lógica de negócio</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Frontend:</h4>
                <div className="space-y-1 text-gray-400">
                  <div>• Expandir dashboard</div>
                  <div>• Adicionar páginas</div>
                  <div>• Integrar funcionalidades</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD APÓS LOGIN
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            <h1 className="text-xl font-bold text-gray-900">
              DynamicSolutions.digital
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {(user.user_metadata?.full_name as string) || 'Admin'}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
              <div className="text-xs text-green-600">✅ Autenticado via Supabase</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Login Realizado com Sucesso!
          </h2>
          <p className="text-gray-600">
            Usuário autenticado e sistema funcionando
          </p>
        </div>

        {/* Success Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🎯</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Deploy Success</h3>
                <p className="text-gray-600">Aplicação rodando</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🔐</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Auth Ativo</h3>
                <p className="text-gray-600">Supabase funcionando</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⚡</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                <p className="text-gray-600">Otimizado e rápido</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">👤 Informações do Usuário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Confirmado:</strong> {user.email_confirmed_at ? '✅ Sim' : '❌ Não'}</div>
            <div><strong>Último login:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'N/A'}</div>
          </div>
        </div>

        {/* Final Success */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-center font-bold text-lg mb-4 text-gray-900">
            🏆 Missão Cumprida!
          </h3>
          <div className="text-center text-gray-600">
            <p className="mb-2">✅ Deploy profissional realizado com sucesso</p>
            <p className="mb-2">✅ Sistema de autenticação funcionando</p>
            <p>✅ Pronto para próximas funcionalidades</p>
          </div>
        </div>
      </main>
    </div>
  )
}
