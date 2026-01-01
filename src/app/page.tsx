import MapContainer from '@/components/map/MapContainer';

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <MapContainer
        initialLongitude={139.7671}
        initialLatitude={35.6812}
        initialZoom={13}
        height="100vh"
      />
    </div>
  );
}