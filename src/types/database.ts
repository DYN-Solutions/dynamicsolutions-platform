// Tipos baseados no SEU schema Supabase
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'admin' | 'manager' | 'client'
  company_id?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  slug: string
  email: string
  phone?: string
  cnpj?: string
  website?: string
  industry?: string
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  company_id: string
  name: string
  description?: string
  type: 'traffic' | 'development' | 'ai' | 'strategy' | 'consulting'
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled'
  budget?: number
  spent_amount: number
  start_date?: string
  end_date?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

// Interface para dados básicos de auth (mantém compatibilidade atual)
export interface UserData {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
  email_confirmed_at?: string
  last_sign_in_at?: string
}
