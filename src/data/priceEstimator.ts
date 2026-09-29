import { PlatformId, ExchangeRates } from '../types';

export interface PlatformPriceResult {
  platformId: PlatformId;
  platformName: string;
  originalPrice: number;
  currency: string;
  currencySymbol: string;
  krwPrice: number;
  shippingKrw: number;
  totalKrw: number;
  dutyFreeStatus: 'duty_free' | 'tax_applicable' | 'domestic';
  dutyFreeText: string;
  productTitle: string;
  searchUrl: string;
  isLowest: boolean;
}

export interface PriceComparisonSummary {
  query: string;
  results: PlatformPriceResult[];
  lowestResult: PlatformPriceResult;
  highestResult: PlatformPriceResult;
  savingsKrw: number;
  savingsPercentage: number;
  insight: string;
  calculatedAt: number;
}

// Preset database of popular cross-border shopping products
interface ProductPreset {
  keywords: string[];
  title: string;
  baseUsd: number;
  baseJpy: number;
  baseKrw: number;
  usdShipping?: number;
  jpyShipping?: number;
  krwShipping?: number;
}

const PRESET_PRODUCTS: ProductPreset[] = [
  {
    keywords: ['에어팟', '에어팟 프로', 'airpods', 'airpods pro'],
    title: 'Apple AirPods Pro 2세대 (USB-C MagSafe)',
    baseUsd: 189,
    baseJpy: 31000,
    baseKrw: 329000,
    usdShipping: 0,
    jpyShipping: 800,
    krwShipping: 0,
  },
  {
    keywords: ['에어팟 맥스', 'airpods max'],
    title: 'Apple AirPods Max 무선 헤드폰',
    baseUsd: 449,
    baseJpy: 74800,
    baseKrw: 729000,
    usdShipping: 15,
    jpyShipping: 1200,
    krwShipping: 0,
  },
  {
    keywords: ['소니 헤드폰', '소니 xm5', 'wh-1000xm5', 'sony xm5'],
    title: '소니 WH-1000XM5 프리미엄 노이즈 캔슬링 헤드폰',
    baseUsd: 328,
    baseJpy: 45000,
    baseKrw: 449000,
    usdShipping: 10,
    jpyShipping: 1000,
    krwShipping: 0,
  },
  {
    keywords: ['아이패드', '아이패드 에어', 'ipad air', 'ipad air m2'],
    title: 'Apple 11인치 iPad Air M2 128GB Wi-Fi',
    baseUsd: 549,
    baseJpy: 89800,
    baseKrw: 899000,
    usdShipping: 15,
    jpyShipping: 1500,
    krwShipping: 0,
  },
  {
    keywords: ['아이패드 미니', 'ipad mini'],
    title: 'Apple iPad mini 7세대 Wi-Fi',
    baseUsd: 469,
    baseJpy: 76800,
    baseKrw: 749000,
    usdShipping: 12,
    jpyShipping: 1200,
    krwShipping: 0,
  },
  {
    keywords: ['닌텐도 스위치', '스위치 oled', 'nintendo switch'],
    title: '닌텐도 스위치 OLED 모델 본체',
    baseUsd: 339,
    baseJpy: 37980,
    baseKrw: 415000,
    usdShipping: 20,
    jpyShipping: 1500,
    krwShipping: 3000,
  },
  {
    keywords: ['맥북 에어', 'macbook air', '맥북 에어 m3'],
    title: 'Apple MacBook Air 13인치 M3 (8GB / 256GB)',
    baseUsd: 899,
    baseJpy: 148800,
    baseKrw: 1590000,
    usdShipping: 25,
    jpyShipping: 2000,
    krwShipping: 0,
  },
  {
    keywords: ['다이슨 에어랩', '다이슨', 'dyson airwrap'],
    title: '다이슨 에어랩 멀티 스타일러 앤 드라이어',
    baseUsd: 549,
    baseJpy: 68000,
    baseKrw: 749000,
    usdShipping: 25,
    jpyShipping: 2000,
    krwShipping: 0,
  },
  {
    keywords: ['킨들', '킨들 페이퍼화이트', 'kindle paperwhite'],
    title: 'Amazon Kindle Paperwhite (16GB) 방수 전자책 리더기',
    baseUsd: 139,
    baseJpy: 24980,
    baseKrw: 245000,
    usdShipping: 10,
    jpyShipping: 800,
    krwShipping: 3000,
  },
  {
    keywords: ['플레이스테이션 5', 'ps5', '플레이스테이션 5 프로'],
    title: '소니 플레이스테이션 5 Slim 디스크 에디션',
    baseUsd: 499,
    baseJpy: 72980,
    baseKrw: 748000,
    usdShipping: 30,
    jpyShipping: 2500,
    krwShipping: 3000,
  },
  {
    keywords: ['산토리 위스키', '가쿠빈', 'suntory whisky'],
    title: '산토리 가쿠빈 위스키 700ml',
    baseUsd: 35,
    baseJpy: 1980,
    baseKrw: 39800,
    usdShipping: 20,
    jpyShipping: 1500,
    krwShipping: 4000,
  },
  {
    keywords: ['로지텍', 'mx master 3s', '로지텍 마우스'],
    title: '로지텍 MX Master 3S 최고급 무선 무소음 마우스',
    baseUsd: 99,
    baseJpy: 15800,
    baseKrw: 149000,
    usdShipping: 8,
    jpyShipping: 700,
    krwShipping: 2500,
  },
];

