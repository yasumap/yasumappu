import MapContainer from '@/components/map/MapContainer';
import SpotDetailPopup from '@/components/spots/SpotDetailPopup';
import CloudCtaButton from '@/components/cta/CloudCtaButton';

export default function Home() {
  return (
    <div className="relative w-full h-screen bg-white">
      <header className="absolute top-0 left-0 right-0 z-40 animate-slide-up bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            やすまっぷ
          </h1>
          <p className="text-gray-600 text-xs hidden sm:block font-medium">休憩スポットを見つけよう</p>
        </div>
      </header>

      <MapContainer
        initialLongitude={139.7671}
        initialLatitude={35.6812}
        initialZoom={13}
        height="100vh"
      />

      <CloudCtaButton />

      <SpotDetailPopup />
    </div>
  );
}
