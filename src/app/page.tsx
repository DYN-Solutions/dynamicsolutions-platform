'use client'
import { useState } from 'react'
import { useAuth } from '../lib/useAuth'
import { signInWithEmail, signOut } from '../lib/supabase'

export default function HomePage() {
  const { authUser: user, loading, role, company, setUser } = useAuth()
  const [email, setEmail] = useState('admin@dynamicsolutions.digital')
  const [password, setPassword] = useState('demo123456')
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')

    try {
      const { data, error } = await signInWithEmail(email, password)

      if (error) {
        setError(`❌ Erro: ${error.message}`)
      } else if (data.user) {
        setUser(data.user as any)
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
          <p className="text-gray-600">Conectando com Supabase...</p>
        </div>
      </div>
    )
  }

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
              Agência Digital de Alta Performance
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-6">
              Faça seu login
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
                    Conectando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD - Agora mostra role e company se existirem
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
              <div className="text-xs text-green-600">
                ✅ {role ? `Role: ${role}` : 'Conectado via Supabase'}
              </div>
              {company && (
                <div className="text-xs text-blue-600">
                  🏢 {company.name}
                </div>
              )}
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
            🎉 Sistema Funcionando!
          </h2>
          <p className="text-gray-600">
            {role === 'admin' ? 'Painel Administrativo' : 
             role === 'manager' ? 'Painel Gerencial' : 
             'Portal do Cliente'}
          </p>
        </div>

        {/* Cards com informações do sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Auth Funcionando</h3>
                <p className="text-gray-600">Supabase + Database</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👤</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Perfil</h3>
                <p className="text-gray-600">{role || 'Carregando...'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏢</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Empresa</h3>
                <p className="text-gray-600">{company?.name || 'Sem empresa'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">👤 Informações do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Role:</strong> {role || 'Não definido'}</div>
            <div><strong>Company:</strong> {company?.name || 'Não vinculado'}</div>
            <div><strong>Status:</strong> {company?.status || 'N/A'}</div>
            <div><strong>Último login:</strong> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : 'N/A'}</div>
          </div>
        </div>

        {/* Status do projeto */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-center font-bold text-lg mb-4 text-gray-900">
            🚀 Sistema Evoluindo!
          </h3>
          <div className="text-center text-gray-600">
            <p className="mb-2">✅ Database schema implementado</p>
            <p className="mb-2">✅ Sistema de roles funcionando</p>
            <p>✅ Pronto para próximas funcionalidades</p>
          </div>
        </div>
      </main>
    </div>
  )
}
