import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type UserSticker = {
  id: string;
  user_id: string;
  sticker_id: string;
  count: number;
  favorite: boolean;
  want_next: boolean;
  acquired_at: string;
  created_at: string;
  updated_at: string;
};