// Hash function to generate deterministic realistic prices for any unknown query
function hashQuery(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function estimatePricesForQuery(
  query: string,
  exchangeRates: ExchangeRates,
  selectedPlatformIds: PlatformId[]
): PriceComparisonSummary {
  const cleanQuery = query.trim().toLowerCase();

  // 1. Check if matches any preset
  const matchedPreset = PRESET_PRODUCTS.find((preset) =>
    preset.keywords.some((kw) => cleanQuery.includes(kw.toLowerCase()) || kw.toLowerCase().includes(cleanQuery))
  );

  let usdPrice: number;
  let jpyPrice: number;
  let krwPrice: number;
  let productTitle: string;

  if (matchedPreset) {
    usdPrice = matchedPreset.baseUsd;
    jpyPrice = matchedPreset.baseJpy;
    krwPrice = matchedPreset.baseKrw;
    productTitle = matchedPreset.title;
  } else {
    // Generate realistic pricing based on query hash
    const seed = hashQuery(cleanQuery);
    // Base KRW price between 35,000 KRW and 480,000 KRW
    const baseKrwVal = 35000 + (seed % 450) * 1000;
    krwPrice = Math.round(baseKrwVal / 1000) * 1000;

    // Amazon US price with slight random variance (-15% to +10%)
    const usdVariance = 0.85 + ((seed % 25) / 100);
    usdPrice = Math.round((krwPrice / exchangeRates.usdToKrw) * usdVariance);
    if (usdPrice < 15) usdPrice = 19;

    // Amazon JP price with slight random variance (-20% to +5%)
    const jpyVariance = 0.82 + ((seed % 30) / 100);
    jpyPrice = Math.round(((krwPrice / exchangeRates.jpyToKrw) * 100) * jpyVariance / 100) * 100;
    if (jpyPrice < 2000) jpyPrice = 2500;

    productTitle = `${query.trim()} (가격비교 기준 규격)`;
  }

  // Calculate KRW conversions & customs
  const results: PlatformPriceResult[] = [];

  // Amazon US
  if (selectedPlatformIds.includes('amazon')) {
    const rawKrw = Math.round(usdPrice * exchangeRates.usdToKrw);
    // Shipping: ~$10 or free if preset specified
    const shippingKrw = matchedPreset?.usdShipping !== undefined ? Math.round(matchedPreset.usdShipping * exchangeRates.usdToKrw) : 12000;
    // Duty-free check: US list clearance is $200
    const isDutyFree = usdPrice <= 200;
    const dutyText = isDutyFree ? '목록통관 면세 ($200 이하)' : '관부가세 부과 대상 ($200 초과)';
    const totalKrw = rawKrw + shippingKrw;

    results.push({
      platformId: 'amazon',
      platformName: '아마존 (US)',
      originalPrice: usdPrice,
      currency: 'USD',
      currencySymbol: '$',
      krwPrice: rawKrw,
      shippingKrw,
      totalKrw,
      dutyFreeStatus: isDutyFree ? 'duty_free' : 'tax_applicable',
      dutyFreeText: dutyText,
      productTitle,
      searchUrl: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
      isLowest: false,
    });
  }

  // Amazon JP
  if (selectedPlatformIds.includes('amazon_jp')) {
    const rawKrw = Math.round((jpyPrice / 100) * exchangeRates.jpyToKrw);
    // Shipping: ~¥1000 or preset
    const jpyShipVal = matchedPreset?.jpyShipping !== undefined ? matchedPreset.jpyShipping : 1200;
    const shippingKrw = Math.round((jpyShipVal / 100) * exchangeRates.jpyToKrw);
    // Duty-free check: Japan clearance is $150 USD equivalent
    const usdEquiv = exchangeRates.usdToKrw > 0 ? rawKrw / exchangeRates.usdToKrw : 0;
    const isDutyFree = usdEquiv <= 150;
    const dutyText = isDutyFree ? '면세 범위 ($150 이하)' : '관부가세 부과 대상 ($150 초과)';
    const totalKrw = rawKrw + shippingKrw;

    results.push({
      platformId: 'amazon_jp',
      platformName: '아마존 재팬 (JP)',
      originalPrice: jpyPrice,
      currency: 'JPY',
      currencySymbol: '¥',
      krwPrice: rawKrw,
      shippingKrw,
      totalKrw,
      dutyFreeStatus: isDutyFree ? 'duty_free' : 'tax_applicable',
      dutyFreeText: dutyText,
      productTitle,
      searchUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}`,
      isLowest: false,
    });
  }

  // Naver
  if (selectedPlatformIds.includes('naver')) {
    const rawKrw = krwPrice;
    const shippingKrw = matchedPreset?.krwShipping !== undefined ? matchedPreset.krwShipping : 0;
    const totalKrw = rawKrw + shippingKrw;

    results.push({
      platformId: 'naver',
      platformName: '네이버 쇼핑 (KR)',
      originalPrice: rawKrw,
      currency: 'KRW',
      currencySymbol: '₩',
      krwPrice: rawKrw,
      shippingKrw,
      totalKrw,
      dutyFreeStatus: 'domestic',
      dutyFreeText: '국내 배송 (관세 없음)',
      productTitle,
      searchUrl: `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`,
      isLowest: false,
    });
  }

  // If no platforms selected, return empty
  if (results.length === 0) {
    const fallback: PlatformPriceResult = {
      platformId: 'naver',
      platformName: '네이버 쇼핑',
      originalPrice: 0,
      currency: 'KRW',
      currencySymbol: '₩',
      krwPrice: 0,
      shippingKrw: 0,
      totalKrw: 0,
      dutyFreeStatus: 'domestic',
      dutyFreeText: '',
      productTitle: query,
      searchUrl: '',
      isLowest: true,
    };
    return {
      query,
      results: [],
      lowestResult: fallback,
      highestResult: fallback,
      savingsKrw: 0,
      savingsPercentage: 0,
      insight: '',
      calculatedAt: Date.now(),
    };
  }

  // Sort by total KRW price ascending
  results.sort((a, b) => a.totalKrw - b.totalKrw);
  results[0].isLowest = true;

  const lowestResult = results[0];
  const highestResult = results[results.length - 1];
  const savingsKrw = Math.max(0, highestResult.totalKrw - lowestResult.totalKrw);
  const savingsPercentage = highestResult.totalKrw > 0
    ? Math.round((savingsKrw / highestResult.totalKrw) * 100)
    : 0;

  // Generate actionable insight
  let insight = '';
  if (savingsKrw > 0) {
    if (lowestResult.platformId === 'amazon_jp') {
      insight = `현재 엔저 환율(¥100 ≈ ₩${exchangeRates.jpyToKrw.toLocaleString()})의 영향으로 일본 아마존 직구가 가장 유리합니다. ${highestResult.platformName} 대비 약 ₩${savingsKrw.toLocaleString()}원(${savingsPercentage}%)을 아낄 수 있습니다.`;
    } else if (lowestResult.platformId === 'amazon') {
      insight = `미국 아마존 직구 할인가가 가장 저렴합니다. $200 이하 면세 혜택이 적용되어 ${highestResult.platformName} 대비 ₩${savingsKrw.toLocaleString()}원(${savingsPercentage}%) 절약됩니다.`;
    } else {
      insight = `국내 네이버 쇼핑 최저가가 해외 직구 가격 및 국제 배송비를 고려했을 때 가장 합리적입니다. 통관 절차 없이 빠른 국내 배송을 이용할 수 있습니다.`;
    }
  } else {
    insight = `비교된 사이트들의 예상 구매 가격이 비슷합니다. 배송 기간과 A/S 정책을 고려하여 선택하세요.`;
  }

  return {
    query,
    results,
    lowestResult,
    highestResult,
    savingsKrw,
    savingsPercentage,
    insight,
    calculatedAt: Date.now(),
  };
}
