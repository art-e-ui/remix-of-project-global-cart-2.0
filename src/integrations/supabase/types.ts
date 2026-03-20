export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ach_customers: {
        Row: {
          created_at: string
          customer_id: string
          email: string
          id: string
          joined_at: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          email: string
          id?: string
          joined_at?: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          email?: string
          id?: string
          joined_at?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ach_financials: {
        Row: {
          balance: number
          created_at: string
          customer_id: string
          id: string
          last_transaction_at: string | null
          notes: string | null
          total_orders: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          customer_id: string
          id?: string
          last_transaction_at?: string | null
          notes?: string | null
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          customer_id?: string
          id?: string
          last_transaction_at?: string | null
          notes?: string | null
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ach_financials_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "ach_customers"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      broadcast_notifications: {
        Row: {
          broadcast_date: string
          created_at: string
          department: string
          id: string
          is_archived: boolean
          label: string
          message: string
          updated_at: string
        }
        Insert: {
          broadcast_date?: string
          created_at?: string
          department?: string
          id?: string
          is_archived?: boolean
          label: string
          message: string
          updated_at?: string
        }
        Update: {
          broadcast_date?: string
          created_at?: string
          department?: string
          id?: string
          is_archived?: boolean
          label?: string
          message?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image: string | null
          name: string
          product_count: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          name: string
          product_count?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          product_count?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          category_slug: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          in_stock: boolean | null
          name: string
          original_price: number | null
          price: number
          rating: number | null
          seller: string | null
          sku: string | null
          specifications: Json | null
          stock: number | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          category_slug?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name: string
          original_price?: number | null
          price: number
          rating?: number | null
          seller?: string | null
          sku?: string | null
          specifications?: Json | null
          stock?: number | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          category_slug?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          seller?: string | null
          sku?: string | null
          specifications?: Json | null
          stock?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      reseller_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          sender: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          sender: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          sender?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "reseller_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          is_online: boolean | null
          last_message_at: string | null
          reseller_avatar: string | null
          reseller_id: string
          reseller_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_online?: boolean | null
          last_message_at?: string | null
          reseller_avatar?: string | null
          reseller_id: string
          reseller_name?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_online?: boolean | null
          last_message_at?: string | null
          reseller_avatar?: string | null
          reseller_id?: string
          reseller_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      seasonal_themes: {
        Row: {
          color_overrides: Json | null
          created_at: string | null
          decorations: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color_overrides?: Json | null
          created_at?: string | null
          decorations?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color_overrides?: Json | null
          created_at?: string | null
          decorations?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_banners: {
        Row: {
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          description: string | null
          display_order: number | null
          expires_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          section: string
          starts_at: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section: string
          starts_at?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          display_order?: number | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          section?: string
          starts_at?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sla_admins: {
        Row: {
          account_id: string
          avatar: string | null
          created_at: string
          email: string
          id: string
          joined_at: string
          last_login: string | null
          name: string
          permissions: string[] | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          avatar?: string | null
          created_at?: string
          email: string
          id?: string
          joined_at?: string
          last_login?: string | null
          name: string
          permissions?: string[] | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          joined_at?: string
          last_login?: string | null
          name?: string
          permissions?: string[] | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sla_staff: {
        Row: {
          created_at: string
          created_by_admin_id: string
          department: string | null
          email: string
          id: string
          joined_at: string
          last_active: string | null
          name: string
          phone: string | null
          referral_id: string
          staff_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_admin_id: string
          department?: string | null
          email: string
          id?: string
          joined_at?: string
          last_active?: string | null
          name: string
          phone?: string | null
          referral_id: string
          staff_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_admin_id?: string
          department?: string | null
          email?: string
          id?: string
          joined_at?: string
          last_active?: string | null
          name?: string
          phone?: string | null
          referral_id?: string
          staff_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sla_staff_created_by_admin_id_fkey"
            columns: ["created_by_admin_id"]
            isOneToOne: false
            referencedRelation: "sla_admins"
            referencedColumns: ["account_id"]
          },
        ]
      }
      support_messages: {
        Row: {
          attachment_product_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          sender: string
          session_id: string
        }
        Insert: {
          attachment_product_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          sender: string
          session_id: string
        }
        Update: {
          attachment_product_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          sender?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_attachment_product_id_fkey"
            columns: ["attachment_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "support_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      support_sessions: {
        Row: {
          created_at: string | null
          customer_avatar: string | null
          customer_name: string
          id: string
          is_online: boolean | null
          last_message_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_avatar?: string | null
          customer_name?: string
          id?: string
          is_online?: boolean | null
          last_message_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_avatar?: string | null
          customer_name?: string
          id?: string
          is_online?: boolean | null
          last_message_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          id: string
          key: string
          label: string
          setting_id: string
          updated_at: string
          updated_at_display: string | null
          updated_by: string | null
          value: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          key: string
          label: string
          setting_id: string
          updated_at?: string
          updated_at_display?: string | null
          updated_by?: string | null
          value: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          key?: string
          label?: string
          setting_id?: string
          updated_at?: string
          updated_at_display?: string | null
          updated_by?: string | null
          value?: string
        }
        Relationships: []
      }
      virtual_customer_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          region: string
          shipping_address: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          region: string
          shipping_address: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          region?: string
          shipping_address?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
