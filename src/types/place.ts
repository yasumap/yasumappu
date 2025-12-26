// 場所関連の型定義
import { MapPosition } from './map';

export interface Place {
  id: string;
  name: string;
  position: MapPosition;
  address: string;
  category: PlaceCategory;
  availableSeats: number;
  totalSeats: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum PlaceCategory {
  CAFE = 'CAFE',
  LIBRARY = 'LIBRARY',
  PARK = 'PARK',
  COWORKING = 'COWORKING',
  OTHER = 'OTHER',
}
