import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import heroVideo from './assets/Videos/istockphoto-1448482430-640_adpp_is.mp4'
import { readStoredSession, signInWithEmailPassword, signInWithOAuth, signOut, signUpWithEmailPassword, supabase, type OAuthProvider } from './lib/supabase'

type IconName = 'dashboard' | 'news' | 'calendar' | 'sessions' | 'kyc' | 'payments' | 'support' | 'notifications' | 'book' | 'ongoing' | 'membership' | 'search' | 'bell' | 'settings' | 'user' | 'document' | 'money' | 'arrow' | 'mail' | 'lock' | 'person'

type NavItem = {
  label: string
  path: string
  icon: IconName
  description?: string
}

type BookingSession = {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
  notes: string
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'Closed'
}

type NewsItem = {
  id: number
  title: string
  category: 'News' | 'Event'
  date: string
  time: string
  summary: string
  image: string
}

type UserKycProfile = {
  fullName: string
  officialEmail: string
  phoneNumber: string
  alternatePhone: string
  company: string
  practiceArea: string
  officeAddress: string
  residentialAddress: string
  matterType: string
  opposingParty: string
  previouslyConsulted: string
  caseUrgency: string
  preferredContactMethod: string
  preferredConsultationDate: string
  preferredConsultationTime: string
  howDidYouHear: string
  briefSummary: string
  avatar?: string
}

type AdminTicket = {
  id: string
  submittedBy: string
  clientEmail: string
  subject: string
  category: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Review' | 'Resolved'
  createdAt: string
  description: string
}

const logoUrl = '/images/hergers-logo.png'

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'News & Events', path: '/news-events', icon: 'news' },
  { label: 'Bookings & Sessions', path: '/bookings', icon: 'calendar' },
  { label: 'Manage Sessions', path: '/recent-bookings', icon: 'sessions' },
  { label: "User's KYC", path: '/profile', icon: 'kyc' },
  { label: 'Manage Payments', path: '/payments', icon: 'payments' },
  { label: 'IT & Admin Support', path: '/support', icon: 'support' },
  { label: 'Notifications', path: '/documents', icon: 'notifications' },
]

const adminNewsSeed: NewsItem[] = [
  {
    id: 1,
    title: 'New Corporate Governance Guidelines Released',
    category: 'News',
    date: 'Apr 28, 2025',
    time: '10:24 AM',
    summary:
      'The Federal Government has released new corporate governance guidelines aimed at strengthening transparency and accountability in the business sector.',
    image: '/images/courtroom-01.jpg',
  },
  {
    id: 2,
    title: 'Join Our Webinar: Understanding Intellectual Property Rights',
    category: 'Event',
    date: 'Apr 25, 2025',
    time: '2:30 PM',
    summary:
      'We invite you to our upcoming webinar on intellectual property rights, where our senior partners will discuss key legal considerations for businesses and creators.',
    image: '/images/courtroom-02.jpg',
  },
  {
    id: 3,
    title: 'Landmark Ruling on Employment Rights Sets New Precedent',
    category: 'News',
    date: 'Apr 22, 2025',
    time: '11:15 AM',
    summary:
      'A recent high court ruling has set a new precedent on employee rights, offering stronger protections for workers in the private sector.',
    image: '/images/courtroom-03.jpg',
  },
  {
    id: 4,
    title: 'Annual Legal Conference 2025 — Save the Date',
    category: 'Event',
    date: 'Apr 18, 2025',
    time: '4:20 PM',
    summary:
      'Our annual legal conference will be held on July 15–17, 2025, at the Lagos Continental Hotel. This year’s theme is “The Future of Law in a Digital World.”',
    image: '/images/courtroom-04.jpg',
  },
  {
    id: 5,
    title: 'Updated Client Privacy Policy',
    category: 'News',
    date: 'Apr 15, 2025',
    time: '9:45 AM',
    summary:
      'We have updated our privacy policy to better protect your data and ensure compliance with the latest data protection regulations.',
    image: '/images/office-01.jpg',
  },
  {
    id: 6,
    title: 'Pro Bono Legal Clinics This Quarter',
    category: 'Event',
    date: 'Apr 12, 2025',
    time: '1:00 PM',
    summary:
      'We are pleased to announce our pro bono legal clinics, offering free legal consultations to eligible individuals and small businesses in our community.',
    image: '/images/office-02.jpg',
  },
  {
    id: 7,
    title: 'Cybersecurity and Data Protection: What Businesses Need to Know',
    category: 'News',
    date: 'Apr 10, 2025',
    time: '8:30 AM',
    summary:
      'Our latest article explores essential cybersecurity practices and how to protect your business from emerging digital threats.',
    image: '/images/office-03.jpg',
  },
  {
    id: 8,
    title: 'Webinar: Navigating Tax Law Changes in 2025',
    category: 'Event',
    date: 'Apr 8, 2025',
    time: '3:00 PM',
    summary:
      'Join us for a live webinar on the latest tax law changes and what they mean for individuals and businesses. Expert insights, practical tips and Q&A included.',
    image: '/images/mining-01.jpg',
  },
]

const NEWS_DB_KEY = 'hergers_public_news'
const BOOKINGS_DB_KEY = 'hergers_client_sessions'
const USER_DB_KEY = 'hergers_user_database'
const ADMIN_DB_KEY = 'hergers_admin_database'

function readLocalStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeLocalStore<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

