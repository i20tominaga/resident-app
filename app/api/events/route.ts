import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const buildingId = searchParams.get('buildingId');

        const filePath = path.join(process.cwd(), 'public', 'data', 'events.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        let events = data.events;

        if (buildingId) {
            events = events.filter((event: any) => event.buildingId === buildingId);
        }

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error in API /api/events:', error);
        return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
    }
}
