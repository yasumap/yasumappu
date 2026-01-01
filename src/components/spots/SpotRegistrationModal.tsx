'use client';

import { useState } from 'react';
import { useRestSpots } from '@/hooks/useRestSpots';

interface SpotRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
}

export default function SpotRegistrationModal({
  isOpen,
  onClose,
  latitude,
  longitude,
}: SpotRegistrationModalProps) {
  const { createSpot, isCreating, error } = useRestSpots();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalSeats: 10,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSpot({
        ...formData,
        latitude,
        longitude,
      });

      onClose();
      setFormData({
        name: '',
        description: '',
        totalSeats: 10,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in bg-black/50 backdrop-blur-sm">
      <div className="rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up bg-white border-t sm:border border-gray-200">
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          休憩スポット登録
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg font-medium animate-scale-in bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1.5 text-gray-700">
              スポット名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              maxLength={100}
              className="w-full px-3 py-2.5 text-base rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-400 transition-all duration-200"
              placeholder="例: 日陰にある清潔なベンチ!"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-gray-700">
              総座席数 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalSeats: parseInt(e.target.value) || 0,
                })
              }
              required
              min={1}
              max={1000}
              className="w-full px-3 py-2.5 text-base rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-gray-700">
              説明（任意）
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2.5 text-base rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-400 transition-all duration-200"
              placeholder="このスポットについて詳細があれば教えてね！"
            />
          </div>

          <div className="text-xs p-2.5 rounded-lg bg-gray-50 text-gray-600">
            位置: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              }}
            >
              {isCreating ? '登録中...' : '登録'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-2 border-gray-300 text-gray-700 active:bg-gray-100"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
