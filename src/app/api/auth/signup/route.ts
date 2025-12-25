import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, company_name, country } = body;

        // Basic Validation
        if (!name || !email || !password || !company_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check availability
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Create User
        const password_hash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                company_name,
                country: country || 'Unknown',
                role: 'BUYER' // Default role
            }
        });

        // Generate Token
        const token = signToken({
            userId: user.id,
            role: user.role,
            email: user.email
        });

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
