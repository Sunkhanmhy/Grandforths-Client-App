import { createClient, type Session, type User } from '@supabase/supabase-js'

const SESSION_STORAGE_KEY = 'grandforth_client_session'
const DEMO_USER_ID = 'demo-client-user'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

function hasRealSupabaseConfig(url: string, anonKey: string) {
  const placeholderPattern = /(your-|example|placeholder|dummy|test)/i
  return Boolean(
    url
    && anonKey
    && url.includes('.supabase.co')
    && !placeholderPattern.test(url)
    && !placeholderPattern.test(anonKey),
  )
}

export const supabase = hasRealSupabaseConfig(supabaseUrl, supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export type AuthResult = {
  data: { user: User | null; session: Session | null } | null
  error: Error | null
}

export type OAuthProvider = 'google' | 'microsoft'

export function isDemoMode() {
  return !supabase
}

export function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeStoredSession(payload: Record<string, unknown>) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload))
}

export function clearStoredSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

function createDemoSession(email: string, fullName?: string) {
  const user = {
    id: DEMO_USER_ID,
    app_metadata: { provider: 'demo' },
    user_metadata: { full_name: fullName ?? email.split('@')[0] },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email,
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    phone: null,
    confirmation_sent_at: null,
    invited_at: null,
    recovery_sent_at: null,
    identities: null,
    factors: null,
  } as unknown as User

  const session: Session = {
    access_token: 'demo-access-token',
    refresh_token: 'demo-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user,
  } as Session

  const payload = { email, user: user.id, fullName: fullName ?? user.user_metadata.full_name }
  writeStoredSession(payload)

  return { data: { user, session }, error: null }
}

export async function signInWithEmailPassword({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<AuthResult> {
  if (!supabase) {
    if (!email || !password) {
      return { data: null, error: new Error('Email and password are required.') }
    }
    return createDemoSession(email, email.split('@')[0])
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  return {
    data,
    error: error ? new Error(error.message) : null,
  }
}

export async function signInWithOAuth(provider: OAuthProvider, redirectPath = '/dashboard') {
  if (!supabase) {
    const fallbackEmail = provider === 'google' ? 'google.user@demo.local' : 'microsoft.user@demo.local'
    const fallbackName = provider === 'google' ? 'Google user' : 'Microsoft user'
    const demoSession = createDemoSession(fallbackEmail, fallbackName)
    return {
      data: {
        url: `${window.location.origin}${redirectPath}`,
        provider,
      },
      error: demoSession.error,
      session: demoSession.data.session,
    }
  }

  const redirectTo = `${window.location.origin}${redirectPath}`
  const supabaseProvider = provider === 'microsoft' ? 'azure' : 'google'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: supabaseProvider,
    options: {
      redirectTo,
      queryParams: {
        prompt: 'select_account',
      },
    },
  })

  return {
    data,
    error: error ? new Error(error.message) : null,
  }
}

export async function signUpWithEmailPassword({
  email,
  password,
  fullName,
}: {
  email: string
  password: string
  fullName: string
}): Promise<AuthResult> {
  if (!supabase) {
    if (!email || !password || !fullName) {
      return { data: null, error: new Error('Full name, email and password are required.') }
    }
    return createDemoSession(email, fullName)
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return {
    data,
    error: error ? new Error(error.message) : null,
  }
}

export async function signOut() {
  if (supabase) {
    await supabase.auth.signOut()
  }
  clearStoredSession()
}
