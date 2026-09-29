'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

export default function HomePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <main>
            {/* Navbar */}
            <Navbar />

            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        ⚡ Real-time Cloud Attendance
                    </div>
                    <h1>
                        Track Attendance<br />
                        <span className="gradient-text">Effortlessly</span>
                    </h1>
                    <p>
                        Generate QR codes, let students check in from their phones, and watch attendance appear in real-time. Powerful analytics at your fingertips.
                    </p>
                    <div className="hero-actions">
                        <Link href="/login" className="btn btn-primary btn-lg">
                            🚀 Start Tracking
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">
                            Learn More →
                        </a>
                    </div>

                    {/* Trust indicators */}
                    {mounted && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '32px',
                            marginTop: '56px',
                            opacity: 0,
                            animation: 'fadeInUp 0.8s ease 0.8s forwards',
                        }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                <span style={{
                                    fontSize: '1.6rem',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-mono)',
                                    background: 'var(--gradient-primary)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>99.9%</span>
                                <span style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 600,
                                }}>Uptime</span>
                            </div>
                            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                <span style={{
                                    fontSize: '1.6rem',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-mono)',
                                    background: 'var(--gradient-primary)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>&lt; 2s</span>
                                <span style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 600,
                                }}>Check-in</span>
                            </div>
                            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                <span style={{
                                    fontSize: '1.6rem',
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-mono)',
                                    background: 'var(--gradient-primary)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>256-bit</span>
                                <span style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    fontWeight: 600,
                                }}>Encryption</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="features-section">
                <div className="container">
                    <h2>Why <span className="gradient-text">AttendX</span>?</h2>
                    <p className="section-subtitle">
                        Everything you need to modernize attendance tracking in one beautiful platform.
                    </p>
                    <div className="grid-3">
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(124, 106, 255, 0.12)' }}>
                                📱
                            </div>
                            <h3>QR Code Check-in</h3>
                            <p>Generate unique QR codes for each session. Students scan with their phone camera — no app needed.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(0, 229, 184, 0.12)' }}>
                                ⚡
                            </div>
                            <h3>Real-time Updates</h3>
                            <p>Watch attendance appear instantly as students check in. Live feed powered by real-time polling.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(255, 167, 66, 0.12)' }}>
                                📊
                            </div>
                            <h3>Analytics Dashboard</h3>
                            <p>Track trends, view attendance rates, and export data. Beautiful charts for data-driven insights.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(255, 92, 106, 0.12)' }}>
                                🔒
                            </div>
                            <h3>Secure & Private</h3>
                            <p>JWT authentication, session expiry controls, and duplicate prevention keep your data safe.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(124, 106, 255, 0.12)' }}>
                                📲
                            </div>
                            <h3>Mobile Optimized</h3>
                            <p>Beautiful on every screen. Students can check in from any device — phones, tablets, or desktops.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon" style={{ background: 'rgba(0, 229, 184, 0.12)' }}>
                                ⏱️
                            </div>
                            <h3>Session Controls</h3>
                            <p>Set expiry times, close sessions, and manage who can check in. Full control at your fingertips.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container">
                    <p>AttendX — Smart Attendance Tracking System</p>
                </div>
            </footer>
        </main>
    );
}
