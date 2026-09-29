'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    institution?: string;
    created_at: string;
}

interface ProfileStats {
    totalSessions: number;
    totalAttendees: number;
    activeSessions: number;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<ProfileStats>({ totalSessions: 0, totalAttendees: 0, activeSessions: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Editable fields
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editInstitution, setEditInstitution] = useState('');

    const router = useRouter();

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchProfile = useCallback(async () => {
        try {
            const [profileRes, analyticsRes] = await Promise.all([
                fetch('/api/auth/profile'),
                fetch('/api/analytics'),
            ]);

            if (!profileRes.ok) {
                router.push('/login');
                return;
            }

            const profileData = await profileRes.json();
            setUser(profileData.user);
            setEditName(profileData.user.name || '');
            setEditEmail(profileData.user.email || '');
            setEditPhone(profileData.user.phone || '');
            setEditInstitution(profileData.user.institution || '');

            if (analyticsRes.ok) {
                const analyticsData = await analyticsRes.json();
                setStats({
                    totalSessions: analyticsData.overview?.totalSessions || 0,
                    totalAttendees: analyticsData.overview?.totalAttendees || 0,
                    activeSessions: analyticsData.overview?.activeSessions || 0,
                });
            }
        } catch {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    email: editEmail,
                    phone: editPhone,
                    institution: editInstitution,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast('error', data.error || 'Failed to update profile');
                return;
            }

            setUser(data.user);
            showToast('success', 'Profile updated successfully!');
        } catch {
            showToast('error', 'Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (user) {
            setEditName(user.name || '');
            setEditEmail(user.email || '');
            setEditPhone(user.phone || '');
            setEditInstitution(user.institution || '');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) return null;

    const initials = user.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <Link href="/dashboard" className="navbar-brand">
                        <span className="brand-icon">📋</span>
                        <span>AttendX</span>
                    </Link>
                    <div className="navbar-links">
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/dashboard/analytics">Analytics</Link>
                        <Link href="/dashboard/profile" className="active">Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

            <div className="page-container">
                <div className="container" style={{ maxWidth: '820px' }}>
                    <div className="profile-page">
                        {/* Profile Header */}
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {initials}
                            </div>
                            <div className="profile-info">
                                <h1>{user.name}</h1>
                                <p className="profile-email">{user.email}</p>
                                <span className="profile-role">
                                    ✦ {user.role || 'Teacher'}
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="profile-section" style={{ animationDelay: '0.15s' }}>
                            <h2>📊 Your Activity</h2>
                            <div className="profile-stat-grid">
                                <div className="profile-stat-item">
                                    <div className="stat-number">{stats.totalSessions}</div>
                                    <div className="stat-name">Sessions Created</div>
                                </div>
                                <div className="profile-stat-item">
                                    <div className="stat-number">{stats.totalAttendees}</div>
                                    <div className="stat-name">Total Check-ins</div>
                                </div>
                                <div className="profile-stat-item">
                                    <div className="stat-number">{stats.activeSessions}</div>
                                    <div className="stat-name">Active Sessions</div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        <div className="profile-section" style={{ animationDelay: '0.2s' }}>
                            <h2>✏️ Edit Profile</h2>
                            <form onSubmit={handleSave} className="profile-form">
                                <div className="profile-form-row">
                                    <div className="input-group">
                                        <label htmlFor="profile-name">Full Name</label>
                                        <input
                                            id="profile-name"
                                            className="input"
                                            type="text"
                                            placeholder="Your full name"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="profile-email">Email Address</label>
                                        <input
                                            id="profile-email"
                                            className="input"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="profile-form-row">
                                    <div className="input-group">
                                        <label htmlFor="profile-phone">Phone Number</label>
                                        <input
                                            id="profile-phone"
                                            className="input"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="profile-institution">Institution</label>
                                        <input
                                            id="profile-institution"
                                            className="input"
                                            type="text"
                                            placeholder="University / School name"
                                            value={editInstitution}
                                            onChange={(e) => setEditInstitution(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Account info (read-only) */}
                                <div className="profile-form-row">
                                    <div className="input-group">
                                        <label>Role</label>
                                        <input
                                            className="input"
                                            type="text"
                                            value={user.role || 'teacher'}
                                            disabled
                                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Member Since</label>
                                        <input
                                            className="input"
                                            type="text"
                                            value={memberSince}
                                            disabled
                                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </div>

                                <div className="profile-form-actions">
                                    <button type="button" className="btn btn-secondary" onClick={handleReset}>
                                        ↩️ Reset
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                                                Saving...
                                            </span>
                                        ) : '💾 Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Account Actions */}
                        <div className="profile-section" style={{ animationDelay: '0.25s' }}>
                            <h2>⚙️ Account</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '18px 22px',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--border-subtle)',
                                    transition: 'all 0.2s',
                                }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>🔑 User ID</p>
                                        <p style={{
                                            color: 'var(--text-muted)',
                                            fontSize: '0.82rem',
                                            fontFamily: 'var(--font-mono)',
                                            marginTop: '4px',
                                        }}>
                                            {user.id}
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.id);
                                            showToast('success', 'User ID copied!');
                                        }}
                                    >
                                        📋 Copy
                                    </button>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '18px 22px',
                                    background: 'rgba(255, 92, 106, 0.04)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid rgba(255, 92, 106, 0.12)',
                                }}>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>🚪 Sign Out</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
                                            Sign out from your current session
                                        </p>
                                    </div>
                                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.message}
                </div>
            )}
        </>
    );
}
