import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSpotSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  totalSeats: z.number().int().min(1).max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSpotSchema.parse(body);

    const spot = await prisma.restSpot.create({
      data: {
        name: validated.name,
        description: validated.description,
        latitude: validated.latitude,
        longitude: validated.longitude,
        totalSeats: validated.totalSeats,
        availableSeats: validated.totalSeats,
      },
    });

    return NextResponse.json(spot, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '入力内容に誤りがあります', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating spot:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const north = searchParams.get('north');
    const south = searchParams.get('south');
    const east = searchParams.get('east');
    const west = searchParams.get('west');

    let whereClause = {};

    if (north && south && east && west) {
      whereClause = {
        latitude: {
          gte: parseFloat(south),
          lte: parseFloat(north),
        },
        longitude: {
          gte: parseFloat(west),
          lte: parseFloat(east),
        },
      };
    }

    const spots = await prisma.restSpot.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
