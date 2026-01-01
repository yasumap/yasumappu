'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  /** 初期表示位置の経度 */
  initialLongitude?: number;
  /** 初期表示位置の緯度 */
  initialLatitude?: number;
  /** 初期ズームレベル (0-22) */
  initialZoom?: number;
  /** マップのスタイル URL */
  style?: string;
  /** マップの高さ (CSS値) */
  height?: string;
}

export default function MapContainer({
  initialLongitude = 139.7671,
  initialLatitude = 35.6812,
  initialZoom = 13,
  style = 'mapbox://styles/mapbox/streets-v12',
  height = '100vh',
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Mapbox アクセストークンの設定
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token) {
      console.error('Mapbox access token is not set. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file.');
      return;
    }

    mapboxgl.accessToken = token;

    // マップがすでに初期化されている場合は何もしない
    if (map.current) return;

    // マップの初期化
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: [initialLongitude, initialLatitude],
        zoom: initialZoom,
      });

      // ナビゲーションコントロール（ズーム・回転ボタン）を追加
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // 現在地コントロールを追加
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        'top-right'
      );

      // スケールコントロールを追加
      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: 'metric',
        }),
        'bottom-left'
      );

      // マップのロード完了イベント
      map.current.on('load', () => {
        setMapLoaded(true);
        console.log('Map loaded successfully');
      });
    }

    // クリーンアップ
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLongitude, initialLatitude, initialZoom, style]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />
      {!mapLoaded && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">マップを読み込んでいます...</p>
          </div>
        </div>
      )}
    </div>
  );
}
