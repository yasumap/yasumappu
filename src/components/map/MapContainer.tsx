"use client";

import { useState, useCallback, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapLayerMouseEvent } from 'mapbox-gl';

// 定義済みの型と自作フック
import { MapPosition } from '@/src/types/map';
import { usePlaces } from '@/src/hooks/usePlaces';
import BenchReportModal from './BenchReportModal';

// アイコン（components/ui/Icon.tsx等に切り出すのも推奨）
const BenchIcon = () => <div className="text-2xl cursor-pointer filter drop-shadow-md">🪑</div>;

export default function MapContainer() {
    // ■ ロジックは hooks/usePlaces.ts に任せる
    const { places, fetchPlaces, addBench, removeBench } = usePlaces();

    // 画面表示用のState
    const [modalOpen, setModalOpen] = useState(false);
    const [targetType, setTargetType] = useState<'new' | 'existing' | null>(null);
    const [selectedPos, setSelectedPos] = useState<MapPosition | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // 初回マウント時にデータを取得
    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);

    // 地面クリック処理
    const handleMapClick = useCallback((event: any) => {
        const { lat, lng } = event.lngLat;
        setTargetType('new');
        setSelectedPos({ lat, lng });
        setModalOpen(true);
    }, []);

    // ピンクリック処理
    const handleMarkerClick = useCallback((e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // 伝播阻止
        setTargetType('existing');
        setSelectedId(id);
        setModalOpen(true);
    }, []);

    // モーダルの実行ボタンが押された時の処理
    const handleConfirm = async () => {
        if (targetType === 'new' && selectedPos) {
            // hookの関数を呼ぶだけ
            await addBench(selectedPos);
        } else if (targetType === 'existing' && selectedId) {
            // hookの関数を呼ぶだけ
            await removeBench(selectedId);
        }
        setModalOpen(false);
    };

    return (
        <div className="w-full h-screen relative">
            <Map
                initialViewState={{
                    longitude: 139.767,
                    latitude: 35.681,
                    zoom: 15
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                onClick={handleMapClick}
            >
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        longitude={place.position.lng}
                        latitude={place.position.lat}
                        anchor="bottom"
                        onClick={(e: any) => handleMarkerClick(e, place.id)}
                    >
                        <BenchIcon />
                    </Marker>
                ))}

                {/* 新規登録用の仮マーカー */}
                {modalOpen && targetType === 'new' && selectedPos && (
                    <Marker
                        longitude={selectedPos.lng}
                        latitude={selectedPos.lat}
                        color="red"
                    />
                )}
            </Map>

            <BenchReportModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                targetType={targetType}
                onConfirm={handleConfirm}
            />
        </div>
    );
}