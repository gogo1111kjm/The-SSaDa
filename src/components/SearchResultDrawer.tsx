import React, { useState } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, CheckCircle2, Copy, Check, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { PlatformConfig, PlatformId } from '../types';
import { AmazonIcon, NaverIcon } from './PlatformIcons';

interface SearchResultDrawerProps {
  lastQuery: string;
  selectedPlatformIds: PlatformId[];
  platforms: PlatformConfig[];
  naverMode: 'shopping' | 'portal';
  onReopenAll: () => void;
  onOpenGuide: () => void;
  onClose: () => void;
}

export const SearchResultDrawer: React.FC<SearchResultDrawerProps> = ({
  lastQuery,
  selectedPlatformIds,
  platforms,
  naverMode,
  onReopenAll,
  onOpenGuide,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [openedPlatformIds, setOpenedPlatformIds] = useState<PlatformId[]>([]);

  if (!lastQuery) return null;

  const activePlatforms = platforms.filter((p) => selectedPlatformIds.includes(p.id));

  const handleCopy = () => {
    navigator.clipboard.writeText(lastQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackOpen = (id: PlatformId) => {
    if (!openedPlatformIds.includes(id)) {
      setOpenedPlatformIds((prev) => [...prev, id]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-4 sm:p-6 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 apple-glass shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
            ‘{lastQuery}’
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {activePlatforms.length}개 사이트 검색 호출
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사됨' : '키워드 복사'}</span>
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <button
            type="button"
            onClick={onReopenAll}
            className="flex items-center gap-1 text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors cursor-pointer"
            title="모든 사이트 탭 다시 열기 시도"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>모두 다시 열기</span>
          </button>
        </div>
      </div>

      {/* Browser Multi-tab Notice Banner */}
      <div className="mt-3.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-0" />
          <span>
            브라우저 기본 보안으로 1개 탭만 열린 경우, <strong>주소창의 [팝업 차단 🚫]</strong>을 누르고 <strong>‘항상 허용’</strong>을 설정하세요.
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenGuide}
          className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <span>해결 방법 안내</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Direct Clickable Platform Cards (Always works with 1-click per card) */}
      <div className="mt-4">
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 flex items-center justify-between">
          <span>각 사이트별 새 탭 바로가기:</span>
          <span className="text-[11px] text-neutral-400">클릭 시 차단 없이 즉시 새 탭이 열립니다</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {activePlatforms.map((platform) => {
            const searchUrl = platform.buildSearchUrl(lastQuery, { naverMode });
            const isAmazon = platform.id === 'amazon';
            const isAmazonJp = platform.id === 'amazon_jp';
            const isNaver = platform.id === 'naver';

            return (
              <a
                key={platform.id}
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrackOpen(platform.id)}
                className="group flex flex-col justify-between p-3.5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-50 dark:hover:bg-neutral-800/90 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isAmazon && <AmazonIcon className="w-4.5 h-4.5 text-neutral-800 dark:text-neutral-200" />}
                    {isAmazonJp && <AmazonIcon className="w-4.5 h-4.5 text-neutral-800 dark:text-neutral-200" isJp />}
                    {isNaver && <NaverIcon className="w-4.5 h-4.5" />}
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {platform.nameKo}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span className="truncate">{platform.domain}</span>
                  <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300 group-hover:underline">
                    새 탭 열기 ↗
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
