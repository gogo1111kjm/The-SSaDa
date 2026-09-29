import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', description: '검색창으로 즉시 이동 및 포커스' },
    { key: 'Enter', description: '체크된 모든 사이트에서 새 탭 검색 실행' },
    { key: '1', description: '아마존 (Amazon US) 체크/체크해제 토글' },
    { key: '2', description: '아마존 재팬 (Amazon JP) 체크/체크해제 토글' },
    { key: '3', description: '네이버 (Naver) 체크/체크해제 토글' },
    { key: 'Esc', description: '검색어 지우기 및 모달 창 닫기' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl border border-neutral-200 dark:border-neutral-800 apple-glass shadow-2xl overflow-hidden p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-neutral-500" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight">
              키보드 단축키
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800/80 my-2">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-300">{sc.description}</span>
              <kbd className="px-2 py-1 min-w-6 text-center font-mono text-[11px] rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
