// 座席関連の型定義

export interface Seat {
  id: string;
  placeId: string;
  isAvailable: boolean;
  seatType: SeatType;
  features?: SeatFeature[];
  updatedAt: Date;
}

export enum SeatType {
  TABLE = 'TABLE',
  COUNTER = 'COUNTER',
  SOFA = 'SOFA',
  OUTDOOR = 'OUTDOOR',
}

export enum SeatFeature {
  POWER_OUTLET = 'POWER_OUTLET',
  WIFI = 'WIFI',
  QUIET = 'QUIET',
  SMOKING = 'SMOKING',
}
