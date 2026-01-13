import { create } from 'zustand';
import { MapBounds, MapPosition } from '@/types/map';

export interface RestSpot {
  id: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  totalSeats: number;
  availableSeats: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MapStore {
  center: MapPosition;
  zoom: number;
  bounds: MapBounds | null;

  spots: RestSpot[];
  selectedSpot: RestSpot | null;
  isLoading: boolean;
  error: string | null;

  setCenter: (center: MapPosition) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  setSpots: (spots: RestSpot[]) => void;
  setSelectedSpot: (spot: RestSpot | null) => void;
  fetchSpots: (bounds?: MapBounds) => Promise<void>;
  addSpot: (spot: RestSpot) => void;
  removeSpot: (id: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  center: { lat: 35.6812, lng: 139.7671 },
  zoom: 13,
  bounds: null,
  spots: [],
  selectedSpot: null,
  isLoading: false,
  error: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setSpots: (spots) => set({ spots }),
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),

  fetchSpots: async (bounds) => {
    set({ isLoading: true, error: null });

    try {
      let url = '/api/spots';

      if (bounds) {
        const params = new URLSearchParams({
          north: bounds.north.toString(),
          south: bounds.south.toString(),
          east: bounds.east.toString(),
          west: bounds.west.toString(),
        });
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('スポットの取得に失敗しました');
      }

      const spots = await response.json();
      set({ spots, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '不明なエラー',
        isLoading: false,
      });
    }
  },

  addSpot: (spot) =>
    set((state) => ({
      spots: [spot, ...state.spots],
    })),

  removeSpot: (id) =>
    set((state) => ({
      spots: state.spots.filter((s) => s.id !== id),
      selectedSpot: state.selectedSpot?.id === id ? null : state.selectedSpot,
    })),
}));
