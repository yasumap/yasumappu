// ユーザー関連の型定義

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface UserProfile extends User {
  favoritePlace?: string[];
}
