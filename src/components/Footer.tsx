import React from 'react';

interface FooterProps {
  onOpenRates: () => void;
  onOpenShortcuts: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRates, onOpenShortcuts }) => {
  return (
    <footer className="w-full border-t border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/50 text-neutral-400 dark:text-neutral-500 py-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Region & Brand */}
        <div className="flex items-center gap-2">
          <span>대한민국</span>
          <span aria-hidden="true">·</span>
          <span>The SSaDa</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-400 dark:text-neutral-600">Smart Price Comparison</span>
        </div>

        {/* Right: Helpful Actions & Quiet Links */}
        <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
          <button
            onClick={onOpenRates}
            className="hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            환율 계산기
          </button>
          <button
            onClick={onOpenShortcuts}
            className="hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            단축키 안내
          </button>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">|</span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-600">
            각 사이트의 상표 및 로고는 해당 권리자에게 귀속됩니다.
          </span>
        </div>
      </div>
    </footer>
  );
};
