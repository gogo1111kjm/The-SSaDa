import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SearchHistoryItem } from '../types';
import { TRENDING_KEYWORDS } from '../data/trendingKeywords';

interface SearchBarProps {
  query: string;
  onChangeQuery: (val: string) => void;
  onSearch: (customQuery?: string) => void;
  recentSearches: SearchHistoryItem[];
  onRemoveRecent: (id: string, e: React.MouseEvent) => void;
  onClearRecent: () => void;
  selectedPlatformCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChangeQuery,
  onSearch,
  recentSearches,
  onRemoveRecent,
  onClearRecent,
  selectedPlatformCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global '/' keyboard shortcut to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    onSearch();
  };

  const handleSelectKeyword = (keyword: string) => {
    onChangeQuery(keyword);
    setIsOpen(false);
    onSearch(keyword);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative z-20">
        <div
          className={`group flex items-center w-full h-14 sm:h-16 px-4 sm:px-5 rounded-full border transition-all duration-300 apple-glass ${
            isOpen
              ? 'border-neutral-400 dark:border-neutral-600 apple-input-shadow-focus ring-2 ring-neutral-900/5 dark:ring-white/10'
              : 'border-neutral-200/90 dark:border-neutral-800 apple-input-shadow hover:border-neutral-300 dark:hover:border-neutral-700'
          }`}
        >
          {/* Search Icon */}
          <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0 mr-3 transition-colors group-focus-within:text-neutral-800 dark:group-focus-within:text-neutral-200" />

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="상품명을 입력하세요 (예: 에어팟 프로 2, 소니 XM5, 다이슨)"
            className="w-full h-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 text-base sm:text-lg font-normal tracking-tight focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  onChangeQuery('');
                  inputRef.current?.focus();
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
                title="지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Keyboard shortcut guide */}
            {!query && (
              <kbd className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500">
                /
              </kbd>
            )}

            {/* Submit Arrow Button */}
            <button
              type="submit"
              disabled={!query.trim() || selectedPlatformCount === 0}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                query.trim() && selectedPlatformCount > 0
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:scale-105 active:scale-95 shadow-sm'
                  : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 cursor-not-allowed opacity-60'
              }`}
              title="검색 실행 (새 탭에서 열기)"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Dropdown Suggestions & Recent Searches */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 apple-glass shadow-xl z-30 transition-all">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center justify-between px-3 py-1 mb-1">
                <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> 최근 검색어
                </span>
                <button
                  type="button"
                  onClick={onClearRecent}
                  className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  모두 지우기
                </button>
              </div>
              <div className="space-y-0.5">
                {recentSearches.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 text-sm text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer group"
                    onClick={() => handleSelectKeyword(item.query)}
                  >
                    <span className="truncate">{item.query}</span>
                    <button
                      type="button"
                      onClick={(e) => onRemoveRecent(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-opacity"
                      title="삭제"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Shopping Keywords */}
          <div>
            <div className="px-3 py-1 mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> 인기 직구 & 가격비교 추천
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 px-1">
              {TRENDING_KEYWORDS.slice(0, 6).map((item) => (
                <button
                  key={item.keyword}
                  type="button"
                  onClick={() => handleSelectKeyword(item.keyword)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <span className="truncate">{item.keyword}</span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 shrink-0 ml-1">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
