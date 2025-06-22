
// This is a placeholder. The actual API key must be set as an environment variable.
// The application code will use process.env.API_KEY directly in geminiService.ts.
// DO NOT commit an actual API key to version control.
export const GEMINI_API_KEY_PLACEHOLDER = "YOUR_API_KEY_HERE"; // This is just for awareness.

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const DEFAULT_DRIVER_CARRY_DISTANCE = 200; // yards
export const DEFAULT_AVERAGE_SCORE = 100;

export const JAPAN_GOLF_COURSES = [
  { value: '川奈ホテルゴルフコース 富士コース', label: '川奈ホテルゴルフコース 富士コース (Kawana Hotel Fuji Course)' },
  { value: 'フェニックスカントリークラブ', label: 'フェニックスカントリークラブ (Phoenix Country Club)' },
  { value: '廣野ゴルフ倶楽部', label: '廣野ゴルフ倶楽部 (Hirono Golf Club)' },
  { value: '太平洋クラブ御殿場コース', label: '太平洋クラブ御殿場コース (Taiheiyo Club Gotemba Course)' },
  { value: '北海道クラシックゴルフクラブ', label: '北海道クラシックゴルフクラブ (Hokkaido Classic Golf Club)' },
  { value: 'カレドニアン・ゴルフクラブ', label: 'カレドニアン・ゴルフクラブ (Caledonian Golf Club)' },
  { value: '鳴尾ゴルフ倶楽部', label: '鳴尾ゴルフ倶楽部 (Naruo Golf Club)' },
  { value: 'よみうりゴルフ倶楽部', label: 'よみうりゴルフ倶楽部 (Yomiuri Golf Club)' },
  { value: 'JFE瀬戸内海ゴルフ倶楽部', label: 'JFE瀬戸内海ゴルフ倶楽部 (JFE Setonaikai Golf Club)' },
  { value: '喜瀬カントリークラブ', label: '喜瀬カントリークラブ (Kise Country Club)' },
  { value: '東京ゴルフ倶楽部', label: '東京ゴルフ倶楽部 (Tokyo Golf Club)' },
  { value: '霞ヶ関カンツリー倶楽部', label: '霞ヶ関カンツリー倶楽部 (Kasumigaseki Country Club)' },
  { value: '戸塚カントリー倶楽部', label: '戸塚カントリー倶楽部 (Totsuka Country Club)'},
  { value: '信州伊那国際ゴルフコース', label: '信州伊那国際ゴルフコース (Shinshu Ina Kokusai Golf Course)' },
  { value: '平均的な日本のゴルフコース (Generic)', label: '特定のコース以外（一般的な特徴で判断）(Average Japanese Course)'} // Fallback option
];
