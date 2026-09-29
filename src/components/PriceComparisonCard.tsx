import React, { useState } from 'react';
import { Trophy, TrendingDown, ExternalLink, ShieldCheck, Truck, Edit3, Check, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { PriceComparisonSummary, PlatformPriceResult } from '../data/priceEstimator';
import { AmazonIcon, NaverIcon } from './PlatformIcons';

interface PriceComparisonCardProps {
  summary: PriceComparisonSummary;
  onUpdatePrice?: (platformId: string, newTotalKrw: number) => void;
  onReopenAll: () => void;
}

export const PriceComparisonCard: React.FC<PriceComparisonCardProps> = ({
  summary,
  onUpdatePrice,
  onReopenAll,
}) => {
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');

  const { query, results, lowestResult, highestResult, savingsKrw, savingsPercentage, insight } = summary;

  if (results.length === 0) return null;

  const handleStartEdit = (platform: PlatformPriceResult) => {
    setEditingPlatformId(platform.platformId);
    setEditPriceInput(platform.totalKrw.toString());
  };

  const handleSaveEdit = (platformId: string) => {
    const val = parseInt(editPriceInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(val) && val > 0 && onUpdatePrice) {
      onUpdatePrice(platformId, val);
    }
    setEditingPlatformId(null);
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-8 p-5 sm:p-7 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 apple-glass shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Top Section: Winner & Savings Announcement */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200/60 dark:border-neutral-800">
        <div>
          {/* Winner Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>최저가 추천: {lowestResult.platformName}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {lowestResult.platformName}에서 사는 것이 가장 저렴합니다
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            ‘{query}’ 실시간 가격비교 및 통관·배송비 분석 결과
          </p>
        </div>

        {/* Savings Box */}
        {savingsKrw > 0 && (
          <div className="p-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm shrink-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>The SSaDa 절약 금액</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums mt-0.5">
              ₩{savingsKrw.toLocaleString()}원
            </div>
            <div className="text-[11px] text-neutral-300 dark:text-neutral-600 mt-0.5">
              최고가 대비 {savingsPercentage}% 절약
            </div>
          </div>
        )}
      </div>

      {/* Smart Insight Banner */}
      <div className="my-4 p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
        <Sparkles className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
        <p>{insight}</p>
      </div>

      {/* 3 Platform Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
        {results.map((item) => {
          const isAmazon = item.platformId === 'amazon';
          const isAmazonJp = item.platformId === 'amazon_jp';
          const isNaver = item.platformId === 'naver';
          const isWinner = item.isLowest;
          const isEditing = editingPlatformId === item.platformId;

          return (
            <div
              key={item.platformId}
              className={`relative flex flex-col justify-between p-4.5 rounded-2xl border transition-all duration-200 ${
                isWinner
                  ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/40 dark:border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-sm'
                  : 'bg-white/60 dark:bg-neutral-900/60 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Winner Tag */}
              {isWinner && (
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider shadow-xs uppercase">
                  최저가 1위
                </div>
              )}

              {/* Card Top: Platform Name & Icon */}
              <div>
                <div className="flex items-center justify-between mb-3 mt-1">
                  <div className="flex items-center gap-2">
                    {isAmazon && <AmazonIcon className="w-5 h-5 text-neutral-900 dark:text-white" />}
                    {isAmazonJp && <AmazonIcon className="w-5 h-5 text-neutral-900 dark:text-white" isJp />}
                    {isNaver && <NaverIcon className="w-5 h-5" />}
                    <span className="text-sm font-bold text-neutral-900 dark:text-white tracking-tight">
                      {item.platformName}
                    </span>
                  </div>
                </div>

                {/* Main Price in KRW */}
                <div className="mb-2">
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                    예상 총 구매가 (배송비 포함)
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={editPriceInput}
                        onChange={(e) => setEditPriceInput(e.target.value)}
                        className="w-full px-2 py-1 text-sm font-mono rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.platformId)}
                        className="p-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5 group cursor-pointer" onClick={() => handleStartEdit(item)}>
                      <span className="text-2xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
                        ₩{item.totalKrw.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-opacity"
                        title="탭에서 확인한 실제 가격으로 직접 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Local Currency Breakdown */}
                {item.currency !== 'KRW' && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums mb-3">
                    현지가: {item.currencySymbol}{item.originalPrice.toLocaleString()} {item.currency}
                  </div>
                )}

                {/* Meta details: Duty Free & Shipping */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{item.dutyFreeText}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <Truck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>
                      {item.shippingKrw === 0 ? '무료 배송' : `배송비 약 ₩${item.shippingKrw.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link: Open specific tab */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <a
                  href={item.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isWinner
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <span>{item.platformName} 검색 결과 보기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info & Tab Action */}
      <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400 dark:text-neutral-500">
        <div>
          가격 클릭 시 새로 열린 탭의 실제 결제 가격으로 직접 업데이트할 수 있습니다.
        </div>
        <button
          type="button"
          onClick={onReopenAll}
          className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>3개 탭 모두 다시 열기</span>
        </button>
      </div>
    </section>
  );
};
