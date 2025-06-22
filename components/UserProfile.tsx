import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleLogout = () => {
    authService.logout();
    onLogout();
    setIsDropdownOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-sm border border-gray-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-slate-700 font-medium hidden sm:block">
          {user.name}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              登録日: {formatDate(user.createdAt)}
            </p>
          </div>
          
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 focus:outline-none focus:bg-red-50"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}

      {/* ドロップダウン外をクリックした時に閉じる */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}; 