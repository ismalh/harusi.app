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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admin_emails: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          request_id: string | null
          updated_at: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id?: string | null
          updated_at?: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string | null
          updated_at?: string
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "match_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      match_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_codes: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          email: string | null
          expires_at: string
          id: string
          phone: string
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          phone: string
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      profile_photos: {
        Row: {
          created_at: string
          id: string
          is_main: boolean
          position: number
          rejection_reason: string | null
          status: Database["public"]["Enums"]["profile_status"]
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_main?: boolean
          position?: number
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_main?: boolean
          position?: number
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          a_des_enfants: string | null
          accepte_demenager: string | null
          accepte_enfants: string | null
          accepte_polygamie: string | null
          admin_notes: string | null
          age: number | null
          approved_at: string | null
          bio: string | null
          city: string | null
          corpulence: string | null
          created_at: string
          criteres_redhibitoires: string | null
          date_naissance: string | null
          description_recherche: string | null
          ecole_jurisprudence: string | null
          email: string | null
          en_hijra: string | null
          en_polygamie: string | null
          first_name: string | null
          frequence_priere: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          hijra_quand: string | null
          id: string
          island: Database["public"]["Enums"]["island"] | null
          langues: string[] | null
          last_login_at: string | null
          lieu_naissance: string | null
          looking_for: string | null
          nationalite: string | null
          nationalite_secondaire: string | null
          nb_enfants: string | null
          nb_enfants_souhaites: string | null
          niveau_instruction_religieuse: string | null
          onboarding_completed: boolean
          onboarding_step: number
          origine_principale: string | null
          origine_secondaire: string | null
          photo_url: string | null
          plan: Database["public"]["Enums"]["user_plan"]
          porte_barbe: string | null
          porte_hijab: string | null
          priere_vendredi: string | null
          profession: string | null
          rapport_arabe: string | null
          rapport_coran: string | null
          rapport_mosquee: string | null
          situation_sante: string | null
          souhaite_hijra: string | null
          status: Database["public"]["Enums"]["profile_status"]
          statut_matrimonial: string | null
          taille: string | null
          tenue_vestimentaire: string | null
          updated_at: string
          verified: boolean
          whatsapp: string | null
        }
        Insert: {
          a_des_enfants?: string | null
          accepte_demenager?: string | null
          accepte_enfants?: string | null
          accepte_polygamie?: string | null
          admin_notes?: string | null
          age?: number | null
          approved_at?: string | null
          bio?: string | null
          city?: string | null
          corpulence?: string | null
          created_at?: string
          criteres_redhibitoires?: string | null
          date_naissance?: string | null
          description_recherche?: string | null
          ecole_jurisprudence?: string | null
          email?: string | null
          en_hijra?: string | null
          en_polygamie?: string | null
          first_name?: string | null
          frequence_priere?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          hijra_quand?: string | null
          id: string
          island?: Database["public"]["Enums"]["island"] | null
          langues?: string[] | null
          last_login_at?: string | null
          lieu_naissance?: string | null
          looking_for?: string | null
          nationalite?: string | null
          nationalite_secondaire?: string | null
          nb_enfants?: string | null
          nb_enfants_souhaites?: string | null
          niveau_instruction_religieuse?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          origine_principale?: string | null
          origine_secondaire?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          porte_barbe?: string | null
          porte_hijab?: string | null
          priere_vendredi?: string | null
          profession?: string | null
          rapport_arabe?: string | null
          rapport_coran?: string | null
          rapport_mosquee?: string | null
          situation_sante?: string | null
          souhaite_hijra?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          statut_matrimonial?: string | null
          taille?: string | null
          tenue_vestimentaire?: string | null
          updated_at?: string
          verified?: boolean
          whatsapp?: string | null
        }
        Update: {
          a_des_enfants?: string | null
          accepte_demenager?: string | null
          accepte_enfants?: string | null
          accepte_polygamie?: string | null
          admin_notes?: string | null
          age?: number | null
          approved_at?: string | null
          bio?: string | null
          city?: string | null
          corpulence?: string | null
          created_at?: string
          criteres_redhibitoires?: string | null
          date_naissance?: string | null
          description_recherche?: string | null
          ecole_jurisprudence?: string | null
          email?: string | null
          en_hijra?: string | null
          en_polygamie?: string | null
          first_name?: string | null
          frequence_priere?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          hijra_quand?: string | null
          id?: string
          island?: Database["public"]["Enums"]["island"] | null
          langues?: string[] | null
          last_login_at?: string | null
          lieu_naissance?: string | null
          looking_for?: string | null
          nationalite?: string | null
          nationalite_secondaire?: string | null
          nb_enfants?: string | null
          nb_enfants_souhaites?: string | null
          niveau_instruction_religieuse?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          origine_principale?: string | null
          origine_secondaire?: string | null
          photo_url?: string | null
          plan?: Database["public"]["Enums"]["user_plan"]
          porte_barbe?: string | null
          porte_hijab?: string | null
          priere_vendredi?: string | null
          profession?: string | null
          rapport_arabe?: string | null
          rapport_coran?: string | null
          rapport_mosquee?: string | null
          situation_sante?: string | null
          souhaite_hijra?: string | null
          status?: Database["public"]["Enums"]["profile_status"]
          statut_matrimonial?: string | null
          taille?: string | null
          tenue_vestimentaire?: string | null
          updated_at?: string
          verified?: boolean
          whatsapp?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          message_id: string | null
          photo_url: string | null
          reason: string
          reported_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          message_id?: string | null
          photo_url?: string | null
          reason: string
          reported_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_type?: Database["public"]["Enums"]["report_target"]
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          message_id?: string | null
          photo_url?: string | null
          reason?: string
          reported_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_type?: Database["public"]["Enums"]["report_target"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wali: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          notes: string | null
          phone: string
          relation: Database["public"]["Enums"]["wali_relation"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          notes?: string | null
          phone: string
          relation: Database["public"]["Enums"]["wali_relation"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          notes?: string | null
          phone?: string
          relation?: Database["public"]["Enums"]["wali_relation"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wali_messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_label: string
          wali_token_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_label?: string
          wali_token_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_label?: string
          wali_token_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wali_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wali_messages_wali_token_id_fkey"
            columns: ["wali_token_id"]
            isOneToOne: false
            referencedRelation: "wali_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      wali_tokens: {
        Row: {
          conversation_id: string
          created_at: string | null
          expires_at: string
          id: string
          token: string
          wali_user_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          wali_user_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          wali_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wali_tokens_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wali_tokens_wali_user_id_fkey"
            columns: ["wali_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_search_users: {
        Args: { _q: string }
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_admin: boolean
        }[]
      }
      admin_stats: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conversation_participant: { Args: { _conv: string }; Returns: boolean }
      is_matched_with: { Args: { _other: string }; Returns: boolean }
      is_wali_of_conversation: { Args: { _conv: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      gender: "homme" | "femme"
      island: "grande_comore" | "anjouan" | "moheli" | "mayotte"
      marital_status: "celibataire" | "divorce" | "veuf"
      prayer_frequency: "rarement" | "parfois" | "souvent" | "toujours"
      profile_status:
        | "pending"
        | "approved"
        | "rejected"
        | "suspended"
        | "banned"
      religiosity_level: "debutant" | "pratiquant" | "tres_pratiquant"
      report_status: "pending" | "reviewed" | "action_taken" | "dismissed"
      report_target: "profile" | "photo" | "message"
      request_status: "pending" | "accepted" | "refused"
      user_plan: "free" | "premium" | "vip"
      wali_relation: "pere" | "frere" | "oncle" | "tuteur" | "autre"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      gender: ["homme", "femme"],
      island: ["grande_comore", "anjouan", "moheli", "mayotte"],
      marital_status: ["celibataire", "divorce", "veuf"],
      prayer_frequency: ["rarement", "parfois", "souvent", "toujours"],
      profile_status: [
        "pending",
        "approved",
        "rejected",
        "suspended",
        "banned",
      ],
      religiosity_level: ["debutant", "pratiquant", "tres_pratiquant"],
      report_status: ["pending", "reviewed", "action_taken", "dismissed"],
      report_target: ["profile", "photo", "message"],
      request_status: ["pending", "accepted", "refused"],
      user_plan: ["free", "premium", "vip"],
      wali_relation: ["pere", "frere", "oncle", "tuteur", "autre"],
    },
  },
} as const
