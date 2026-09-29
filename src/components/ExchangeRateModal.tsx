import React, { useState } from 'react';
import { X, ArrowRightLeft, ShieldCheck, Info } from 'lucide-react';
import { ExchangeRates } from '../types';

interface ExchangeRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: ExchangeRates;
  onUpdateRates: (newRates: ExchangeRates) => void;
}

export const ExchangeRateModal: React.FC<ExchangeRateModalProps> = ({
  isOpen,
  onClose,
  rates,
  onUpdateRates,
}) => {
  const [usdInput, setUsdInput] = useState<string>('150');
  const [jpyInput, setJpyInput] = useState<string>('20000');

  if (!isOpen) return null;

  const usdValue = parseFloat(usdInput) || 0;
  const krwFromUsd = Math.round(usdValue * rates.usdToKrw);

  const jpyValue = parseFloat(jpyInput) || 0;
  const krwFromJpy = Math.round((jpyValue / 100) * rates.jpyToKrw);

  // Duty free checks
  const isUsdDutyFree = usdValue <= 200;
  // For Japan, duty-free is $150 USD equivalent.
  // 150 USD in KRW = 150 * usdToKrw. 1 JPY = jpyToKrw / 100 KRW.
  const jpyEquivalentUsd = rates.usdToKrw > 0 ? (krwFromJpy / rates.usdToKrw) : 0;
  const isJpyDutyFree = jpyEquivalentUsd <= 150;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-neutral-200 dark:border-neutral-800 apple-glass shadow-2xl overflow-hidden p-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
              실시간 직구 환율 & 관세 계산기
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              아마존과 아마존 재팬 상품 가격을 한화로 간편하게 비교하세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Rates Bar */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-0.5">
              미국 달러 (USD) 기준
            </span>
            <div className="text-base font-semibold font-mono tabular-nums text-neutral-900 dark:text-white">
              $1 = ₩{rates.usdToKrw.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-0.5">
              일본 엔화 (JPY) 기준
            </span>
            <div className="text-base font-semibold font-mono tabular-nums text-neutral-900 dark:text-white">
              ¥100 = ₩{rates.jpyToKrw.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Interactive Converters */}
        <div className="space-y-4">
          {/* USD to KRW */}
          <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-neutral-400" /> 미국 아마존 ($ → ₩)
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  isUsdDutyFree
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                }`}
              >
                {isUsdDutyFree ? '면세 범위 ($200 이하)' : '관부가세 부과 대상 ($200 초과)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-mono">$</span>
                <input
                  type="number"
                  value={usdInput}
                  onChange={(e) => setUsdInput(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-mono tabular-nums text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                  placeholder="0"
                />
              </div>
              <span className="text-neutral-400 text-sm font-medium">≈</span>
              <div className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 text-sm font-mono tabular-nums text-neutral-900 dark:text-white font-semibold">
                ₩{krwFromUsd.toLocaleString()}
              </div>
            </div>
          </div>

          {/* JPY to KRW */}
          <div className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-neutral-400" /> 일본 아마존 (¥ → ₩)
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  isJpyDutyFree
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                }`}
              >
                {isJpyDutyFree ? '면세 범위 ($150 이하)' : '관부가세 부과 대상 ($150 초과)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-mono">¥</span>
                <input
                  type="number"
                  value={jpyInput}
                  onChange={(e) => setJpyInput(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-mono tabular-nums text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                  placeholder="0"
                />
              </div>
              <span className="text-neutral-400 text-sm font-medium">≈</span>
              <div className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 text-sm font-mono tabular-nums text-neutral-900 dark:text-white font-semibold">
                ₩{krwFromJpy.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Customs Guide Box */}
        <div className="mt-4 p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
            <span>해외직구 면세 한도 핵심 요약</span>
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1 leading-relaxed">
            <p>• <strong>미국 직구(아마존)</strong>: 물품 가격 합계 $200 이하까지 관부가세 면제 (목록통관 기준)</p>
            <p>• <strong>일본 직구(아마존 재팬)</strong>: 물품 가격 합계 미화 $150 이하까지 면제</p>
            <p>• 동일 입항일에 같은 국가에서 복수 주문 시 합산과세가 발생할 수 있습니다.</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