const initialSessions: BookingSession[] = [
  {
    id: 'sess-1',
    title: 'Commercial advisory consultation',
    date: '2026-11-02',
    time: '10:00',
    location: 'Virtual',
    type: 'Consultation',
    notes: 'Review compliance and corporate documentation.',
    status: 'Scheduled',
  },
  {
    id: 'sess-2',
    title: 'Employment law review',
    date: '2026-11-05',
    time: '14:30',
    location: 'Lagos office',
    type: 'Review',
    notes: 'Discuss policy and employee rights documentation.',
    status: 'Completed',
  },
]

function getCurrentUserEmail() {
  const currentSession = readStoredSession() as { email?: string } | null
  return currentSession?.email ?? 'guest@hergers.local'
}

function getDefaultUserProfile(email = getCurrentUserEmail()): UserKycProfile {
  return {
    fullName: '',
    officialEmail: email,
    phoneNumber: '',
    alternatePhone: '',
    company: '',
    practiceArea: 'General Enquiry',
    officeAddress: '',
    residentialAddress: '',
    matterType: '',
    opposingParty: '',
    previouslyConsulted: 'No',
    caseUrgency: 'Standard',
    preferredContactMethod: 'Email',
    preferredConsultationDate: '',
    preferredConsultationTime: '',
    howDidYouHear: '',
    briefSummary: '',
    avatar: '/images/portrait-03.jpg',
  }
}

function getUserDatabase(): Record<string, UserKycProfile> {
  return readLocalStore<Record<string, UserKycProfile>>(USER_DB_KEY, {})
}

function setUserDatabase(value: Record<string, UserKycProfile>) {
  writeLocalStore(USER_DB_KEY, value)
}

function getCurrentUserProfile() {
  const email = getCurrentUserEmail()
  const database = getUserDatabase()
  return database[email] ?? getDefaultUserProfile(email)
}

function getCurrentUserFirstName() {
  const fullName = getCurrentUserProfile().fullName?.trim()
  if (fullName) {
    return fullName.split(/\s+/)[0]
  }

  const email = getCurrentUserEmail()
  return email.split('@')[0] || 'there'
}

function saveCurrentUserProfile(profile: UserKycProfile) {
  const email = profile.officialEmail || getCurrentUserEmail()
  const database = getUserDatabase()
  database[email] = { ...profile, officialEmail: email }
  setUserDatabase(database)
}

const googleMark = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="social-svg">
    <path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3.1v2.5h3.2c1.9-1.7 3-4.2 3-7.4Z" fill="#4285F4"/>
    <path d="M12 22.1c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H.8v2.7A10.1 10.1 0 0 0 12 22.1Z" fill="#34A853"/>
    <path d="M6.4 18.4A6.1 6.1 0 0 1 6 15.7V13H2.8a10.1 10.1 0 0 0 0 9.1l3.6-3.4Z" fill="#FBBC05"/>
    <path d="M12 4.1c1.4 0 2.7.5 3.7 1.5l2.8-2.8A9.8 9.8 0 0 0 12 1.9a10.1 10.1 0 0 0-9.2 5.5l3.7 2.9c.8-2.4 3-4.2 5.5-4.2Z" fill="#EA4335"/>
  </svg>
)

const microsoftMark = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="social-svg">
    <path d="M3 3h8.5v8.5H3V3Zm9.5 0H21v8.5h-8.5V3ZM3 12.5h8.5V21H3v-8.5Zm9.5 0H21V21h-8.5v-8.5Z" fill="#F25022"/>
    <path d="M12.5 3h8.5v8.5h-8.5V3ZM3 12.5h8.5V21H3v-8.5Zm9.5 0h8.5V21h-8.5v-8.5Z" fill="#7FBA00"/>
  </svg>
)

const featureList = [
  {
    title: 'Expert Legal Guidance',
    text: 'Get trusted advice from experienced legal professionals.',
    icon: 'dashboard' as IconName,
  },
  {
    title: 'Book Sessions',
    text: 'Schedule consultations and legal sessions with ease.',
    icon: 'calendar' as IconName,
  },
  {
    title: 'Latest News & Insights',
    text: 'Stay informed with the latest legal updates and resources.',
    icon: 'news' as IconName,
  },
]

