import React from 'react';
import { Sun, Moon, DollarSign, Command } from 'lucide-react';
import { ExchangeRates } from '../types';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onSetTheme?: (isDark: boolean) => void;
  exchangeRates: ExchangeRates;
  onOpenRates: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onSetTheme,
  exchangeRates,
  onOpenRates,
  onOpenShortcuts,
}) => {
  const setDark = (dark: boolean) => {
    if (onSetTheme) {
      onSetTheme(dark);
    } else {
      if (isDark !== dark) onToggleTheme();
    }
  };
  return (
    <header className="w-full border-b border-neutral-200/60 dark:border-neutral-800/80 apple-glass sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Zone (Single text element wordmark as per Top Bar Contract) */}
        <a
          href="/"
          className="group flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-semibold tracking-tight text-lg hover:opacity-85 transition-opacity"
        >
          <span className="font-bold tracking-tight bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
            The SSaDa
          </span>
          <span className="text-[11px] font-normal text-neutral-400 dark:text-neutral-500 tracking-normal hidden sm:inline">
            글로벌 최저가 통합 검색
          </span>
        </a>

        {/* Center / Secondary Info (Unboxed text with quiet typographic separators) */}
        <div className="hidden md:flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <button
            onClick={onOpenRates}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="실시간 환율 및 관부가세 계산기 열기"
          >
            <span className="font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
              $1 = ₩{exchangeRates.usdToKrw.toLocaleString()}
            </span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="font-mono tabular-nums text-neutral-700 dark:text-neutral-300">
              ¥100 = ₩{exchangeRates.jpyToKrw.toLocaleString()}
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Exchange Rate Quick Button */}
          <button
            onClick={onOpenRates}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="환율 및 관세 안내"
          >
            <DollarSign className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="hidden sm:inline">환율 정보</span>
          </button>

          {/* Shortcuts Button */}
          <button
            onClick={onOpenShortcuts}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="단축키 안내"
          >
            <Command className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span className="hidden sm:inline">단축키</span>
          </button>

          {/* Black & White Segmented Switch */}
          <div
            className="flex items-center p-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 text-xs"
            role="group"
            aria-label="블랙 앤 화이트 테마 선택"
          >
            <button
              type="button"
              onClick={() => setDark(false)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                !isDark
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="화이트 모드"
            >
              <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-neutral-400'}`} />
              <span className="text-[11px]">화이트</span>
            </button>
            <button
              type="button"
              onClick={() => setDark(true)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isDark
                  ? 'bg-neutral-900 text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="블랙 모드"
            >
              <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-neutral-400'}`} />
              <span className="text-[11px]">블랙</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
