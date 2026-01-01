'use client';

import { useState } from 'react';
import SpotRegistrationModal from '../spots/SpotRegistrationModal';

interface AddSpotButtonProps {
  onGetCurrentLocation: () => Promise<{ lat: number; lng: number }>;
}

export default function AddSpotButton({
  onGetCurrentLocation,
}: AddSpotButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleAddAtCurrentLocation = async () => {
    setIsGettingLocation(true);

    try {
      const coords = await onGetCurrentLocation();
      setCoordinates(coords);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to get location:', err);
      alert('現在地の取得に失敗しました');
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddAtCurrentLocation}
        disabled={isGettingLocation}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full shadow-lg flex items-center justify-center font-bold text-white animate-scale-in disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
        }}
        aria-label={isGettingLocation ? '取得中...' : '現在地に追加'}
      >
        <span className="text-2xl">{isGettingLocation ? '...' : '+'}</span>
      </button>

      {coordinates && (
        <SpotRegistrationModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setCoordinates(null);
          }}
          latitude={coordinates.lat}
          longitude={coordinates.lng}
        />
      )}
    </>
  );
}
