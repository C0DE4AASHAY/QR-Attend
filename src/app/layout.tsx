import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

export const metadata: Metadata = {
    title: 'AttendX — Smart Attendance Tracking',
    description: 'Cloud-based real-time attendance tracking with QR codes, mobile check-in, and analytics dashboard. Trusted by educators worldwide.',
    keywords: ['attendance', 'QR code', 'tracking', 'education', 'analytics'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>" />
            </head>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
