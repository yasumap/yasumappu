import { useMapStore } from './useMapStore';
import { useState } from 'react';

interface CreateSpotData {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  totalSeats: number;
}

export function useRestSpots() {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addSpot, removeSpot, fetchSpots } = useMapStore();

  const createSpot = async (data: CreateSpotData) => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'スポットの作成に失敗しました');
      }

      const newSpot = await response.json();
      addSpot(newSpot);

      return newSpot;
    } catch (err) {
      const message = err instanceof Error ? err.message : '不明なエラー';
      setError(message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteSpot = async (id: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/spots/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'スポットの削除に失敗しました');
      }

      removeSpot(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : '不明なエラー';
      setError(message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createSpot,
    deleteSpot,
    fetchSpots,
    isCreating,
    isDeleting,
    error,
  };
}
