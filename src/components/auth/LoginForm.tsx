'use client'
import { useState } from 'react'

// Mock function para deploy sem erros
const mockSignInWithEmail = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { 
    data: null, 
    error: { message: 'Demo mode - Configure Supabase real para funcionar' } 
  }
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await mockSignInWithEmail(email, password)
      
      if (error) {
        setError('🚀 Demo Mode - Configure o Supabase para login real')
      } else {
        window.location.reload()
      }
    } catch {
      setError('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            DynamicSolutions.digital
          </h2>
          <p className="mt-2 text-gray-600">
            Demo Login Interface
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testando...' : 'Testar Login (Demo)'}
          </button>
          <div className="text-center text-sm text-gray-600">
            <p>✅ Deploy funcionando!</p>
            <p>🚀 Configure Supabase para login real</p>
          </div>
        </form>
      </div>
    </div>
  )
}
