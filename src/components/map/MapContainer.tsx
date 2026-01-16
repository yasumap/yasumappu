'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { createLanguageControl, MAPBOX_STYLE_STREETS } from '@/lib/mapLanguage';
import { useMapStore } from '@/hooks/useMapStore';
import type { RestSpot } from '@/hooks/useMapStore';
import SpotRegistrationModal from '../spots/SpotRegistrationModal';
import AddSpotButton from './AddSpotButton';

interface MapContainerProps {
  initialLongitude?: number;
  initialLatitude?: number;
  initialZoom?: number;
  style?: string;
  height?: string;
}

export default function MapContainer({
  initialLongitude = 139.7671,
  initialLatitude = 35.6812,
  initialZoom = 13,
  style = MAPBOX_STYLE_STREETS,
  height = '100vh',
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { spots, setSelectedSpot, fetchSpots, setBounds } = useMapStore();
  const nearestCandidatesRef = useRef<RestSpot[]>([]);
  const nearestIndexRef = useRef<number>(0);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token) {
      console.error(
        'Mapbox access token is not set. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file.'
      );
      return;
    }

    mapboxgl.accessToken = token;

    if (map.current) return;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: style,
        center: [initialLongitude, initialLatitude],
        zoom: initialZoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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

      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: 'metric',
        }),
        'bottom-left'
      );

      // マップのラベルを日本語化
      map.current.addControl(createLanguageControl('ja'));

      map.current.on('load', () => {
        setMapLoaded(true);
        console.log('Map loaded successfully');

        if (map.current) {
          const bounds = map.current.getBounds();
          if (bounds) {
            setBounds({
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest(),
            });
            fetchSpots({
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest(),
            });
          }
        }
      });

      map.current.on('click', (e) => {
        // マーカーがクリックされた場合は登録モーダルを開かない
        const clickedOnMarker = (e.originalEvent.target as HTMLElement)?.closest('.spot-marker');

        if (!clickedOnMarker) {
          setClickedCoordinates({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          });
          setShowRegistrationModal(true);
        }
      });

      map.current.on('moveend', () => {
        if (map.current) {
          const bounds = map.current.getBounds();
          if (bounds) {
            setBounds({
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest(),
            });
            fetchSpots({
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest(),
            });
          }
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLongitude, initialLatitude, initialZoom, style, setBounds, fetchSpots]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    spots.forEach((spot) => {
      const el = document.createElement('div');
      el.className = 'spot-marker';
      // 鮮やかな黄色を使用
      el.style.setProperty('--marker-color', '#FFD700');

      // 画像がある場合は画像を表示、ない場合はデフォルトアイコンを表示
      if (spot.imageUrl) {
        const img = document.createElement('img');
        img.src = spot.imageUrl;
        img.alt = 'spot';
        img.className = 'spot-marker-image';
        el.appendChild(img);
      } else {
        const icon = document.createElement('div');
        icon.className = 'spot-marker-icon';
        icon.style.cssText = 'width: 20px; height: 20px; background: white; border-radius: 50%;';
        el.appendChild(icon);
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([spot.longitude, spot.latitude])
        .addTo(map.current!);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedSpot(spot);
      });

      markersRef.current.push(marker);
    });
  }, [spots, mapLoaded, setSelectedSpot]);

  // NOTE: Do not auto-reset nearestCandidatesRef on `spots` change here.
  // We intentionally preserve the candidates/index across button presses
  // so repeated presses cycle through the sorted list.

  // ハーバーサイン公式距離計算
  const haversineDistance = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371e3; // metres
    const φ1 = toRad(a.lat);
    const φ2 = toRad(b.lat);
    const Δφ = toRad(b.lat - a.lat);
    const Δλ = toRad(b.lng - a.lng);

    const sinΔφ = Math.sin(Δφ / 2);
    const sinΔλ = Math.sin(Δλ / 2);
    const aa = sinΔφ * sinΔφ + Math.cos(φ1) * Math.cos(φ2) * sinΔλ * sinΔλ;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));

    return R * c;
  };

  const handleGetCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('位置情報がサポートされていません'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (map.current) {
            map.current.flyTo({
              center: [coords.lng, coords.lat],
              zoom: 15,
            });
          }

          resolve(coords);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // マップロード時に最寄りのベンチを自動表示
  useEffect(() => {
    if (!mapLoaded) return;

    const autoShowNearestBench = async () => {
      try {
        const userCoords = await handleGetCurrentLocation();

        // 最新のスポットをサーバーから取得（画面外も含む）
        await fetchSpots();
        const allSpots = useMapStore.getState().spots;

        if (!allSpots || allSpots.length === 0) {
          return;
        }

        // 距離でソートして保持（画面外のスポットも含む）
        if (!nearestCandidatesRef.current || nearestCandidatesRef.current.length === 0) {
          const list = allSpots
            .map((s) => ({ spot: s, dist: haversineDistance(userCoords, { lat: s.latitude, lng: s.longitude }) }))
            .sort((a, b) => a.dist - b.dist)
            .map((p) => p.spot)
            .slice(0, 5); // 上位5件までに制限

          nearestCandidatesRef.current = list;
          nearestIndexRef.current = 0;
        }

        const candidates = nearestCandidatesRef.current;
        const target = candidates[0]; // 最初のアイテムを表示

        // ユーザーマーカーを立てる
        if (map.current) {
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
            userMarkerRef.current = null;
          }

          const el = document.createElement('div');
          el.className = 'text-2xl';
          el.innerText = '📍';

          userMarkerRef.current = new mapboxgl.Marker({ element: el })
            .setLngLat([userCoords.lng, userCoords.lat])
            .addTo(map.current);

          // 両方が見えるように境界を作る
          const bounds = new mapboxgl.LngLatBounds([userCoords.lng, userCoords.lat], [userCoords.lng, userCoords.lat]);
          bounds.extend([target.longitude, target.latitude]);

          map.current.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 800 });
        }

        // モーダル表示（詳細）
        setSelectedSpot(target);

        // ボタン押下時は次のインデックスから開始するようにカウンターを進める
        nearestIndexRef.current = 1;
      } catch (err) {
        console.error('Auto-show nearest bench error:', err);
        // エラーでも処理を続ける
      }
    };

    autoShowNearestBench();
  }, [mapLoaded, fetchSpots, setSelectedSpot]);

  const handleShowNearestBench = async () => {
    try {
      const userCoords = await handleGetCurrentLocation();

      // 最新のスポットをサーバーから取得（画面外も含む）
      await fetchSpots();
      const allSpots = useMapStore.getState().spots;

      if (!allSpots || allSpots.length === 0) {
        alert('登録されているベンチがありません');
        return;
      }

      // 候補が空なら距離でソートして保持（画面外のスポットも含む）
      if (!nearestCandidatesRef.current || nearestCandidatesRef.current.length === 0) {
        const list = allSpots
          .map((s) => ({ spot: s, dist: haversineDistance(userCoords, { lat: s.latitude, lng: s.longitude }) }))
          .sort((a, b) => a.dist - b.dist)
          .map((p) => p.spot)
          .slice(0, 5); // 上位5件までに制限

        nearestCandidatesRef.current = list;
        nearestIndexRef.current = 0;
      }

      const candidates = nearestCandidatesRef.current;
      const idx = candidates.length > 0 ? nearestIndexRef.current % candidates.length : 0;
      const target = candidates[idx];

      // 次回は次の候補を指す
      nearestIndexRef.current = idx + 1;

      // ユーザーマーカーを立てる
      if (map.current) {
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
          userMarkerRef.current = null;
        }

        const el = document.createElement('div');
        el.className = 'text-2xl';
        el.innerText = '📍';

        userMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat([userCoords.lng, userCoords.lat])
          .addTo(map.current);

        // 両方が見えるように境界を作る
        const bounds = new mapboxgl.LngLatBounds([userCoords.lng, userCoords.lat], [userCoords.lng, userCoords.lat]);
        bounds.extend([target.longitude, target.latitude]);

        map.current.fitBounds(bounds, { padding: 80, maxZoom: 16, duration: 800 });
      }

      // モーダル表示（詳細）
      setSelectedSpot(target);
    } catch (err) {
      console.error('Nearest bench error:', err);
      alert('最寄りのベンチを取得できませんでした');
    }
  };

  return (
    <>
      <div className="relative w-full" style={{ height }}>
        <div
          ref={mapContainer}
          className="absolute top-0 left-0 w-full h-full"
        />
        {!mapLoaded && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">マップを読み込んでいます...</p>
            </div>
          </div>
        )}
      </div>

      {clickedCoordinates && (
        <SpotRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => {
            setShowRegistrationModal(false);
            setClickedCoordinates(null);
          }}
          latitude={clickedCoordinates.lat}
          longitude={clickedCoordinates.lng}
        />
      )}

      <div>
        <AddSpotButton onGetCurrentLocation={handleGetCurrentLocation} />

        <button
          onClick={handleShowNearestBench}
          className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center font-bold text-white animate-scale-in disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #0ea5a4 0%, #0284c7 100%)' }}
          aria-label="最寄りのベンチを表示"
          title="最寄りのベンチ"
        >
          <span className="text-2xl">📍</span>
        </button>
      </div>
    </>
  );
}
