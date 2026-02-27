import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_PATH = path.join(process.cwd(), 'public', 'data', 'invites.json');
const BUILDINGS_PATH = path.join(process.cwd(), 'public', 'data', 'buildings.json');

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
        const data = JSON.parse(fileContents);
        const invite = data.invites.find((i: any) => i.code === code && i.status === 'active');

        if (!invite) {
            return NextResponse.json({ error: 'Invalid or expired code' }, { status: 404 });
        }

        // Get building info
        const buildingsContents = fs.readFileSync(BUILDINGS_PATH, 'utf8');
        const buildingsData = JSON.parse(buildingsContents);
        const building = buildingsData.buildings.find((b: any) => b.id === invite.buildingId);

        return NextResponse.json({ invite, building });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to validate invite' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { buildingId } = await request.json();

        if (!buildingId) {
            return NextResponse.json({ error: 'Building ID is required' }, { status: 400 });
        }

        const fileContents = fs.readFileSync(DATA_PATH, 'utf8');
        const data = JSON.parse(fileContents);

        const code = uuidv4().slice(0, 8).toUpperCase();
        const newInvite = {
            id: `inv-${Date.now()}`,
            code,
            buildingId,
            status: 'active',
            createdAt: new Date().toISOString(),
        };

        data.invites.push(newInvite);
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

        return NextResponse.json(newInvite);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate invite' }, { status: 500 });
    }
}
