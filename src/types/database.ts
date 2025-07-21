export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'manager' | 'client'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'client'
        }
        Update: {
          email?: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'client'
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
        }
        Update: {
          name?: string
          email?: string | null
        }
      }
    }
  }
}