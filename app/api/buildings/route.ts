import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'buildings.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in API /api/buildings:', error);
        return NextResponse.json({ error: 'Failed to load buildings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'buildings.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);

        const newBuilding = await request.json();

        // Auto-generate ID and set buildingId for features
        const id = `bldg-${String(data.buildings.length + 1).padStart(3, '0')}`;
        const building = {
            ...newBuilding,
            id,
            features: newBuilding.features.map((f: any) => ({ ...f, buildingId: id }))
        };

        data.buildings.push(building);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, building });
    } catch (error) {
        console.error('Error in POST /api/buildings:', error);
        return NextResponse.json({ error: 'Failed to save building' }, { status: 500 });
    }
}
