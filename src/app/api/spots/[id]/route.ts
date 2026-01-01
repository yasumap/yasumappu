import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
