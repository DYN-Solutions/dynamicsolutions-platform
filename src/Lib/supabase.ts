import { createBrowserClient } from '@supabase/ssr'

// Cliente simples sem tipos por enquanto
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helper para login
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Helper para logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Helper para verificar usuário atual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}