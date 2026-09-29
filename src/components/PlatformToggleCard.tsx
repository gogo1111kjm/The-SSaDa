import React from 'react';
import { Check } from 'lucide-react';
import { PlatformConfig } from '../types';
import { AmazonIcon, NaverIcon } from './PlatformIcons';

interface PlatformToggleCardProps {
  platform: PlatformConfig;
  isSelected: boolean;
  onToggle: (id: PlatformConfig['id']) => void;
}

export const PlatformToggleCard: React.FC<PlatformToggleCardProps> = ({
  platform,
  isSelected,
  onToggle,
}) => {
  const isAmazon = platform.id === 'amazon';
  const isAmazonJp = platform.id === 'amazon_jp';
  const isNaver = platform.id === 'naver';

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      onClick={() => onToggle(platform.id)}
      className={`group relative flex items-center justify-between sm:justify-start gap-3 px-4 py-3 sm:py-3.5 rounded-2xl border transition-all duration-200 select-none text-left cursor-pointer ${
        isSelected
          ? 'bg-white dark:bg-neutral-900/90 border-neutral-300 dark:border-neutral-700 shadow-sm sm:shadow ring-1 ring-black/5 dark:ring-white/10'
          : 'bg-neutral-50/80 dark:bg-neutral-900/40 border-neutral-200/80 dark:border-neutral-800/80 hover:bg-white dark:hover:bg-neutral-900/70 hover:border-neutral-300 dark:hover:border-neutral-700 opacity-70 hover:opacity-100'
      }`}
    >
      {/* Left: Custom Apple-style circular checkbox & Platform Icon */}
      <div className="flex items-center gap-3">
        {/* Apple-style Checkbox Circle */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
            isSelected
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 scale-100'
              : 'border border-neutral-300 dark:border-neutral-700 bg-transparent group-hover:border-neutral-400 dark:group-hover:border-neutral-500 scale-95'
          }`}
        >
          {isSelected && <Check className="w-3.2 h-3.2 stroke-[3]" />}
        </div>

        {/* Platform Icon */}
        <div className="shrink-0 flex items-center justify-center">
          {isAmazon && <AmazonIcon className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />}
          {isAmazonJp && <AmazonIcon className="w-5 h-5 text-neutral-800 dark:text-neutral-200" isJp />}
          {isNaver && <NaverIcon className="w-5 h-5" />}
        </div>

        {/* Label & Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm font-semibold tracking-tight transition-colors ${
                isSelected
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {platform.nameKo}
            </span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
              {platform.badge}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 hidden sm:block">
            {platform.description}
          </span>
        </div>
      </div>

      {/* Right: Keyboard Shortcut Hint & Currency Indicator */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 shrink-0">
        <span className="font-mono text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
          {platform.currencySymbol}
        </span>
        <kbd className="hidden lg:inline-flex items-center justify-center w-4.5 h-4.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400">
          {platform.shortcutKey}
        </kbd>
      </div>
    </button>
  );
};
