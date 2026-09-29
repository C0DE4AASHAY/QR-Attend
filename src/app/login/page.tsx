'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
            const body = isRegister
                ? { name, email, password }
                : { email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                return;
            }

            router.push('/dashboard');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Google login failed');
                return;
            }

            router.push('/dashboard');
        } catch {
            setError('Network error during Google login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link href="/" className="navbar-brand" style={{ marginBottom: 36, display: 'flex', justifyContent: 'center' }}>
                    <span className="brand-icon">📋</span>
                    <span>AttendX</span>
                </Link>

                <h1 style={{ textAlign: 'center' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
                <p className="auth-subtitle" style={{ textAlign: 'center' }}>
                    {isRegister
                        ? 'Sign up to start tracking attendance'
                        : 'Sign in to your dashboard'}
                </p>

                {error && <div className="alert alert-error">⚠️ {error}</div>}

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed')}
                        theme="outline"
                        size="large"
                        width="100%"
                        text={isRegister ? "signup_with" : "signin_with"}
                    />
                </div>

                <div className="auth-divider">
                    <span>Or continue with email</span>
                </div>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                className="input"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            className="input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                className="input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ width: '100%', paddingRight: '48px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    fontSize: '1.1rem',
                                    padding: '4px',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '4px' }}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                Please wait...
                            </span>
                        ) : isRegister ? '🚀 Create Account' : '🔓 Sign In'}
                    </button>
                </form>

                <div className="auth-toggle">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary-light)',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 700,
                            fontSize: '0.92rem',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-secondary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-primary-light)')}
                    >
                        {isRegister ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}
