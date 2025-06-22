import React, { useState } from 'react';
import { AuthFormData, User } from '../types';
import { authService } from '../services/authService';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
  onCancel: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // エラーをクリア
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user: User;
      
      if (isLogin) {
        user = await authService.login(formData);
      } else {
        user = await authService.register(formData);
      }

      onAuthSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '認証中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {isLogin ? 'ログイン' : 'アカウント登録'}
          </h2>
          <p className="text-slate-600 mt-2">
            {isLogin ? 'アカウントにログインしてください' : '新しいアカウントを作成してください'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                お名前
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
                placeholder="山田太郎"
                required={!isLogin}
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
              placeholder="example@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
              placeholder={isLogin ? "パスワード" : "6文字以上"}
              required
              disabled={isLoading}
              minLength={isLogin ? undefined : 6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'ログイン中...' : '登録中...'}
                </div>
              ) : (
                isLogin ? 'ログイン' : '登録'
              )}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-green-600 hover:text-green-700 font-medium py-2 px-4 rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLogin ? 'アカウントをお持ちでない方はこちら' : '既にアカウントをお持ちの方はこちら'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 px-4 rounded-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 