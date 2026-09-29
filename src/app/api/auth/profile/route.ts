import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getUserById } from '@/lib/db';

// GET /api/auth/profile — get full profile info
export async function GET() {
    const authUser = await getAuthUser();
    if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserById(authUser.userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        },
    });
}

// PATCH /api/auth/profile — update profile fields
export async function PATCH(request: NextRequest) {
    const authUser = await getAuthUser();
    if (!authUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, email, phone, institution } = body;

        // Import supabase client to perform the update
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const updateData: Record<string, string> = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (institution !== undefined) updateData.institution = institution;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', authUser.userId)
            .select()
            .single();

        if (error) {
            console.error('Profile update error:', error);
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
        }

        return NextResponse.json({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                phone: data.phone || '',
                institution: data.institution || '',
                created_at: data.created_at,
            },
            message: 'Profile updated successfully',
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
