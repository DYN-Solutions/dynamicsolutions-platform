'use client'

import { useState, useEffect } from 'react'
import { supabase, signInWithEmail, signOut, getCurrentUser } from '../lib/supabase'

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
            {supabaseConnected ? 'Conectando com Supabase...' : 'Carregando...'}
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
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DynamicSolutions.digital
            </h1>
            <p className="text-gray-600">
              {supabaseConnected ? 'Login com Supabase Real' : 'Configure o Supabase'}
            </p>
          </div>

          {/* Status do Supabase */}
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${
              supabaseConnected 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {supabaseConnected ? '✅' : '⚙️'}
                </span>
                <div>
                  <h3 className={`font-medium ${
                    supabaseConnected ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {supabaseConnected ? 'Supabase Conectado' : 'Supabase Não Configurado'}
                  </h3>
                  <p className={`text-sm ${
                    supabaseConnected ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {supabaseConnected 
                      ? 'Pronto para autenticação real' 
                      : 'Configure variáveis no Vercel Dashboard'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">
              {supabaseConnected ? 'Faça seu login' : 'Demo Interface'}
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
                    {supabaseConnected ? 'Conectando com Supabase...' : 'Testando...'}
                  </div>
                ) : (
                  supabaseConnected ? 'Entrar com Supabase' : 'Testar Interface (Demo)'
                )}
              </button>
            </form>

            {!supabaseConnected && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 text-center">
                  🔧 Configure no Vercel
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>1.</strong> Vercel Dashboard → Settings</p>
                  <p><strong>2.</strong> Environment Variables</p>
                  <p><strong>3.</strong> Adicione NEXT_PUBLIC_SUPABASE_*</p>
                </div>
              </div>
            )}

            {supabaseConnected && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 text-center">
                  🔗 Login Real com Supabase
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="font-mono">admin@dynamicsolutions.digital</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Senha:</span>
                    <span className="font-mono">demo123456</span>
                  </div>
                </div>
                <div className="text-xs text-green-600 text-center mt-2">
                  ✅ Crie este usuário no Supabase Auth
                </div>
              </div>
            )}
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
              <div className="text-xs text-green-600">✅ Conectado via Supabase</div>
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
            🎉 Deploy Successful!
          </h2>
          <p className="text-gray-600">
            DynamicSolutions.digital rodando na produção
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vercel Deploy</h3>
                <p className="text-gray-600">100% Funcionando</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🔐</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Supabase Real</h3>
                <p className="text-gray-600">Usuário: {user.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🚀</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Produção</h3>
                <p className="text-gray-600">GitHub + Vercel</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">👤 Informações do Usuário (Supabase)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>ID:</strong> {user.id}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Confirmado:</strong> {user.email_confirmed_at ? '✅ Sim' : '❌ Não'}
            </div>
            <div>
              <strong>Último login:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'N/A'}
            </div>
          </div>
        </div>

        {/* Success Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-green-900 font-bold text-lg mb-4 text-center">
            🏆 Deploy Realizado com Sucesso!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">✅ Funcionando:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Next.js + TypeScript</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Supabase Authentication</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Vercel Deployment</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">🚀 Próximo:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>Adicionar funcionalidades</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>Integrar APIs</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  <span>Expandir aplicação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
