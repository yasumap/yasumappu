import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, amount } = await request.json();

    // バリデーション
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'メールアドレスは必須です' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount < 0 || amount > 10000) {
      return NextResponse.json(
        { error: '金額は0〜10,000円の範囲で入力してください' },
        { status: 400 }
      );
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    // データ保存
    const survey = await prisma.survey.create({
      data: {
        email,
        amount,
      },
    });

    return NextResponse.json(
      { message: 'アンケートを送信しました', survey },
      { status: 201 }
    );
  } catch (error) {
    console.error('Survey submission error:', error);
    return NextResponse.json(
      { error: 'アンケートの送信に失敗しました' },
      { status: 500 }
    );
  }
}
