import React, { useState, useEffect, useCallback } from 'react';
import { PLATFORMS } from './data/platforms';
import { PlatformId, SearchHistoryItem, ExchangeRates } from './types';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PlatformToggleCard } from './components/PlatformToggleCard';
import { SearchResultDrawer } from './components/SearchResultDrawer';
import { PriceComparisonCard } from './components/PriceComparisonCard';
import { ExchangeRateModal } from './components/ExchangeRateModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { PopupGuideModal } from './components/PopupGuideModal';
import { Footer } from './components/Footer';
import { CheckSquare, Square, Dices, Search, Settings2 } from 'lucide-react';
import { TRENDING_KEYWORDS } from './data/trendingKeywords';
import { estimatePricesForQuery, PriceComparisonSummary } from './data/priceEstimator';

const STORAGE_KEYS = {
  THEME: 'the_ssada_theme',
  SELECTED_PLATFORMS: 'the_ssada_platforms',
  RECENT_SEARCHES: 'the_ssada_recent_searches',
  NAVER_MODE: 'the_ssada_naver_mode',
};

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Query & Platforms state
  const [query, setQuery] = useState('');
  const [lastExecutedQuery, setLastExecutedQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_PLATFORMS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // fallback
        }
      }
    }
    return ['amazon', 'amazon_jp', 'naver']; // Default: all 3 checked
  });

  // Naver search mode (shopping vs portal)
  const [naverMode, setNaverMode] = useState<'shopping' | 'portal'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.NAVER_MODE);
      if (saved === 'portal' || saved === 'shopping') return saved;
    }
    return 'shopping';
  });

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [
      { id: '1', query: '에어팟 프로 2', timestamp: Date.now() - 3600000, platforms: ['amazon', 'amazon_jp', 'naver'] },
      { id: '2', query: '소니 WH-1000XM5', timestamp: Date.now() - 7200000, platforms: ['amazon', 'amazon_jp', 'naver'] },
      { id: '3', query: '닌텐도 스위치 OLED', timestamp: Date.now() - 10800000, platforms: ['amazon', 'amazon_jp', 'naver'] },
    ];
  });

  // Price comparison summary state
  const [priceSummary, setPriceSummary] = useState<PriceComparisonSummary | null>(null);

  // Modals state
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isPopupGuideOpen, setIsPopupGuideOpen] = useState(false);

  // Exchange rates
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    usdToKrw: 1385,
    jpyToKrw: 925,
    updatedAt: new Date().toLocaleDateString('ko-KR'),
  });

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDark]);

  // Save selected platforms
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_PLATFORMS, JSON.stringify(selectedPlatforms));
  }, [selectedPlatforms]);

  // Save recent searches
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Save Naver mode
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NAVER_MODE, naverMode);
  }, [naverMode]);

  // Recalculate price summary when exchange rates change
  useEffect(() => {
    if (lastExecutedQuery && selectedPlatforms.length > 0) {
      const updated = estimatePricesForQuery(lastExecutedQuery, exchangeRates, selectedPlatforms);
      setPriceSummary(updated);
    }
  }, [exchangeRates]);

  // Toggle platform selection
  const handleTogglePlatform = useCallback((id: PlatformId) => {
    setSelectedPlatforms((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        if (e.key === 'Escape') {
          (document.activeElement as HTMLElement).blur();
        }
        return;
      }

      if (e.key === '1') {
        e.preventDefault();
        handleTogglePlatform('amazon');
      } else if (e.key === '2') {
        e.preventDefault();
        handleTogglePlatform('amazon_jp');
      } else if (e.key === '3') {
        e.preventDefault();
        handleTogglePlatform('naver');
      } else if (e.key === 'Escape') {
        setIsRatesModalOpen(false);
        setIsShortcutsModalOpen(false);
        setIsPopupGuideOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlatform]);

  // Select all or deselect all
  const handleToggleAllPlatforms = () => {
    if (selectedPlatforms.length === PLATFORMS.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(PLATFORMS.map((p) => p.id));
    }
  };

  // Execute Search: Opens each checked platform in a new tab & calculates lowest prices
  const handleSearch = (customQuery?: string) => {
    const targetQuery = (customQuery || query).trim();
    if (!targetQuery) return;
    if (selectedPlatforms.length === 0) return;

    setLastExecutedQuery(targetQuery);

    // Save to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.query.toLowerCase() !== targetQuery.toLowerCase());
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: targetQuery,
        timestamp: Date.now(),
        platforms: selectedPlatforms,
      };
      return [newItem, ...filtered].slice(0, 10);
    });

    // Calculate real-time lowest price comparison & savings
    const summary = estimatePricesForQuery(targetQuery, exchangeRates, selectedPlatforms);
    setPriceSummary(summary);

    // Execute window.open for each checked platform
    selectedPlatforms.forEach((platformId) => {
      const platform = PLATFORMS.find((p) => p.id === platformId);
      if (platform) {
        const url = platform.buildSearchUrl(targetQuery, { naverMode });
        try {
          window.open(url, '_blank');
        } catch {
          // Handled by SearchResultDrawer
        }
      }
    });
  };

  // Re-open all tabs
  const handleReopenAll = () => {
    if (!lastExecutedQuery) return;
    selectedPlatforms.forEach((platformId) => {
      const platform = PLATFORMS.find((p) => p.id === platformId);
      if (platform) {
        const url = platform.buildSearchUrl(lastExecutedQuery, { naverMode });
        window.open(url, '_blank');
      }
    });
  };

  // User manual price update handler (if actual price in the tab is adjusted)
  const handleUpdatePrice = (platformId: string, newTotalKrw: number) => {
    if (!priceSummary) return;

    const updatedResults = priceSummary.results.map((r) => {
      if (r.platformId === platformId) {
        return {
          ...r,
          totalKrw: newTotalKrw,
          krwPrice: newTotalKrw - r.shippingKrw,
        };
      }
      return r;
    });

    updatedResults.sort((a, b) => a.totalKrw - b.totalKrw);
    updatedResults.forEach((r, idx) => {
      r.isLowest = idx === 0;
    });

    const lowest = updatedResults[0];
    const highest = updatedResults[updatedResults.length - 1];
    const savings = Math.max(0, highest.totalKrw - lowest.totalKrw);
    const savingsPct = highest.totalKrw > 0 ? Math.round((savings / highest.totalKrw) * 100) : 0;

    let newInsight = priceSummary.insight;
    if (savings > 0) {
      newInsight = `수정된 가격 반영 결과: ${lowest.platformName}이 ${highest.platformName} 대비 ₩${savings.toLocaleString()}원(${savingsPct}%) 더 저렴합니다.`;
    }

    setPriceSummary({
      ...priceSummary,
      results: updatedResults,
      lowestResult: lowest,
      highestResult: highest,
      savingsKrw: savings,
      savingsPercentage: savingsPct,
      insight: newInsight,
    });
  };

  // Lucky Search
  const handleFeelingLucky = () => {
    const randomIndex = Math.floor(Math.random() * TRENDING_KEYWORDS.length);
    const randomKeyword = TRENDING_KEYWORDS[randomIndex].keyword;
    setQuery(randomKeyword);
    handleSearch(randomKeyword);
  };

  // Recent searches removal
  const handleRemoveRecent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const allSelected = selectedPlatforms.length === PLATFORMS.length;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        exchangeRates={exchangeRates}
        onOpenRates={() => setIsRatesModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-8 md:py-14 max-w-4xl mx-auto w-full">
        {/* Brand Hero */}
        <div className="text-center mb-6 sm:mb-8 select-none">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-2 sm:mb-3">
            <span className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-700 dark:from-white dark:via-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
              The SSaDa
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-normal max-w-lg mx-auto tracking-tight">
            국내와 해외 최저가를 한눈에. 어디가 가장 싸고 얼마를 아끼는지 분석합니다.
          </p>
        </div>

        {/* The Search Bar */}
        <div className="w-full">
          <SearchBar
            query={query}
            onChangeQuery={setQuery}
            onSearch={handleSearch}
            recentSearches={recentSearches}
            onRemoveRecent={handleRemoveRecent}
            onClearRecent={handleClearRecent}
            selectedPlatformCount={selectedPlatforms.length}
          />
        </div>

        {/* The 3 Central Buttons / Selectors */}
        <div className="w-full max-w-2xl mx-auto mt-6">
          {/* Header Row above the 3 buttons: Platform Selection Status & Select All */}
          <div className="flex items-center justify-between px-1 mb-2.5 text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                검색 및 최저가 비교 대상
              </span>
              <span>({selectedPlatforms.length}/3개 선택됨)</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Naver Mode Toggle */}
              <button
                type="button"
                onClick={() => setNaverMode(naverMode === 'shopping' ? 'portal' : 'shopping')}
                className="text-[11px] hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                title="네이버 쇼핑(최저가) 또는 네이버 통합검색으로 전환"
              >
                <Settings2 className="w-3 h-3" />
                <span>네이버: {naverMode === 'shopping' ? '쇼핑 최저가' : '통합검색'}</span>
              </button>

              <span className="text-neutral-300 dark:text-neutral-700">|</span>

              {/* Select All Toggle */}
              <button
                type="button"
                onClick={handleToggleAllPlatforms}
                className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {allSelected ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>선택 해제</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>모두 선택</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Exactly 3 Buttons: 아마존, 아마존 제팬, 네이버 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {PLATFORMS.map((platform) => (
              <PlatformToggleCard
                key={platform.id}
                platform={platform}
                isSelected={selectedPlatforms.includes(platform.id)}
                onToggle={handleTogglePlatform}
              />
            ))}
          </div>

          {/* Multi-tab Popup Tip Bar */}
          <div className="mt-3.5 px-3 py-2 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5 truncate">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">
                새 탭 오픈 + The SSaDa 탭에서 최저가 & 절약 금액 즉시 분석
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPopupGuideOpen(true)}
              className="text-[11px] text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white underline shrink-0 cursor-pointer ml-2"
            >
              팝업 설정 가이드
            </button>
          </div>

          {/* Search Trigger Buttons (Google style + Apple elegance) */}
          <div className="flex items-center justify-center gap-3 mt-5 sm:mt-6">
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={!query.trim() || selectedPlatforms.length === 0}
              className={`px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                query.trim() && selectedPlatforms.length > 0
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:scale-102 active:scale-98 shadow-sm hover:shadow'
                  : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600 border border-neutral-200/60 dark:border-neutral-800 cursor-not-allowed opacity-70'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>The SSaDa 검색 ({selectedPlatforms.length}개 탭 + 최저가 분석)</span>
            </button>

            <button
              type="button"
              onClick={handleFeelingLucky}
              className="px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100/80 dark:bg-neutral-900/80 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-102 active:scale-98"
            >
              <Dices className="w-3.5 h-3.5 text-neutral-500" />
              <span>행운의 최저가 검색</span>
            </button>
          </div>
        </div>

        {/* Feature 1: The SSaDa Lowest Price & Savings Analysis (As requested!) */}
        {priceSummary && (
          <PriceComparisonCard
            summary={priceSummary}
            onUpdatePrice={handleUpdatePrice}
            onReopenAll={handleReopenAll}
          />
        )}

        {/* Feature 2: Results Drawer / Safety Direct Links */}
        <SearchResultDrawer
          lastQuery={lastExecutedQuery}
          selectedPlatformIds={selectedPlatforms}
          platforms={PLATFORMS}
          naverMode={naverMode}
          onReopenAll={handleReopenAll}
          onOpenGuide={() => setIsPopupGuideOpen(true)}
          onClose={() => setLastExecutedQuery('')}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenRates={() => setIsRatesModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Modals */}
      <ExchangeRateModal
        isOpen={isRatesModalOpen}
        onClose={() => setIsRatesModalOpen(false)}
        rates={exchangeRates}
        onUpdateRates={setExchangeRates}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <PopupGuideModal
        isOpen={isPopupGuideOpen}
        onClose={() => setIsPopupGuideOpen(false)}
      />
    </div>
  );
}
