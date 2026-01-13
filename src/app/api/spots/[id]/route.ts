import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSpotSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  totalSeats: z.number().int().min(1).max(1000).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateSpotSchema.parse(body);

    const spot = await prisma.restSpot.findUnique({
      where: { id },
    });

    if (!spot) {
      return NextResponse.json(
        { error: '休憩スポットが見つかりません' },
        { status: 404 }
      );
    }

    const updatedSpot = await prisma.restSpot.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.totalSeats && {
          totalSeats: validated.totalSeats,
          availableSeats: validated.totalSeats,
        }),
      },
    });

    return NextResponse.json(updatedSpot, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '入力内容に誤りがあります', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating spot:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const spot = await prisma.restSpot.findUnique({
      where: { id },
    });

    if (!spot) {
      return NextResponse.json(
        { error: '休憩スポットが見つかりません' },
        { status: 404 }
      );
    }

    await prisma.restSpot.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: '休憩スポットを削除しました' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting spot:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
