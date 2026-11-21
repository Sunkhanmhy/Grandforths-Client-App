import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AuthPage() {
  const navigate = useNavigate();
  const { session, signIn, signUp, signInWithGoogle, signInWithMicrosoft } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('client@grandforthlegal.com');
  const [password, setPassword] = useState('Welcome123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (session) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, fullName);
      if (result.error) {
        setError(result.error.message);
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    setLoading(true);
    setError('');
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithMicrosoft();
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <header className="auth-header">
        <div className="logo-inline">
          <div className="brand-mark">H</div>
          <div className="logo-text">
            <div className="logo-name">Grandforth Legal Practitioners & Co.</div>
            <div className="logo-subtitle">Client Law Portal</div>
          </div>
        </div>
        <div className="trust-badge">Confidential | Secure | Client-first</div>
      </header>

      <div className="auth-layout">
        <section className="auth-hero-panel">
          <div className="hero-visual">
            <div className="hero-copy">
              <p className="eyebrow">Trusted legal advisory</p>
              <h1>Professional legal support, delivered with clarity.</h1>
              <p className="helper-copy">
                Access your matters, documents, consultations, and secure updates in one place.
              </p>
            </div>

            <div className="feature-stack">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <div>
                  <h3>Case visibility</h3>
                  <p>Track your active matters, scheduled sessions, and key milestones.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div>
                  <h3>Privacy-first security</h3>
                  <p>Your information remains protected through secure access and role-based controls.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📄</div>
                <div>
                  <h3>Fast document access</h3>
                  <p>Upload, review, and store legal documents in a secure client workspace.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-copy">
            <h2>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
            <p>Sign in to manage your legal matters and keep your records secure.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <label className="field">
                <span className="field-text">Full name</span>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
              </label>
            )}

            <label className="field">
              <span className="field-text">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" />
            </label>

            <label className="field">
              <span className="field-text">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </label>

            {error && <div className="error-box">{error}</div>}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'signin' ? 'Access my portal' : 'Create account'}
            </button>
          </form>

          <div className="divider">or continue with</div>

          <div className="oauth-stack">
            <button type="button" className="social-button" onClick={() => handleOAuth('google')} disabled={loading}>
              <span className="social-mark">G</span>
              Google
            </button>
            <button type="button" className="social-button" onClick={() => handleOAuth('microsoft')} disabled={loading}>
              <span className="social-mark">M</span>
              Microsoft
            </button>
          </div>

          <p className="switch-line">
            {mode === 'signin' ? 'Need an account?' : 'Already registered?'}{' '}
            <button type="button" className="text-link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}
