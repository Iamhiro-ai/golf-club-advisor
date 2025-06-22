export interface UserPerformanceMetrics {
  driverCarryDistance: number; // in yards
  averageScore: number;
}

export interface Club {
  name: string; // e.g., "Driver", "7番アイアン"
  category: string; // e.g., "ウッド", "アイアン", "ウェッジ", "パター"
  rationale?: string; // Optional brief reason for this club or category
}

export interface PlayerStyleSuggestion {
  styleName: string; // e.g., "パワーヒッター", "テクニカルプレイヤー", "オールラウンダー"
  clubs: Club[];
  generalAdvice: string; // Style-specific shorter advice
}

export interface SuggestionResponse {
  caddyAdvice: string; // Overall caddy advice
  styleSuggestions: PlayerStyleSuggestion[]; // Array of suggestions for different player styles
}

export interface GolfCourseOption {
  value: string;
  label: string;
}

export interface NearbyGolfCourse {
  name: string;
  address?: string; // Optional, but good if the API can provide it
}

// 認証関連の型定義
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  driverCarryDistance?: number;
  averageScore?: number;
  favoriteCourses?: string[];
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string; // 登録時のみ
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}