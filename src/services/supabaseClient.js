import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uzxltyqikkjmowqajilm.supabase.co'; // Ganti dengan URL kamu
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eGx0eXFpa2tqbW93cWFqaWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzI2MjUsImV4cCI6MjA2NTQ0ODYyNX0.SCCElP70TDWAzlZfCLKfb25_Gkoe8CDNNWJTHMD5za0'; // Ganti dengan anon key kamu

export const supabase = createClient(supabaseUrl, supabaseKey);
