import { useState, useCallback } from 'react';
import { Place, PlaceCategory } from '@/src/types/place';
import { MapPosition } from '@//src/types/map';

export function usePlaces() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. データ取得
    const fetchPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/places');
            const data = await res.json();
            setPlaces(data);
        } catch (error) {
            console.error('Failed to fetch places:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 2. ベンチ登録 (MapPositionを受け取る)
    const addBench = useCallback(async (position: MapPosition) => {
        try {
            const res = await fetch('/api/places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'ベンチ', // デフォルト名
                    category: PlaceCategory.BENCH,
                    position: position, // { lat, lng }
                    availableSeats: 1,  // デフォルト席数
                }),
            });

            if (res.ok) {
                await fetchPlaces(); // リストを再取得して更新
                return true;
            }
        } catch (error) {
            console.error('Failed to add bench:', error);
        }
        return false;
    }, [fetchPlaces]);

    // 3. ベンチ削除 (IDを受け取る)
    const removeBench = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/places/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchPlaces(); // リストを再取得
                return true;
            }
        } catch (error) {
            console.error('Failed to delete bench:', error);
        }
        return false;
    }, [fetchPlaces]);

    return { places, loading, fetchPlaces, addBench, removeBench };
}