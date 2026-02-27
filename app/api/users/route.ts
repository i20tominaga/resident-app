import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'users.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in API /api/users:', error);
        return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'users.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        const newUser = await request.json();

        // Check if user already exists
        if (data.users.find((u: any) => u.email === newUser.email)) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const user = {
            ...newUser,
            id: `user-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };

        data.users.push(user);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Error in POST /api/users:', error);
        return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
    }
}
