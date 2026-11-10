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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      approvals: {
        Row: {
          comment: string | null
          created_at: string | null
          decision: string
          id: string
          org_id: string
          reviewer_id: string | null
          submission_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          decision: string
          id?: string
          org_id: string
          reviewer_id?: string | null
          submission_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          decision?: string
          id?: string
          org_id?: string
          reviewer_id?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_facts: {
        Row: {
          id: string
          label: string
          org_id: string
          source_note: string | null
          updated_at: string | null
          value: string
          version: number
        }
        Insert: {
          id?: string
          label: string
          org_id: string
          source_note?: string | null
          updated_at?: string | null
          value: string
          version?: number
        }
        Update: {
          id?: string
          label?: string
          org_id?: string
          source_note?: string | null
          updated_at?: string | null
          value?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "brand_facts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_terms: {
        Row: {
          forbidden_term: string
          id: string
          note: string | null
          org_id: string
          preferred_term: string
        }
        Insert: {
          forbidden_term: string
          id?: string
          note?: string | null
          org_id: string
          preferred_term: string
        }
        Update: {
          forbidden_term?: string
          id?: string
          note?: string | null
          org_id?: string
          preferred_term?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_terms_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_fact_links: {
        Row: {
          claim_text: string | null
          fact_id: string
          fact_version: number
          id: string
          org_id: string
          submission_id: string
          version_number: number
        }
        Insert: {
          claim_text?: string | null
          fact_id: string
          fact_version: number
          id?: string
          org_id: string
          submission_id: string
          version_number: number
        }
        Update: {
          claim_text?: string | null
          fact_id?: string
          fact_version?: number
          id?: string
          org_id?: string
          submission_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "claim_fact_links_fact_id_fkey"
            columns: ["fact_id"]
            isOneToOne: false
            referencedRelation: "brand_facts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_fact_links_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_fact_links_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          org_id: string
          submission_id: string
          version_number: number
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          org_id: string
          submission_id: string
          version_number: number
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          org_id?: string
          submission_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_versions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_versions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_versions: {
        Row: {
          created_at: string | null
          fact_id: string
          id: string
          org_id: string
          value: string
          version: number
        }
        Insert: {
          created_at?: string | null
          fact_id: string
          id?: string
          org_id: string
          value: string
          version: number
        }
        Update: {
          created_at?: string | null
          fact_id?: string
          id?: string
          org_id?: string
          value?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "fact_versions_fact_id_fkey"
            columns: ["fact_id"]
            isOneToOne: false
            referencedRelation: "brand_facts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fact_versions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      findings: {
        Row: {
          category: string
          claim_status: string | null
          created_at: string | null
          explanation: string
          flagged_text: string | null
          id: string
          org_id: string
          origin: string
          resolution: string
          severity: string
          source_label: string | null
          source_version: number | null
          submission_id: string
          suggested_fix: string | null
          version_number: number
        }
        Insert: {
          category: string
          claim_status?: string | null
          created_at?: string | null
          explanation: string
          flagged_text?: string | null
          id?: string
          org_id: string
          origin?: string
          resolution?: string
          severity: string
          source_label?: string | null
          source_version?: number | null
          submission_id: string
          suggested_fix?: string | null
          version_number: number
        }
        Update: {
          category?: string
          claim_status?: string | null
          created_at?: string | null
          explanation?: string
          flagged_text?: string | null
          id?: string
          org_id?: string
          origin?: string
          resolution?: string
          severity?: string
          source_label?: string | null
          source_version?: number | null
          submission_id?: string
          suggested_fix?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "findings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "findings_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      guideline_insights: {
        Row: {
          created_at: string | null
          evidence: string | null
          id: string
          org_id: string
          recommendation: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          evidence?: string | null
          id?: string
          org_id: string
          recommendation: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          evidence?: string | null
          id?: string
          org_id?: string
          recommendation?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "guideline_insights_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      guidelines: {
        Row: {
          body: string
          id: string
          org_id: string
          title: string
          version: number
        }
        Insert: {
          body: string
          id?: string
          org_id: string
          title: string
          version?: number
        }
        Update: {
          body?: string
          id?: string
          org_id?: string
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "guidelines_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          org_id: string | null
          role: string
        }
        Insert: {
          full_name?: string | null
          id: string
          org_id?: string | null
          role?: string
        }
        Update: {
          full_name?: string | null
          id?: string
          org_id?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      revalidation_tasks: {
        Row: {
          created_at: string | null
          fact_id: string | null
          id: string
          new_version: number | null
          old_version: number | null
          org_id: string
          status: string
          submission_id: string
        }
        Insert: {
          created_at?: string | null
          fact_id?: string | null
          id?: string
          new_version?: number | null
          old_version?: number | null
          org_id: string
          status?: string
          submission_id: string
        }
        Update: {
          created_at?: string | null
          fact_id?: string | null
          id?: string
          new_version?: number | null
          old_version?: number | null
          org_id?: string
          status?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revalidation_tasks_fact_id_fkey"
            columns: ["fact_id"]
            isOneToOne: false
            referencedRelation: "brand_facts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revalidation_tasks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revalidation_tasks_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string | null
          creator_id: string
          current_version: number
          id: string
          org_id: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          current_version?: number
          id?: string
          org_id: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          current_version?: number
          id?: string
          org_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_org: { Args: never; Returns: string }
      current_role_name: { Args: never; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
