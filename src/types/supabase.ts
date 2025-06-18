export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          company_name: string | null
          industry: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          company_name?: string | null
          industry?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          company_name?: string | null
          industry?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          data: Json
          created_at: string
          type: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          data: Json
          created_at?: string
          type: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          data?: Json
          created_at?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_campaigns_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}