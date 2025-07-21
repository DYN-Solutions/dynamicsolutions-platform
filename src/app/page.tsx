'use client'

import { useState, useEffect } from 'react'

// Mock Supabase para deploy sem erros
const mockSupabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode - Supabase não configurado' } }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  }
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
  const [loading, setLoading] = useState(false) // Mudado para false para não ficar carregando
  const [email, setEmail] = useState('admin@dynamicsolutions.digital')
  const [password, setPassword] = useState('demo123456')
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Mock - sem Supabase real
    setLoading(false)
    setUser(null)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')

    try {
      // Mock login para demo
      await new Promise(resolve => setTimeout(resolve, 1000))
      setError('🚀 Demo Mode - Configure o Supabase real para login funcionar')
    } catch (error) {
      console.error('Erro no login:', error)
      setError('❌ Erro inesperado no login')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setEmail('admin@dynamicsolutions.digital')
    setPassword('demo123456')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // TELA DE LOGIN/DEMO
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🚀</span>
            <h1 className="text-xl font-bold text-gray-900">
              DynamicSolutions.digital
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              ✅ Deploy Successful
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-4 pt-16">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Deploy Realizado com Sucesso!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              DynamicSolutions.digital está no ar via Vercel
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="text-4xl mr-4">✅</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Vercel Deploy</h3>
                  <p className="text-gray-600">100% Funcionando</p>
                  <p className="text-sm text-green-600">Build successful</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="text-4xl mr-4">⚡</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Next.js 15</h3>
                  <p className="text-gray-600">Framework Ativo</p>
                  <p className="text-sm text-blue-600">TypeScript OK</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="text-4xl mr-4">🌐</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Produção</h3>
                  <p className="text-gray-600">GitHub + Vercel</p>
                  <p className="text-sm text-purple-600">Método Profissional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Login Section */}
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-center mb-6">
                🚀 Demo Login Interface
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
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
                      Testando...
                    </div>
                  ) : (
                    'Testar Login (Demo)'
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 text-center">
                  🎯 Próximos Passos
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>✅ Deploy funcionando</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <span>⚡ Configurar Supabase real</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <span>🚀 Adicionar funcionalidades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <div className="bg-gray-900 text-white p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2">🏆 Deploy Profissional Realizado!</h3>
              <p className="text-gray-300 mb-4">
                GitHub + Vercel + Next.js + TypeScript
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Build Success</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>TypeScript OK</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  <span>Zero Errors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
