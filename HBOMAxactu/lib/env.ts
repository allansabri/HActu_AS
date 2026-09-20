export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const DEFAULT_SUPABASE_URL = "https://gksojtglnqxjmwyebecc.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrc29qdGdsbnF4am13eWViZWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjczMzAsImV4cCI6MjA5NTEwMzMzMH0.-bgFPmjeZcwj7HCOUr5ftG-Nf753HoM4O0Cs72FS9gk";

const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholderUrl =
  !configuredUrl ||
  configuredUrl.includes("votre-projet") ||
  configuredUrl.includes("placeholder");

const isPlaceholderKey =
  !configuredAnonKey ||
  configuredAnonKey.includes("votre_cle") ||
  configuredAnonKey.includes("placeholder");

export const supabaseUrl: string =
  !isPlaceholderUrl && configuredUrl ? configuredUrl : DEFAULT_SUPABASE_URL;

export const supabaseAnonKey: string =
  !isPlaceholderKey && configuredAnonKey ? configuredAnonKey : DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseUrl.includes("votre-projet")
);
