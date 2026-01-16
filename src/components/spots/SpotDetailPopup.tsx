'use client';

import { useRestSpots } from '@/hooks/useRestSpots';
import { useMapStore } from '@/hooks/useMapStore';
import { useState, useRef, useEffect } from 'react';

export default function SpotDetailPopup() {
  const { selectedSpot, setSelectedSpot } = useMapStore();
  const { deleteSpot, isDeleting } = useRestSpots();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalSeats: 10,
  });
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 8, left: 8 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (selectedSpot) {
      setFormData({
        name: selectedSpot.name,
        description: selectedSpot.description || '',
        totalSeats: selectedSpot.totalSeats,
      });
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [selectedSpot]);

  // 初期表示時は左上（ヘッダー下）に小さく寄せる
  useEffect(() => {
    if (!selectedSpot) return;
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    const left = 8;
    const top = Math.max(8, headerHeight + 8);
    // 少し遅延して描画後に位置を確定
    requestAnimationFrame(() => setPos({ top, left }));
  }, [selectedSpot]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', () => { });
      window.removeEventListener('pointerup', () => { });
    };
  }, []);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/spots/${selectedSpot.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('更新に失敗しました');
      }

      const updatedSpot = await response.json();

      // ストアを更新
      const spots = useMapStore.getState().spots;
      const updatedSpots = spots.map((s) =>
        s.id === updatedSpot.id ? updatedSpot : s
      );
      useMapStore.getState().setSpots(updatedSpots);
      useMapStore.getState().setSelectedSpot(updatedSpot);

      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
      alert('更新に失敗しました');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPointerMove = (ev: PointerEvent) => {
    if (!draggingRef.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    const nx = ev.clientX - offsetRef.current.x;
    const ny = ev.clientY - offsetRef.current.y;

    const maxLeft = rect ? window.innerWidth - rect.width - 8 : window.innerWidth - 200;
    const maxTop = rect ? window.innerHeight - rect.height - 8 : window.innerHeight - 200;

    setPos({
      left: Math.max(8, Math.min(nx, maxLeft)),
      top: Math.max(8, Math.min(ny, maxTop)),
    });
  };

  const onPointerUp = () => {
    draggingRef.current = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (isEditing) return; // 編集中はドラッグ無効
    draggingRef.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    offsetRef.current.x = startX - pos.left;
    offsetRef.current.y = startY - pos.top;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      ref={containerRef}
      className="z-40 animate-slide-up"
      style={{ position: 'fixed', top: pos.top, left: pos.left }}
    >
      <div className="rounded-md shadow-sm p-1 bg-white/98 backdrop-blur-md border border-gray-200 max-w-[240px] w-[min(86vw,240px)] text-xs">
        <div className="flex justify-between items-start mb-3">
          <div
            className="min-w-0 flex-1"
            onPointerDown={onPointerDown}
            style={{ touchAction: 'none', cursor: isEditing ? 'default' : 'grab' }}
          >
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-sm font-semibold text-gray-900 px-1 py-1 rounded border-2 border-gray-300 focus:outline-none focus:border-gray-900"
                maxLength={100}
                required
              />
            ) : (
              <h3 className="text-sm font-semibold text-gray-900 truncate">{selectedSpot.name}</h3>
            )}
          </div>
          <button
            onClick={() => setSelectedSpot(null)}
            className="text-gray-400 active:text-gray-600 text-xl transition-all duration-200 ml-2 w-6 h-6 flex items-center justify-center flex-shrink-0"
          >
            ×
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-3 mb-3">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-gray-700">
                説明（任意）
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-400"
                placeholder="このスポットについて詳細があれば教えてね！"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-gray-700">
                総座席数
              </label>
              <input
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 0 })}
                required
                min={1}
                max={1000}
                className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }}
              >
                {isUpdating ? '更新中...' : '保存'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: selectedSpot.name,
                    description: selectedSpot.description || '',
                    totalSeats: selectedSpot.totalSeats,
                  });
                }}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-200 border-2 border-gray-300 text-gray-700 active:bg-gray-100"
              >
                キャンセル
              </button>
            </div>
          </form>
        ) : (
          <>
            {selectedSpot.description && (
              <p className="mb-2 px-2 py-1 rounded bg-gray-50 text-gray-700 text-xs">
                {selectedSpot.description}
              </p>
            )}
              <div className="text-xs mb-2 px-2 py-1 rounded bg-gray-50 text-gray-600">
                登録日: {new Date(selectedSpot.createdAt).toLocaleDateString('ja-JP')}
              </div>

              {!showDeleteConfirm && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2 rounded-lg font-medium text-xs transition-all duration-200 active:bg-gray-100 border-2 border-gray-900 text-gray-900"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 py-2 rounded-lg font-medium text-xs transition-all duration-200 active:bg-gray-100 border-2 border-gray-300 text-gray-700"
                  >
                    削除
                  </button>
                </div>
              )}
          </>
        )}

        {showDeleteConfirm && !isEditing && (
            <div className="space-y-2 animate-scale-in">
            <p className="text-xs font-medium text-center p-2 rounded bg-red-50 text-red-700 border border-red-200">
              本当にこのスポットを削除しますか？
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-lg font-medium text-xs text-white transition-all duration-200 active:opacity-80 disabled:opacity-50 bg-red-600"
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg font-medium text-xs transition-all duration-200 border-2 border-gray-300 text-gray-700 active:bg-gray-100"
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
