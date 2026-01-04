'use client';

import { useRestSpots } from '@/hooks/useRestSpots';
import { useMapStore } from '@/hooks/useMapStore';
import { useState } from 'react';

export default function SpotDetailPopup() {
  const { selectedSpot, setSelectedSpot } = useMapStore();
  const { deleteSpot, isDeleting } = useRestSpots();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedSpot) return null;

  const handleDelete = async () => {
    try {
      await deleteSpot(selectedSpot.id);
      setSelectedSpot(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const occupancyRate = (
    ((selectedSpot.totalSeats - selectedSpot.availableSeats) /
      selectedSpot.totalSeats) *
    100
  ).toFixed(0);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 animate-slide-up">
      <div className="rounded-2xl shadow-xl p-4 bg-white/98 backdrop-blur-md border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 truncate">{selectedSpot.name}</h3>
          </div>
          <button
            onClick={() => setSelectedSpot(null)}
            className="text-gray-400 active:text-gray-600 text-2xl transition-all duration-200 ml-2 w-8 h-8 flex items-center justify-center flex-shrink-0"
          >
            ×
          </button>
        </div>

        {selectedSpot.description && (
          <p className="mb-3 px-3 py-2 rounded-lg bg-gray-50 text-gray-700 text-sm">
            {selectedSpot.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
            <span className="font-medium text-sm text-gray-700">空き座席</span>
            <span className="font-bold text-base text-gray-900">
              {selectedSpot.availableSeats} / {selectedSpot.totalSeats}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5 font-medium text-gray-700">
              <span>混雑度</span>
              <span className="text-gray-900">{occupancyRate}%</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden bg-gray-200">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${occupancyRate}%`,
                  backgroundColor: Number(occupancyRate) < 50
                    ? '#10b981'
                    : Number(occupancyRate) < 80
                    ? '#f59e0b'
                    : '#ef4444'
                }}
              />
            </div>
          </div>
        </div>

        <div className="text-xs mb-3 px-3 py-2 rounded-lg bg-gray-50 text-gray-600">
          登録日: {new Date(selectedSpot.createdAt).toLocaleDateString('ja-JP')}
        </div>

        {!showDeleteConfirm && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 active:bg-gray-100 border-2 border-gray-300 text-gray-700"
          >
            削除
          </button>
        )}

        {showDeleteConfirm && (
          <div className="space-y-2 animate-scale-in">
            <p className="text-sm font-medium text-center p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
              本当にこのスポットを削除しますか？
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl font-medium text-sm text-white transition-all duration-200 active:opacity-80 disabled:opacity-50 bg-red-600"
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 border-2 border-gray-300 text-gray-700 active:bg-gray-100"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
