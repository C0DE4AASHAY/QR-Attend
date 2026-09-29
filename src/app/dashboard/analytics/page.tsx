'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

interface AnalyticsData {
    overview: {
        totalSessions: number;
        totalAttendees: number;
        activeSessions: number;
        avgAttendance: number;
    };
    sessions: {
        id: string;
        title: string;
        attendeeCount: number;
        status: string;
        createdAt: string;
    }[];
    dailyTrend: { date: string; count: number }[];
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/analytics');
                if (!res.ok) { router.push('/login'); return; }
                const analytics = await res.json();
                setData(analytics);
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (!data) return null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#9d9db8', font: { family: 'Outfit' } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: '#9d9db8', font: { family: 'Outfit' } },
                beginAtZero: true,
            },
        },
    };

    const lineData = {
        labels: data.dailyTrend.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
            label: 'Check-ins',
            data: data.dailyTrend.map(d => d.count),
            borderColor: '#7c6aff',
            backgroundColor: 'rgba(124, 106, 255, 0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#7c6aff',
            pointBorderColor: '#0d0d1a',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
        }],
    };

    const barData = {
        labels: data.sessions.slice(0, 10).map(s => s.title.length > 20 ? s.title.slice(0, 20) + '...' : s.title),
        datasets: [{
            label: 'Attendees',
            data: data.sessions.slice(0, 10).map(s => s.attendeeCount),
            backgroundColor: data.sessions.slice(0, 10).map((_, i) =>
                `hsla(${250 + i * 12}, 75%, 68%, 0.75)`
            ),
            borderRadius: 10,
            borderSkipped: false,
        }],
    };

    const activeCount = data.sessions.filter(s => s.status === 'active').length;
    const closedCount = data.sessions.filter(s => s.status === 'closed').length;
    const doughnutData = {
        labels: ['Active', 'Closed'],
        datasets: [{
            data: [activeCount, closedCount],
            backgroundColor: ['rgba(0, 229, 184, 0.8)', 'rgba(255, 92, 106, 0.8)'],
            borderWidth: 0,
            hoverOffset: 8,
        }],
    };

    return (
        <div className="page-container">
                <div className="container">
                    <div className="dashboard-header">
                        <div>
                            <h1>📊 Analytics</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: '0.95rem' }}>Track attendance trends and insights</p>
                        </div>
                    </div>

                    {/* Overview stats */}
                    <div className="grid-4 mb-32">
                        <div className="stats-card">
                            <div className="stats-value">{data.overview.totalSessions}</div>
                            <div className="stats-label">Total Sessions</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-value">{data.overview.totalAttendees}</div>
                            <div className="stats-label">Total Check-ins</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-value">{data.overview.activeSessions}</div>
                            <div className="stats-label">Active Sessions</div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-value">{data.overview.avgAttendance}</div>
                            <div className="stats-label">Avg Attendance</div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid-2 mb-32">
                        <div className="chart-container">
                            <h3>📈 Daily Attendance Trend</h3>
                            <div style={{ height: 300 }}>
                                {data.dailyTrend.length > 0 ? (
                                    <Line data={lineData} options={chartOptions} />
                                ) : (
                                    <div className="empty-state" style={{ padding: 32 }}>
                                        <p>No attendance data yet. Create sessions and start tracking!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="chart-container">
                            <h3>📊 Session Status</h3>
                            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {data.sessions.length > 0 ? (
                                    <Doughnut
                                        data={doughnutData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: { color: '#9d9db8', font: { family: 'Outfit' }, padding: 24 },
                                                },
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="empty-state" style={{ padding: 32 }}>
                                        <p>No sessions created yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="chart-container mb-32">
                        <h3>👥 Attendees per Session</h3>
                        <div style={{ height: 350 }}>
                            {data.sessions.length > 0 ? (
                                <Bar data={barData} options={chartOptions} />
                            ) : (
                                <div className="empty-state" style={{ padding: 32 }}>
                                    <p>No session data available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
}
