import React, { useState, useCallback, useEffect } from 'react';
import { UserPerformanceMetrics, GolfCourseOption, User } from '../types';
import { JAPAN_GOLF_COURSES, DEFAULT_DRIVER_CARRY_DISTANCE, DEFAULT_AVERAGE_SCORE } from '../constants';
import { fetchNearbyGolfCourses } from '../services/geminiService';
import { authService } from '../services/authService';
import { SearchIcon } from './icons/SearchIcon';

interface UserInputFormProps {
  onSubmit: (metrics: UserPerformanceMetrics, courseName: string) => void;
  isLoading: boolean;
  user?: User | null;
}

export const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, isLoading, user }) => {
  const [driverCarryDistance, setDriverCarryDistance] = useState<string>(DEFAULT_DRIVER_CARRY_DISTANCE.toString());
  const [averageScore, setAverageScore] = useState<string>(DEFAULT_AVERAGE_SCORE.toString());
  const [selectedCourseName, setSelectedCourseName] = useState<string>(JAPAN_GOLF_COURSES[0].value);

  const [locationSearchTerm, setLocationSearchTerm] = useState<string>('');
  const [nearbyCourses, setNearbyCourses] = useState<GolfCourseOption[]>([]);
  const [isSearchingCourses, setIsSearchingCourses] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // ユーザーの設定を自動的に読み込む
  useEffect(() => {
    if (user?.preferences) {
      if (user.preferences.driverCarryDistance) {
        setDriverCarryDistance(user.preferences.driverCarryDistance.toString());
      }
      if (user.preferences.averageScore) {
        setAverageScore(user.preferences.averageScore.toString());
      }
    }
  }, [user]);

  const handleLocationSearch = async () => {
    if (!locationSearchTerm.trim()) {
      setSearchError("検索する地域名を入力してください。");
      return;
    }
    setIsSearchingCourses(true);
    setSearchError(null);
    setNearbyCourses([]);
    try {
      const courses = await fetchNearbyGolfCourses(locationSearchTerm);
      if (courses.length === 0) {
        setSearchError(`「${locationSearchTerm}」付近にゴルフコースが見つかりませんでした。別の地域名でお試しください。`);
      } else {
        setNearbyCourses(courses);
        // Optionally, auto-select the first nearby course or add a "select" placeholder
        // setSelectedCourseName(courses[0].value); 
      }
    } catch (err) {
      if (err instanceof Error) {
        setSearchError(err.message);
      } else {
        setSearchError('コース検索中に不明なエラーが発生しました。');
      }
    } finally {
      setIsSearchingCourses(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const driverDistance = parseInt(driverCarryDistance, 10);
    const avgScore = parseInt(averageScore, 10);
    
    if (isNaN(driverDistance) || driverDistance <= 0 || isNaN(avgScore) || avgScore <= 0) {
      alert("飛距離と平均スコアは有効な数値を入力してください。");
      return;
    }
    if (!selectedCourseName || selectedCourseName === "--- Nearby course ---" || selectedCourseName === "") {
      alert("プレーするゴルフコースを選択してください。");
      return;
    }
    onSubmit({ driverCarryDistance: driverDistance, averageScore: avgScore }, selectedCourseName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="driverCarryDistance" className="block text-lg font-semibold text-slate-700 mb-2">
          ドライバーのキャリー飛距離 (ヤード)
        </label>
        <input
          type="number"
          id="driverCarryDistance"
          value={driverCarryDistance}
          onChange={(e) => setDriverCarryDistance(e.target.value)}
          className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-slate-700 bg-white"
          disabled={isLoading}
          aria-describedby="driverCarryDistanceDescription"
          min="50"
          max="400"
          step="5"
        />
        <p id="driverCarryDistanceDescription" className="text-sm text-slate-500 mt-1">
          普段のドライバーでのキャリー飛距離をヤードで入力してください。 (例: 220)
        </p>
      </div>

      <div>
        <label htmlFor="averageScore" className="block text-lg font-semibold text-slate-700 mb-2">
          平均スコア
        </label>
        <input
          type="number"
          id="averageScore"
          value={averageScore}
          onChange={(e) => setAverageScore(e.target.value)}
          className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-slate-700 bg-white"
          disabled={isLoading}
          aria-describedby="averageScoreDescription"
          min="60"
          max="150"
          step="1"
        />
        <p id="averageScoreDescription" className="text-sm text-slate-500 mt-1">
          18ホールの平均スコアを入力してください。 (例: 95)
        </p>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700">地域名からゴルフコースを検索</h3>
        <div className="flex items-start space-x-2">
          <div className="flex-grow">
            <label htmlFor="locationSearch" className="sr-only">地域名 (例: 長野市)</label>
            <input
              type="text"
              id="locationSearch"
              placeholder="例: 川越市、東京23区"
              value={locationSearchTerm}
              onChange={(e) => setLocationSearchTerm(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-slate-700 bg-white"
              disabled={isLoading || isSearchingCourses}
              aria-describedby="locationSearchDescription"
            />
             <p id="locationSearchDescription" className="text-sm text-slate-500 mt-1">市町村名などで検索できます。</p>
          </div>
          <button
            type="button"
            onClick={handleLocationSearch}
            disabled={isLoading || isSearchingCourses || !locationSearchTerm.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="入力された地域名でゴルフコースを検索する"
          >
            {isSearchingCourses ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <SearchIcon className="h-5 w-5" />
            )}
            <span className={isSearchingCourses ? "ml-2" : "sr-only"}>検索中...</span>
          </button>
        </div>
        
        {searchError && <p className="text-sm text-red-600 mt-2" role="alert">{searchError}</p>}
        
        {nearbyCourses.length > 0 && !isSearchingCourses && (
          <div className="mt-4">
            <label htmlFor="nearbyCourseSelect" className="block text-md font-medium text-slate-700 mb-1">
              検索結果からコースを選択:
            </label>
            <select
              id="nearbyCourseSelect"
              value={selectedCourseName}
              onChange={(e) => setSelectedCourseName(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-slate-700 bg-white"
              disabled={isLoading}
            >
              <option value="" disabled={selectedCourseName !== "" && !nearbyCourses.find(c => c.value === selectedCourseName) }>--- 付近のコースを選択 ---</option>
              {nearbyCourses.map(course => (
                <option key={course.value} value={course.value}>
                  {course.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label htmlFor="courseName" className="block text-lg font-semibold text-slate-700 mb-2">
          または、リストからゴルフコースを選択
        </label>
        <select
          id="courseName"
          value={selectedCourseName}
          onChange={(e) => {
            setSelectedCourseName(e.target.value);
          }}
          className="w-full p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-slate-700 bg-white"
          disabled={isLoading}
          aria-describedby="courseNameDescription"
        >
          {JAPAN_GOLF_COURSES.map((course) => (
            <option key={course.value} value={course.value}>
              {course.label}
            </option>
          ))}
           {!JAPAN_GOLF_COURSES.find(c => c.value.includes("Generic") || c.value.includes("Unknown")) && (
            <option value="Unknown Course Type">情報なし/一般的なコース</option>
           )}
        </select>
        <p id="courseNameDescription" className="text-sm text-slate-500 mt-1">リストから選択するか、上の検索機能を使用してください。</p>
      </div>


      <button
        type="submit"
        disabled={isLoading || isSearchingCourses}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        aria-label={isLoading ? "AIが提案を生成中です" : "クラブ構成の提案をAIに依頼する"}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>AIが考え中...</span>
          </>
        ) : (
          <span>クラブ構成を提案してもらう</span>
        )}
      </button>
    </form>
  );
};