function AppIcon({ name, className = '', size = 18 }: { name: IconName; className?: string; size?: number }) {
  const commonProps = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className }

  switch (name) {
    case 'dashboard':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="4" rx="1.5" />
          <rect x="14" y="11" width="7" height="10" rx="1.5" />
          <rect x="3" y="12" width="7" height="9" rx="1.5" />
        </svg>
      )
    case 'news':
      return (
        <svg {...commonProps}>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h9.5A2.5 2.5 0 0 1 18.5 6.5v9A2.5 2.5 0 0 1 16 18H6.5A2.5 2.5 0 0 1 4 15.5v-9Z" />
          <path d="M7 8h7M7 11h7M7 14h5" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      )
    case 'sessions':
      return (
        <svg {...commonProps}>
          <path d="M8 4h8" />
          <path d="M7 7h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      )
    case 'kyc':
      return (
        <svg {...commonProps}>
          <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
          <circle cx="10" cy="7" r="3" />
          <path d="M19 8v6M16 11h6" />
        </svg>
      )
    case 'payments':
      return (
        <svg {...commonProps}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
          <path d="M2.5 10.5h19" />
          <path d="M7 15.5h4" />
        </svg>
      )
    case 'support':
      return (
        <svg {...commonProps}>
          <path d="M4 12a8 8 0 1 1 16 0v2.5A2.5 2.5 0 0 1 17.5 17H16v-3h3" />
          <path d="M8 18v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1" />
          <path d="M8.5 12h.01M15.5 12h.01" />
        </svg>
      )
    case 'notifications':
      return (
        <svg {...commonProps}>
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'book':
      return (
        <svg {...commonProps}>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
          <path d="M8 3v4M16 3v4M8 11h8M8 15h5" />
        </svg>
      )
    case 'ongoing':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      )
    case 'membership':
      return (
        <svg {...commonProps}>
          <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-7Z" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      )
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="5.5" />
          <path d="m16 16 4 4" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...commonProps}>
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...commonProps}>
          <path d="M12 3v3M12 18v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M3 12h3M18 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      )
    case 'user':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 19a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
        </svg>
      )
    case 'person':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M5 19a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'document':
      return (
        <svg {...commonProps}>
          <path d="M7 3.5h6l5 5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
          <path d="M13 3.5V9h5M8 12h8M8 15h8" />
        </svg>
      )
    case 'money':
      return (
        <svg {...commonProps}>
          <path d="M12 3v18M16 7.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5S9.8 10 12 10s4 1.1 4 2.5S14.2 15 12 15s-4-1.1-4-2.5" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...commonProps}>
          <path d="M5 12h14" />
          <path d="m13 5 7 7-7 7" />
        </svg>
      )
    default:
      return null
  }
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="/news-events" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="/recent-bookings" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      if (!supabase) {
        const session = readStoredSession()
        if (isMounted) {
          setIsAuthenticated(Boolean(session))
          setIsReady(true)
        }
        return
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (isMounted) {
          setIsAuthenticated(Boolean(session))
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false)
        }
      } finally {
        if (isMounted) {
          setIsReady(true)
        }
      }
    }

    syncSession()

    const subscription = supabase
      ? supabase.auth.onAuthStateChange((_event, session) => {
          if (isMounted) {
            setIsAuthenticated(Boolean(session))
            setIsReady(true)
          }
        }).data.subscription
      : null

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  if (!isReady) {
    return <div className="auth-loading">Loading your secure workspace…</div>
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<OAuthProvider | null>(null)

  useEffect(() => {
    setError('')
  }, [])

  const handleSocialLogin = async (provider: OAuthProvider) => {
    setError('')
    setIsSocialLoading(provider)

    try {
      const { data, error: oauthError } = await signInWithOAuth(provider)

      if (oauthError || !data?.url) {
        throw new Error(oauthError?.message ?? 'Single sign-on is unavailable right now.')
      }

      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue with your company SSO.')
    } finally {
      setIsSocialLoading(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: signInError } = await signInWithEmailPassword({ email, password })

      if (signInError || !data?.user) {
        throw new Error(signInError?.message ?? 'Unable to sign in today.')
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      leftTitle=""
      subTitle="Justice • Integrity • Results"
      badge="Welcome to"
      formTitle="Sign In to Your Account"
      description="Access your dashboard, book sessions, read the latest legal news and more."
      form={
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span className="field-icon"><AppIcon name="mail" size={16} /></span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" aria-label="Email address" />
          </label>

          <label className="field">
            <span className="field-icon"><AppIcon name="lock" size={16} /></span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" aria-label="Password" />
          </label>

          {error ? <div className="error-box">{error}</div> : null}

          <div className="auth-row">
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-link">Forgot password?</button>
          </div>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In…' : 'Sign In'}
            <span>→</span>
          </button>

          <div className="divider"><span>or</span></div>

          <button type="button" className="social-button google-button" onClick={() => handleSocialLogin('google')} disabled={isSocialLoading !== null}>
            <span className="social-mark">{googleMark}</span>
            {isSocialLoading === 'google' ? 'Continuing with Google…' : 'Continue with Google'}
          </button>
          <button type="button" className="social-button microsoft-button" onClick={() => handleSocialLogin('microsoft')} disabled={isSocialLoading !== null}>
            <span className="social-mark">{microsoftMark}</span>
            {isSocialLoading === 'microsoft' ? 'Continuing with Microsoft…' : 'Continue with Microsoft'}
          </button>

          <p className="switch-line">
            Don’t have an account? <button type="button" className="text-link" onClick={() => navigate('/signup')}>Sign Up</button>
          </p>
        </form>
      }
    />
  )
}

function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<OAuthProvider | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSocialSignup = async (provider: OAuthProvider) => {
    setError('')
    setIsSocialLoading(provider)

    try {
      const { data, error: oauthError } = await signInWithOAuth(provider)

      if (oauthError || !data?.url) {
        throw new Error(oauthError?.message ?? 'Single sign-on sign-up is unavailable right now.')
      }

      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to continue with your company SSO.')
    } finally {
      setIsSocialLoading(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!form.fullName || !form.email || !form.password) {
      setError('Please complete all fields to create your account.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: signUpError } = await signUpWithEmailPassword({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      })

      if (signUpError || !data?.user) {
        throw new Error(signUpError?.message ?? 'Unable to create your account right now.')
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      leftTitle=""
      subTitle="Justice • Integrity • Results"
      badge="Create your"
      formTitle="Sign Up for Client Access"
      description="Build your secure client profile, manage legal sessions and receive the latest updates from our team."
      form={
        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field">
            <span className="field-icon"><AppIcon name="person" size={16} /></span>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" aria-label="Full name" />
          </label>

          <label className="field">
            <span className="field-icon"><AppIcon name="mail" size={16} /></span>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" aria-label="Email address" />
          </label>

          <label className="field">
            <span className="field-icon"><AppIcon name="lock" size={16} /></span>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" aria-label="Password" />
          </label>

          {error ? <div className="error-box">{error}</div> : null}

          <div className="divider"><span>or continue with SSO</span></div>

          <button type="button" className="social-button google-button" onClick={() => handleSocialSignup('google')} disabled={isSocialLoading !== null}>
            <span className="social-mark">{googleMark}</span>
            {isSocialLoading === 'google' ? 'Continuing with Google…' : 'Continue with Google'}
          </button>
          <button type="button" className="social-button microsoft-button" onClick={() => handleSocialSignup('microsoft')} disabled={isSocialLoading !== null}>
            <span className="social-mark">{microsoftMark}</span>
            {isSocialLoading === 'microsoft' ? 'Continuing with Microsoft…' : 'Continue with Microsoft'}
          </button>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
            <span>→</span>
          </button>

          <p className="switch-line">
            Already have an account? <button type="button" className="text-link" onClick={() => navigate('/login')}>Sign In</button>
          </p>
        </form>
      }
    />
  )
}

function DashboardLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <img src={logoUrl} alt="Herger's & Co. logo" className="brand-mark" />
          <div>
            <div className="brand-name">Herger's & Co.</div>
            <div className="brand-subtitle">Justice • Integrity • Results</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon"><AppIcon name={item.icon} size={18} /></span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="signout-button" onClick={handleSignOut}><AppIcon name="arrow" size={16} /> Sign Out</button>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="search-box">
            <span className="search-icon"><AppIcon name="search" size={18} /></span>
            <input type="text" placeholder="Search news, events or topics..." aria-label="Search" />
          </div>
          <div className="topbar-right">
            <button type="button" className="notification-button" aria-label="Notifications" onClick={() => navigate('/documents')}>
              <AppIcon name="bell" size={18} />
              <span className="notification-badge">3</span>
            </button>
            <button type="button" className="profile-chip-button" onClick={() => navigate('/profile')} aria-label="Open profile">
              <div className="profile-chip">
                <img src="/images/portrait-03.jpg" alt="Daniel Johnson" />
                <div>
                  <strong>Good morning,</strong>
                  <span>Daniel Johnson</span>
                </div>
              </div>
            </button>
          </div>
        </header>

        <div className="content-area">
          <PageRenderer />
        </div>

        <nav className="mobile-bottom-nav" aria-label="Main navigation">
          {navItems.slice(0, 4).map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
              <span><AppIcon name={item.icon} size={18} /></span>
              <small>{item.label}</small>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  )
}

function PageRenderer() {
  const location = useLocation()

  switch (location.pathname) {
    case '/dashboard':
      return <DashboardHome />
    case '/news-events':
      return <NewsEventsPage />
    case '/bookings':
      return <BookingsPage />
    case '/recent-bookings':
      return <RecentBookingsPage />
    case '/profile':
      return <ProfilePage />
    case '/payments':
      return <PaymentsPage />
    case '/support':
      return <SupportPage />
    case '/documents':
      return <DocumentsPage />
    default:
      return <DashboardHome />
  }
}

function DashboardHome() {
  const navigate = useNavigate()
  const ctaMetrics = [
    { label: 'Book a Session', path: '/bookings', count: 12, accent: '#0d5da5', icon: 'book' as IconName },
    { label: 'Ongoing Sessions', path: '/recent-bookings', count: 6, accent: '#1ca889', icon: 'ongoing' as IconName },
    { label: 'News & Events', path: '/news-events', count: 8, accent: '#f7b267', icon: 'news' as IconName },
    { label: 'Manage Membership', path: '/profile', count: 2, accent: '#7b61ff', icon: 'membership' as IconName },
  ]

  return (
    <section className="dashboard-grid">
      <div className="cta-grid">
        {ctaMetrics.map((item) => (
          <button type="button" key={item.label} className="cta-card" onClick={() => { navigate(item.path); window.location.assign(item.path) }} style={{ ['--cta-accent' as string]: item.accent }}>
            <div className="cta-topline">
              <span className="cta-icon"><AppIcon name={item.icon} size={22} /></span>
              <span className="cta-index">{item.count}</span>
            </div>
            <div className="cta-label">{item.label}</div>
          </button>
        ))}
      </div>
    </section>
  )
}

function NewsEventsPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'News' | 'Event'>('All')
  const [newsItems] = useState<NewsItem[]>(() => readLocalStore<NewsItem[]>(NEWS_DB_KEY, adminNewsSeed))
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filteredItems = activeFilter === 'All' ? newsItems : newsItems.filter((item) => item.category === activeFilter)
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setPage(1)
  }, [activeFilter])

  return (
    <section className="news-page">
      <div className="news-toolbar">
        <div className="toolbar-tags">
          {(['All', 'News', 'Event'] as const).map((filter) => (
            <button key={filter} type="button" className={filter === activeFilter ? 'tag-button active' : 'tag-button'} onClick={() => setActiveFilter(filter)}>
              {filter}
            </button>
          ))}
        </div>
        <button type="button" className="ghost-button">Newest first</button>
      </div>

      <div className="news-list compact-news-list">
        {visibleItems.map((item) => (
          <article key={item.id} className="news-row wide-news-row">
            <div className="news-copy">
              <div className="news-header">
                <h3>
                  <span className="news-tag">{item.category}</span>
                  {item.title}
                </h3>
                <div className="date-block">
                  <span>{item.date}</span>
                  <span>{item.time}</span>
                </div>
              </div>
              <p>{item.summary}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination-row bottom-pagination">
        <button type="button" className="ghost-button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
        <span>Page {currentPage} of {pageCount}</span>
        <button type="button" className="ghost-button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button>
      </div>
    </section>
  )
}

function BookingsPage() {
  const profile = getCurrentUserProfile()
  const [form, setForm] = useState({
    fullName: profile.fullName || '',
    officialEmail: profile.officialEmail || getCurrentUserEmail(),
    phoneNumber: profile.phoneNumber || '',
    alternatePhone: profile.alternatePhone || '',
    company: profile.company || '',
    practiceArea: profile.practiceArea || 'General Enquiry',
    officeAddress: profile.officeAddress || '',
    residentialAddress: profile.residentialAddress || '',
    matterType: profile.matterType || '',
    opposingParty: profile.opposingParty || '',
    previouslyConsulted: profile.previouslyConsulted || 'No',
    caseUrgency: profile.caseUrgency || 'Standard',
    preferredContactMethod: profile.preferredContactMethod || 'Email',
    preferredConsultationDate: profile.preferredConsultationDate || '',
    preferredConsultationTime: profile.preferredConsultationTime || '',
    howDidYouHear: profile.howDidYouHear || '',
    briefSummary: profile.briefSummary || '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const nextProfile = getCurrentUserProfile()
    setForm((current) => ({
      ...current,
      fullName: nextProfile.fullName || current.fullName,
      officialEmail: nextProfile.officialEmail || current.officialEmail,
      phoneNumber: nextProfile.phoneNumber || current.phoneNumber,
      alternatePhone: nextProfile.alternatePhone || current.alternatePhone,
      company: nextProfile.company || current.company,
      practiceArea: nextProfile.practiceArea || current.practiceArea,
      officeAddress: nextProfile.officeAddress || current.officeAddress,
      residentialAddress: nextProfile.residentialAddress || current.residentialAddress,
      matterType: nextProfile.matterType || current.matterType,
      opposingParty: nextProfile.opposingParty || current.opposingParty,
      previouslyConsulted: nextProfile.previouslyConsulted || current.previouslyConsulted,
      caseUrgency: nextProfile.caseUrgency || current.caseUrgency,
      preferredContactMethod: nextProfile.preferredContactMethod || current.preferredContactMethod,
      preferredConsultationDate: nextProfile.preferredConsultationDate || current.preferredConsultationDate,
      preferredConsultationTime: nextProfile.preferredConsultationTime || current.preferredConsultationTime,
      howDidYouHear: nextProfile.howDidYouHear || current.howDidYouHear,
      briefSummary: nextProfile.briefSummary || current.briefSummary,
    }))
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextProfile: UserKycProfile = { ...profile, ...form, officialEmail: form.officialEmail || getCurrentUserEmail() }
    saveCurrentUserProfile(nextProfile)

    const nextSession: BookingSession = {
      id: `sess-${Date.now()}`,
      title: nextProfile.matterType || 'Consultation request',
      date: nextProfile.preferredConsultationDate || '2026-11-10',
      time: nextProfile.preferredConsultationTime || '09:30',
      location: nextProfile.practiceArea || 'Virtual',
      type: nextProfile.matterType || 'Consultation',
      notes: nextProfile.briefSummary || 'Session details pending confirmation.',
      status: 'Scheduled',
    }

    const currentSessions = readLocalStore<BookingSession[]>(BOOKINGS_DB_KEY, initialSessions)
    writeLocalStore(BOOKINGS_DB_KEY, [nextSession, ...currentSessions])
    setMessage('Session created successfully and saved to your client database.')
  }

  return (
    <section className="simple-page">
      <div className="card-panel booking-panel">
        <div className="panel-header">
          <h2>Create a Session</h2>
        </div>

        <form className="kyc-form booking-form" onSubmit={handleSubmit}>
          <label>
            <span>Full Name *</span>
            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} />
          </label>
          <label>
            <span>Official Email *</span>
            <input type="email" name="officialEmail" value={form.officialEmail} onChange={handleChange} />
          </label>
          <label>
            <span>Phone Number *</span>
            <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          </label>
          <label>
            <span>Alternate Phone Number</span>
            <input type="tel" name="alternatePhone" value={form.alternatePhone} onChange={handleChange} />
          </label>
          <label>
            <span>Company / Organisation</span>
            <input type="text" name="company" value={form.company} onChange={handleChange} />
          </label>
          <label>
            <span>Practice Area *</span>
            <select name="practiceArea" value={form.practiceArea} onChange={handleChange}>
              <option>General Enquiry</option>
              <option>Mining & Production Law</option>
              <option>Taxation & Policies</option>
              <option>Risk & Compliance</option>
              <option>Corporate Governance</option>
              <option>Litigation & ADR</option>
            </select>
          </label>
          <label className="full-span">
            <span>Office Address</span>
            <input type="text" name="officeAddress" value={form.officeAddress} onChange={handleChange} />
          </label>
          <label className="full-span">
            <span>Residential Address</span>
            <input type="text" name="residentialAddress" value={form.residentialAddress} onChange={handleChange} />
          </label>
          <label>
            <span>Matter / Case Type</span>
            <input type="text" name="matterType" value={form.matterType} onChange={handleChange} placeholder="e.g. Contract Dispute, Property Acquisition" />
          </label>
          <label>
            <span>Opposing Party (if any)</span>
            <input type="text" name="opposingParty" value={form.opposingParty} onChange={handleChange} />
          </label>
          <label>
            <span>Previously Consulted Another Lawyer / Firm On This Matter?</span>
            <select name="previouslyConsulted" value={form.previouslyConsulted} onChange={handleChange}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
          <label>
            <span>Case Urgency Level</span>
            <select name="caseUrgency" value={form.caseUrgency} onChange={handleChange}>
              <option>Standard</option>
              <option>Urgent</option>
              <option>High Priority</option>
            </select>
          </label>
          <label>
            <span>Preferred Contact Method</span>
            <select name="preferredContactMethod" value={form.preferredContactMethod} onChange={handleChange}>
              <option>Email</option>
              <option>Phone</option>
              <option>WhatsApp</option>
            </select>
          </label>
          <label>
            <span>Preferred Consultation Date</span>
            <input type="date" name="preferredConsultationDate" value={form.preferredConsultationDate} onChange={handleChange} />
          </label>
          <label>
            <span>Preferred Consultation Time</span>
            <input type="time" name="preferredConsultationTime" value={form.preferredConsultationTime} onChange={handleChange} />
          </label>
          <label>
            <span>How Did You Hear About Us?</span>
            <input type="text" name="howDidYouHear" value={form.howDidYouHear} onChange={handleChange} />
          </label>
          <label className="full-span">
            <span>Brief Summary / Background Of Your Matter *</span>
            <textarea name="briefSummary" value={form.briefSummary} onChange={handleChange} rows={5} />
          </label>

          {message ? <div className="success-box">{message}</div> : null}

          <button type="submit" className="primary-button full-width-button">Schedule Consultation</button>
        </form>
      </div>
    </section>
  )
}

function RecentBookingsPage() {
  const [sessions, setSessions] = useState<BookingSession[]>(() => readLocalStore<BookingSession[]>(BOOKINGS_DB_KEY, initialSessions))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | BookingSession['status']>('All')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filteredSessions = sessions.filter((session) => {
    const matchesStatus = statusFilter === 'All' || session.status === statusFilter
    const haystack = `${session.title} ${session.date} ${session.status} ${session.location}`.toLowerCase()
    const matchesSearch = haystack.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const pageCount = Math.max(1, Math.ceil(filteredSessions.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleSessions = filteredSessions.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const updateStatus = (id: string, status: BookingSession['status']) => {
    const next = sessions.map((session) => session.id === id ? { ...session, status } : session)
    setSessions(next)
    writeLocalStore(BOOKINGS_DB_KEY, next)
  }

  const removeSession = (id: string) => {
    const next = sessions.filter((session) => session.id !== id)
    setSessions(next)
    writeLocalStore(BOOKINGS_DB_KEY, next)
  }

  return (
    <section className="simple-page">
      <div className="card-panel table-card">
        <div className="panel-header"><h2>Manage Sessions</h2></div>
        <div className="table-controls">
          <input type="text" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Filter by title, date, status..." />
          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as 'All' | BookingSession['status']); setPage(1) }}>
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="session-table-wrap">
          <table className="data-table session-table">
            <thead><tr><th>Title</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {visibleSessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.title}</td>
                  <td>{session.date}</td>
                  <td>{session.time}</td>
                  <td><span className={`status-badge ${session.status === 'Completed' ? 'success' : 'neutral'}`}>{session.status}</span></td>
                  <td className="action-stack">
                    <button type="button" className="mini-button success" onClick={() => updateStatus(session.id, 'Completed')}>Completed</button>
                    <button type="button" className="mini-button neutral" onClick={() => updateStatus(session.id, 'Closed')}>Close</button>
                    <button type="button" className="mini-button warning" onClick={() => updateStatus(session.id, 'Rescheduled')}>Reschedule</button>
                    <button type="button" className="mini-button danger" onClick={() => removeSession(session.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-row">
          <button type="button" className="ghost-button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
          <span>Page {currentPage} of {pageCount}</span>
          <button type="button" className="ghost-button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button>
        </div>
      </div>
    </section>
  )
}

function ProfilePage() {
  const [profile, setProfile] = useState<UserKycProfile>(() => getCurrentUserProfile())

  useEffect(() => {
    setProfile(getCurrentUserProfile())
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    saveCurrentUserProfile(profile)
  }

  const firstName = profile.fullName?.trim() ? profile.fullName.trim().split(/\s+/)[0] : getCurrentUserFirstName()

  return (
    <section className="simple-page">
      <div className="card-panel profile-card">
        <div className="panel-header"><h2>User KYC</h2><button type="button" className="ghost-button">Edit</button></div>

        <div className="profile-intro">
          <div className="profile-greeting">
            <span>Welcome, {firstName}</span>
          </div>
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-square">
              <img src={profile.avatar || '/images/portrait-03.jpg'} alt="User profile" className="profile-avatar" />
            </div>
          </div>
        </div>

        <form className="kyc-form" onSubmit={handleSubmit}>
          <div className="profile-layout">
            <div className="profile-form-grid" style={{ gridColumn: '1 / -1' }}>
              <label><span>Full Name</span><input type="text" name="fullName" value={profile.fullName} onChange={handleChange} /></label>
              <label><span>Official Email</span><input type="email" name="officialEmail" value={profile.officialEmail} onChange={handleChange} /></label>
              <label><span>Phone Number</span><input type="tel" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} /></label>
              <label><span>Alternate Phone</span><input type="tel" name="alternatePhone" value={profile.alternatePhone} onChange={handleChange} /></label>
              <label><span>Company / Organisation</span><input type="text" name="company" value={profile.company} onChange={handleChange} /></label>
              <label><span>Practice Area</span><select name="practiceArea" value={profile.practiceArea} onChange={handleChange}><option>General Enquiry</option><option>Mining & Production Law</option><option>Taxation & Policies</option><option>Risk & Compliance</option><option>Corporate Governance</option><option>Litigation & ADR</option></select></label>
              <label className="full-span"><span>Office Address</span><input type="text" name="officeAddress" value={profile.officeAddress} onChange={handleChange} /></label>
              <label className="full-span"><span>Residential Address</span><input type="text" name="residentialAddress" value={profile.residentialAddress} onChange={handleChange} /></label>
              <label><span>Matter / Case Type</span><input type="text" name="matterType" value={profile.matterType} onChange={handleChange} /></label>
              <label><span>Opposing Party (if any)</span><input type="text" name="opposingParty" value={profile.opposingParty} onChange={handleChange} /></label>
              <label><span>Previously Consulted Another Lawyer?</span><select name="previouslyConsulted" value={profile.previouslyConsulted} onChange={handleChange}><option>No</option><option>Yes</option></select></label>
              <label><span>Case Urgency Level</span><select name="caseUrgency" value={profile.caseUrgency} onChange={handleChange}><option>Standard</option><option>Urgent</option><option>High Priority</option></select></label>
              <label><span>Preferred Contact Method</span><select name="preferredContactMethod" value={profile.preferredContactMethod} onChange={handleChange}><option>Email</option><option>Phone</option><option>WhatsApp</option></select></label>
              <label><span>Preferred Consultation Date</span><input type="date" name="preferredConsultationDate" value={profile.preferredConsultationDate} onChange={handleChange} /></label>
              <label><span>Preferred Consultation Time</span><input type="time" name="preferredConsultationTime" value={profile.preferredConsultationTime} onChange={handleChange} /></label>
              <label><span>How Did You Hear About Us?</span><input type="text" name="howDidYouHear" value={profile.howDidYouHear} onChange={handleChange} /></label>
              <label className="full-span"><span>Brief Summary / Background</span><textarea name="briefSummary" value={profile.briefSummary} onChange={handleChange} rows={5} /></label>
            </div>
          </div>

          <button type="submit" className="primary-button full-width-button">Save KYC Profile</button>
        </form>
      </div>
    </section>
  )
}

function PaymentsPage() {
  return (
    <section className="simple-page">
      <div className="card-panel">
        <div className="panel-header"><h2>Payment checkout</h2></div>
        <div className="invoice-box">
          <div className="invoice-row"><span>Legal consultation</span><strong>₦245,000</strong></div>
          <div className="invoice-row"><span>Document review</span><strong>₦120,000</strong></div>
          <div className="invoice-row total"><span>Total</span><strong>₦365,000</strong></div>
          <button type="button" className="primary-button">Proceed to payment</button>
        </div>
      </div>
    </section>
  )
}

function SupportPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>(() => readLocalStore<AdminTicket[]>(ADMIN_DB_KEY, [
    {
      id: 'SUP-1010',
      submittedBy: 'Admin Team',
      clientEmail: 'support@hergers.local',
      subject: 'Access issue to secure portal',
      category: 'Portal Access',
      priority: 'High',
      status: 'In Review',
      createdAt: '2026-10-30',
      description: 'Customer cannot access secure portal after password reset.',
    },
    {
      id: 'SUP-1011',
      submittedBy: 'Admin Team',
      clientEmail: 'support@hergers.local',
      subject: 'Client document upload failed',
      category: 'File Upload',
      priority: 'Medium',
      status: 'Resolved',
      createdAt: '2026-10-28',
      description: 'Uploaded files were not syncing to the secure document vault.',
    },
  ]))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | AdminTicket['status']>('All')
  const [page, setPage] = useState(1)
  const [activeModule, setActiveModule] = useState<'form' | 'tickets'>('form')
  const pageSize = 5

  const [form, setForm] = useState({
    submittedBy: 'Admin Team',
    clientEmail: '',
    subject: '',
    category: 'Portal Access',
    priority: 'Medium' as AdminTicket['priority'],
    description: '',
  })

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter
    const haystack = `${ticket.subject} ${ticket.category} ${ticket.status} ${ticket.clientEmail}`.toLowerCase()
    const matchesSearch = haystack.includes(search.trim().toLowerCase())
    return matchesStatus && matchesSearch
  })

  const pageCount = Math.max(1, Math.ceil(filteredTickets.length / pageSize))

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextTicket: AdminTicket = {
      id: `SUP-${Math.floor(Math.random() * 9000 + 1000)}`,
      submittedBy: form.submittedBy,
      clientEmail: form.clientEmail || getCurrentUserEmail(),
      subject: form.subject || 'New support request',
      category: form.category,
      priority: form.priority,
      status: 'Open',
      createdAt: new Date().toISOString().slice(0, 10),
      description: form.description || 'No additional details provided.',
    }

    const nextTickets = [nextTicket, ...tickets]
    setTickets(nextTickets)
    writeLocalStore(ADMIN_DB_KEY, nextTickets)
    setForm({ submittedBy: 'Admin Team', clientEmail: '', subject: '', category: 'Portal Access', priority: 'Medium', description: '' })
    setPage(1)
  }

  const currentPage = Math.min(page, pageCount)
  const visiblePageTickets = filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <section className="simple-page support-module-page">
      <div className="card-panel table-card support-module-panel">
        <div className="panel-header module-header">
          <h2>IT & Admin Support</h2>
          <div className="module-switcher" aria-label="Support modules">
            <button type="button" className={activeModule === 'form' ? 'tag-button active compact-button' : 'tag-button compact-button'} onClick={() => setActiveModule('form')}>IT Admin Form</button>
            <button type="button" className={activeModule === 'tickets' ? 'tag-button active compact-button' : 'tag-button compact-button'} onClick={() => setActiveModule('tickets')}>Support Ticket</button>
          </div>
        </div>

        {activeModule === 'form' ? (
          <form className="kyc-form booking-form compact-form" onSubmit={handleSubmit}>
            <label>
              <span>Submitted By</span>
              <input type="text" name="submittedBy" value={form.submittedBy} onChange={handleChange} />
            </label>
            <label>
              <span>Client Email</span>
              <input type="email" name="clientEmail" value={form.clientEmail} onChange={handleChange} placeholder={getCurrentUserEmail()} />
            </label>
            <label>
              <span>Subject</span>
              <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Access issue to secure portal" />
            </label>
            <label>
              <span>Category</span>
              <select name="category" value={form.category} onChange={handleChange}>
                <option>Portal Access</option>
                <option>File Upload</option>
                <option>Billing</option>
                <option>Data Request</option>
                <option>General Enquiry</option>
              </select>
            </label>
            <label>
              <span>Priority</span>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </label>
            <label className="full-span">
              <span>Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} />
            </label>
            <button type="submit" className="primary-button compact-button full-width-button">Submit Ticket</button>
          </form>
        ) : (
          <>
            <div className="table-controls">
              <input type="text" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Filter tickets by subject, category, email..." />
              <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as 'All' | AdminTicket['status']); setPage(1) }}>
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="session-table-wrap">
              <table className="data-table session-table">
                <thead><tr><th>ID</th><th>Client</th><th>Subject</th><th>Priority</th><th>Status</th><th>Created</th></tr></thead>
                <tbody>
                  {visiblePageTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.clientEmail}</td>
                      <td>{ticket.subject}</td>
                      <td>{ticket.priority}</td>
                      <td><span className={`status-badge ${ticket.status === 'Resolved' ? 'success' : 'neutral'}`}>{ticket.status}</span></td>
                      <td>{ticket.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-row support-pagination-row">
              <button type="button" className="ghost-button compact-button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
              <span>Page {currentPage} of {pageCount}</span>
              <button type="button" className="ghost-button compact-button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function DocumentsPage() {
  return (
    <section className="simple-page">
      <div className="card-panel">
        <div className="panel-header"><h2>Documents</h2><button type="button" className="ghost-button">Upload</button></div>
        <ul className="file-list">
          <li>Board resolution.pdf</li>
          <li>Employment policy draft.docx</li>
          <li>Independent legal opinion.pdf</li>
          <li>Data privacy acknowledgement.pdf</li>
        </ul>
      </div>
    </section>
  )
}

function AuthShell({ badge, leftTitle, subTitle, formTitle, description, form }: { badge: string; leftTitle: string; subTitle: string; formTitle: string; description: string; form: ReactNode }) {
  return (
    <div className="auth-page-shell">
      <header className="auth-header">
        <div className="logo-inline">
          <img src={logoUrl} alt="Herger's & Co. logo" className="brand-mark" />
          {leftTitle ? (
            <div className="logo-text">
              <span className="logo-name">{leftTitle}</span>
              <span className="logo-subtitle">{subTitle}</span>
            </div>
          ) : (
            <div className="logo-text">
              <span className="logo-subtitle">{subTitle}</span>
            </div>
          )}
        </div>
        <div className="trust-badge">Trusted Legal Guidance<br />for a Stronger Tomorrow</div>
      </header>

      <main className="auth-layout">
        <section className="auth-hero-panel">
          <div className="hero-visual">
            <video className="hero-video" src={heroVideo} autoPlay muted loop playsInline preload="auto" />
            <div className="hero-copy">
              <p className="eyebrow">{badge}</p>
              {leftTitle ? <h1>{leftTitle}</h1> : null}
              <p className="helper-copy">Access your dashboard, book sessions, read the latest legal news and more.</p>
            </div>

            <div className="feature-stack">
              {featureList.map((item) => (
                <div key={item.title} className="feature-item">
                  <div className="feature-icon"><AppIcon name={item.icon} size={20} /></div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-footer">
            <span>Don’t have an account?</span>
            <button type="button" className="primary-button small-button" onClick={() => window.location.assign('/signup')}>Sign Up <span>→</span></button>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-copy">
            <p className="eyebrow secondary">{badge}</p>
            <h2>{formTitle}</h2>
            <p>{description}</p>
          </div>
          {form}
        </section>
      </main>
    </div>
  )
}

export default App
