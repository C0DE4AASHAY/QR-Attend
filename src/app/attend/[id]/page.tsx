'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface SessionInfo {
    id: string;
    title: string;
    description: string;
    status: string;
    expires_at: string | null;
}

export default function AttendPage() {
    const params = useParams();
    const sessionId = params.id as string;
    const [session, setSession] = useState<SessionInfo | null>(null);
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`/api/sessions/${sessionId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSession(data.session);
                }
            } catch { } finally {
                setLoading(false);
            }
        })();
    }, [sessionId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_SECURE_API_URL || 'http://localhost:5000';

            // Generate basic frontend fingerprint
            const rawFingerprint = navigator.userAgent + (window.screen ? window.screen.width : '');
            const deviceFingerprint = btoa(rawFingerprint);

            const res = await fetch(`${API_URL}/api/v1/attendance/mark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentName,
                    studentId,
                    sessionId,
                    deviceFingerprint
                }),
            });

            // Parse response body safely whether success or error
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.message || data.error || 'Failed to mark attendance. Session may be invalid or you already scanned it.');
                return; // Stop execution, do NOT set success
            }

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Network error. Ensure you are connected and the session is active.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading session...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="attend-page">
                <div className="attend-card text-center">
                    <div style={{ fontSize: '3.5rem', marginBottom: 18, animation: 'float 4s ease-in-out infinite' }}>❌</div>
                    <h1>Session Not Found</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 10, lineHeight: 1.6 }}>
                        This attendance session does not exist or has been deleted.
                    </p>
                    <Link href="/" className="btn btn-primary mt-24" style={{ display: 'inline-flex' }}>
                        🏠 Go Home
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="attend-page">
                <div className="attend-card text-center">
                    <div style={{
                        fontSize: '4.5rem',
                        marginBottom: 18,
                        animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                    }}>✅</div>
                    <h1 style={{ color: 'var(--accent-success)', fontSize: '1.6rem' }}>Attendance Marked!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 10, fontSize: '1.02rem', lineHeight: 1.6 }}>
                        Your attendance for <strong style={{ color: 'var(--text-primary)' }}>{session.title}</strong> has been recorded successfully.
                    </p>
                    <div style={{
                        marginTop: 28,
                        padding: 20,
                        background: 'rgba(0, 229, 184, 0.04)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(0, 229, 184, 0.15)',
                    }}>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {studentName}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                            ID: {studentId} • {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="attend-page">
            <div className="attend-card">
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <Link href="/" className="navbar-brand" style={{ justifyContent: 'center', display: 'flex', marginBottom: 24 }}>
                        <span className="brand-icon">📋</span>
                        <span>AttendX</span>
                    </Link>
                    <h1>Mark Attendance</h1>
                    <p className="session-title">{session.title}</p>
                    {session.description && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{session.description}</p>
                    )}
                </div>

                {session.status !== 'active' && (
                    <div className="alert alert-error" style={{ textAlign: 'center', justifyContent: 'center' }}>
                        ⚠️ This session is no longer accepting attendance.
                    </div>
                )}

                {session.status === 'active' && (
                    <>
                        {error && <div className="alert alert-error">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="student-name">Your Name</label>
                                <input
                                    id="student-name"
                                    className="input"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="input-group" style={{ marginTop: 18 }}>
                                <label htmlFor="student-id">Student ID / Roll Number</label>
                                <input
                                    id="student-id"
                                    className="input"
                                    type="text"
                                    placeholder="Enter your student ID"
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                style={{ marginTop: 28 }}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                        Marking Attendance...
                                    </span>
                                ) : '✅ Mark My Attendance'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
