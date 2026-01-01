'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore } from '@/hooks/useMapStore';
import { categoryColors, categoryIcons } from '@/lib/categoryIcons';
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
  style = 'mapbox://styles/mapbox/streets-v12',
  height = '100vh',
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { spots, setSelectedSpot, fetchSpots, setBounds } = useMapStore();

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
        setClickedCoordinates({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        });
        setShowRegistrationModal(true);
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
      el.style.setProperty('--marker-color', categoryColors[spot.category]);
      el.innerHTML = `<span class="spot-marker-icon">${
        categoryIcons[spot.category]
      }</span>`;
      el.style.cursor = 'pointer';

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

      <AddSpotButton onGetCurrentLocation={handleGetCurrentLocation} />
    </>
  );
}
