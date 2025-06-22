
import React, { useState, useEffect, useMemo } from 'react';
import { SuggestionResponse, PlayerStyleSuggestion, Club } from '../types';
import { WoodIcon } from './icons/WoodIcon';
import { IronIcon } from './icons/IronIcon';
import { WedgeIcon } from './icons/WedgeIcon';
import { PutterIcon } from './icons/PutterIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LoadingSpinner } from './LoadingSpinner'; 
import { InformationCircleIcon } from './icons/InformationCircleIcon'; // For Caddy Advice

interface ClubDisplayProps {
  suggestion: SuggestionResponse | null;
}

const getCategoryIcon = (category: string): React.ReactNode => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('ウッド') || lowerCategory.includes('wood') || lowerCategory.includes('driver') || lowerCategory.includes('ドライバー')) {
    return <WoodIcon className="w-8 h-8 text-red-500" />;
  }
  if (lowerCategory.includes('アイアン') || lowerCategory.includes('iron')) {
    return <IronIcon className="w-8 h-8 text-blue-500" />;
  }
  if (lowerCategory.includes('ウェッジ') || lowerCategory.includes('wedge')) {
    return <WedgeIcon className="w-8 h-8 text-yellow-500" />;
  }
  if (lowerCategory.includes('パター') || lowerCategory.includes('putter')) {
    return <PutterIcon className="w-8 h-8 text-green-600" />; // Changed to green-600 for consistency
  }
  return <div className="w-8 h-8 bg-gray-300 rounded-full" title={category}></div>; // Fallback
};

const groupClubsByCategory = (clubs: Club[]) => {
  const grouped: { [key: string]: Club[] } = {};
  clubs.forEach(club => {
    let mainCategory = club.category;
    if (club.name.toLowerCase().includes('driver') || club.name.toLowerCase().includes('ドライバー')) mainCategory = 'ドライバー・ウッド';
    else if (club.category.toLowerCase().includes('wood') || club.category.toLowerCase().includes('ウッド')) mainCategory = 'ドライバー・ウッド';
    else if (club.category.toLowerCase().includes('iron') || club.category.toLowerCase().includes('アイアン')) mainCategory = 'アイアン';
    else if (club.category.toLowerCase().includes('wedge') || club.category.toLowerCase().includes('ウェッジ')) mainCategory = 'ウェッジ';
    else if (club.category.toLowerCase().includes('putter') || club.category.toLowerCase().includes('パター')) mainCategory = 'パター';
    else mainCategory = 'その他';

    if (!grouped[mainCategory]) {
      grouped[mainCategory] = [];
    }
    grouped[mainCategory].push(club);
  });
  
  const categoryOrder = ['ドライバー・ウッド', 'アイアン', 'ウェッジ', 'パター', 'その他'];
  const orderedGrouped: { [key: string]: Club[] } = {};
  categoryOrder.forEach(cat => {
    if (grouped[cat]) {
      orderedGrouped[cat] = grouped[cat];
    }
  });
  // Add any categories not in the predefined order (e.g., 'その他')
  Object.keys(grouped).forEach(cat => {
    if (!orderedGrouped[cat]) {
      orderedGrouped[cat] = grouped[cat];
    }
  });

  return orderedGrouped;
};

export const ClubDisplay: React.FC<ClubDisplayProps> = ({ suggestion }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (suggestion && suggestion.styleSuggestions && suggestion.styleSuggestions.length > 0) {
      const styleNames = suggestion.styleSuggestions.map(s => s.styleName);
      if (!activeTab || !styleNames.includes(activeTab)) {
        const preferredTab = styleNames.includes("オールラウンダー") ? "オールラウンダー" : styleNames[0];
        setActiveTab(preferredTab);
      }
    } else {
      setActiveTab(null);
    }
  }, [suggestion, activeTab]); // Added activeTab to dependency array

  const activeStyleSuggestion = useMemo(() => {
    if (!activeTab || !suggestion || !suggestion.styleSuggestions) return null;
    return suggestion.styleSuggestions.find(s => s.styleName === activeTab);
  }, [suggestion, activeTab]);

  if (!suggestion) {
    return (
        <div className="text-center py-10">
            <p className="text-slate-500">フォームに入力して送信すると、ここにAIの提案が表示されます。</p>
        </div>
    );
  }

  const { caddyAdvice, styleSuggestions } = suggestion;

  if (!activeStyleSuggestion && styleSuggestions && styleSuggestions.length > 0) {
    return <LoadingSpinner />; // Show loading if suggestions exist but active one isn't ready
  }
  
  const playerStyleNames = styleSuggestions.map(s => s.styleName);

  return (
    <div className="space-y-10">
      {caddyAdvice && (
        <section className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200" aria-labelledby="caddy-advice-heading">
          <div className="flex items-center mb-4">
            <InformationCircleIcon className="w-10 h-10 text-green-600 mr-3 shrink-0" />
            <h3 id="caddy-advice-heading" className="text-2xl font-semibold text-green-700">キャディーからの総合アドバイス</h3>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-base">{caddyAdvice}</p>
        </section>
      )}

      {styleSuggestions && styleSuggestions.length > 0 && (
        <>
          <div className="mb-8 border-b border-slate-300 sticky top-0 bg-white/90 backdrop-blur-md py-3 z-10">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="プレイスタイル別提案">
              {playerStyleNames.map((styleName) => (
                <button
                  key={styleName}
                  onClick={() => setActiveTab(styleName)}
                  className={`whitespace-nowrap pb-3 pt-2 px-3 sm:px-4 border-b-2 font-semibold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 rounded-t-md
                    ${activeTab === styleName
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-green-50' 
                    } transition-all duration-150 ease-in-out`}
                  aria-current={activeTab === styleName ? 'page' : undefined}
                >
                  {styleName}
                </button>
              ))}
            </nav>
          </div>

          {activeStyleSuggestion && (
            <div key={activeStyleSuggestion.styleName}> {/* Key for potential animations */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl shadow-lg border border-green-200">
                <div className="flex items-center mb-4">
                  <SparklesIcon className="w-8 h-8 text-amber-500 mr-3 shrink-0" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-green-700">{activeStyleSuggestion.styleName}向け 戦略アドバイス</h3>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">{activeStyleSuggestion.generalAdvice}</p>
              </div>

              <div className="mt-10">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-6">推奨クラブセット ({activeStyleSuggestion.clubs.length}本)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(groupClubsByCategory(activeStyleSuggestion.clubs)).map(([category, clubsInCategory]) => (
                    <div key={category} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                      <h4 className="text-lg sm:text-xl font-semibold text-green-700 mb-4 flex items-center">
                        {getCategoryIcon(category)}
                        <span className="ml-3">{category}</span> ({clubsInCategory.length}本)
                      </h4>
                      <ul className="space-y-3">
                        {clubsInCategory.map((club, index) => (
                          <li key={`${club.name}-${index}`} className="pb-3 border-b border-slate-100 last:border-b-0">
                            <p className="font-medium text-slate-700 text-sm sm:text-base">{club.name}</p>
                            {club.rationale && (
                              <p className="text-xs sm:text-sm text-slate-500 mt-1 italic">理由: {club.rationale}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
           {!activeStyleSuggestion && styleSuggestions && styleSuggestions.length > 0 && <LoadingSpinner />}
        </>
      )}
    </div>
  );
};