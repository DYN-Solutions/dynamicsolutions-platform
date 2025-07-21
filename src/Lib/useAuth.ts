import { useState, useEffect } from 'react'
import { supabase, getCurrentUser, getUserProfile } from './supabase'
import { User, UserData } from '../types/database'

interface AuthState {
  user: User | null
  authUser: UserData | null // Mantém compatibilidade atual
  loading: boolean
  role: 'admin' | 'manager' | 'client' | null
  company: any | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    authUser: null,
    loading: true,
    role: null,
    company: null
  })

  useEffect(() => {
    checkUser()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setState({
            user: null,
            authUser: null,
            loading: false,
            role: null,
            company: null
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (authUser: any) => {
    try {
      // Buscar perfil completo do banco
      const userProfile = await getUserProfile(authUser.id)
      
      setState({
        user: userProfile,
        authUser: authUser as UserData, // Mantém compatibilidade
        role: userProfile?.role || 'client',
        company: (userProfile as any)?.companies || null,
        loading: false
      })
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      // Fallback para manter funcionando sem perfil do banco
      setState({
        user: null,
        authUser: authUser as UserData,
        role: 'client',
        company: null,
        loading: false
      })
    }
  }

  const checkUser = async () => {
    try {
      const { user: authUser } = await getCurrentUser()
      if (authUser) {
        await loadUserProfile(authUser)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Erro:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const isAdmin = () => state.role === 'admin'
  const isManager = () => state.role === 'manager'
  const isClient = () => state.role === 'client'

  return {
    ...state,
    isAdmin,
    isManager,
    isClient,
    // Mantém compatibilidade com código atual
    setUser: (user: UserData | null) => {
      setState(prev => ({ ...prev, authUser: user }))
    }
  }
}
