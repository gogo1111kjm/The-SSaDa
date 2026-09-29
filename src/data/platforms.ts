import { PlatformConfig } from '../types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'amazon',
    name: 'Amazon US',
    nameKo: '아마존',
    badge: 'US',
    domain: 'amazon.com',
    currency: 'USD',
    currencySymbol: '$',
    description: '미국 아마존 글로벌 직배송 · $200 목록통관',
    buildSearchUrl: (query: string) => `https://www.amazon.com/s?k=${encodeURIComponent(query.trim())}`,
    color: '#FF9900',
    activeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    shortcutKey: '1',
  },
  {
    id: 'amazon_jp',
    name: 'Amazon Japan',
    nameKo: '아마존 재팬',
    badge: 'JP',
    domain: 'amazon.co.jp',
    currency: 'JPY',
    currencySymbol: '¥',
    description: '일본 아마존 직구 · $150 관세한도 · 엔저 혜택',
    buildSearchUrl: (query: string) => `https://www.amazon.co.jp/s?k=${encodeURIComponent(query.trim())}`,
    color: '#FF9900',
    activeColor: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
    shortcutKey: '2',
  },
  {
    id: 'naver',
    name: 'Naver Shopping',
    nameKo: '네이버',
    badge: 'KR',
    domain: 'shopping.naver.com',
    currency: 'KRW',
    currencySymbol: '₩',
    description: '네이버 쇼핑 최저가 비교 · 국내 빠른 배송 & NPay',
    buildSearchUrl: (query: string, options) => {
      const trimmed = encodeURIComponent(query.trim());
      if (options?.naverMode === 'portal') {
        return `https://search.naver.com/search.naver?query=${trimmed}`;
      }
      return `https://search.shopping.naver.com/search/all?query=${trimmed}`;
    },
    color: '#03C75A',
    activeColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    shortcutKey: '3',
  },
];
