import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        // Replace with actual database query
        const user = await prisma.user.findUnique({ where: { email } });
        // const user = {  // Remove this mock after connecting DB
        //   email: "test@example.com",
        //   password: await bcrypt.hash("password123", 10)
        // };

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}