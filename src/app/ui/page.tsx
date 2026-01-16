'use client';

import { useState } from 'react';
import Link from 'next/link';
import AmountSlider from '@/components/ui/AmountSlider';

export default function SurveyPage() {
  const [amount, setAmount] = useState(500);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'アンケートの送信に失敗しました');
      }

      setMessage({ type: 'success', text: 'アンケートを送信しました！ご協力ありがとうございます。' });
      setEmail('');
      setAmount(500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'エラーが発生しました',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            ご利用ありがとうございます！！！！
          </h1>
          <p className="text-gray-600">
            やすまっぷに感じる価値をお聞かせください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100">
          {/* メールアドレス入力 */}
          <div className="mb-8">
            <label className="block text-sm font-bold mb-3 text-gray-700">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@example.com"
              className="w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-900 transition-all duration-200"
            />
          </div>

          {/* 金額スライダー */}
          <div className="mb-8">
            <AmountSlider 
              value={amount} 
              onChange={setAmount}
              min={0}
              max={10000}
            />
          </div>

          {/* メッセージ表示 */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl font-medium animate-scale-in ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl text-white font-bold text-base transition-all duration-200 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
            }}
          >
            {isSubmitting ? '送信中...' : 'アンケートを送信'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
