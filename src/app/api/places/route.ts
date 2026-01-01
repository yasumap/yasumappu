import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlaceCategory } from '@prisma/client';

export async function GET() {
    const places = await prisma.place.findMany();
    // DBの latitude/longitude をフロントの MapPosition (lat/lng) に変換して返す
    const formattedPlaces = places.map(p => ({
        ...p,
        position: { lat: p.latitude, lng: p.longitude }
    }));
    return NextResponse.json(formattedPlaces);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, category, position, availableSeats, address, totalSeats } = body;

        // Prismaへの保存（lat/lng → latitude/longitude変換）
        const place = await prisma.place.create({
            data: {
                name,
                category: category as PlaceCategory,
                latitude: position.lat,  // ここで変換
                longitude: position.lng, // ここで変換
                availableSeats,
                address: address || null,
                totalSeats: totalSeats || 0,
            },
        });

        return NextResponse.json(place);
    } catch (_error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}