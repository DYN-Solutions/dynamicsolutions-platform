// Tipos alinhados com SEU schema existente
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
  address?: Record<string, any>
  billing_info?: Record<string, any>
  settings?: Record<string, any>
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
  settings?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  project_id: string
  ad_account_id: string
  campaign_id: string
  name: string
  type: string
  status: string
  daily_budget?: number
  lifetime_budget?: number
  start_date?: string
  end_date?: string
  objective?: string
  target_audience?: Record<string, any>
  settings?: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}
