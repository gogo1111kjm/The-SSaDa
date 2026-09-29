import React from 'react';
import { X, ExternalLink, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface PopupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PopupGuideModal: React.FC<PopupGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-neutral-200 dark:border-neutral-800 apple-glass shadow-2xl overflow-hidden p-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight">
                3개 탭 동시 열기 (팝업 허용 가이드)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                크롬/사파리 브라우저는 보안상 여러 탭 동시 열기를 기본 차단합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="my-5 space-y-3.5">
          <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                브라우저 주소창 우측의 팝업 차단 아이콘 확인
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                검색 후 브라우저 상단 주소창 맨 오른쪽을 보시면 <span className="font-semibold text-amber-600 dark:text-amber-400">‘팝업이 차단되었습니다 [🚫]’</span> 작은 아이콘이 생깁니다.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                ‘항상 허용’ 선택 후 완료 클릭
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                해당 아이콘을 클릭한 뒤 <span className="font-semibold text-neutral-900 dark:text-white">‘이 사이트의 팝업 및 리디렉션을 항상 허용’</span>을 선택하고 [완료]를 누릅니다.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                앞으로 검색할 때마다 체크한 3개 탭이 즉시 자동 오픈
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                한 번만 허용해 두시면 앞으로 검색어를 치고 엔터를 칠 때마다 아마존, 아마존 재팬, 네이버가 한 번에 모두 열립니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
