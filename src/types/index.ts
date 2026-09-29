export type PlatformId = 'amazon' | 'amazon_jp' | 'naver';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  nameKo: string;
  badge: string;
  domain: string;
  currency: string;
  currencySymbol: string;
  description: string;
  buildSearchUrl: (query: string, options?: { naverMode?: 'shopping' | 'portal' }) => string;
  color: string;
  activeColor: string;
  shortcutKey: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  platforms: PlatformId[];
}

export interface ExchangeRates {
  usdToKrw: number;
  jpyToKrw: number; // KRW per 100 JPY
  updatedAt: string;
}
