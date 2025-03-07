
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ivzfidkkyznxmadcouqm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2emZpZGtreXpueG1hZGNvdXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzY0ODgsImV4cCI6MjA1Njg1MjQ4OH0.OwajGeHzJwa9w-KkMR92uf9kFO7u4EPlk8vx7rbk88w";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
