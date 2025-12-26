// マップ関連の型定義

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapState {
  center: MapPosition;
  zoom: number;
  bounds?: MapBounds;
}
