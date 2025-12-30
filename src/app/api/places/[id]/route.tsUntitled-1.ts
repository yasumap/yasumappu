import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params; // Next.jsのバージョンによっては await paramsが必要な場合があります
        await prisma.place.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}