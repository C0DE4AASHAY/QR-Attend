import React from 'react';
import Navbar from '@/app/components/Navbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="dashboard-root-layout">
            <Navbar variant="dashboard" />
            {children}
        </div>
    );
}
