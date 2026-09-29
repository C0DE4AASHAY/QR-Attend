'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    BarChart3,
    User,
    LogOut,
    Sparkles,
    Zap,
    ArrowRight,
} from './Icons';

interface UserInfo {
    userId?: string;
    email?: string;
    name?: string;
    role?: string;
}

interface NavbarProps {
    variant?: 'dashboard' | 'landing' | 'auto';
}

export default function Navbar({ variant = 'auto' }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    // Pill indicator styles (smooth magnetic glide)
    const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
        left: 0,
        width: 0,
        opacity: 0,
    });

    const linksContainerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

    // Scroll listener for elevated glassmorphic state
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Fetch authenticated user profile info for avatar/status
    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch {
            // Ignore if not logged in
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const isLandingGuest = (variant === 'landing' || (variant === 'auto' && pathname === '/')) && !user;

    function getActiveKey(path: string): string | null {
        if (isLandingGuest) return null;
        if (path === '/dashboard/analytics') return 'analytics';
        if (path === '/dashboard/profile') return 'profile';
        if (path.startsWith('/dashboard')) return 'dashboard';
        return null;
    }

    // Update magnetic sliding pill position
    const updatePill = useCallback(() => {
        if (!linksContainerRef.current) return;

        const activeKey = hoveredKey || getActiveKey(pathname);
        if (!activeKey) {
            setPillStyle(prev => ({ ...prev, opacity: 0 }));
            return;
        }

        const targetEl = itemsRef.current.get(activeKey);
        if (targetEl && linksContainerRef.current) {
            const containerRect = linksContainerRef.current.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();

            setPillStyle({
                left: targetRect.left - containerRect.left,
                width: targetRect.width,
                opacity: 1,
            });
        } else {
            setPillStyle(prev => ({ ...prev, opacity: 0 }));
        }
    }, [hoveredKey, pathname, isLandingGuest]);

    useEffect(() => {
        updatePill();
        const handleResize = () => updatePill();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updatePill]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setLoggingOut(false);
        }
    };

    // User avatar initials
    const initials = user?.name
        ? user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : 'U';

    const activeKey = getActiveKey(pathname);

    // Pill color variant based on active or hovered item
    const currentKey = hoveredKey || activeKey;
    const isDangerPill = currentKey === 'logout';
    const isCyanPill = currentKey === 'analytics';

    return (
        <nav
            className={`navbar modern-navbar ${scrolled ? 'navbar-scrolled' : ''} ${mobileOpen ? 'navbar-mobile-open' : ''}`}
            aria-label="Main Navigation"
        >
            <div className="nav-content-wrapper">
                {/* Brand Logo with 3D hover & glow */}
                <Link
                    href={user ? '/dashboard' : '/'}
                    className="navbar-brand modern-brand"
                    id="nav-brand"
                >
                    <div className="brand-icon-wrapper">
                        <span className="brand-icon">📋</span>
                        <div className="brand-glow" />
                    </div>
                    <div className="brand-text-group">
                        <span className="brand-name">
                            Attend<span className="brand-accent">X</span>
                        </span>
                        <span className="brand-badge">
                            <span className="live-dot" />
                            Live
                        </span>
                    </div>
                </Link>

                {/* Subtle vertical divider */}
                <div className="nav-brand-divider" />

                {/* Desktop Navigation Links */}
                {isLandingGuest ? (
                    <div className="navbar-links-wrapper" ref={linksContainerRef}>
                        <div
                            className="nav-magnetic-pill"
                            style={{
                                transform: `translateX(${pillStyle.left}px)`,
                                width: `${pillStyle.width}px`,
                                opacity: pillStyle.opacity,
                            }}
                            aria-hidden="true"
                        />
                        <a
                            href="#features"
                            ref={el => { if (el) itemsRef.current.set('features', el); }}
                            onMouseEnter={() => setHoveredKey('features')}
                            onMouseLeave={() => setHoveredKey(null)}
                            className="nav-item-btn"
                        >
                            Features
                        </a>
                        <a
                            href="#how-it-works"
                            ref={el => { if (el) itemsRef.current.set('how-it-works', el); }}
                            onMouseEnter={() => setHoveredKey('how-it-works')}
                            onMouseLeave={() => setHoveredKey(null)}
                            className="nav-item-btn"
                        >
                            How It Works
                        </a>
                        <Link
                            href="/login"
                            ref={el => { if (el) itemsRef.current.set('login', el); }}
                            onMouseEnter={() => setHoveredKey('login')}
                            onMouseLeave={() => setHoveredKey(null)}
                            className="nav-item-btn"
                        >
                            Sign In
                        </Link>
                        <div className="nav-divider" />
                        <Link
                            href="/login"
                            className="btn btn-primary btn-sm"
                            style={{ borderRadius: 'var(--radius-sm)', padding: '7px 16px', fontSize: '0.85rem' }}
                        >
                            Get Started →
                        </Link>
                    </div>
                ) : (
                    <div className="navbar-links-wrapper" ref={linksContainerRef}>
                        {/* Magnetic Gliding Background Pill */}
                        <div
                            className={`nav-magnetic-pill ${isDangerPill ? 'pill-danger' : isCyanPill ? 'pill-cyan' : ''}`}
                            style={{
                                transform: `translateX(${pillStyle.left}px)`,
                                width: `${pillStyle.width}px`,
                                opacity: pillStyle.opacity,
                            }}
                            aria-hidden="true"
                        />

                        {/* Dashboard Button */}
                        <Link
                            href="/dashboard"
                            ref={el => { if (el) itemsRef.current.set('dashboard', el); }}
                            onMouseEnter={() => setHoveredKey('dashboard')}
                            onMouseLeave={() => setHoveredKey(null)}
                            className={`nav-item-btn ${activeKey === 'dashboard' ? 'is-active' : ''}`}
                            id="nav-btn-dashboard"
                        >
                            <span className="nav-item-icon dashboard-icon">
                                <LayoutDashboard size={17} />
                            </span>
                            <span className="nav-item-label">Dashboard</span>
                        </Link>

                        {/* Analytics Button */}
                        <Link
                            href="/dashboard/analytics"
                            ref={el => { if (el) itemsRef.current.set('analytics', el); }}
                            onMouseEnter={() => setHoveredKey('analytics')}
                            onMouseLeave={() => setHoveredKey(null)}
                            className={`nav-item-btn ${activeKey === 'analytics' ? 'is-active is-analytics' : ''}`}
                            id="nav-btn-analytics"
                        >
                            <span className="nav-item-icon analytics-icon">
                                <BarChart3 size={17} />
                            </span>
                            <span className="nav-item-label">Analytics</span>
                            <span className="analytics-pulse-dot" title="Live analytics" />
                        </Link>

                        {/* Profile Button with User Avatar */}
                        <Link
                            href="/dashboard/profile"
                            ref={el => { if (el) itemsRef.current.set('profile', el); }}
                            onMouseEnter={() => setHoveredKey('profile')}
                            onMouseLeave={() => setHoveredKey(null)}
                            className={`nav-item-btn ${activeKey === 'profile' ? 'is-active' : ''}`}
                            id="nav-btn-profile"
                        >
                            {user ? (
                                <span className="nav-avatar-mini" title={user.name || user.email}>
                                    {initials}
                                </span>
                            ) : (
                                <span className="nav-item-icon profile-icon">
                                    <User size={17} />
                                </span>
                            )}
                            <span className="nav-item-label">Profile</span>
                        </Link>

                        {/* Divider */}
                        <div className="nav-divider" />

                        {/* Logout Button */}
                        <button
                            ref={el => { if (el) itemsRef.current.set('logout', el); }}
                            onMouseEnter={() => setHoveredKey('logout')}
                            onMouseLeave={() => setHoveredKey(null)}
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="nav-item-btn nav-logout-btn"
                            id="nav-btn-logout"
                            title="Sign out of your account"
                        >
                            {loggingOut ? (
                                <span className="nav-spinner" />
                            ) : (
                                <span className="nav-item-icon logout-icon">
                                    <LogOut size={17} />
                                </span>
                            )}
                            <span className="nav-item-label">
                                {loggingOut ? 'Signing out...' : 'Logout'}
                            </span>
                        </button>
                    </div>
                )}

                {/* Mobile Hamburger Toggle Button */}
                <button
                    className={`nav-mobile-toggle ${mobileOpen ? 'is-active' : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open navigation menu'}
                    id="nav-mobile-toggle-btn"
                >
                    <span className="hamburger-line top" />
                    <span className="hamburger-line middle" />
                    <span className="hamburger-line bottom" />
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`nav-mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
                {isLandingGuest ? (
                    <div className="mobile-nav-links">
                        <a
                            href="#features"
                            onClick={() => setMobileOpen(false)}
                            className="mobile-nav-item"
                        >
                            <span className="mobile-title">Features</span>
                        </a>
                        <a
                            href="#how-it-works"
                            onClick={() => setMobileOpen(false)}
                            className="mobile-nav-item"
                        >
                            <span className="mobile-title">How It Works</span>
                        </a>
                        <div className="mobile-divider" />
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="mobile-nav-item"
                        >
                            <span className="mobile-title">Sign In</span>
                        </Link>
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="btn btn-primary"
                            style={{ textAlign: 'center', marginTop: 8 }}
                        >
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* User quick info header in mobile menu */}
                        {user && (
                            <div className="mobile-user-card">
                                <div className="mobile-avatar">
                                    {initials}
                                </div>
                                <div className="mobile-user-details">
                                    <span className="mobile-user-name">{user.name || 'User'}</span>
                                    <span className="mobile-user-email">{user.email}</span>
                                </div>
                                <span className="mobile-role-badge">✦ {user.role || 'Teacher'}</span>
                            </div>
                        )}

                        <div className="mobile-nav-links">
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className={`mobile-nav-item ${activeKey === 'dashboard' ? 'is-active' : ''}`}
                                id="mobile-nav-dashboard"
                            >
                                <div className="mobile-icon-box dashboard">
                                    <LayoutDashboard size={20} />
                                </div>
                                <div className="mobile-nav-item-text">
                                    <span className="mobile-title">Dashboard</span>
                                    <span className="mobile-sub">Sessions overview & quick actions</span>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/analytics"
                                onClick={() => setMobileOpen(false)}
                                className={`mobile-nav-item ${activeKey === 'analytics' ? 'is-active' : ''}`}
                                id="mobile-nav-analytics"
                            >
                                <div className="mobile-icon-box analytics">
                                    <BarChart3 size={20} />
                                </div>
                                <div className="mobile-nav-item-text">
                                    <span className="mobile-title">
                                        Analytics
                                        <span className="mobile-badge-new">Insights</span>
                                    </span>
                                    <span className="mobile-sub">Attendance charts & rate trends</span>
                                </div>
                            </Link>

                            <Link
                                href="/dashboard/profile"
                                onClick={() => setMobileOpen(false)}
                                className={`mobile-nav-item ${activeKey === 'profile' ? 'is-active' : ''}`}
                                id="mobile-nav-profile"
                            >
                                <div className="mobile-icon-box profile">
                                    <User size={20} />
                                </div>
                                <div className="mobile-nav-item-text">
                                    <span className="mobile-title">Profile</span>
                                    <span className="mobile-sub">Account settings & institution</span>
                                </div>
                            </Link>

                            <div className="mobile-divider" />

                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleLogout();
                                }}
                                disabled={loggingOut}
                                className="mobile-nav-item mobile-logout-btn"
                                id="mobile-nav-logout"
                            >
                                <div className="mobile-icon-box logout">
                                    {loggingOut ? <span className="nav-spinner" /> : <LogOut size={20} />}
                                </div>
                                <div className="mobile-nav-item-text">
                                    <span className="mobile-title">
                                        {loggingOut ? 'Signing out...' : 'Logout'}
                                    </span>
                                    <span className="mobile-sub">Securely exit your session</span>
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
