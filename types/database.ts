export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          preferred_name: string;
          goals: string[];
          stress_areas: string[];
          relationship_status: string | null;
          exam_career_pressure: string | null;
          preferred_language: "english" | "hinglish" | "mixed";
          comfort_style: string | null;
          support_depth: number;
          communication_preference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          preferred_name: string;
          goals?: string[];
          stress_areas?: string[];
          relationship_status?: string | null;
          exam_career_pressure?: string | null;
          preferred_language?: "english" | "hinglish" | "mixed";
          comfort_style?: string | null;
          support_depth?: number;
          communication_preference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          pinned: boolean;
          last_message_preview: string | null;
          tone_badge: string | null;
          language_badge: "english" | "hinglish" | "mixed" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          pinned?: boolean;
          last_message_preview?: string | null;
          tone_badge?: string | null;
          language_badge?: "english" | "hinglish" | "mixed" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: "system" | "user" | "assistant";
          content: string;
          tone_style: string | null;
          language: "english" | "hinglish" | "mixed" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          user_id: string;
          role: "system" | "user" | "assistant";
          content: string;
          tone_style?: string | null;
          language?: "english" | "hinglish" | "mixed" | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string;
          summary: string;
          confidence: number;
          pinned: boolean;
          visibility: "private" | "assistant_only" | "shared";
          source_conversation_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: string;
          summary: string;
          confidence?: number;
          pinned?: boolean;
          visibility?: "private" | "assistant_only" | "shared";
          source_conversation_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memories"]["Insert"]>;
      };
      check_ins: {
        Row: {
          id: string;
          user_id: string;
          check_in_date: string;
          stress: number;
          confidence: number;
          focus: number;
          sleep: number;
          overthinking: number;
          relationship_energy: number;
          academic_pressure: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          check_in_date: string;
          stress: number;
          confidence: number;
          focus: number;
          sleep: number;
          overthinking: number;
          relationship_energy: number;
          academic_pressure: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["check_ins"]["Insert"]>;
      };
    };
  };
};
