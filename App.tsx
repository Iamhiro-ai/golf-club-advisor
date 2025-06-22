import React, { useState, useCallback } from 'react';
import { UserInputForm } from './components/UserInputForm';
import { ClubDisplay } from './components/ClubDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { AuthForm } from './components/AuthForm';
import { fetchClubSuggestion } from './services/geminiService';
import { SuggestionResponse, UserPerformanceMetrics, User  } from './types';
import { GolfClubBallIcon } from './components/icons/GolfClubBallIcon';
import { authService } from './services/authService';
import { UserProfile } from './components/UserProfile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<SuggestionResponse | null>(null);
  const [showAuthForm, setShowAuthForm] = useState<boolean>(false);

  const handleFormSubmit = useCallback(async (metrics: UserPerformanceMetrics, courseName: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await fetchClubSuggestion(metrics, courseName);
      setSuggestion(result);
      
      // ユーザーがログインしている場合、設定を保存
      if (user) {
        authService.updatePreferences({
          driverCarryDistance: metrics.driverCarryDistance,
          averageScore: metrics.averageScore
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setShowAuthForm(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setSuggestion(null);
  };

  const handleLoginClick = () => {
    setShowAuthForm(true);
  };

  const handleAuthCancel = () => {
    setShowAuthForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center bg-green-600 p-4 rounded-full shadow-xl">
              <GolfClubBallIcon className="h-16 w-16 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight sm:text-5xl">
                ゴルフ クラブ アドバイザー
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                AIによる最適なクラブ構成を提案
              </p>
            </div>
          </div>
          
          {/* 認証ボタン */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserProfile user={user} onLogout={handleLogout} />
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                ログイン / 登録
              </button>
            )}
          </div>
        </div>
        
        <p className="text-xl text-slate-600 max-w-2xl">
          あなたの飛距離、平均スコア、そしてプレーするゴルフコースを選んで、AIによる最適な14本のクラブ構成をプレイスタイル別に見つけましょう！
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-10" role="main">
        <UserInputForm onSubmit={handleFormSubmit} isLoading={isLoading} user={user} />

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        
        {suggestion && !isLoading && !error && (
          <section className="mt-12" aria-labelledby="suggestion-heading">
            <h2 id="suggestion-heading" className="text-3xl font-bold text-slate-800 mb-6 text-center sr-only">AIからの提案</h2>
            <ClubDisplay suggestion={suggestion} />
          </section>
        )}
      </main>

      <footer className="mt-12 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} AI Golf Assistant. All rights reserved.</p>
        <p className="text-sm">Powered by Gemini API</p>
      </footer>

      {/* 認証フォーム */}
      {showAuthForm && (
        <AuthForm onAuthSuccess={handleAuthSuccess} onCancel={handleAuthCancel} />
      )}
    </div>
  );
};

export default App;