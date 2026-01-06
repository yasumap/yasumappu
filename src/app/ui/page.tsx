'use client';

import { useState } from 'react';
import AmountSlider from '@/components/ui/AmountSlider';

export default function UITestPage() {
  const [amount, setAmount] = useState(500);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          UIコンポーネントテスト
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            金額スライダー
          </h2>
          
          <AmountSlider 
            value={amount} 
            onChange={setAmount}
            min={0}
            max={10000}
          />

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              現在の値: <span className="font-bold text-gray-900">¥{amount.toLocaleString()}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            テストパターン
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setAmount(0)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              ¥0にセット
            </button>
            <button
              onClick={() => setAmount(50)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              ¥50にセット（10円刻みゾーン）
            </button>
            <button
              onClick={() => setAmount(100)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              ¥100にセット（境界値）
            </button>
            <button
              onClick={() => setAmount(500)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              ¥500にセット（100円刻みゾーン）
            </button>
            <button
              onClick={() => setAmount(5000)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              ¥5,000にセット
            </button>
            <button
              onClick={() => setAmount(10000)}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              ¥10,000にセット（最大値）
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← トップページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
