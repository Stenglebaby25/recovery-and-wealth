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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_icon: string
          category: string
          created_at: string
          description: string
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          badge_icon: string
          category: string
          created_at?: string
          description: string
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value: number
        }
        Update: {
          badge_icon?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          autopay_enabled: boolean
          bill_name: string
          category: string
          created_at: string
          due_date: string
          frequency: string
          id: string
          is_paid: boolean
          notes: string | null
          reminder_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          autopay_enabled?: boolean
          bill_name: string
          category?: string
          created_at?: string
          due_date: string
          frequency?: string
          id?: string
          is_paid?: boolean
          notes?: string | null
          reminder_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          autopay_enabled?: boolean
          bill_name?: string
          category?: string
          created_at?: string
          due_date?: string
          frequency?: string
          id?: string
          is_paid?: boolean
          notes?: string | null
          reminder_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          estimated_duration: number | null
          id: string
          learning_objectives: string[] | null
          module_number: number
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          learning_objectives?: string[] | null
          module_number: number
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          estimated_duration?: number | null
          id?: string
          learning_objectives?: string[] | null
          module_number?: number
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          description: string | null
          id: string
          learning_pathway: string | null
          order_index: number | null
          subject: string | null
          title: string
          updated_at: string
          video_url: string | null
          week_number: number | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          learning_pathway?: string | null
          order_index?: number | null
          subject?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          week_number?: number | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          learning_pathway?: string | null
          order_index?: number | null
          subject?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          week_number?: number | null
        }
        Relationships: []
      }
      daily_checkins: {
        Row: {
          check_in_date: string
          created_at: string
          energy_level: number
          id: string
          mood_rating: number
          notes: string | null
          sobriety_status: string
          spending_impulse_level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in_date: string
          created_at?: string
          energy_level: number
          id?: string
          mood_rating: number
          notes?: string | null
          sobriety_status?: string
          spending_impulse_level: number
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in_date?: string
          created_at?: string
          energy_level?: number
          id?: string
          mood_rating?: number
          notes?: string | null
          sobriety_status?: string
          spending_impulse_level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_drip_queue: {
        Row: {
          created_at: string
          email: string
          email_type: string
          id: string
          metadata: Json | null
          scheduled_for: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          email_type: string
          id?: string
          metadata?: Json | null
          scheduled_for: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          email_type?: string
          id?: string
          metadata?: Json | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          expense_date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_at: string
          created_at: string
          habit_id: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          habit_id: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          habit_id?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          target_frequency: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          target_frequency?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          target_frequency?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      halt_lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          exercise_steps_completed: Json | null
          id: string
          lesson_id: string
          quiz_responses: Json | null
          quiz_score: number | null
          reflection_notes: string | null
          self_assessment_rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          exercise_steps_completed?: Json | null
          id?: string
          lesson_id: string
          quiz_responses?: Json | null
          quiz_score?: number | null
          reflection_notes?: string | null
          self_assessment_rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          exercise_steps_completed?: Json | null
          id?: string
          lesson_id?: string
          quiz_responses?: Json | null
          quiz_score?: number | null
          reflection_notes?: string | null
          self_assessment_rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          lead_type: string
          metadata: Json | null
          source_page: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          lead_type: string
          metadata?: Json | null
          source_page?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          lead_type?: string
          metadata?: Json | null
          source_page?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content_type: string
          course_id: string
          created_at: string
          description: string | null
          estimated_duration: number
          id: string
          interactive_elements: Json | null
          is_published: boolean
          learning_objectives: string[] | null
          lesson_number: number
          module_id: string | null
          order_index: number
          prerequisites: string[] | null
          presentation_slides: Json | null
          quiz_questions: Json | null
          resources: Json | null
          text_content: string | null
          title: string
          updated_at: string
          video_duration: number | null
          video_url: string | null
        }
        Insert: {
          content_type?: string
          course_id: string
          created_at?: string
          description?: string | null
          estimated_duration?: number
          id?: string
          interactive_elements?: Json | null
          is_published?: boolean
          learning_objectives?: string[] | null
          lesson_number: number
          module_id?: string | null
          order_index?: number
          prerequisites?: string[] | null
          presentation_slides?: Json | null
          quiz_questions?: Json | null
          resources?: Json | null
          text_content?: string | null
          title: string
          updated_at?: string
          video_duration?: number | null
          video_url?: string | null
        }
        Update: {
          content_type?: string
          course_id?: string
          created_at?: string
          description?: string | null
          estimated_duration?: number
          id?: string
          interactive_elements?: Json | null
          is_published?: boolean
          learning_objectives?: string[] | null
          lesson_number?: number
          module_id?: string | null
          order_index?: number
          prerequisites?: string[] | null
          presentation_slides?: Json | null
          quiz_questions?: Json | null
          resources?: Json | null
          text_content?: string | null
          title?: string
          updated_at?: string
          video_duration?: number | null
          video_url?: string | null
        }
        Relationships: []
      }
      mood_journal: {
        Row: {
          created_at: string
          emotional_state: string
          id: string
          mood_rating: number
          notes: string | null
          spending_amount: number | null
          spending_category: string | null
          spending_trigger: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotional_state: string
          id?: string
          mood_rating: number
          notes?: string | null
          spending_amount?: number | null
          spending_category?: string | null
          spending_trigger?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotional_state?: string
          id?: string
          mood_rating?: number
          notes?: string | null
          spending_amount?: number | null
          spending_category?: string | null
          spending_trigger?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          access_code: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          organization_type: string
          seat_count: number
          seats_used: number
          subscription_active: boolean
          subscription_tier: string | null
          updated_at: string
        }
        Insert: {
          access_code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          organization_type?: string
          seat_count?: number
          seats_used?: number
          subscription_active?: boolean
          subscription_tier?: string | null
          updated_at?: string
        }
        Update: {
          access_code?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_type?: string
          seat_count?: number
          seats_used?: number
          subscription_active?: boolean
          subscription_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          discharge_date: string | null
          discharge_reason: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          sponsored_until: string | null
          subscription_expires_at: string | null
          subscription_status: string | null
          trial_expires_at: string | null
          trial_started_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discharge_date?: string | null
          discharge_reason?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          sponsored_until?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          trial_expires_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discharge_date?: string | null
          discharge_reason?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          sponsored_until?: string | null
          subscription_expires_at?: string | null
          subscription_status?: string | null
          trial_expires_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          external_url: string | null
          file_url: string | null
          id: string
          order_index: number | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          order_index?: number | null
          resource_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          external_url?: string | null
          file_url?: string | null
          id?: string
          order_index?: number | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviewer_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number
          description: string | null
          duration_days: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
        }
        Relationships: []
      }
      rewards: {
        Row: {
          category: string
          created_at: string
          current_redemptions: number
          description: string | null
          id: string
          is_active: boolean
          max_redemptions: number | null
          points_required: number
          reward_type: string
          title: string
          updated_at: string
          value: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          current_redemptions?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          points_required?: number
          reward_type?: string
          title: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          current_redemptions?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          points_required?: number
          reward_type?: string
          title?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      spending_limits: {
        Row: {
          alert_threshold: number
          category: string
          created_at: string
          id: string
          is_active: boolean
          monthly_limit: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_threshold?: number
          category: string
          created_at?: string
          id?: string
          is_active?: boolean
          monthly_limit: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_threshold?: number
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          monthly_limit?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          connected_at: string
          created_at: string
          id: string
          notes: string | null
          program_type: string
          relationship_type: string
          sponsor_email: string | null
          sponsor_name: string
          sponsor_phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          program_type?: string
          relationship_type?: string
          sponsor_email?: string | null
          sponsor_name: string
          sponsor_phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          program_type?: string
          relationship_type?: string
          sponsor_email?: string | null
          sponsor_name?: string
          sponsor_phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stress_prevention_events: {
        Row: {
          amount_considered: number | null
          created_at: string
          id: string
          intervention_used: string | null
          notes: string | null
          prevented: boolean | null
          trigger_type: string
          user_id: string
        }
        Insert: {
          amount_considered?: number | null
          created_at?: string
          id?: string
          intervention_used?: string | null
          notes?: string | null
          prevented?: boolean | null
          trigger_type: string
          user_id: string
        }
        Update: {
          amount_considered?: number | null
          created_at?: string
          id?: string
          intervention_used?: string | null
          notes?: string | null
          prevented?: boolean | null
          trigger_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_learning_paths: {
        Row: {
          created_at: string
          id: string
          quiz_answers: Json
          recommended_modules: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quiz_answers?: Json
          recommended_modules?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quiz_answers?: Json
          recommended_modules?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          bookmarks: Json | null
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          last_accessed: string | null
          lesson_id: string
          notes: string | null
          progress_percentage: number
          quiz_score: number | null
          started_at: string | null
          status: string
          time_spent: number
          updated_at: string
          user_id: string
          video_progress: number | null
        }
        Insert: {
          bookmarks?: Json | null
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          last_accessed?: string | null
          lesson_id: string
          notes?: string | null
          progress_percentage?: number
          quiz_score?: number | null
          started_at?: string | null
          status?: string
          time_spent?: number
          updated_at?: string
          user_id: string
          video_progress?: number | null
        }
        Update: {
          bookmarks?: Json | null
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          last_accessed?: string | null
          lesson_id?: string
          notes?: string | null
          progress_percentage?: number
          quiz_score?: number | null
          started_at?: string | null
          status?: string
          time_spent?: number
          updated_at?: string
          user_id?: string
          video_progress?: number | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completion_date: string | null
          course_id: string
          created_at: string
          id: string
          progress_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completion_date?: string | null
          course_id: string
          created_at?: string
          id?: string
          progress_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completion_date?: string | null
          course_id?: string
          created_at?: string
          id?: string
          progress_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reward_redemptions: {
        Row: {
          created_at: string
          id: string
          points_spent: number
          redeemed_at: string
          redemption_code: string | null
          reward_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_spent: number
          redeemed_at?: string
          redemption_code?: string | null
          reward_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_spent?: number
          redeemed_at?: string
          redemption_code?: string | null
          reward_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
