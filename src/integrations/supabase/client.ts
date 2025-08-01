// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xmpstquurznpgwbmxkdf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtcHN0cXV1cnpucGd3Ym14a2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5ODk5MDYsImV4cCI6MjA2NjU2NTkwNn0.6MzOlZr3rEprtVaSR_kvKIJpS7-xUonpPWt751kC06c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});